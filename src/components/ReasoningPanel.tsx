import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Terminal, Info, ShieldAlert, Navigation2, Zap } from 'lucide-react';
import { DetectionResult, KnowledgeGraphQuery } from '@/lib/index';

interface ReasoningPanelProps {
  detection: DetectionResult | null;
  query: KnowledgeGraphQuery | null;
  isProcessing: boolean;
}

/**
 * ReasoningPanel component displays the semantic interpretation of perception data
 * using simulated Knowledge Graph reasoning steps and SPARQL queries.
 */
export function ReasoningPanel({ detection, query, isProcessing }: ReasoningPanelProps) {
  const getActionColor = (action: KnowledgeGraphQuery['recommendedAction']) => {
    switch (action) {
      case 'STOP':
        return 'text-destructive';
      case 'GO':
        return 'text-primary';
      case 'CAUTION':
      case 'SLOW_DOWN':
        return 'text-amber-500';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Knowledge Graph Reasoning</h2>
      </div>

      <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-2">
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-8 w-full bg-muted animate-pulse rounded-lg" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-32 w-full bg-muted animate-pulse rounded-lg" />
              </div>
            </motion.div>
          ) : !detection || !query ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground"
            >
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <Info className="w-8 h-8 opacity-20" />
              </div>
              <p className="max-w-xs text-sm">
                Upload an image and the perception system will trigger knowledge reasoning.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="space-y-8"
            >
              {/* Detected Concept Section */}
              <div className="space-y-3">
                <div className="flex items-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  <Zap className="w-4 h-4 mr-2" />
                  Detected Concept
                </div>
                <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                  <span className="text-2xl font-bold text-foreground">
                    {query.detectedConcept}
                  </span>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <span>Confidence: {(detection.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Recommended Action Section */}
              <div className="space-y-3">
                <div className="flex items-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  <Navigation2 className="w-4 h-4 mr-2" />
                  Autonomous Decision
                </div>
                <div className="bg-card border-2 border-border p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg">
                  <span className="text-sm text-muted-foreground mb-2">Recommended Action</span>
                  <span className={`text-6xl font-black tracking-tighter ${getActionColor(query.recommendedAction)}`}>
                    {query.recommendedAction}
                  </span>
                  {query.recommendedAction === 'STOP' && (
                    <ShieldAlert className="w-8 h-8 mt-4 text-destructive animate-pulse" />
                  )}
                </div>
              </div>

              {/* Technical SPARQL Section */}
              <div className="space-y-3">
                <div className="flex items-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  <Terminal className="w-4 h-4 mr-2" />
                  SPARQL Query Execution
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl" />
                  <pre className="relative bg-slate-950 text-slate-300 p-5 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 backdrop-blur-sm">
                    <code className="block whitespace-pre">{query.sparql}</code>
                  </pre>
                </div>
                <p className="text-[10px] text-muted-foreground italic px-1">
                  * This query retrieves semantic action requirements from the Knowledge Graph based on the detected ontology class.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Meta */}
      <div className="pt-4 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest">
        <span>Reasoning Engine: v4.2.0</span>
        <span>Latency: {isProcessing ? '--' : '42ms'}</span>
      </div>
    </div>
  );
}
