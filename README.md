# MultiConverter

A free, open-source file conversion tool that runs entirely in your browser. Convert files between multiple formats with complete privacy - your files never leave your device.

![MultiConverter Screenshot](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=MultiConverter)

## ✨ Features

- **🔒 100% Private**: All processing happens in your browser - no uploads, no tracking
- **⚡ Lightning Fast**: Instant conversions with optimized processing
- **🆓 Completely Free**: No limitations, no subscriptions, no hidden costs
- **📱 Works Offline**: Once loaded, works without internet connection
- **🎨 Clean Interface**: Intuitive drag & drop with streamlined user experience
- **🔧 Open Source**: MIT licensed, contribute and customize freely
- **🌙 Dark Mode**: Full dark/light theme support

## 🚀 Supported Formats

### Images
- **Input**: JPG, PNG, GIF, WebP, SVG, BMP, TIFF, ICO
- **Output**: JPG, PNG, WebP, GIF

### Documents
- **Input**: PDF, DOC, DOCX, TXT, RTF, ODT
- **Output**: PDF, TXT, Markdown

### Audio (Coming Soon)
- MP3, WAV, FLAC, AAC, OGG, M4A

### Video (Coming Soon)
- MP4, AVI, MOV, MKV, WebM

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/PierrunoYT/multiconverter.git
cd multiconverter
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## 🏗️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript
- **File Processing**: Browser APIs (Canvas, File API, etc.)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

**Repository**: https://github.com/PierrunoYT/multiconverter

### Adding New Formats

To add support for new file formats:

1. Create a converter function in `lib/converters/`
2. Add the format to the supported formats list
3. Update the UI components
4. Add tests for the new format
5. Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Privacy

MultiConverter is designed with privacy in mind:

- **No Data Collection**: We don't collect any personal information
- **No File Uploads**: Files are processed entirely in your browser
- **No Tracking**: No analytics, cookies, or tracking scripts
- **Open Source**: You can verify our privacy claims by reviewing the code

## 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/PierrunoYT/multiconverter/issues) with:

- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable

## 💡 Feature Requests

Have an idea for a new feature? [Start a discussion](https://github.com/PierrunoYT/multiconverter/discussions) or [open an issue](https://github.com/PierrunoYT/multiconverter/issues).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icons
- All contributors who help make this project better

## 📊 Project Status

- ✅ Clean, modern UI with streamlined interface
- ✅ Image format conversion (JPG, PNG, WebP, GIF)
- ✅ Drag & drop file upload interface
- ✅ Conversion queue with progress tracking
- ✅ PWA support with offline functionality
- 🚧 Document conversion (in progress)
- 📋 Audio conversion (planned)
- 📋 Video conversion (planned)
- 📋 Batch conversion presets (planned)

---

**Made with ❤️ by the open source community**

[⭐ Star this project](https://github.com/PierrunoYT/multiconverter) if you find it useful!
