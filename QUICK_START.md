# 🚀 Quick Start

**TL;DR**: Automated minification for StudioForm

---

## ⚡ One-Time Setup

```bash
cd /path/to/studioform
bun install
bun run build
```

✅ Done! You now have `index.min.js`

---

## 📝 Daily Workflow

### Edit → Build → Commit

```bash
# 1. Edit the source
vim index.js

# 2. Build (automatic on commit, or manual)
bun run build

# 3. Commit (both files)
git add index.js index.min.js
git commit -m "feat: add feature"
git push
```

**Or just commit** - the pre-commit hook auto-builds! 🎉

---

## 🎯 Common Commands

| What | Command |
|------|---------|
| **Build once** | `bun run build` |
| **Watch mode** | `bun run build:watch` |
| **See stats** | `bun run build:verbose` |

---

## 📊 Current Stats

```
index.js     = 100 KB  (source)
index.min.js =  46 KB  (54% smaller)
```

---

## 🔍 Verify Build

```bash
ls -lh index*.js
```

Should show:
```
100K  index.js
 46K  index.min.js
```

---

## 🌐 Usage in HTML

### Production
```html
<script src="studioform/index.min.js"></script>
```

### Development
```html
<script src="studioform/index.js"></script>
```

---

## 🐛 Troubleshooting

**Build fails?**
```bash
bun install
```

**Git hook not working?**
```bash
bun run prepare
chmod +x .husky/pre-commit
```

**Need to rebuild?**
```bash
bun run build
```

---

## 📁 Files

- `index.js` - Edit this (source)
- `index.min.js` - Use this (auto-generated)
- `build.js` - Build script
- `package.json` - Config

---

## 💡 Pro Tips

✅ **DO**
- Edit `index.js`
- Commit both files
- Use `index.min.js` in production

❌ **DON'T**
- Edit `index.min.js`
- Commit `node_modules/`
- Use `index.js` in production

---

**Need more details?** See [BUILD.md](BUILD.md) or [README.md](README.md)