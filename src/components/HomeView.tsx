import React from "react";
import { 
  Search, 
  Shield, 
  Database, 
  PlusCircle, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface HomeViewProps {
  theme: "light" | "dark";
  searchInput: string;
  setSearchInput: (val: string) => void;
  searchLoading: boolean;
  searchProgressMessage: string;
  handleSearchTrigger: (e?: React.FormEvent, directInput?: string) => void;
  onOpenDispute: () => void;
}

export function HomeView({
  theme,
  searchInput,
  setSearchInput,
  searchLoading,
  searchProgressMessage,
  handleSearchTrigger,
  onOpenDispute
}: HomeViewProps) {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Title & Description Section */}
      <div className="text-center sm:text-left space-y-3">
        <h1 className={`text-3xl sm:text-4xl font-black tracking-tight leading-tight ${
          theme === "dark" ? "text-zinc-50" : "text-zinc-950"
        }`}>
          Verify Digital Transaction Safety Instantly
        </h1>
        <p className={`text-sm leading-relaxed max-w-2xl ${
          theme === "dark" ? "text-zinc-400" : "text-zinc-600"
        }`}>
          Enter any user handle, website, store title, or email suffix. Our decentralized registry evaluates safety indices across 1,000,000+ known safe and flagged profiles instantly.
        </p>
      </div>

      {/* Search Box Area */}
      <div className="space-y-4">
        {/* Log Dispute Toggler JUST ABOVE search icon on search registry box, positioned on the left */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenDispute}
            className={`px-3.5 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 cursor-pointer text-xs font-extrabold shadow-sm ${
              theme === "dark"
                ? "bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600/20"
                : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Dispute</span>
          </button>
          <span className={`text-xs font-black uppercase tracking-wider ${
            theme === "dark" ? "text-zinc-400" : "text-zinc-600"
          }`}>
            Search Safe Registry
          </span>
        </div>

        {/* Search Form (Free / Borderless style) */}
        <form onSubmit={handleSearchTrigger} className="space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              type="text"
              required
              placeholder="Search handle, email, website (e.g. apple, @mrbeast, trader_jack)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={`block w-full pl-11 pr-32 py-4 border rounded-2xl text-sm placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono font-bold shadow-sm ${
                theme === "dark"
                  ? "bg-zinc-900 border-zinc-800 text-zinc-50"
                  : "bg-white border-zinc-200 text-zinc-950"
              }`}
            />
            <div className="absolute inset-y-2 right-2 flex items-center">
              <button
                type="submit"
                disabled={searchLoading}
                className="px-4.5 h-10 text-white font-extrabold text-xs bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                {searchLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Auditing...</span>
                  </>
                ) : (
                  <span>Search Registry</span>
                )}
              </button>
            </div>
          </div>

          {/* Suggestions Row */}
          <div className="flex flex-wrap items-center justify-between text-[11px] pt-1 gap-2">
            <span className="flex items-center space-x-1 text-zinc-500 font-semibold">
              <Database className="w-3.5 h-3.5 text-blue-500" />
              <span>Indexing 1,000,000+ trusted profiles and 300,000+ warning records.</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5 font-black">
              <span className="text-zinc-500">Try:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchInput("@apple");
                  setTimeout(() => handleSearchTrigger(undefined, "@apple"), 10);
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline font-mono"
              >
                @apple
              </button>
              <span className="text-zinc-400 font-normal">•</span>
              <button
                type="button"
                onClick={() => {
                  setSearchInput("jumptask");
                  setTimeout(() => handleSearchTrigger(undefined, "jumptask"), 10);
                }}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-mono"
              >
                jumptask
              </button>
              <span className="text-zinc-400 font-normal">•</span>
              <button
                type="button"
                onClick={() => {
                  setSearchInput("jumptusk");
                  setTimeout(() => handleSearchTrigger(undefined, "jumptusk"), 10);
                }}
                className="text-rose-600 dark:text-rose-400 hover:underline font-mono"
              >
                jumptusk
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Audit Scanning Loader */}
      {searchLoading && (
        <div className="space-y-6 py-10 text-center flex flex-col items-center justify-center">
          <div className="relative w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-600 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className={`text-xs uppercase font-mono tracking-widest font-black ${
              theme === "dark" ? "text-zinc-400" : "text-zinc-600"
            }`}>
              Decentralized Safety Scanning
            </h4>
            <p className={`text-xs font-bold ${
              theme === "dark" ? "text-zinc-500" : "text-zinc-600"
            }`}>
              {searchProgressMessage}
            </p>
          </div>
        </div>
      )}

      {/* COMPLIANCE PRINCIPLES SECTION (At the bottom of the first page) */}
      <div className="pt-10 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
        <div>
          <h2 className={`text-xl font-black tracking-tight flex items-center space-x-2 ${
            theme === "dark" ? "text-zinc-50" : "text-zinc-950"
          }`}>
            <Shield className="w-5.5 h-5.5 text-blue-600" />
            <span>TrustPulse Intermediary Safe Harbor Compliance Principles</span>
          </h2>
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider font-bold mt-1">
            Sustaining objective Consumer Telemetry under international safe harbors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="space-y-1">
            <h3 className={`font-black flex items-center space-x-1.5 text-sm ${
              theme === "dark" ? "text-zinc-100" : "text-zinc-900"
            }`}>
              <span className="text-emerald-500 font-bold">✔</span>
              <span>Objective, Non-Defamatory Taxonomy</span>
            </h3>
            <p className={theme === "dark" ? "text-zinc-400" : "text-zinc-600"}>
              To maintain strict compliance with civil code registries, we ban subjective defamatory labels. All indices map to quantitative, metric-based classifications: <strong>"Transaction Friction Index"</strong>, <strong>"Public Dispute File"</strong>, and <strong>"Linguistic Risk Cues"</strong>.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className={`font-black flex items-center space-x-1.5 text-sm ${
              theme === "dark" ? "text-zinc-100" : "text-zinc-900"
            }`}>
              <span className="text-blue-500 font-bold">✔</span>
              <span>Institutional Brand Whitelisting</span>
            </h3>
            <p className={theme === "dark" ? "text-zinc-400" : "text-zinc-600"}>
              To systematically mitigate malicious spam or corporate brand impersonation, globally validated institutional domains are protected from unverified user dispute filings.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className={`font-black flex items-center space-x-1.5 text-sm ${
              theme === "dark" ? "text-zinc-100" : "text-zinc-900"
            }`}>
              <span className="text-indigo-500 font-bold">✔</span>
              <span>Intermediary Safe Harbor Immunity</span>
            </h3>
            <p className={theme === "dark" ? "text-zinc-400" : "text-zinc-600"}>
              Under global safe harbor statutes (Section 230 equivalent), TrustPulse Index operates strictly as a neutral, passive distributor of crowdfunded dispute telemetry. Posting users accept full civil responsibility for inputs.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className={`font-black flex items-center space-x-1.5 text-sm ${
              theme === "dark" ? "text-zinc-100" : "text-zinc-900"
            }`}>
              <span className="text-amber-500 font-bold">✔</span>
              <span>Bandwidth Rate-Limiting</span>
            </h3>
            <p className={theme === "dark" ? "text-zinc-400" : "text-zinc-600"}>
              To prevent denial of service and secure server-side linguistic scan queries, client-side rate limit lockouts are systematic across interactive evaluation portals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
