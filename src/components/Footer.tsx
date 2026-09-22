import React from "react";
import { Sparkles, ShieldAlert, Heart, ExternalLink, ArrowUp } from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#040711] border-t border-slate-800/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-cyan-600/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col gap-12 relative z-10">
        {/* Top Disclaimer Highlight Box */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-amber-300 font-mono tracking-wide">
                RESEARCH PROTOTYPE • EDUCATIONAL & RESEARCH USE ONLY
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                ScafForge AI is a computational research assistant for biomedical tissue engineers.
                It does not constitute medical advice, diagnostic software, or an FDA/CE-cleared
                therapeutic device.
              </p>
            </div>
          </div>
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white transition-all shrink-0"
            title="Back to Top"
          >
            <ArrowUp size={16} />
          </button>
        </div>

        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 flex flex-col items-start gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5">
                <div className="w-full h-full bg-[#070B1A] rounded-[6px] flex items-center justify-center">
                  <Sparkles size={14} className="text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white font-display">
                ScafForge <span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-cyan-200/80 font-medium font-display">
              Forging the Future of Tissue Engineering with AI
            </p>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mt-1">
              The computational research assistant for predictive tissue scaffold design,
              unifying mathematical TPMS minimal surfaces with generative biomedical literature
              analysis and ESP32 hardware bioprinting kinematics.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <span className="text-xs font-mono uppercase text-slate-300 font-semibold tracking-wider block mb-3">
              Platform Modules
            </span>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#ai-lab" className="hover:text-cyan-300 transition-colors">
                  Generative AI Laboratory
                </a>
              </li>
              <li>
                <a href="#3d-viewer" className="hover:text-cyan-300 transition-colors">
                  Interactive 3D Scaffold Viewer
                </a>
              </li>
              <li>
                <a href="#digital-twin" className="hover:text-cyan-300 transition-colors">
                  Digital Twin Multi-Physics
                </a>
              </li>
              <li>
                <a href="#iot-hardware" className="hover:text-cyan-300 transition-colors">
                  ESP32 IoT Physical Pipeline
                </a>
              </li>
              <li>
                <a href="#materials" className="hover:text-cyan-300 transition-colors">
                  Biomaterial Database
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Research Foundations */}
          <div>
            <span className="text-xs font-mono uppercase text-slate-300 font-semibold tracking-wider block mb-3">
              Research Foundations
            </span>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#workflow" className="hover:text-cyan-300 transition-colors">
                  Preclinical Acceleration
                </a>
              </li>
              <li>
                <a href="#motivation" className="hover:text-cyan-300 transition-colors">
                  Patient Motivation Stories
                </a>
              </li>
              <li>
                <a href="#analytics" className="hover:text-cyan-300 transition-colors">
                  Viability & Printability Indices
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-cyan-300 transition-colors">
                  2026–2028 Strategic Roadmap
                </a>
              </li>
              <li>
                <a href="#team" className="hover:text-cyan-300 transition-colors">
                  Research Squad
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            © 2026 ScafForge AI • Precision Bio-CAD & Tissue Engineering • Educational & Research Use Only
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>WCAG 2.1 AA Compliant</span>
            <span>•</span>
            <span>60 FPS WebGL Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
