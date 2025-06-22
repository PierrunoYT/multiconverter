'use client';

import { useState } from 'react';
import { ArrowLeft, Music } from 'lucide-react';
import Link from 'next/link';
import { useAudioJobs } from '../../../lib/audio/hooks';
import UploadArea from '../../../components/audio/UploadArea';
import StatsBar from '../../../components/audio/StatsBar';
import BatchProcessor from '../../../components/audio/BatchProcessor';
import JobItem from '../../../components/audio/JobItem';
import InfoPanel from '../../../components/audio/InfoPanel';

export default function AudioConverter() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const {
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
  } = useAudioJobs();

  const stats = getCompletionStats();
  const pendingJobs = jobs.filter(job => job.status === 'pending');

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
            <StatsBar
              stats={stats}
              showAdvanced={showAdvanced}
              onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
              onDownloadAll={downloadAllCompleted}
              onClearCompleted={clearCompleted}
            />
          )}

          {/* Upload Area */}
          <UploadArea onFilesSelected={handleFiles} />

          {/* Batch Processing */}
          <BatchProcessor
            pendingCount={pendingJobs.length}
            isProcessing={isProcessingBatch}
            onProcessAll={processAllJobs}
          />

          {/* Conversion Jobs */}
          {jobs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Conversion Queue
              </h3>
              
              {jobs.map((job) => (
                <JobItem
                  key={job.id}
                  job={job}
                  showAdvanced={showAdvanced}
                  onProcess={processJob}
                  onRemove={removeJob}
                  onReset={resetJob}
                  onUpdateFormat={updateJobFormat}
                  onUpdateQuality={updateJobQuality}
                  onUpdateVolume={updateJobVolume}
                />
              ))}
            </div>
          )}

          {/* Information Panel */}
          <InfoPanel />
        </div>
      </main>
    </div>
  );
}