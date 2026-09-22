import React, { useState, useEffect, useRef, useMemo } from "react";
import { SimulationMode } from "../types";
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Waves,
  Cpu,
  ShieldAlert,
  Flame,
  Droplets,
  Layers,
  Sparkles,
  Info,
  Clock,
  Gauge,
  Sliders,
  Crosshair,
  Maximize2
} from "lucide-react";

interface DigitalTwinSimulationProps {
  tissueName: string;
  porosity: number;
}

interface ProbeData {
  x: number;
  y: number;
  visible: boolean;
  metric1: string;
  metric2: string;
  metric3: string;
  status: string;
}

export const DigitalTwinSimulation: React.FC<DigitalTwinSimulationProps> = ({
  tissueName,
  porosity
}) => {
  const [activeMode, setActiveMode] = useState<SimulationMode>("nutrient-flow");
  const [isPlaying, setIsPlaying] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [simulationDay, setSimulationDay] = useState<number>(14);

  // Dynamic user-controllable physical simulation parameters
  const [perfusionFlowRate, setPerfusionFlowRate] = useState<number>(1.5); // mL/min
  const [appliedLoadN, setAppliedLoadN] = useState<number>(45); // N cyclic load

  // Interactive mouse probe state
  const [probe, setProbe] = useState<ProbeData>({
    x: 0,
    y: 0,
    visible: false,
    metric1: "",
    metric2: "",
    metric3: "",
    status: ""
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulation mode configurations
  const modes: {
    id: SimulationMode;
    label: string;
    icon: React.ReactNode;
    desc: string;
    color: string;
    accentHex: string;
  }[] = [
    {
      id: "nutrient-flow",
      label: "Nutrient Flow",
      icon: <Waves size={16} className="text-cyan-400" />,
      desc: "Navier-Stokes micro-perfusion & oxygen diffusion streamlines",
      color: "text-cyan-400",
      accentHex: "#06B6D4"
    },
    {
      id: "stress-distribution",
      label: "FEA Stress Field",
      icon: <Gauge size={16} className="text-purple-400" />,
      desc: "Finite Element von Mises stress gradient under physiological cyclic loading",
      color: "text-purple-400",
      accentHex: "#A855F7"
    },
    {
      id: "degradation",
      label: "Degradation Timeline",
      icon: <Clock size={16} className="text-amber-400" />,
      desc: "Hydrolytic polymer chain scission & scaffold resorption kinetics",
      color: "text-amber-400",
      accentHex: "#F59E0B"
    },
    {
      id: "cell-growth",
      label: "Cell Infiltration",
      icon: <Sparkles size={16} className="text-emerald-400" />,
      desc: "Simulated cell adhesion, proliferation density & extracellular matrix deposition",
      color: "text-emerald-400",
      accentHex: "#10B981"
    }
  ];

  // Mouse move handler for interactive probe
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = x / rect.width;
    const normY = y / rect.height;

    if (activeMode === "nutrient-flow") {
      const localVel = (perfusionFlowRate * (0.6 + Math.sin(normX * 8 + normY * 4) * 0.4)).toFixed(2);
      const localShear = (0.12 + Number(localVel) * 0.04).toFixed(3);
      setProbe({
        x,
        y,
        visible: true,
        metric1: `Velocity: ${localVel} mm/s`,
        metric2: `Shear Stress: ${localShear} Pa`,
        metric3: `Oxygen: ${(92 - normX * 18).toFixed(1)}% Saturation`,
        status: Number(localShear) < 0.25 ? "Laminar Safe" : "High Shear"
      });
    } else if (activeMode === "stress-distribution") {
      const distFromCenter = Math.hypot(normX - 0.5, normY - 0.5);
      const stressMPa = (appliedLoadN * 0.28 * (1 - distFromCenter * 0.8)).toFixed(1);
      const microStrain = (Number(stressMPa) * 142).toFixed(0);
      setProbe({
        x,
        y,
        visible: true,
        metric1: `von Mises: ${stressMPa} MPa`,
        metric2: `Elastic Strain: ${microStrain} με`,
        metric3: `Yield Ratio: ${(Number(stressMPa) / 45).toFixed(2)}`,
        status: Number(stressMPa) < 35 ? "Elastic Yield Safe" : "High Stress Concentrator"
      });
    } else if (activeMode === "degradation") {
      const massRem = Math.max(12, 100 - (simulationDay / 180) * 85).toFixed(1);
      setProbe({
        x,
        y,
        visible: true,
        metric1: `Residual Mass: ${massRem}%`,
        metric2: `Local pH: ${(7.4 - (simulationDay / 180) * 0.4).toFixed(2)}`,
        metric3: `Scission Rate: 0.08%/day`,
        status: Number(massRem) > 40 ? "Structural Integrity" : "Bio-resorbed Matrix"
      });
    } else {
      const cellDensity = Math.round(450 * (simulationDay / 30) * (1 - Math.abs(normY - 0.5)));
      setProbe({
        x,
        y,
        visible: true,
        metric1: `Cell Density: ${cellDensity} /mm²`,
        metric2: `ECM Deposition: ${(simulationDay * 0.12).toFixed(2)} μm`,
        metric3: `Confluence: ${Math.min(100, Math.round((simulationDay / 40) * 100))}%`,
        status: "Active Proliferation"
      });
    }
  };

  const handleMouseLeave = () => {
    setProbe((prev) => ({ ...prev, visible: false }));
  };

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Initialize flow particles with natural velocity & jitter
    const particleCount = 100;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      baseSpeed: 1.0 + Math.random() * 2.2,
      radius: 1.2 + Math.random() * 2.2,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.4 ? "#06B6D4" : Math.random() > 0.5 ? "#38BDF8" : "#818CF8",
      alpha: 0.3 + Math.random() * 0.7
    }));

    // Porous obstacle circular nodes representing TPMS cross-sections
    const obstacleCount = 12;
    const obstacles = Array.from({ length: obstacleCount }, (_, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      return {
        x: (col + 0.5) * (canvas.width / 4),
        y: (row + 0.6) * (canvas.height / 3),
        radius: 26 - (porosity / 100) * 10
      };
    });

    const render = () => {
      // Clear with dark obsidian trail
      ctx.fillStyle = "rgba(4, 7, 20, 0.32)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        time += 0.02 * simulationSpeed;
      }

      // ===================================
      // MODE 1: NUTRIENT FLOW (MICRO-FLUIDICS)
      // ===================================
      if (activeMode === "nutrient-flow") {
        // Draw porous scaffold boundaries / channels
        obstacles.forEach((obs) => {
          ctx.beginPath();
          ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
          ctx.strokeStyle = "rgba(6, 182, 212, 0.35)";
          ctx.lineWidth = 1.5;
          ctx.fill();
          ctx.stroke();

          // Internal core lattice glow
          ctx.beginPath();
          ctx.arc(obs.x, obs.y, obs.radius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(6, 182, 212, 0.1)";
          ctx.fill();
        });

        // Flow rate scaling factor
        const effectiveSpeed = (perfusionFlowRate / 1.5) * simulationSpeed;

        // Render streamlines & nutrient particles
        particles.forEach((p) => {
          if (isPlaying) {
            p.x += p.baseSpeed * effectiveSpeed;

            // Deflect around obstacles
            obstacles.forEach((obs) => {
              const dx = p.x - obs.x;
              const dy = p.y - obs.y;
              const dist = Math.hypot(dx, dy);
              if (dist < obs.radius + 14) {
                const angle = Math.atan2(dy, dx);
                p.y += Math.sin(angle) * 1.5;
                p.x += Math.cos(angle) * 0.8;
              }
            });

            // Pore channel sinusoids
            p.y += Math.sin(p.x * 0.015 + p.phase + time) * 0.8;

            // Wrap around
            if (p.x > canvas.width) {
              p.x = -10;
              p.y = Math.random() * canvas.height;
            }
          }

          // Particle body
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = "#06B6D4";
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Streamline trailing line
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.baseSpeed * 7 * effectiveSpeed, p.y);
          ctx.strokeStyle = "rgba(6, 182, 212, 0.22)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        });

        // Perfusion inlet/outlet indicators
        ctx.fillStyle = "rgba(6, 182, 212, 0.8)";
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillText("INLET PERFUSION ➜", 16, 25);
        ctx.fillText("➜ OUTLET DRAINAGE", canvas.width - 140, canvas.height - 18);
      }

      // ===================================
      // MODE 2: FEA STRESS FIELD
      // ===================================
      else if (activeMode === "stress-distribution") {
        const gridSizeX = 16;
        const gridSizeY = 10;
        const cellW = canvas.width / gridSizeX;
        const cellH = canvas.height / gridSizeY;

        // Cyclic load pulsation
        const cyclicPulse = Math.sin(time * 3) * 0.25 + 0.75;
        const loadFactor = (appliedLoadN / 45) * cyclicPulse;

        for (let i = 0; i < gridSizeX; i++) {
          for (let j = 0; j < gridSizeY; j++) {
            const cx = i * cellW + cellW / 2;
            const cy = j * cellH + cellH / 2;

            // Stress concentration formula centered around pore nodes
            const distFromCenter = Math.hypot(cx - canvas.width / 2, cy - canvas.height / 2);
            const poreStress =
              (Math.sin(cx * 0.03) * Math.cos(cy * 0.03) * 0.5 + 0.5) * loadFactor;
            const normStress = Math.min(1, Math.max(0, poreStress + (1 - distFromCenter / 450) * 0.4));

            // Dynamic color gradient: Cool Azure -> Neon Cyan -> Amber -> Magenta
            let r = 6,
              g = 182,
              b = 212;
            if (normStress > 0.7) {
              r = 236;
              g = 72;
              b = 153; // Magenta
            } else if (normStress > 0.45) {
              r = 245;
              g = 158;
              b = 11; // Amber
            } else if (normStress > 0.25) {
              r = 59;
              g = 130;
              b = 246; // Blue
            }

            // Draw stress element cell
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.12 + normStress * 0.6})`;
            ctx.beginPath();
            ctx.arc(cx, cy, (cellW / 3) * (0.6 + normStress * 0.5), 0, Math.PI * 2);
            ctx.fill();

            // Interconnected FEA mesh lines
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.25)`;
            ctx.lineWidth = 0.8;
            if (i < gridSizeX - 1) {
              ctx.beginPath();
              ctx.moveTo(cx, cy);
              ctx.lineTo(cx + cellW, cy);
              ctx.stroke();
            }
            if (j < gridSizeY - 1) {
              ctx.beginPath();
              ctx.moveTo(cx, cy);
              ctx.lineTo(cx, cy + cellH);
              ctx.stroke();
            }
          }
        }

        // Compressive load direction vectors (Top & Bottom)
        ctx.fillStyle = "rgba(168, 85, 247, 0.9)";
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillText(`CYCLIC LOAD: ${appliedLoadN} N [ ${(appliedLoadN * 0.28 * cyclicPulse).toFixed(1)} MPa PEAK ]`, 20, 25);
        ctx.fillText(`▼ ▼ COMPRESSION AXIS ▼ ▼`, canvas.width / 2 - 80, 20);
        ctx.fillText(`▲ ▲ GROUND EQUILIBRIUM ▲ ▲`, canvas.width / 2 - 90, canvas.height - 15);
      }

      // ===================================
      // MODE 3: DEGRADATION TIMELINE
      // ===================================
      else if (activeMode === "degradation") {
        const dayProgress = simulationDay / 180; // 0 to 1
        const remainingMass = Math.max(0.12, 1 - Math.pow(dayProgress, 1.3) * 0.85);

        // Background metric grid
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        // Scaffold Struts dissolving and fragmenting over time
        const strutCount = 9;
        for (let i = 0; i < strutCount; i++) {
          const y = (canvas.height / (strutCount + 1)) * (i + 1);
          const waviness = Math.sin(time * 0.8 + i) * 6 * dayProgress;

          ctx.beginPath();
          ctx.moveTo(35, y + waviness);

          if (dayProgress > 0.35 && i % 2 === 0) {
            // Fragmented scission fissures
            ctx.setLineDash([14, 12]);
          } else {
            ctx.setLineDash([]);
          }

          ctx.lineTo(canvas.width - 35, y - waviness);
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.2 + remainingMass * 0.75})`;
          ctx.lineWidth = Math.max(1.2, remainingMass * 16);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Degradation curve chart at bottom
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.fillRect(20, canvas.height - 65, canvas.width - 40, 50);
        ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
        ctx.strokeRect(20, canvas.height - 65, canvas.width - 40, 50);

        ctx.fillStyle = "#F59E0B";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillText(
          `IN VITRO RESORPTION TIMELINE: DAY ${simulationDay} OF 180`,
          35,
          canvas.height - 43
        );
        ctx.fillStyle = "#FDE68A";
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillText(
          `REMAINING MASS: ${(remainingMass * 100).toFixed(1)}% • RESIDUAL MODULUS: ${(remainingMass * 42.5).toFixed(1)} MPa • HYDROLYSIS RATE: NOMINAL`,
          35,
          canvas.height - 25
        );
      }

      // ===================================
      // MODE 4: CELL INFILTRATION
      // ===================================
      else if (activeMode === "cell-growth") {
        const clusterCount = 34;
        const growthFactor = Math.min(1, 0.15 + (simulationDay / 60) * 0.88);

        // Draw underlying scaffold struts
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 2;
        for (let x = 60; x < canvas.width; x += 100) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        for (let i = 0; i < clusterCount; i++) {
          const angle = (i / clusterCount) * Math.PI * 2;
          const radius = (canvas.height * 0.38) * Math.sin(i * 4 + time * 0.4);
          const cx = canvas.width / 2 + Math.cos(angle) * (80 + radius * growthFactor);
          const cy = canvas.height / 2 + Math.sin(angle) * (50 + radius * growthFactor);

          // Cellular membrane & nucleus
          ctx.beginPath();
          ctx.arc(cx, cy, 7 + Math.sin(time * 2 + i) * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(16, 185, 129, 0.48)";
          ctx.shadowColor = "#10B981";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Cellular nucleus core
          ctx.beginPath();
          ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#A7F3D0";
          ctx.fill();

          // Sprouting filopodia attaching to struts
          for (let f = 0; f < 4; f++) {
            const fAngle = angle + f * (Math.PI / 2) + Math.sin(time + i);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(
              cx + Math.cos(fAngle) * 20 * growthFactor,
              cy + Math.sin(fAngle) * 20 * growthFactor
            );
            ctx.strokeStyle = "rgba(52, 211, 153, 0.65)";
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }

        // Live Cellular Metric Readout
        ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillText(
          `CELL COLONIZATION: DAY ${simulationDay} • ADHERING CELLS: ~${Math.round(
            1850 * growthFactor
          )} • VIABILITY: 96.8%`,
          20,
          25
        );
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activeMode, isPlaying, simulationSpeed, simulationDay, porosity, perfusionFlowRate, appliedLoadN]);

  return (
    <section id="digital-twin" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-4/5 h-96 bg-cyan-600/5 blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
            <Cpu size={14} className="animate-pulse text-cyan-400" />
            <span>DIGITAL TWIN MULTI-PHYSICS SIMULATION ENGINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-display">
            Multi-Physics In Silico Biomechanics
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
            Simulate fluid hemodynamics, mechanical stress concentrations, and biodegradation prior
            to laboratory bioprinting. Move your cursor over the viewport to inspect local multi-physics probe readouts.
          </p>
        </div>

        {/* Mandatory Research Notice Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-mono shadow-lg">
          <ShieldAlert size={15} className="text-amber-400 shrink-0" />
          <span>Research Simulation • Non-Clinical Prediction</span>
        </div>
      </div>

      {/* Main Simulation Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left Column: Mode Switcher & Metric Readouts (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Mode Switcher */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col gap-2">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Simulation Modalities
            </span>
            <div className="flex flex-col gap-2 mt-1">
              {modes.map((m) => (
                <button
                  key={m.id}
                  id={`sim-mode-${m.id}`}
                  onClick={() => setActiveMode(m.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    activeMode === m.id
                      ? "bg-cyan-500/15 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10"
                      : "bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activeMode === m.id
                        ? "bg-cyan-500/20 border border-cyan-400/40"
                        : "bg-slate-800/80 border border-slate-700"
                    }`}
                  >
                    {m.icon}
                  </div>
                  <div>
                    <span className="text-sm font-semibold block">{m.label}</span>
                    <span className="text-xs text-slate-400 leading-snug mt-0.5 block">
                      {m.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Parameter Controls Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col gap-4">
            <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
              <Sliders size={14} />
              <span>Biomechanical Boundary Controls</span>
            </span>

            {/* Parameter 1: Perfusion Flow Rate Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-300">Perfusion Rate</span>
                <span className="text-cyan-400 font-bold">{perfusionFlowRate.toFixed(1)} mL/min</span>
              </div>
              <input
                id="sim-perfusion-slider"
                type="range"
                min="0.2"
                max="4.0"
                step="0.1"
                value={perfusionFlowRate}
                onChange={(e) => setPerfusionFlowRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0.2 mL/min (Diffusion)</span>
                <span>4.0 mL/min (High Shear)</span>
              </div>
            </div>

            {/* Parameter 2: Compressive Cyclic Load Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-300">Cyclic Load</span>
                <span className="text-purple-400 font-bold">{appliedLoadN} N</span>
              </div>
              <input
                id="sim-load-slider"
                type="range"
                min="10"
                max="120"
                step="5"
                value={appliedLoadN}
                onChange={(e) => setAppliedLoadN(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>10 N (Dermal)</span>
                <span>120 N (Trabecular Bone)</span>
              </div>
            </div>
          </div>

          {/* Real-time Bio-Physics Analytics Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col gap-3">
            <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
              <Activity size={14} />
              <span>Multi-Physics Numerical Solvers</span>
            </span>

            <div className="grid grid-cols-2 gap-2.5 mt-1">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block">REYNOLDS NO.</span>
                <span className="text-base font-bold text-white font-mono">0.042 Re</span>
                <span className="text-[9px] text-emerald-400 block mt-0.5">Laminar Flow</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block">WALL SHEAR</span>
                <span className="text-base font-bold text-white font-mono">
                  {(0.12 + perfusionFlowRate * 0.04).toFixed(2)} Pa
                </span>
                <span className="text-[9px] text-cyan-400 block mt-0.5">Endothelial Safe</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block">PEAK VON MISES</span>
                <span className="text-base font-bold text-white font-mono">
                  {(appliedLoadN * 0.28).toFixed(1)} MPa
                </span>
                <span className="text-[9px] text-purple-400 block mt-0.5">Yield Factor 1.9</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block">CELL VIABILITY</span>
                <span className="text-base font-bold text-emerald-300 font-mono">96.8%</span>
                <span className="text-[9px] text-emerald-400 block mt-0.5">In Silico Est.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Simulation Viewport Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div
            ref={containerRef}
            className="relative w-full h-[450px] sm:h-[500px] rounded-3xl bg-gradient-to-b from-[#040714] via-[#070D22] to-[#040714] border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Top Canvas Bar */}
            <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider">
                  SOLVER: {activeMode.replace("-", " ").toUpperCase()}
                </span>
                <span className="text-slate-500 text-xs font-mono hidden sm:inline">•</span>
                <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                  TISSUE: {tissueName}
                </span>
              </div>

              {/* Playback Controls & Speed */}
              <div className="flex items-center gap-2">
                <button
                  id="sim-toggle-play"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-all active:scale-95"
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                </button>

                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
                  {[1, 2, 4].map((s) => (
                    <button
                      key={s}
                      id={`sim-speed-${s}x`}
                      onClick={() => setSimulationSpeed(s)}
                      className={`px-2 py-0.5 rounded ${
                        simulationSpeed === s
                          ? "bg-cyan-500/30 text-cyan-300 font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Canvas Area with Interactive Crosshair Reticle & Probe */}
            <div className="relative flex-1 w-full h-full cursor-crosshair overflow-hidden">
              <canvas
                ref={canvasRef}
                width={780}
                height={460}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full h-full block bg-transparent"
              />

              {/* Interactive Probe HUD Reticle Tooltip */}
              {probe.visible && (
                <div
                  className="absolute pointer-events-none z-30 transition-all duration-75 transform -translate-x-1/2 -translate-y-full mb-3"
                  style={{ left: probe.x, top: probe.y }}
                >
                  <div className="p-3 rounded-xl bg-slate-950/95 border border-cyan-400/60 shadow-2xl backdrop-blur-xl text-xs font-mono min-w-[190px]">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-1.5">
                      <span className="text-[10px] text-cyan-300 font-bold flex items-center gap-1">
                        <Crosshair size={11} className="text-cyan-400" />
                        <span>LOCAL PROBE</span>
                      </span>
                      <span className="text-[9px] px-1 rounded bg-cyan-500/20 text-cyan-300">
                        {probe.status}
                      </span>
                    </div>
                    <div className="space-y-0.5 text-[11px] text-slate-200">
                      <div className="text-white font-semibold">{probe.metric1}</div>
                      <div className="text-slate-300">{probe.metric2}</div>
                      <div className="text-slate-400 text-[10px]">{probe.metric3}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Right Spectrum Legend */}
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-slate-950/85 border border-slate-800 text-[10px] font-mono text-slate-400 pointer-events-none flex items-center gap-2">
                <span className="text-cyan-400">Min</span>
                <div className="w-20 h-2 rounded bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500" />
                <span className="text-purple-400">Max Intensity</span>
              </div>

              {/* Watermark Notice */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-slate-950/85 border border-slate-800 text-[9px] font-mono text-slate-400 pointer-events-none hidden sm:block">
                In Silico Multi-Physics Probe • Hover to Inspect
              </div>
            </div>

            {/* Bottom Timeline Scrubber for Degradation & Cell Growth Modes */}
            {(activeMode === "degradation" || activeMode === "cell-growth") && (
              <div className="px-4 py-3 bg-slate-950/95 border-t border-slate-800 flex items-center gap-4 z-10">
                <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
                  Time Horizon:
                </span>
                <input
                  id="sim-timeline-slider"
                  type="range"
                  min="0"
                  max="180"
                  value={simulationDay}
                  onChange={(e) => setSimulationDay(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <span className="text-xs font-mono text-amber-400 font-bold whitespace-nowrap">
                  Day {simulationDay} of 180
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
