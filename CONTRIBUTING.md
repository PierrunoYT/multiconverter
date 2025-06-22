# Contributing to MultiConverter

Thank you for your interest in contributing to MultiConverter! We welcome contributions from everyone, whether you're fixing bugs, adding features, improving documentation, or helping with translations.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm, yarn, or pnpm
- Git

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/multiconverter.git
   cd multiconverter
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/originalowner/multiconverter.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🛠️ Development Workflow

### Before You Start
- Check existing [issues](https://github.com/yourusername/multiconverter/issues) and [pull requests](https://github.com/yourusername/multiconverter/pulls)
- For major changes, please open an issue first to discuss your approach
- Make sure your Node.js version matches the project requirements

### Making Changes

1. **Create a new branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** following our coding standards:
   - Use TypeScript for type safety
   - Follow the existing code style
   - Add comments for complex logic
   - Keep functions small and focused

3. **Test your changes**:
   ```bash
   npm run build
   npm run lint
   ```

4. **Commit your changes** with a clear message:
   ```bash
   git add .
   git commit -m "feat: add support for TIFF image conversion"
   ```

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add WebP to PNG conversion
fix: resolve memory leak in large file processing
docs: update installation instructions
style: format code with prettier
```

### Submitting Your Changes

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub:
   - Use a clear, descriptive title
   - Describe what your changes do and why
   - Reference any related issues
   - Include screenshots for UI changes

## 🎯 Types of Contributions

### 🐛 Bug Fixes
- Check if the bug is already reported
- Include steps to reproduce
- Provide a clear fix with tests if possible

### ✨ New Features
- Discuss major features in an issue first
- Keep features focused and well-documented
- Add tests for new functionality

### 📚 Documentation
- Fix typos and improve clarity
- Add examples and use cases
- Update README for new features

### 🌍 Translations
- Help translate the interface
- Follow the existing translation structure
- Test translations in context

### 🧪 Testing
- Add tests for existing features
- Improve test coverage
- Report and fix flaky tests

## 📁 Project Structure

```
multiconverter/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── lib/                   # Utility functions and converters
│   ├── converters/        # File conversion logic
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## 🔧 Adding New File Format Support

To add support for a new file format:

1. **Create a converter function** in `lib/converters/`:
   ```typescript
   // lib/converters/yourformat.ts
   export async function convertToYourFormat(
     file: File,
     options?: ConversionOptions
   ): Promise<Blob> {
     // Conversion logic here
   }
   ```

2. **Add format to the UI** in the appropriate components

3. **Update the supported formats list** in the documentation

4. **Add tests** for the new converter

5. **Update the README** with the new format

## 🧪 Testing Guidelines

- Write tests for new features and bug fixes
- Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- Test with different file sizes and types
- Ensure offline functionality works

## 📋 Code Style Guidelines

### TypeScript
- Use strict TypeScript configuration
- Define proper types for all functions
- Avoid `any` type when possible
- Use meaningful variable and function names

### React/Next.js
- Use functional components with hooks
- Follow React best practices
- Keep components small and focused
- Use proper prop types

### CSS/Tailwind
- Use Tailwind CSS classes consistently
- Follow mobile-first responsive design
- Maintain dark mode compatibility
- Keep custom CSS minimal

## 🚫 What Not to Contribute

- Breaking changes without discussion
- Features that require server-side processing
- Code that violates privacy principles
- Unnecessary dependencies
- Code without proper documentation

## 📞 Getting Help

- **Questions**: Use [GitHub Discussions](https://github.com/yourusername/multiconverter/discussions)
- **Bugs**: Open an [issue](https://github.com/yourusername/multiconverter/issues)
- **Security**: Email security@multiconverter.dev (if applicable)

## 🏆 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Given credit in the project

## 📜 Code of Conduct

Please be respectful and inclusive. We want MultiConverter to be a welcoming project for everyone.

- Be kind and respectful
- Welcome newcomers
- Help others learn
- Focus on constructive feedback
- Respect different viewpoints

## 📄 License

By contributing to MultiConverter, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to MultiConverter! 🎉