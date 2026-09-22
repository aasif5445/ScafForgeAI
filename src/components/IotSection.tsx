import React, { useState } from "react";
import {
  Cpu,
  Smartphone,
  Server,
  Zap,
  Radio,
  CheckCircle2,
  Terminal,
  Send,
  RotateCcw,
  Gauge,
  Layers,
  Thermometer
} from "lucide-react";
import { IotPacket } from "../types";

export const IotSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2); // Highlight ESP32
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    `[04:22:10.104] [UART1] ESP32-WROOM-32 initialized. Free heap: 284,112 bytes.`,
    `[04:22:11.450] [WiFi] Connected to laboratory AP: 'MED-PRINT-NET-5G' (RSSI: -48dBm).`,
    `[04:22:12.012] [MQTT] Subscribed to topic 'scafforge/v1/telemetry/gcode'.`,
    `[04:22:15.890] [TMC2209] Stepper drivers X, Y, Z calibrated. Microstepping 1/16.`
  ]);

  const [currentPacket, setCurrentPacket] = useState<IotPacket>({
    packetId: "PKT-0984-ESP32",
    timestamp: new Date().toLocaleTimeString(),
    material: "Hydroxyapatite",
    porosity: 70,
    speed: 20,
    nozzle_temp_c: 65.4,
    bed_temp_c: 37.0,
    layer_height_um: 120,
    extrusion_rate_ul_s: 4.8,
    stepper_rpm: 120,
    system_status: "STANDBY"
  });

  const handleSendPacket = () => {
    setIsTransmitting(true);
    const now = new Date().toLocaleTimeString();
    const newPacket: IotPacket = {
      packetId: `PKT-${Math.floor(1000 + Math.random() * 9000)}-ESP32`,
      timestamp: now,
      material: currentPacket.material,
      porosity: currentPacket.porosity,
      speed: currentPacket.speed,
      nozzle_temp_c: 65.0 + Number((Math.random() * 2 - 1).toFixed(1)),
      bed_temp_c: 37.0,
      layer_height_um: 120,
      extrusion_rate_ul_s: Number((4.5 + Math.random() * 0.8).toFixed(2)),
      stepper_rpm: 120 + Math.floor(Math.random() * 15),
      system_status: "PRINTING_ACTIVE"
    };

    setCurrentPacket(newPacket);

    // Simulate multi-node animation cascade
    let step = 0;
    const interval = setInterval(() => {
      setActiveStep(step);
      step++;
      if (step > 5) {
        clearInterval(interval);
        setIsTransmitting(false);
        setTelemetryLogs((prev) => [
          `[${now}] [MQTT_TX] Published ${newPacket.packetId} -> ESP32 payload ACK (2ms).`,
          `[${now}] [STEPPER] Extrusion rate stabilized at ${newPacket.extrusion_rate_ul_s} μL/s.`,
          `[${now}] [OLED_SSD1306] Display buffer flushed. Layer 4/120 in progress.`,
          ...prev.slice(0, 5)
        ]);
      }
    }, 450);
  };

  const pipelineNodes = [
    {
      id: "flutter",
      title: "Flutter App",
      role: "Client UI & Operator Dispatch",
      icon: <Smartphone className="text-cyan-400" size={20} />,
      color: "border-cyan-500/40"
    },
    {
      id: "fastapi",
      title: "FastAPI",
      role: "High-Speed G-Code Compiler",
      icon: <Server className="text-blue-400" size={20} />,
      color: "border-blue-500/40"
    },
    {
      id: "esp32",
      title: "ESP32 MCU",
      role: "FreeRTOS Real-Time Microcontroller",
      icon: <Cpu className="text-emerald-400" size={20} />,
      color: "border-emerald-500/40"
    },
    {
      id: "stepper",
      title: "Stepper Motor",
      role: "TMC2209 Sub-Micron Precision",
      icon: <Zap className="text-amber-400" size={20} />,
      color: "border-amber-500/40"
    },
    {
      id: "oled",
      title: "OLED Display",
      role: "SSD1306 0.96\" Live Telemetry",
      icon: <Radio className="text-purple-400" size={20} />,
      color: "border-purple-500/40"
    },
    {
      id: "printer",
      title: "Scaffold Printer",
      role: "Pneumatic Micro-Extrusion Stage",
      icon: <Layers className="text-rose-400" size={20} />,
      color: "border-rose-500/40"
    }
  ];

  return (
    <section id="iot-hardware" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-3">
            <Radio size={14} className="animate-pulse" />
            <span>ESP32 & PHYSICAL COMPUTING HARDWARE PIPELINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Seamless Cloud-to-Hardware Bio-Fabrication
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
            From algorithmic generative scaffold recommendations directly to real-time ESP32
            pneumatic motor kinematics and OLED diagnostics.
          </p>
        </div>

        {/* Dispatch Action */}
        <button
          id="btn-send-iot-packet"
          onClick={handleSendPacket}
          disabled={isTransmitting}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 border border-emerald-400/40 transition-all active:scale-95 disabled:opacity-50"
        >
          <Send size={15} className={isTransmitting ? "animate-bounce" : ""} />
          <span>{isTransmitting ? "Transmitting Packet..." : "Send IoT Test Packet to ESP32"}</span>
        </button>
      </div>

      {/* Interactive IoT Pipeline Diagram */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden mb-8">
        {/* Background glow lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

        {/* Nodes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
          {pipelineNodes.map((node, index) => {
            const isCurrent = activeStep === index;
            return (
              <div
                key={node.id}
                className={`relative flex flex-col p-4 rounded-2xl border transition-all duration-300 ${
                  isCurrent
                    ? "bg-slate-800/95 border-cyan-400 shadow-xl shadow-cyan-500/20 -translate-y-1 scale-105"
                    : "bg-slate-950/60 border-slate-800/80 opacity-80 hover:opacity-100"
                }`}
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-slate-500">0{index + 1}</span>
                  <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800`}>
                    {node.icon}
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-white tracking-wide">{node.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{node.role}</p>

                {/* Pulse dot if active */}
                {isCurrent && (
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>SYNCHRONIZED</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Moving data packets illustration */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-cyan-400 font-bold">FLOW:</span>
          <span>Flutter UI</span>
          <span className="text-cyan-400">⟶</span>
          <span>FastAPI</span>
          <span className="text-cyan-400">⟶</span>
          <span className="text-emerald-400 font-bold">ESP32 (MQTT/UART)</span>
          <span className="text-cyan-400">⟶</span>
          <span>Stepper Motor</span>
          <span className="text-cyan-400">⟶</span>
          <span>OLED 128x64</span>
          <span className="text-cyan-400">⟶</span>
          <span>Bioprinting Stage</span>
        </div>
      </div>

      {/* Split-screen: Left = Live ESP32 OLED Display Simulator & Hardware Specs; Right = JSON Packet Inspector & Serial Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: SSD1306 OLED Display Simulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-3xl bg-slate-950 border border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-cyan-300 flex items-center gap-1.5 font-semibold">
                <Radio size={14} className="text-cyan-400" />
                <span>OLED SSD1306 128x64 SIMULATOR</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                I2C 0x3C ACTIVE
              </span>
            </div>

            {/* Retro 0.96" Monochrome OLED screen bezel */}
            <div className="w-full p-4 rounded-xl bg-[#00141A] border-2 border-cyan-500/40 font-mono text-cyan-400 shadow-[inset_0_0_20px_rgba(6,182,212,0.25)] flex flex-col justify-between min-h-[170px]">
              <div>
                <div className="flex items-center justify-between text-xs border-b border-cyan-500/30 pb-1 mb-2">
                  <span>SCAFFORGE v2.4</span>
                  <span className="animate-pulse">ESP32 [LIVE]</span>
                </div>
                <div className="text-[12px] leading-relaxed">
                  <div>MAT: {currentPacket.material.toUpperCase()}</div>
                  <div>POROSITY: {currentPacket.porosity}% | SPD: {currentPacket.speed}mm/s</div>
                  <div>NOZZLE: {currentPacket.nozzle_temp_c.toFixed(1)}°C | BED: {currentPacket.bed_temp_c.toFixed(1)}°C</div>
                  <div>EXTRUSION: {currentPacket.extrusion_rate_ul_s} μL/s</div>
                </div>
              </div>

              <div className="pt-2 border-t border-cyan-500/30 flex items-center justify-between text-[11px]">
                <span>STATUS: {currentPacket.system_status}</span>
                <span>STEP: {currentPacket.stepper_rpm} RPM</span>
              </div>
            </div>

            {/* Microcontroller Hardware Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">CORE CLOCK</span>
                <span className="text-xs font-mono font-bold text-white">240 MHz</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">STEP ACCURACY</span>
                <span className="text-xs font-mono font-bold text-emerald-300">± 1.25 μm</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">LATENCY</span>
                <span className="text-xs font-mono font-bold text-cyan-300">&lt; 3.8 ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sample JSON payload & Telemetry Terminal (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-5 rounded-3xl bg-slate-950/90 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-mono text-slate-300 flex items-center gap-2">
                <Terminal size={14} className="text-cyan-400" />
                <span>SAMPLE JSON HARDWARE TELEMETRY PAYLOAD</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">MIME: application/json</span>
            </div>

            {/* Highlighted JSON code card */}
            <div className="p-4 rounded-xl bg-[#070B1A] border border-slate-800/80 font-mono text-xs text-slate-200 overflow-x-auto">
              <pre className="text-cyan-300">
                {JSON.stringify(
                  {
                    material: currentPacket.material,
                    porosity: currentPacket.porosity,
                    speed: currentPacket.speed,
                    nozzle_temp_c: currentPacket.nozzle_temp_c,
                    bed_temp_c: currentPacket.bed_temp_c,
                    layer_height_um: currentPacket.layer_height_um,
                    extrusion_rate_ul_s: currentPacket.extrusion_rate_ul_s,
                    stepper_rpm: currentPacket.stepper_rpm,
                    packet_id: currentPacket.packetId
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            {/* Micro UART / MQTT Log Stream */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Real-Time Serial Monitor (COM7 / 115200 Baud)
              </span>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 font-mono text-[11px] text-slate-400 flex flex-col gap-1 max-h-36 overflow-y-auto">
                {telemetryLogs.map((log, i) => (
                  <div key={i} className="text-slate-300">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
