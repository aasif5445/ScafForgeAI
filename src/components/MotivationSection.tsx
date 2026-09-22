import React, { useState } from "react";
import { PATIENT_STORIES } from "../data/biomedicalData";
import {
  Heart,
  ShieldAlert,
  Flame,
  Wind,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2
} from "lucide-react";

export const MotivationSection: React.FC = () => {
  const [activeStoryId, setActiveStoryId] = useState<string>("burn-victim");
  const activeStory =
    PATIENT_STORIES.find((s) => s.id === activeStoryId) || PATIENT_STORIES[0];

  const storyIcons: Record<string, React.ReactNode> = {
    "burn-victim": <Flame className="text-rose-400" size={18} />,
    "pediatric-airway": <Wind className="text-purple-400" size={18} />,
    "transplant-waitlist": <Layers className="text-cyan-400" size={18} />
  };

  return (
    <section id="motivation" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono mb-3">
            <Heart size={14} className="text-rose-400" />
            <span>REAL-WORLD BIOMEDICAL MOTIVATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-display">
            The Human Stakes Behind the Architecture
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
            Every micropore and modulus calculation has a clinical reason. Biomedical research is
            a race against physiological failure.
          </p>
        </div>

        {/* Mandatory Research Boundary Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex items-start gap-2.5 max-w-md shadow-lg">
          <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[11px] font-mono text-slate-300 leading-snug">
            <strong className="text-amber-300">SCIENTIFIC BOUNDARY:</strong> ScafForge AI accelerates
            laboratory & preclinical research — it is <em>not</em> an approved clinical treatment or
            diagnostic medical device.
          </div>
        </div>
      </div>

      {/* Story Tabs & Hero Story Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Story Selector Cards (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {PATIENT_STORIES.map((story) => {
            const isSelected = story.id === activeStoryId;
            return (
              <button
                key={story.id}
                id={`btn-story-${story.id}`}
                onClick={() => setActiveStoryId(story.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col gap-2 ${
                  isSelected
                    ? "bg-slate-900/95 border-cyan-400 shadow-xl shadow-cyan-500/15 -translate-y-0.5"
                    : "bg-slate-950/50 border-slate-800/80 hover:bg-slate-900/50 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 font-bold">{story.index}</span>
                  <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                    {storyIcons[story.id]}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide">{story.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{story.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Story Showcase (8 cols) */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-slate-900/85 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Tag & Metric row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono border ${activeStory.badgeColor}`}
              >
                {activeStory.tag}
              </span>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">{activeStory.stats.label}:</span>
                <span className="text-cyan-300 font-bold text-sm">
                  {activeStory.stats.metric}
                </span>
              </div>
            </div>

            {/* Story Title & Narrative */}
            <div className="mt-5">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                {activeStory.title}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-cyan-300 mt-1">
                {activeStory.subtitle}
              </p>

              <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                {activeStory.story}
              </p>
            </div>

            {/* Clinical Challenge vs Engineering Solution */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-500/20">
                <span className="text-xs font-mono uppercase text-rose-400 font-bold block mb-1">
                  The Clinical Challenge
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeStory.clinicalChallenge}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/20">
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold block mb-1">
                  How ScafForge Accelerates Research
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeStory.engineeringSolution}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom callout */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>PRECLINICAL BENCHMARK • IN VITRO EVALUATION</span>
            <a href="#ai-lab" className="text-cyan-400 hover:underline flex items-center gap-1">
              <span>Test {activeStory.title.split(" ")[0]} parameters</span>
              <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
