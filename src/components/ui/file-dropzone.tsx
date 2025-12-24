import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, FileText, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  placeholder?: string;
  acceptedFormats?: string;
}

export function FileDropZone({ 
  onFileSelect, 
  accept = "*/*", 
  maxSize = 50, 
  className,
  placeholder = "Drag & drop file atau",
  acceptedFormats = "PDF, PPT, PPTX, DOC, DOCX (max 50MB)"
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File terlalu besar. Maksimal ${maxSize}MB`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={!selectedFile ? handleBrowseClick : undefined}
      className={cn(
        "rounded-lg border-2 border-dashed p-6 text-center transition-all cursor-pointer",
        isDragOver 
          ? "border-primary bg-primary/5" 
          : selectedFile 
            ? "border-success bg-success/5" 
            : "border-border bg-muted/50 hover:border-primary/50",
        error && "border-destructive bg-destructive/5",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {selectedFile ? (
        <div className="animate-fade-in">
          <div className="flex items-center justify-center gap-2 text-success mb-2">
            <Check className="h-5 w-5" />
            <span className="font-medium">File siap diupload</span>
          </div>
          <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-background border border-border">
            <FileText className="h-8 w-8 text-primary" />
            <div className="text-left flex-1">
              <p className="font-medium text-foreground truncate max-w-[200px]">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <Upload className={cn("mx-auto h-8 w-8", isDragOver ? "text-primary" : "text-muted-foreground")} />
          <p className="mt-2 text-sm text-muted-foreground">
            {placeholder} <span className="text-primary cursor-pointer hover:underline">browse</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{acceptedFormats}</p>
          {error && (
            <p className="mt-2 text-xs text-destructive">{error}</p>
          )}
        </>
      )}
    </div>
  );
}
