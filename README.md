# Learn & Play – PWA Web Game

A **Progressive Web App** for children to learn counting and the alphabet through fun, interactive mini‑games. Built with **Vite**, **React**, and **vite-plugin-pwa**, and deployed to **Netlify** for instant mobile/tablet access.

## Features
- **Counting Game** – Match numbers to the correct amount of items.
- **Alphabet Game** – Match letters to pictures (A–Z).
- **Number Recognition Game** – Select the correct number shown.
- **Visual feedback** – Green tick for correct, red cross for incorrect, with try‑again option.
- **PWA ready** – Installable, works offline, and auto‑updates.

## Getting Started
### 1. Clone & Install
```bash
git clone <your-repo-url>
cd learn-and-play
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open the **Network URL** on your mobile/tablet (same Wi‑Fi) to test on a device.

### 3. Build & Preview
```bash
npm run build
npm run preview
```

### 4. Deploy to Netlify
1. Push code to GitHub.
2. In Netlify, **Add new site → Import from Git**.
3. Build command: `npm run build`  
   Publish directory: `dist`
4. Deploy — Netlify will serve the PWA with offline support.

## PWA Installation
- **Android/Chrome:** Menu → *Install app*.
- **iOS/Safari:** Share → *Add to Home Screen*.

## Offline Support
Once loaded online, the game works offline. Service Worker updates in the background; new content loads next time you open the app.

## File Structure
```
learn-and-play/
├── index.html
├── netlify.toml
├── package.json
├── vite.config.js
├── public/
│   ├── _redirects
│   ├── manifest.webmanifest
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       ├── maskable-icon-512.png
│       └── apple-touch-icon.png
└── src/
    ├── App.jsx
    └── main.jsx
```

## Customisation
- **Icons:** Replace placeholder icons in `public/icons/`.
- **Theme Colour:** Update `theme_color` and `background_color` in `vite.config.js` and `manifest.webmanifest`.
- **Games:** Modify or add new mini‑games in `App.jsx`.

## License
MIT — free for personal and commercial use.
