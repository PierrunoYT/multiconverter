import { AudioQuality } from './types';
import { audioBufferToMp3, audioBufferToWav, audioBufferToCompressed } from './converters';

export const convertAudio = async (
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
            
          case 'aac':
            if (MediaRecorder.isTypeSupported('audio/mp4;codecs=mp4a.40.2')) {
              const aacBlob = await audioBufferToCompressed(
                processedBuffer, 
                audioContext, 
                'audio/mp4;codecs=mp4a.40.2',
                (progress) => {
                  if (onProgress) onProgress(50 + (progress * 0.5));
                }
              );
              resolve(aacBlob);
            } else if (MediaRecorder.isTypeSupported('audio/aac')) {
              const aacBlob = await audioBufferToCompressed(
                processedBuffer, 
                audioContext, 
                'audio/aac',
                (progress) => {
                  if (onProgress) onProgress(50 + (progress * 0.5));
                }
              );
              resolve(aacBlob);
            } else {
              throw new Error('AAC format not supported in this browser');
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
};

export const previewAudio = (file: File) => {
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
};

export const downloadFile = (job: { file: File; result?: Blob; outputFormat: string }) => {
  if (!job.result) return;

  const url = URL.createObjectURL(job.result);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${job.file.name.split('.')[0]}.${job.outputFormat}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};