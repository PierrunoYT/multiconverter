# MultiConverter Project Structure

This document provides a comprehensive overview of the MultiConverter project structure, explaining the purpose and organization of all files and directories.

> **Updated (June 22, 2025)**: Following recent cleanup and build fixes, the project structure reflects the current stable state with clean documentation and working CI/CD pipelines.

## 📁 Root Directory Structure

```
multiconverter/
├── .github/                    # GitHub-specific configurations
│   └── workflows/
│       ├── deploy.yml         # GitHub Actions CI/CD pipeline
│       └── release.yml        # Release automation workflow (currently unused)
├── CHANGELOG.md               # Version history and release notes
├── app/                       # Next.js App Router directory
│   ├── favicon.ico           # Website favicon
│   ├── globals.css           # Global CSS styles
│   ├── layout.tsx            # Root layout component with PWA setup
│   └── page.tsx              # Home page component
├── components/               # Reusable React components
│   └── FileConverter.tsx     # Multi-format file conversion component
├── lib/                      # Utility functions and libraries
│   └── utils.ts              # Utility functions (Tailwind merge, etc.)
├── public/                   # Static assets served directly
│   ├── file.svg              # File icon
│   ├── globe.svg             # Globe icon
│   ├── manifest.json         # PWA manifest for installable app
│   ├── next.svg              # Next.js logo
│   ├── sw.js                 # Service Worker for offline functionality
│   ├── vercel.svg            # Vercel logo
│   └── window.svg            # Window icon
├── .gitignore                # Git ignore rules
├── components.json           # Shadcn/ui component configuration
├── CONTRIBUTING.md           # Contributor guidelines and workflow
├── DEPLOYMENT.md             # Deployment instructions and options
├── eslint.config.mjs         # ESLint configuration for code quality
├── LICENSE                   # MIT license file
├── next.config.ts            # Next.js configuration (static export)
├── package.json              # Project dependencies and scripts
├── pnpm-lock.yaml           # Package manager lock file
├── postcss.config.mjs        # PostCSS configuration for Tailwind
├── PRIVACY.md                # Privacy policy and data handling
├── PROJECT_STRUCTURE.md      # This file - project organization guide
├── PROJECT_TASKS.md          # Task tracking and project status
├── README.md                 # Main project documentation
└── tsconfig.json             # TypeScript configuration
```

## 📂 Detailed Directory Breakdown

### `.github/workflows/`
Contains GitHub Actions workflows for automation:
- **`deploy.yml`** - Automated testing, building, and deployment pipeline (uses pnpm)
- **`release.yml`** - Release automation workflow (currently unused after cleanup)

### `CHANGELOG.md`
Version history and release documentation:
- Documents all changes, fixes, and improvements
- Follows semantic versioning principles
- Updated after release cleanup to reflect current stable state

### `app/` (Next.js App Router)
The main application directory using Next.js 15 App Router:

#### Core Files:
- **`layout.tsx`** - Root layout component that wraps all pages
  - Sets up PWA metadata and manifest
  - Registers service worker for offline functionality
  - Configures fonts and global styling
  - Includes SEO and social media meta tags

- **`page.tsx`** - Home page component
  - Landing page with hero section
  - Features showcase
  - Supported formats display
  - Integrated file converter
  - Footer with community links

- **`globals.css`** - Global CSS styles
  - Tailwind CSS imports
  - Custom CSS variables
  - Global styling overrides

- **`favicon.ico`** - Website favicon

### `components/`
Reusable React components:

- **`FileConverter.tsx`** - Main conversion component
  - Drag & drop file upload interface
  - File type validation and filtering
  - Conversion queue management
  - Progress tracking and error handling
  - Download functionality for converted files
  - Support for multiple image formats (JPG, PNG, WebP, GIF)

### `lib/`
Utility functions and shared libraries:

- **`utils.ts`** - Common utility functions
  - Tailwind CSS class merging utilities
  - Helper functions for component styling

### `public/`
Static assets served directly by the web server:

#### PWA Files:
- **`manifest.json`** - Web App Manifest
  - App metadata for installation
  - Icon definitions and sizes
  - Display preferences and theme colors
  - PWA capabilities configuration

- **`sw.js`** - Service Worker
  - Offline functionality implementation
  - Cache management for static assets
  - Background sync capabilities

#### Icons and Assets:
- **`file.svg`** - Generic file icon
- **`globe.svg`** - Globe/web icon
- **`next.svg`** - Next.js logo
- **`vercel.svg`** - Vercel deployment logo
- **`window.svg`** - Window/app icon

## 📋 Configuration Files

### Build and Development:
- **`next.config.ts`** - Next.js configuration
  - Static export settings for serverless deployment
  - Image optimization configuration
  - Build output customization

- **`tsconfig.json`** - TypeScript configuration
  - Strict type checking enabled
  - Path aliases for clean imports
  - Modern JavaScript target settings

- **`eslint.config.mjs`** - ESLint configuration
  - Code quality rules
  - Next.js specific linting
  - TypeScript integration

- **`postcss.config.mjs`** - PostCSS configuration
  - Tailwind CSS processing
  - CSS optimization settings

### Package Management:
- **`package.json`** - Project metadata and dependencies
  - Scripts for development, building, and deployment
  - Dependencies for React, Next.js, Tailwind CSS
  - Open source project metadata

- **`pnpm-lock.yaml`** - Lock file for reproducible builds
  - Exact dependency versions
  - Dependency tree structure

### Component Library:
- **`components.json`** - Shadcn/ui configuration
  - Component library settings
  - Styling and theming preferences

## 📚 Documentation Files

### Project Documentation:
- **`README.md`** - Main project documentation
  - Project overview and features
  - Installation and setup instructions
  - Usage examples and screenshots
  - Contributing guidelines summary

- **`PROJECT_STRUCTURE.md`** - This file
  - Comprehensive project organization guide
  - File and directory explanations
  - Architecture overview

- **`PROJECT_TASKS.md`** - Task tracking and status
  - Completed, in-progress, and planned features
  - Priority levels and progress tracking
  - Milestone definitions and roadmap

### Community and Legal:
- **`CONTRIBUTING.md`** - Contributor guidelines
  - Development workflow and setup
  - Code style and standards
  - Pull request process
  - Community guidelines

- **`LICENSE`** - MIT license
  - Open source license terms
  - Usage and distribution rights

- **`PRIVACY.md`** - Privacy policy
  - Data handling practices
  - Privacy-first design principles
  - Technical implementation details

- **`DEPLOYMENT.md`** - Deployment guide
  - Multiple deployment options
  - Configuration instructions
  - Performance optimization tips

## 🏗️ Architecture Overview

### Frontend Architecture:
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom components
- **State Management**: React hooks (useState, useCallback)
- **File Processing**: Browser APIs (Canvas, File, Blob)
- **Offline Support**: Service Worker + PWA manifest

### Key Design Principles:

#### 1. **Privacy-First**
- All file processing happens client-side
- No data collection or external API calls
- Complete user privacy and data control

#### 2. **Offline-Capable**
- Service Worker caches application assets
- PWA manifest enables app installation
- Full functionality without internet connection

#### 3. **Open Source**
- MIT license for maximum freedom
- Comprehensive documentation
- Community-friendly contribution process

#### 4. **Performance-Optimized**
- Static site generation for fast loading
- Optimized images and assets
- Minimal JavaScript bundle size

#### 5. **Accessible**
- Responsive design for all devices
- Keyboard navigation support
- Screen reader compatibility

## 🔧 Development Workflow

### Local Development:
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run lint        # Run code quality checks
npm run type-check  # TypeScript validation
npm run build       # Production build
```

### File Organization Rules:

#### Components:
- Place reusable components in `/components/`
- Use TypeScript for all components
- Follow React best practices and hooks

#### Utilities:
- Shared functions go in `/lib/`
- Keep utilities pure and testable
- Export with clear naming conventions

#### Static Assets:
- All static files in `/public/`
- Optimize images before adding
- Use SVG for icons when possible

#### Documentation:
- Keep all `.md` files in root directory
- Update relevant docs when making changes
- Maintain clear, comprehensive documentation

## 🚀 Deployment Structure

### Static Export:
The project is configured for static export, generating:
```
out/
├── _next/           # Next.js optimized assets
├── index.html       # Main page
├── manifest.json    # PWA manifest
├── sw.js           # Service worker
└── [other assets]   # Icons, images, etc.
```

### Hosting Options:
- **GitHub Pages** - Free static hosting
- **Vercel** - Optimized for Next.js
- **Netlify** - JAMstack deployment
- **Self-hosted** - Any static file server

## 📊 Project Metrics

### Current Stats:
- **Total Files**: ~20 core files
- **Lines of Code**: ~2,000+ lines
- **Dependencies**: Minimal, focused set
- **Bundle Size**: Optimized for performance
- **Documentation**: Comprehensive coverage

### Supported Formats:
- **Images**: JPG, PNG, WebP, GIF, BMP (input)
- **Output**: JPG, PNG, WebP, GIF
- **Planned**: PDF, audio, video formats

---

**This structure supports a scalable, maintainable, and community-friendly open source project focused on privacy, performance, and user experience.**