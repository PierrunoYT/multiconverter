'use client';

import { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Upload, Download, X, Music, Loader2, Volume2 } from 'lucide-react';
import Link from 'next/link';

interface ConversionJob {
  id: string;
  file: File;
  outputFormat: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: Blob;
  error?: string;
  duration?: number;
}

const SUPPORTED_FORMATS = {
  input: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/aac', 'audio/flac', 'audio/webm', 'audio/x-m4a'],
  output: ['wav', 'webm', 'ogg', 'mp3']
};

// Format capabilities based on browser support
const getFormatCapabilities = () => {
  const mediaRecorder = typeof MediaRecorder !== 'undefined';
  const webAudio = typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined';
  
  return {
    wav: webAudio, // Always supported with Web Audio API
    webm: mediaRecorder && MediaRecorder.isTypeSupported('audio/webm;codecs=opus'),
    ogg: mediaRecorder && MediaRecorder.isTypeSupported('audio/ogg;codecs=opus'),
    mp3: false // Requires additional library (lamejs)
  };
};

export default function AudioConverter() {
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFiles = useCallback((files: File[]) => {
    const newJobs: ConversionJob[] = files
      .filter(file => 
        SUPPORTED_FORMATS.input.includes(file.type) || 
        file.name.match(/\.(mp3|wav|ogg|flac|aac|m4a|webm)$/i)
      )
      .map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        outputFormat: SUPPORTED_FORMATS.output[0],
        status: 'pending' as const
      }));

    setJobs(prev => [...prev, ...newJobs]);
  }, []);

  const convertAudio = useCallback(async (file: File, outputFormat: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const fileReader = new FileReader();

      fileReader.onload = async () => {
        try {
          const arrayBuffer = fileReader.result as ArrayBuffer;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          switch (outputFormat) {
            case 'wav':
              const wavBlob = audioBufferToWav(audioBuffer);
              resolve(wavBlob);
              break;
              
            case 'webm':
              if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                const webmBlob = await audioBufferToWebM(audioBuffer, audioContext);
                resolve(webmBlob);
              } else {
                throw new Error('WebM format not supported in this browser');
              }
              break;
              
            case 'ogg':
              if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
                const oggBlob = await audioBufferToOgg(audioBuffer, audioContext);
                resolve(oggBlob);
              } else {
                throw new Error('OGG format not supported in this browser');
              }
              break;
              
            case 'mp3':
              // MP3 encoding requires additional libraries
              // For now, we'll provide a WAV fallback with a clear message
              const mp3FallbackBlob = audioBufferToWav(audioBuffer);
              resolve(mp3FallbackBlob);
              break;
              
            default:
              throw new Error(`Unsupported output format: ${outputFormat}`);
          }
        } catch (error) {
          reject(new Error(error instanceof Error ? error.message : 'Failed to decode audio file. Format may not be supported.'));
        }
      };

      fileReader.onerror = () => reject(new Error('Failed to read audio file'));
      fileReader.readAsArrayBuffer(file);
    });
  }, []);

  // Helper function to convert AudioBuffer to WAV
  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);

    // PCM data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  // Helper function to convert AudioBuffer to OGG using MediaRecorder
  const audioBufferToOgg = async (buffer: AudioBuffer, audioContext: AudioContext): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;

      const dest = audioContext.createMediaStreamDestination();
      source.connect(dest);

      const mediaRecorder = new MediaRecorder(dest.stream, {
        mimeType: 'audio/ogg;codecs=opus'
      });

      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg' });
        resolve(blob);
      };

      mediaRecorder.onerror = () => {
        reject(new Error('Failed to record OGG audio'));
      };

      mediaRecorder.start();
      source.start();
      
      // Stop recording when audio finishes
      setTimeout(() => {
        mediaRecorder.stop();
        source.stop();
      }, (buffer.duration * 1000) + 100);
    });
  };

  // Helper function to convert AudioBuffer to WebM using MediaRecorder
  const audioBufferToWebM = async (buffer: AudioBuffer, audioContext: AudioContext): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;

      const dest = audioContext.createMediaStreamDestination();
      source.connect(dest);

      const mediaRecorder = new MediaRecorder(dest.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        resolve(blob);
      };

      mediaRecorder.onerror = () => {
        reject(new Error('Failed to record audio'));
      };

      mediaRecorder.start();
      source.start();
      
      // Stop recording when audio finishes
      setTimeout(() => {
        mediaRecorder.stop();
        source.stop();
      }, (buffer.duration * 1000) + 100);
    });
  };

  const processJob = useCallback(async (jobId: string) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'processing' } : job
    ));

    try {
      const job = jobs.find(j => j.id === jobId);
      if (!job) throw new Error('Job not found');

      const result = await convertAudio(job.file, job.outputFormat);
      
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
  }, [jobs, convertAudio]);

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

  const previewAudio = useCallback((file: File) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.play().catch(() => {
      // Handle play error silently
    });
    
    // Clean up URL after a delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/converter" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Converter</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MC</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">MultiConverter</span>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Audio Converter
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Convert between various audio formats including WAV, WebM, OGG, and more
            </p>
          </div>

          {/* Upload Area */}
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
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Input formats: MP3, WAV, OGG, AAC, FLAC, M4A, WebM
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="audio/*,.mp3,.wav,.ogg,.flac,.aac,.m4a,.webm"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Format Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5">⚠️</div>
              <div>
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Audio Conversion Notice
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Currently supports conversion to WAV, WebM, and OGG formats. MP3 encoding requires additional libraries and will fallback to WAV format.
                  All processing happens in your browser - your files never leave your device.
                </p>
              </div>
            </div>
          </div>

          {/* Conversion Jobs */}
          {jobs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Conversion Queue
              </h3>
              
              {jobs.map((job) => (
                <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Music className="w-8 h-8 text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {job.file.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(job.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Preview Button */}
                      <button
                        onClick={() => previewAudio(job.file)}
                        className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
                        title="Preview audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      {/* Format Selector */}
                      <select
                        value={job.outputFormat}
                        onChange={(e) => updateJobFormat(job.id, e.target.value)}
                        disabled={job.status === 'processing'}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {SUPPORTED_FORMATS.output.map(format => {
                          const capabilities = getFormatCapabilities();
                          const isSupported = capabilities[format as keyof typeof capabilities];
                          const label = format.toUpperCase() + (format === 'mp3' ? ' (→WAV)' : !isSupported ? ' (Unsupported)' : '');
                          
                          return (
                            <option key={format} value={format} disabled={!isSupported && format !== 'mp3'}>
                              {label}
                            </option>
                          );
                        })}
                      </select>

                      {/* Action Buttons */}
                      {job.status === 'pending' && (
                        <button
                          onClick={() => processJob(job.id)}
                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
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
                        <div className="text-red-600 dark:text-red-400 text-sm max-w-xs">
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
      </main>
    </div>
  );
} 