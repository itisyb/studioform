# 🔨 Build Guide

Quick reference for building and minifying StudioForm.

## TL;DR

```bash
bun run build
```

---

## 📋 Available Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `bun run build` | Quick minification | Manual builds |
| `bun run build:watch` | Watch mode (auto-rebuild) | Active development |
| `bun run build:verbose` | Detailed statistics | Check compression |
| `bun run minify` | Alias for `build` | Alternative command |

---

## 🚀 Quick Start

### First Time

```bash
# 1. Install dependencies
bun install

# 2. Build minified version
bun run build

# 3. Setup git hooks (optional)
bun run prepare
```

### Daily Development

```bash
# Edit index.js
# Commit changes (auto-builds via git hook)
git add index.js
git commit -m "feat: add feature"
# index.min.js is automatically updated and committed
```

---

## 📊 Build Statistics

### Current Sizes

```
index.js     →  100 KB  (source)
index.min.js →   46 KB  (minified, 54% smaller)
```

### Compression Details

- **Dead code elimination**: ✅
- **Variable mangling**: ✅
- **Whitespace removal**: ✅
- **Comment removal**: ✅ (with validation)
- **External service comment stripping**: ✅
- **Comment validation**: ✅ (auto-detects unwanted comments)
- **Multi-pass optimization**: ✅ (2 passes)

---

## 🔧 Build Configuration

### Terser Options

Located in `build.js` or `package.json`:

```javascript
{
  compress: {
    dead_code: true,        // Remove unreachable code
    drop_console: false,    // Keep console.* calls
    drop_debugger: true,    // Remove debugger statements
    keep_classnames: false, // Mangle class names
    keep_fnames: false,     // Mangle function names
    passes: 2               // Optimization passes
  },
  mangle: {
    toplevel: false,        // Don't mangle top-level names
    safari10: true          // Safari 10+ compatibility
  }
}
```

### Customizing

Edit `build.js` to change minification settings:

```javascript
const result = await minify(code, {
  compress: {
    drop_console: true,  // 👈 Remove console logs
    passes: 3            // 👈 More aggressive optimization
  }
});
```

---

## 🤖 Automatic Builds

### Git Hook (Pre-commit)

**Location**: `.husky/pre-commit`

Automatically runs when:
- You commit changes to `index.js`

**Flow**:
```
git commit
  ↓
Hook detects index.js changed
  ↓
Runs: bun run build
  ↓
Stages index.min.js
  ↓
Commit includes both files
```

### GitHub Actions

**Location**: `.github/workflows/build.yml`

Automatically runs when:
- Push to `main` or `master` branch
- Pull request opened
- Manual trigger

**Flow**:
```
git push
  ↓
GitHub Actions triggered
  ↓
Install dependencies
  ↓
Build minified version
  ↓
Commit & push index.min.js
```

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `terser: command not found`

**Fix**:
```bash
bun install
```

---

**Error**: `Error reading index.js`

**Fix**: Ensure you're in the studioform directory:
```bash
cd /path/to/studioform
bun run build
```

---

**Error**: `Permission denied`

**Fix**: Make build script executable:
```bash
chmod +x build.js
```

---

### Git Hook Not Working

**Issue**: Pre-commit hook doesn't run

**Fix 1**: Install Husky
```bash
bun install husky
bun run prepare
```

**Fix 2**: Make hook executable
```bash
chmod +x .husky/pre-commit
```

**Fix 3**: Manual build
```bash
bun run build
git add index.min.js
```

---

### Watch Mode Issues

**Issue**: Watch mode not detecting changes

**Fix**: Kill existing watchers
```bash
# Kill all chokidar processes
pkill -f chokidar

# Restart watch
bun run build:watch
```

---

### Unwanted Comments in Minified File

**Issue**: External service comments (jsDelivr, unpkg, etc.) appear in `index.min.js`

**Fix**: The build system automatically strips these comments!

The enhanced build script:
- ✅ Removes jsDelivr comments
- ✅ Removes "Original file:" references
- ✅ Removes "Do NOT use SRI" warnings
- ✅ Removes unpkg references
- ✅ Validates only your custom preamble remains

**Validation**:
```bash
# Build with verbose output
bun run build:verbose

# Look for: "🔒 Comment validation: PASSED ✓"
```

**If validation fails**:
1. Check for external minification tools
2. Ensure you're using `bun run build` (not external CDN)
3. Rebuild: `bun run build:clean`

---

## 📁 File Structure

```
studioform/
├── index.js              # Source file (edit this)
├── index.min.js          # Minified (auto-generated)
├── build.js              # Build script
├── package.json          # Dependencies & scripts
├── .gitignore            # Ignore node_modules/
├── .husky/
│   └── pre-commit        # Git hook
└── .github/
    └── workflows/
        └── build.yml     # CI/CD workflow
```

---

## 💡 Tips & Best Practices

### Development Workflow

1. **Edit** `index.js` (never edit `index.min.js`)
2. **Test** locally with `index.js`
3. **Build** with `bun run build`
4. **Commit** both files
5. **Deploy** with `index.min.js`

### Performance

- **Use** `index.min.js` in production
- **Use** `index.js` for debugging
- **Build** before every deployment
- **Cache** minified file on CDN

### Version Control

- **Commit** both `index.js` and `index.min.js`
- **Don't** commit `node_modules/`
- **Track** build output for easy deployment
- **Review** minified output occasionally

---

## 🔍 Verification

### Check Build Success

```bash
# Build
bun run build

# Verify files exist
ls -lh index.js index.min.js

# Check size reduction
du -h index.js index.min.js
```

### Expected Output

```
100K  index.js
46K   index.min.js
```

### Test Minified Version

```html
<!-- Replace in HTML -->
<script src="index.js"></script>
<!-- With -->
<script src="index.min.js"></script>
```

Test all functionality:
- ✅ Form validation
- ✅ URL fields
- ✅ File uploads
- ✅ RTF editors
- ✅ Keyboard navigation
- ✅ Error messages

---

## 📚 Advanced

### Custom Build Script

Create your own build process:

```javascript
// custom-build.js
const { minify } = require('terser');
const fs = require('fs');

const code = fs.readFileSync('index.js', 'utf8');

minify(code, {
  compress: { passes: 3 },
  mangle: true
}).then(result => {
  fs.writeFileSync('index.custom.min.js', result.code);
  console.log('✅ Custom build complete!');
});
```

Run it:
```bash
node custom-build.js
```

### Source Maps

Enable source maps for debugging:

```bash
terser index.js \
  -o index.min.js \
  -c -m \
  --source-map "url='index.min.js.map'"
```

### Multiple Targets

Build for different environments:

```json
{
  "scripts": {
    "build:prod": "terser index.js -o dist/prod.min.js -c -m",
    "build:dev": "terser index.js -o dist/dev.min.js -c",
    "build:all": "npm run build:prod && npm run build:dev"
  }
}
```

---

## 🎯 Checklist

Before deploying:

- [ ] Run `bun run build`
- [ ] Check `index.min.js` exists
- [ ] Verify file size (~46 KB)
- [ ] Test minified version locally
- [ ] Commit both files
- [ ] Push to repository
- [ ] Verify GitHub Actions passes
- [ ] Update production CDN/server

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Install | `bun install` |
| Build | `bun run build` |
| Watch | `bun run build:watch` |
| Stats | `bun run build:verbose` |
| Hooks | `bun run prepare` |
| Test | Open HTML with `index.min.js` |

---

**Last Updated**: 2025-09-30
**Build System**: Terser + Bun
**Auto-build**: Git Hook + GitHub Actions