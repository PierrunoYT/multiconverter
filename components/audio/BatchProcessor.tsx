import { Play, Loader2 } from 'lucide-react';

interface BatchProcessorProps {
  pendingCount: number;
  isProcessing: boolean;
  onProcessAll: () => void;
}

export default function BatchProcessor({
  pendingCount,
  isProcessing,
  onProcessAll
}: BatchProcessorProps) {
  if (pendingCount === 0) return null;

  return (
    <div className="mb-6">
      <button
        onClick={onProcessAll}
        disabled={isProcessing}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing All Files...</span>
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            <span>Convert All Pending ({pendingCount})</span>
          </>
        )}
      </button>
    </div>
  );
}