/**
 * Route path constants for the application
 */
export const ROUTE_PATHS = {
  HOME: '/',
  DEMO: '/demo',
} as const;

/**
 * Represents an object detected by the AI perception system
 */
export interface DetectionResult {
  id: string;
  label: string;
  confidence: number;
  boundingBox: {
    x: number; // Percentage from left (0-100)
    y: number; // Percentage from top (0-100)
    width: number; // Percentage width
    height: number; // Percentage height
  };
  hotspot?: {
    x: number; // Center X position for hotspot
    y: number; // Center Y position for hotspot
    intensity: number; // Glow intensity (0-1)
  };
}

/**
 * Represents the reasoning metadata retrieved from the Knowledge Graph
 */
export interface KnowledgeGraphQuery {
  sparql: string;
  detectedConcept: string;
  recommendedAction: 'STOP' | 'GO' | 'CAUTION' | 'SLOW_DOWN';
}

/**
 * Mock data mapping detected object labels to their Knowledge Graph counterparts
 * This simulates the backend retrieval from a Fuseki/SPARQL endpoint.
 */
export const MOCK_DETECTION_DATA: Record<string, { concept: string; action: KnowledgeGraphQuery['recommendedAction']; sparql: string }> = {
  red_light: {
    concept: "Red Traffic Light",
    action: "STOP",
    sparql: `PREFIX drive: <http://schema.driving.ai/>\nSELECT ?action WHERE {\n  drive:red_light drive:requiresAction ?action .\n}`,
  },
  green_light: {
    concept: "Green Traffic Light",
    action: "GO",
    sparql: `PREFIX drive: <http://schema.driving.ai/>\nSELECT ?action WHERE {\n  drive:green_light drive:requiresAction ?action .\n}`,
  },
  pedestrian: {
    concept: "Pedestrian Crossing",
    action: "CAUTION",
    sparql: `PREFIX drive: <http://schema.driving.ai/>\nSELECT ?action WHERE {\n  drive:pedestrian drive:requiresAction ?action .\n}`,
  },
  stop_sign: {
    concept: "Stop Sign",
    action: "STOP",
    sparql: `PREFIX drive: <http://schema.driving.ai/>\nSELECT ?action WHERE {\n  drive:stop_sign drive:requiresAction ?action .\n}`,
  },
  yellow_light: {
    concept: "Yellow Traffic Light",
    action: "SLOW_DOWN",
    sparql: `PREFIX drive: <http://schema.driving.ai/>\nSELECT ?action WHERE {\n  drive:yellow_light drive:requiresAction ?action .\n}`,
  },
};
