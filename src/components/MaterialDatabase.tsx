import React, { useState } from "react";
import { MATERIALS_DATABASE } from "../data/biomedicalData";
import { MaterialInfo } from "../types";
import {
  Atom,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Beaker
} from "lucide-react";

export const MaterialDatabase: React.FC = () => {
  const [hoveredMaterial, setHoveredMaterial] = useState<string | null>(null);

  const categoryBadges: Record<string, string> = {
    BIOPOLYMER: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    HYDROGEL: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    CERAMIC: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    THERMOPLASTIC: "bg-amber-500/20 text-amber-300 border-amber-500/30"
  };

  return (
    <section id="materials" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono mb-3">
            <Atom size={14} className="text-purple-400 animate-spin-slow" />
            <span>BIOMATERIAL INTELLIGENCE DATABASE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-display">
            Physicochemical Biomaterial Profiles
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
            Characterized biomimetic matrices calibrated for biocompatibility, photo-crosslinking
            kinetics, and degradation half-life.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
          <span>Hover cards for molecular lattice resonance</span>
        </div>
      </div>

      {/* Material Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MATERIALS_DATABASE.map((mat) => {
          const isHovered = hoveredMaterial === mat.id;
          return (
            <div
              key={mat.id}
              id={`card-material-${mat.id}`}
              onMouseEnter={() => setHoveredMaterial(mat.id)}
              onMouseLeave={() => setHoveredMaterial(null)}
              className={`relative p-6 rounded-3xl bg-slate-900/80 border transition-all duration-300 backdrop-blur-xl shadow-xl flex flex-col justify-between overflow-hidden group ${
                isHovered
                  ? "border-cyan-400/80 -translate-y-2 shadow-2xl shadow-cyan-500/20"
                  : "border-slate-800/90 hover:border-slate-700"
              }`}
            >
              {/* Background molecular particle animation canvas overlay on hover */}
              {isHovered && (
                <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-cyan-400/40 animate-spin-slow" />
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-purple-400/40 animate-spin-slow"
                    style={{ animationDirection: "reverse", animationDuration: "12s" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/40 via-transparent to-purple-950/20" />
                </div>
              )}

              <div className="relative z-10">
                {/* Header: Category & Formula */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                      categoryBadges[mat.category] || "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {mat.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 truncate max-w-[120px]">
                    {mat.chemicalFormula}
                  </span>
                </div>

                {/* Title */}
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                    {mat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {mat.description}
                  </p>
                </div>

                {/* 3 Core Metrics requested: Strength, Flexibility, Degradation */}
                <div className="mt-5 grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/90 text-center">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">
                      Strength
                    </span>
                    <span className="text-xs font-bold font-mono text-white mt-0.5 block">
                      {mat.strength}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">
                      Flexibility
                    </span>
                    <span className="text-xs font-bold font-mono text-cyan-300 mt-0.5 block">
                      {mat.flexibility}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">
                      Resorption
                    </span>
                    <span className="text-xs font-bold font-mono text-amber-300 mt-0.5 block truncate">
                      {mat.degradation.split(" ")[0]}
                    </span>
                  </div>
                </div>

                {/* Typical Applications */}
                <div className="mt-4">
                  <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-1.5">
                    Typical Applications:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mat.typicalApplications.map((app) => (
                      <span
                        key={app}
                        className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-750 text-[10px] text-slate-300"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Crosslinking hint footer */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 relative z-10">
                <span className="text-[10px] font-mono text-slate-400 block leading-tight">
                  <strong className="text-cyan-400">Crosslink:</strong> {mat.crosslinkingMethod}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
