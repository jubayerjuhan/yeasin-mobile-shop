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
          className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleUpload(file);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          ) : (
            <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
          )}
          <p className="text-sm font-medium">Click or drag image here</p>
          <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, WEBP</p>
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
