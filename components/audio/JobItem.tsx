import { Music, Volume2, X, Play, Loader2, Download, RotateCcw } from 'lucide-react';
import { ConversionJob, SUPPORTED_FORMATS, QUALITY_PRESETS, AudioQuality } from '../../lib/audio/types';
import { previewAudio, downloadFile } from '../../lib/audio/engine';

interface JobItemProps {
  job: ConversionJob;
  showAdvanced: boolean;
  onProcess: (jobId: string) => void;
  onRemove: (jobId: string) => void;
  onReset: (jobId: string) => void;
  onUpdateFormat: (jobId: string, format: string) => void;
  onUpdateQuality: (jobId: string, quality: AudioQuality) => void;
  onUpdateVolume: (jobId: string, volume: number) => void;
}

export default function JobItem({
  job,
  showAdvanced,
  onProcess,
  onRemove,
  onReset,
  onUpdateFormat,
  onUpdateQuality,
  onUpdateVolume
}: JobItemProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
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
              onClick={() => onRemove(job.id)}
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
              onChange={(e) => onUpdateFormat(job.id, e.target.value)}
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
              onChange={(e) => onUpdateQuality(job.id, QUALITY_PRESETS[job.outputFormat][parseInt(e.target.value)])}
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
                onChange={(e) => onUpdateVolume(job.id, parseInt(e.target.value))}
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
                onClick={() => onProcess(job.id)}
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
                  onClick={() => onReset(job.id)}
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
                  onClick={() => onReset(job.id)}
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
  );
}