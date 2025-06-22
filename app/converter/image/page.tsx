'use client';

import { ArrowLeft, FileImage } from 'lucide-react';
import Link from 'next/link';
import { useImageJobs } from '../../../lib/image/hooks';
import UploadArea from '../../../components/image/UploadArea';
import JobItem from '../../../components/image/JobItem';

export default function ImageConverter() {
  const {
    jobs,
    handleFiles,
    processJob,
    removeJob,
    updateJobFormat,
    downloadJobFile
  } = useImageJobs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileImage className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Image Converter
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Convert between JPEG, PNG, WebP, GIF, BMP, and other image formats
            </p>
          </div>

          {/* Upload Area */}
          <UploadArea onFilesSelected={handleFiles} />

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
                  onProcess={processJob}
                  onRemove={removeJob}
                  onUpdateFormat={updateJobFormat}
                  onDownload={downloadJobFile}
                />
              ))}
            </div>
          )}

          {/* Information Panel */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
              🖼️ Image Conversion Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300">
              <div>
                <h4 className="font-medium mb-2">Supported Formats:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>JPEG:</strong> Compressed format for photos</li>
                  <li>• <strong>PNG:</strong> Lossless with transparency support</li>
                  <li>• <strong>WebP:</strong> Modern web-optimized format</li>
                  <li>• <strong>GIF:</strong> Animated and static images</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• High-quality conversion</li>
                  <li>• Batch processing support</li>
                  <li>• Preserves image dimensions</li>
                  <li>• Client-side processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}