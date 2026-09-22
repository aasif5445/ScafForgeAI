import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowRight, Sparkles, Shield, Cpu, Activity, Zap, Play } from "lucide-react";

export const HeroSection: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const dnaCanvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollY, setScrollY] = useState(0);

  // Scroll listener for parallax rotation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 1. Three.js Rotating Glowing 3D Gyroid Scaffold
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Glowing lights
    const ambient = new THREE.AmbientLight(0x06b6d4, 1.4);
    scene.add(ambient);

    const key = new THREE.PointLight(0x38bdf8, 10, 16);
    key.position.set(3, 4, 5);
    scene.add(key);

    const fill = new THREE.PointLight(0x7c3aed, 8, 14);
    fill.position.set(-3, -3, 4);
    scene.add(fill);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Material with bioluminescent physical glass-like subsurface glow
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x0e7490,
      emissiveIntensity: 0.85,
      roughness: 0.18,
      metalness: 0.35,
      transparent: true,
      opacity: 0.88,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      side: THREE.DoubleSide
    });

    // Gyroid / TPMS minimal surface simulation geometry
    const knot1 = new THREE.TorusKnotGeometry(1.5, 0.32, 160, 24, 2, 3);
    const mesh1 = new THREE.Mesh(knot1, material);
    rootGroup.add(mesh1);

    const knot2 = new THREE.TorusKnotGeometry(1.15, 0.22, 120, 16, 3, 4);
    const mesh2 = new THREE.Mesh(knot2, material);
    mesh2.rotation.set(Math.PI / 2, Math.PI / 4, 0);
    rootGroup.add(mesh2);

    // Outer bounding geometric rings
    const ringGeo = new THREE.TorusGeometry(2.35, 0.02, 16, 100);
    const ringMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
    const ringMesh1 = new THREE.Line(ringGeo, ringMat);
    ringMesh1.rotation.x = Math.PI / 3;
    rootGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Line(ringGeo, ringMat);
    ringMesh2.rotation.y = Math.PI / 4;
    rootGroup.add(ringMesh2);

    // Floating orbital nodes around scaffold
    const orbGroup = new THREE.Group();
    for (let i = 0; i < 18; i++) {
      const orbGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const orbMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x06b6d4 : 0xa855f7 });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      const angle = (i / 18) * Math.PI * 2;
      const rad = 2.2 + Math.sin(i * 2) * 0.4;
      orb.position.set(Math.cos(angle) * rad, Math.sin(angle) * rad, (Math.random() - 0.5) * 1.5);
      orbGroup.add(orb);
    }
    rootGroup.add(orbGroup);

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width || 420;
      const h = rect.height || 420;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    let animId = 0;
    const animate = () => {
      // Rotation influenced by base continuous time + scroll position
      rootGroup.rotation.y += 0.007;
      rootGroup.rotation.x = Math.sin(Date.now() * 0.0008) * 0.15 + (window.scrollY * 0.0008);
      orbGroup.rotation.z -= 0.004;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 2. Animated DNA Strands & Floating Particles Canvas
  useEffect(() => {
    const canvas = dnaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let t = 0;

    const handleCanvasResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 700;
    };

    window.addEventListener("resize", handleCanvasResize);
    handleCanvasResize();

    // Floating particles array
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 1 + Math.random() * 2.5,
      speedY: -0.2 - Math.random() * 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: 0.2 + Math.random() * 0.6,
      color: Math.random() > 0.4 ? "#06B6D4" : "#7C3AED"
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.015;

      // Draw floating background AI particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw faint double helix in the background right
      const startX = canvas.width * 0.72;
      const startY = 60;
      const length = canvas.height - 100;
      const nodes = 36;
      const amp = 42;

      for (let i = 0; i < nodes; i++) {
        const y = startY + (length / nodes) * i;
        const phase = (i * 0.28) + t;
        const x1 = startX + Math.sin(phase) * amp;
        const x2 = startX - Math.sin(phase) * amp;

        // Base pair connecting rung
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = "rgba(6, 182, 212, 0.18)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Helix node 1
        ctx.beginPath();
        ctx.arc(x1, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#06B6D4";
        ctx.fill();

        // Helix node 2
        ctx.beginPath();
        ctx.arc(x2, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#A855F7";
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleCanvasResize);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Animated Canvas (DNA strands + floating particles) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <canvas ref={dnaCanvasRef} className="w-full h-full block" />
      </div>

      {/* Aurora glowing color gradients */}
      <div className="aurora-bg w-[550px] h-[550px] bg-cyan-500/20 top-[-80px] left-[-120px]" />
      <div className="aurora-bg w-[650px] h-[650px] bg-purple-600/20 bottom-[-100px] right-[-100px]" />
      <div className="aurora-bg w-[400px] h-[400px] bg-blue-600/15 top-[35%] right-[20%]" />

      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Copy: 7 cols */}
        <div className="lg:col-span-7 flex flex-col items-start">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 shadow-lg shadow-cyan-500/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold tracking-wide uppercase">
              AI-POWERED TISSUE SCAFFOLD FORGE
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">TPMS Geometric Synthesis</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.08] font-display">
            Design Tomorrow's{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              Tissue Scaffolds
            </span>{" "}
            Today.
          </h1>

          {/* Tagline & Subheadline */}
          <p className="mt-4 text-base sm:text-lg font-medium text-cyan-200/90 font-display tracking-wide">
            Forging the Future of Tissue Engineering with AI
          </p>

          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
            AI-powered scaffold recommendations backed by explainable biomedical intelligence.
            Bridge high-dimensional literature embeddings with 3D triply periodic minimal surfaces
            and physical ESP32 bioprinter integration.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <a
              href="#ai-lab"
              id="hero-launch-ai-demo"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white font-semibold text-sm tracking-wide shadow-xl shadow-cyan-500/25 border border-cyan-400/40 flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-95 group"
            >
              <span>Launch AI Demo</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>

            <a
              href="#digital-twin"
              id="hero-explore-tech"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 text-slate-200 hover:text-white font-medium text-sm tracking-wide border border-slate-700/80 hover:border-cyan-500/50 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Activity size={16} className="text-cyan-400" />
              <span>Explore Technology</span>
            </a>
          </div>

          {/* Metric Badges Strip */}
          <div className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 sm:gap-6 w-full max-w-lg">
            <div>
              <span className="text-xl sm:text-2xl font-bold font-display text-white block">
                14,800+
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5">
                ChromaDB Papers
              </span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold font-display text-cyan-300 block">
                &lt; 3.0s
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5">
                Synthesis Time
              </span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold font-display text-purple-300 block">
                ESP32 IoT
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mt-0.5">
                Hardware Sync
              </span>
            </div>
          </div>
        </div>

        {/* Right 3D Gyroid Scaffold Showcase: 5 cols */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-[440px] rounded-3xl bg-gradient-to-b from-cyan-950/20 via-slate-950/60 to-purple-950/20 border border-cyan-500/25 p-2 shadow-2xl backdrop-blur-md flex items-center justify-center">
            {/* Background rotating radial halo */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-500/15 to-purple-600/15 blur-2xl pointer-events-none" />

            {/* Three.js viewport */}
            <div
              ref={mountRef}
              className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing"
              title="Interactive 3D Gyroid Scaffold"
            />

            {/* Floating micro-hud card */}
            <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono text-cyan-300 shadow-xl pointer-events-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>LIVE 3D GYROID TPMS</span>
            </div>

            <div className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-300 shadow-xl pointer-events-none">
              <span className="text-cyan-400">ROTATION:</span> Dynamic Parallax
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
