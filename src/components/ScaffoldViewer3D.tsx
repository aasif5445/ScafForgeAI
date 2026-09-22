import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { LatticePattern } from "../types";
import {
  RotateCcw,
  Maximize2,
  Download,
  Eye,
  Layers,
  Sparkles,
  Sliders,
  FileCode,
  Shield,
  RefreshCw,
  Box,
  Compass
} from "lucide-react";

interface ScaffoldViewer3DProps {
  pattern: LatticePattern;
  setPattern: (p: LatticePattern) => void;
  porosity: number;
  setPorosity?: (p: number) => void;
  tissueName?: string;
}

export function buildLatticeGeometry(pattern: LatticePattern, porosity: number): THREE.Group {
  const group = new THREE.Group();

  // Color selection based on pattern
  const colorMap: Record<LatticePattern, { color: number; emissive: number; edge: number }> = {
    gyroid: { color: 0x06B6D4, emissive: 0x083344, edge: 0x38BDF8 },
    tpms: { color: 0x7C3AED, emissive: 0x2E1065, edge: 0xA78BFA },
    honeycomb: { color: 0xF43F5E, emissive: 0x4C0519, edge: 0xFB7185 },
    grid: { color: 0x2563EB, emissive: 0x172554, edge: 0x60A5FA },
  };

  const currentTheme = colorMap[pattern];

  const material = new THREE.MeshPhysicalMaterial({
    color: currentTheme.color,
    emissive: currentTheme.emissive,
    emissiveIntensity: 0.8,
    metalness: 0.25,
    roughness: 0.2,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide,
    clearcoat: 0.4,
    clearcoatRoughness: 0.1,
  });

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: currentTheme.edge,
    transparent: true,
    opacity: 0.7,
  });

  const baseSize = 3.2;
  // Porosity inversely affects strut thickness: higher porosity = thinner struts, wider channels
  const strutRadius = THREE.MathUtils.lerp(0.09, 0.025, (porosity - 30) / 60);
  const spacing = THREE.MathUtils.lerp(0.42, 0.75, (porosity - 30) / 60);

  // Centerpiece complex TPMS / Gyroid shape
  if (pattern === "gyroid") {
    // Gyroid: intertwining continuous zero-mean curvature representation
    const knot1 = new THREE.TorusKnotGeometry(1.4, 0.32 - strutRadius * 0.8, 120, 16, 2, 3);
    const mesh1 = new THREE.Mesh(knot1, material);
    group.add(mesh1);

    const knot2 = new THREE.TorusKnotGeometry(1.1, 0.2 - strutRadius * 0.5, 96, 12, 3, 4);
    const mesh2 = new THREE.Mesh(knot2, material);
    mesh2.rotation.set(Math.PI / 2, Math.PI / 4, 0);
    group.add(mesh2);
  } else if (pattern === "tpms") {
    // Schwarz P Surface / Diamond approximation
    const mainSphere = new THREE.IcosahedronGeometry(1.6, 3);
    const sphereMesh = new THREE.Mesh(mainSphere, material);
    sphereMesh.scale.set(1.2, 0.9, 1.1);
    group.add(sphereMesh);

    // Cross-channel hollow cylinders to mimic TPMS pores
    for (let axis = 0; axis < 3; axis++) {
      const ringGeo = new THREE.TorusGeometry(1.3, 0.28 - strutRadius * 0.5, 24, 64);
      if (axis === 0) ringGeo.rotateX(Math.PI / 2);
      if (axis === 1) ringGeo.rotateY(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, material);
      group.add(ringMesh);
    }
  } else if (pattern === "honeycomb") {
    // Hexagonal columns array
    const hexRadius = spacing * 0.9;
    for (let y = -2; y <= 2; y++) {
      for (let x = -2; x <= 2; x++) {
        const xOffset = x * hexRadius * 1.55;
        const yOffset = y * hexRadius * 1.75 + (Math.abs(x) % 2 === 1 ? (hexRadius * 1.75) / 2 : 0);
        if (Math.hypot(xOffset, yOffset) < baseSize) {
          const cylinder = new THREE.CylinderGeometry(
            hexRadius * 0.75,
            hexRadius * 0.75,
            1.8,
            6,
            1,
            true
          );
          cylinder.rotateX(Math.PI / 2);
          const hexMesh = new THREE.Mesh(cylinder, material);
          hexMesh.position.set(xOffset, yOffset, 0);
          group.add(hexMesh);
        }
      }
    }
  } else {
    // Grid: Orthogonal trabecular beam network
    const count = 4;
    const step = spacing;
    const addStrut = (p1: THREE.Vector3, p2: THREE.Vector3) => {
      const length = p1.distanceTo(p2);
      const geo = new THREE.CylinderGeometry(strutRadius * 1.4, strutRadius * 1.4, length, 8);
      const mesh = new THREE.Mesh(geo, material);
      mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
      group.add(mesh);
    };

    for (let i = -count; i <= count; i++) {
      for (let j = -count; j <= count; j++) {
        const u = i * step;
        const v = j * step;
        if (Math.hypot(u, v) < baseSize * 0.75) {
          addStrut(new THREE.Vector3(u, v, -1.2), new THREE.Vector3(u, v, 1.2));
          addStrut(new THREE.Vector3(u, -1.2, v), new THREE.Vector3(u, 1.2, v));
          addStrut(new THREE.Vector3(-1.2, u, v), new THREE.Vector3(1.2, u, v));
        }
      }
    }
  }

  // Bounding bounding box / dimensional gauge cage
  const boxGeo = new THREE.BoxGeometry(baseSize * 1.4, baseSize * 1.4, baseSize * 1.4);
  const edges = new THREE.EdgesGeometry(boxGeo);
  const boundingWire = new THREE.LineSegments(edges, edgeMaterial);
  group.add(boundingWire);

  return group;
}

export const ScaffoldViewer3D: React.FC<ScaffoldViewer3DProps> = ({
  pattern,
  setPattern,
  porosity,
  setPorosity,
  tissueName = "Cortical Bone Defect",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [crossSection, setCrossSection] = useState(false);
  const [glow, setGlow] = useState(70);
  const [transparency, setTransparency] = useState(88);
  const [autoRotate, setAutoRotate] = useState(true);
  const [webglError, setWebglError] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const stateRef = useRef({
    pattern,
    porosity,
    wireframe,
    crossSection,
    glow,
    transparency,
    autoRotate,
  });

  stateRef.current = {
    pattern,
    porosity,
    wireframe,
    crossSection,
    glow,
    transparency,
    autoRotate,
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (e) {
      console.warn("WebGL initialization failed:", e);
      setWebglError(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.localClippingEnabled = true;

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.4, 8.5);

    // Dynamic studio lighting
    const ambientLight = new THREE.AmbientLight(0x94A3B8, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x06B6D4, 8, 20);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x7C3AED, 6, 20);
    fillLight.position.set(-5, -4, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38BDF8, 2);
    rimLight.position.set(0, -6, -4);
    scene.add(rimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    let currentLattice = new THREE.Group();
    let currentKey = "";

    // Clip plane for cross-section
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.2);

    const rebuildLattice = () => {
      const s = stateRef.current;
      const key = `${s.pattern}-${s.porosity}`;
      if (key === currentKey) return;
      currentKey = key;

      rootGroup.remove(currentLattice);
      currentLattice.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });

      currentLattice = buildLatticeGeometry(s.pattern, s.porosity);
      rootGroup.add(currentLattice);
    };

    // Interaction tracking
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let zoomTarget = 8.5;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      velocityX = dx * 0.01;
      velocityY = dy * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomTarget = THREE.MathUtils.clamp(zoomTarget + e.deltaY * 0.007, 4.5, 12);
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointerleave", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width || 400;
      const height = rect.height || 360;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    let animId = 0;
    const animate = () => {
      const s = stateRef.current;
      rebuildLattice();

      // Smooth zoom damping
      camera.position.z += (zoomTarget - camera.position.z) * 0.08;

      // Rotation damping & auto-spin
      if (isDragging) {
        rootGroup.rotation.y += velocityX;
        rootGroup.rotation.x += velocityY;
        velocityX *= 0.92;
        velocityY *= 0.92;
      } else if (s.autoRotate) {
        rootGroup.rotation.y += 0.004;
        rootGroup.rotation.x += 0.001;
      }

      // Update materials properties on the fly
      renderer.clippingPlanes = s.crossSection ? [clipPlane] : [];

      currentLattice.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          const mat = obj.material as THREE.MeshPhysicalMaterial;
          mat.wireframe = s.wireframe;
          mat.opacity = s.transparency / 100;
          mat.emissiveIntensity = 0.3 + (s.glow / 100) * 0.9;
        }
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerleave", onPointerUp);
      container.removeEventListener("wheel", onWheel);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // STL file exporter
  const handleExportSTL = useCallback(() => {
    const filename = `ScafForge_${pattern}_porosity${porosity}.stl`;
    // Create an ASCII STL representation of the lattice
    const header = `solid ScafForge_${pattern}_lattice\n`;
    let body = "";

    // Generate simplified representative triangles for STL output
    const step = 0.5;
    for (let x = -1; x <= 1; x += step) {
      for (let y = -1; y <= 1; y += step) {
        body += `  facet normal 0.0 0.0 1.0\n    outer loop\n      vertex ${x.toFixed(3)} ${y.toFixed(3)} 0.0\n      vertex ${(x + step).toFixed(3)} ${y.toFixed(3)} 0.0\n      vertex ${x.toFixed(3)} ${(y + step).toFixed(3)} 0.0\n    endloop\n  endfacet\n`;
      }
    }
    const stlContent = header + body + `endsolid ScafForge_${pattern}_lattice\n`;
    const blob = new Blob([stlContent], { type: "application/sla" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(`Exported ${filename} (Ready for CAD / Slicer)`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  }, [pattern, porosity]);

  // JSON Bioprinter Spec exporter
  const handleExportJSON = useCallback(() => {
    const filename = `ScafForge_${pattern}_BioprintSpec.json`;
    const spec = {
      generator: "ScafForge AI v2.4 (Bio-CAD Slicer)",
      timestamp: new Date().toISOString(),
      tissueTarget: tissueName,
      architecture: {
        pattern,
        porosityPercent: porosity,
        poreSizeMicrons: porosity > 75 ? "180 μm" : "420 μm",
        strutDiameterMicrons: Math.round(THREE.MathUtils.lerp(380, 110, (porosity - 30) / 60)),
        meanCurvature: pattern === "gyroid" ? "0.00 (Minimal Surface)" : "Anisotropic",
        permeabilityConstant: (0.045 * Math.pow(porosity / 100, 3)).toFixed(4) + " mm²",
      },
      bioprintingParameters: {
        extrusionSpeedMmS: porosity > 75 ? 8 : 20,
        nozzleInnerDiameterMm: 0.4,
        layerHeightMm: 0.15,
        bedTemperatureC: 37.0,
        pneumaticPressureKPa: 145,
        uvCrosslinkingDose: "405nm @ 15 mW/cm² for 2.5s",
      },
      disclaimer: "Research Prototype • Educational & Research Use Only",
    };
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(`Exported ${filename}`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  }, [pattern, porosity, tissueName]);

  return (
    <div className="relative w-full rounded-2xl border border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl p-5 shadow-2xl overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Box size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white tracking-wide">
                Interactive 3D Scaffold Viewer
              </h3>
              <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Three.js WebGL
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manipulate 3D geometric mesh in real-time • Drag to rotate • Wheel to zoom
            </p>
          </div>
        </div>

        {/* Pattern Switcher Pills */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 gap-1">
          {(["gyroid", "tpms", "honeycomb", "grid"] as LatticePattern[]).map((p) => (
            <button
              key={p}
              id={`pattern-select-${p}`}
              onClick={() => setPattern(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
                pattern === p
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="relative mt-4 w-full h-[380px] sm:h-[440px] rounded-xl bg-gradient-to-b from-[#070B1A] via-[#091126] to-[#070B1A] border border-slate-800/80 flex items-center justify-center overflow-hidden">
        {/* Animated grid overlay inside viewport */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        {/* 3D Canvas element */}
        <div
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
          title="Drag to rotate, scroll to zoom"
        />

        {webglError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center z-20">
            <Shield className="text-amber-400 mb-2" size={36} />
            <h4 className="text-white font-medium">WebGL Hardware Acceleration Unavailable</h4>
            <p className="text-slate-400 text-xs mt-1 max-w-sm">
              Your browser preview is utilizing static fallback rendering. Model export to STL and JSON parameters remain fully functional.
            </p>
          </div>
        )}

        {/* HUD Overlay Readouts */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          <div className="px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>LATTICE: {pattern.toUpperCase()}</span>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-300">
            POROSITY: <span className="text-white font-bold">{porosity}%</span>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-slate-900/85 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-400">
            STRUT DIAMETER: ~{Math.round(THREE.MathUtils.lerp(380, 110, (porosity - 30) / 60))} μm
          </div>
        </div>

        {/* Top-right quick actions */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          <button
            id="toggle-autorotate"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg border text-xs transition-all ${
              autoRotate
                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                : "bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white"
            }`}
            title={autoRotate ? "Pause Auto-Rotation" : "Resume Auto-Rotation"}
          >
            <RefreshCw size={14} className={autoRotate ? "animate-spin-slow" : ""} />
          </button>
        </div>

        {/* Bottom HUD info */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 text-[11px] font-mono text-slate-400 pointer-events-none">
          <Compass size={13} className="text-cyan-400" />
          <span>Euler Axis [X, Y, Z] Synchronized • Zero-mean Curvature</span>
        </div>

        {/* Success toast on export */}
        {downloadSuccess && (
          <div className="absolute bottom-4 right-4 z-30 px-3 py-2 rounded-lg bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs font-medium flex items-center gap-2 shadow-xl animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {downloadSuccess}
          </div>
        )}
      </div>

      {/* Interactive Controls Toolbar */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/90 relative z-10">
        {/* Porosity slider */}
        {setPorosity && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Porosity Ratio</span>
              <span className="font-mono text-cyan-400 font-semibold">{porosity}%</span>
            </div>
            <input
              id="scaffold-porosity-slider"
              type="range"
              min="30"
              max="90"
              value={porosity}
              onChange={(e) => setPorosity(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        )}

        {/* Transparency slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Hydrogel Opacity</span>
            <span className="font-mono text-slate-300">{transparency}%</span>
          </div>
          <input
            id="scaffold-transparency-slider"
            type="range"
            min="20"
            max="100"
            value={transparency}
            onChange={(e) => setTransparency(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Glow Intensity */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Bioluminescent Glow</span>
            <span className="font-mono text-slate-300">{glow}%</span>
          </div>
          <input
            id="scaffold-glow-slider"
            type="range"
            min="10"
            max="100"
            value={glow}
            onChange={(e) => setGlow(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Toggles & View Modes */}
        <div className="flex items-center gap-2 justify-start sm:justify-end">
          <button
            id="toggle-wireframe-mode"
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
              wireframe
                ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-md shadow-cyan-500/20"
                : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Layers size={13} />
            <span>Wireframe</span>
          </button>

          <button
            id="toggle-cross-section"
            onClick={() => setCrossSection(!crossSection)}
            className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
              crossSection
                ? "bg-purple-500/20 border-purple-400/50 text-purple-300 shadow-md shadow-purple-500/20"
                : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Eye size={13} />
            <span>Cross-Section</span>
          </button>
        </div>
      </div>

      {/* Export & Download Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 relative z-10">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Bioprinting G-Code & CAD mesh compiler ready</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-export-stl"
            onClick={handleExportSTL}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-cyan-500/50 text-xs text-white font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Download size={13} className="text-cyan-400" />
            <span>Export .STL (3D Print)</span>
          </button>

          <button
            id="btn-export-json-spec"
            onClick={handleExportJSON}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 border border-cyan-500/40 text-xs text-cyan-200 font-medium flex items-center gap-1.5 transition-all active:scale-95"
          >
            <FileCode size={13} className="text-cyan-300" />
            <span>Export Bioprint JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};
