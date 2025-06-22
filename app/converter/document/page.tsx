'use client';

import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { useDocumentJobs } from '../../../lib/document/hooks';
import UploadArea from '../../../components/document/UploadArea';
import JobItem from '../../../components/document/JobItem';

export default function DocumentConverter() {
  const {
    jobs,
    handleFiles,
    processJob,
    removeJob,
    updateJobFormat,
    downloadJobFile
  } = useDocumentJobs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Document Converter
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Convert between TXT, CSV, JSON, HTML, CSS, JS, and XML formats
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
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-200 mb-3">
              📄 Document Conversion Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800 dark:text-green-300">
              <div>
                <h4 className="font-medium mb-2">Supported Formats:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>TXT:</strong> Plain text documents</li>
                  <li>• <strong>CSV:</strong> Comma-separated values</li>
                  <li>• <strong>JSON:</strong> JavaScript Object Notation</li>
                  <li>• <strong>HTML/CSS/JS:</strong> Web documents</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Features:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Smart format detection</li>
                  <li>• Content structure preservation</li>
                  <li>• Encoding support</li>
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