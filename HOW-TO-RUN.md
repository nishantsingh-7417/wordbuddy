# Quick Reference: Running WordBuddy

## For Development (Recommended)

```bash
npm run dev
```

Then open: http://localhost:8080/

## For Live Server

1. Make changes to your code
2. Build: `npm run build`
3. Right-click `dist/index.html` → "Open with Live Server"

## Files Changed

- ✅ `vite.config.ts` - Added `base: './'` for relative paths
- ✅ Built production files in `dist/` folder

## The Fix

The error happened because Live Server can't run TypeScript/React files directly.
Now the app is built into standard HTML/CSS/JavaScript that works everywhere!
