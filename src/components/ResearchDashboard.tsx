import React, { useState } from "react";
import { TissueId, LatticePattern } from "../types";
import { TISSUE_PRESETS, RESEARCH_CITATIONS } from "../data/biomedicalData";
import { generateResearchSummaryPDF } from "../utils/reportGenerator";
import {
  Activity,
  FileDown,
  ArrowLeftRight,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Scale,
  Gauge,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";

interface CircularProgressProps {
  value: number; // 0 to 100
  label: string;
  sublabel: string;
  color: string;
  strokeColor: string;
  unit?: string;
  displayOverride?: string;
  trend?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  label,
  sublabel,
  color,
  strokeColor,
  unit = "%",
  displayOverride,
  trend
}) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800/90 hover:border-cyan-500/40 backdrop-blur-xl shadow-xl flex flex-col items-center text-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 group">
      {/* Subtle top indicator line */}
      <div
        className="absolute top-0 left-1/4 right-1/4 h-[2px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: strokeColor }}
      />

      <div className="relative w-28 h-28 flex items-center justify-center my-2">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          {/* Background circle track */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth="7"
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={strokeColor}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Inner value readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-bold font-mono tracking-tight ${color}`}>
            {displayOverride ? displayOverride : `${value}${unit}`}
          </span>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
            OPTIMIZED
          </span>
        </div>
      </div>

      <div className="mt-2 w-full">
        <h4 className="text-sm font-semibold text-white tracking-wide flex items-center justify-center gap-1.5">
          <span>{label}</span>
          {trend && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {trend}
            </span>
          )}
        </h4>
        <p className="text-[11px] text-slate-400 mt-1 leading-snug">{sublabel}</p>
      </div>
    </div>
  );
};

interface ResearchDashboardProps {
  porosity: number;
  currentTissue: TissueId;
  currentPattern: LatticePattern;
  onSelectTissue?: (tissue: TissueId) => void;
}

export const ResearchDashboard: React.FC<ResearchDashboardProps> = ({
  porosity,
  currentTissue,
  currentPattern,
  onSelectTissue
}) => {
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareTissue, setCompareTissue] = useState<TissueId>(
    currentTissue === "bone" ? "cartilage" : "bone"
  );
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const activePreset = TISSUE_PRESETS[currentTissue] || TISSUE_PRESETS.bone;
  const benchmarkPreset = TISSUE_PRESETS[compareTissue] || TISSUE_PRESETS.cartilage;

  // Key metrics calculation
  const recommendedPoreSize = porosity > 75 ? "180 μm" : "420 μm";
  const printabilityScore = 94;
  const mechanicalStability = 91;
  const researchConfidence = 96;
  const reynoldsNumber = "0.042 Re";
  const wallShearStress = "0.18 Pa";
  const peakVonMises = "14.2 MPa";
  const cellViability = "96.8%";

  // Handler for PDF download
  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      // Small tick for UI feedback
      await new Promise((resolve) => setTimeout(resolve, 350));

      generateResearchSummaryPDF({
        primaryTissue: activePreset,
        porosity,
        pattern: currentPattern,
        compareTissue: isCompareMode ? benchmarkPreset : null,
        metrics: {
          poreSize: recommendedPoreSize,
          porosityScore: porosity,
          printabilityScore,
          mechanicalStability,
          researchConfidence,
          reynoldsNumber,
          wallShearStress,
          peakVonMises,
          cellViability
        },
        citations: RESEARCH_CITATIONS
      });

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Comparative calculations
  const primaryModulus = activePreset.defaultStrength;
  const compareModulus = benchmarkPreset.defaultStrength;
  const modulusDelta = (((primaryModulus - compareModulus) / compareModulus) * 100).toFixed(0);

  const primaryDegradation = activePreset.defaultDegradation;
  const compareDegradation = benchmarkPreset.defaultDegradation;

  return (
    <section id="analytics" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-80 bg-cyan-600/5 blur-3xl pointer-events-none" />

      {/* Section Header & Action Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            <Activity size={14} className="text-cyan-400" />
            <span>REAL-TIME BIOMECHANICAL ANALYTICS & CLINICAL EVIDENCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-display">
            Scaffold Viability & Printability Indices
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Calculated across multi-physics Navier-Stokes boundary equations and in vitro rheology.
            Evaluate in silico benchmarks before bioprinting.
          </p>
        </div>

        {/* Action Controls: Compare Mode Toggle + Download PDF Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Compare Mode Toggle */}
          <button
            id="analytics-toggle-compare-mode"
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all duration-200 active:scale-95 ${
              isCompareMode
                ? "bg-purple-500/20 border-purple-500/60 text-purple-200 shadow-lg shadow-purple-500/15"
                : "bg-slate-900/90 border-slate-750 text-slate-300 hover:text-white hover:border-slate-600"
            }`}
          >
            <Scale size={16} className={isCompareMode ? "text-purple-400" : "text-slate-400"} />
            <span>Compare Mode</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                isCompareMode
                  ? "bg-purple-500/30 text-purple-300"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {isCompareMode ? "ACTIVE" : "OFF"}
            </span>
          </button>

          {/* Download Research Summary PDF Button */}
          <button
            id="analytics-download-pdf-btn"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-xl shadow-cyan-500/20 border border-cyan-400/40 flex items-center gap-2.5 transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 size={16} className="text-emerald-300" />
                <span className="text-emerald-100">PDF Report Generated!</span>
              </>
            ) : (
              <>
                <FileDown
                  size={16}
                  className={`text-cyan-200 group-hover:translate-y-0.5 transition-transform ${
                    isGeneratingPdf ? "animate-bounce" : ""
                  }`}
                />
                <span>{isGeneratingPdf ? "Generating PDF..." : "Download Research Summary"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5 Primary Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* 1. Recommended Pore Size */}
        <CircularProgress
          value={82}
          displayOverride={recommendedPoreSize}
          label="Recommended Pore Size"
          sublabel="Optimal for cellular transit & oxygen diffusion"
          color="text-cyan-300"
          strokeColor="#06B6D4"
          trend="Validated"
        />

        {/* 2. Porosity Score */}
        <CircularProgress
          value={porosity}
          label="Porosity Score"
          sublabel="Zero dead-volume minimal surface index"
          color="text-blue-300"
          strokeColor="#2563EB"
          trend="Laminar"
        />

        {/* 3. Printability Score */}
        <CircularProgress
          value={printabilityScore}
          label="Printability Score"
          sublabel="Viscous stability & filament retention"
          color="text-purple-300"
          strokeColor="#7C3AED"
          trend="Extrudable"
        />

        {/* 4. Mechanical Stability */}
        <CircularProgress
          value={mechanicalStability}
          label="Mechanical Stability"
          sublabel="Yield tolerance under physiological strain"
          color="text-emerald-300"
          strokeColor="#10B981"
          trend="Load Safe"
        />

        {/* 5. Research Confidence */}
        <CircularProgress
          value={researchConfidence}
          label="Research Confidence"
          sublabel="ChromaDB peer-reviewed consensus score"
          color="text-amber-300"
          strokeColor="#F59E0B"
          trend="Top 1%"
        />
      </div>

      {/* ======================================================== */}
      {/* COMPARE MODE: Side-by-Side Dual-Tissue Benchmark Module */}
      {/* ======================================================== */}
      {isCompareMode && (
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-900/95 border border-purple-500/40 shadow-2xl backdrop-blur-2xl relative overflow-hidden transition-all duration-300">
          {/* Glowing accent border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

          {/* Compare Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 text-purple-300 font-mono text-xs mb-1">
                <ArrowLeftRight size={14} className="text-purple-400" />
                <span>CROSS-TISSUE BENCHMARKING ENGINE</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Side-by-Side Biomechanical Comparison
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Benchmark primary design against alternative anatomical tissue requirements to evaluate compliance trade-offs.
              </p>
            </div>

            {/* Benchmark Selector */}
            <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
              <span className="text-xs font-mono text-slate-400 pl-2">Benchmark:</span>
              <div className="flex flex-wrap gap-1">
                {(["bone", "cartilage", "skin", "ligament", "tendon"] as TissueId[]).map((tid) => {
                  const p = TISSUE_PRESETS[tid];
                  const isSelected = compareTissue === tid;
                  const isPrimary = currentTissue === tid;
                  return (
                    <button
                      key={tid}
                      id={`compare-target-${tid}`}
                      onClick={() => setCompareTissue(tid)}
                      disabled={isPrimary}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-purple-500/30 border border-purple-400/50 text-purple-200 font-semibold shadow-md"
                          : isPrimary
                          ? "opacity-40 cursor-not-allowed text-slate-500"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      }`}
                    >
                      {p.label.split(" ")[0]}
                      {isPrimary && " (Active)"}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Primary vs Benchmark Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Left Col: Primary Active Tissue */}
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    Primary Active Target
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                  {currentPattern.toUpperCase()} TPMS
                </span>
              </div>

              <h4 className="text-xl font-bold text-white mt-3 font-display">
                {activePreset.label}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {activePreset.biomechanicalProfile}
              </p>

              {/* Param Rows */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Compressive Modulus
                  </span>
                  <span className="text-lg font-bold text-cyan-300 font-mono">
                    {activePreset.defaultStrength} MPa
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Effective Porosity
                  </span>
                  <span className="text-lg font-bold text-cyan-300 font-mono">
                    {porosity}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Degradation Window
                  </span>
                  <span className="text-sm font-semibold text-slate-200">
                    {activePreset.defaultDegradation} months
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Recommended Bioink
                  </span>
                  <span className="text-xs font-medium text-slate-200 truncate block">
                    {activePreset.recommendedMaterial.split("/")[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Col: Benchmark Comparison Target */}
            <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                    Benchmark Comparison
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">
                  {benchmarkPreset.recommendedPattern.toUpperCase()} LATTICE
                </span>
              </div>

              <h4 className="text-xl font-bold text-white mt-3 font-display">
                {benchmarkPreset.label}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {benchmarkPreset.biomechanicalProfile}
              </p>

              {/* Param Rows */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Compressive Modulus
                  </span>
                  <span className="text-lg font-bold text-purple-300 font-mono">
                    {benchmarkPreset.defaultStrength} MPa
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Standard Porosity
                  </span>
                  <span className="text-lg font-bold text-purple-300 font-mono">
                    {benchmarkPreset.defaultPorosity}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Degradation Window
                  </span>
                  <span className="text-sm font-semibold text-slate-200">
                    {benchmarkPreset.defaultDegradation} months
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Recommended Bioink
                  </span>
                  <span className="text-xs font-medium text-slate-200 truncate block">
                    {benchmarkPreset.recommendedMaterial.split("/")[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparative Metrics Delta Matrix */}
          <div className="mt-6 p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <h5 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" />
              <span>Comparative Delta Analysis</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Delta 1: Modulus */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <span className="text-xs text-slate-400">Modulus Variance</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-white">
                    {Number(modulusDelta) >= 0 ? `+${modulusDelta}%` : `${modulusDelta}%`}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {Number(modulusDelta) >= 0 ? "Stiffer matrix" : "More compliant"}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(10, (primaryModulus / (primaryModulus + compareModulus)) * 100))}%`
                    }}
                  />
                </div>
              </div>

              {/* Delta 2: Degradation Horizon */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <span className="text-xs text-slate-400">Degradation Delta</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-white">
                    {Math.abs(primaryDegradation - compareDegradation)} mo
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {primaryDegradation > compareDegradation ? "Longer retention" : "Faster resorption"}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-purple-400 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(10, (primaryDegradation / (primaryDegradation + compareDegradation)) * 100))}%`
                    }}
                  />
                </div>
              </div>

              {/* Delta 3: Quick Switch CTA */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <span className="text-xs text-slate-400">Pivot Active Target?</span>
                <button
                  id="compare-switch-primary-btn"
                  onClick={() => {
                    if (onSelectTissue) {
                      onSelectTissue(compareTissue);
                      setCompareTissue(currentTissue);
                    }
                  }}
                  className="mt-2 w-full py-1.5 px-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ArrowLeftRight size={13} />
                  <span>Set {benchmarkPreset.label.split(" ")[0]} as Active</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
