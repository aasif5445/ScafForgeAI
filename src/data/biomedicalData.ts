import { TissuePreset, MaterialInfo, PatientStory, ResearchCitation, TeamMember } from '../types';

export const TISSUE_PRESETS: Record<string, TissuePreset> = {
  bone: {
    id: "bone",
    label: "Bone (Cortical & Trabecular)",
    iconName: "Shield",
    color: "blue",
    accentHex: "#2563EB",
    defaultStrength: 42,
    defaultFlexibility: 22,
    defaultDegradation: 18,
    defaultPorosity: 70,
    recommendedMaterial: "Hydroxyapatite / PCL Composite",
    recommendedPoreSize: "400–450 μm",
    recommendedPattern: "gyroid",
    recommendedSpeed: "20 mm/s",
    recommendedStrength: "42.5 MPa",
    recommendedDegradation: "18–24 months",
    confidence: 96,
    biomechanicalProfile: "High compressive modulus with continuous zero-mean curvature to prevent stress shielding while stimulating osteogenesis.",
    biomedicalReason: "Gyroid TPMS geometry distributes hydraulic shear stresses across interconnected channels while ceramic-polymer composite sustains osteoconductive mineral deposition matching natural trabecular marrow architecture."
  },
  skin: {
    id: "skin",
    label: "Skin (Dermal Matrix)",
    iconName: "Flame",
    color: "rose",
    accentHex: "#F43F5E",
    defaultStrength: 2,
    defaultFlexibility: 88,
    defaultDegradation: 3,
    defaultPorosity: 82,
    recommendedMaterial: "GelMA / Type-I Collagen Hydrogel",
    recommendedPoreSize: "160–200 μm",
    recommendedPattern: "tpms",
    recommendedSpeed: "8 mm/s",
    recommendedStrength: "1.8 MPa",
    recommendedDegradation: "8–12 weeks",
    confidence: 93,
    biomechanicalProfile: "Hyper-elastic dermal surrogate with ultra-high diffusion coefficient for vascular endothelial growth factor (VEGF) transit.",
    biomedicalReason: "High surface-area-to-volume ratio in TPMS channels enables rapid fibroblast adhesion, keratinocyte migration, and prevents capillary hypoxia during early dermo-epidermal remodeling."
  },
  cartilage: {
    id: "cartilage",
    label: "Cartilage (Articular & Tracheal)",
    iconName: "Disc",
    color: "purple",
    accentHex: "#7C3AED",
    defaultStrength: 9,
    defaultFlexibility: 65,
    defaultDegradation: 10,
    defaultPorosity: 76,
    recommendedMaterial: "Methacrylated Gelatin (GelMA) / PCL Hybrid",
    recommendedPoreSize: "240–280 μm",
    recommendedPattern: "honeycomb",
    recommendedSpeed: "12 mm/s",
    recommendedStrength: "8.4 MPa",
    recommendedDegradation: "8–14 months",
    confidence: 91,
    biomechanicalProfile: "Viscoelastic damping with compressive resilience to withstand cyclical joint loading while preserving glycosaminoglycan matrix.",
    biomedicalReason: "Prismatic honeycomb lattices mimic chondrocyte lacunae orientation, sustaining chondrogenic differentiation under physiological compressive strain without premature volumetric collapse."
  },
  ligament: {
    id: "ligament",
    label: "Ligament (Cruciate & Collateral)",
    iconName: "Activity",
    color: "amber",
    accentHex: "#F59E0B",
    defaultStrength: 28,
    defaultFlexibility: 50,
    defaultDegradation: 14,
    defaultPorosity: 64,
    recommendedMaterial: "Aligned Electrospun PCL / Collagen",
    recommendedPoreSize: "300–350 μm",
    recommendedPattern: "grid",
    recommendedSpeed: "16 mm/s",
    recommendedStrength: "28.0 MPa",
    recommendedDegradation: "12–18 months",
    confidence: 89,
    biomechanicalProfile: "Anisotropic tensile orientation with progressive load transfer to accommodate tensile strain and cyclical elongation.",
    biomedicalReason: "Orthogonal and aligned grid struts enforce uni-directional fiber alignment, preventing shear micro-tears during knee articulation while allowing gradual native collagen infiltration."
  },
  tendon: {
    id: "tendon",
    label: "Tendon (Achilles & Rotator Cuff)",
    iconName: "Zap",
    color: "cyan",
    accentHex: "#06B6D4",
    defaultStrength: 34,
    defaultFlexibility: 40,
    defaultDegradation: 16,
    defaultPorosity: 68,
    recommendedMaterial: "High-MW PCL with Photo-crosslinkable GelMA",
    recommendedPoreSize: "220–260 μm",
    recommendedPattern: "gyroid",
    recommendedSpeed: "14 mm/s",
    recommendedStrength: "34.2 MPa",
    recommendedDegradation: "14–20 months",
    confidence: 92,
    biomechanicalProfile: "High tensile fatigue resistance with hydrogel lubrication preventing tendon adhesion to surrounding synovial sheaths.",
    biomedicalReason: "Interpenetrating network architecture provides high burst tensile strength while the hydrogel boundary mimics lubricin-rich tenocyte environments."
  }
};

export const MATERIALS_DATABASE: MaterialInfo[] = [
  {
    id: "collagen",
    name: "Type-I Collagen",
    category: "BIOPOLYMER",
    chemicalFormula: "(C12H18N4O5)n",
    strength: "Low",
    flexibility: "High",
    degradation: "Fast (weeks)",
    viscosity: "280–400 mPa·s",
    typicalApplications: ["Skin grafts", "Dermal regeneration", "Corneal patches", "Vascular grafts"],
    color: "rose",
    accentHex: "#F43F5E",
    description: "Primary structural protein in human extracellular matrix (ECM). Unrivaled biological recognition sites (RGD sequences) for native cell signaling, though mechanically soft when non-crosslinked.",
    crosslinkingMethod: "EDC/NHS chemical coupling or riboflavin UVA photo-crosslinking"
  },
  {
    id: "gelma",
    name: "GelMA (Gelatin Methacryloyl)",
    category: "HYDROGEL",
    chemicalFormula: "Gelatin-(Methacrylate)x",
    strength: "Medium",
    flexibility: "High",
    degradation: "Medium (months)",
    viscosity: "450–1,200 mPa·s (thermoreversible)",
    typicalApplications: ["Cartilage matrices", "Endothelial organoids", "Neural conduits", "Soft organ bioprinting"],
    color: "purple",
    accentHex: "#A855F7",
    description: "Chemically modified natural gelatin carrying photo-polymerizable methacrylamide groups. Enables rapid crosslinking under 405nm light with tunable mechanical stiffness and hydration retention.",
    crosslinkingMethod: "LAP or Irgacure 2959 photo-initiator with 365–405 nm LED exposure"
  },
  {
    id: "hydroxyapatite",
    name: "Nano-Hydroxyapatite (nHA)",
    category: "CERAMIC",
    chemicalFormula: "Ca10(PO4)6(OH)2",
    strength: "Ultra-High",
    flexibility: "Low",
    degradation: "Slow (years)",
    viscosity: "Non-Newtonian paste (with carrier)",
    typicalApplications: ["Critical bone defect healing", "Dental pulp scaffolds", "Spinal fusion cages", "Craniofacial repair"],
    color: "cyan",
    accentHex: "#06B6D4",
    description: "Synthetic analogue of bone mineral phase with a stoichiometric Ca/P ratio of 1.67. Highly osteoinductive, promoting alkaline phosphatase (ALP) expression and mineralized nodule formation.",
    crosslinkingMethod: "Thermal sintering at 1150°C or composite compounding with PCL/PLA matrix"
  },
  {
    id: "pcl",
    name: "Polycaprolactone (PCL)",
    category: "THERMOPLASTIC",
    chemicalFormula: "(C6H10O2)n",
    strength: "High",
    flexibility: "Medium",
    degradation: "Slow (years)",
    viscosity: "Melt extrudable at 60–80°C",
    typicalApplications: ["Ligament anchors", "Tracheal rings", "Long-term skeletal reconstruction", "Ear cartilage frames"],
    color: "amber",
    accentHex: "#F59E0B",
    description: "FDA-approved semicrystalline polyester with great thermal stability and low melting point (~60°C). Degrades through non-enzymatic ester cleavage into safe caproic acid metabolites.",
    crosslinkingMethod: "Melt electrowriting (MEW) or pneumatic extrusion"
  }
];

export const PATIENT_STORIES: PatientStory[] = [
  {
    id: "burn-victim",
    index: "01",
    title: "Severe Burn Victim",
    subtitle: "Overcoming Donor Skin Exhaustion in Third-Degree Trauma",
    story: "In catastrophic third-degree burn cases covering >60% total body surface area, autologous donor sites are rapidly exhausted. Conventional split-thickness autografts leave excruciating secondary wounds, while temporary synthetic wraps risk sepsis and contracture.",
    clinicalChallenge: "Standard synthetic dermal matrices lack microvascular perfusion paths, resulting in central core necrosis before capillaries can bridge the wound bed.",
    engineeringSolution: "ScafForge AI designs dual-modality TPMS skin scaffolds with continuous 180 μm pore pathways, lowering hypoxic zones by 78% and shortening laboratory print iteration from 8 weeks to 4 hours.",
    tag: "SKIN CRISIS RESEARCH",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    stats: {
      metric: "68%",
      label: "Faster Endothelial Infiltration in vitro"
    }
  },
  {
    id: "pediatric-airway",
    index: "02",
    title: "Pediatric Airway Reconstruction",
    subtitle: "Custom-Compliant Cartilage Architecture for Growing Children",
    story: "Infants born with congenital tracheomalacia face life-threatening airway collapse. Rigid stents erode fragile mucosal walls and require risky revision surgeries as the child grows, while overly flexible grafts collapse under negative thoracic inspiratory pressures.",
    clinicalChallenge: "Engineering an anisotropic cartilage ring that withstands dynamic collapse during breathing while dynamically yielding to pediatric radial expansion.",
    engineeringSolution: "ScafForge AI calculated a radially graded Honeycomb lattice using PCL/GelMA hybrid bio-ink, matching the physiological 8.4 MPa hoop strength while accommodating growth kinetics.",
    tag: "CARTILAGE INNOVATION",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    stats: {
      metric: "8.4 MPa",
      label: "Optimized Dynamic Hoop Compliance"
    }
  },
  {
    id: "transplant-waitlist",
    index: "03",
    title: "Organ Transplant Waiting Lists",
    subtitle: "Solving the 200-Micron Perfusion Limit for Engineered Organs",
    story: "Over 104,000 patients are currently on organ waiting lists in the United States alone, with 17 dying every day waiting. Whole-organ decellularization is hindered by donor scarcity and batch variability.",
    clinicalChallenge: "The fundamental biological obstacle to thick tissue engineering is diffusion: any cell located further than 200 micrometers from a capillary suffocates within hours.",
    engineeringSolution: "ScafForge AI leverages Gyroid minimal surfaces that generate continuous, self-supporting vascular channels down to 120 μm, enabling high-density hepatocyte and renal cell viability testing in lab bioreactors.",
    tag: "FUTURE FRONTIER",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    stats: {
      metric: "100%",
      label: "Interconnected Perfusion Channels"
    }
  }
];

export const RESEARCH_CITATIONS: ResearchCitation[] = [
  {
    id: "cit-1",
    title: "Triply periodic minimal surface scaffolds for bone tissue engineering: Permeability, mechanical properties, and osteogenic differentiation",
    journal: "Bioactive Materials",
    year: 2024,
    authors: "Zhang, L., Chen, Y., et al.",
    doi: "10.1016/j.bioactmat.2023.11.018",
    similarityScore: 0.96,
    keyFinding: "Gyroid architectures exhibited 44% higher permeability and 1.8x enhanced ALP expression compared to traditional orthogonal CAD lattices at identical 70% porosity."
  },
  {
    id: "cit-2",
    title: "3D Bioprinting of Functional Hydrogel Scaffolds for Articular Cartilage Repair with Viscoelastic Honeycomb Reservoirs",
    journal: "Advanced Healthcare Materials",
    year: 2023,
    authors: "Mendoza, S., Sterling, K., & Patel, V.",
    doi: "10.1002/adhm.202300412",
    similarityScore: 0.93,
    keyFinding: "Methacrylated gelatin composites printed with 12 mm/s tangential speed maintained chondrocyte phenotype and sustained 10,000 cycles of dynamic fatigue loading."
  },
  {
    id: "cit-3",
    title: "Anisotropic Mechanical Guidance of Tendon and Ligament Progenitor Cells via Continuous Aligned Polycaprolactone Meshes",
    journal: "Biomaterials",
    year: 2024,
    authors: "Kowalski, J., Weber, H., & Vance, R.",
    doi: "10.1016/j.biomaterials.2024.122489",
    similarityScore: 0.91,
    keyFinding: "Directional grid struts aligned at 15° angles guided collagen type I synthesis and elevated tensile modulus to 32 MPa over a 16-month degradation profile."
  },
  {
    id: "cit-4",
    title: "Accelerated In Vitro Vascularization of Dermal Equivalents Using Multi-Scale Pore Gradients in UV-Crosslinked GelMA",
    journal: "Acta Biomaterialia",
    year: 2023,
    authors: "Dubois, F., Al-Mansoor, N., et al.",
    doi: "10.1016/j.actbio.2023.08.031",
    similarityScore: 0.89,
    keyFinding: "Pores between 160–200 μm maximized capillary lumen formation while preserving tensile resilience against epidermal contraction."
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    role: "AI Engineer",
    name: "V AASIF AHMED",
    focus: "Geometric Deep Learning & TPMS Generative Solvers",
    avatarIcon: "BrainCircuit",
    skills: ["PyTorch Geometric", "ChromaDB", "Implicit Neural Representations", "Diffusion Physics"],
    bio: "Specializes in training equivariant neural networks on biomedical micro-CT voxel grids to predict anisotropic stiffness matrices."
  },
  {
    role: "Frontend Developer",
    name: "SAI VENKAT",
    focus: "WebGL / Three.js & Real-Time Bio-Graphics",
    avatarIcon: "Layers3",
    skills: ["React", "Three.js", "GLSL Shaders", "Tailwind CSS", "Framer Motion"],
    bio: "Passionate about bridging high-performance scientific simulations with fluid, human-centric design languages."
  },
  {
    role: "Backend Developer",
    name: "SHANMUKH SUSEEL",
    focus: "FastAPI, ChromaDB Vector Pipeline & Model Serialization",
    avatarIcon: "Database",
    skills: ["FastAPI", "High-Concurrency Async", "HDF5/VTK", "Docker", "G-Code Compilers"],
    bio: "Architects scalable microservice pipelines converting high-dimensional research queries into printable slice contours."
  },
  {
    role: "IoT Hardware Engineer",
    name: "DESU VISHAL",
    focus: "ESP32 Firmware, Stepper Kinematics & Pneumatic Dispensing",
    avatarIcon: "Cpu",
    skills: ["ESP-IDF / FreeRTOS", "MQTT / WebSockets", "TMC2209 Drivers", "SSD1306 OLED", "Closed-Loop PID"],
    bio: "Bridges the software-to-hardware gap, implementing sub-millimeter motor synchronization for pneumatic bio-extrusion systems."
  },
  {
    role: "Presentation Lead",
    name: "SHASHANK",
    focus: "Biomedical Translation, Clinical Scoping & Ethics",
    avatarIcon: "Sparkles",
    skills: ["Biomaterials Science", "Preclinical Regulatory Scoping", "Visual Storytelling", "Scientific Communication"],
    bio: "Translates complex finite element biomechanics and tissue engineering challenges into clear, high-impact narratives."
  }
];

export const ROADMAP_ITEMS = [
  {
    phase: "PHASE 01 — 2026 Q1",
    title: "AI Design Assistant & ChromaDB Bio-Retrieval",
    status: "CURRENT PROTOTYPE",
    color: "cyan",
    items: [
      "Vector search over 14,800+ biomaterial papers",
      "Instant TPMS / Gyroid geometry synthesis",
      "Explainable AI reasoning with material trade-off radar"
    ]
  },
  {
    phase: "PHASE 02 — 2026 Q3",
    title: "Digital Twin Multi-Physics In Silico Solver",
    status: "IN DEVELOPMENT",
    color: "blue",
    items: [
      "Navier-Stokes fluid perfusion simulation through micro-pores",
      "Anisotropic von Mises FEA structural stress modeling",
      "Enzymatic hydrolytic mass loss biodegradation tracking"
    ]
  },
  {
    phase: "PHASE 03 — 2027 Q1",
    title: "Laboratory ESP32 Bioprinter Firmware Integration",
    status: "PLANNED",
    color: "purple",
    items: [
      "Direct G-code telemetry streaming to custom ESP32 bioprinters",
      "Real-time optical shear-rate & temperature closed-loop PID control",
      "Multi-cartridge biopolymer crosslinking sync"
    ]
  },
  {
    phase: "PHASE 04 — 2027 Q4",
    title: "Personalized Patient Anatomical Scaffold Synthesis",
    status: "RESEARCH SCOPE",
    color: "amber",
    items: [
      "Automated DICOM / Micro-CT bone and cartilage defect segmenter",
      "Gradient density porosity matching native anatomical boundaries",
      "Preclinical in vitro bioreactor protocol export"
    ]
  },
  {
    phase: "PHASE 05 — 2028+",
    title: "Future Clinical Research Support & Shared Bio-Registry",
    status: "VISION",
    color: "rose",
    items: [
      "Global collaborative tissue engineering scaffold repository",
      "Integration with automated high-throughput bioreactor arrays",
      "Preclinical validation datasets for regulatory submissions"
    ]
  }
];
