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
          Search any username, website, store, or email. We instantly check our database of over 1 million safe and flagged profiles to keep you secure.
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
            Search Database
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
              placeholder="Enter username, email, or website..."
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
              <span>Covering 1,000,000+ trusted accounts and 300,000+ flagged records.</span>
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
            <span>Trust & Safety Guidelines</span>
          </h2>
          <p className={`text-xs font-semibold mt-1 ${
            theme === "dark" ? "text-zinc-400" : "text-zinc-500"
          }`}>
            How we keep our directory fair, secure, and accurate for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="space-y-1">
            <h3 className={`font-black flex items-center space-x-1.5 text-sm ${
              theme === "dark" ? "text-zinc-100" : "text-zinc-900"
            }`}>
              <span className="text-emerald-500 font-bold">✔</span>
              <span>Fair & Fact-Based Reviews</span>
            </h3>
            <p className={theme === "dark" ? "text-zinc-400" : "text-zinc-600"}>
              We don't allow insults or opinions. Every report is based on clear numbers, transaction history, and text patterns to keep things entirely fair.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className={`font-black flex items-center space-x-1.5 text-sm ${
              theme === "dark" ? "text-zinc-100" : "text-zinc-900"
            }`}>
              <span className="text-blue-500 font-bold">✔</span>
              <span>Verified Official Brands</span>
            </h3>
            <p className={theme === "dark" ? "text-zinc-400" : "text-zinc-600"}>
              To prevent fake accounts from pretending to be major companies, official brand domains are locked and protected from false reports.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className={`font-black flex items-center space-x-1.5 text-sm ${
              theme === "dark" ? "text-zinc-100" : "text-zinc-900"
            }`}>
              <span className="text-indigo-500 font-bold">✔</span>
              <span>User Responsibility</span>
            </h3>
            <p className={theme === "dark" ? "text-zinc-400" : "text-zinc-600"}>
              TrustPulse hosts community-driven reports. Users who submit feedback are fully responsible for making sure their reports are true and honest.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className={`font-black flex items-center space-x-1.5 text-sm ${
              theme === "dark" ? "text-zinc-100" : "text-zinc-900"
            }`}>
              <span className="text-amber-500 font-bold">✔</span>
              <span>Spam Protection</span>
            </h3>
            <p className={theme === "dark" ? "text-zinc-400" : "text-zinc-600"}>
              To keep the platform fast and stop spam attacks, we limit how many rapid searches or reports a single user can make.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
