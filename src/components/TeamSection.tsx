import React from "react";
import { TEAM_MEMBERS } from "../data/biomedicalData";
import {
  BrainCircuit,
  Layers3,
  Database,
  Cpu,
  Sparkles,
  Users,
  Github,
  Linkedin,
  Medal
} from "lucide-react";

export const TeamSection: React.FC = () => {
  const iconMap: Record<string, React.ReactNode> = {
    BrainCircuit: <BrainCircuit className="text-cyan-400" size={24} />,
    Layers3: <Layers3 className="text-purple-400" size={24} />,
    Database: <Database className="text-blue-400" size={24} />,
    Cpu: <Cpu className="text-emerald-400" size={24} />,
    Sparkles: <Sparkles className="text-amber-400" size={24} />
  };

  return (
    <section id="team" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
          <Medal size={14} className="text-cyan-400" />
          <span>SCAFFORGE MULTI-DISCIPLINARY RESEARCH SQUAD</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
          Engineered for Biomedical Breakthroughs
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Bridging neural computation, physical computing, biomaterials physics, and human impact.
        </p>
      </div>

      {/* Floating Team Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {TEAM_MEMBERS.map((member) => (
          <div
            key={member.role}
            className="group relative p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-2.5 hover:shadow-2xl hover:shadow-cyan-500/15 flex flex-col justify-between"
          >
            {/* Ambient hover glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all pointer-events-none" />

            <div>
              {/* Role Badge & Icon */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-cyan-300 border border-slate-700">
                  {member.role}
                </span>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-cyan-400/40 transition-colors">
                  {iconMap[member.avatarIcon] || <Users size={20} />}
                </div>
              </div>

              {/* Name & Focus */}
              <div className="mt-4">
                <h3 className="text-base font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs text-cyan-400/90 font-mono mt-1 leading-snug">
                  {member.focus}
                </p>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">{member.bio}</p>
              </div>
            </div>

            {/* Skills chips */}
            <div className="mt-5 pt-3 border-t border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider block mb-2">
                Core Competencies:
              </span>
              <div className="flex flex-wrap gap-1">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
