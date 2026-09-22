import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  Cpu,
  Waves,
  Database,
  Menu,
  X,
  ShieldAlert,
  ArrowRight,
  ExternalLink
} from "lucide-react";

interface NavbarProps {
  onLaunchDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLaunchDemo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Workflow", href: "#workflow" },
    { label: "Impact", href: "#motivation" },
    { label: "AI Lab", href: "#ai-lab" },
    { label: "3D Viewer", href: "#3d-viewer" },
    { label: "Digital Twin", href: "#digital-twin" },
    { label: "ESP32 IoT", href: "#iot-hardware" },
    { label: "Materials", href: "#materials" },
    { label: "Roadmap", href: "#roadmap" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#070B1A]/80 border-b border-white/5 transition-all">
      {/* Top micro-bar: Research Prototype Disclaimer */}
      <div className="w-full bg-gradient-to-r from-blue-950/40 via-cyan-950/40 to-purple-950/40 border-b border-cyan-500/10 py-1.5 px-4 text-center">
        <p className="text-[11px] sm:text-xs font-mono text-cyan-300/90 tracking-wider flex items-center justify-center gap-2">
          <ShieldAlert size={12} className="text-cyan-400 shrink-0" />
          <span>Research Prototype • Educational & Research Use Only</span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">
            Accelerating Preclinical Discovery • Not a Clinical Medical Device
          </span>
        </p>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div className="w-full h-full bg-[#070B1A] rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute opacity-60" />
              <Sparkles size={18} className="text-cyan-400 relative z-10" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1 font-display">
              ScafForge <span className="text-cyan-400">AI</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase hidden sm:block">
              RESEARCH PLATFORM
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-cyan-300 transition-colors py-1 relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#ai-lab"
            id="nav-launch-demo-btn"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold tracking-wide shadow-lg shadow-cyan-500/20 border border-cyan-400/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <span>Launch AI Demo</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Mobile menu hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-[#070B1A]/95 border-b border-slate-800 flex flex-col gap-3">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800/80 hover:text-cyan-300 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#ai-lab"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-center text-xs font-semibold text-white shadow-lg"
          >
            Launch AI Demo
          </a>
        </div>
      )}
    </header>
  );
};
