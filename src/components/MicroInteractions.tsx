import React, { useEffect, useState, useRef } from "react";
import { Sparkles, Volume2, VolumeX, Shield, Eye, Zap } from "lucide-react";

interface MicroInteractionsProps {
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
}

export const MicroInteractions: React.FC<MicroInteractionsProps> = ({
  reducedMotion,
  setReducedMotion,
  highContrast,
  setHighContrast
}) => {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showInitSequence, setShowInitSequence] = useState(false);
  const [initStep, setInitStep] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Subtle web audio synthesizer for futuristic bio-clicks
  const playBioBeep = (freq: number = 880, duration: number = 0.08) => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted
    }
  };

  // Mouse cursor tracking for glow follower
  useEffect(() => {
    if (reducedMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      if (!cursorVisible) setCursorVisible(true);
    };

    const onMouseLeave = () => {
      setCursorVisible(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [reducedMotion, cursorVisible]);

  // Handle global click subtle audio & ripple
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a")) {
        playBioBeep(1200, 0.06);
      }
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, [audioEnabled]);

  // Initializing Bio-Intelligence sequence modal
  const triggerInitSequence = () => {
    setShowInitSequence(true);
    setInitStep(0);

    const steps = [
      "Calibrating Triply Periodic Minimal Surfaces (TPMS) kernel...",
      "Mounting ChromaDB vector embeddings (14,800 biomedical manuscripts)...",
      "Validating Navier-Stokes micro-perfusion tensors...",
      "Connecting ESP32 telemetry bridge (FreeRTOS UART1)...",
      "Bio-Intelligence Matrix fully initialized."
    ];

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setInitStep(current);
      playBioBeep(440 + current * 120, 0.05);
      if (current >= steps.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setShowInitSequence(false);
        }, 1400);
      }
    }, 600);
  };

  return (
    <>
      {/* 1. Cursor Glow Follower */}
      {!reducedMotion && cursorVisible && (
        <div
          className="fixed pointer-events-none z-50 w-72 h-72 rounded-full bg-cyan-400/12 blur-3xl -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`
          }}
        />
      )}

      {/* 2. Floating Accessibility & Utility Widget */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-slate-800 shadow-2xl">
        {/* Bio-Intelligence re-initialization button */}
        <button
          id="btn-reinit-bio"
          onClick={triggerInitSequence}
          className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-all"
          title="Simulate Bio-Intelligence Boot Sequence"
        >
          <Zap size={13} className="text-cyan-400" />
          <span className="hidden sm:inline">Bio-Kernel</span>
        </button>

        {/* Audio Toggle */}
        <button
          id="btn-toggle-audio"
          onClick={() => {
            const next = !audioEnabled;
            setAudioEnabled(next);
            if (next) playBioBeep(880, 0.1);
          }}
          className={`p-2 rounded-xl border text-xs transition-all ${
            audioEnabled
              ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
          }`}
          title={audioEnabled ? "Disable Bio-Audio Feedback" : "Enable Bio-Audio Feedback"}
          aria-label="Toggle bio-audio feedback"
        >
          {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>

        {/* High Contrast Toggle */}
        <button
          id="btn-toggle-contrast"
          onClick={() => setHighContrast(!highContrast)}
          className={`p-2 rounded-xl border text-xs transition-all ${
            highContrast
              ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
          }`}
          title="Toggle High Contrast Mode"
          aria-label="Toggle high contrast mode"
        >
          <Eye size={14} />
        </button>
      </div>

      {/* 3. Initializing Bio-Intelligence Modal Overlay */}
      {showInitSequence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070B1A]/90 backdrop-blur-2xl p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 animate-pulse">
              <Sparkles size={32} />
            </div>

            <h3 className="text-lg font-bold text-white tracking-wide font-display">
              Initializing Bio-Intelligence...
            </h3>

            <p className="text-xs font-mono text-cyan-300 mt-3 h-10 flex items-center justify-center">
              {[
                "Calibrating Triply Periodic Minimal Surfaces (TPMS) kernel...",
                "Mounting ChromaDB vector embeddings (14,800 biomedical manuscripts)...",
                "Validating Navier-Stokes micro-perfusion tensors...",
                "Connecting ESP32 telemetry bridge (FreeRTOS UART1)...",
                "Bio-Intelligence Matrix fully initialized."
              ][initStep]}
            </p>

            {/* Progress line */}
            <div className="w-full mt-4 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${((initStep + 1) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
