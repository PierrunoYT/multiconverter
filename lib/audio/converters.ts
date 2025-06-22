import { AudioQuality } from './types';

// Load lamejs dynamically
export const loadLameJS = async () => {
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
};

// Convert AudioBuffer to MP3 using lamejs
export const audioBufferToMp3 = async (
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
};

// Convert AudioBuffer to WAV
export const audioBufferToWav = (
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
};

// Convert using MediaRecorder for WebM/OGG/AAC
export const audioBufferToCompressed = async (
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
};