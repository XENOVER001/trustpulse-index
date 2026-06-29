import React from "react";
import { Shield } from "lucide-react";

export function CompliancePrinciples() {
  return (
    <div className="pt-10 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight flex items-center space-x-2">
          <Shield className="w-5.5 h-5.5 text-blue-600" />
          <span>Trust & Safety Guidelines</span>
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-semibold">
          How we keep our directory fair, secure, and accurate for everyone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <div className="space-y-2">
          <h3 className="font-extrabold text-zinc-900 dark:text-zinc-200 flex items-center space-x-1.5 text-base">
            <span className="text-emerald-500">✔</span>
            <span>Fair & Fact-Based Reviews</span>
          </h3>
          <p>
            We don't allow insults or opinions. Every report is based on clear numbers, transaction history, and text patterns to keep things entirely fair.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-extrabold text-zinc-900 dark:text-zinc-200 flex items-center space-x-1.5 text-base">
            <span className="text-blue-500">✔</span>
            <span>Verified Official Brands</span>
          </h3>
          <p>
            To prevent fake accounts from pretending to be major companies, official brand domains are locked and protected from false reports.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-extrabold text-zinc-900 dark:text-zinc-200 flex items-center space-x-1.5 text-base">
            <span className="text-indigo-500">✔</span>
            <span>User Responsibility</span>
          </h3>
          <p>
            TrustPulse hosts community-driven reports. Users who submit feedback are fully responsible for making sure their reports are true and honest.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-extrabold text-zinc-900 dark:text-zinc-200 flex items-center space-x-1.5 text-base">
            <span className="text-amber-500">✔</span>
            <span>Spam Protection</span>
          </h3>
          <p>
            To keep the platform fast and stop spam attacks, we limit how many rapid searches or reports a single user can make.
          </p>
        </div>
      </div>
    </div>
  );
}
