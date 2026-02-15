import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { springPresets } from '@/lib/motion';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
}

export function ImageUpload({ onImageUpload, isProcessing }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const clearPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden border-dashed border-2 bg-background/50 backdrop-blur-sm transition-all duration-300">
      <div
        className={cn(
          "relative p-12 flex flex-col items-center justify-center min-h-[320px] cursor-pointer transition-colors",
          dragActive ? "bg-primary/5 border-primary" : "bg-transparent border-border",
          isProcessing && "pointer-events-none opacity-80"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={springPresets.gentle}
              className="relative w-full aspect-video rounded-lg overflow-hidden border border-border group"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="icon"
                  className="rounded-full"
                  onClick={clearPreview}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              {isProcessing && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-sm font-medium text-foreground">Analyzing Scene...</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center space-y-6"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-4">
                <Upload className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload Street Scene</h3>
                <p className="text-muted-foreground max-w-sm">
                  Drag and drop an image of a traffic scene, or click to browse files.
                  The AI will detect objects and reason about driving actions.
                </p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button variant="secondary" className="px-8">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Select Image
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {dragActive && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded-lg z-10 pointer-events-none flex items-center justify-center">
            <p className="text-primary font-semibold text-lg bg-background px-4 py-2 rounded-full shadow-lg">
              Drop image here
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
