import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Brain, Database, Zap, ArrowLeft, Eye, Activity, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useImageProcessing } from "@/hooks/useImageProcessing";
import { ROUTE_PATHS } from "@/lib/index";

interface HUDUploadZoneProps {
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
}

function HUDUploadZone({ onImageUpload, isProcessing }: HUDUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageUpload(imageFile);
    }
  }, [onImageUpload]);
  
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  }, [onImageUpload]);
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <motion.div 
      className={`relative min-h-[70vh] flex items-center justify-center cursor-pointer transition-all duration-500 ${
        isDragOver ? 'scale-105' : 'scale-100'
      } ${isProcessing ? 'pointer-events-none' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={handleClick}
      whileHover={{ scale: isProcessing ? 1 : 1.02 }}
      whileTap={{ scale: isProcessing ? 1 : 0.98 }}
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-neural-primary/10" />
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '40px 40px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>
      
      <div className="relative z-10 text-center max-w-2xl mx-auto px-8">
        <motion.div 
          className={`relative p-16 border-2 rounded-2xl transition-all duration-500 ${
            isDragOver 
              ? 'border-primary glow-primary bg-primary/5' 
              : 'border-primary/30 bg-background/50'
          } backdrop-blur-sm`}
          animate={{
            borderColor: isDragOver ? 'rgb(59, 130, 246)' : 'rgba(59, 130, 246, 0.3)'
          }}
        >
          <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-primary/60" />
          <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-primary/60" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-primary/60" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-primary/60" />
          
          <motion.div 
            className="mb-8"
            animate={{
              scale: isDragOver ? 1.1 : 1,
              rotate: isDragOver ? 5 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Upload className="h-20 w-20 text-primary mx-auto mb-4" />
          </motion.div>
          
          <div className="space-y-6">
            <motion.h2 
              className="text-3xl font-bold text-foreground"
              animate={{
                color: isDragOver ? 'rgb(59, 130, 246)' : 'rgb(var(--foreground))'
              }}
            >
              {isProcessing ? 'Processing Image...' : 'Ready for Perception'}
            </motion.h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {isDragOver 
                ? 'Release to begin cognitive analysis' 
                : 'Drop a street scene image or click to select'
              }
            </p>
            
            <div className="flex items-center justify-center space-x-8 mt-8">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  isProcessing ? 'bg-primary animate-pulse' : 'bg-muted'
                }`} />
                <span className="text-sm text-muted-foreground">YOLO Detection</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  isProcessing ? 'bg-neural-secondary animate-pulse' : 'bg-muted'
                }`} />
                <span className="text-sm text-muted-foreground">SPARQL Query</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  isProcessing ? 'bg-destructive animate-pulse' : 'bg-muted'
                }`} />
                <span className="text-sm text-muted-foreground">Decision Engine</span>
              </div>
            </div>
            
            {isProcessing && (
              <motion.div 
                className="w-full h-1 bg-muted rounded-full overflow-hidden mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary via-neural-secondary to-destructive rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        onChange={handleFileSelect}
        className="hidden" 
        disabled={isProcessing}
      />
    </motion.div>
  );
}

interface DualPaneViewProps {
  imageUrl: string;
  detection: any;
  query: any;
  isProcessing: boolean;
  onReset: () => void;
}

function DualPaneView({ imageUrl, detection, query, isProcessing, onReset }: DualPaneViewProps) {
  return (
    <motion.div 
      className="h-screen flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="flex-1 relative overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-black">
          <img 
            src={imageUrl} 
            alt="Street scene analysis" 
            className="w-full h-full object-cover"
          />
          
          {detection && (
            <>
              <motion.div
                className="absolute hotspot"
                style={{
                  left: `${detection.hotspot?.x || detection.boundingBox.x + detection.boundingBox.width/2}%`,
                  top: `${detection.hotspot?.y || detection.boundingBox.y + detection.boundingBox.height/2}%`,
                  width: '32px',
                  height: '32px',
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
              
              <motion.div 
                className="absolute"
                style={{
                  left: `${detection.hotspot?.x || detection.boundingBox.x + detection.boundingBox.width/2}%`,
                  top: `${(detection.hotspot?.y || detection.boundingBox.y + detection.boundingBox.height/2) - 8}%`,
                  transform: 'translate(-50%, -100%)'
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Badge 
                  variant={detection.label.includes('red') ? 'destructive' : 'default'}
                  className="text-sm font-mono glow-primary backdrop-blur-sm"
                >
                  {detection.label} ({Math.round(detection.confidence * 100)}%)
                </Badge>
              </motion.div>
              
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <div 
                  className="w-full h-full"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                  }}
                />
              </motion.div>
            </>
          )}
          
          <div className="absolute top-6 left-6 right-6">
            <div className="flex justify-between items-start">
              <div className="glass p-4 rounded-lg border border-primary/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Visual Analysis</span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Resolution: 1920×1080</p>
                  <p>Objects: {detection ? '1 detected' : 'Scanning...'}</p>
                  <p>Confidence: {detection ? `${Math.round(detection.confidence * 100)}%` : '--'}</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={onReset}
                className="glass border-primary/30 hover:border-primary/60 text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                New Image
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="w-96 bg-background/95 backdrop-blur-md border-l border-border/30 flex flex-col"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="p-6 border-b border-border/30">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-neural-primary" />
            <h3 className="text-xl font-bold text-foreground">Cognitive Stream</h3>
            {isProcessing && (
              <div className="w-2 h-2 bg-neural-primary rounded-full animate-pulse" />
            )}
          </div>
        </div>
        
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold text-primary">OBJECT DETECTION</h4>
            </div>
            
            {detection ? (
              <div className="glass p-4 rounded-lg border border-primary/20">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Label</span>
                    <span className="text-sm font-mono text-foreground">{detection.label}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Confidence</span>
                    <span className="text-sm font-mono text-primary">{Math.round(detection.confidence * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Detected
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass p-4 rounded-lg border border-muted/20">
                <p className="text-sm text-muted-foreground">Awaiting detection...</p>
              </div>
            )}
          </motion.div>
          
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-neural-secondary" />
              <h4 className="text-sm font-semibold text-neural-secondary">SPARQL QUERY</h4>
            </div>
            
            {query ? (
              <div className="glass p-4 rounded-lg border border-neural-secondary/20">
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {query.sparql}
                </pre>
              </div>
            ) : (
              <div className="glass p-4 rounded-lg border border-muted/20">
                <p className="text-sm text-muted-foreground">Query generation pending...</p>
              </div>
            )}
          </motion.div>
          
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-neural-accent" />
              <h4 className="text-sm font-semibold text-neural-accent">REASONING OUTPUT</h4>
            </div>
            
            {query ? (
              <div className="glass p-4 rounded-lg border border-neural-accent/20">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Concept</span>
                    <span className="text-sm font-mono text-foreground">{query.detectedConcept}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Action</span>
                    <Badge 
                      variant={query.recommendedAction === 'STOP' ? 'destructive' : 'default'}
                      className="text-sm font-mono"
                    >
                      {query.recommendedAction}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="text-sm font-mono text-neural-accent">23ms</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass p-4 rounded-lg border border-muted/20">
                <p className="text-sm text-muted-foreground">Reasoning pending...</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Demo() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { processImage, detection, query, isProcessing } = useImageProcessing();
  
  const handleImageUpload = useCallback(async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    await processImage(file);
  }, [processImage]);
  
  const handleReset = useCallback(() => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
  }, [uploadedImage]);
  
  return (
    <div className="min-h-screen bg-background dark overflow-hidden">
      <AnimatePresence>
        {!uploadedImage && (
          <motion.div 
            className="absolute top-0 left-0 right-0 z-50 border-b border-border/20 bg-background/80 backdrop-blur-sm"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.6 }}
          >
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link to={ROUTE_PATHS.HOME}>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                  <div className="h-6 w-px bg-border/30" />
                  <h1 className="text-xl font-bold text-foreground">Interactive Demo</h1>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Brain className="h-5 w-5 text-neural-primary" />
                  <span className="text-sm text-muted-foreground font-medium">Cognitive Driving Engine</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {!uploadedImage ? (
          <motion.div 
            key="upload"
            className="min-h-screen pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HUDUploadZone 
              onImageUpload={handleImageUpload} 
              isProcessing={isProcessing} 
            />
          </motion.div>
        ) : (
          <motion.div 
            key="analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DualPaneView 
              imageUrl={uploadedImage}
              detection={detection}
              query={query}
              isProcessing={isProcessing}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {uploadedImage && (query?.recommendedAction || isProcessing) && (
          <motion.div 
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className={`glass-strong p-8 rounded-2xl border-2 ${
              query?.recommendedAction === 'STOP' 
                ? 'border-destructive glow-destructive' 
                : query?.recommendedAction === 'GO' 
                ? 'border-green-500 glow-success' 
                : 'border-primary glow-primary'
            } backdrop-blur-md`}>
              <div className="flex items-center space-x-6">
                <motion.div
                  animate={{ rotate: isProcessing ? 360 : 0 }}
                  transition={{ duration: 2, repeat: isProcessing ? Infinity : 0, ease: "linear" }}
                >
                  <Zap className="h-10 w-10" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold opacity-80 mb-1">DRIVING COMMAND</p>
                  <p className="text-4xl font-bold">
                    {isProcessing ? 'ANALYZING...' : query?.recommendedAction}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
