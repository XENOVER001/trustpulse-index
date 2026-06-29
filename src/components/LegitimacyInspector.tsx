import React, { useState, useEffect } from "react";
import { Shield, AlertTriangle, CheckCircle, Info, Sparkles, HelpCircle, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";

interface LegitimacyInspectorProps {
  theme: "light" | "dark";
  prefilledHandle?: string;
  onRedirectToDispute?: (data: {
    handle: string;
    platform: string;
    logType: "good" | "bad";
    frictionScore: number;
    reportText: string;
  }) => void;
}

// -------------------------------------------------------------
// HEURISTIC SCORING ENGINE (100% Client-side, Hardcoded Rules)
// -------------------------------------------------------------
export interface AuditResult {
  score: number;
  rating: "scam" | "suspicious" | "likely legit";
  confidence: number;
  redFlags: string[];
  greenFlags: string[];
}

export function analyzeHandlePattern(handle: string): AuditResult {
  const clean = handle.trim().toLowerCase().replace(/^@/, "");
  const redFlags: string[] = [];
  const greenFlags: string[] = [];
  let score = 0;

  if (!clean) {
    return {
      score: 0,
      rating: "likely legit",
      confidence: 0,
      redFlags: [],
      greenFlags: ["Empty input analyzed"],
    };
  }

  // Rule 1: Suspicious words/keywords
  const spamKeywords = ["support", "admin", "help", "service", "official", "verify", "team"];
  const matchedSpam = spamKeywords.filter((word) => clean.includes(word));
  if (matchedSpam.length > 0) {
    score += 3 * matchedSpam.length;
    redFlags.push(`Contains official impersonation keyword(s): ${matchedSpam.join(", ")}`);
  }

  // Rule 2: Crypto/Financial keywords
  const cryptoKeywords = ["crypto", "btc", "eth", "forex", "airdrop", "investment", "binance", "coinbase"];
  const matchedCrypto = cryptoKeywords.filter((word) => clean.includes(word));
  if (matchedCrypto.length > 0) {
    score += 4 * matchedCrypto.length;
    redFlags.push(`Contains high-risk crypto/financial keyword(s): ${matchedCrypto.join(", ")}`);
  }

  // Rule 3: Excessive consecutive numbers (4 or more digits)
  const excessiveNumbersRegex = /\d{4,}/;
  if (excessiveNumbersRegex.test(clean)) {
    score += 3;
    redFlags.push("Contains excessive consecutive numbers (4+ digits)");
  }

  // Rule 4: Repeated characters (e.g. aaaa, 1111)
  const repeatedCharRegex = /(.)\1\1\1/;
  if (repeatedCharRegex.test(clean)) {
    score += 3;
    redFlags.push("Repeated characters sequence detected (e.g., 'aaaa' or '1111')");
  }

  // Rule 5: Suspicious symbols (__, --, ..)
  const suspiciousSymbols = ["__", "--", ".."];
  const matchedSymbols = suspiciousSymbols.filter((sym) => clean.includes(sym));
  if (matchedSymbols.length > 0) {
    score += 2;
    redFlags.push(`Contains suspicious consecutive symbols: ${matchedSymbols.join(", ")}`);
  }

  // Rule 6: Very short usernames (< 5 characters)
  if (clean.length < 5) {
    score += 3;
    redFlags.push("Extremely short username (<5 characters), frequently used for throwaway accounts");
  }

  // Rule 7: Usernames with mostly numbers (greater than 60% numeric)
  const digitCount = (clean.match(/\d/g) || []).length;
  const numRatio = clean.length > 0 ? digitCount / clean.length : 0;
  if (numRatio > 0.6) {
    score += 3;
    redFlags.push(`Mostly numbers pattern detected (${Math.round(numRatio * 100)}% numeric characters)`);
  }

  // Rule 8: Random/gibberish patterns (low vowel count)
  // For strings with length >= 5, check if they have less than 15% vowels or no vowels at all.
  const vowels = clean.match(/[aeiouy]/g) || [];
  const vowelRatio = clean.length > 0 ? vowels.length / clean.length : 0;
  if (clean.length >= 5 && vowelRatio < 0.15) {
    score += 4;
    redFlags.push(`Gibberish/unreadable structure (low vowel density: ${Math.round(vowelRatio * 100)}%)`);
  }

  // Rule 9: Positive signal - Balanced letters and numbers (only trailing digits, normal letters)
  const trailingDigitsRegex = /^[a-z]+[0-9]{0,2}$/;
  if (trailingDigitsRegex.test(clean) && clean.length >= 6 && clean.length <= 15) {
    score -= 2;
    greenFlags.push("Username looks normal (no random numbers or letters)");
  }

  // Rule 10: Positive signal - Natural vowel readable structure
  if (clean.length >= 5 && vowelRatio >= 0.25 && vowelRatio <= 0.5 && !/\d/.test(clean)) {
    score -= 2;
    greenFlags.push("Username looks readable and natural (has balanced vowels and consonants)");
  }

  // Rule 11: Positive signal - Absolute absence of any risky spam/crypto keywords
  if (matchedSpam.length === 0 && matchedCrypto.length === 0) {
    score -= 1;
    greenFlags.push("No suspicious keywords (doesn't use fake customer support terms)");
  }

  // Final Output mapping
  let rating: "scam" | "suspicious" | "likely legit" = "likely legit";
  if (score >= 6) {
    rating = "scam";
  } else if (score >= 2) {
    rating = "suspicious";
  }

  // Calculate dynamic confidence percentage based on signal strength
  // More total signals means higher assessment confidence
  const totalSignals = redFlags.length + greenFlags.length;
  let confidence = 50; // base confidence
  if (totalSignals > 0) {
    confidence = Math.min(95, 50 + totalSignals * 10);
  }
  // If the score is extreme, we have high confidence
  if (score >= 10 || score <= -3) {
    confidence = Math.min(98, confidence + 15);
  }

  return {
    score,
    rating,
    confidence,
    redFlags,
    greenFlags,
  };
}

export default function LegitimacyInspector({ theme, prefilledHandle, onRedirectToDispute }: LegitimacyInspectorProps) {
  const [handle, setHandle] = useState(prefilledHandle || "");
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({
    unsolicited: false,
    cryptoPay: false,
    guarantees: false,
    lowEngagement: false,
    recoveryFee: false,
  });

  const [result, setResult] = useState<AuditResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Update handle if prefilledHandle prop updates
  useEffect(() => {
    if (prefilledHandle) {
      setHandle(prefilledHandle);
    }
  }, [prefilledHandle]);

  const questionsList = [
    {
      id: "unsolicited",
      label: "Did they message you first without permission?",
      weight: 3,
      description: "Scammers often slide into your DMs offering \"exclusive deals\" or fake support help.",
    },
    {
      id: "cryptoPay",
      label: "Do they ask for crypto, gift cards, or p2p apps?",
      weight: 4,
      description: "Asking for non refundable payments like bitcoin, gift cards, zelle, or venmo is a major red flag.",
    },
    {
      id: "guarantees",
      label: "Do they promise guaranteed profits or zero risk?",
      weight: 4,
      description: "Claims of making \"easy, risk-free money\" are always fake and deceptive.",
    },
    {
      id: "lowEngagement",
      label: "Does the profile have lots of followers but no likes or comments?",
      weight: 2,
      description: "A high follower count with zero engagement usually means they bought fake bots accounts.",
    },
    {
      id: "recoveryFee",
      label: "Do they claim they can recover lost funds or hack accounts for a fee?",
      weight: 3,
      description: "'Recovery scammers' promise to get your money back if you pay them an upfront fee.",
    },
  ];

  const handleReset = () => {
    setHandle("");
    setCheckedQuestions({
      unsolicited: false,
      cryptoPay: false,
      guarantees: false,
      lowEngagement: false,
      recoveryFee: false,
    });
    setResult(null);
  };

  const handleRunAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      // 1. Analyze handle string pattern
      const handleAnalysis = analyzeHandlePattern(handle);

      // 2. Add question weights to the score
      let finalScore = handleAnalysis.score;
      const questionRedFlags: string[] = [];

      questionsList.forEach((q) => {
        if (checkedQuestions[q.id]) {
          finalScore += q.weight;
          questionRedFlags.push(`Behavior: ${q.label} (Risk Weight +${q.weight})`);
        }
      });

      // 3. Re-evaluate rating based on total combined scores
      let finalRating: "scam" | "suspicious" | "likely legit" = "likely legit";
      if (finalScore >= 7) {
        finalRating = "scam";
      } else if (finalScore >= 3) {
        finalRating = "suspicious";
      }

      // Re-calculate confidence with questions answered
      const activeQuestionsCount = Object.values(checkedQuestions).filter(Boolean).length;
      const totalSignals = handleAnalysis.redFlags.length + handleAnalysis.greenFlags.length + activeQuestionsCount;
      let finalConfidence = Math.min(99, 55 + totalSignals * 8);

      setResult({
        score: finalScore,
        rating: finalRating,
        confidence: finalConfidence,
        redFlags: [...handleAnalysis.redFlags, ...questionRedFlags],
        greenFlags: handleAnalysis.greenFlags,
      });

      setIsAnalyzing(false);
    }, 600); // realistic scanning pause
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-4">
      {/* HEADER SECTION */}
      <div className={`p-6 rounded-2xl border ${
        theme === "dark" 
          ? "bg-zinc-900/60 border-zinc-800" 
          : "bg-white border-zinc-200"
      } shadow-sm space-y-3`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
            <Shield className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h1 className={`text-xl font-extrabold tracking-tight ${
              theme === "dark" ? "text-zinc-50" : "text-zinc-950"
            }`}>
              Legit Checker
            </h1>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono tracking-widest uppercase font-bold mt-0.5">
              Instant Dynamic Diagnostic Tool
            </p>
          </div>
        </div>
        <p className={`text-sm leading-relaxed desc-text ${
          theme === "dark" ? "text-zinc-300" : "text-zinc-700"
        }`}>
          Evaluate unindexed, unverified accounts before you interact. Our fully rule-based, local scanner runs pattern detection algorithms on the username itself and combines your transaction signals to calculate an immediate probability estimation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* INPUT AND DIAGNOSTIC QUESTIONS */}
        <form onSubmit={handleRunAudit} className={`md:col-span-7 p-6 rounded-2xl border space-y-6 ${
          theme === "dark" ? "bg-zinc-900/60 border-zinc-800" : "bg-white border-zinc-200"
        }`}>
          {/* Handle Input */}
          <div className="space-y-2">
            <label className={`text-xs font-black uppercase tracking-wider block ${
              theme === "dark" ? "text-zinc-400" : "text-zinc-600"
            }`}>
              ENTER ACCOUNT USERNAME OR HANDLE
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-zinc-400 font-bold font-mono">@</span>
              <input
                type="text"
                required
                placeholder="eg. support_official_helper394"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className={`block w-full pl-8 pr-4 py-2.5 rounded-xl text-sm font-semibold border ${
                  theme === "dark"
                    ? "bg-zinc-950 border-zinc-800 text-zinc-50 placeholder-zinc-700 focus:border-blue-500/50"
                    : "bg-zinc-50 border-zinc-300 text-zinc-950 placeholder-zinc-400 focus:border-blue-500"
                } focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all`}
              />
            </div>
            <p className="text-[10px] text-zinc-500 leading-tight">
              Type the username without space or commas. Example: <code className="font-mono bg-zinc-100 dark:bg-zinc-900 px-1 py-0.5 rounded">help_verify_btc_99</code>
            </p>
          </div>

          {/* Interactive Questions */}
          <div className="space-y-4">
            <label className={`text-xs font-black uppercase tracking-wider block ${
              theme === "dark" ? "text-zinc-400" : "text-zinc-600"
            }`}>
              CHECK ANY WARNING SIGNS THAT APPLY
            </label>
            
            <div className="space-y-3.5">
              {questionsList.map((q) => (
                <div
                  key={q.id}
                  onClick={() => setCheckedQuestions(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 select-none ${
                    checkedQuestions[q.id]
                      ? theme === "dark"
                        ? "bg-rose-500/5 border-rose-500/40 text-zinc-100"
                        : "bg-rose-50/40 border-rose-200 text-zinc-900"
                      : theme === "dark"
                        ? "bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700 text-zinc-400"
                        : "bg-zinc-50/50 border-zinc-200 hover:border-zinc-300 text-zinc-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checkedQuestions[q.id]}
                    onChange={() => {}} // handled by parent div click
                    className="mt-0.5 rounded border-zinc-300 text-rose-600 focus:ring-rose-500 h-4 w-4 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <span className="text-xs sm:text-sm font-extrabold block leading-tight">{q.label}</span>
                    <span className="text-[10px] text-zinc-500 block leading-tight">{q.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isAnalyzing || !handle.trim()}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Diagnostic Algorithms...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start safety check</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={`px-4 py-2.5 rounded-xl border font-black text-xs transition-colors cursor-pointer ${
                theme === "dark"
                  ? "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
                  : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:text-zinc-900"
              }`}
            >
              clear all
            </button>
          </div>
        </form>

        {/* DIAGNOSTIC AUDIT RESULTS */}
        <div className="md:col-span-5 space-y-4">
          {!result ? (
            <div className={`p-6 rounded-2xl border text-center h-full flex flex-col items-center justify-center space-y-3 min-h-[300px] ${
              theme === "dark" ? "bg-zinc-900/40 border-zinc-800" : "bg-white border-zinc-200"
            }`}>
              <HelpCircle className="w-10 h-10 text-zinc-400 dark:text-zinc-600 stroke-[1.5]" />
              <div className="space-y-1 max-w-[240px]">
                <h4 className={`text-sm font-black ${
                  theme === "dark" ? "text-zinc-300" : "text-zinc-800"
                }`}>
                  Awaiting Assessment Input
                </h4>
                <p className="text-xs text-zinc-500 desc-text">
                  Fill in the handle above and flag any observed interactive behaviors to compile an instant score.
                </p>
              </div>
            </div>
          ) : (
            <div className={`p-6 rounded-2xl border space-y-5 animate-scale-up ${
              result.rating === "scam"
                ? theme === "dark"
                  ? "bg-rose-950/15 border-rose-900/50"
                  : "bg-rose-50/40 border-rose-200"
                : result.rating === "suspicious"
                ? theme === "dark"
                  ? "bg-amber-950/15 border-amber-900/50"
                  : "bg-amber-50/40 border-amber-200"
                : theme === "dark"
                ? "bg-emerald-950/15 border-emerald-900/50"
                : "bg-emerald-50/40 border-emerald-200"
            }`}>
              {/* Rating Title */}
              <div className="flex items-center justify-between border-b pb-4 border-zinc-200/50 dark:border-zinc-800/50">
                <div>
                  <span className={`text-[10px] block font-black uppercase tracking-wider ${
                    result.rating === "scam" ? "text-rose-500" : result.rating === "suspicious" ? "text-amber-500" : "text-emerald-500"
                  }`}>
                    RISK ASSESSMENT
                  </span>
                  <h3 className={`text-xl font-extrabold capitalize ${
                    theme === "dark" ? "text-zinc-50" : "text-zinc-950"
                  }`}>
                    status: {result.rating === "likely legit" ? "likely legit" : result.rating}
                  </h3>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  result.rating === "scam" ? "bg-rose-500/10 text-rose-500" : result.rating === "suspicious" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                }`}>
                  {result.rating === "scam" ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : result.rating === "suspicious" ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-bold">confidence level</span>
                  <span className={`font-mono font-extrabold ${
                    result.rating === "scam" ? "text-rose-500" : result.rating === "suspicious" ? "text-amber-500" : "text-emerald-500"
                  }`}>{result.confidence}%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      result.rating === "scam" ? "bg-rose-600" : result.rating === "suspicious" ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              {/* Score Value */}
              <div className="flex items-center justify-between text-xs font-mono bg-zinc-100/50 dark:bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
                <span className="text-zinc-500">risk score:</span>
                <span className="font-extrabold text-zinc-900 dark:text-zinc-100">{result.score} pts</span>
              </div>

              {/* Red Flags & Signals matched */}
              {result.redFlags.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-zinc-500 block font-black uppercase card-header">Warning Signs Found</span>
                  <ul className="space-y-1">
                    {result.redFlags.map((flag, idx) => (
                      <li key={idx} className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-start gap-1.5 leading-relaxed">
                        <span className="text-rose-500 mt-0.5">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Green Flags matched */}
              {result.greenFlags.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] text-zinc-500 block font-black uppercase card-header">Good Signs Found</span>
                  <ul className="space-y-1">
                    {result.greenFlags.map((flag, idx) => (
                      <li key={idx} className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-start gap-1.5 leading-relaxed">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Report Account Action Button */}
              {onRedirectToDispute && (
                <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      const reportLines: string[] = [];
                      if (checkedQuestions.unsolicited) reportLines.push("- Messaged first without permission.");
                      if (checkedQuestions.cryptoPay) reportLines.push("- Asked for non-refundable payment (crypto, gift cards, or P2P apps).");
                      if (checkedQuestions.guarantees) reportLines.push("- Promised guaranteed profits or zero risk.");
                      if (checkedQuestions.lowEngagement) reportLines.push("- Profile has lots of followers but no engagement.");
                      if (checkedQuestions.recoveryFee) reportLines.push("- Claimed they can recover lost funds or hack accounts for a fee.");

                      const checkedLabels = reportLines.length > 0 
                        ? "\n" + reportLines.join("\n") 
                        : " None checked.";

                      const combinedText = `Safety scan for @${handle} on Legit Checker.
Risk Score: ${result.score} pts (Confidence Level: ${result.confidence}%).
Heuristic Status: ${result.rating}.

Observed warning signs:${checkedLabels}`;

                      onRedirectToDispute({
                        handle: handle.trim(),
                        platform: "Web / Social App",
                        logType: result.rating === "likely legit" ? "good" : "bad",
                        frictionScore: result.rating === "scam" ? 3 : result.rating === "suspicious" ? 2 : 1,
                        reportText: combinedText,
                      });
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <span>⚠️ Report Account & File Dispute</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* disclaimer notice */}
              <div className="text-[10px] text-zinc-400/80 dark:text-zinc-500 leading-relaxed border-t border-zinc-200/50 dark:border-zinc-800/50 pt-3 flex gap-1.5">
                <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <p>
                  <strong>DISCLAIMER:</strong> This tool scans for common scam patterns to give an estimate. It is not a 100% guarantee. Always verify a user's identity before sending any money.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
