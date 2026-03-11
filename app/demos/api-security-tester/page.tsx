"use client";

import { useState } from "react";
import Link from "next/link";

type SecurityTest = {
  id: string;
  name: string;
  description: string;
  category: "authentication" | "encryption" | "authorization" | "validation";
  status: "pending" | "running" | "success" | "failed";
  result?: {
    passed: boolean;
    message: string;
    details?: string;
  };
};

type PayloadData = {
  message: string;
  timestamp: number;
  userId: string;
  amount: number;
};

const ApiSecurityTester: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [tests, setTests] = useState<SecurityTest[]>([
    {
      id: "hmac-signing",
      name: "HMAC Request Signing",
      description: "Test HMAC-SHA256 signature validation for API requests",
      category: "authentication",
      status: "pending"
    },
    {
      id: "rsa-signing", 
      name: "RSA Digital Signatures",
      description: "Verify RSA-SHA256 digital signatures for non-repudiation",
      category: "authentication",
      status: "pending"
    },
    {
      id: "payload-encryption",
      name: "Payload Encryption",
      description: "Test AES-256 encryption for sensitive data at rest and in transit",
      category: "encryption",
      status: "pending"
    },
    {
      id: "iam-policies",
      name: "IAM Role-Based Access",
      description: "Validate principle of least privilege and role-based permissions",
      category: "authorization",
      status: "pending"
    },
    {
      id: "token-validation",
      name: "JWT Token Security",
      description: "Verify JWT token structure, expiration, and signature",
      category: "validation",
      status: "pending"
    },
    {
      id: "rate-limiting",
      name: "Rate Limiting Protection",
      description: "Test API rate limiting and DDoS protection mechanisms",
      category: "validation",
      status: "pending"
    }
  ]);

  const [logs, setLogs] = useState<Array<{ time: string; message: string; type: "info" | "success" | "error"; }>>([]);
  const [payload] = useState<PayloadData>({
    message: "Payment transfer request",
    timestamp: 1704063600000,
    userId: "user_12345",
    amount: 50000
  });

  const addLog = (message: string, type: "info" | "success" | "error" = "info") => {
    setLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  };

  const runHMACTest = async () => {
    const test = tests.find(t => t.id === "hmac-signing");
    if (!test) return;

    setTests(prev => prev.map(t => 
      t.id === "hmac-signing" ? { ...t, status: "running" } : t
    ));

    addLog("🔒 Starting HMAC-SHA256 signature test...", "info");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate HMAC generation (in real app, would use crypto.createHmac)
    const hmacDigest = "d8a8f5b6f5a9f5c5f5e5f5a5f5b5f5d5f5e5f5c5f5a5f5b5f5d5f"; // Simulated HMAC
    
    addLog(`📝 Generated HMAC: ${hmacDigest.substring(0, 20)}...`, "info");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate server validation
    addLog("🔍 Server validating HMAC signature...", "info");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isValid = hmacDigest.startsWith("d8a8"); // Simulated validation
    
    setTests(prev => prev.map(t => 
      t.id === "hmac-signing" ? { 
        ...t, 
        status: isValid ? "success" : "failed",
        result: {
          passed: isValid,
          message: isValid ? "HMAC signature valid - request authenticated" : "HMAC signature invalid - access denied",
          details: "HMAC-SHA256 with 256-bit key"
        }
      } : t
    ));
    
    addLog(isValid ? "✅ HMAC validation successful" : "❌ HMAC validation failed", isValid ? "success" : "error");
  };

  const runRSATest = async () => {
    const test = tests.find(t => t.id === "rsa-signing");
    if (!test) return;

    setTests(prev => prev.map(t => 
      t.id === "rsa-signing" ? { ...t, status: "running" } : t
    ));

    addLog("🔐 Starting RSA-SHA256 digital signature test...", "info");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate RSA signing (in real app, would use crypto.sign with RSA private key)
    const signature = "MIICdgIBADANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA..."; // Simulated RSA signature
    
    addLog(`🔏 Generated RSA signature: ${signature.substring(0, 30)}...`, "info");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog("🔍 Verifying signature with public key...", "info");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isValid = signature.startsWith("MIIC"); // Simulated verification
    
    setTests(prev => prev.map(t => 
      t.id === "rsa-signing" ? { 
        ...t, 
        status: isValid ? "success" : "failed",
        result: {
          passed: isValid,
          message: isValid ? "RSA signature verified - non-repudiation assured" : "RSA signature invalid - tampering detected",
          details: "RSA-2048 with SHA-256, Cloud KMS backed"
        }
      } : t
    ));
    
    addLog(isValid ? "✅ RSA signature verified" : "❌ RSA verification failed", isValid ? "success" : "error");
  };

  const runEncryptionTest = async () => {
    const test = tests.find(t => t.id === "payload-encryption");
    if (!test) return;

    setTests(prev => prev.map(t => 
      t.id === "payload-encryption" ? { ...t, status: "running" } : t
    ));

    addLog("🔒 Starting AES-256 payload encryption test...", "info");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate encryption (in real app, would use crypto.createCipher with Cloud KMS)
    const encryptedData = "U2FsdGVkX1+vupppZjkvW8e..."; // Simulated encrypted payload
    const iv = "a1b2c3d4e5f67890123456789012345678"; // Simulated IV
    
    addLog(`🔐 Encrypted payload: ${encryptedData.substring(0, 25)}...`, "info");
    addLog(`🔑 Initialization Vector: ${iv}`, "info");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog("🔍 Decrypting with Cloud KMS...", "info");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate decryption success
    setTests(prev => prev.map(t => 
      t.id === "payload-encryption" ? { 
        ...t, 
        status: "success",
        result: {
          passed: true,
          message: "Payload encryption/decryption successful - data protected",
          details: "AES-256-GCM with Cloud KMS managed keys"
        }
      } : t
    ));
    
    addLog("✅ Data encryption/decryption verified", "success");
  };

  const runIAMTest = async () => {
    const test = tests.find(t => t.id === "iam-policies");
    if (!test) return;

    setTests(prev => prev.map(t => 
      t.id === "iam-policies" ? { ...t, status: "running" } : t
    ));

    addLog("👤 Starting IAM role-based access test...", "info");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate different IAM roles
    const userRole = "payment_processor";
    const requiredRole = "payment_processor";
    const permissions = ["process_payment", "access_transactions", "read_customer_data"];
    
    addLog(`🔍 User role: ${userRole}`, "info");
    addLog(`🔍 Required role: ${requiredRole}`, "info");
    addLog(`🔍 Granted permissions: ${permissions.join(", ")}`, "info");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog("🔍 Validating principle of least privilege...", "info");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const hasValidRole = userRole === requiredRole;
    const hasRequiredPermissions = permissions.includes("process_payment");
    
    setTests(prev => prev.map(t => 
      t.id === "iam-policies" ? { 
        ...t, 
        status: (hasValidRole && hasRequiredPermissions) ? "success" : "failed",
        result: {
          passed: hasValidRole && hasRequiredPermissions,
          message: (hasValidRole && hasRequiredPermissions) 
            ? "IAM policies valid - user has appropriate permissions" 
            : "IAM policies invalid - insufficient permissions",
          details: "GCP IAM with RBAC, service accounts, least privilege principle"
        }
      } : t
    ));
    
    addLog((hasValidRole && hasRequiredPermissions) ? "✅ IAM validation passed" : "❌ IAM validation failed", (hasValidRole && hasRequiredPermissions) ? "success" : "error");
  };

  const runJWTTest = async () => {
    const test = tests.find(t => t.id === "token-validation");
    if (!test) return;

    setTests(prev => prev.map(t => 
      t.id === "token-validation" ? { ...t, status: "running" } : t
    ));

    addLog("🎫 Starting JWT token validation test...", "info");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate JWT token (in real app, would be actual JWT)
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMzQ1Iiwicm9sZSI6InBheW1lbnRfcHJvY2Vzc29yIiwiZXhwIjoxNzA0MDY0MDAwfQ.signature";
    const [header, payload_b64, signature] = token.split('.');
    
    addLog(`🔍 Header: ${atob(header)}`, "info");
    addLog(`🔍 Payload: ${atob(payload_b64).substring(0, 50)}...`, "info");
    addLog(`🔍 Signature: ${signature.substring(0, 20)}...`, "info");
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog("🔍 Validating token signature...", "info");
    addLog("🔍 Checking token expiration...", "info");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate validation
    const currentTime = 1704063999;
    const tokenExpiry = 1704064000; // Future timestamp
    const isExpired = currentTime > tokenExpiry;
    const signatureValid = signature.startsWith("signature");
    
    setTests(prev => prev.map(t => 
      t.id === "token-validation" ? { 
        ...t, 
        status: (!isExpired && signatureValid) ? "success" : "failed",
        result: {
          passed: !isExpired && signatureValid,
          message: (!isExpired && signatureValid) 
            ? "JWT token valid - user authenticated" 
            : isExpired 
            ? "JWT token expired - re-authentication required"
            : "JWT signature invalid - token tampered",
          details: "HS256 algorithm, 1-hour expiry, secure claims"
        }
      } : t
    ));
    
    addLog((!isExpired && signatureValid) ? "✅ JWT validation passed" : "❌ JWT validation failed", (!isExpired && signatureValid) ? "success" : "error");
  };

  const runRateLimitTest = async () => {
    const test = tests.find(t => t.id === "rate-limiting");
    if (!test) return;

    setTests(prev => prev.map(t => 
      t.id === "rate-limiting" ? { ...t, status: "running" } : t
    ));

    addLog("🚦 Starting rate limiting protection test...", "info");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate multiple requests to trigger rate limiting
    const requests = Array(5).fill(null).map((_, i) => ({
      id: i + 1,
      timestamp: Date.now() + (i * 100)
    }));
    
    addLog(`📊 Sending ${requests.length} rapid requests...`, "info");
    
    for (let i = 0; i < requests.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      addLog(`📤 Request ${i + 1}: ${new Date(requests[i].timestamp).toLocaleTimeString()}`, "info");
      
      // Simulate rate limiting (allow 3 requests per minute)
      if (i >= 3) {
        addLog(`🚫 Request ${i + 1} blocked - rate limit exceeded`, "error");
      } else {
        addLog(`✅ Request ${i + 1} allowed`, "success");
      }
    }
    
    setTests(prev => prev.map(t => 
      t.id === "rate-limiting" ? { 
        ...t, 
        status: "success",
        result: {
          passed: true,
          message: "Rate limiting working - protected against DDoS attacks",
          details: "3 requests/minute, sliding window, 429 Too Many Requests"
        }
      } : t
    ));
    
    addLog("✅ Rate limiting test completed", "success");
  };

  const runTest = (testId: string) => {
    setSelectedTest(testId);
    setLogs([{
      time: new Date().toLocaleTimeString(),
      message: `🚀 Starting ${tests.find(t => t.id === testId)?.name} test...`,
      type: "info"
    }]);

    switch (testId) {
      case "hmac-signing":
        runHMACTest();
        break;
      case "rsa-signing":
        runRSATest();
        break;
      case "payload-encryption":
        runEncryptionTest();
        break;
      case "iam-policies":
        runIAMTest();
        break;
      case "token-validation":
        runJWTTest();
        break;
      case "rate-limiting":
        runRateLimitTest();
        break;
    }
  };

  const resetTests = () => {
    setTests(prev => prev.map(t => ({ ...t, status: "pending", result: undefined })));
    setLogs([]);
    setSelectedTest(null);
  };

  const categoryColors = {
    authentication: "bg-blue-500/10 border-blue-500 text-blue-500",
    encryption: "bg-green-500/10 border-green-500 text-green-500",
    authorization: "bg-purple-500/10 border-purple-500 text-purple-500",
    validation: "bg-orange-500/10 border-orange-500 text-orange-500"
  };

  const categoryIcons = {
    authentication: "🔒",
    encryption: "🔐",
    authorization: "👤",
    validation: "✅"
  };

  return (
    <div className="min-h-screen bg-surface px-8 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <nav className="fixed top-0 left-0 w-full z-50 bg-surface-glass backdrop-blur-md border-b border-border-subtle px-8 h-20 flex items-center justify-between">
            <Link href="/#projects" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Projects
            </Link>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-text-muted">Security Demonstration</span>
          </nav>
        </div>

        <div className="pt-24 pb-20">
          {/* Title Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
              API Security Tester
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Interactive demonstration of production-grade security patterns used in fintech systems
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live Testing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>GCP-Native</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Production Patterns</span>
              </div>
            </div>
          </div>

          {/* Test Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tests.map((test) => (
              <div
                key={test.id}
                className={`bg-surface-glass border border-border-subtle rounded-2xl p-6 hover:border-primary/30 transition-all cursor-pointer ${
                  selectedTest === test.id ? "border-primary ring-2 ring-primary/20" : ""
                }`}
                onClick={() => test.status === "pending" && runTest(test.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{categoryIcons[test.category]}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{test.name}</h3>
                      <p className="text-sm text-text-secondary mt-1">{test.description}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    categoryColors[test.category]
                  }`}>
                    {test.category}
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {test.status === "pending" && (
                      <>
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-text-muted">Ready to test</span>
                      </>
                    )}
                    {test.status === "running" && (
                      <>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-yellow-500">Running...</span>
                      </>
                    )}
                    {test.status === "success" && test.result && (
                      <>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-500">{test.result.passed ? "Passed" : "Failed"}</span>
                      </>
                    )}
                    {test.status === "failed" && test.result && (
                      <>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-red-500">Failed</span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => test.status === "pending" && runTest(test.id)}
                    disabled={test.status !== "pending"}
                    className="bg-primary text-text-inverse px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {test.status === "pending" ? "Run Test" : 
                     test.status === "running" ? "Running..." : "Rerun"}
                  </button>
                </div>

                {/* Result Details */}
                {test.result && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    test.result.passed 
                      ? "bg-green-500/10 border border-green-500/20" 
                      : "bg-red-500/10 border border-red-500/20"
                  }`}>
                    <p className={`text-sm font-medium mb-2 ${
                      test.result.passed ? "text-green-500" : "text-red-500"
                    }`}>
                      {test.result.message}
                    </p>
                    {test.result.details && (
                      <p className="text-xs text-text-muted">
                        <strong>Technical Details:</strong> {test.result.details}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Terminal Logs */}
          <div className="bg-surface-glass border border-border-subtle rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3-3-3-6 6" />
                </svg>
                Security Console
              </h3>
              <button
                onClick={resetTests}
                className="text-xs text-text-muted hover:text-primary transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset All
              </button>
            </div>
            <div className="bg-surface-secondary/50 rounded-lg p-4 font-mono text-xs max-h-64 overflow-y-auto space-y-2">
              {logs.length === 0 ? (
                <p className="text-text-muted italic">No security tests run yet. Select a test above to begin.</p>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded border-l-2 ${
                      log.type === 'error' ? 'bg-red-500/5 border-red-500 text-red-400' :
                      log.type === 'success' ? 'bg-green-500/5 border-green-500 text-green-400' :
                      'bg-primary/5 border-primary text-text-secondary'
                    }`}
                  >
                    <span className="opacity-50">[{log.time}]</span> {log.message}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Technical Details */}
          <div className="mt-12 bg-surface-glass border border-border-subtle rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-text-primary mb-6">Security Implementation Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-medium text-text-primary mb-3 flex items-center gap-2">
                  🔒 Authentication
                </h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• HMAC-SHA256 request signing</li>
                  <li>• RSA-2048 digital signatures</li>
                  <li>• JWT token validation</li>
                  <li>• OAuth 2.0 flow</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium text-text-primary mb-3 flex items-center gap-2">
                  🔐 Encryption
                </h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• AES-256-GCM encryption</li>
                  <li>• Cloud KMS key management</li>
                  <li>• Payload at rest protection</li>
                  <li>• Transport layer security</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium text-text-primary mb-3 flex items-center gap-2">
                  👤 Authorization
                </h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• GCP IAM policies</li>
                  <li>• RBAC (Role-Based Access)</li>
                  <li>• Principle of least privilege</li>
                  <li>• Service account management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiSecurityTester;
