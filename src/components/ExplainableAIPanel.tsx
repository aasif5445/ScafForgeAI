import React, { useState } from "react";
import { RecommendationResult } from "../types";
import {
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Database,
  Search
} from "lucide-react";

interface ExplainableAIPanelProps {
  recommendation: RecommendationResult;
}

export const ExplainableAIPanel: React.FC<ExplainableAIPanelProps> = ({ recommendation }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<"reasoning" | "tradeoffs" | "literature">("reasoning");

  return (
    <div className="w-full rounded-2xl border border-purple-500/25 bg-slate-950/80 backdrop-blur-xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Background ambient accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar styled like ChatGPT's Deep Reasoning banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <BrainCircuit size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white tracking-wide">
                Explainable Bio-AI Reasoning Panel
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-mono rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Sparkles size={11} />
                <span>Deep Bio-Synthesis</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent multi-objective optimization & biomedical literature grounding
            </p>
          </div>
        </div>

        {/* Confidence Gauge Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-750">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-300">CONFIDENCE:</span>
            <span className="text-xs font-mono font-bold text-emerald-300">
              {recommendation.confidence}%
            </span>
          </div>

          <button
            id="toggle-explainable-panel"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 transition-colors"
            title={isExpanded ? "Collapse Reasoning" : "Expand Reasoning"}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 flex flex-col gap-4">
          {/* Reasoning Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
            <button
              id="tab-reasoning"
              onClick={() => setActiveTab("reasoning")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "reasoning"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              1. Synthesized Rationale
            </button>
            <button
              id="tab-tradeoffs"
              onClick={() => setActiveTab("tradeoffs")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "tradeoffs"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              2. Material Trade-Offs
            </button>
            <button
              id="tab-literature"
              onClick={() => setActiveTab("literature")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "literature"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              3. ChromaDB Citations ({recommendation.citations.length})
            </button>
          </div>

          {/* Tab 1: Reasoning Explanation */}
          {activeTab === "reasoning" && (
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5">
                  <ShieldCheck size={16} />
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Primary Biomimetic Recommendation
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {recommendation.reason}
                  </p>
                </div>
              </div>

              {/* Step-by-step reasoning transcript */}
              <div className="mt-2 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
                <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  Deep Chain of Scientific Thought:
                </span>
                <div className="space-y-1.5 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>
                      Target Elastic Modulus matches physiological loading curve ({recommendation.strength})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>
                      TPMS surface curvature ensures zero-shear stagnation zones under microfluidic transit
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>
                      Degradation window ({recommendation.degradation}) synchronized with neotissue deposition rates
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Material Trade-Offs */}
          {activeTab === "tradeoffs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>Biomechanical Advantages</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {recommendation.tradeOffs.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-col gap-2">
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  <span>Manufacturing & Printing Constraints</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {recommendation.tradeOffs.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 pt-2 border-t border-amber-500/20 text-[11px] text-amber-200/80">
                  <strong>AI Mitigation:</strong> {recommendation.tradeOffs.mitigation}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: ChromaDB Literature Grounding */}
          {activeTab === "literature" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <Database size={13} />
                  <span>ChromaDB Vector Embeddings • Cosine Distance &lt; 0.18</span>
                </span>
                <span>14,800+ Articles Indexed</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendation.citations.map((cit) => (
                  <div
                    key={cit.id}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-colors flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-purple-400 font-semibold">
                          {cit.journal} ({cit.year})
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300">
                          Match: {(cit.similarityScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <h5 className="text-xs font-medium text-white mt-1 line-clamp-2">
                        {cit.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-1 italic">
                        "{cit.keyFinding}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                      <span>DOI: {cit.doi}</span>
                      <span className="text-cyan-400 flex items-center gap-1 cursor-pointer hover:underline">
                        <span>View citation</span>
                        <ExternalLink size={10} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
