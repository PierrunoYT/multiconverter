'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, Download, X, FileImage, FileText, Music, Video, File, Loader2 } from 'lucide-react';

interface ConversionJob {
  id: string;
  file: File;
  outputFormat: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: Blob;
  error?: string;
  category: string;
}

const SUPPORTED_FORMATS = {
  image: {
    input: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff', 'image/svg+xml'],
    output: ['jpeg', 'png', 'webp', 'gif', 'bmp']
  },
  document: {
    input: ['text/plain', 'text/csv', 'application/json', 'text/html', 'text/css', 'text/javascript', 'application/xml', 'text/xml'],
    output: ['txt', 'csv', 'json', 'html', 'css', 'js', 'xml']
  },
  audio: {
    input: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm'],
    output: ['mp3', 'wav', 'ogg']
  },
  video: {
    input: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
    output: ['mp4', 'webm', 'ogg']
  },
  archive: {
    input: ['application/zip', 'application/x-tar', 'application/gzip'],
    output: ['zip', 'tar', 'gz']
  }
};

export default function FileConverter() {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
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
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const getFileCategory = useCallback((file: File): string | null => {
    for (const [category, formats] of Object.entries(SUPPORTED_FORMATS)) {
      if (formats.input.includes(file.type)) {
        return category;
      }
    }
    return null;
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    const newJobs: ConversionJob[] = files
      .map(file => {
        const category = getFileCategory(file);
        if (!category) return null;
        
        const defaultFormat = SUPPORTED_FORMATS[category as keyof typeof SUPPORTED_FORMATS].output[0];
        
        return {
          id: Math.random().toString(36).substr(2, 9),
          file,
          outputFormat: defaultFormat,
          status: 'pending' as const,
          category
        };
      })
      .filter(Boolean) as ConversionJob[];

    setJobs(prev => [...prev, ...newJobs]);
  }, [getFileCategory]);

  const convertImage = useCallback(async (file: File, outputFormat: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image'));
            }
          }, `image/${outputFormat}`, 0.9);
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const convertDocument = useCallback(async (file: File, outputFormat: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          let content = reader.result as string;
          let mimeType = 'text/plain';
          
          // Handle different output formats
          switch (outputFormat) {
            case 'json':
              if (file.type === 'text/csv') {
                // Simple CSV to JSON conversion
                const lines = content.split('\n');
                const headers = lines[0].split(',');
                const jsonData = lines.slice(1).map(line => {
                  const values = line.split(',');
                  const obj: any = {};
                  headers.forEach((header, index) => {
                    obj[header.trim()] = values[index]?.trim() || '';
                  });
                  return obj;
                });
                content = JSON.stringify(jsonData, null, 2);
              }
              mimeType = 'application/json';
              break;
            case 'csv':
              if (file.type === 'application/json') {
                // Simple JSON to CSV conversion
                try {
                  const jsonData = JSON.parse(content);
                  if (Array.isArray(jsonData) && jsonData.length > 0) {
                    const headers = Object.keys(jsonData[0]);
                    const csvContent = [
                      headers.join(','),
                      ...jsonData.map(row => headers.map(header => row[header] || '').join(','))
                    ].join('\n');
                    content = csvContent;
                  }
                } catch (e) {
                  throw new Error('Invalid JSON format');
                }
              }
              mimeType = 'text/csv';
              break;
            case 'html':
              if (file.type === 'text/plain') {
                content = `<!DOCTYPE html>
<html>
<head>
    <title>Converted Document</title>
</head>
<body>
    <pre>${content}</pre>
</body>
</html>`;
              }
              mimeType = 'text/html';
              break;
            case 'txt':
              mimeType = 'text/plain';
              break;
            default:
              mimeType = `text/${outputFormat}`;
          }
          
          const blob = new Blob([content], { type: mimeType });
          resolve(blob);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  const convertFile = useCallback(async (file: File, outputFormat: string, category: string): Promise<Blob> => {
    switch (category) {
      case 'image':
        return convertImage(file, outputFormat);
      case 'document':
        return convertDocument(file, outputFormat);
      case 'audio':
      case 'video':
      case 'archive':
        // For now, these formats require server-side processing or specialized libraries
        // We'll return a placeholder message
        throw new Error(`${category} conversion requires specialized tools. Coming soon!`);
      default:
        throw new Error('Unsupported file type');
    }
  }, [convertImage, convertDocument]);

  const processJob = useCallback(async (jobId: string) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'processing' } : job
    ));

    try {
      const job = jobs.find(j => j.id === jobId);
      if (!job) throw new Error('Job not found');

      const result = await convertFile(job.file, job.outputFormat, job.category);
      
      setJobs(prev => prev.map(j =>
        j.id === jobId ? { ...j, status: 'completed', result } : j
      ));
    } catch (error) {
      setJobs(prev => prev.map(j =>
        j.id === jobId ? {
          ...j,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        } : j
      ));
    }
  }, [jobs, convertFile]);

  const downloadFile = useCallback((job: ConversionJob) => {
    if (!job.result) return;

    const url = URL.createObjectURL(job.result);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${job.file.name.split('.')[0]}.${job.outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const removeJob = useCallback((jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
  }, []);

  const updateJobFormat = useCallback((jobId: string, format: string) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, outputFormat: format, status: 'pending' } : job
    ));
  }, []);

  const getFileIcon = useCallback((category: string) => {
    switch (category) {
      case 'image':
        return <FileImage className="w-8 h-8 text-blue-500" />;
      case 'document':
        return <FileText className="w-8 h-8 text-green-500" />;
      case 'audio':
        return <Music className="w-8 h-8 text-purple-500" />;
      case 'video':
        return <Video className="w-8 h-8 text-red-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  }, []);

  const getAllSupportedTypes = useCallback(() => {
    const allTypes: string[] = [];
    Object.values(SUPPORTED_FORMATS).forEach(format => {
      allTypes.push(...format.input);
    });
    return allTypes.join(',');
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
          dragActive 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
          Drop your files here or click to browse
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Supports: Images (JPG, PNG, GIF, WebP, BMP, TIFF, SVG), Documents (TXT, CSV, JSON, HTML, CSS, JS, XML), Audio (MP3, WAV, OGG), Video (MP4, WebM), Archives (ZIP, TAR, GZ)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={getAllSupportedTypes()}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Conversion Jobs */}
      {jobs.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Conversion Queue
          </h3>
          
          {jobs.map((job) => (
            <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(job.category)}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {job.file.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(job.file.size / 1024 / 1024).toFixed(2)} MB • {job.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Format Selector */}
                  <select
                    value={job.outputFormat}
                    onChange={(e) => updateJobFormat(job.id, e.target.value)}
                    disabled={job.status === 'processing'}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {SUPPORTED_FORMATS[job.category as keyof typeof SUPPORTED_FORMATS].output.map(format => (
                      <option key={format} value={format}>
                        {format.toUpperCase()}
                      </option>
                    ))}
                  </select>

                  {/* Action Buttons */}
                  {job.status === 'pending' && (
                    <button
                      onClick={() => processJob(job.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Convert
                    </button>
                  )}

                  {job.status === 'processing' && (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Converting...
                      </span>
                    </div>
                  )}

                  {job.status === 'completed' && (
                    <button
                      onClick={() => downloadFile(job)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  )}

                  {job.status === 'error' && (
                    <div className="text-red-600 dark:text-red-400 text-sm">
                      Error: {job.error}
                    </div>
                  )}

                  <button
                    onClick={() => removeJob(job.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}