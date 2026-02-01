"use client";

import { useState, useReducer, useEffect } from "react";
import Link from "next/link";

type Phase = "INQUIRY" | "STAGING" | "OTP" | "CONFIRMATION";

type TransactionState = {
  phase: Phase;
  logs: { msg: string; type: "info" | "success" | "error"; time: string }[];
  formData: {
    refNumber: string;
    firstName: string;
    lastName: string;
  };
  otp: string;
  isProcessing: boolean;
  showEmailToast: boolean;
};

const MAGIC_REF = "REMIT-2024-JFC";
const MAGIC_OTP = "123456";

const initialState: TransactionState = {
  phase: "INQUIRY",
  logs: [{ msg: "System Ready. Waiting for Inquiry...", type: "info", time: new Date().toLocaleTimeString() }],
  formData: { refNumber: "", firstName: "", lastName: "" },
  otp: "",
  isProcessing: false,
  showEmailToast: false,
};

type Action =
  | { type: "SET_PHASE"; payload: Phase }
  | { type: "ADD_LOG"; msg: string; logType?: "info" | "success" | "error" }
  | { type: "UPDATE_FORM"; field: string; value: string }
  | { type: "SET_PROCESSING"; payload: boolean }
  | { type: "SHOW_EMAIL_TOAST"; payload: boolean }
  | { type: "RESET" };

function reducer(state: TransactionState, action: Action): TransactionState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.payload, isProcessing: false };
    case "ADD_LOG":
      return {
        ...state,
        logs: [
          ...state.logs,
          { msg: action.msg, type: action.logType || "info", time: new Date().toLocaleTimeString() },
        ],
      };
    case "UPDATE_FORM":
      return { ...state, formData: { ...state.formData, [action.field]: action.value } };
    case "SET_PROCESSING":
      return { ...state, isProcessing: action.payload };
    case "SHOW_EMAIL_TOAST":
      return { ...state, showEmailToast: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function PaymentFlowSimulator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [otpInput, setOtpInput] = useState("");

  const addLog = (msg: string, logType: "info" | "success" | "error" = "info") => {
    dispatch({ type: "ADD_LOG", msg, logType });
  };

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_PROCESSING", payload: true });
    addLog("Initiating Inquiry for Reference: " + state.formData.refNumber);
    
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000));
    addLog("Calling KaiserCheck / CIS Fraud Detection middleware...");
    
    await new Promise((r) => setTimeout(r, 1500));
    
    if (state.formData.refNumber.toUpperCase() === MAGIC_REF) {
      addLog("Recipient Matched: James Florence Conales", "success");
      addLog("Amount Verified: PHP 25,000.00", "success");
      dispatch({ type: "SET_PHASE", payload: "STAGING" });
    } else {
      addLog("Reference Number not found or details mismatch.", "error");
      dispatch({ type: "SET_PROCESSING", payload: false });
    }
  };

  const handleStaging = async () => {
    dispatch({ type: "SET_PROCESSING", payload: true });
    addLog("Staging transaction...");
    
    await new Promise((r) => setTimeout(r, 1000));
    addLog("Nodemailer: Dispatching OTP to registered email...", "info");
    
    await new Promise((r) => setTimeout(r, 800));
    dispatch({ type: "SHOW_EMAIL_TOAST", payload: true });
    dispatch({ type: "SET_PHASE", payload: "OTP" });
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_PROCESSING", payload: true });
    addLog("Validating OTP...");

    await new Promise((r) => setTimeout(r, 1200));

    if (otpInput === MAGIC_OTP) {
      addLog("OTP Verified Successfully", "success");
      addLog("Executing Final Settlement...", "info");
      
      await new Promise((r) => setTimeout(r, 1500));
      addLog("Transaction Confirmed by Provider", "success");
      dispatch({ type: "SET_PHASE", payload: "CONFIRMATION" });
    } else {
      addLog("Invalid OTP. Access Denied.", "error");
      dispatch({ type: "SET_PROCESSING", payload: false });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 relative">
      {/* Fake Email Toast */}
      {state.showEmailToast && (
        <div className="fixed top-8 right-8 z-50 bg-white dark:bg-zinc-900 border border-border-strong rounded-xl shadow-2xl p-4 max-w-xs animate-in slide-in-from-right duration-500">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary">Nodemailer (Simulation)</p>
              <p className="text-sm text-text-secondary mt-1">James Remittance OTP: <span className="font-mono font-bold text-primary">{MAGIC_OTP}</span></p>
              <button 
                onClick={() => dispatch({ type: "SHOW_EMAIL_TOAST", payload: false })}
                className="text-[10px] text-primary hover:underline mt-2 font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar: Logs & State */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="bg-surface-secondary/20 border border-border-subtle rounded-2xl p-6 h-full flex flex-col">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Backend Logs
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[11px] max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-border-strong">
            {state.logs.map((log, i) => (
              <div key={i} className={`p-2 rounded border-l-2 ${
                log.type === 'error' ? 'bg-red-500/5 border-red-500 text-red-400' :
                log.type === 'success' ? 'bg-green-500/5 border-green-500 text-green-400' :
                'bg-primary/5 border-primary text-text-secondary'
              }`}>
                <span className="opacity-50">[{log.time}]</span> {log.msg}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border-subtle">
            <button 
              onClick={() => dispatch({ type: "RESET" })}
              className="text-xs text-text-muted hover:text-primary transition-colors flex items-center gap-2"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Restart Simulation
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Steps */}
      <div className="lg:col-span-2">
        <div className="bg-surface-glass backdrop-blur-xl border border-border-subtle rounded-2xl p-8 min-h-[500px] flex flex-col">
          {/* Steper Header */}
          <div className="flex justify-between mb-12">
            {["Inquiry", "Stage", "OTP", "Done"].map((s, i) => {
              const phases: Phase[] = ["INQUIRY", "STAGING", "OTP", "CONFIRMATION"];
              const currentIndex = phases.indexOf(state.phase);
              const isActive = i <= currentIndex;
              return (
                <div key={s} className="flex flex-col items-center gap-2 flex-1 relative">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold z-10 transition-colors duration-500 ${
                    isActive ? "bg-primary border-primary text-text-inverse" : "bg-surface border-border-strong text-text-muted"
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-[10px] uppercase tracking-tighter font-bold ${isActive ? "text-primary" : "text-text-muted"}`}>{s}</span>
                  {i < 3 && (
                    <div className="absolute top-4 left-[50%] right-[-50%] h-[1px] bg-border-strong -z-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 1: Inquiry */}
          {state.phase === "INQUIRY" && (
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Remittance Inquiry</h2>
                <p className="text-sm text-text-secondary">Simulate a backend lookup using a reference number.</p>
              </div>
              <form onSubmit={handleInquiry} className="space-y-4">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl mb-6">
                  <p className="text-xs text-primary font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Simulation Helper:
                  </p>
                  <p className="text-sm text-text-primary mt-1">
                    Use Ref #: <button type="button" onClick={() => dispatch({ type: "UPDATE_FORM", field: "refNumber", value: MAGIC_REF })} className="font-mono font-bold underline decoration-dotted">{MAGIC_REF}</button>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Reference Number</label>
                  <input
                    required
                    type="text"
                    value={state.formData.refNumber}
                    onChange={(e) => dispatch({ type: "UPDATE_FORM", field: "refNumber", value: e.target.value })}
                    className="w-full bg-surface-secondary/50 border border-border-strong rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                    placeholder="e.g. REMIT-XXXX-XXXX"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Recipient First Name</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-surface-secondary/50 border border-border-strong rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="James Florence"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Last Name</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-surface-secondary/50 border border-border-strong rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Conales"
                    />
                  </div>
                </div>

                <button
                  disabled={state.isProcessing}
                  className="w-full bg-text-primary text-text-inverse h-12 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
                >
                  {state.isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-text-inverse/30 border-t-text-inverse rounded-full animate-spin" />
                      Inquiring...
                    </>
                  ) : "Inquire Transaction"}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Staging */}
          {state.phase === "STAGING" && (
            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-text-primary mb-2">Review Details</h2>
                <p className="text-sm text-text-secondary">Please confirm matching recipient details from the API response.</p>
              </div>

              <div className="bg-surface-secondary/50 border border-border-strong rounded-2xl overflow-hidden divide-y divide-border-subtle">
                <div className="p-4 grid grid-cols-2">
                  <span className="text-xs text-text-muted uppercase font-bold self-center">Service Provider</span>
                  <span className="text-sm font-bold text-primary text-right">Western Union (via PERAHUB)</span>
                </div>
                <div className="p-4 grid grid-cols-2">
                  <span className="text-xs text-text-muted uppercase font-bold self-center">Recipient Name</span>
                  <span className="text-sm font-bold text-text-primary text-right uppercase">Conales, James Florence</span>
                </div>
                <div className="p-4 grid grid-cols-2">
                  <span className="text-xs text-text-muted uppercase font-bold self-center">Amount to Receive</span>
                  <span className="text-lg font-bold text-text-primary text-right">PHP 25,000.00</span>
                </div>
                <div className="p-4 grid grid-cols-2">
                  <span className="text-xs text-text-muted uppercase font-bold self-center">Status</span>
                  <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full w-fit justify-self-end">READY FOR PAYOUT</span>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => dispatch({ type: "SET_PHASE", payload: "INQUIRY" })}
                  className="flex-1 border border-border-strong h-12 rounded-xl font-bold text-text-secondary hover:bg-surface-secondary transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStaging}
                  disabled={state.isProcessing}
                  className="flex-[2] bg-primary text-text-inverse h-12 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  {state.isProcessing ? (
                    <div className="w-4 h-4 border-2 border-text-inverse/30 border-t-text-inverse rounded-full animate-spin" />
                  ) : "Confirm & Send OTP"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: OTP */}
          {state.phase === "OTP" && (
            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Verify Identity</h2>
              <p className="text-sm text-text-secondary mb-8">
                An OTP was sent to <span className="text-text-primary font-bold">j***s@gmail.com</span><br/>
                Please check the simulation toast in the top right.
              </p>

              <form onSubmit={handleOtpSubmit} className="w-full max-w-sm space-y-6">
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full text-center text-3xl font-bold tracking-[1em] bg-surface-secondary/50 border border-border-strong rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="000000"
                />
                <button
                  disabled={state.isProcessing || otpInput.length < 6}
                  className="w-full bg-text-primary text-text-inverse h-12 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {state.isProcessing ? (
                    <div className="w-4 h-4 border-2 border-text-inverse/30 border-t-text-inverse rounded-full animate-spin" />
                  ) : "Verify & Complete"}
                </button>
                <div className="text-xs text-text-muted">
                  Didn't receive code? <button type="button" onClick={() => dispatch({ type: "SHOW_EMAIL_TOAST", payload: true })} className="text-primary hover:underline">Resend Simulation Email</button>
                </div>
              </form>
            </div>
          )}

          {/* Step 4: Done */}
          {state.phase === "CONFIRMATION" && (
            <div className="flex-1 animate-in zoom-in duration-500 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-6 relative">
                 <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                {/* Sprinkles/Confetti simulation could go here */}
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Payout Successful!</h2>
              <p className="text-sm text-text-secondary mb-8 text-center px-8">
                The funds have been credited. A simulated receipt has been generated following the backend commitment.
              </p>

              <div className="w-full bg-white dark:bg-zinc-950 border border-border-subtle rounded-xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500" />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Receipt Number</h4>
                    <p className="text-xs font-mono font-bold text-text-primary">#JFC-{(Math.random() * 100000).toFixed(0).padStart(6, '0')}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Date</h4>
                    <p className="text-xs font-bold text-text-primary">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs text-text-secondary italic">Sender:</span>
                    <span className="text-xs font-bold text-text-primary">James Remittance Services Ltd.</span>
                  </div>
                  <div className="flex justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs text-text-secondary italic">Recipient:</span>
                    <span className="text-xs font-bold text-text-primary uppercase">James Florence Conales</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-bold text-text-primary">TOTAL AMOUNT</span>
                    <span className="text-xl font-bold text-primary">PHP 25,000.00</span>
                  </div>
                </div>

                <div className="text-center font-mono text-[9px] text-text-muted uppercase tracking-widest">
                  Thank you for using James' Simulation Suite
                </div>
              </div>

              <div className="mt-8 flex gap-4 w-full">
                <button
                  onClick={() => dispatch({ type: "RESET" })}
                  className="flex-1 bg-text-primary text-text-inverse h-12 rounded-xl font-bold hover:opacity-90 transition-all"
                >
                  New Simulation
                </button>
                <Link
                  href="/perahub"
                  className="flex-1 border border-border-strong flex items-center justify-center h-12 rounded-xl font-bold text-text-secondary hover:bg-surface-secondary transition-all"
                >
                  Back to Case Study
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
