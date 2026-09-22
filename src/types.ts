export type TissueId = "bone" | "skin" | "cartilage" | "ligament" | "tendon";
export type LatticePattern = "gyroid" | "honeycomb" | "grid" | "tpms";
export type SimulationMode = "nutrient-flow" | "stress-distribution" | "degradation" | "cell-growth";

export interface TissuePreset {
  id: TissueId;
  label: string;
  iconName: string;
  color: string;
  accentHex: string;
  defaultStrength: number; // MPa
  defaultFlexibility: number; // %
  defaultDegradation: number; // months or weeks
  defaultPorosity: number; // %
  recommendedMaterial: string;
  recommendedPoreSize: string;
  recommendedPattern: LatticePattern;
  recommendedSpeed: string;
  recommendedStrength: string;
  recommendedDegradation: string;
  confidence: number;
  biomechanicalProfile: string;
  biomedicalReason: string;
}

export interface RecommendationResult {
  tissueId: TissueId;
  material: string;
  poreSize: string;
  porosity: number;
  pattern: LatticePattern;
  printingSpeed: string;
  strength: string;
  degradation: string;
  confidence: number;
  reason: string;
  tradeOffs: {
    pros: string[];
    cons: string[];
    mitigation: string;
  };
  citations: ResearchCitation[];
}

export interface ResearchCitation {
  id: string;
  title: string;
  journal: string;
  year: number;
  authors: string;
  doi: string;
  similarityScore: number;
  keyFinding: string;
}

export interface MaterialInfo {
  id: string;
  name: string;
  category: "BIOPOLYMER" | "HYDROGEL" | "CERAMIC" | "THERMOPLASTIC";
  chemicalFormula: string;
  strength: "Low" | "Medium" | "High" | "Ultra-High";
  flexibility: "Low" | "Medium" | "High";
  degradation: "Fast (weeks)" | "Medium (months)" | "Slow (years)";
  viscosity: string;
  typicalApplications: string[];
  color: string;
  accentHex: string;
  description: string;
  crosslinkingMethod: string;
}

export interface PatientStory {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  story: string;
  clinicalChallenge: string;
  engineeringSolution: string;
  tag: string;
  badgeColor: string;
  stats: {
    metric: string;
    label: string;
  };
}

export interface IotPacket {
  packetId: string;
  timestamp: string;
  material: string;
  porosity: number;
  speed: number;
  nozzle_temp_c: number;
  bed_temp_c: number;
  layer_height_um: number;
  extrusion_rate_ul_s: number;
  stepper_rpm: number;
  system_status: "STANDBY" | "TRANSMITTING" | "PRINTING_ACTIVE" | "COMPLETED";
}

export interface TeamMember {
  role: string;
  name: string;
  focus: string;
  avatarIcon: string;
  skills: string[];
  bio: string;
}
