import React from "react";
import { 
  ChevronLeft, 
  CheckCircle2, 
  BarChart2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  TrendingUp 
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts";
import { AnimatePresence, motion } from "motion/react";

// Matches core DisputeEntry in App.tsx
interface DisputeEntry {
  id: string;
  handle: string;
  platform: string;
  frictionScore: number;
  reportText: string;
  timestamp: string;
  logType?: "good" | "bad";
}

// Matches core DeterministicAccount in App.tsx
interface DeterministicAccount {
  handle: string;
  isLegit: boolean;
  platform: string;
  reportCount: number;
  trustScore: number;
  frictionScore: number;
  reports: string[];
  id: string;
  isJumpTask?: boolean;
  isJumpTaskClone?: boolean;
  cloneWarning?: string;
}

interface ResultsViewProps {
  theme: "light" | "dark";
  activeSearchTerm: string;
  isWhitelistedEntity: boolean;
  matchedEntries: DisputeEntry[];
  searchedAccountDetail: DeterministicAccount | null;
  
  // AI Diagnostics States & Handlers
  showAIFallback: boolean;
  setShowAIFallback: (val: boolean) => void;
  aiInputText: string;
  setAiInputText: (val: string) => void;
  aiResult: { frictionScore: string; bulletPoints: string[] } | null;
  aiError: string | null;
  aiLoading: boolean;
  cooldownTime: number;
  triggerLinguisticAnalysis: () => void;

  // Local Analytics Expansion
  showLocalAnalytics: boolean;
  setShowLocalAnalytics: (val: boolean) => void;
  getCalculatedAnalytics: () => {
    totalGood: number;
    totalBad: number;
    chartData: { name: string; trust: number; friction: number }[];
    statusText: string;
    scoreLabel: string;
    scoreValue: string;
  };
  onBack: () => void;
  onInspectHandle?: (handle: string) => void;
}

export function ResultsView({
  theme,
  activeSearchTerm,
  isWhitelistedEntity,
  matchedEntries,
  searchedAccountDetail,
  showAIFallback,
  setShowAIFallback,
  aiInputText,
  setAiInputText,
  aiResult,
  aiError,
  aiLoading,
  cooldownTime,
  triggerLinguisticAnalysis,
  showLocalAnalytics,
  setShowLocalAnalytics,
  getCalculatedAnalytics,
  onBack,
  onInspectHandle
}: ResultsViewProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back to search action row */}
      <div className="flex items-center justify-between border-b border-zinc-250/30 dark:border-zinc-800/50 pb-4">
        <button
          type="button"
          onClick={onBack}
          className={`inline-flex items-center space-x-1 text-xs font-black hover:underline cursor-pointer ${
            theme === "dark" ? "text-zinc-400" : "text-zinc-700"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Search Directory</span>
        </button>

        <div className="text-[11px] font-mono font-black text-zinc-500">
          Audited: <span className="text-blue-600 dark:text-blue-400">"{activeSearchTerm}"</span>
        </div>
      </div>

      {/* RESULTS CONTENT: Free flow, border-free, clean typography layout */}
      <div className="space-y-8">
        
        {/* CASE A: Whitelisted Entity */}
        {isWhitelistedEntity && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-emerald-600 text-white rounded-xl px-3 py-1 font-extrabold flex items-center gap-1.5 text-[10px] sm:text-xs tracking-wider uppercase font-mono shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>System Verified Corporate Whitelist</span>
                </div>
                
                {/* View Analytics Icon/Button (Calculates and toggles real stats) */}
                <button
                  onClick={() => setShowLocalAnalytics(!showLocalAnalytics)}
                  className={`inline-flex items-center space-x-1.5 text-xs font-black px-3 py-1 rounded-xl border transition-all cursor-pointer ${
                    showLocalAnalytics 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-600/20"
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>{showLocalAnalytics ? "Hide Analytics" : "View Analytics"}</span>
                </button>
              </div>

              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${
                theme === "dark" ? "text-zinc-50" : "text-zinc-950"
              }`}>
                Globally Verified Corporate Institution Safe Status
              </h2>
              
              <p className={`text-sm leading-relaxed ${
                theme === "dark" ? "text-zinc-300" : "text-zinc-700"
              }`}>
                The queried entity <strong className="font-mono text-blue-600 dark:text-blue-400">"{activeSearchTerm}"</strong> belongs to a validated institutional public brand. Operational indicators hold 100% integrity rating. All user filing capability is systematically bypassed.
              </p>
            </div>

            {/* General Whitelisted Details (Free layout, no heavy boxes) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs font-semibold">
              <div className="space-y-3">
                <h4 className={`text-xs uppercase font-mono tracking-wider font-black ${
                  theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                }`}>
                  Registry Metrics
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm font-bold">
                  <div>
                    <span className="text-[10px] text-zinc-500 block font-black uppercase">Trust Level</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base">100% Secure</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block font-black uppercase">Reports Index</span>
                    <span className="text-zinc-800 dark:text-zinc-100 font-extrabold text-base">0 Warnings</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block font-black uppercase">Status Code</span>
                    <span className="font-mono text-zinc-800 dark:text-zinc-100 font-extrabold text-base">SYSTEM_WHITE</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block font-black uppercase">Verification Type</span>
                    <span className="text-zinc-800 dark:text-zinc-100 font-extrabold text-base">Official Whitelist</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className={`text-xs uppercase font-mono tracking-wider font-black ${
                  theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                }`}>
                  Operational Safeties
                </h4>
                <p className={`text-xs font-medium leading-relaxed ${
                  theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                }`}>
                  This account has been verified through TrustPulse Index's rigorous enterprise verification protocols. Standard third-party dispute logs are locked to prevent malicious negative filing operations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CASE B: Local Organic Disputes */}
        {!isWhitelistedEntity && matchedEntries.length > 0 && (() => {
          const goodCount = matchedEntries.filter(e => e.logType === "good" || (!e.logType && e.frictionScore === 1)).length;
          const badCount = matchedEntries.filter(e => e.logType === "bad" || (!e.logType && e.frictionScore > 1)).length;

          let overallStatus: "green" | "yellow" | "orange" | "red" = "red";
          let statusText = "";
          let descriptionText = "";

          if (goodCount > 0 && badCount === 0) {
            overallStatus = "green";
            statusText = "COMMUNITY APPROVED SAFE";
            descriptionText = `The handle "${activeSearchTerm}" is logged as completely good and trustworthy by ${goodCount} user(s). No transaction friction has been reported.`;
          } else if (badCount > 0 && goodCount === 0) {
            const maxFriction = Math.max(...matchedEntries.filter(e => e.logType !== "good").map(e => e.frictionScore), 1);
            if (maxFriction === 1) {
              overallStatus = "yellow";
              statusText = "UNVERIFIED SAFETY STATUS";
              descriptionText = `Low transaction friction has been logged by ${badCount} user(s). Profile holds moderate safety but lacks official whitelisting.`;
            } else if (maxFriction === 2) {
              overallStatus = "orange";
              statusText = "SUSPICIOUS PROFILE ALERT";
              descriptionText = `Moderate friction reports logged by ${badCount} user(s). Community warnings indicate transaction delays or communication risk.`;
            } else {
              overallStatus = "red";
              statusText = "VERIFIED SCAM WARNING - HIGH RISK";
              descriptionText = `Critical warnings identified on database indices. Severe transaction disputes logged by ${badCount} user(s).`;
            }
          } else if (goodCount > 0 && badCount > 0) {
            const smaller = Math.min(goodCount, badCount);
            const difference = Math.abs(goodCount - badCount);
            const pctDiff = (difference / smaller) * 100;

            if (goodCount > badCount) {
              if (pctDiff > 20) {
                overallStatus = "green";
                statusText = pctDiff >= 40 ? "COMMUNITY CERTIFIED SECURE" : "COMMUNITY APPROVED SAFE";
                descriptionText = `The community rating is overwhelmingly positive (${goodCount} Good vs ${badCount} Bad). Because positive difference exceeds threshold margins, profile is listed safe.`;
              } else {
                overallStatus = "yellow";
                statusText = "MIXED RATINGS - UNVERIFIED SAFETY";
                descriptionText = `Contested ratings detected (${goodCount} Good vs ${badCount} Bad). Since feedback margins are narrow, safety remains unverified.`;
              }
            } else {
              const maxFriction = Math.max(...matchedEntries.filter(e => e.logType === "bad" || (!e.logType && e.frictionScore > 1)).map(e => e.frictionScore), 1);
              if (maxFriction === 1) {
                overallStatus = "yellow";
                statusText = "MIXED RATINGS - MINOR FRICTION";
                descriptionText = `Mixed feedback with negative reviews leading (${badCount} Bad vs ${goodCount} Good). Minor friction reported.`;
              } else if (maxFriction === 2) {
                overallStatus = "orange";
                statusText = "MIXED RATINGS - SUSPICIOUS PROFILE";
                descriptionText = `Mixed feedback with negative reviews leading (${badCount} Bad vs ${goodCount} Good). Moderate friction score 2 reported.`;
              } else {
                overallStatus = "red";
                statusText = "MIXED RATINGS - HIGH RISK WARNING";
                descriptionText = `Mixed feedback with severe negative reviews leading (${badCount} Bad vs ${goodCount} Good). High friction level 3 reported.`;
              }
            }
          }

          // Determine styling properties
          let badgeBg = "bg-red-600";
          let textAccentColor = "text-rose-600 dark:text-rose-400";
          if (overallStatus === "green") {
            badgeBg = "bg-emerald-600";
            textAccentColor = "text-emerald-600 dark:text-emerald-400";
          } else if (overallStatus === "yellow") {
            badgeBg = "bg-amber-500 text-black";
            textAccentColor = "text-amber-600 dark:text-amber-500";
          } else if (overallStatus === "orange") {
            badgeBg = "bg-orange-600";
            textAccentColor = "text-orange-600 dark:text-orange-400";
          }

          return (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className={`${badgeBg} text-white rounded-xl px-3 py-1 font-extrabold flex items-center gap-1.5 text-[10px] sm:text-xs tracking-wider uppercase font-mono shadow-sm`}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{statusText}</span>
                  </div>
                  
                  {/* View Analytics Icon/Button */}
                  <button
                    onClick={() => setShowLocalAnalytics(!showLocalAnalytics)}
                    className={`inline-flex items-center space-x-1.5 text-xs font-black px-3 py-1 rounded-xl border transition-all cursor-pointer ${
                      showLocalAnalytics 
                        ? "bg-blue-600 text-white border-blue-600" 
                        : "bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-600/20"
                    }`}
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>{showLocalAnalytics ? "Hide Analytics" : "View Analytics"}</span>
                  </button>
                </div>

                <h2 className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${
                  theme === "dark" ? "text-zinc-50" : "text-zinc-950"
                }`}>
                  Interactive Crowdsourced Ledger Analysis
                </h2>
                
                <p className={`text-sm leading-relaxed desc-text ${
                  theme === "dark" ? "text-zinc-300" : "text-zinc-700"
                }`}>
                  {descriptionText}
                </p>
              </div>

              {/* Ratings Grid (Free layout, no heavy boxes) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs font-semibold">
                <div>
                  <span className="text-[10px] text-zinc-500 block font-black uppercase card-header">Good Ratings</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base counter-val">👍 {goodCount} User{goodCount !== 1 ? 's' : ''}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block font-black uppercase card-header">Bad Ratings</span>
                  <span className="text-rose-600 dark:text-rose-400 font-extrabold text-base counter-val">👎 {badCount} User{badCount !== 1 ? 's' : ''}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block font-black uppercase card-header">Max Friction Score</span>
                  <span className={`font-extrabold text-base score-val ${textAccentColor}`}>
                    {matchedEntries[0]?.frictionScore || 3}/3
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block font-black uppercase card-header">Total Active claims</span>
                  <span className="text-zinc-800 dark:text-zinc-100 font-extrabold text-base counter-val">{matchedEntries.length} Disputes</span>
                </div>
              </div>

              {/* Chronological logs */}
              <div className="space-y-4 pt-6">
                <h4 className={`text-xs uppercase font-mono tracking-wider font-black ${
                  theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                }`}>
                  Chronological Public Dispute Records ({matchedEntries.length})
                </h4>
                <div className="space-y-4">
                  {matchedEntries.map((log) => {
                    const isLogGood = log.logType === "good" || (!log.logType && log.frictionScore === 1);
                    return (
                      <div key={log.id} className={`py-4 border-b transition-colors ${
                        theme === "dark" ? "border-zinc-900" : "border-zinc-200"
                      }`}>
                        <div className="flex items-center justify-between text-[10px] font-mono font-black text-zinc-500 pb-1.5">
                          <span className="flex items-center gap-1.5">
                            <span>ID: {log.id}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold ${isLogGood ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/15 text-rose-600 dark:text-rose-400"}`}>
                              {isLogGood ? "👍 Good" : "👎 Friction"}
                            </span>
                            <span>Friction: {log.frictionScore}/3</span>
                          </span>
                          <span>{log.timestamp}</span>
                        </div>
                        <p className={`text-sm leading-relaxed font-semibold review-text ${
                          theme === "dark" ? "text-zinc-200" : "text-zinc-800"
                        }`}>{log.reportText}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* CASE C: Deterministic Catalog */}
        {!isWhitelistedEntity && matchedEntries.length === 0 && searchedAccountDetail && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className={`${
                  searchedAccountDetail.isLegit ? "bg-emerald-600" : "bg-red-600"
                } text-white rounded-xl px-3 py-1 font-extrabold flex items-center gap-1.5 text-[10px] sm:text-xs tracking-wider uppercase font-mono shadow-sm`}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{searchedAccountDetail.isLegit ? "VERIFIED LEGIT PROFILE" : "VERIFIED WARNING ALERT"}</span>
                </div>
                
                {/* View Analytics Icon/Button */}
                <button
                  onClick={() => setShowLocalAnalytics(!showLocalAnalytics)}
                  className={`inline-flex items-center space-x-1.5 text-xs font-black px-3 py-1 rounded-xl border transition-all cursor-pointer ${
                    showLocalAnalytics 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-600/20"
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>{showLocalAnalytics ? "Hide Analytics" : "View Analytics"}</span>
                </button>
              </div>

              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${
                theme === "dark" ? "text-zinc-50" : "text-zinc-950"
              }`}>
                {searchedAccountDetail.isLegit ? "Verified Registry Security profile Found" : "Scam Warning Signals Identified on Profile"}
              </h2>
              
              <p className={`text-sm leading-relaxed ${
                theme === "dark" ? "text-zinc-300" : "text-zinc-700"
              }`}>
                {searchedAccountDetail.isLegit
                  ? `The handle "${searchedAccountDetail.handle}" matches verified registration signatures and whitelisted criteria. operational integrity holds maximum clear status.`
                  : `The handle "${searchedAccountDetail.handle}" matches validated warning indicators inside our decentralized dispute indices. Risk warnings have been flagged.`}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs font-semibold">
              <div>
                <span className="text-[10px] text-zinc-500 block font-black uppercase">Database Index</span>
                <span className="text-zinc-800 dark:text-zinc-100 font-extrabold text-base font-mono">{searchedAccountDetail.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block font-black uppercase">Interaction Platform</span>
                <span className="text-zinc-800 dark:text-zinc-100 font-extrabold text-base">{searchedAccountDetail.platform}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block font-black uppercase">Friction Level</span>
                <span className={`font-extrabold text-base ${searchedAccountDetail.isLegit ? "text-emerald-600" : "text-rose-600"}`}>
                  {searchedAccountDetail.frictionScore}/5
                </span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block font-black uppercase">Safety Verdict</span>
                <span className={`font-extrabold text-base ${searchedAccountDetail.isLegit ? "text-emerald-600" : "text-rose-600"}`}>
                  {searchedAccountDetail.isLegit ? "Legitimate" : "Flagged Scam"}
                </span>
              </div>
            </div>

            {/* Direct Report details */}
            <div className="pt-4 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-black block">Direct Registry Notes:</span>
              <p className={`text-sm leading-relaxed font-semibold ${
                theme === "dark" ? "text-zinc-200" : "text-zinc-800"
              }`}>
                {searchedAccountDetail.reports[0]}
              </p>
            </div>

            {/* Custom JumpTask warning blocks */}
            {searchedAccountDetail.isJumpTask && (
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                <h4 className="text-sm font-black text-amber-700 dark:text-amber-500 uppercase tracking-wider font-mono">
                  ⚠️ Impersonator & Typosquatting Warning Info
                </h4>
                <p className={`text-xs leading-relaxed ${
                  theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                }`}>
                  Because <strong className="font-bold">JumpTask</strong> is a popular global microtask platform, cybercriminals frequently register fake lookalike domains and clones (.cc, .vip, .top) to compromise Web3 wallets or demand advance fee payments. Always check guidelines:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold pt-2">
                  <div className="space-y-2">
                    <span className="text-rose-600 dark:text-rose-400 block font-black uppercase">🛑 Deceptive Clones Spotted</span>
                    <div className="space-y-1 font-mono text-[11px]">
                      <p className="text-rose-700 dark:text-rose-300 font-bold">• jumptusk.cc (Vowel swapping scam)</p>
                      <p className="text-rose-700 dark:text-rose-300 font-bold">• jumptask-app.com (Credential theft)</p>
                      <p className="text-rose-700 dark:text-rose-300 font-bold">• jumptask.top (Fake cash deposit rewards)</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-emerald-600 dark:text-emerald-400 block font-black uppercase">🛡️ Official Check</span>
                    <p className="text-zinc-500 font-medium">Real JumpTask portal is strictly hosted at <a href="https://jumptask.io" target="_blank" rel="noreferrer" className="text-blue-600 underline font-extrabold">jumptask.io</a>. Zero advance deposit fee transfers are ever demanded to withdraw rewards.</p>
                  </div>
                </div>
              </div>
            )}

            {searchedAccountDetail.isJumpTaskClone && (
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                <h4 className="text-sm font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider font-mono animate-pulse">
                  🛑 CRITICAL FRAUD CLONE DETECTED
                </h4>
                <p className={`text-xs leading-relaxed ${
                  theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                }`}>
                  The identifier <strong className="font-mono text-rose-600 dark:text-rose-400">"{searchedAccountDetail.handle}"</strong> is verified as a copycat scam platform designed to impersonate JumpTask. Do not sign smart contracts or send any funds to this site.
                </p>
                <a 
                  href="https://jumptask.io" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center space-x-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl transition-all w-fit"
                >
                  <span>Navigate to Official whitelisted JumpTask Portal (jumptask.io)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* CASE D: Zero Match Fallback */}
        {!isWhitelistedEntity && matchedEntries.length === 0 && !searchedAccountDetail && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-zinc-500/15 border border-zinc-500/35 text-zinc-600 dark:text-zinc-400 rounded-xl px-3 py-1 font-extrabold flex items-center gap-1.5 text-[10px] sm:text-xs tracking-wider uppercase font-mono shadow-sm">
                  <AlertTriangle className="w-3.5 h-3.5 text-zinc-500" />
                  <span>NOT YET VERIFIED (NEITHER GOOD NOR BAD)</span>
                </div>
              </div>

              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${
                theme === "dark" ? "text-zinc-50" : "text-zinc-950"
              }`}>
                Safety Status: Unverified
              </h2>
              
              <p className={`text-sm leading-relaxed desc-text ${
                theme === "dark" ? "text-zinc-300" : "text-zinc-700"
              }`}>
                The queried account, domain, or handle <strong className="font-mono text-zinc-900 dark:text-zinc-100">"{activeSearchTerm}"</strong> is not indexed in our verified database. The safety status is currently unverified, meaning there are neither positive trust records nor reported active disputes for this handle. TrustPulse Index only registers and displays results on accounts we have verified or flagged.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {onInspectHandle && (
                <button
                  type="button"
                  onClick={() => onInspectHandle(activeSearchTerm)}
                  className="px-4.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  <span>🕵️ Use Legitimacy Inspector for "{activeSearchTerm}"</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowAIFallback(!showAIFallback)}
                className={`px-4 py-2.5 font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  theme === "dark"
                    ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                    : "bg-zinc-100 hover:bg-zinc-250 text-zinc-850"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{showAIFallback ? "Hide AI Diagnostics" : "Scan Communication Risks"}</span>
              </button>
            </div>

            {/* AI HEURISTICS BOX */}
            {showAIFallback && (
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4 animate-fade-in">
                <div className="space-y-1">
                  <h4 className={`text-sm font-black ${
                    theme === "dark" ? "text-zinc-100" : "text-zinc-900"
                  }`}>
                    Linguistic Risk Auditor (Gemini-Powered)
                  </h4>
                  <p className={`text-xs ${
                    theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                  }`}>
                    Paste conversational scripts, caption bios, or pitch text. Gemini evaluates high-pressure or coercive syntax cues.
                  </p>
                </div>

                <div className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="Paste Telegram pitches, Instagram caption text, or messages received here..."
                    value={aiInputText}
                    onChange={(e) => setAiInputText(e.target.value)}
                    className={`block w-full p-4 border rounded-xl text-xs sm:text-sm font-semibold ${
                      theme === "dark"
                        ? "bg-zinc-900 border-zinc-800 text-zinc-50 placeholder-zinc-600"
                        : "bg-white border-zinc-350 text-zinc-950 placeholder-zinc-400"
                    }`}
                  />

                  {aiError && (
                    <p className="text-xs text-rose-600 font-bold">{aiError}</p>
                  )}

                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <span className="text-[10px] text-zinc-400 font-mono font-bold flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>Queries are rate-limited to prevent API exhaustion.</span>
                    </span>

                    <button
                      type="button"
                      disabled={aiLoading || cooldownTime > 0}
                      onClick={triggerLinguisticAnalysis}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400"
                    >
                      {aiLoading ? (
                        <span>Analyzing text...</span>
                      ) : cooldownTime > 0 ? (
                        <span>Cooldown ({cooldownTime}s)</span>
                      ) : (
                        <span>Run Security Scan</span>
                      )}
                    </button>
                  </div>

                  {aiResult && (
                    <div className={`p-5 rounded-xl border space-y-3 ${
                      theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-blue-50/50 border-blue-200"
                    }`}>
                      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <span className="text-[9px] font-mono uppercase bg-blue-600/15 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-black">NLP Scanner Findings</span>
                        <span className={`text-xs font-mono font-black px-2 py-0.5 rounded border ${
                          aiResult.frictionScore.toLowerCase().includes("high")
                            ? "text-rose-600 bg-rose-50 border-rose-200"
                            : "text-emerald-600 bg-emerald-50 border-emerald-200"
                        }`}>
                          Risk Level: {aiResult.frictionScore}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-zinc-400 uppercase font-black block">Urgency and Coercion Markers:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-semibold">
                          {aiResult.bulletPoints.map((bp, i) => (
                            <div key={i} className={`p-3 rounded-lg border flex items-start space-x-2 ${
                              theme === "dark" ? "bg-zinc-950 border-zinc-900" : "bg-white border-zinc-150"
                            }`}>
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                              <span>{bp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* DYNAMIC VIEW ANALYTICS EXPANDABLE BLOCK */}
        <AnimatePresence>
          {showLocalAnalytics && (() => {
            const analytics = getCalculatedAnalytics();
            const isSafeTheme = analytics.statusText.toLowerCase().includes("safe") || analytics.statusText.toLowerCase().includes("whitelist") || analytics.statusText.toLowerCase().includes("secure");
            
            return (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pt-6 border-t border-zinc-200 dark:border-zinc-800"
              >
                <div className="space-y-6 pb-6">
                  <div className="space-y-1">
                    <h3 className={`text-base font-black tracking-tight flex items-center space-x-2 ${
                      theme === "dark" ? "text-zinc-50" : "text-zinc-950"
                    }`}>
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span>Real-Time Calculated Analytics Trend</span>
                    </h3>
                    <p className={`text-xs ${
                      theme === "dark" ? "text-zinc-400" : "text-zinc-500"
                    }`}>
                      Computed mathematically from actual registered dispute timestamps, volume weights, and ledger ratios for <strong className="font-mono text-blue-600 dark:text-blue-400">"{activeSearchTerm}"</strong>.
                    </p>
                  </div>

                  {/* Calculated Statistics row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
                    <div>
                      <span className="text-[10px] text-zinc-500 block font-black uppercase">Calculated Status</span>
                      <span className={`font-extrabold text-sm ${isSafeTheme ? "text-emerald-600" : "text-rose-600"}`}>
                        {analytics.statusText}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block font-black uppercase">{analytics.scoreLabel}</span>
                      <span className="text-zinc-850 dark:text-zinc-50 font-extrabold text-base">
                        {analytics.scoreValue}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block font-black uppercase">Favorable Indicators</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base">👍 {analytics.totalGood} Logs</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 block font-black uppercase">Friction Indicators</span>
                      <span className="text-rose-600 dark:text-rose-400 font-extrabold text-base">👎 {analytics.totalBad} Logs</span>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-black block">
                      {isSafeTheme ? "Integrity Trend Metrics (6-Month Range)" : "Friction Conflict Incident Timelines"}
                    </span>
                    <div className={`h-48 p-2 rounded-xl border ${
                      theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
                    }`}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.chartData} margin={{ left: -25, right: 10, top: 10 }}>
                          <XAxis dataKey="name" stroke={theme === "dark" ? "#71717a" : "#71717a"} fontSize={8} fontWeight="bold" />
                          <YAxis stroke={theme === "dark" ? "#71717a" : "#71717a"} fontSize={8} fontWeight="bold" />
                          <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff', borderColor: theme === 'dark' ? '#27272a' : '#e4e4e7' }} />
                          <Bar 
                            dataKey={isSafeTheme ? "trust" : "friction"} 
                            fill={isSafeTheme ? "#10b981" : "#ef4444"} 
                            radius={[3, 3, 0, 0]} 
                            name={isSafeTheme ? "Safety Weight" : "Dispute Weight"} 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

      </div>
    </div>
  );
}
