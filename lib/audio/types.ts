export interface AudioQuality {
  bitrate: number;
  sampleRate: number;
  label: string;
}

export interface ConversionJob {
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

export const SUPPORTED_FORMATS = {
  input: [
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/aac', 
    'audio/flac', 'audio/webm', 'audio/x-m4a', 'audio/3gpp', 'audio/amr'
  ],
  output: ['mp3', 'wav', 'webm', 'ogg', 'aac']
};

export const QUALITY_PRESETS: Record<string, AudioQuality[]> = {
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