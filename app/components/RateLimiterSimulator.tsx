"use client";

import { useReducer, useEffect, useCallback, useRef, useState, useMemo } from "react";
import type { RateLimitStrategy, TrafficPattern, SimulatedRequest } from "@/app/lib/types";

type LogEntry = { time: string; message: string; type: "info" | "success" | "error" | "warn" };

interface RateLimiterState {
  strategy: RateLimitStrategy;
  maxRequests: number;
  windowSizeMs: number;
  burstCapacity: number;
  fixedWindowCount: number;
  isRunning: boolean;
  requests: SimulatedRequest[];
  pattern: TrafficPattern;
  tokens: number;
  windowStart: number;
  requestHistory: number[];
  totalRequests: number;
  allowedRequests: number;
  blockedRequests: number;
  avgResponseTime: number;
  logs: LogEntry[];
  lastRequestTime: number;
}

const WINDOW_SIZE_MS = 60000; // 1 minute
const MAX_REQUESTS = 100;
const BURST_CAPACITY = 15;

interface SimulationPreset {
  id: string;
  label: string;
  description: string;
  strategy: RateLimitStrategy;
  pattern: TrafficPattern;
  maxRequests: number;
  windowSizeMs: number;
  burstCapacity: number;
}

const SIMULATION_PRESETS: readonly SimulationPreset[] = [
  {
    id: "public-api-steady",
    label: "Public API",
    description: "Balanced traffic for public endpoints.",
    strategy: "token-bucket",
    pattern: "normal",
    maxRequests: 120,
    windowSizeMs: 60000,
    burstCapacity: 20,
  },
  {
    id: "partner-batch-burst",
    label: "Partner Burst",
    description: "Legitimate burst traffic from integrations.",
    strategy: "token-bucket",
    pattern: "burst",
    maxRequests: 180,
    windowSizeMs: 60000,
    burstCapacity: 35,
  },
  {
    id: "internal-services",
    label: "Internal Services",
    description: "Simple fixed-window controls for trusted services.",
    strategy: "fixed-window",
    pattern: "normal",
    maxRequests: 90,
    windowSizeMs: 60000,
    burstCapacity: 15,
  },
  {
    id: "ddos-defense",
    label: "DDoS Defense",
    description: "Strict controls under sustained attack.",
    strategy: "sliding-window",
    pattern: "ddos",
    maxRequests: 70,
    windowSizeMs: 60000,
    burstCapacity: 15,
  },
];

function createInitialState(): RateLimiterState {
  const now = Date.now();

  return {
    strategy: "token-bucket",
    maxRequests: MAX_REQUESTS,
    windowSizeMs: WINDOW_SIZE_MS,
    burstCapacity: BURST_CAPACITY,
    fixedWindowCount: 0,
    isRunning: false,
    requests: [],
    pattern: "normal",
    tokens: BURST_CAPACITY,
    windowStart: now,
    requestHistory: [],
    totalRequests: 0,
    allowedRequests: 0,
    blockedRequests: 0,
    avgResponseTime: 0,
    logs: [{ time: new Date(now).toLocaleTimeString(), message: "Rate Limiter initialized. Ready to simulate.", type: "info" }],
    lastRequestTime: now,
  };
}

const initialState: RateLimiterState = createInitialState();

type Action =
  | { type: "SET_STRATEGY"; payload: RateLimitStrategy }
  | { type: "SET_PATTERN"; payload: TrafficPattern }
  | { type: "SET_MAX_REQUESTS"; payload: number }
  | { type: "SET_WINDOW_SIZE"; payload: number }
  | { type: "SET_BURST_CAPACITY"; payload: number }
  | { type: "SET_FIXED_WINDOW_COUNT"; payload: number }
  | { type: "APPLY_PRESET"; payload: SimulationPreset }
  | { type: "START_SIMULATION" }
  | { type: "STOP_SIMULATION" }
  | { type: "RESET" }
  | { type: "ADD_REQUEST"; payload: SimulatedRequest }
  | { type: "UPDATE_TOKENS"; payload: number }
  | { type: "UPDATE_WINDOW_START"; payload: number }
  | { type: "UPDATE_HISTORY"; payload: number[] }
  | { type: "ADD_LOG"; message: string; logType?: "info" | "success" | "error" | "warn" }
  | { type: "CLEANUP_OLD_REQUESTS" };

function reducer(state: RateLimiterState, action: Action): RateLimiterState {
  switch (action.type) {
    case "SET_STRATEGY":
      return {
        ...state,
        strategy: action.payload,
        tokens: state.burstCapacity,
        requestHistory: [],
        fixedWindowCount: 0,
        windowStart: Date.now(),
      };
    case "SET_PATTERN":
      return { ...state, pattern: action.payload };
    case "SET_MAX_REQUESTS":
      return { ...state, maxRequests: action.payload };
    case "SET_WINDOW_SIZE":
      return { ...state, windowSizeMs: action.payload };
    case "SET_BURST_CAPACITY":
      return { ...state, burstCapacity: action.payload, tokens: Math.min(state.tokens, action.payload) };
    case "SET_FIXED_WINDOW_COUNT":
      return { ...state, fixedWindowCount: action.payload };
    case "APPLY_PRESET": {
      const now = Date.now();
      const preset = action.payload;
      return {
        ...state,
        strategy: preset.strategy,
        pattern: preset.pattern,
        maxRequests: preset.maxRequests,
        windowSizeMs: preset.windowSizeMs,
        burstCapacity: preset.burstCapacity,
        tokens: preset.burstCapacity,
        fixedWindowCount: 0,
        isRunning: false,
        requests: [],
        requestHistory: [],
        totalRequests: 0,
        allowedRequests: 0,
        blockedRequests: 0,
        avgResponseTime: 0,
        windowStart: now,
        lastRequestTime: now,
      };
    }
    case "START_SIMULATION":
      return { ...state, isRunning: true };
    case "STOP_SIMULATION":
      return { ...state, isRunning: false };
    case "RESET": {
      const resetState = createInitialState();
      return {
        ...resetState,
        strategy: state.strategy,
        maxRequests: state.maxRequests,
        windowSizeMs: state.windowSizeMs,
        burstCapacity: state.burstCapacity,
        tokens: state.burstCapacity,
        pattern: state.pattern,
        logs: [{ time: new Date().toLocaleTimeString(), message: "Simulation reset. Ready to simulate.", type: "info" }],
      };
    }
    case "ADD_REQUEST": {
      const newRequest = action.payload;
      const updatedRequests = [newRequest, ...state.requests].slice(0, 50);
      const totalTime = state.avgResponseTime * state.totalRequests + (newRequest.responseTime || 0);
      const newAvgTime = state.totalRequests > 0 ? totalTime / (state.totalRequests + 1) : newRequest.responseTime || 0;
      
      return {
        ...state,
        requests: updatedRequests,
        totalRequests: state.totalRequests + 1,
        allowedRequests: newRequest.status === "allowed" ? state.allowedRequests + 1 : state.allowedRequests,
        blockedRequests: newRequest.status === "blocked" ? state.blockedRequests + 1 : state.blockedRequests,
        avgResponseTime: Math.round(newAvgTime),
        lastRequestTime: Date.now(),
      };
    }
    case "UPDATE_TOKENS":
      return { ...state, tokens: action.payload };
    case "UPDATE_WINDOW_START":
      return { ...state, windowStart: action.payload };
    case "UPDATE_HISTORY":
      return { ...state, requestHistory: action.payload };
    case "ADD_LOG":
      return {
        ...state,
        logs: [...state.logs.slice(-49), { time: new Date().toLocaleTimeString(), message: action.message, type: action.logType || "info" }],
      };
    case "CLEANUP_OLD_REQUESTS": {
      const cutoff = Date.now() - state.windowSizeMs;
      return {
        ...state,
        requestHistory: state.requestHistory.filter(ts => ts > cutoff),
      };
    }
    default:
      return state;
  }
}

// Token Bucket Algorithm
function checkTokenBucket(tokens: number): { allowed: boolean; newTokens: number } {
  if (tokens >= 1) {
    return { allowed: true, newTokens: tokens - 1 };
  }
  return { allowed: false, newTokens: tokens };
}

// Fixed Window Algorithm
function checkFixedWindow(windowStart: number, windowSizeMs: number, requestCount: number, maxRequests: number): { allowed: boolean; newWindowStart: number; newCount: number } {
  const now = Date.now();
  const windowEnd = windowStart + windowSizeMs;
  
  if (now > windowEnd) {
    // New window
    return { allowed: true, newWindowStart: now, newCount: 1 };
  }
  
  if (requestCount < maxRequests) {
    return { allowed: true, newWindowStart: windowStart, newCount: requestCount + 1 };
  }
  
  return { allowed: false, newWindowStart: windowStart, newCount: requestCount };
}

// Sliding Window Algorithm
function checkSlidingWindow(requestHistory: number[], windowSizeMs: number, maxRequests: number): { allowed: boolean; newHistory: number[] } {
  const now = Date.now();
  const cutoff = now - windowSizeMs;
  const recentRequests = requestHistory.filter(ts => ts > cutoff);
  
  if (recentRequests.length < maxRequests) {
    return { allowed: true, newHistory: [...recentRequests, now] };
  }
  
  return { allowed: false, newHistory: recentRequests };
}

export default function RateLimiterSimulator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tokenRefillRef = useRef<NodeJS.Timeout | null>(null);

  // Update current time every second for visualizations
  useEffect(() => {
    const timeUpdate = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timeUpdate);
  }, []);

  const addLog = useCallback((message: string, logType?: "info" | "success" | "error" | "warn") => {
    dispatch({ type: "ADD_LOG", message, logType });
  }, []);

  // Generate requests based on traffic pattern
  const generateRequest = useCallback((): SimulatedRequest => {
    const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const clientId = `client_${Math.floor(Math.random() * 5) + 1}`;
    
    return {
      id,
      timestamp: Date.now(),
      status: "pending",
      clientId,
      responseTime: Math.floor(Math.random() * 50) + 20,
    };
  }, []);

  // Process a single request through the rate limiter
  const processRequest = useCallback((request: SimulatedRequest) => {
    const now = Date.now();
    let allowed = false;
    let headers: SimulatedRequest["headers"];

    switch (state.strategy) {
      case "token-bucket": {
        const result = checkTokenBucket(state.tokens);
        allowed = result.allowed;
        dispatch({ type: "UPDATE_TOKENS", payload: result.newTokens });
        headers = {
          "X-RateLimit-Limit": state.burstCapacity,
          "X-RateLimit-Remaining": Math.max(0, result.newTokens),
          "X-RateLimit-Reset": Math.floor((now + 60000) / 1000),
        };
        if (!allowed) {
          headers["Retry-After"] = 6;
        }
        break;
      }
      case "fixed-window": {
        const result = checkFixedWindow(state.windowStart, state.windowSizeMs, state.fixedWindowCount, state.maxRequests);
        allowed = result.allowed;
        const effectiveWindowStart = result.newWindowStart;
        if (result.newWindowStart !== state.windowStart) {
          dispatch({ type: "UPDATE_WINDOW_START", payload: result.newWindowStart });
        }
        dispatch({ type: "SET_FIXED_WINDOW_COUNT", payload: result.newCount });
        const windowEnd = Math.floor((effectiveWindowStart + state.windowSizeMs) / 1000);
        headers = {
          "X-RateLimit-Limit": state.maxRequests,
          "X-RateLimit-Remaining": Math.max(0, state.maxRequests - result.newCount),
          "X-RateLimit-Reset": windowEnd,
        };
        if (!allowed) {
          headers["Retry-After"] = Math.ceil((effectiveWindowStart + state.windowSizeMs - now) / 1000);
        }
        break;
      }
      case "sliding-window": {
        const result = checkSlidingWindow(state.requestHistory, state.windowSizeMs, state.maxRequests);
        allowed = result.allowed;
        dispatch({ type: "UPDATE_HISTORY", payload: result.newHistory });
        const oldestRequest = result.newHistory[0] || now;
        headers = {
          "X-RateLimit-Limit": state.maxRequests,
          "X-RateLimit-Remaining": Math.max(0, state.maxRequests - result.newHistory.length),
          "X-RateLimit-Reset": Math.floor((oldestRequest + state.windowSizeMs) / 1000),
        };
        if (!allowed && result.newHistory.length > 0) {
          headers["Retry-After"] = Math.ceil((result.newHistory[0] + state.windowSizeMs - now) / 1000);
        }
        break;
      }
    }

    const processedRequest: SimulatedRequest = {
      ...request,
      status: allowed ? "allowed" : "blocked",
      headers,
    };

    dispatch({ type: "ADD_REQUEST", payload: processedRequest });

    if (allowed) {
      addLog(`✓ Request ${request.id.slice(-8)} allowed (${state.strategy})`, "success");
    } else {
      addLog(`✗ Request ${request.id.slice(-8)} blocked - 429 Too Many Requests`, "error");
    }
  }, [state.strategy, state.tokens, state.burstCapacity, state.windowStart, state.windowSizeMs, state.maxRequests, state.requestHistory, state.fixedWindowCount, addLog]);

  // Traffic pattern intervals
  const getPatternInterval = useCallback((pattern: TrafficPattern): number => {
    switch (pattern) {
      case "normal":
        return 1000; // 1 request per second
      case "burst":
        return 100; // 10 requests per second
      case "ddos":
        return 50; // 20 requests per second
      case "spike":
        // Random between 100ms and 2000ms
        return Math.floor(Math.random() * 1900) + 100;
      default:
        return 1000;
    }
  }, []);

  // Start/stop simulation
  useEffect(() => {
    if (state.isRunning) {
      const runSimulation = () => {
        const request = generateRequest();
        processRequest(request);
        
        // Schedule next request based on pattern
        const interval = getPatternInterval(state.pattern);
        intervalRef.current = setTimeout(runSimulation, interval);
      };

      runSimulation();
    } else {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [state.isRunning, state.pattern, generateRequest, processRequest, getPatternInterval]);

  // Token refill for token bucket
  useEffect(() => {
    if (state.strategy === "token-bucket" && state.tokens < state.burstCapacity) {
      const refillRate = state.windowSizeMs / state.maxRequests;
      tokenRefillRef.current = setInterval(() => {
        dispatch({ type: "UPDATE_TOKENS", payload: Math.min(state.burstCapacity, state.tokens + 1) });
      }, refillRate);

      return () => {
        if (tokenRefillRef.current) {
          clearInterval(tokenRefillRef.current);
        }
      };
    }
  }, [state.strategy, state.tokens, state.burstCapacity, state.maxRequests, state.windowSizeMs]);

  // Cleanup old requests periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      dispatch({ type: "CLEANUP_OLD_REQUESTS" });
    }, 5000);

    return () => clearInterval(cleanup);
  }, []);

  const getStrategyDescription = (strategy: RateLimitStrategy): string => {
    switch (strategy) {
      case "token-bucket":
        return "Tokens refill over time. Allows bursts up to bucket capacity. Best for APIs that need burst handling.";
      case "fixed-window":
        return "Simple counter resets at fixed intervals. Easy to implement but has thundering herd problem at window edges.";
      case "sliding-window":
        return "Tracks exact timestamps. Most accurate but memory intensive. Best for strict rate limiting.";
      default:
        return "";
    }
  };

  const getPatternDescription = (pattern: TrafficPattern): string => {
    switch (pattern) {
      case "normal":
        return "Steady 1 req/sec - typical production traffic";
      case "burst":
        return "10 req/sec burst - legitimate batch processing";
      case "ddos":
        return "20 req/sec sustained - attack simulation";
      case "spike":
        return "Random intervals - unpredictable traffic";
      default:
        return "";
    }
  };

  const fixedWindowSecondsRemaining = Math.max(
    0,
    Math.ceil((state.windowStart + state.windowSizeMs - currentTime) / 1000),
  );

  const slidingWindowSecondsRemaining = state.requestHistory.length > 0
    ? Math.max(0, Math.ceil((state.requestHistory[0] + state.windowSizeMs - currentTime) / 1000))
    : 0;

  const clientStats = useMemo(() => {
    const stats = new Map<string, { allowed: number; blocked: number }>();

    for (const request of state.requests) {
      const current = stats.get(request.clientId) ?? { allowed: 0, blocked: 0 };
      if (request.status === "allowed") current.allowed += 1;
      if (request.status === "blocked") current.blocked += 1;
      stats.set(request.clientId, current);
    }

    return Array.from(stats.entries())
      .map(([clientId, counts]) => ({
        clientId,
        allowed: counts.allowed,
        blocked: counts.blocked,
        total: counts.allowed + counts.blocked,
      }))
      .sort((a, b) => b.total - a.total);
  }, [state.requests]);

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      {/* Control Panel */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-surface-secondary/20 border border-border-subtle rounded-2xl p-6">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Configuration
          </h3>

          {/* Strategy Selector */}
          <div className="space-y-2 mb-6">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Rate Limiting Strategy</label>
            <select
              value={state.strategy}
              onChange={(e) => dispatch({ type: "SET_STRATEGY", payload: e.target.value as RateLimitStrategy })}
              disabled={state.isRunning}
              className="w-full bg-surface border border-border-strong rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
            >
              <option value="token-bucket">Token Bucket</option>
              <option value="fixed-window">Fixed Window</option>
              <option value="sliding-window">Sliding Window</option>
            </select>
            <p className="text-xs text-text-muted leading-relaxed">{getStrategyDescription(state.strategy)}</p>
          </div>

          {/* Pattern Selector */}
          <div className="space-y-2 mb-6">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Traffic Pattern</label>
            <div className="grid grid-cols-2 gap-2">
              {(["normal", "burst", "ddos", "spike"] as TrafficPattern[]).map((pattern) => (
                <button
                  key={pattern}
                  onClick={() => dispatch({ type: "SET_PATTERN", payload: pattern })}
                  disabled={state.isRunning}
                  className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                    state.pattern === pattern
                      ? "bg-primary text-text-inverse"
                      : "bg-surface border border-border-strong text-text-secondary hover:border-primary/50"
                  } disabled:opacity-50`}
                >
                  {pattern}
                </button>
              ))}
            </div>
            <p className="text-xs text-text-muted">{getPatternDescription(state.pattern)}</p>
          </div>

          <div className="space-y-2 mb-6">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Scenario Presets</label>
            <div className="grid grid-cols-1 gap-2">
              {SIMULATION_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    dispatch({ type: "APPLY_PRESET", payload: preset });
                    addLog(`Preset loaded: ${preset.label}`, "info");
                  }}
                  disabled={state.isRunning}
                  className="text-left rounded-xl border border-[var(--sem-interactive-border)] bg-[var(--sem-interactive-bg)] px-3 py-2.5 hover:border-[var(--sem-interactive-border-hover)] hover:bg-[var(--sem-interactive-bg-hover)] transition-colors disabled:opacity-50"
                >
                  <p className="text-xs font-semibold text-text-primary">{preset.label}</p>
                  <p className="text-[11px] text-text-muted leading-relaxed">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex justify-between">
                Max Requests
                <span className="text-primary">{state.maxRequests}/min</span>
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={state.maxRequests}
                onChange={(e) => dispatch({ type: "SET_MAX_REQUESTS", payload: parseInt(e.target.value) })}
                disabled={state.isRunning}
                className="w-full mt-2 accent-primary"
              />
            </div>

            {state.strategy === "token-bucket" && (
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex justify-between">
                  Burst Capacity
                  <span className="text-primary">{state.burstCapacity}</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={state.burstCapacity}
                  onChange={(e) => dispatch({ type: "SET_BURST_CAPACITY", payload: parseInt(e.target.value) })}
                  disabled={state.isRunning}
                  className="w-full mt-2 accent-primary"
                />
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2">
            {!state.isRunning ? (
              <button
                onClick={() => {
                  dispatch({ type: "START_SIMULATION" });
                  addLog(`Started simulation with ${state.strategy} strategy`, "info");
                }}
                className="flex-1 bg-primary text-text-inverse h-12 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Start
              </button>
            ) : (
              <button
                onClick={() => {
                  dispatch({ type: "STOP_SIMULATION" });
                  addLog("Simulation paused", "warn");
                }}
                className="flex-1 bg-yellow-500 text-text-inverse h-12 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                Pause
              </button>
            )}
            <button
              onClick={() => {
                dispatch({ type: "RESET" });
              }}
              className="px-4 border border-border-strong h-12 rounded-xl font-bold text-text-secondary hover:bg-surface-secondary transition-all flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Metrics Panel */}
        <div className="bg-surface-secondary/20 border border-border-subtle rounded-2xl p-6">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-4">Metrics</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-surface rounded-xl">
              <p className="text-2xl font-bold text-text-primary">{state.totalRequests}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Total Requests</p>
            </div>
            <div className="text-center p-3 bg-surface rounded-xl">
              <p className="text-2xl font-bold text-green-500">{state.allowedRequests}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Allowed</p>
            </div>
            <div className="text-center p-3 bg-surface rounded-xl">
              <p className="text-2xl font-bold text-red-500">{state.blockedRequests}</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Blocked</p>
            </div>
            <div className="text-center p-3 bg-surface rounded-xl">
              <p className="text-2xl font-bold text-primary">{state.avgResponseTime}ms</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Avg Latency</p>
            </div>
          </div>

          {state.totalRequests > 0 && (
            <div className="mt-4 pt-4 border-t border-border-subtle">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-text-muted">Success Rate</span>
                <span className="text-sm font-bold text-primary">
                  {((state.allowedRequests / state.totalRequests) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(state.allowedRequests / state.totalRequests) * 100}%` }}
                />
              </div>
            </div>
          )}

          {clientStats.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border-subtle">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Client Fairness Snapshot</p>
              <div className="space-y-2">
                {clientStats.slice(0, 4).map((client) => (
                  <div key={client.clientId} className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface px-3 py-2">
                    <span className="text-[11px] font-mono text-text-secondary">{client.clientId}</span>
                    <span className="text-[11px] text-text-muted">
                      <span className="text-green-500 font-semibold">{client.allowed}</span>
                      {" / "}
                      <span className="text-red-500 font-semibold">{client.blocked}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Visualization */}
      <div className="lg:col-span-2 space-y-4">
        {/* Algorithm Visualization */}
        <div className="bg-surface-glass backdrop-blur-xl border border-border-subtle rounded-2xl p-6">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-6">
            {state.strategy === "token-bucket" && "Token Bucket"}
            {state.strategy === "fixed-window" && "Fixed Window Counter"}
            {state.strategy === "sliding-window" && "Sliding Window Log"}
          </h3>

          {/* Token Bucket Visualization */}
          {state.strategy === "token-bucket" && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-32 h-48 bg-surface-secondary/50 rounded-2xl border-2 border-border-strong overflow-hidden">
                  {/* Bucket */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all duration-300"
                    style={{ height: `${(state.tokens / state.burstCapacity) * 100}%` }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
                  </div>
                  {/* Token markers */}
                  {Array.from({ length: Math.min(state.tokens, 20) }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-4 h-4 rounded-full bg-primary shadow-lg animate-pulse"
                      style={{
                        bottom: `${((i + 0.5) / state.burstCapacity) * 100}%`,
                        left: `${20 + (i % 3) * 30}%`,
                      }}
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-3xl font-bold text-text-primary">{state.tokens}</p>
                  <p className="text-sm text-text-muted">tokens available</p>
                  <p className="text-xs text-text-muted mt-2">
                    Capacity: {state.burstCapacity} | Refill rate: {(60000 / state.windowSizeMs * state.maxRequests).toFixed(1)}/min
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Fixed Window Visualization */}
          {state.strategy === "fixed-window" && (
            <div className="mb-6">
              <div className="bg-surface-secondary/50 rounded-2xl p-6 border-2 border-border-strong">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-text-muted">Current Window</span>
                  <span className="text-xs text-primary font-mono">
                    {new Date(state.windowStart).toLocaleTimeString()} - {new Date(state.windowStart + state.windowSizeMs).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-text-muted mb-3">
                  Reset in <span className="font-semibold text-primary">{fixedWindowSecondsRemaining}s</span>
                </p>
                <div className="relative h-8 bg-surface rounded-full overflow-hidden mb-2">
                  <div 
                    className="absolute h-full bg-primary transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, (state.fixedWindowCount / state.maxRequests) * 100)}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">
                    {state.fixedWindowCount} used
                  </span>
                  <span className="text-primary font-bold">{state.maxRequests} limit</span>
                </div>
              </div>
            </div>
          )}

          {/* Sliding Window Visualization */}
          {state.strategy === "sliding-window" && (
            <div className="mb-6">
              <div className="bg-surface-secondary/50 rounded-2xl p-6 border-2 border-border-strong">
                <p className="text-sm font-bold text-text-muted mb-4">Requests in last {state.windowSizeMs / 1000}s window</p>
                <p className="text-xs text-text-muted mb-3">
                  {state.requestHistory.length > 0 ? (
                    <>
                      Oldest request expires in <span className="font-semibold text-primary">{slidingWindowSecondsRemaining}s</span>
                    </>
                  ) : (
                    "No active requests in current window"
                  )}
                </p>
                <div className="flex gap-1 flex-wrap mb-4">
                  {state.requestHistory.slice(-30).map((ts, i) => {
                    const age = currentTime - ts;
                    const opacity = Math.max(0.3, 1 - age / state.windowSizeMs);
                    return (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full bg-primary"
                        style={{ opacity }}
                        title={new Date(ts).toLocaleTimeString()}
                      />
                    );
                  })}
                  {Array.from({ length: Math.max(0, 30 - state.requestHistory.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-3 h-3 rounded-full bg-border-strong" />
                  ))}
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">{state.requestHistory.length} requests</span>
                  <span className="text-primary font-bold">{state.maxRequests} limit</span>
                </div>
              </div>
            </div>
          )}

          {/* Request Flow */}
          <div className="border-t border-border-subtle pt-6">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Live Request Stream</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-border-strong">
              {state.requests.slice(0, 20).map((req) => (
                <div 
                  key={req.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    req.status === "allowed" 
                      ? "bg-green-500/5 border-green-500/20" 
                      : "bg-red-500/5 border-red-500/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${req.status === "allowed" ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-xs font-mono text-text-secondary">{req.id.slice(-12)}</span>
                    <span className="text-[10px] text-text-muted">{req.clientId}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {req.headers && (
                      <span className="text-[10px] text-text-muted">
                        Remaining: {req.headers["X-RateLimit-Remaining"]}
                      </span>
                    )}
                    <span className={`text-xs font-bold ${req.status === "allowed" ? "text-green-500" : "text-red-500"}`}>
                      {req.status === "allowed" ? "200 OK" : "429 Too Many Requests"}
                    </span>
                    {req.status === "blocked" && req.headers?.["Retry-After"] && (
                      <span className="text-[10px] text-text-muted">
                        Retry: {req.headers["Retry-After"]}s
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {state.requests.length === 0 && (
                <p className="text-center text-sm text-text-muted py-8">No requests yet. Start the simulation to see requests.</p>
              )}
            </div>
          </div>
        </div>

        {/* Headers Inspector */}
        {state.requests.length > 0 && state.requests[0].headers && (
          <div className="bg-surface-secondary/20 border border-border-subtle rounded-2xl p-6">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-4">Latest Response Headers</h3>
            <div className="bg-surface rounded-xl p-4 font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">X-RateLimit-Limit:</span>
                <span className="text-primary">{state.requests[0].headers["X-RateLimit-Limit"]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">X-RateLimit-Remaining:</span>
                <span className={state.requests[0].headers["X-RateLimit-Remaining"] < 5 ? "text-red-500" : "text-green-500"}>
                  {state.requests[0].headers["X-RateLimit-Remaining"]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">X-RateLimit-Reset:</span>
                <span className="text-text-secondary">{new Date(state.requests[0].headers["X-RateLimit-Reset"] * 1000).toLocaleTimeString()}</span>
              </div>
              {state.requests[0].headers["Retry-After"] && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Retry-After:</span>
                  <span className="text-red-500">{state.requests[0].headers["Retry-After"]} seconds</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Code Example */}
        <div className="bg-surface-secondary/20 border border-border-subtle rounded-2xl p-6">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-4">Implementation Example</h3>
          <div className="bg-surface rounded-xl p-4 overflow-x-auto">
            <pre className="text-xs text-text-secondary font-mono">
              <code>{`// Express.js ${state.strategy} rate limiter
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: ${state.windowSizeMs}, // ${state.windowSizeMs / 1000} seconds
  max: ${state.maxRequests}, // ${state.maxRequests} requests per window
  ${state.strategy === 'token-bucket' ? `burst: ${state.burstCapacity}, // allow bursts` : ''}
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too Many Requests',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

app.use('/api/', limiter);`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Logs Panel */}
      <div className="lg:col-span-3">
        <div className="bg-surface-secondary/20 border border-border-subtle rounded-2xl p-6">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            System Logs
          </h3>
          <div className="bg-surface rounded-xl p-4 font-mono text-xs max-h-48 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-border-strong">
            {state.logs.map((log, index) => (
              <div
                key={index}
                className={`p-2 rounded border-l-2 ${
                  log.type === 'error' ? 'bg-red-500/5 border-red-500 text-red-400' :
                  log.type === 'success' ? 'bg-green-500/5 border-green-500 text-green-400' :
                  log.type === 'warn' ? 'bg-yellow-500/5 border-yellow-500 text-yellow-400' :
                  'bg-primary/5 border-primary text-text-secondary'
                }`}
              >
                <span className="opacity-50">[{log.time}]</span> {log.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
