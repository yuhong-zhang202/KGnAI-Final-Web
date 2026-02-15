import { useState, useCallback } from 'react';
import { 
  DetectionResult, 
  KnowledgeGraphQuery, 
  MOCK_DETECTION_DATA 
} from '@/lib/index';

/**
 * Custom hook for simulating AI image processing and Knowledge Graph reasoning.
 * This encapsulates the logic for image handling, perception simulation,
 * and retrieving semantic decisions from the mock Knowledge Graph.
 */
export function useImageProcessing() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [queryResult, setQueryResult] = useState<KnowledgeGraphQuery | null>(null);

  /**
   * Simulates the end-to-end pipeline: 
   * 1. Perception (Object Detection)
   * 2. Knowledge Extraction (Concept Mapping)
   * 3. Reasoning (SPARQL Action Query)
   */
  const processImage = useCallback(async (file: File) => {
    // Cleanup previous URL if exists to prevent memory leaks
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    setIsProcessing(true);
    
    // Create preview URL for immediate display
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    // Reset previous results while processing
    setDetections([]);
    setQueryResult(null);

    // Simulate AI inference and Knowledge Graph query delay
    // Using a realistic 2.2 second delay to demonstrate the multi-stage system "thinking"
    await new Promise((resolve) => setTimeout(resolve, 2200));

    // Simulation Logic: Pick a random object from our semantic database
    // In a real-world scenario, this label would be the output of a CV model like YOLO or EfficientDet
    const availableLabels = Object.keys(MOCK_DETECTION_DATA);
    const selectedLabel = availableLabels[Math.floor(Math.random() * availableLabels.length)];
    const mockKnowledge = MOCK_DETECTION_DATA[selectedLabel];

    // Step 1: Simulated Perception Output (Bounding Box + Hotspot)
    // We generate a bounding box that would typically surround the detected object
    const simulatedDetection: DetectionResult = {
      id: `perception-id-${Math.random().toString(36).substring(2, 11)}`,
      label: selectedLabel,
      confidence: 0.89 + Math.random() * 0.1, // High confidence simulation (89-99%)
      boundingBox: {
        x: 42 + (Math.random() * 6 - 3), // Roughly centered with slight variance
        y: 28 + (Math.random() * 6 - 3),
        width: 14,
        height: 22,
      },
      hotspot: {
        x: 50 + (Math.random() * 20 - 10), // Center hotspot with variance
        y: 40 + (Math.random() * 20 - 10),
        intensity: 0.8 + Math.random() * 0.2, // High intensity glow
      },
    };

    // Step 2 & 3: Simulated Knowledge Graph Query & Action Inference
    // This part simulates a SPARQL SELECT query to a Fuseki backend
    const simulatedQueryResult: KnowledgeGraphQuery = {
      sparql: mockKnowledge.sparql,
      detectedConcept: mockKnowledge.concept,
      recommendedAction: mockKnowledge.action,
    };

    setDetections([simulatedDetection]);
    setQueryResult(simulatedQueryResult);
    setIsProcessing(false);
  }, [imageUrl]);

  /**
   * Reset the hook state to initial values, useful for starting a new analysis
   */
  const reset = useCallback(() => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);
    setDetections([]);
    setQueryResult(null);
    setIsProcessing(false);
  }, [imageUrl]);

  return {
    isProcessing,
    imageUrl,
    detection: detections[0] || null, // Return single detection for demo
    detections,
    query: queryResult,
    processImage,
    reset,
  };
}
