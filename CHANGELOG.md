# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2025-06-22

### Added
- Multi-format file conversion support beyond images
- Document conversion capabilities (TXT, CSV, JSON, HTML, CSS, JS, XML)
- Bidirectional CSV ↔ JSON conversion with smart parsing
- Plain text to HTML conversion with proper formatting
- Category-specific file icons for different file types
- Dynamic format selection based on automatic file detection
- Modular conversion system supporting extensible file types
- Automatic file category detection and validation

### Changed
- Enhanced user experience with improved file information display
- Better error handling for unsupported formats
- Updated all documentation to reflect current project state
- Migrated from npm to pnpm for package management
- Updated GitHub Actions workflows for better reliability
- Corrected branch configuration from main to master

### Fixed
- Resolved Next.js configuration deprecation warnings
- Fixed TypeScript compilation errors and type issues
- Corrected ESLint React Hook dependency warnings
- Fixed GitHub Actions workflow pnpm setup and caching issues
- Resolved build errors and improved CI/CD pipeline reliability
- Fixed duplicate file upload areas in hero section

### Documentation
- Comprehensive update to all markdown files post-cleanup
- Enhanced README with detailed format support information
- Updated CONTRIBUTING guide with pnpm usage
- Refreshed PROJECT_STRUCTURE documentation
- Updated DEPLOYMENT guide with current CI/CD details
- Revised PRIVACY policy timestamp and status

### Technical Improvements
- Strict TypeScript configuration with proper type checking
- ESLint configuration for code quality
- PWA functionality with offline support
- Service Worker implementation for caching
- Static site generation for optimal performance
- GitHub Pages deployment configuration

## Development History

### Previous Development (Removed Releases)
The following releases were created during development but have been removed to maintain a clean project history:

#### v0.1.2 (Removed)
- Multi-format file conversion support
- GitHub Actions workflow fixes
- Enhanced documentation

#### v0.1.1 (Removed) 
- GitHub Actions workflow improvements
- Package manager migration to pnpm
- CI/CD pipeline fixes

#### v0.1.0 (Removed)
- Initial open source release
- Basic image conversion functionality
- Privacy-first design implementation

### Project Foundation - 2025-06-22
- **fcdd8bc** - docs: update all markdown files after release cleanup
- **80cc48d** - fix: update GitHub Actions workflow to trigger on master branch  
- **afd2836** - fix: resolve build errors and update Next.js config
- **05efc2e** - fix: complete pnpm workflow consistency
- **b0c0baa** - feat: expand file format support beyond images
- **8e464bf** - fix: remove --frozen-lockfile flag from GitHub Actions workflows
- **7ba1fc4** - fix: correct pnpm setup order in GitHub Actions workflows
- **405f870** - fix: update GitHub Actions workflows to use pnpm instead of npm
- **1e6b86e** - fix: update repository URLs to correct GitHub repository
- **dae0472** - feat: add release automation and changelog
- **426c168** - docs: update documentation to reflect UI improvements
- **c0431bc** - fix: remove duplicate file upload areas from hero section
- **0160c22** - feat: transform MultiConverter into open-source offline file converter
- **81b1da8** - Initial commit: MultiConverter landing page

## Current Status

**Project State**: Stable development version with clean documentation and working CI/CD pipelines.

**Key Features**:
- Privacy-first client-side file conversion
- Multi-format support (Images, Documents)
- Offline PWA functionality
- Modern responsive UI with dark mode
- Zero data collection or tracking

**Planned Features**:
- Audio format conversion (requires specialized libraries)
- Video format conversion (requires specialized libraries)  
- Archive format support (ZIP, TAR, etc.)
- Advanced image editing capabilities
- Batch processing improvements

---

*This changelog reflects the current stable state following project cleanup on June 22, 2025. All previous releases have been removed to maintain a clean development history.*