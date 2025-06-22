# Changelog

All notable changes to MultiConverter will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Audio conversion (MP3, WAV, OGG, FLAC, AAC, M4A)
- Video conversion (MP4, WebM, OGG, AVI, MOV)
- Archive handling (ZIP, TAR, GZ)
- Batch conversion presets
- Advanced accessibility features
- Unit and integration tests

## [0.1.2] - 2025-01-22

### Added
- 🚀 **Multi-Format Support** - Expanded beyond images to support multiple file categories
- 📄 **Document Conversion** - Added support for TXT, CSV, JSON, HTML, CSS, JS, XML formats
- 🔄 **Smart Format Detection** - Automatic file category detection and format suggestions
- 🎨 **Enhanced UI** - Category-specific icons and improved file type display
- 🔧 **CSV ↔ JSON Conversion** - Bidirectional conversion between CSV and JSON formats
- 📝 **Text to HTML** - Convert plain text files to formatted HTML documents

### Improved
- **File Processing** - Modular conversion system supporting multiple file types
- **User Experience** - Clear format categorization and conversion status
- **Error Handling** - Better error messages for unsupported conversions
- **Documentation** - Updated README with comprehensive format support details

### Technical
- Refactored FileConverter component with category-based processing
- Added specialized conversion functions for different file types
- Implemented dynamic format selection based on file category
- Enhanced file type detection and validation

## [0.1.1] - 2025-01-22

### Fixed
- 🔧 **GitHub Actions Workflows** - Fixed CI/CD pipelines to use pnpm instead of npm
- 🚀 **Release Automation** - Corrected package manager configuration for automated releases
- 📦 **Build Process** - Ensured reproducible builds with proper lockfile handling

### Technical Improvements
- Updated deploy.yml workflow with pnpm setup and caching
- Fixed release.yml workflow for proper dependency management
- Added pnpm/action-setup for consistent pnpm installation
- Improved audit commands for pnpm compatibility
- Enhanced workflow reliability and build performance

## [0.1.0] - 2025-01-22

### Added
- 🎉 **Initial Release** - Complete open source file conversion tool
- 🔒 **Privacy-First Design** - All processing happens client-side
- ⚡ **Image Conversion** - Support for JPG, PNG, WebP, GIF formats
- 📱 **PWA Support** - Installable web app with offline functionality
- 🎨 **Modern UI** - Clean interface with drag & drop file upload
- 🌙 **Dark Mode** - Full dark/light theme support
- 📊 **Conversion Queue** - Handle multiple files simultaneously
- 📥 **Download System** - Easy download of converted files
- 🔧 **Open Source** - MIT licensed with comprehensive documentation

### Technical Features
- **Next.js 15** with App Router and React 19
- **TypeScript** for type safety and better development
- **Tailwind CSS** for modern, responsive styling
- **Service Worker** for offline functionality
- **Static Export** for serverless deployment
- **GitHub Actions** for automated CI/CD

### Documentation
- 📚 **Comprehensive README** with setup and usage instructions
- 🤝 **Contributing Guide** with development workflow
- 🔒 **Privacy Policy** detailing data handling practices
- 🚀 **Deployment Guide** for multiple hosting options
- 📁 **Project Structure** documentation for contributors
- 📋 **Task Tracking** with progress monitoring

### Security & Privacy
- ✅ **No Data Collection** - Zero tracking or analytics
- ✅ **No External APIs** - Complete independence from third parties
- ✅ **Client-Side Processing** - Files never leave user's device
- ✅ **Offline Capable** - Works without internet connection
- ✅ **Open Source** - Transparent and auditable code

### Supported Formats
#### Images
- **Input**: JPG, PNG, GIF, WebP, BMP
- **Output**: JPG, PNG, WebP, GIF

### Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Deployment Options
- ✅ GitHub Pages
- ✅ Vercel
- ✅ Netlify
- ✅ Self-hosted static servers

---

## Release Notes Format

### Types of Changes
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

### Emoji Guide
- 🎉 Major releases and milestones
- ✨ New features
- 🔒 Security and privacy improvements
- ⚡ Performance improvements
- 🐛 Bug fixes
- 📚 Documentation updates
- 🔧 Technical improvements
- 🎨 UI/UX improvements
- 📱 Mobile and responsive updates
- 🌙 Theme and accessibility updates

---

**Note**: This project follows semantic versioning. Version numbers are structured as MAJOR.MINOR.PATCH where:
- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality in a backwards compatible manner
- **PATCH**: Backwards compatible bug fixes