"use client";

import { useState, useReducer, useEffect, useRef } from "react";
import Link from "next/link";

type Mode = "SIGN" | "VERIFY";

type Log = { msg: string; type: "info" | "success" | "error"; time: string };

type VisualState = {
  mode: Mode;
  logs: Log[];
  payload: string;
  header: string;
  signature: string;
  isProcessing: boolean;
  step: number; // 0: idle, 1: hashing, 2: key-combining, 3: completed
};

const DEFAULT_PAYLOAD = JSON.stringify({
  transaction_id: "TXN-8829102",
  amount: 25000.00,
  currency: "PHP",
  status: "SUCCESS"
}, null, 2);

const DEFAULT_HEADER = JSON.stringify({
  alg: "RS256",
  typ: "JWT",
  kid: "perahub-prod-key-01"
}, null, 2);

const initialState: VisualState = {
  mode: "SIGN",
  logs: [{ msg: "Encryption Engine Initialized. Mode: Asymmetric RSA-SHA256", type: "info", time: new Date().toLocaleTimeString() }],
  payload: DEFAULT_PAYLOAD,
  header: DEFAULT_HEADER,
  signature: "",
  isProcessing: false,
  step: 0,
};

type Action =
  | { type: "SET_MODE"; payload: Mode }
  | { type: "ADD_LOG"; msg: string; logType?: "info" | "success" | "error" }
  | { type: "SET_DATA"; field: "payload" | "header" | "signature"; value: string }
  | { type: "SET_PROCESSING"; payload: boolean }
  | { type: "SET_STEP"; payload: number }
  | { type: "RESET" };

function reducer(state: VisualState, action: Action): VisualState {
  switch (action.type) {
    case "SET_MODE":
      return { ...initialState, mode: action.payload, logs: [{ msg: `Switched to ${action.payload} mode.`, type: "info", time: new Date().toLocaleTimeString() }] };
    case "ADD_LOG":
      return {
        ...state,
        logs: [
          ...state.logs,
          { msg: action.msg, type: action.logType || "info", time: new Date().toLocaleTimeString() },
        ],
      };
    case "SET_DATA":
      return { ...state, [action.field]: action.value };
    case "SET_PROCESSING":
      return { ...state, isProcessing: action.payload };
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "RESET":
      return { ...initialState, mode: state.mode };
    default:
      return state;
  }
}

export default function EncryptionVisualizer() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [state.logs]);

  const addLog = (msg: string, logType: "info" | "success" | "error" = "info") => {
    dispatch({ type: "ADD_LOG", msg, logType });
  };

  const computeMockSignature = (header: string, payload: string) => {
    // Deterministic hash simulation for demo purposes
    const str = header.trim() + payload.trim();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; 
    }
    // Return a base64-like string that is unique to the content
    return btoa("SIG-" + Math.abs(hash).toString(36)).padEnd(64, '0').substring(0, 64);
  };

  const handleSign = async () => {
    dispatch({ type: "SET_PROCESSING", payload: true });
    dispatch({ type: "SET_STEP", payload: 1 });
    addLog("Initiating Private Key Signing via GCP KMS...");
    
    await new Promise(r => setTimeout(r, 800));
    addLog("Normalizing Payload & Header (Canonical JSON form)...");
    addLog("Calculating SHA-256 Digest...");
    
    dispatch({ type: "SET_STEP", payload: 2 });
    await new Promise(r => setTimeout(r, 1200));
    addLog("GCP KMS: Authorizing request via IAM (Least Privilege Check)...", "info");
    addLog("Applying RSA-2048 Private Key to Digest...", "info");

    dispatch({ type: "SET_STEP", payload: 3 });
    await new Promise(r => setTimeout(r, 1000));
    
    const mockSig = computeMockSignature(state.header, state.payload);
    dispatch({ type: "SET_DATA", field: "signature", value: mockSig });
    addLog("Digital Signature Generated Successfully", "success");
    addLog("Final Signature: " + mockSig.substring(0, 16) + "...", "success");
    dispatch({ type: "SET_PROCESSING", payload: false });
  };

  const handleVerify = async () => {
    dispatch({ type: "SET_PROCESSING", payload: true });
    dispatch({ type: "SET_STEP", payload: 1 });
    addLog("Starting Signature Verification (Swift/Kotlin Request)...");

    await new Promise(r => setTimeout(r, 1000));
    addLog("Extracting Public Key from Partner Metadata...");
    addLog("Verifying integrity of received Header & Payload...");

    dispatch({ type: "SET_STEP", payload: 2 });
    await new Promise(r => setTimeout(r, 1500));
    
    const expectedSig = computeMockSignature(state.header, state.payload);
    
    if (state.signature === expectedSig) {
      addLog("Cryptographic Hash Match: Verified", "success");
      addLog("Non-repudiation confirmed via Public Key Infrastructure", "success");
      dispatch({ type: "SET_STEP", payload: 3 });
    } else {
      addLog("ERROR: Cryptographic Failure. Signature Mismatch.", "error");
      addLog("Reason: Payload has been tampered with or invalid key used.", "error");
      dispatch({ type: "SET_STEP", payload: 0 });
    }
    
    dispatch({ type: "SET_PROCESSING", payload: false });
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-4">
      {/* Sidebar: Mode & Terminal (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Mode Selector */}
        <div className="bg-surface-secondary/20 border border-border-subtle rounded-2xl p-2 flex gap-1">
          <button
            onClick={() => dispatch({ type: "SET_MODE", payload: "SIGN" })}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
              state.mode === "SIGN" ? "bg-primary text-text-inverse shadow-lg shadow-primary/20" : "text-text-muted hover:text-text-primary"
            }`}
          >
            Sign Response
          </button>
          <button
            onClick={() => dispatch({ type: "SET_MODE", payload: "VERIFY" })}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
              state.mode === "VERIFY" ? "bg-primary text-text-inverse shadow-lg shadow-primary/20" : "text-text-muted hover:text-text-primary"
            }`}
          >
            Verify Request
          </button>
        </div>

        {/* Terminal Area */}
        <div className="bg-zinc-950 rounded-2xl p-6 flex-1 flex flex-col min-h-[400px] border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
            <span className="text-[10px] font-mono text-white/30 ml-2 uppercase tracking-widest">crypto_engine.log</span>
          </div>
          <div ref={logContainerRef} className="flex-1 overflow-y-auto space-y-2 font-mono text-[11px] pr-2 scrollbar-thin scrollbar-thumb-white/10">
            {state.logs.map((log, i) => (
              <div key={i} className={`flex gap-3 ${
                log.type === 'error' ? 'text-red-400' :
                log.type === 'success' ? 'text-green-400' :
                'text-zinc-400'
              }`}>
                <span className="text-zinc-600 shrink-0">[{log.time.split(' ')[0]}]</span>
                <span>{log.msg}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <button 
              onClick={() => dispatch({ type: "RESET" })}
              className="text-[10px] text-zinc-500 hover:text-primary transition-colors flex items-center gap-2"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clear Buffer
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Pipeline Visualizer (8 cols) */}
      <div className="lg:col-span-8 space-y-8">
        {/* Editor Area */}
        <div className="bg-surface-glass border border-border-subtle rounded-2xl p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">JOSE Header</label>
              <textarea
                value={state.header}
                onChange={(e) => dispatch({ type: "SET_DATA", field: "header", value: e.target.value })}
                className="w-full h-24 bg-surface-secondary/50 border border-border-strong rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Message Payload</label>
              <textarea
                value={state.payload}
                onChange={(e) => dispatch({ type: "SET_DATA", field: "payload", value: e.target.value })}
                className="w-full h-24 bg-surface-secondary/50 border border-border-strong rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>
          
          {state.mode === "VERIFY" && (
            <div className="space-y-2 mb-6 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Received Digital Signature (Base64)</label>
              <input
                type="text"
                value={state.signature}
                onChange={(e) => dispatch({ type: "SET_DATA", field: "signature", value: e.target.value })}
                className="w-full bg-surface-secondary/50 border border-border-strong rounded-xl px-4 py-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/30"
                placeholder="Paste signature here..."
              />
              <p className="text-[10px] text-text-muted">Tip: Generate a signature in 'Sign' mode first, then paste it here to verify.</p>
            </div>
          )}

          <button
            onClick={state.mode === "SIGN" ? handleSign : handleVerify}
            disabled={state.isProcessing}
            className="w-full bg-text-primary text-text-inverse h-12 rounded-xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {state.isProcessing ? (
              <div className="w-5 h-5 border-2 border-text-inverse/30 border-t-text-inverse rounded-full animate-spin" />
            ) : (
                <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {state.mode === "SIGN" ? "Commit Signing via KMS" : "Verify Request Integrity"}
              </>
            )}
          </button>
        </div>

        {/* Pipeline Visualization Area */}
        <div className="relative pt-10 pb-6 px-4 bg-surface-secondary/10 border border-border-subtle rounded-2xl overflow-hidden min-h-[250px] flex items-center justify-center">
             <div className="absolute top-4 left-6 py-1 px-3 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Asymmetric Flow Pipeline</span>
             </div>

             <div className="flex flex-col md:flex-row items-center gap-12 relative w-full justify-around">
                
                {/* Node 1: Input Data */}
                <div className={`flex flex-col items-center gap-3 transition-opacity duration-500 ${state.step >= 0 ? 'opacity-100' : 'opacity-20'}`}>
                    <div className="w-16 h-16 rounded-2xl bg-surface border border-border-strong flex items-center justify-center shadow-lg relative group">
                        <svg className="w-8 h-8 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {state.step === 1 && <div className="absolute inset-0 border-2 border-primary rounded-2xl animate-ping opacity-20" />}
                    </div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Payload</span>
                </div>

                <div className={`hidden md:block w-12 h-0.5 bg-border-strong relative transition-colors duration-500 ${state.step >= 1 ? 'bg-primary' : ''}`}>
                    {state.step === 1 && <div className="absolute inset-0 bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />}
                </div>

                {/* Node 2: The Transform (The Key) */}
                <div className={`flex flex-col items-center gap-3 transition-all duration-500 ${state.step >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                        state.step === 2 ? 'bg-primary border-primary scale-110 shadow-xl shadow-primary/20' : 
                        state.step > 2 ? 'bg-green-500/10 border-green-500' : 'bg-surface border-border-strong'
                    }`}>
                        <svg className={`w-10 h-10 transition-colors duration-500 ${state.step === 2 ? 'text-text-inverse' : state.step > 2 ? 'text-green-500' : 'text-text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           {state.mode === "SIGN" ? (
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                           ) : (
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2z" />
                           )}
                        </svg>
                    </div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                        {state.mode === "SIGN" ? "KMS Private Key" : "Public Key"}
                    </span>
                </div>

                <div className={`hidden md:block w-12 h-0.5 bg-border-strong relative transition-colors duration-500 ${state.step >= 2 ? 'bg-primary' : ''}`}>
                     {state.step === 2 && <div className="absolute inset-0 bg-primary animate-pulse" />}
                </div>

                {/* Node 3: Final Output */}
                <div className={`flex flex-col items-center gap-3 transition-opacity duration-500 ${state.step >= 3 ? 'opacity-100' : 'opacity-20'}`}>
                    <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center shadow-lg transition-colors duration-500 ${
                        state.step >= 3 ? 'bg-green-500/10 border-green-500' : 'bg-surface border-border-strong'
                    }`}>
                        <svg className={`w-8 h-8 ${state.step >= 3 ? 'text-green-500 animate-bounce' : 'text-text-secondary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                         {state.mode === "SIGN" ? "Signed Output" : "Verified Outcome"}
                    </span>
                </div>
             </div>

             {/* Background Decoration */}
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Output Area (Visible after signing) */}
        {state.mode === "SIGN" && state.signature && (
            <div className="bg-surface-glass border border-green-500/30 rounded-2xl p-6 animate-in zoom-in-95 duration-500">
               <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Generated Secure Response
                    </h3>
                    <button 
                         onClick={() => {
                            navigator.clipboard.writeText(state.signature);
                            addLog("Signature copied to clipboard", "success");
                         }}
                         className="text-[10px] font-bold text-primary hover:underline uppercase"
                    >
                        Copy Signature
                    </button>
               </div>
               <div className="bg-zinc-950 rounded-xl p-4 font-mono text-[11px] text-zinc-300 break-all leading-relaxed border border-white/5">
                    <span className="text-zinc-500">"james-sample-signature":</span> "{state.signature}"
               </div>
            </div>
        )}
        
        {state.mode === "VERIFY" && state.step === 3 && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 flex items-center gap-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="w-12 h-12 rounded-full bg-green-500 text-text-inverse flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-text-primary">Integrity Verified</h3>
                    <p className="text-sm text-text-secondary mt-1">The request signature matches the public key hash. The data is authentic and hasn't been modified since it was signed by the Swift/Kotlin client.</p>
                </div>
            </div>
        )}
      </div>

      <div className="lg:col-span-12 mt-8 p-8 border border-border-subtle rounded-3xl bg-surface-secondary/20">
         <div className="grid md:grid-cols-3 gap-8">
            <div>
                <h4 className="text-xs font-bold text-text-primary uppercase mb-2">Non-Repudiation</h4>
                <p className="text-[10px] text-text-secondary leading-relaxed">Because the response is signed with a private key stored in GCP KMS, no other entity can claim to have sent this data.</p>
            </div>
            <div>
                <h4 className="text-xs font-bold text-text-primary uppercase mb-2">Tamper Proof</h4>
                <p className="text-[10px] text-text-secondary leading-relaxed">Changing even a single comma in the payload will cause a hash mismatch, failing the verification instantly.</p>
            </div>
            <div>
                <h4 className="text-xs font-bold text-text-primary uppercase mb-2">Cloud KMS Hardening</h4>
                <p className="text-[10px] text-text-secondary leading-relaxed">The keys never leave the hardware security module (HSM). The backend only sends the hash to KMS and receives the signature back.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
