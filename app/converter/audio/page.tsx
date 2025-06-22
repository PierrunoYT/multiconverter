'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeft, Upload, Download, X, Music, Loader2, Volume2, Settings, Play, Pause, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface AudioQuality {
  bitrate: number;
  sampleRate: number;
  label: string;
}

interface ConversionJob {
  id: string;
  file: File;
  outputFormat: string;
  quality: AudioQuality;
  volume: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: Blob;
  error?: string;
}

const SUPPORTED_FORMATS = {
  input: [
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/aac', 
    'audio/flac', 'audio/webm', 'audio/x-m4a', 'audio/3gpp', 'audio/amr'
  ],
  output: ['mp3', 'wav', 'webm', 'ogg', 'aac']
};

const QUALITY_PRESETS: Record<string, AudioQuality[]> = {
  mp3: [
    { bitrate: 320, sampleRate: 44100, label: 'High (320 kbps)' },
    { bitrate: 192, sampleRate: 44100, label: 'Standard (192 kbps)' },
    { bitrate: 128, sampleRate: 44100, label: 'Good (128 kbps)' },
    { bitrate: 96, sampleRate: 44100, label: 'Medium (96 kbps)' },
    { bitrate: 64, sampleRate: 22050, label: 'Low (64 kbps)' }
  ],
  wav: [
    { bitrate: 1411, sampleRate: 44100, label: 'CD Quality (44.1 kHz)' },
    { bitrate: 2822, sampleRate: 88200, label: 'High (88.2 kHz)' },
    { bitrate: 3072, sampleRate: 96000, label: 'Studio (96 kHz)' }
  ],
  webm: [
    { bitrate: 128, sampleRate: 48000, label: 'Standard (128 kbps)' },
    { bitrate: 96, sampleRate: 48000, label: 'Good (96 kbps)' },
    { bitrate: 64, sampleRate: 48000, label: 'Medium (64 kbps)' }
  ],
  ogg: [
    { bitrate: 192, sampleRate: 44100, label: 'High (192 kbps)' },
    { bitrate: 128, sampleRate: 44100, label: 'Standard (128 kbps)' },
    { bitrate: 96, sampleRate: 44100, label: 'Good (96 kbps)' }
  ],
  aac: [
    { bitrate: 256, sampleRate: 44100, label: 'High (256 kbps)' },
    { bitrate: 128, sampleRate: 44100, label: 'Standard (128 kbps)' },
    { bitrate: 96, sampleRate: 44100, label: 'Good (96 kbps)' }
  ]
};

export default function AudioConverter() {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load lamejs dynamically
  const loadLameJS = useCallback(async () => {
    if (typeof window !== 'undefined') {
      try {
        const lamejs = await import('lamejs');
        return lamejs;
      } catch (error) {
        console.error('Failed to load lamejs:', error);
        return null;
      }
    }
    return null;
  }, []);

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
        file.name.match(/\.(mp3|wav|ogg|flac|aac|m4a|webm|3gp|amr)$/i)
      )
      .map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        outputFormat: 'mp3',
        quality: QUALITY_PRESETS.mp3[1], // Standard quality
        volume: 100,
        status: 'pending' as const,
        progress: 0
      }));

    setJobs(prev => [...prev, ...newJobs]);
  }, []);

  // Convert AudioBuffer to MP3 using lamejs
  const audioBufferToMp3 = useCallback(async (
    buffer: AudioBuffer, 
    quality: AudioQuality,
    onProgress?: (progress: number) => void
  ): Promise<Blob> => {
    const lamejs = await loadLameJS();
    if (!lamejs) {
      throw new Error('MP3 encoder not available');
    }

    const channels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const samples = buffer.length;
    const bitRate = quality.bitrate;

    // Initialize MP3 encoder
    const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, bitRate);
    const mp3Data: Int8Array[] = [];

    // Convert samples
    const blockSize = 1152; // Standard MP3 frame size
    const leftChannel = buffer.getChannelData(0);
    const rightChannel = channels > 1 ? buffer.getChannelData(1) : leftChannel;

    // Convert float samples to 16-bit PCM
    const left = new Int16Array(samples);
    const right = new Int16Array(samples);

    for (let i = 0; i < samples; i++) {
      left[i] = leftChannel[i] * 0x7FFF;
      right[i] = rightChannel[i] * 0x7FFF;
    }

    // Encode in blocks
    for (let i = 0; i < samples; i += blockSize) {
      const leftChunk = left.subarray(i, i + blockSize);
      const rightChunk = right.subarray(i, i + blockSize);
      
      const mp3buf = mp3encoder.encodeBuffer(leftChunk, channels > 1 ? rightChunk : leftChunk);
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
      
      if (onProgress) {
        onProgress((i / samples) * 90); // 90% for encoding, 10% for finalization
      }
    }

    // Finalize encoding
    const mp3buf = mp3encoder.flush();
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }

    if (onProgress) {
      onProgress(100);
    }

    return new Blob(mp3Data, { type: 'audio/mp3' });
  }, [loadLameJS]);

  // Convert AudioBuffer to WAV
  const audioBufferToWav = useCallback((
    buffer: AudioBuffer, 
    quality: AudioQuality
  ): Blob => {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = quality.sampleRate;
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
  }, []);

  // Convert using MediaRecorder for WebM/OGG
  const audioBufferToCompressed = useCallback(async (
    buffer: AudioBuffer, 
    audioContext: AudioContext, 
    mimeType: string,
    onProgress?: (progress: number) => void
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;

      const dest = audioContext.createMediaStreamDestination();
      source.connect(dest);

      const mediaRecorder = new MediaRecorder(dest.stream, { mimeType });
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        resolve(blob);
      };

      mediaRecorder.onerror = () => {
        reject(new Error(`Failed to record ${mimeType} audio`));
      };

      // Progress tracking
      let progressInterval: NodeJS.Timeout;
      if (onProgress) {
        let progress = 0;
        progressInterval = setInterval(() => {
          progress += 10;
          if (progress <= 90) {
            onProgress(progress);
          }
        }, (buffer.duration * 1000) / 10);
      }

      mediaRecorder.start();
      source.start();
      
      // Stop recording when audio finishes
      setTimeout(() => {
        mediaRecorder.stop();
        source.stop();
        if (progressInterval) {
          clearInterval(progressInterval);
        }
        if (onProgress) {
          onProgress(100);
        }
      }, (buffer.duration * 1000) + 100);
    });
  }, []);

  const convertAudio = useCallback(async (
    file: File, 
    outputFormat: string, 
    quality: AudioQuality,
    volume: number,
    onProgress?: (progress: number) => void
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const fileReader = new FileReader();

      fileReader.onload = async () => {
        try {
          if (onProgress) onProgress(10);
          
          const arrayBuffer = fileReader.result as ArrayBuffer;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          
          if (onProgress) onProgress(30);

          // Apply volume adjustment
          let processedBuffer = audioBuffer;
          if (volume !== 100) {
            const volumeMultiplier = volume / 100;
            const offlineContext = new OfflineAudioContext(
              audioBuffer.numberOfChannels,
              audioBuffer.length,
              audioBuffer.sampleRate
            );
            
            const source = offlineContext.createBufferSource();
            const gainNode = offlineContext.createGain();
            
            source.buffer = audioBuffer;
            gainNode.gain.value = volumeMultiplier;
            
            source.connect(gainNode);
            gainNode.connect(offlineContext.destination);
            
            source.start();
            processedBuffer = await offlineContext.startRendering();
          }

          if (onProgress) onProgress(50);
          
          switch (outputFormat) {
            case 'mp3':
              const mp3Blob = await audioBufferToMp3(processedBuffer, quality, (progress) => {
                if (onProgress) onProgress(50 + (progress * 0.5));
              });
              resolve(mp3Blob);
              break;
              
            case 'wav':
              const wavBlob = audioBufferToWav(processedBuffer, quality);
              if (onProgress) onProgress(100);
              resolve(wavBlob);
              break;
              
            case 'webm':
              if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                const webmBlob = await audioBufferToCompressed(
                  processedBuffer, 
                  audioContext, 
                  'audio/webm;codecs=opus',
                  (progress) => {
                    if (onProgress) onProgress(50 + (progress * 0.5));
                  }
                );
                resolve(webmBlob);
              } else {
                throw new Error('WebM format not supported in this browser');
              }
              break;
              
            case 'ogg':
              if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
                const oggBlob = await audioBufferToCompressed(
                  processedBuffer, 
                  audioContext, 
                  'audio/ogg;codecs=opus',
                  (progress) => {
                    if (onProgress) onProgress(50 + (progress * 0.5));
                  }
                );
                resolve(oggBlob);
              } else {
                throw new Error('OGG format not supported in this browser');
              }
              break;
              
            default:
              throw new Error(`Unsupported output format: ${outputFormat}`);
          }
        } catch (error) {
          reject(new Error(error instanceof Error ? error.message : 'Failed to decode audio file'));
        }
      };

      fileReader.onerror = () => reject(new Error('Failed to read audio file'));
      fileReader.readAsArrayBuffer(file);
    });
  }, [audioBufferToMp3, audioBufferToWav, audioBufferToCompressed]);

  const processJob = useCallback(async (jobId: string) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'processing', progress: 0 } : job
    ));

    try {
      const job = jobs.find(j => j.id === jobId);
      if (!job) throw new Error('Job not found');

      const result = await convertAudio(
        job.file, 
        job.outputFormat, 
        job.quality, 
        job.volume,
        (progress) => {
          setJobs(prev => prev.map(j =>
            j.id === jobId ? { ...j, progress } : j
          ));
        }
      );
      
      setJobs(prev => prev.map(j =>
        j.id === jobId ? { ...j, status: 'completed', result, progress: 100 } : j
      ));
    } catch (error) {
      setJobs(prev => prev.map(j =>
        j.id === jobId ? {
          ...j,
          status: 'error',
          progress: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        } : j
      ));
    }
  }, [jobs, convertAudio]);

  const processAllJobs = useCallback(async () => {
    setIsProcessingBatch(true);
    const pendingJobs = jobs.filter(job => job.status === 'pending');
    
    for (const job of pendingJobs) {
      await processJob(job.id);
    }
    
    setIsProcessingBatch(false);
  }, [jobs, processJob]);

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

  const downloadAllCompleted = useCallback(() => {
    const completedJobs = jobs.filter(job => job.status === 'completed' && job.result);
    completedJobs.forEach(job => downloadFile(job));
  }, [jobs, downloadFile]);

  const removeJob = useCallback((jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
  }, []);

  const clearCompleted = useCallback(() => {
    setJobs(prev => prev.filter(job => job.status !== 'completed'));
  }, []);

  const resetJob = useCallback((jobId: string) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'pending', progress: 0, error: undefined, result: undefined } : job
    ));
  }, []);

  const updateJobFormat = useCallback((jobId: string, format: string) => {
    const newQuality = QUALITY_PRESETS[format][0];
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { 
        ...job, 
        outputFormat: format, 
        quality: newQuality,
        status: 'pending',
        progress: 0,
        error: undefined,
        result: undefined
      } : job
    ));
  }, []);

  const updateJobQuality = useCallback((jobId: string, quality: AudioQuality) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { 
        ...job, 
        quality,
        status: 'pending',
        progress: 0,
        error: undefined,
        result: undefined
      } : job
    ));
  }, []);

  const updateJobVolume = useCallback((jobId: string, volume: number) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { 
        ...job, 
        volume,
        status: job.status === 'completed' ? 'pending' : job.status,
        progress: job.status === 'completed' ? 0 : job.progress,
        error: undefined,
        result: job.status === 'completed' ? undefined : job.result
      } : job
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

  const getCompletionStats = useCallback(() => {
    const completed = jobs.filter(job => job.status === 'completed').length;
    const total = jobs.length;
    const processing = jobs.filter(job => job.status === 'processing').length;
    return { completed, total, processing };
  }, [jobs]);

  const stats = getCompletionStats();

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
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Advanced Audio Converter
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Professional-grade audio conversion with quality control and batch processing
            </p>
          </div>

          {/* Stats Bar */}
          {jobs.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Total: </span>
                    <span className="font-medium text-gray-900 dark:text-white">{stats.total}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Processing: </span>
                    <span className="font-medium text-purple-600">{stats.processing}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Completed: </span>
                    <span className="font-medium text-green-600">{stats.completed}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1"
                  >
                    <Settings className="w-4 h-4" />
                    <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
                  </button>
                  {stats.completed > 0 && (
                    <button
                      onClick={downloadAllCompleted}
                      className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center space-x-1"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download All</span>
                    </button>
                  )}
                  {stats.completed > 0 && (
                    <button
                      onClick={clearCompleted}
                      className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
                    >
                      Clear Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

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

          {/* Batch Processing */}
          {jobs.some(job => job.status === 'pending') && (
            <div className="mb-6">
              <button
                onClick={processAllJobs}
                disabled={isProcessingBatch}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
              >
                {isProcessingBatch ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing All Files...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Convert All Pending ({jobs.filter(job => job.status === 'pending').length})</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Conversion Jobs */}
          {jobs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Conversion Queue
              </h3>
              
              {jobs.map((job) => (
                <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    {/* File Header */}
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

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => previewAudio(job.file)}
                          className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
                          title="Preview audio"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeJob(job.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {job.status === 'processing' && (
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    )}

                    {/* Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Format Selector */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Output Format
                        </label>
                        <select
                          value={job.outputFormat}
                          onChange={(e) => updateJobFormat(job.id, e.target.value)}
                          disabled={job.status === 'processing'}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          {SUPPORTED_FORMATS.output.map(format => (
                            <option key={format} value={format}>
                              {format.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quality Selector */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Quality
                        </label>
                        <select
                          value={QUALITY_PRESETS[job.outputFormat].findIndex(q => 
                            q.bitrate === job.quality.bitrate && q.sampleRate === job.quality.sampleRate
                          )}
                          onChange={(e) => updateJobQuality(job.id, QUALITY_PRESETS[job.outputFormat][parseInt(e.target.value)])}
                          disabled={job.status === 'processing'}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          {QUALITY_PRESETS[job.outputFormat].map((quality, index) => (
                            <option key={index} value={index}>
                              {quality.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Volume Control */}
                      {showAdvanced && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Volume: {job.volume}%
                          </label>
                          <input
                            type="range"
                            min="25"
                            max="200"
                            value={job.volume}
                            onChange={(e) => updateJobVolume(job.id, parseInt(e.target.value))}
                            disabled={job.status === 'processing'}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {job.status === 'pending' && (
                          <button
                            onClick={() => processJob(job.id)}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center space-x-2"
                          >
                            <Play className="w-4 h-4" />
                            <span>Convert</span>
                          </button>
                        )}

                        {job.status === 'processing' && (
                          <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Converting... {job.progress.toFixed(0)}%
                            </span>
                          </div>
                        )}

                        {job.status === 'completed' && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => downloadFile(job)}
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center space-x-2"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                            <button
                              onClick={() => resetJob(job.id)}
                              className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-purple-500 transition-colors"
                              title="Convert again"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {job.status === 'error' && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => resetJob(job.id)}
                              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors flex items-center space-x-2"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Retry</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {job.status === 'error' && (
                        <div className="text-red-600 dark:text-red-400 text-sm max-w-md text-right">
                          Error: {job.error}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Information Panel */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
              🎵 Advanced Audio Conversion Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300">
              <div>
                <h4 className="font-medium mb-2">Supported Formats:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>MP3:</strong> Real MP3 encoding with adjustable bitrates</li>
                  <li>• <strong>WAV:</strong> Lossless PCM audio with custom sample rates</li>
                  <li>• <strong>WebM/OGG:</strong> Modern compressed formats</li>
                  <li>• <strong>AAC:</strong> High-quality compression</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Advanced Features:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Volume adjustment (25% - 200%)</li>
                  <li>• Multiple quality presets per format</li>
                  <li>• Batch processing with progress tracking</li>
                  <li>• Client-side processing (privacy-first)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 