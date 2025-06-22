import { useState, useCallback } from 'react';
import { ConversionJob, SUPPORTED_FORMATS, QUALITY_PRESETS } from './types';
import { convertAudio, downloadFile } from './engine';

export const useAudioJobs = () => {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);

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
  }, [jobs]);

  const processAllJobs = useCallback(async () => {
    setIsProcessingBatch(true);
    const pendingJobs = jobs.filter(job => job.status === 'pending');
    
    for (const job of pendingJobs) {
      await processJob(job.id);
    }
    
    setIsProcessingBatch(false);
  }, [jobs, processJob]);

  const downloadAllCompleted = useCallback(() => {
    const completedJobs = jobs.filter(job => job.status === 'completed' && job.result);
    completedJobs.forEach(job => downloadFile(job));
  }, [jobs]);

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

  const updateJobQuality = useCallback((jobId: string, quality: any) => {
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

  const getCompletionStats = useCallback(() => {
    const completed = jobs.filter(job => job.status === 'completed').length;
    const total = jobs.length;
    const processing = jobs.filter(job => job.status === 'processing').length;
    return { completed, total, processing };
  }, [jobs]);

  return {
    jobs,
    isProcessingBatch,
    handleFiles,
    processJob,
    processAllJobs,
    downloadAllCompleted,
    removeJob,
    clearCompleted,
    resetJob,
    updateJobFormat,
    updateJobQuality,
    updateJobVolume,
    getCompletionStats
  };
};