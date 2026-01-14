# Troubleshooting: Live Server (Port 5500) vs. Dev Server (Port 8080)

## 🔴 The Problem

When clicking **"Go Live"** (Port 5500), you see a **white screen** and this error in the console:

> "Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of 'application/octet-stream'."

However, running `npm run dev` (Port 8080) works perfectly.

## 🧐 The Cause

**Live Server (Port 5500)** is a simple server for static files (HTML, CSS, JS).

- Your project uses **React & TypeScript** (`.tsx` files).
- Browsers **cannot** understand `.tsx` files directly.
- They need to be "compiled" into standard JavaScript first.

**Vite Dev Server (Port 8080)** (`npm run dev`) compiles your code on-the-fly, which is why it works.

## ✅ The Solution

### Method 1: For Developing (Recommended)

Use the command intended for React development. It automates everything.

1.  Run: `npm run dev`
2.  Open: `http://localhost:8080/`

### Method 2: If you MUST use Live Server (Port 5500)

To use Live Server, you must **build** the project into standard HTML/JS first.

1.  **Configure Vite** (I have already done this for you):
    - In `vite.config.ts`, set `base: './'` so links work in any folder.
2.  **Build the Project**:
    - Run: `npm run build`
    - This creates a `dist` folder with the compiled files.
3.  **Serve the Correct Folder**:
    - Don't serve the project root!
    - **Right-click** the `dist/index.html` file -> **"Open with Live Server"**.

## 📝 Summary Table

| Feature           | Live Server (Port 5500)    | Vite Dev Server (Port 8080)   |
| :---------------- | :------------------------- | :---------------------------- |
| **Command**       | "Go Live" Button           | `npm run dev`                 |
| **Use Case**      | Static Sites / Prototyping | **Modern React Development**  |
| **Supports TSX?** | ❌ No                      | ✅ Yes (Compiles on-the-fly)  |
| **Hot Reload?**   | Yes (Slow)                 | ✅ Yes (Instant HMR)          |
| **Verdict**       | Use only for `dist` folder | **Default choice for coding** |
