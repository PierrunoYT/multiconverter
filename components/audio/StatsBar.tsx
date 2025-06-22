import { Settings, Download } from 'lucide-react';

interface StatsBarProps {
  stats: {
    total: number;
    processing: number;
    completed: number;
  };
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  onDownloadAll: () => void;
  onClearCompleted: () => void;
}

export default function StatsBar({
  stats,
  showAdvanced,
  onToggleAdvanced,
  onDownloadAll,
  onClearCompleted
}: StatsBarProps) {
  return (
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
            onClick={onToggleAdvanced}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1"
          >
            <Settings className="w-4 h-4" />
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
          </button>
          {stats.completed > 0 && (
            <button
              onClick={onDownloadAll}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>Download All</span>
            </button>
          )}
          {stats.completed > 0 && (
            <button
              onClick={onClearCompleted}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
            >
              Clear Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}