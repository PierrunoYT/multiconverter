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
          ? 'border-green-400 bg-green-50 dark:bg-green-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
        Drop your documents here or click to browse
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Supports: TXT, CSV, JSON, HTML, CSS, JS, XML
      </p>
      <div className="flex justify-center space-x-4 text-xs text-gray-400">
        <span>✓ Text Processing</span>
        <span>✓ Format Conversion</span>
        <span>✓ Structure Preservation</span>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,.csv,.json,.html,.css,.js,.xml,text/*,application/json,application/xml"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}