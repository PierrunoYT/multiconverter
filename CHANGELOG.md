# Changelog

All notable changes to MultiConverter will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Recent Changes (2025-06-22)
- 🔧 **Build System Fixes** - Resolved all TypeScript and ESLint compilation errors
- ⚙️ **Next.js Configuration** - Updated to use `serverExternalPackages` instead of deprecated experimental option
- 🚀 **GitHub Actions** - Fixed workflow configuration to trigger on correct branch (master)
- 🧹 **Release Cleanup** - Removed all previous releases (v0.1.1, v0.1.2) for clean project state
- 📝 **Code Quality** - Fixed React Hook dependencies and removed unused variables

### Planned
- Audio conversion (MP3, WAV, OGG, FLAC, AAC, M4A)
- Video conversion (MP4, WebM, OGV, AVI, MOV)
- Archive handling (ZIP, TAR, GZ)
- Batch conversion presets
- Advanced accessibility features
- Unit and integration tests

## Development History

### Previous Development (Removed Releases)
The following releases were removed during project cleanup on 2025-06-22:

#### [0.1.2] - Previously Released (Removed)
- Multi-format support expansion beyond images
- Document conversion (TXT, CSV, JSON, HTML, CSS, JS, XML)
- Smart format detection and category-specific UI
- CSV ↔ JSON bidirectional conversion
- Text to HTML conversion

#### [0.1.1] - Previously Released (Removed)  
- GitHub Actions workflow fixes
- pnpm package manager integration
- Build process improvements
- CI/CD pipeline enhancements

---

## Current Features (In Development)

### Images ✅ Available
- **Input**: JPG, PNG, GIF, WebP, BMP, TIFF, SVG
- **Output**: JPG, PNG, WebP, GIF, BMP
- **Features**: Quality adjustment, format conversion, resize support

### Documents ✅ Available
- **Input**: TXT, CSV, JSON, HTML, CSS, JS, XML
- **Output**: TXT, CSV, JSON, HTML, CSS, JS, XML
- **Features**: CSV ↔ JSON conversion, Plain text to HTML, Format standardization

### Audio 🚧 Planned
- **Formats**: MP3, WAV, OGG, FLAC, AAC, M4A
- **Status**: Requires specialized audio processing libraries

### Video 🚧 Planned
- **Formats**: MP4, WebM, OGV, AVI, MOV
- **Status**: Requires specialized video processing libraries

### Archives 🚧 Planned
- **Formats**: ZIP, TAR, GZ, 7Z
- **Status**: Requires compression/decompression libraries

---

## Technical Notes

### Build System
- **Framework**: Next.js 15+ with TypeScript
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Static export for GitHub Pages, Vercel, Netlify

### Privacy & Security
- **Client-Side Processing**: All conversions happen in the browser
- **No Data Collection**: Files never leave the user's device
- **Open Source**: MIT licensed, fully auditable code
- **Offline Capable**: PWA functionality for offline use