import { ArrowLeft, Image, FileText, Music, Video, Archive, Code } from "lucide-react";
import Link from "next/link";

const conversionTypes = [
  {
    id: 'image',
    title: 'Image Converter',
    description: 'Convert between JPG, PNG, WebP, GIF, BMP, TIFF, SVG',
    icon: Image,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    formats: ['JPG', 'PNG', 'WebP', 'GIF', 'BMP', 'TIFF', 'SVG']
  },
  {
    id: 'document',
    title: 'Document Converter',
    description: 'Convert between TXT, CSV, JSON, HTML, CSS, JS, XML',
    icon: FileText,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    formats: ['TXT', 'CSV', 'JSON', 'HTML', 'CSS', 'JS', 'XML']
  },
  {
    id: 'audio',
    title: 'Audio Converter',
    description: 'Convert between MP3, WAV, FLAC, AAC, OGG, M4A',
    icon: Music,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800',
    formats: ['MP3', 'WAV', 'FLAC', 'AAC', 'OGG', 'M4A'],
    comingSoon: true
  },
  {
    id: 'video',
    title: 'Video Converter',
    description: 'Convert between MP4, AVI, MOV, MKV, WebM, FLV',
    icon: Video,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    formats: ['MP4', 'AVI', 'MOV', 'MKV', 'WebM', 'FLV'],
    comingSoon: true
  },
  {
    id: 'archive',
    title: 'Archive Converter',
    description: 'Convert between ZIP, RAR, 7Z, TAR, GZ, BZ2',
    icon: Archive,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    formats: ['ZIP', 'RAR', '7Z', 'TAR', 'GZ', 'BZ2'],
    comingSoon: true
  },
  {
    id: 'code',
    title: 'Code & Data Converter',
    description: 'Convert between JSON, XML, CSV, YAML, SQL formats',
    icon: Code,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    formats: ['JSON', 'XML', 'CSV', 'YAML', 'SQL']
  }
];

export default function ConverterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
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
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Conversion Type
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select the type of file you want to convert. All conversions happen in your browser - completely private and secure.
          </p>
        </div>

        {/* Conversion Type Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {conversionTypes.map((type) => {
            const IconComponent = type.icon;
            const isClickable = !type.comingSoon;
            
            return (
              <div key={type.id} className="relative">
                {isClickable ? (
                  <Link href={`/converter/${type.id}`}>
                    <div className={`${type.bgColor} ${type.borderColor} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105`}>
                      <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                        {type.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                        {type.description}
                      </p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {type.formats.slice(0, 4).map((format) => (
                          <span key={format} className={`bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs border ${type.borderColor}`}>
                            {format}
                          </span>
                        ))}
                        {type.formats.length > 4 && (
                          <span className={`bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs border ${type.borderColor}`}>
                            +{type.formats.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className={`${type.bgColor} ${type.borderColor} border-2 rounded-xl p-6 opacity-60 cursor-not-allowed relative`}>
                    <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                      {type.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                      {type.description}
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {type.formats.slice(0, 4).map((format) => (
                        <span key={format} className={`bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs border ${type.borderColor}`}>
                          {format}
                        </span>
                      ))}
                      {type.formats.length > 4 && (
                        <span className={`bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs border ${type.borderColor}`}>
                          +{type.formats.length - 4} more
                        </span>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      Coming Soon
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose MultiConverter?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">100% Private</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  All processing happens in your browser. Your files never leave your device.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Convert files in seconds with our optimized processing engine.
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🆓</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Completely Free</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Open source and free forever. No limits, no subscriptions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}