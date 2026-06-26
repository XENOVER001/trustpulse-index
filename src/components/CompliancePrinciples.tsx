import React from "react";
import { Shield } from "lucide-react";

export function CompliancePrinciples() {
  return (
    <div className="pt-10 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight flex items-center space-x-2">
          <Shield className="w-5.5 h-5.5 text-blue-600" />
          <span>TrustPulse Intermediary Safe Harbor Compliance Principles</span>
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider font-bold mt-1">
          Sustaining objective Consumer Telemetry under international safe harbors
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <div className="space-y-2">
          <h3 className="font-extrabold text-zinc-900 dark:text-zinc-200 flex items-center space-x-1.5 text-base">
            <span className="text-emerald-500">✔</span>
            <span>Objective, Non-Defamatory Taxonomy</span>
          </h3>
          <p>
            To maintain strict compliance with civil registries, we ban subjective defamatory labels. All indices map to quantitative, metric-based classifications: <strong>"Transaction Friction Index"</strong>, <strong>"Public Dispute File"</strong>, and <strong>"Linguistic Risk Cues"</strong>.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-extrabold text-zinc-900 dark:text-zinc-200 flex items-center space-x-1.5 text-base">
            <span className="text-blue-500">✔</span>
            <span>Institutional Brand Whitelisting</span>
          </h3>
          <p>
            To systematically mitigate malicious spam or corporate brand impersonation, globally validated institutional domains are protected from unverified user dispute filings, ensuring absolute data integrity.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-extrabold text-zinc-900 dark:text-zinc-200 flex items-center space-x-1.5 text-base">
            <span className="text-indigo-500">✔</span>
            <span>Intermediary Safe Harbor Immunity</span>
          </h3>
          <p>
            Under global safe harbor statutes, TrustPulse operates strictly as a passive distributor of crowd-sourced dispute telemetry. Posting users accept full civil responsibility for inputs.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-extrabold text-zinc-900 dark:text-zinc-200 flex items-center space-x-1.5 text-base">
            <span className="text-amber-500">✔</span>
            <span>Bandwidth Rate-Limiting</span>
          </h3>
          <p>
            To prevent denial of service and secure server-side linguistic scan queries, client-side rate limit lockouts are systematically applied across all interactive evaluation portals.
          </p>
        </div>
      </div>
    </div>
  );
}
