import { FileText, X, Loader2, Download } from 'lucide-react';
import { ConversionJob, SUPPORTED_FORMATS } from '../../lib/document/types';

interface JobItemProps {
  job: ConversionJob;
  onProcess: (jobId: string) => void;
  onRemove: (jobId: string) => void;
  onUpdateFormat: (jobId: string, format: string) => void;
  onDownload: (job: ConversionJob) => void;
}

export default function JobItem({
  job,
  onProcess,
  onRemove,
  onUpdateFormat,
  onDownload
}: JobItemProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-green-500" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {job.file.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {(job.file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
        <button
          onClick={() => onRemove(job.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Convert to
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

        <div className="flex items-end space-x-2">
          {job.status === 'pending' && (
            <button
              onClick={() => onProcess(job.id)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Convert
            </button>
          )}

          {job.status === 'processing' && (
            <div className="flex items-center space-x-2 px-4 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Converting...</span>
            </div>
          )}

          {job.status === 'completed' && (
            <button
              onClick={() => onDownload(job)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          )}

          {job.status === 'error' && (
            <button
              onClick={() => onProcess(job.id)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>

      {job.status === 'error' && job.error && (
        <div className="mt-3 text-red-600 dark:text-red-400 text-sm">
          Error: {job.error}
        </div>
      )}
    </div>
  );
}