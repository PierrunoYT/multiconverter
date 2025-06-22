export default function InfoPanel() {
  return (
    <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
      <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
        🎵 Advanced Audio Conversion Features
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300">
        <div>
          <h4 className="font-medium mb-2">Supported Formats:</h4>
          <ul className="space-y-1 text-xs">
            <li>• <strong>MP3:</strong> Real MP3 encoding with adjustable bitrates</li>
            <li>• <strong>WAV:</strong> Lossless PCM audio with custom sample rates</li>
            <li>• <strong>WebM/OGG:</strong> Modern compressed formats</li>
            <li>• <strong>AAC:</strong> High-quality compression with MP4/AAC encoding</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Advanced Features:</h4>
          <ul className="space-y-1 text-xs">
            <li>• Volume adjustment (25% - 200%)</li>
            <li>• Multiple quality presets per format</li>
            <li>• Batch processing with progress tracking</li>
            <li>• Client-side processing (privacy-first)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}