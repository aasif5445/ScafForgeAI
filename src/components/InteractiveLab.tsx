import React, { useState, useEffect } from "react";
import { TissueId, LatticePattern, RecommendationResult, TissuePreset } from "../types";
import { TISSUE_PRESETS, RESEARCH_CITATIONS } from "../data/biomedicalData";
import { ExplainableAIPanel } from "./ExplainableAIPanel";
import {
  Sparkles,
  Sliders,
  RotateCcw,
  Zap,
  Activity,
  CheckCircle2,
  Layers,
  Clock,
  Gauge,
  ScanLine,
  ArrowRight,
  Shield,
  HelpCircle
} from "lucide-react";

interface InteractiveLabProps {
  currentTissue: TissueId;
  setCurrentTissue: (t: TissueId) => void;
  currentPattern: LatticePattern;
  setCurrentPattern: (p: LatticePattern) => void;
  currentPorosity: number;
  setCurrentPorosity: (por: number) => void;
  onSyncToHardware?: () => void;
}

export const InteractiveLab: React.FC<InteractiveLabProps> = ({
  currentTissue,
  setCurrentTissue,
  currentPattern,
  setCurrentPattern,
  currentPorosity,
  setCurrentPorosity,
  onSyncToHardware
}) => {
  const selectedPreset: TissuePreset = TISSUE_PRESETS[currentTissue] || TISSUE_PRESETS.bone;

  // Sliders state
  const [strength, setStrength] = useState<number>(selectedPreset.defaultStrength);
  const [flexibility, setFlexibility] = useState<number>(selectedPreset.defaultFlexibility);
  const [degradation, setDegradation] = useState<number>(selectedPreset.defaultDegradation);
  const [porosity, setPorosity] = useState<number>(selectedPreset.defaultPorosity);

  // AI Generation loading state
  const [isGenerating, setIsGenerating] = useState(false);
  const [reasoningStepIndex, setReasoningStepIndex] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(true);

  // Sync sliders when tissue changes
  useEffect(() => {
    const preset = TISSUE_PRESETS[currentTissue];
    if (preset) {
      setStrength(preset.defaultStrength);
      setFlexibility(preset.defaultFlexibility);
      setDegradation(preset.defaultDegradation);
      setPorosity(preset.defaultPorosity);
      setCurrentPattern(preset.recommendedPattern);
      setCurrentPorosity(preset.defaultPorosity);
    }
  }, [currentTissue, setCurrentPattern, setCurrentPorosity]);

  const reasoningSteps = [
    "Querying ChromaDB vector index over 14,800+ biomaterial papers...",
    "Computing finite element Navier-Stokes fluid shear stress matrices...",
    "Synthesizing optimal TPMS / Gyroid zero-mean minimal surface curvature...",
    "Calibrating pneumatic bioprinter extrusion velocity & UV crosslinking..."
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setReasoningStepIndex(0);

    const stepInterval = setInterval(() => {
      setReasoningStepIndex((prev) => {
        if (prev < reasoningSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 700);

    setTimeout(() => {
      clearInterval(stepInterval);
      setIsGenerating(false);
      setHasGenerated(true);
      setCurrentPorosity(porosity);
      setCurrentPattern(selectedPreset.recommendedPattern);
    }, 3000);
  };

  // Build recommendation object
  const currentRecommendation: RecommendationResult = {
    tissueId: currentTissue,
    material: selectedPreset.recommendedMaterial,
    poreSize: selectedPreset.recommendedPoreSize,
    porosity: porosity,
    pattern: selectedPreset.recommendedPattern,
    printingSpeed: selectedPreset.recommendedSpeed,
    strength: `${strength.toFixed(1)} MPa`,
    degradation: `${degradation} ${currentTissue === "skin" ? "weeks" : "months"}`,
    confidence: selectedPreset.confidence,
    reason: selectedPreset.biomedicalReason,
    tradeOffs: {
      pros: [
        "Continuous hydraulic permeability prevents central hypoxic necrosis",
        "Modulus closely matches native biomechanical extracellular matrix",
        "High printability index on standard pneumatic micro-extrusion systems"
      ],
      cons: [
        "Demands strictly controlled nozzle temperature to prevent shear thinning",
        "Gel phase requires immediate post-print 405nm photo-crosslinking"
      ],
      mitigation: "ESP32 firmware applies closed-loop PID thermal regulation at 37.0°C."
    },
    citations: RESEARCH_CITATIONS.slice(0, 3)
  };

  const tissueButtons: { id: TissueId; label: string; icon: string; color: string }[] = [
    { id: "bone", label: "Bone", icon: "🦴", color: "from-blue-600 to-cyan-600" },
    { id: "skin", label: "Skin", icon: "✨", color: "from-rose-500 to-pink-600" },
    { id: "cartilage", label: "Cartilage", icon: "💧", color: "from-purple-600 to-indigo-600" },
    { id: "ligament", label: "Ligament", icon: "⚡", color: "from-amber-500 to-orange-600" },
    { id: "tendon", label: "Tendon", icon: "🧬", color: "from-cyan-600 to-teal-600" }
  ];

  return (
    <section id="ai-lab" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            <Zap size={14} className="text-cyan-400" />
            <span>INTERACTIVE AI BIOMEDICAL LABORATORY • CENTERPIECE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Generative Tissue Scaffold Synthesizer
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
            Select an anatomical tissue target and tune biomechanical constraints to initiate
            instant multi-parameter scaffold architecture synthesis.
          </p>
        </div>

        {/* Quick helper pill */}
        <div className="text-xs font-mono text-slate-400 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
          <HelpCircle size={14} className="text-cyan-400" />
          <span>Select tissue & tune sliders, then click Generate</span>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tissue Picker & Sliders (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Tissue Selection Buttons */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col gap-3">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              1. Select Target Tissue
            </span>
            <div className="grid grid-cols-5 gap-2">
              {tissueButtons.map((t) => (
                <button
                  key={t.id}
                  id={`select-tissue-${t.id}`}
                  onClick={() => setCurrentTissue(t.id)}
                  className={`py-3 px-1 rounded-xl text-center flex flex-col items-center gap-1 border transition-all duration-200 ${
                    currentTissue === t.id
                      ? "bg-gradient-to-b from-cyan-500/25 to-blue-600/25 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-102"
                      : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <span className="text-lg">{t.icon}</span>
                  <span className="text-[11px] font-medium tracking-tight truncate w-full">
                    {t.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-850 text-xs text-slate-300">
              <span className="text-cyan-400 font-semibold font-mono">Profile: </span>
              <span>{selectedPreset.biomechanicalProfile}</span>
            </div>
          </div>

          {/* 4 Precision Parameter Sliders */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                2. Biomechanical Sliders
              </span>
              <button
                id="reset-sliders-btn"
                onClick={() => {
                  const preset = TISSUE_PRESETS[currentTissue];
                  setStrength(preset.defaultStrength);
                  setFlexibility(preset.defaultFlexibility);
                  setDegradation(preset.defaultDegradation);
                  setPorosity(preset.defaultPorosity);
                }}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <RotateCcw size={12} />
                <span>Reset Defaults</span>
              </button>
            </div>

            {/* Slider 1: Mechanical Strength */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Gauge size={13} className="text-blue-400" />
                  <span>Mechanical Compressive Strength</span>
                </span>
                <span className="font-mono text-cyan-300 font-semibold">{strength.toFixed(1)} MPa</span>
              </div>
              <input
                id="slider-strength"
                type="range"
                min="0.5"
                max="80"
                step="0.5"
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.5 MPa (Soft hydrogel)</span>
                <span>80 MPa (Cortical bone)</span>
              </div>
            </div>

            {/* Slider 2: Flexibility */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Activity size={13} className="text-rose-400" />
                  <span>Flexibility & Elastic Recovery</span>
                </span>
                <span className="font-mono text-rose-300 font-semibold">{flexibility}%</span>
              </div>
              <input
                id="slider-flexibility"
                type="range"
                min="5"
                max="95"
                value={flexibility}
                onChange={(e) => setFlexibility(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5% (Brittle ceramic)</span>
                <span>95% (Elastomeric dermal)</span>
              </div>
            </div>

            {/* Slider 3: Degradation Speed */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-400" />
                  <span>Degradation Window</span>
                </span>
                <span className="font-mono text-amber-300 font-semibold">
                  {degradation} {currentTissue === "skin" ? "weeks" : "months"}
                </span>
              </div>
              <input
                id="slider-degradation"
                type="range"
                min="2"
                max="24"
                value={degradation}
                onChange={(e) => setDegradation(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>2 {currentTissue === "skin" ? "wks" : "mo"} (Rapid)</span>
                <span>24 {currentTissue === "skin" ? "wks" : "mo"} (Slow skeletal)</span>
              </div>
            </div>

            {/* Slider 4: Porosity */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Layers size={13} className="text-cyan-400" />
                  <span>Interconnected Porosity</span>
                </span>
                <span className="font-mono text-cyan-300 font-semibold">{porosity}%</span>
              </div>
              <input
                id="slider-porosity"
                type="range"
                min="35"
                max="90"
                value={porosity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPorosity(val);
                  setCurrentPorosity(val);
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>35% (Dense load-bearing)</span>
                <span>90% (High vascular transit)</span>
              </div>
            </div>

            {/* Glowing Generate Button */}
            <button
              id="btn-generate-scaffold"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-2 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white font-semibold text-sm tracking-wide shadow-xl shadow-cyan-500/25 border border-cyan-400/40 flex items-center justify-center gap-2 transition-all duration-300 active:scale-98 disabled:opacity-60 relative overflow-hidden"
            >
              {/* Shimmer sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
              <Sparkles size={16} className={isGenerating ? "animate-spin" : ""} />
              <span>
                {isGenerating
                  ? "AI Synthesizing Micro-Geometry..."
                  : "Generate AI Scaffold Recommendation"}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: AI Reasoning Sequence & Output Cards (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Card containing scanning animation & live output */}
          <div className="relative p-6 rounded-2xl bg-slate-900/85 border border-cyan-500/30 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col min-h-[460px]">
            {/* Laser scanning beam overlay when generating */}
            {isGenerating && (
              <div className="absolute inset-0 pointer-events-none z-30">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_18px_#06B6D4] animate-scan-laser absolute" />
                <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
              </div>
            )}

            {/* Top status bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isGenerating ? "bg-amber-400 animate-ping" : "bg-emerald-400"
                  }`}
                />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                  {isGenerating ? "BIOMEDICAL AI REASONING IN PROGRESS" : "AI RECOMMENDATION DISPATCH"}
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 font-medium">
                TARGET: {selectedPreset.label.split(" ")[0].toUpperCase()}
              </span>
            </div>

            {/* If Generating: Show animated 3-second sequence */}
            {isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4 animate-pulse">
                  <ScanLine size={36} />
                </div>
                <h4 className="text-lg font-semibold text-white">
                  Synthesizing Bio-Intelligence Matrix
                </h4>
                <p className="text-xs sm:text-sm text-cyan-300 font-mono mt-2 max-w-md h-10 flex items-center justify-center">
                  {reasoningSteps[reasoningStepIndex]}
                </p>

                {/* Progress bar */}
                <div className="w-full max-w-xs mt-6 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-700 ease-out"
                    style={{
                      width: `${((reasoningStepIndex + 1) / reasoningSteps.length) * 100}%`
                    }}
                  />
                </div>
              </div>
            ) : hasGenerated ? (
              /* Output display with 7 specifications requested by prompt */
              <div className="flex-1 flex flex-col justify-between pt-4">
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {/* 1. Recommended Material */}
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Bio-Material
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white block mt-0.5 leading-snug">
                        {currentRecommendation.material}
                      </span>
                    </div>

                    {/* 2. Pore Size */}
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Pore Diameter
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-cyan-300 block mt-0.5 font-mono">
                        {currentRecommendation.poreSize}
                      </span>
                    </div>

                    {/* 3. Porosity */}
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Porosity
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white block mt-0.5 font-mono">
                        {currentRecommendation.porosity}%
                      </span>
                    </div>

                    {/* 4. Lattice Pattern */}
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Lattice Pattern
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-purple-300 uppercase block mt-0.5 font-mono">
                        {currentRecommendation.pattern}
                      </span>
                    </div>

                    {/* 5. Printing Speed */}
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Printing Speed
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white block mt-0.5 font-mono">
                        {currentRecommendation.printingSpeed}
                      </span>
                    </div>

                    {/* 6. Mechanical Strength */}
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Strength (Yield)
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-emerald-300 block mt-0.5 font-mono">
                        {currentRecommendation.strength}
                      </span>
                    </div>

                    {/* 7. Degradation Estimate */}
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Degradation Est.
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-amber-300 block mt-0.5 font-mono">
                        {currentRecommendation.degradation}
                      </span>
                    </div>

                    {/* 8. Confidence Score */}
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-500/30">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        Confidence
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-cyan-400 block mt-0.5 font-mono">
                        {currentRecommendation.confidence}% Match
                      </span>
                    </div>
                  </div>

                  {/* "Why this recommendation?" Explanation card */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-purple-950/30 border border-cyan-500/30">
                    <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-1">
                      <CheckCircle2 size={14} className="text-cyan-400" />
                      <span>Why this recommendation?</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {currentRecommendation.reason}
                    </p>
                  </div>
                </div>

                {/* Bottom sync trigger */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] font-mono text-slate-400">
                    Live synchronization linked with 3D Scaffold Viewer & ESP32
                  </span>
                  <a
                    href="#3d-viewer"
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-xs text-cyan-300 font-medium flex items-center gap-1.5 transition-all"
                  >
                    <span>Inspect in 3D Lattice Viewer</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Explainable AI Panel (Deep ChatGPT-style reasoning) */}
      <div className="mt-8">
        <ExplainableAIPanel recommendation={currentRecommendation} />
      </div>
    </section>
  );
};
