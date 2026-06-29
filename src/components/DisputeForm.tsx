import React, { useState, useEffect } from "react";
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
  initialHandle?: string;
  initialPlatform?: string;
  initialLogType?: "good" | "bad";
  initialFrictionScore?: number;
  initialReportText?: string;
}

export function DisputeForm({
  onSubmit,
  formError,
  formSuccessMessage,
  initialHandle = "",
  initialPlatform = "",
  initialLogType = "bad",
  initialFrictionScore = 3,
  initialReportText = ""
}: DisputeFormProps) {
  const [handle, setHandle] = useState(initialHandle);
  const [platform, setPlatform] = useState(initialPlatform);
  const [logType, setLogType] = useState<"good" | "bad">(initialLogType);
  const [frictionScore, setFrictionScore] = useState(initialFrictionScore);
  const [reportText, setReportText] = useState(initialReportText);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [localError, setLocalError] = useState("");

  // Sync state if initial props change
  useEffect(() => {
    setHandle(initialHandle);
  }, [initialHandle]);

  useEffect(() => {
    setPlatform(initialPlatform);
  }, [initialPlatform]);

  useEffect(() => {
    setLogType(initialLogType);
  }, [initialLogType]);

  useEffect(() => {
    setFrictionScore(initialFrictionScore);
  }, [initialFrictionScore]);

  useEffect(() => {
    setReportText(initialReportText);
  }, [initialReportText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!handle.trim() || !platform.trim() || !reportText.trim()) {
      setLocalError("All fields are required.");
      return;
    }

    if (!termsAccepted) {
      setLocalError("You must confirm that this information is true.");
      return;
    }

    onSubmit({
      handle: handle.trim(),
      platform: platform.trim(),
      logType,
      frictionScore: logType === "good" ? 1 : frictionScore,
      reportText: reportText.trim()
    });

    // Reset upon successful submission
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
          <span className="capitalize">report an incident</span>
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          share what happened with a merchant or profile. your report helps update our public safety directory.
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
            <label className="block text-xs font-extrabold text-zinc-500 dark:text-zinc-400">
              username or shop name
            </label>
            <input
              type="text"
              required
              placeholder="eg.., @tele_vendor or store_jack"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="block w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-extrabold text-zinc-500 dark:text-zinc-400">
              where did this happen?
            </label>
            <input
              type="text"
              required
              placeholder="eg.., discord ,telegram,upwork,whatsapp"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="block w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-extrabold text-zinc-500 dark:text-zinc-400">
            what kind of review is this?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLogType("good")}
              className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border transition-all duration-200 cursor-pointer ${
                logType === "good"
                  ? "bg-emerald-600/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-extrabold"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850"
              }`}
            >
              <span>👍leave positive feedback</span>
            </button>
            <button
              type="button"
              onClick={() => setLogType("bad")}
              className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 border transition-all duration-200 cursor-pointer ${
                logType === "bad"
                  ? "bg-rose-600/10 border-rose-500 text-rose-700 dark:text-rose-400 font-extrabold"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850"
              }`}
            >
              <span>👎report an issue</span>
            </button>
          </div>
        </div>

        {logType === "bad" && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex justify-between items-center text-xs font-extrabold text-zinc-500">
              <span>How bad was the experience?</span>
              <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">Level {frictionScore}</span>
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
                <span className="text-amber-600 dark:text-amber-500">Level 1: Low Risk / Minor Issue</span>
                <span className="text-orange-600 dark:text-orange-500 font-medium">Level 2: Medium Risk / Suspicious</span>
                <span className="text-rose-600 dark:text-rose-500">Level 3: High Risk / Severe Scam</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-xs font-extrabold text-zinc-500 dark:text-zinc-400">
            What happened? (Describe your experience)
          </label>
          <textarea
            rows={4}
            required
            placeholder="Share clear facts about what went wrong, such as payment pressure, delays, or sudden blockages..."
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
              <strong className="font-extrabold text-zinc-850 dark:text-zinc-200">I confirm this information is true</strong>
              <span className="block text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                I verify that this report is completely honest and factual. I understand that I am responsible for any false statements.
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="text-xs text-zinc-500 font-mono">Postings save to local browser sandbox directory</span>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center space-x-1.5"
          >
            <span>Submit Report →</span>
          </button>
        </div>
      </form>
    </div>
  );
}
