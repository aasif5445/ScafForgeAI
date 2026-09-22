import React, { useState } from "react";
import { TissueId, LatticePattern } from "./types";
import { TISSUE_PRESETS } from "./data/biomedicalData";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ProblemWorkflowSection } from "./components/ProblemWorkflowSection";
import { MotivationSection } from "./components/MotivationSection";
import { InteractiveLab } from "./components/InteractiveLab";
import { ScaffoldViewer3D } from "./components/ScaffoldViewer3D";
import { DigitalTwinSimulation } from "./components/DigitalTwinSimulation";
import { IotSection } from "./components/IotSection";
import { MaterialDatabase } from "./components/MaterialDatabase";
import { ResearchDashboard } from "./components/ResearchDashboard";
import { RoadmapSection } from "./components/RoadmapSection";
import { TeamSection } from "./components/TeamSection";
import { Footer } from "./components/Footer";
import { MicroInteractions } from "./components/MicroInteractions";
import { Box, Sparkles, ShieldAlert, Cpu } from "lucide-react";

export default function App() {
  const [currentTissue, setCurrentTissue] = useState<TissueId>("bone");
  const [currentPattern, setCurrentPattern] = useState<LatticePattern>("gyroid");
  const [currentPorosity, setCurrentPorosity] = useState<number>(70);

  // Accessibility states
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const activeTissuePreset = TISSUE_PRESETS[currentTissue] || TISSUE_PRESETS.bone;

  return (
    <div
      className={`min-h-screen bg-[#070B1A] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 relative ${
        highContrast ? "contrast-125" : ""
      }`}
    >
      {/* Top Navigation Bar with Mandatory Research Disclaimer */}
      <Navbar />

      <main>
        {/* 1. Unforgettable Hero Section */}
        <HeroSection />

        {/* 2. Problem Section (Split-Screen Comparison) */}
        <ProblemWorkflowSection />

        {/* 3. Real-World Motivation (Patient Stories) */}
        <MotivationSection />

        {/* 4. Interactive AI Laboratory (Centerpiece) */}
        <InteractiveLab
          currentTissue={currentTissue}
          setCurrentTissue={setCurrentTissue}
          currentPattern={currentPattern}
          setCurrentPattern={setCurrentPattern}
          currentPorosity={currentPorosity}
          setCurrentPorosity={setCurrentPorosity}
        />

        {/* 5. Interactive 3D Scaffold Viewer Section */}
        <section id="3d-viewer" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
                <Box size={14} className="text-cyan-400" />
                <span>REAL THREE.JS PROCEDURAL LATTICE ENGINE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-display">
                Interactive 3D Scaffold CAD & Slicer
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
                Inspect zero-mean curvature surface geometry in real-time. Alter porosity to
                dynamically remodel struts and export STL files for laboratory bioprinting.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>ACTIVE: {activeTissuePreset.label.split(" ")[0]} ({currentPattern.toUpperCase()})</span>
            </div>
          </div>

          {/* Scaffold Viewer Component */}
          <ScaffoldViewer3D
            pattern={currentPattern}
            setPattern={setCurrentPattern}
            porosity={currentPorosity}
            setPorosity={setCurrentPorosity}
            tissueName={activeTissuePreset.label}
          />
        </section>

        {/* 6. Digital Twin Multi-Physics Simulation (Showstopper) */}
        <DigitalTwinSimulation
          tissueName={activeTissuePreset.label}
          porosity={currentPorosity}
        />

        {/* 7. ESP32 Physical Computing & Hardware Pipeline */}
        <IotSection />

        {/* 8. Material Intelligence Database */}
        <MaterialDatabase />

        {/* 9. Research Analytics Dashboard with Compare Mode & PDF Export */}
        <ResearchDashboard
          porosity={currentPorosity}
          currentTissue={currentTissue}
          currentPattern={currentPattern}
          onSelectTissue={setCurrentTissue}
        />

        {/* 10. Future Strategic Roadmap */}
        <RoadmapSection />

        {/* 11. ScafForge Research Squad */}
        <TeamSection />
      </main>

      {/* Footer with Apple/Vercel/Moderna aesthetics */}
      <Footer />

      {/* Floating Micro-Interactions, Cursor Glow & Bio-Synth Audio */}
      <MicroInteractions
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />
    </div>
  );
}
