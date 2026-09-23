export interface Frame {
  id: string;
  title: string;
  subtitle: string;
  chapter?: string;
  notes?: string[];
  price?: string | null;
  ctaPrimary?: string;
  ctaSecondary?: string;
}

export interface Segment {
  id: string;
  label: string;
  transitionStart: number;
  transitionEnd: number;
  loopStart: number;
  loopEnd: number;
  scrollResume: number;
  loopable: boolean;
  notes?: string;
}

export const frames: Frame[] = [
  {
    id: "entry",
    chapter: "The Golden Hall",
    title: "You Never Truly Own One",
    subtitle:
      "Since 1839, fewer than sixty thousand ways a year to hold one. Scroll to walk through the hall of Patek Philippe.",
    price: null,
  },
  {
    id: "calatrava",
    chapter: "Ref. 5226G",
    title: "Calatrava — The Purist",
    subtitle:
      "The oldest continuously produced watch collection in the world. Restraint as the ultimate statement.",
    price: "$47,262",
    notes: ["40mm white gold", "Caliber 26-330 S C", "Gyromax® Spiromax®"],
    ctaPrimary: "Buy Calatrava — $47,262",
    ctaSecondary: "Discover Calatrava",
  },
  {
    id: "nautilus",
    chapter: "Ref. 5712/1A",
    title: "Nautilus — The Icon",
    subtitle:
      "Genta's porthole, drawn in a single night in 1976. Moon phase accurate to one day in 122 years.",
    price: "$48,000",
    notes: ["40mm steel", "Caliber 240 PS IRM C LU", "Moon phase"],
    ctaPrimary: "Buy Nautilus — $48,000",
    ctaSecondary: "Discover Nautilus",
  },
  {
    id: "grand-complication",
    chapter: "Ref. 5204G",
    title: "Grand Complication",
    subtitle:
      "Split-seconds chronograph and perpetual calendar in one hand-wound caliber. 556 components, one master watchmaker.",
    price: "$380,971",
    notes: ["41mm white gold", "Caliber CHR 29-535 PS Q", "556 components"],
    ctaPrimary: "Buy Grand Complication — $380,971",
    ctaSecondary: "Discover Ref. 5204G",
  },
  {
    id: "aquanaut",
    chapter: "Ref. 5168G",
    title: "Aquanaut — The Adventure",
    subtitle:
      "White gold against olive composite. The only watch wrong in neither surf nor Michelin dining room.",
    price: "$88,898",
    notes: ["38mm white gold", "Caliber 324 S C", "Tropical composite strap"],
    ctaPrimary: "Buy Aquanaut — $88,898",
    ctaSecondary: "Discover Aquanaut",
  },
  {
    id: "golden-ellipse",
    chapter: "Ref. 3738/100G",
    title: "Golden Ellipse",
    subtitle:
      "Drawn in 1968 from the Golden Ratio. Pure form, unchanged ever since — the quietest radical watch made.",
    price: "$46,997",
    notes: ["Yellow gold ellipse", "Ultra-slim automatic", "Sunburst olive dial"],
    ctaPrimary: "Buy Golden Ellipse — $46,997",
    ctaSecondary: "Discover the Ellipse",
  },
  {
    id: "loop-complete",
    chapter: "The Return",
    title: "The Hall Awaits.",
    subtitle:
      "The circle is complete. Scroll again to walk the path once more.",
    price: null,
    ctaPrimary: "Return to the Beginning",
  },
];

/**
 * Scene timeline measured from master_scrollytelling_g1.mp4 (47.0s).
 * These timestamps are SPECIFIC to this file. If the video changes, re-measure.
 */
export const SEGMENTS: Segment[] = [
  {
    id: "scene-1-hall-opening",
    label: "Golden Hall Opening",
    transitionStart: 0.0,
    transitionEnd: 3.0,
    loopStart: 0.0,
    loopEnd: 0.0,
    scrollResume: 3.0,
    loopable: false,
    notes: "Fast particle and smoke movement",
  },
  {
    id: "scene-2-library",
    label: "Library Desk",
    transitionStart: 3.0,
    transitionEnd: 4.0,
    loopStart: 4.0,
    loopEnd: 7.0,
    scrollResume: 7.0,
    loopable: true,
    notes: "Candle flicker and subtle sparkles",
  },
  {
    id: "scene-3-doors",
    label: "Library to Marina",
    transitionStart: 7.0,
    transitionEnd: 11.0,
    loopStart: 0.0,
    loopEnd: 0.0,
    scrollResume: 11.0,
    loopable: false,
    notes: "Fast camera push through open doors",
  },
  {
    id: "scene-4-marina",
    label: "Marina Rain",
    transitionStart: 11.0,
    transitionEnd: 12.0,
    loopStart: 12.0,
    loopEnd: 16.0,
    scrollResume: 16.0,
    loopable: true,
    notes: "Heavy rain and splashing",
  },
  {
    id: "scene-5-plunge",
    label: "Ice Cave Plunge",
    transitionStart: 16.0,
    transitionEnd: 19.0,
    loopStart: 0.0,
    loopEnd: 0.0,
    scrollResume: 19.0,
    loopable: false,
    notes: "Abrupt underwater/ice transition",
  },
  {
    id: "scene-6-ice",
    label: "Ice Cavern",
    transitionStart: 19.0,
    transitionEnd: 20.0,
    loopStart: 20.0,
    loopEnd: 23.0,
    scrollResume: 23.0,
    loopable: true,
    notes: "Electric lightning arcs",
  },
  {
    id: "scene-7-wipe",
    label: "Ice to Jungle",
    transitionStart: 23.0,
    transitionEnd: 26.0,
    loopStart: 0.0,
    loopEnd: 0.0,
    scrollResume: 26.0,
    loopable: false,
    notes: "Fast spatial wipe",
  },
  {
    id: "scene-8-jungle",
    label: "Jungle Sunrays",
    transitionStart: 26.0,
    transitionEnd: 27.0,
    loopStart: 27.0,
    loopEnd: 30.0,
    scrollResume: 30.0,
    loopable: true,
    notes: "Flying blue butterflies",
  },
  {
    id: "scene-9-desert-pan",
    label: "Jungle to Desert",
    transitionStart: 30.0,
    transitionEnd: 34.0,
    loopStart: 0.0,
    loopEnd: 0.0,
    scrollResume: 34.0,
    loopable: false,
    notes: "Horizontal wipe to sunset",
  },
  {
    id: "scene-10-desert",
    label: "Desert Sunset",
    transitionStart: 34.0,
    transitionEnd: 36.0,
    loopStart: 36.0,
    loopEnd: 39.0,
    scrollResume: 39.0,
    loopable: true,
    notes: "Sand particles erupting",
  },
  {
    id: "scene-11-return",
    label: "Return to Hall",
    transitionStart: 39.0,
    transitionEnd: 43.0,
    loopStart: 0.0,
    loopEnd: 0.0,
    scrollResume: 43.0,
    loopable: false,
    notes: "Curved screen pull-back",
  },
  {
    id: "scene-12-final",
    label: "Final Display",
    transitionStart: 43.0,
    transitionEnd: 44.0,
    loopStart: 44.0,
    loopEnd: 46.0,
    scrollResume: 47.0,
    loopable: true,
    notes: "Static display with ambient fog",
  },
];

export const TOTAL_VIDEO_DURATION = 47.0;
export const PX_PER_SECOND = 220;
export const TOTAL_SCROLL_PX = TOTAL_VIDEO_DURATION * PX_PER_SECOND; // 10340

/** Which scene maps to which product frame */
export const SCENE_TO_FRAME: Record<string, string> = {
  "scene-1-hall-opening": "entry",
  "scene-2-library": "calatrava",
  "scene-3-doors": "calatrava",
  "scene-4-marina": "nautilus",
  "scene-5-plunge": "nautilus",
  "scene-6-ice": "grand-complication",
  "scene-7-wipe": "grand-complication",
  "scene-8-jungle": "aquanaut",
  "scene-9-desert-pan": "aquanaut",
  "scene-10-desert": "golden-ellipse",
  "scene-11-return": "golden-ellipse",
  "scene-12-final": "loop-complete",
};

/** Frames that never show product panels */
export const NO_PANEL_FRAMES = new Set(["entry", "loop-complete"]);

export const EXPERIENCE_VIDEO = "/video/master_scrollytelling_g1_opt.mp4";

export function getFrameForSegment(segment: Segment): Frame {
  const frameId = SCENE_TO_FRAME[segment.id] ?? "entry";
  return frames.find((f) => f.id === frameId) ?? frames[0];
}
