"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";
import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  name: string;
  defaultValue?: string;
  className?: string;
}

export function ImageUploader({ name, defaultValue = "", className }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(defaultValue);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      });
      
      const blob = await response.json();
      if (blob.url) {
        setPreview(blob.url);
      } else {
        alert("Upload failed. Make sure Vercel Blob is configured.");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input type="hidden" name={name} value={preview} />
      
      {preview ? (
        <div className="relative group rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
          <img src={preview} alt="Preview" className="max-h-[200px] object-contain" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Replace
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setPreview("")}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="relative flex flex-col items-center justify-center p-10 text-center border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 bg-background/40 border-border/60 hover:bg-muted/40 hover:border-primary/50 group overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleUpload(file);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="w-14 h-14 mb-4 rounded-full bg-muted/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary/20 group-hover:text-primary shadow-sm border border-border/50">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground group-hover:text-primary" />
            ) : (
              <UploadCloud className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
          <p className="text-[15px] font-semibold text-foreground mb-1">
            {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
          </p>
          <p className="text-[13px] text-muted-foreground font-medium">
            SVG, PNG, JPG, or WEBP (max. 5MB)
          </p>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
    </div>
  );
}
