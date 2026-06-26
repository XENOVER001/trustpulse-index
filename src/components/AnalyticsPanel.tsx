import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface AnalyticsPanelProps {
  totalGood: number;
  totalBad: number;
  scoreLabel: string;
  scoreValue: string;
  statusText: string;
  chartData: { name: string; trust: number; friction: number }[];
  isWhitelisted: boolean;
  isLegit: boolean;
}

export function AnalyticsPanel({
  totalGood,
  totalBad,
  scoreLabel,
  scoreValue,
  statusText,
  chartData,
  isWhitelisted,
  isLegit
}: AnalyticsPanelProps) {
  const isHealthy = isWhitelisted || isLegit;

  return (
    <div className="py-6 border-b border-zinc-200 dark:border-zinc-850 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">
          Dynamic Safety Analytics Report
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
          Real-time parameters generated dynamically from historical database entries and warning logs.
        </p>
      </div>

      {/* CALCULATED KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase font-mono text-zinc-400 font-extrabold block">Community Good Logs</span>
          <span className="text-2xl font-black font-mono text-emerald-600">
            {totalGood}
          </span>
          <p className="text-[10px] text-zinc-500 mt-1">Legitimate interaction receipts</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase font-mono text-zinc-400 font-extrabold block">Friction Warning Alerts</span>
          <span className="text-2xl font-black font-mono text-rose-600">
            {totalBad}
          </span>
          <p className="text-[10px] text-zinc-500 mt-1 font-medium">Indexed consumer dispute reports</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <span className="text-[10px] uppercase font-mono text-zinc-400 font-extrabold block">
            {scoreLabel}
          </span>
          <span className="text-2xl font-black font-mono text-blue-600">
            {scoreValue}
          </span>
          <p className="text-[10px] text-zinc-500 mt-1">Calculated performance margin</p>
        </div>
      </div>

      {/* CALCULATED BAR CHART TIMELINE */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-350 uppercase font-mono block">
          {statusText} — 6-Month Calculated Trend
        </span>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: -25 }}>
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={8} />
              <YAxis stroke="#a1a1aa" fontSize={8} />
              <Tooltip />
              <Bar 
                dataKey={isHealthy ? "trust" : "friction"} 
                fill={isHealthy ? "#10b981" : "#ef4444"} 
                radius={[4, 4, 0, 0]} 
                name={isHealthy ? "Trust Rating" : "Warnings Logged"} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
