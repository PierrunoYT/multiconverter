import { ArrowRight, Upload, Download, Shield, Zap, FileText, Image, Music, Video, Archive, Code } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MC</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">MultiConverter</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Features</a>
            <a href="#formats" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Formats</a>
            <Link href="/converter" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Converter</Link>
            <a href="https://github.com/PierrunoYT/multiconverter" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
              GitHub
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Convert Any File
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Instantly</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Transform your files between multiple formats with our free, open-source, and offline-capable conversion tool.
            Everything runs in your browser - no uploads, no tracking, completely private.
          </p>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/converter" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg">
              <Upload className="w-5 h-5" />
              Start Converting
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="https://github.com/PierrunoYT/multiconverter" target="_blank" rel="noopener noreferrer" className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose MultiConverter?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with modern technology to provide the fastest, most secure file conversion experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Convert files in seconds with our optimized processing engine. No waiting, no delays.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">100% Private</h3>
              <p className="text-gray-600 dark:text-gray-300">
                All processing happens in your browser. Your files never leave your device - complete privacy guaranteed.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Open Source & Free</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Completely free and open source. Works offline in your browser with no limitations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Formats */}
      <section id="formats" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Multiple Supported Formats</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Convert between popular file formats. From images to documents, with more formats being added regularly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Image className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Images</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['JPG', 'PNG', 'GIF', 'WebP', 'SVG', 'BMP', 'TIFF', 'ICO'].map((format) => (
                  <span key={format} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                    {format}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <FileText className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Documents</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['PDF', 'DOC', 'DOCX', 'TXT', 'RTF', 'ODT', 'XLS', 'XLSX'].map((format) => (
                  <span key={format} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm">
                    {format}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Music className="w-8 h-8 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Audio</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['MP3', 'WAV', 'FLAC', 'AAC', 'OGG', 'M4A', 'WMA', 'AIFF'].map((format) => (
                  <span key={format} className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-sm">
                    {format}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Video className="w-8 h-8 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Video</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['MP4', 'AVI', 'MOV', 'MKV', 'WMV', 'FLV', 'WebM', 'M4V'].map((format) => (
                  <span key={format} className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded text-sm">
                    {format}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Archive className="w-8 h-8 text-orange-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Archives</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['ZIP', 'RAR', '7Z', 'TAR', 'GZ', 'BZ2', 'XZ', 'CAB'].map((format) => (
                  <span key={format} className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-sm">
                    {format}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <Code className="w-8 h-8 text-indigo-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Code & Data</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['JSON', 'XML', 'CSV', 'YAML', 'SQL', 'HTML', 'CSS', 'JS'].map((format) => (
                  <span key={format} className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded text-sm">
                    {format}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MC</span>
                </div>
                <span className="text-xl font-bold">MultiConverter</span>
              </div>
              <p className="text-gray-400">
                The fastest and most secure file conversion tool on the web.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Project</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><Link href="/converter" className="hover:text-white transition-colors">Converter</Link></li>
                <li><a href="https://github.com/PierrunoYT/multiconverter" className="hover:text-white transition-colors">Source Code</a></li>
                <li><a href="https://github.com/PierrunoYT/multiconverter/releases" className="hover:text-white transition-colors">Releases</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://github.com/PierrunoYT/multiconverter/wiki" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="https://github.com/PierrunoYT/multiconverter/discussions" className="hover:text-white transition-colors">Discussions</a></li>
                <li><a href="https://github.com/PierrunoYT/multiconverter/issues" className="hover:text-white transition-colors">Issues</a></li>
                <li><a href="https://github.com/PierrunoYT/multiconverter/blob/main/CONTRIBUTING.md" className="hover:text-white transition-colors">Contributing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://github.com/PierrunoYT/multiconverter/blob/main/README.md" className="hover:text-white transition-colors">About</a></li>
                <li><a href="https://github.com/PierrunoYT/multiconverter/blob/main/LICENSE" className="hover:text-white transition-colors">License</a></li>
                <li><a href="https://github.com/PierrunoYT/multiconverter/blob/main/PRIVACY.md" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="https://github.com/PierrunoYT/multiconverter/security" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MultiConverter. Open source under MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
