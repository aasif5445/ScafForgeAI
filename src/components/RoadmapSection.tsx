import React from "react";
import { ROADMAP_ITEMS } from "../data/biomedicalData";
import {
  GitBranch,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowDown
} from "lucide-react";

export const RoadmapSection: React.FC = () => {
  return (
    <section id="roadmap" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
          <GitBranch size={14} className="text-cyan-400" />
          <span>RESEARCH & TRANSLATIONAL MILESTONES</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
          The Long-Term Architecture Horizon
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          From algorithmic CAD synthesis to automated closed-loop bioprinter arrays and preclinical
          multi-center trials.
        </p>
      </div>

      {/* Glowing Vertical Roadmap */}
      <div className="relative max-w-3xl mx-auto">
        {/* Central glowing vertical guide line */}
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-cyan-500 via-purple-500 to-slate-800 shadow-[0_0_12px_rgba(6,182,212,0.6)]" />

        <div className="flex flex-col gap-10">
          {ROADMAP_ITEMS.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div
                key={item.phase}
                className={`relative flex items-center ${
                  isLeft ? "sm:flex-row-reverse" : "sm:flex-row"
                } flex-row`}
              >
                {/* Node pin on the central line */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#070B1A] border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_16px_#06B6D4] z-10">
                  <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
                </div>

                {/* Content card */}
                <div
                  className={`w-full sm:w-[calc(50%-32px)] pl-12 sm:pl-0 ${
                    isLeft ? "sm:text-right sm:pr-4" : "sm:text-left sm:pl-4"
                  }`}
                >
                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 backdrop-blur-xl shadow-xl transition-all group">
                    <div
                      className={`flex items-center gap-2 mb-2 ${
                        isLeft ? "sm:justify-end" : "sm:justify-start"
                      }`}
                    >
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {item.phase}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>

                    <ul
                      className={`mt-3 space-y-1.5 text-xs text-slate-400 ${
                        isLeft ? "sm:items-end" : "sm:items-start"
                      }`}
                    >
                      {item.items.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span className="text-cyan-400 shrink-0">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
