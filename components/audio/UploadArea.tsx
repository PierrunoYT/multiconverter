import { useRef, useCallback, useState } from 'react';
import { Upload } from 'lucide-react';

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
}

export default function UploadArea({ onFilesSelected }: UploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  }, [onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesSelected(files);
  }, [onFilesSelected]);

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer mb-8 ${
        dragActive 
          ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
        Drop your audio files here or click to browse
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Supports: MP3, WAV, OGG, AAC, FLAC, M4A, WebM, 3GP, AMR
      </p>
      <div className="flex justify-center space-x-4 text-xs text-gray-400">
        <span>✓ Batch Processing</span>
        <span>✓ Quality Control</span>
        <span>✓ Volume Adjustment</span>
        <span>✓ Real MP3 Encoding</span>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*,.mp3,.wav,.ogg,.flac,.aac,.m4a,.webm,.3gp,.amr"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}