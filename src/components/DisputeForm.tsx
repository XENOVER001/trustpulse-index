import React, { useState } from "react";
import { PlusCircle, CheckCircle2, ArrowRight } from "lucide-react";

interface DisputeFormProps {
  onSubmit: (data: {
    handle: string;
    platform: string;
    logType: "good" | "bad";
    frictionScore: number;
    reportText: string;
  }) => void;
  formError?: string;
  formSuccessMessage?: string;
}

export function DisputeForm({ onSubmit, formError, formSuccessMessage }: DisputeFormProps) {
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState("");
  const [logType, setLogType] = useState<"good" | "bad">("bad");
  const [frictionScore, setFrictionScore] = useState(3);
  const [reportText, setReportText] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!handle.trim() || !platform.trim() || !reportText.trim()) {
      setLocalError("All fields are required.");
      return;
    }

    if (!termsAccepted) {
      setLocalError("You must accept the truthfulness and liability disclosure.");
      return;
    }

    onSubmit({
      handle: handle.trim(),
      platform: platform.trim(),
      logType,
      frictionScore: logType === "good" ? 1 : frictionScore,
      reportText: reportText.trim()
    });

    // Reset some fields upon success (success is confirmed by parent via formSuccessMessage prop)
    setHandle("");
    setPlatform("");
    setReportText("");
    setTermsAccepted(false);
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-zinc-950 dark:text-zinc-50 flex items-center space-x-2">
          <PlusCircle className="w-5 h-5 text-blue-600" />
          <span>Log Direct Incident Dispute Report</span>
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Submit factual interaction history with unlisted freelance merchants, profile handles, or storefronts. Records map to global audit directories.
        </p>
      </div>

      {formSuccessMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">{formSuccessMessage}</span>
        </div>
      )}

      {(formError || localError) && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-350 border border-rose-300 dark:border-rose-900 rounded-xl text-xs font-semibold">
          {formError || localError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs uppercase font-extrabold tracking-wider text-zinc-500 dark:text-zinc-400">
              Storefront Handle or Username:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. @tele_vendor or store_jack"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="block w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase font-extrabold tracking-wider text-zinc-500 dark:text-zinc-400">
              Interaction Platform Context:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Discord Server, Telegram Channel, Upwork"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="block w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs uppercase font-extrabold tracking-wider text-zinc-500 dark:text-zinc-400">
            Log Rating Category:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLogType("good")}
              className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 border transition-all duration-200 cursor-pointer ${
                logType === "good"
                  ? "bg-emerald-600/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-extrabold"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850"
              }`}
            >
              <span>👍 Log Positive (Good)</span>
            </button>
            <button
              type="button"
              onClick={() => setLogType("bad")}
              className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 border transition-all duration-200 cursor-pointer ${
                logType === "bad"
                  ? "bg-rose-600/10 border-rose-500 text-rose-700 dark:text-rose-400 font-extrabold"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850"
              }`}
            >
              <span>👎 Log Friction (Bad)</span>
            </button>
          </div>
        </div>

        {logType === "bad" && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex justify-between items-center text-xs uppercase font-extrabold tracking-wider text-zinc-500">
              <span>Transaction Friction Level:</span>
              <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">Level {frictionScore}/3</span>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
              <input
                type="range"
                min="1"
                max="3"
                step="1"
                value={frictionScore}
                onChange={(e) => setFrictionScore(parseInt(e.target.value))}
                className="w-full accent-blue-600 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono font-bold">
                <span className="text-amber-600 dark:text-amber-500">1: Minor Friction</span>
                <span className="text-orange-600 dark:text-orange-500">2: Moderate Friction</span>
                <span className="text-rose-600 dark:text-rose-500">3: Severe Friction</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-xs uppercase font-extrabold tracking-wider text-zinc-500 dark:text-zinc-400">
            Objective Incident Chronological Logs:
          </label>
          <textarea
            rows={4}
            required
            placeholder="Provide factual, objective detail of transaction delays, non-standard payment pressures, or high-pressure closures encountered..."
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            className="block w-full p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="disclosure-cb"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 accent-blue-600 rounded"
            />
            <label htmlFor="disclosure-cb" className="text-xs text-zinc-600 dark:text-zinc-400 leading-normal cursor-pointer select-none">
              <strong className="font-bold text-zinc-800 dark:text-zinc-200">LIABILITY AFFIRMATION:</strong> I verify under penalty of personal and civil liability that this transaction dispute entry represents entirely factual accounts. I acknowledge TrustPulse operates strictly as a neutral, third-party ledger and that I remain fully liable for any false claims.
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="text-xs text-zinc-500 font-mono">Postings save to local browser sandbox directory</span>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5"
          >
            <span>Record Dispute Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
