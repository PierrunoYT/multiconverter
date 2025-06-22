# Deployment Guide

This document explains how to deploy MultiConverter as a free, open-source, offline-capable application.

## 🚀 Quick Start

### Local Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

## 📦 Deployment Options

### 1. GitHub Pages (Recommended)
MultiConverter is configured for static export and can be deployed to GitHub Pages:

1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. The GitHub Action will automatically build and deploy

### 2. Vercel
```bash
npm install -g vercel
vercel --prod
```

### 3. Netlify
1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `out`

### 4. Self-Hosted
After running `npm run build`, serve the `out` directory with any static file server:

```bash
# Using Python
python -m http.server 3000 -d out

# Using Node.js serve
npx serve out

# Using nginx (copy out/ to your web root)
```

## 🔧 Configuration

### Environment Variables
No environment variables needed - everything runs client-side!

### Build Configuration
The app is configured in `next.config.ts` for:
- Static export (`output: 'export'`)
- Optimized images for static hosting
- Trailing slashes for better compatibility

## 🌐 Offline Functionality

### Service Worker
- Automatically caches the application
- Enables offline usage after first visit
- Updates automatically when new versions are deployed

### PWA Features
- Web App Manifest for "Add to Home Screen"
- Responsive design for mobile devices
- Standalone app experience

## 📊 Performance

### Optimization Features
- Static generation for fast loading
- Optimized images and assets
- Minimal JavaScript bundle
- CSS optimization with Tailwind

### Lighthouse Scores
Target scores:
- Performance: 95+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+
- PWA: 95+

## 🔒 Security

### Content Security Policy
Add these headers to your server configuration:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:;
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### HTTPS
Always serve over HTTPS in production for:
- Service Worker functionality
- PWA features
- User security and privacy

## 🐛 Troubleshooting

### Common Issues

**Service Worker not registering:**
- Ensure HTTPS in production
- Check browser console for errors
- Verify `/sw.js` is accessible

**PWA not installable:**
- Verify `manifest.json` is valid
- Ensure HTTPS is enabled
- Check all required manifest fields

**Build failures:**
- Run `npm run type-check` to find TypeScript errors
- Check for missing dependencies
- Verify Node.js version (18+)

### Debug Mode
Enable debug logging by adding to your browser console:
```javascript
localStorage.setItem('debug', 'multiconverter:*');
```

## 📈 Monitoring

### Analytics (Privacy-Friendly)
If you want to add analytics, consider privacy-friendly options:
- Plausible Analytics
- Simple Analytics
- Self-hosted Matomo

### Error Tracking
For error monitoring without privacy invasion:
- Sentry (configure to not collect PII)
- LogRocket (with privacy settings)
- Self-hosted error tracking

## 🔄 Updates

### Automatic Updates
The service worker automatically updates the cache when:
- New versions are deployed
- Users revisit the application
- Cache expires (configurable)

### Manual Updates
Users can manually refresh to get updates:
- Hard refresh (Ctrl+F5 / Cmd+Shift+R)
- Clear browser cache
- Reinstall PWA

## 📱 Mobile Deployment

### App Stores
While MultiConverter runs in browsers, you can also:
- Package as Electron app for desktop stores
- Use Capacitor/Cordova for mobile app stores
- Submit PWA to Microsoft Store

### Mobile Optimization
- Responsive design works on all screen sizes
- Touch-friendly interface
- Optimized for mobile performance

## 🌍 CDN Configuration

### Static Assets
For better global performance:
- Use a CDN for static assets
- Enable gzip/brotli compression
- Set appropriate cache headers

### Cache Headers
```
# Static assets (1 year)
Cache-Control: public, max-age=31536000, immutable

# HTML files (1 hour)
Cache-Control: public, max-age=3600

# Service worker (no cache)
Cache-Control: no-cache
```

## 🎯 Production Checklist

Before deploying to production:

- [ ] Run `npm run build` successfully
- [ ] Test offline functionality
- [ ] Verify PWA installability
- [ ] Check mobile responsiveness
- [ ] Test file conversion features
- [ ] Validate HTML and accessibility
- [ ] Configure security headers
- [ ] Set up monitoring (optional)
- [ ] Test in multiple browsers
- [ ] Verify HTTPS configuration

## 📞 Support

For deployment issues:
- Check the [GitHub Issues](https://github.com/yourusername/multiconverter/issues)
- Review the [Contributing Guide](CONTRIBUTING.md)
- Join [GitHub Discussions](https://github.com/yourusername/multiconverter/discussions)

---

**Remember: MultiConverter is designed to be completely self-contained and privacy-focused. No external services are required for core functionality.**