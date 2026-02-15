import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DetectionResult } from '@/lib/index.ts';
import { springPresets } from '@/lib/motion';

interface DetectionVisualizationProps {
  imageUrl: string;
  detections: DetectionResult[];
}

/**
 * DetectionVisualization renders the uploaded street scene image and overlays
 * AI-detected bounding boxes with associated labels and confidence scores.
 */
export function DetectionVisualization({ imageUrl, detections }: DetectionVisualizationProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-slate-950/5 border border-border shadow-sm">
      <div className="relative aspect-video w-full flex items-center justify-center overflow-hidden">
        {/* The Base Image */}
        <img
          src={imageUrl}
          alt="Autonomous driving perception view"
          className="h-full w-full object-cover transition-opacity duration-500"
        />

        {/* Detection Overlays Layer */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {detections.map((detection) => (
              <motion.div
                key={detection.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={springPresets.snappy}
                style={{
                  position: 'absolute',
                  left: `${detection.boundingBox.x}%`,
                  top: `${detection.boundingBox.y}%`,
                  width: `${detection.boundingBox.width}%`,
                  height: `${detection.boundingBox.height}%`,
                }}
                className="pointer-events-auto group"
              >
                {/* Bounding Box Rect */}
                <div 
                  className={`w-full h-full border-2 rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-all duration-300 ${
                    detection.label.includes('red') || detection.label.includes('stop') 
                      ? 'border-destructive shadow-destructive/20 bg-destructive/5'
                      : 'border-primary shadow-primary/20 bg-primary/5'
                  }`}
                />

                {/* Label Badge */}
                <div className="absolute -top-7 left-0 flex items-center gap-2">
                  <div 
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase text-white shadow-md ${
                      detection.label.includes('red') || detection.label.includes('stop')
                        ? 'bg-destructive'
                        : 'bg-primary'
                    }`}
                  >
                    {detection.label.replace('_', ' ')}
                  </div>
                  <div className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono text-white border border-white/10">
                    {(detection.confidence * 100).toFixed(1)}%
                  </div>
                </div>

                {/* Corner Accents for technical feel */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white/40" />
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white/40" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white/40" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white/40" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Grid Overlay for Technical Aesthetic */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
      </div>

      {/* Perception Metadata Footer */}
      <div className="bg-card border-t border-border p-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Sensor Active</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <span className="text-[10px] font-mono text-muted-foreground">Resolution: 1920x1080</span>
        </div>
        <div className="text-[10px] font-mono text-muted-foreground italic">
          Frame processed in 14ms
        </div>
      </div>
    </div>
  );
}
