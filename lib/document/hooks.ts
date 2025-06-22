import { useState, useCallback } from 'react';
import { ConversionJob, SUPPORTED_FORMATS } from './types';
import { convertDocument, downloadFile } from './converters';

export const useDocumentJobs = () => {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);

  const handleFiles = useCallback((files: File[]) => {
    const newJobs: ConversionJob[] = files
      .filter(file => 
        SUPPORTED_FORMATS.input.includes(file.type) || 
        file.name.match(/\.(txt|csv|json|html|css|js|xml)$/i)
      )
      .map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        outputFormat: 'txt',
        status: 'pending' as const
      }));

    setJobs(prev => [...prev, ...newJobs]);
  }, []);

  const processJob = useCallback(async (jobId: string) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: 'processing' } : job
    ));

    try {
      const job = jobs.find(j => j.id === jobId);
      if (!job) throw new Error('Job not found');

      const result = await convertDocument(job.file, job.outputFormat);
      
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
  }, [jobs]);

  const removeJob = useCallback((jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
  }, []);

  const updateJobFormat = useCallback((jobId: string, format: string) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, outputFormat: format, status: 'pending', result: undefined, error: undefined } : job
    ));
  }, []);

  const downloadJobFile = useCallback((job: ConversionJob) => {
    downloadFile(job);
  }, []);

  return {
    jobs,
    handleFiles,
    processJob,
    removeJob,
    updateJobFormat,
    downloadJobFile
  };
};