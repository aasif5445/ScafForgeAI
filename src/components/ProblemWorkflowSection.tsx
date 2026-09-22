import React from "react";
import {
  Clock,
  Zap,
  ArrowRight,
  AlertOctagon,
  CheckCircle2,
  FileText,
  Compass,
  Cpu,
  RefreshCw,
  Printer,
  ChevronDown,
  Sparkles,
  Rocket
} from "lucide-react";

export const ProblemWorkflowSection: React.FC = () => {
  const currentWorkflowSteps = [
    { title: "Patient Need", desc: "Urgent trauma or organ failure condition identified" },
    { title: "Read Dozens of Papers", desc: "Manual bibliographic search across PubMed & Elsevier (3–6 weeks)" },
    { title: "Manual CAD", desc: "Handcrafting solid CAD geometry in SolidWorks/Rhino (2–4 weeks)" },
    { title: "Simulation", desc: "Standalone FEA stress & CFD mesh setup with high convergence failure" },
    { title: "Repeated Redesign", desc: "Trial-and-error geometric redesign loops (3–6 months)" },
    { title: "Bioprint", desc: "Unpredictable nozzle clogging & poor in vitro cell viability" }
  ];

  const scafforgeWorkflowSteps = [
    { title: "Select Tissue", desc: "Target bone, skin, cartilage, ligament, or tendon in one click" },
    { title: "AI Literature Analysis", desc: "ChromaDB vector lookup over 14,800+ biomaterial papers in &lt; 200ms" },
    { title: "Automatic Scaffold Generation", desc: "Instant mathematical TPMS & Gyroid minimal surface synthesis" },
    { title: "3D Visualization", desc: "Real-time WebGL mesh manipulation, slicing & pore diameter inspection" },
    { title: "IoT Hardware Simulation", desc: "ESP32 firmware telemetry & pneumatic extruder motor calibration" },
    { title: "Export Design", desc: "Production-ready 3D printable .STL, .GLTF & G-code ready in minutes" }
  ];

  return (
    <section id="workflow" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
          <Rocket size={14} className="text-cyan-400" />
          <span>RESEARCH ACCELERATION BENCHMARK</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
          From Months of Trial-and-Error to Minutes of AI Synthesis
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-3">
          Traditional tissue scaffold engineering is bogged down by fragmented research literature
          and arduous manual CAD remodeling. ScafForge AI unifies the entire pipeline.
        </p>
      </div>

      {/* Split-screen Comparison Grid */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Current Workflow (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-950/70 border border-rose-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertOctagon size={18} />
              <h3 className="text-base font-bold tracking-wide">Current Workflow</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-rose-500/15 text-rose-300 border border-rose-500/30">
              Slow · 6–18 Months
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {currentWorkflowSteps.map((step, idx) => (
              <React.Fragment key={step.title}>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-200">{step.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
                {idx < currentWorkflowSteps.length - 1 && (
                  <div className="flex justify-center -my-1 text-slate-600">
                    <ChevronDown size={16} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-[11px] text-rose-300 font-mono text-center">
            ⚠️ 68% of manual preclinical scaffold prototypes fail due to non-interconnected pores
          </div>
        </div>

        {/* Center Animated Velocity Bridge (2 cols) */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0">
          <div className="relative p-4 rounded-2xl bg-gradient-to-b from-cyan-500/15 via-blue-500/20 to-purple-500/15 border border-cyan-500/40 text-center shadow-2xl flex flex-col items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 font-display">
              50x
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300">
              FASTER RESEARCH
            </span>

            {/* Animated pulsing arrow pointing right */}
            <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
              <ArrowRight size={16} className="animate-pulse" />
            </div>

            <span className="text-[9px] font-mono text-slate-400 leading-tight">
              Preclinical Design Iteration
            </span>
          </div>
        </div>

        {/* Right Side: ScafForge AI Workflow (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-xl shadow-2xl shadow-cyan-500/10 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles size={18} />
              <h3 className="text-base font-bold tracking-wide text-white">ScafForge AI</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
              Instant · &lt; 3 Minutes
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {scafforgeWorkflowSteps.map((step, idx) => (
              <React.Fragment key={step.title}>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/25 text-cyan-300 text-xs font-mono flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">{step.title}</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">{step.desc}</p>
                  </div>
                </div>
                {idx < scafforgeWorkflowSteps.length - 1 && (
                  <div className="flex justify-center -my-1 text-cyan-400">
                    <ChevronDown size={16} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-[11px] text-cyan-300 font-mono text-center">
            ✓ 100% interconnected TPMS permeability with automated STL & ESP32 G-Code export
          </div>
        </div>
      </div>
    </section>
  );
};
