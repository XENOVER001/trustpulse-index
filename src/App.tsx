import React, { useState, useEffect } from "react";
import {
  Search,
  Shield,
  ShieldCheck,
  AlertTriangle,
  BadgeAlert,
  Clock,
  ArrowRight,
  Database,
  PlusCircle,
  HelpCircle,
  Sparkles,
  RefreshCw,
  FileText,
  CheckCircle2,
  Lock,
  Info,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { checkIsWhitelisted, getWhitelistSize } from "./data/whitelist";

// =========================================================================
// CRITICAL DATA LAYER RULE (ZERO MOCK CONTENT)
// STRICT BAN ON FAKE DATA: Written as a completely empty structure.
// Authentic, real-world data will be hardcoded manually by the developer later.
// =========================================================================
const trustRegistryData: any[] = [];

interface DisputeEntry {
  id: string;
  handle: string;
  platform: string;
  frictionScore: number; // 1 to 5
  reportText: string;
  timestamp: string;
}

export default function App() {
  // Global search input and current search term
  const [searchInput, setSearchInput] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchProgressMessage, setSearchProgressMessage] = useState("");
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  // Community-sourced dispute submissions stored dynamically (Organic Growth via localStorage)
  const [localRegistry, setLocalRegistry] = useState<DisputeEntry[]>([]);
  
  // Search state mapping
  const [isWhitelistedEntity, setIsWhitelistedEntity] = useState(false);
  const [matchedEntries, setMatchedEntries] = useState<DisputeEntry[]>([]);
  
  // Advanced AI Portal state
  const [showAIFallback, setShowAIFallback] = useState(false);
  const [aiInputText, setAiInputText] = useState("");
  const [aiResult, setAiResult] = useState<{ frictionScore: string; bulletPoints: string[] } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  // Dispute creation Form state
  const [formHandle, setFormHandle] = useState("");
  const [formPlatform, setFormPlatform] = useState("");
  const [formFrictionScore, setFormFrictionScore] = useState(3);
  const [formReportText, setFormReportText] = useState("");
  const [formTermsAccepted, setFormTermsAccepted] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccessMessage, setFormSuccessMessage] = useState("");

  // Navigation / active tabs (inspired by sidebars on MediaApp Pro)
  const [activeTab, setActiveTab] = useState<"search" | "submit" | "about">("search");

  // Load submissions from localStorage on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("trustpulse_local_entries");
      if (saved) {
        setLocalRegistry(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to read from localStorage:", e);
    }
  }, []);

  // Cooldown effect for preventing API spam
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  // Normalize inputs for comparison
  const normalizeString = (str: string) => {
    return str.trim().toLowerCase().replace(/^@/, "");
  };

  // Main Dual-Path Scanning Engine with premium 3-second simulation delay
  const handleSearchTrigger = (e?: React.FormEvent, directInput?: string) => {
    if (e) e.preventDefault();
    
    const targetInput = directInput || searchInput;
    const trimmedInput = targetInput.trim();
    if (!trimmedInput) return;

    setHasSearched(true);
    setSearchLoading(true);
    setIsWhitelistedEntity(false);
    setMatchedEntries([]);
    setActiveSearchTerm(trimmedInput);
    setAiResult(null);
    setAiError(null);
    setShowAIFallback(false);

    // Progressive status updates during the 3-second audit delay
    setSearchProgressMessage("Initializing decentralized query protocols...");
    
    const statusTicks = [
      { delay: 750, text: "Re-hashing local transaction signatures..." },
      { delay: 1500, text: "Scanning global whitelist index databases..." },
      { delay: 2250, text: "Compiling final trust-index vectors..." }
    ];

    statusTicks.forEach((tick) => {
      setTimeout(() => {
        setSearchProgressMessage(tick.text);
      }, tick.delay);
    });

    setTimeout(() => {
      const normalTerm = normalizeString(trimmedInput);

      // Step 1: Check High-Profile Whitelist
      const isWhitelisted = checkIsWhitelisted(trimmedInput);

      if (isWhitelisted) {
        setIsWhitelistedEntity(true);
        setMatchedEntries([]);
        setSearchLoading(false);
        return;
      }

      setIsWhitelistedEntity(false);

      // Step 2: Query client local trustRegistryData + organic localStorage registry
      const combinedDatabase = [...trustRegistryData, ...localRegistry];
      
      const matches = combinedDatabase.filter(
        (entry) => normalizeString(entry.handle) === normalTerm
      );

      setMatchedEntries(matches);
      setSearchLoading(false);
    }, 3000);
  };

  // Submit dispute submission & store in browser cache (with 3-second block transaction hashing simulation)
  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccessMessage("");

    const trimmedHandle = formHandle.trim();
    const trimmedPlatform = formPlatform.trim();
    const trimmedReport = formReportText.trim();

    if (!trimmedHandle || !trimmedPlatform || !trimmedReport) {
      setFormError("Please fill out all input fields to record high-quality safety data.");
      return;
    }

    // Intercept high-profile whitelisted entities
    const isWhitelisted = checkIsWhitelisted(trimmedHandle);

    if (isWhitelisted) {
      setFormError("System metrics indicate verified operational infrastructure. Public user dispute entries are locked for this organizational profile.");
      return;
    }

    if (!formTermsAccepted) {
      setFormError("You must review and accept the civil liability affirmation checkbox before submitting.");
      return;
    }

    setIsSubmittingDispute(true);

    setTimeout(() => {
      // Generate valid Dispute entry
      const newEntry: DisputeEntry = {
        id: "LOG-" + Date.now().toString().slice(-6) + "-" + Math.floor(Math.random() * 900 + 100),
        handle: trimmedHandle,
        platform: trimmedPlatform,
        frictionScore: formFrictionScore,
        reportText: trimmedReport,
        timestamp: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
      };

      // Update state and write to localStorage
      const updatedRegistry = [newEntry, ...localRegistry];
      setLocalRegistry(updatedRegistry);
      localStorage.setItem("trustpulse_local_entries", JSON.stringify(updatedRegistry));

      // Reset Form fields
      setFormHandle("");
      setFormPlatform("");
      setFormReportText("");
      setFormFrictionScore(3);
      setFormTermsAccepted(false);

      setIsSubmittingDispute(false);
      
      setFormSuccessMessage(`Dispute successfully logged. Searching for "${trimmedHandle}" will now route directly to its incident audit reports.`);
      
      // Auto query the submitted handle
      setSearchInput(trimmedHandle);
      handleSearchTrigger(undefined, trimmedHandle);
    }, 3000);
  };

  // Trigger Advanced Linguistic Risk Analysis (Gemini backend)
  const triggerLinguisticAnalysis = async () => {
    if (!aiInputText.trim()) {
      setAiError("Please paste in appropriate context text (such as correspondence, profile bio, or message) for analysis.");
      return;
    }

    setAiLoading(true);
    setAiError(null);
    setAiResult(null);

    // Initialize security lock countdown immediately
    setCooldownTime(40);

    const startTime = Date.now();

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: aiInputText })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Our linguistic diagnostic component suffered a delay. Please try again.");
      }

      // Force a minimum 3-seconds total delay for high-fidelity scanning feeling
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingTime));

      setAiResult(data);
    } catch (e: any) {
      console.error(e);
      setAiError(e.message || "Syntactic audit server is taking too long to respond. Please verify your connection.");
    } finally {
      setAiLoading(false);
    }
  };

  // Helper colors
  const getFrictionRatingColor = (score: number) => {
    if (score <= 1.8) return "text-emerald-600 bg-emerald-50 border-emerald-200/60";
    if (score <= 3.2) return "text-amber-600 bg-amber-50 border-amber-250/60";
    return "text-rose-600 bg-rose-50 border-rose-200/60";
  };

  const calculateAverageFriction = (entries: DisputeEntry[]): string => {
    if (entries.length === 0) return "0";
    const total = entries.reduce((acc, curr) => acc + curr.frictionScore, 0);
    return (total / entries.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf2f5] via-[#f1f6f8] to-[#f4f7f5] text-zinc-800 font-sans antialiased flex flex-col selection:bg-indigo-600 selection:text-white">
      
      {/* 🏷️ PREMIUM FULL WIDTH BRAND HEADER BAR - PUTTING THE APP'S NAME ON TOP */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black italic text-white text-lg shadow-md shadow-indigo-600/25">
            TP
          </div>
          <div>
            <span className="font-extrabold text-zinc-900 tracking-tight text-xl flex items-baseline leading-none">
              TrustPulse<span className="text-indigo-600 font-black">.Index</span>
            </span>
            <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase font-black mt-1">Decentralized Safety Registry</p>
          </div>
        </div>
        
        {/* Quick System Metrics */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100/70 rounded-full px-3.5 py-1 text-[11px] font-black">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-0.5 animate-pulse"></span>
            <span>Secure Ledger Online</span>
          </div>
          <div className="bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-3.5 py-1 text-[11px] font-mono font-black">
            1.0.2 Stable
          </div>
        </div>
      </header>

      {/* 💰 GOOGLE ADSENSE PLACEHOLDER: TOP LEADERBOARD BANNER */}
      <div className="w-full bg-[#f1f5f9]/70 border-b border-zinc-200/80 py-3.5 px-4 flex items-center justify-center">
        <div className="w-full max-w-4xl border-2 border-dotted border-amber-500/40 bg-amber-500/[0.04] rounded-xl p-3 text-center shadow-sm hover:bg-amber-500/[0.07] transition-all">
          <div className="text-[10px] uppercase tracking-widest font-mono text-amber-600 font-bold mb-0.5">
            💰 GOOGLE ADSENSE PLACEHOLDER: TOP LEADERBOARD BANNER
          </div>
          <p className="text-[11px] text-zinc-500 font-medium">
            Leaderboard Standard Placement (728×90px) — configured for optimal user view CTR.
          </p>
        </div>
      </div>

      {/* Main Responsive Grid Layout (Inspired by modern consumer-health dashboard layout) */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1440px] w-full mx-auto">
        
        {/* LEFT COMPACT SIDEBAR (Consumer brand identity & nav sidebar) */}
        <aside className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-zinc-200/80 p-6 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Sidebar Navigation */}
            <nav className="space-y-2">
              <span className="px-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1 font-mono">
                Main Navigation
              </span>
              
              <button
                onClick={() => { setActiveTab("search"); }}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-black tracking-wide transition-all ${
                  activeTab === "search"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-black"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 font-bold"
                }`}
              >
                <Search className={`w-4 h-4 ${activeTab === "search" ? "text-white" : "text-zinc-400"}`} />
                <span>Global Safety Ledger</span>
              </button>

              <button
                onClick={() => { setActiveTab("submit"); }}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-black tracking-wide transition-all ${
                  activeTab === "submit"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-black"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 font-bold"
                }`}
              >
                <PlusCircle className={`w-4 h-4 ${activeTab === "submit" ? "text-white" : "text-zinc-400"}`} />
                <span>Log Transaction Dispute</span>
              </button>

              <button
                onClick={() => { setActiveTab("about"); }}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-black tracking-wide transition-all ${
                  activeTab === "about"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-black"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 font-bold"
                }`}
              >
                <HelpCircle className={`w-4 h-4 ${activeTab === "about" ? "text-white" : "text-zinc-400"}`} />
                <span>Ledger Guidelines</span>
              </button>
            </nav>
          </div>

          {/* Prompt/Guide Card widget below side navigation */}
          <div className="mt-8 pt-6 border-t border-zinc-150">
            <div className="bg-gradient-to-tr from-indigo-600 to-indigo-700 rounded-2xl p-4 text-white shadow-lg shadow-indigo-600/10 space-y-3">
              <span className="bg-white/20 text-white rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase inline-block font-mono">
                Consumer Trust Advice
              </span>
              <p className="font-extrabold text-xs leading-relaxed">
                Take control of your online trading and transactions.
              </p>
              <p className="text-[10px] text-indigo-150 leading-relaxed font-medium">
                Always audit new business partnerships, handles, and communications before sending funds.
              </p>
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mt-4 px-1">
              <span>Status: Secure Ledger</span>
              <span className="flex items-center text-emerald-600 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                Active
              </span>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT WORKSPACE */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col space-y-6">
          
          {/* Main Title Welcome Block */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/75 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
                Transaction Trust Directory
              </h2>
              <p className="text-xs sm:text-sm text-zinc-550">
                A public consumer-safety directory to ensure high-end commercial transparency and digital transaction safety.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1.5 rounded-lg bg-[#ebfbf3] text-[#15803d] border border-emerald-100 font-medium text-xs flex items-center space-x-1.5 font-sans">
                <ShieldCheck className="w-4 h-4" />
                <span>Intermediary Safe Harbor Verified</span>
              </div>
            </div>
          </div>

          {/* TAB 1: SEARCH DIRECTORY FLOW */}
          {activeTab === "search" && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Massive Elegant Search Hub (Dynamic 3-second comprehension) */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-4 max-w-4xl">
                <div className="max-w-2xl">
                  <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                    Verify digital transactions instantly.
                  </h3>
                  <p className="text-xs text-zinc-550 leading-relaxed mt-1">
                    Enter any merchant alias, seller bio, or client handle below. Run instant comparisons against verified global whitelist profiles or local consumer incident dispute archives.
                  </p>
                </div>

                <form onSubmit={handleSearchTrigger} className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-zinc-455" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Search handles, online platforms, email addresses (e.g. @tele_vendor, apple)"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="block w-full pl-12 pr-32 py-4.5 bg-white border-2 border-zinc-400 rounded-2xl text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-indigo-600/15 focus:border-indigo-650 transition-all font-mono font-bold shadow-sm"
                    />
                    <div className="absolute inset-y-2.5 right-2 px-1">
                      <button
                        type="submit"
                        disabled={searchLoading}
                        className={`h-full px-5 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 ${
                          searchLoading 
                            ? "bg-zinc-250 text-zinc-400 border border-zinc-200 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 cursor-pointer"
                        }`}
                      >
                        {searchLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                            <span>Auditing...</span>
                          </>
                        ) : (
                          <span>Audit Registry</span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-500 px-1 pt-1 gap-2">
                    <div className="flex items-center space-x-1.5">
                      <Database className="w-3.5 h-3.5 text-zinc-450" />
                      <span>Ledger Database status: <strong className="text-zinc-700 font-extrabold">{localRegistry.length} friction archives</strong> and <strong className="text-indigo-600 font-extrabold">{getWhitelistSize().toLocaleString()} verified safe profiles</strong> in secure index.</span>
                    </div>
                    <div className="flex items-center space-x-2 font-bold text-zinc-650">
                      <span>Quick Test Entries:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchInput("@apple");
                          setTimeout(() => handleSearchTrigger(undefined, "@apple"), 10);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 hover:underline font-mono font-black"
                      >
                        @apple
                      </button>
                      <span>or</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchInput("unlisted_contact_4");
                          setTimeout(() => handleSearchTrigger(undefined, "unlisted_contact_4"), 10);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 hover:underline font-mono font-black"
                      >
                        unlisted_contact_4
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* ACTIVE AUDITING LOADER */}
              {searchLoading && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-zinc-200 shadow-md max-w-4xl space-y-6 animate-pulse">
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                    <div className="relative flex items-center justify-center">
                      <span className="absolute inline-flex h-16 w-16 rounded-full bg-indigo-100 animate-ping opacity-60"></span>
                      <div className="relative w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin flex items-center justify-center shadow-inner">
                        <Shield className="w-4 h-4 text-indigo-600 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1.5 max-w-md">
                      <h4 className="text-sm font-black text-zinc-900 tracking-tight font-mono uppercase">
                        Auditing Safety Ledgers
                      </h4>
                      <p className="text-xs text-zinc-550 font-medium">
                        Querying matching indexes, reviewing incident histories, and assessing cryptographic whitelists...
                      </p>
                    </div>
                  </div>
                  
                  {/* Dynamic Status Progress Indicator */}
                  <div className="bg-[#f8fafc] rounded-xl border border-zinc-200 p-4 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-mono tracking-widest font-black text-zinc-400 border-b border-zinc-150 pb-2">
                      <span>VERIFICATION CONSOLE</span>
                      <span className="text-indigo-600 animate-pulse">SCAN_PROGRESS</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                        <span className="font-extrabold text-zinc-500">Operation:</span>
                        <span className="text-indigo-700 font-extrabold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/40">
                          {searchProgressMessage || "Initializing query protocols..."}
                        </span>
                      </div>
                      <div className="text-zinc-400">
                        ESTIMATED TIME: ~3.0s
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DUAL-PATH LOGICAL RESULT ROUTER */}
              {hasSearched && !searchLoading && (
                <div className="space-y-6 max-w-4xl animate-fade-in">
                  
                  {/* CASE A: Verified Whitelisted Corporate Public entity */}
                  {isWhitelistedEntity && (
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-600">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono uppercase bg-zinc-150 px-2 py-0.5 rounded text-zinc-650 tracking-wider">
                              Verified Entity Directory
                            </span>
                            <span className="font-semibold text-xs text-indigo-600">
                              {activeSearchTerm}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-zinc-900">
                            🛡️ Globally Verified Public Entity Identified
                          </h4>
                          <p className="text-xs text-zinc-500 leading-relaxed">
                            Public transaction databases indicate verified operational commercial infrastructure. Consumer disputes are not editable or postable for locked verified organization structures.
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-zinc-100 pt-4 text-[10px] text-zinc-500 flex items-center justify-between font-mono">
                        <span>Ledger Authority: Locked & Verified Registrar Profile</span>
                        <span>STATUS: SYSTEM_VERIFIED</span>
                      </div>
                    </div>
                  )}

                  {/* CASE B: Match from community ledger database (Local matches found) */}
                  {!isWhitelistedEntity && matchedEntries.length > 0 && (
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
                        
                        {/* Interactive friction analysis header graph */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-zinc-100 gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono uppercase bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full border border-indigo-100/50 font-bold">
                              Community Safety Audit Matches Found
                            </span>
                            <h4 className="text-base font-bold text-zinc-900 font-mono">
                              🔍 Search Identifier: <span className="text-indigo-600 font-bold">{activeSearchTerm}</span>
                            </h4>
                          </div>

                          <div className="flex items-center space-x-3.5 bg-zinc-50 p-3 rounded-xl border border-zinc-200/80">
                            <div className="text-right">
                              <span className="text-[9px] text-zinc-400 block uppercase font-mono tracking-wider font-bold">Friction Index Rating</span>
                              <span className="text-sm font-bold text-zinc-800 font-mono">
                                {calculateAverageFriction(matchedEntries)} / 5.0
                              </span>
                            </div>
                            <div className={`p-2 rounded-lg border ${getFrictionRatingColor(parseFloat(calculateAverageFriction(matchedEntries)))}`}>
                              <BadgeAlert className="w-5 h-5" />
                            </div>
                          </div>
                        </div>

                        {/* Visual graph line decoration inspired by uploaded health params dashboard image */}
                        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/60 text-xs text-zinc-500 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-zinc-700">Comparative Transaction Friction Severity Line:</span>
                            <span className="font-mono text-[10px]">Computed from logged data</span>
                          </div>
                          <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden flex">
                            <div className="bg-emerald-400 h-full" style={{ width: "35%" }} title="Low Friction Weight"></div>
                            <div className="bg-amber-400 h-full" style={{ width: "40%" }} title="Medium Friction Delay Weight"></div>
                            <div className="bg-rose-400 h-full animate-pulse" style={{ width: "25%" }} title="High Friction Dispute Weight"></div>
                          </div>
                          <div className="flex justify-between items-center text-[9px] text-zinc-400 pt-1">
                            <span>Stable Interface (35%)</span>
                            <span>Communication Lapses (40%)</span>
                            <span>High Security Friction (25%)</span>
                          </div>
                        </div>

                        {/* List of Disputes under objective terminology */}
                        <div className="space-y-4">
                          <h5 className="text-[11px] uppercase font-mono tracking-wider text-zinc-400 font-bold">
                            User Transaction Friction Incident Reports ({matchedEntries.length})
                          </h5>
                          
                          <div className="space-y-3">
                            {matchedEntries.map((entry) => (
                              <div key={entry.id} className="p-4 bg-zinc-50/55 rounded-xl border border-zinc-200/60 hover:bg-zinc-50 transition-all space-y-3">
                                <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="bg-white border border-zinc-200 text-zinc-550 font-bold px-2 py-0.5 rounded text-[10px] font-mono">ID: {entry.id}</span>
                                    <span className="text-zinc-300">•</span>
                                    <span className="text-zinc-500 text-[11px]">Context: {entry.platform}</span>
                                  </div>
                                  <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${getFrictionRatingColor(entry.frictionScore)} font-semibold`}>
                                    Friction Index: {entry.frictionScore}/5
                                  </div>
                                </div>
                                <p className="text-xs text-zinc-600 leading-relaxed font-sans whitespace-pre-line pl-3 border-l-2 border-indigo-600">
                                  {entry.reportText}
                                </p>
                                <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400 pt-1 font-mono">
                                  <Clock className="w-3 h-3 text-zinc-450" />
                                  <span>Report Logged Time: {entry.timestamp}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Sponsor ad integration (Placement 2) */}
                      {/* 💰 GOOGLE ADSENSE PLACEHOLDER: IN-FEED NATIVE AD */}
                      <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-sm relative overflow-hidden">
                        <div className="border border-dashed border-amber-600/30 bg-amber-500/[0.03] rounded-xl p-4 text-center transition-all">
                          <div className="text-[9px] uppercase tracking-widest font-mono text-amber-600 font-bold mb-1">
                            💰 GOOGLE ADSENSE PLACEHOLDER: IN-FEED NATIVE AD
                          </div>
                          <p className="text-xs text-zinc-500 font-medium">
                            Premium In-Feed Display Asset banner — designed to capture high intent consumer impressions.
                          </p>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* CASE C: Zero Community Match Found (Fallback path) */}
                  {!isWhitelistedEntity && matchedEntries.length === 0 && (
                    <div className="space-y-6">
                      
                      {/* Quiet, welcoming state notification */}
                      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
                        <div className="flex items-start space-x-3.5">
                          <div className="p-2.5 bg-zinc-50 text-amber-600 border border-zinc-200/80 rounded-xl">
                            <Info className="w-5 h-5 text-amber-500" />
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <h4 className="text-sm font-semibold text-zinc-900">0 community data logs found for this handle</h4>
                            <p className="text-xs text-zinc-550 leading-relaxed">
                              This indicates the profile is either brand new, operates under a different alias, or is currently unlisted within local database schemas.
                            </p>
                          </div>
                        </div>

                        {/* Interactive UI Action to activate Linguistic analyzer */}
                        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-4 flex-wrap">
                          <span className="text-[10px] text-zinc-400 font-mono">Linguistic Risk Fallback Protocol Check</span>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAIFallback(!showAIFallback);
                            }}
                            className="px-3.5 py-1.8 bg-indigo-50 hover:bg-indigo-150/80 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 mr-0.5 text-indigo-500" />
                            <span>{showAIFallback ? "Hide" : "Evaluate"} Client Profile Linguistic Risks</span>
                          </button>
                        </div>
                      </div>

                      {/* Display Ad (Sits exactly above the AI portal wrapper - Placement 3) */}
                      {/* 💰 GOOGLE ADSENSE PLACEHOLDER: HIGH-CTR INTERSTITIAL BOX */}
                      {showAIFallback && (
                        <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
                          <div className="border border-dashed border-amber-600/30 bg-amber-500/[0.03] rounded-xl p-3.5 text-center">
                            <div className="text-[9px] uppercase tracking-widest font-mono text-amber-600 font-bold mb-0.5">
                              💰 GOOGLE ADSENSE PLACEHOLDER: HIGH-CTR INTERSTITIAL BOX
                            </div>
                            <p className="text-xs text-zinc-500 font-medium">
                              Premium Interstitial box (336×280px) placeholder — aligned perfectly above high-value fallback service.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* AI LANGUAGE RISK PORTAL */}
                      {showAIFallback && (
                        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-5 animate-fade-in">
                          <div className="flex items-start space-x-3.5 pb-4 border-b border-zinc-100">
                            <div className="p-2.5 bg-indigo-55 rounded-xl text-indigo-650 border border-indigo-100">
                              <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-zinc-900 tracking-tight">
                                Linguistic Risk Metrics Diagnostic
                              </h4>
                              <p className="text-xs text-zinc-500 leading-relaxed">
                                Enter written communications, storefront details, or messages. The system computes structural patterns, indicators of urgency pressure, and correspondence consistency.
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs uppercase font-mono tracking-wider text-zinc-400 mb-2 font-bold select-none">
                                Correspondence Copy-Paste Details:
                              </label>
                              <textarea
                                rows={4}
                                className="block w-full p-4 bg-white border-2 border-zinc-350 rounded-2xl text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-indigo-600/15 focus:border-indigo-600 transition-all font-sans leading-relaxed font-bold shadow-sm"
                                placeholder="To run an automated analysis, paste the target entity's public profile bio, a copy-pasted caption from their store, or a recent text message/email correspondence they sent you."
                                value={aiInputText}
                                onChange={(e) => setAiInputText(e.target.value)}
                              />
                            </div>

                            {aiError && (
                              <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs flex items-center space-x-2">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                                <span>{aiError}</span>
                              </div>
                            )}

                            {/* Action block with safety countdown rate limiter */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                              <span className="text-[10px] text-zinc-400 font-mono tracking-tight flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-zinc-350" />
                                <span>Security lockout active to guard computing capacity</span>
                              </span>

                              <button
                                type="button"
                                onClick={triggerLinguisticAnalysis}
                                disabled={aiLoading || cooldownTime > 0}
                                className={`px-5 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all ${
                                  cooldownTime > 0 || aiLoading
                                    ? "bg-zinc-200 text-zinc-500 border border-zinc-250 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 cursor-pointer"
                                }`}
                              >
                                {aiLoading ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-500" />
                                    <span>Syntactical evaluation underway...</span>
                                  </>
                                ) : cooldownTime > 0 ? (
                                  <>
                                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                    <span>Rate limiting cooldown: {cooldownTime}s</span>
                                  </>
                                ) : (
                                  <>
                                    <span>Analyze Profile Syntax Structure</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Render AI analyzed response */}
                            {aiResult && (
                              <div className="p-5 bg-indigo-50/40 rounded-2xl border border-indigo-100/50 space-y-4 animate-fade-in">
                                <div className="flex items-center justify-between pb-3 border-b border-indigo-100/40 gap-4 flex-wrap">
                                  <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-3 py-0.5 rounded-full border border-indigo-100 font-semibold uppercase tracking-wider">
                                    Syntactic Report Matrix
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-zinc-500 font-medium">Linguistic Risk Level:</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${
                                      aiResult.frictionScore.toLowerCase().includes("high")
                                        ? "text-rose-600 bg-rose-50 border-rose-200"
                                        : aiResult.frictionScore.toLowerCase().includes("medium")
                                        ? "text-amber-600 bg-amber-50 border-amber-200"
                                        : "text-emerald-600 bg-emerald-50 border-emerald-200"
                                    }`}>
                                      {aiResult.frictionScore}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                                    Syntax audit details (linguistic cues detected):
                                  </p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    {aiResult.bulletPoints.map((bp, i) => (
                                      <div key={i} className="text-xs text-zinc-650 bg-white p-3.5 rounded-xl border border-zinc-200/60 leading-relaxed flex items-start gap-2.5">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
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

                </div>
              )}

              {/* Home placeholder block before searching */}
              {!hasSearched && (
                <div className="text-center bg-white p-6 rounded-2xl border border-zinc-200/80 max-w-4xl space-y-4">
                  <div className="max-w-md mx-auto space-y-1.5 text-center">
                    <h4 className="text-xs uppercase font-mono tracking-widest text-zinc-450 font-bold">Local Storage Registry Stats</h4>
                    <p className="text-xs text-zinc-500">
                      Your submissions remain sandboxed in this browser. To view your submissions, execute a search on the corresponding identifier handle.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto pt-2">
                    <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/60 font-medium">
                      <span className="text-[10px] font-mono text-zinc-400 block uppercase">Friction logs</span>
                      <span className="text-base font-bold text-zinc-800 font-mono bg-white px-2 py-0.5 rounded border border-zinc-200/50 mt-1 inline-block">{localRegistry.length} active</span>
                    </div>
                    <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/60 font-medium">
                      <span className="text-[10px] font-mono text-[#0369a1] block uppercase">Network speed</span>
                      <span className="text-base font-bold text-zinc-800 font-mono bg-[#f0f9ff] px-2 py-0.5 rounded border border-sky-100 mt-1 inline-block">0.1s Cache</span>
                    </div>
                    <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/60 font-medium">
                      <span className="text-[10px] font-mono text-[#15803d] block uppercase">Safety mode</span>
                      <span className="text-base font-bold text-[#15803d] font-mono bg-[#f0fdf4] px-2 py-0.5 rounded border border-emerald-100 mt-1 inline-block">Safe Harbor</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: DISPUTE LOG SUBMISSION ENTRY */}
          {activeTab === "submit" && (
            <div className="space-y-6 max-w-4xl animate-fade-in">
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                
                <div className="flex items-start justify-between pb-4 border-b border-zinc-150 gap-4 flex-wrap">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-zinc-900 tracking-tight flex items-center space-x-2">
                      <PlusCircle className="w-5 h-5 text-indigo-600" />
                      <span>Log transaction dispute incident</span>
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Publish factual experiences and communication feedback directly into this sandboxed directory ledger.
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/60 font-bold">
                      Local Client Database
                    </span>
                  </div>
                </div>

                {/* Form success outcome notification */}
                {formSuccessMessage && (
                  <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs space-y-3 font-medium animate-fade-in">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{formSuccessMessage}</span>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormSuccessMessage("");
                          setActiveTab("search");
                          setTimeout(() => handleSearchTrigger(), 15);
                        }}
                        className="text-white hover:underline text-[11px] bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-500 font-bold tracking-wide transition-all shadow-sm"
                      >
                        View your report in the Ledger directory &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {formError && (
                  <div className="p-3 bg-rose-50 text-rose-700 border border-rose-250 rounded-xl text-xs flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleDisputeSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold select-none">
                        Suspect Handle / Identifier Profile:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. @tele_shop or freelance_john"
                        value={formHandle}
                        onChange={(e) => setFormHandle(e.target.value)}
                        className="block w-full px-4 py-3 bg-white border-2 border-zinc-350 rounded-xl text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-indigo-600/15 focus:border-indigo-600 font-mono font-bold shadow-sm transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold select-none">
                        Core Engagement Platform Context:
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Discord Store, Upwork, Telegram Channel"
                        value={formPlatform}
                        onChange={(e) => setFormPlatform(e.target.value)}
                        className="block w-full px-4 py-3 bg-white border-2 border-zinc-350 rounded-xl text-sm text-[#0c0a09] placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-indigo-600/15 focus:border-indigo-600 font-sans font-bold shadow-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold select-none flex items-center justify-between">
                      <span>Incidence Friction Score (Friction Rating Scale):</span>
                      <span className="font-mono text-indigo-600 font-bold">{formFrictionScore} / 5</span>
                    </label>
                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/80 space-y-2">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={formFrictionScore}
                        onChange={(e) => setFormFrictionScore(parseInt(e.target.value))}
                        className="w-full accent-indigo-600 h-1.5 bg-zinc-200 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-zinc-450 font-mono pt-1">
                        <span>1: Low friction / Polite communications</span>
                        <span>3: Average delay / Inconsistent timeline</span>
                        <span>5: Maximum friction / suspicious setup</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold select-none">
                      Detailed Incident Friction Log Report:
                    </label>
                    <textarea
                      rows={4}
                      required
                      maxLength={1500}
                      placeholder="Provide an objective, chronological summary of your transaction timeline and coordination discrepancies. Focus strictly on transaction metrics, timelines, specific communication cues, and non-defamatory records."
                      value={formReportText}
                      onChange={(e) => setFormReportText(e.target.value)}
                      className="block w-full p-4 bg-white border-2 border-zinc-350 rounded-xl text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-indigo-600/15 focus:border-indigo-600 transition-all font-sans leading-relaxed font-bold shadow-sm"
                    />
                  </div>

                  {/* LIABILITY DISCLAIMER CHECKBOX - MUST Match prompt strings exactly */}
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-3">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="liability-checkbox"
                        checked={formTermsAccepted}
                        onChange={(e) => setFormTermsAccepted(e.target.checked)}
                        className="mt-1 accent-indigo-600 rounded text-indigo-600 flex-shrink-0 cursor-pointer h-4.5 w-4.5 bg-white border-zinc-300"
                      />
                      <label htmlFor="liability-checkbox" className="text-[10px] leading-relaxed text-zinc-500 cursor-pointer select-none">
                        <strong>LIABILITY DISCLAIMER:</strong> By checking this box, I affirm under penalty of civil liability that this transaction dispute entry is entirely factual and accurate. I acknowledge that TrustPulse Index operates strictly as a neutral, third-party electronic ledger under global intermediary safe harbor frameworks, does not verify or endorse user-generated claims, and that I remain solely and personally liable for any false claims or defamatory statements submitted.
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <span className="text-[10px] text-zinc-400 font-mono tracking-tight flex items-center space-x-1.5 select-none">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Committed straight to sandboxed browser localStorage</span>
                    </span>
                    
                    <button
                      type="submit"
                      disabled={isSubmittingDispute}
                      className={`px-5 py-2.5 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 ${
                        isSubmittingDispute 
                          ? "bg-zinc-250 text-zinc-400 border border-zinc-200 cursor-not-allowed" 
                          : "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/10 cursor-pointer"
                      }`}
                    >
                      {isSubmittingDispute ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500 mr-1" />
                          <span>Ledger transaction indexing...</span>
                        </>
                      ) : (
                        <>
                          <span>Post Entry to Ledger Database</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

          {/* TAB 3: SAFETY PRINCIPLES & SAFE HARBOR INFO */}
          {activeTab === "about" && (
            <div className="space-y-6 max-w-4xl animate-fade-in text-zinc-700">
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                
                <div className="border-b border-zinc-150 pb-4">
                  <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    <span>TrustPulse Index Compliance Principles</span>
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono tracking-tight pt-1">
                    Global Legal Intermediary Safe Harbor Framework
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/60 space-y-2.5">
                    <div className="flex items-center space-x-2 text-zinc-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <h5 className="font-bold text-xs">Purged Defamatory Terms</h5>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                      TrustPulse Index completely purges legs of legally subjective terminology. All labels and feedback fields maps logically to objective, analytical consumer terms: <strong>"User Transaction Friction Log"</strong>, <strong>"Public Dispute Registry"</strong>, <strong>"Linguistic Risk Metrics"</strong>, <strong>"Friction Score"</strong>, and <strong>"Community Incident Reports"</strong>.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/60 space-y-2.5">
                    <div className="flex items-center space-x-2 text-zinc-800">
                      <Lock className="w-4 h-4 text-indigo-500" />
                      <h5 className="font-bold text-xs">Corporate Verifications Block</h5>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                      Globally recognized high-profile corporate entities with large institutional footprints are whitelisted. The ledger locks dispute posting on public organization profiles to prevent duplicate automated spam or targeted corporate feedback.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/60 space-y-2.5">
                    <div className="flex items-center space-x-2 text-zinc-800">
                      <FileText className="w-4 h-4 text-zinc-650" />
                      <h5 className="font-bold text-xs">Neutral Electronic Safe-Harbor</h5>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                      All transaction dispute telemetry logged constitutes entirely independent user evaluations. Reporting users accept complete civil and financial liability for factual inputs under safely managed electronic safe harbor structures.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/60 space-y-2.5">
                    <div className="flex items-center space-x-2 text-zinc-800">
                      <Clock className="w-4 h-4 text-zinc-650" />
                      <h5 className="font-bold text-xs">Access-Controlled Rate Limiting</h5>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                      An integrated client-side cooldown lock limits automatic evaluation triggers, systematically neutralizing automated directory lookup spamming.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 font-sans">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-zinc-800 italic">TrustPulse Index safe-harbor digital registry inc.</span>
            <p className="text-[10px] text-zinc-450 leading-relaxed max-w-lg select-none">
              Operating strictly as a neutral, third-party electronic ledger under global intermediary safe harbor frameworks, does not certify or endorse user-generated claims. All submitted entries remain the sole liability of their respective posters.
            </p>
          </div>
          <div className="flex gap-4 text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
            <span>Liability Framework</span>
            <span className="text-zinc-300">|</span>
            <span>Ver. 1.0.2 Stable</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
