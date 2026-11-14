# Kaka-to-Bazara: Gombe Residual Moisture Relay Finder

**2026 NASA Space Apps Challenge — *Field Shift: Adapting Farms with NASA Data***

A mobile-first, farmer-centered agricultural web application built for smallholder farmers across all **11 Local Government Areas (LGAs) of Gombe State, Nigeria**. It uses open NASA satellite datasets, terrain elevation data, and plain-language AI guidance to help farmers find residual root-zone moisture after harvest (*Kaka*) and grow a low-risk dry-season (*Bazara*) relay crop without fuel pumps.

---

## Key Features

- **4 Local Languages + Simple Mode**: Instant switching between **English**, **Hausa**, **Fulfulde**, and **Nigerian Pidgin**, with a **Simple Mode** toggle that replaces technical jargon (`GWETROOT`, `EVPTRNS`, `NDVI`, `SRTM`) with everyday farming terms.
- **Interactive Satellite Farm Pinning**:
  - High-resolution **Esri World Imagery** satellite map covering all 11 Gombe LGAs with one-tap GPS location.
  - Tap anywhere on the map (or drag the marker) to pin exact 5-decimal farm coordinates and verify boundaries via a synced **Open in Google Maps** link.
  - Dynamic **Farm Size** slider (`0.2` to `50` Hectares) that scales the plot square and moisture sub-zones around your pin.
- **Live NASA & Terrain Data (No API Keys Required for Earth Data)**:
  - **NASA POWER API**: Daily root-zone soil wetness (`GWETROOT`), precipitation (`PRECTOTCORR`), peak heat (`T2M_MAX`), and evapotranspiration (`EVPTRNS`).
  - **SRTM 30m Elevation (Open-Meteo)**: Real-time terrain slope lookup (`Lowland Basin`, `Mid-Valley`, `Upland Slope`) adjusting soil moisture retention automatically.
  - **NASA GIBS Satellite Overlays**: Live toggleable map layers for **MODIS Terra NDVI** and **SMAP L4 Root-Zone Soil Moisture** with opacity control.
- **Crop Check & AI Extension Assistant**:
  - Select your **Soil/Sand Type** (*Sandy*, *Mixed Loamy*, *Clay / Fadama*) and **Planned Crop** (*Maize*, *60-Day Cowpea*, *Sorghum*, *Groundnut*, *Millet*, *Lowland Rice*, *Vegetables/Okra*) to get a **YES / WARNING** verdict, plain-language explanation, and 3 rotation alternatives.
  - Floating **AI Assistant** chat with optional browser voice read-aloud (`SpeechSynthesis`).
  - **One-Tap Share**: Exports the complete crop verdict, farm coordinates, soil moisture status, and crop options to WhatsApp, SMS, or clipboard via the Web Share API.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Leaflet, Recharts, Lucide Icons
- **Backend**: Node.js (`>=22.6.0`), Express, `@google/genai` (server-side Gemini integration)
- **Earth Observation & Terrain APIs**: NASA POWER, NASA GIBS WMTS (MODIS & SMAP), Open-Meteo SRTM 30m Elevation, Esri World Imagery

---

## Quick Start (Local Development)

### Prerequisites
- **Node.js 22.6+** (supports native TypeScript execution for `server.ts`)
- **npm** (included with Node.js)
- Optional: A **Gemini API key** (`GEMINI_API_KEY`) for live server-side AI chat and crop check analysis

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```
Edit `.env` and add your Gemini API key if using the full-stack server:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. Run in Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Production Build & Start
```bash
npm run build
NODE_ENV=production npm start
```

---

## Launching Directly from GitHub

You can launch this project straight from GitHub in two ways:

### Option A: GitHub Pages (Static Frontend — Zero Server Setup)
This repository includes a ready-to-use GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.
1. Push this repository to GitHub (`main` branch).
2. Go to **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
3. On your next push to `main` (or by clicking **Run workflow** in the Actions tab), GitHub will build `dist/` and publish the live app automatically.

> **How it works on GitHub Pages:** NASA POWER supports browser CORS directly, so live satellite soil moisture, SRTM 30m elevation, Leaflet Esri imagery, and NASA GIBS MODIS/SMAP layers all work live on GitHub Pages. When no Node.js backend is present, the crop analyzer and advisor automatically switch to built-in FAO GAEZ + NASA residual-moisture rules so every button keeps working smoothly.

### Option B: Full-Stack Deployment (Render, Railway, Cloud Run, or Docker)
Deploy the full Express + Gemini AI backend directly from your GitHub repository:
- **Render**: Connect your GitHub repo using the included `render.yaml` Blueprint and set `GEMINI_API_KEY` in Environment Variables.
- **Docker**: Build and run using the included `Dockerfile`:
  ```bash
  docker build -t kaka-to-bazara .
  docker run -p 3000:3000 -e GEMINI_API_KEY="your_key" kaka-to-bazara
  ```

---

## Project Structure

```text
├── .github/
│   ├── ISSUE_TEMPLATE/        # Bug & feature request templates
│   └── workflows/             # CI build check & GitHub Pages deployment
├── src/
│   ├── components/            # Map, Farm Analyzer, Charts, Modals, AI Sheet
│   ├── data/                  # 11 Gombe LGAs, NASA parsers, 4-language packs, static fallback
│   ├── types/                 # TypeScript interfaces
│   ├── App.tsx                # Main application state & telemetry orchestration
│   └── main.tsx
├── server.ts                  # Express server, NASA POWER proxy, Gemini AI routes
├── Dockerfile                 # Production container build
├── render.yaml                # Render Blueprint config
├── LICENSE                    # MIT License
└── README.md
```

---

## Data Sources & Attribution

- **NASA POWER Project** (Root-Zone Soil Wetness, Precipitation, Max Temperature, Evapotranspiration)
- **NASA GIBS / EOSDIS** (MODIS Terra NDVI 8-Day & SMAP L4 Soil Moisture)
- **SRTM 30m DEM** via Open-Meteo Elevation API
- **FAO GAEZ** Crop Water & Maturity Benchmarks calibrated for Savanna Legume Relay Cropping
- **Esri World Imagery** satellite basemap tiles

---

## License

Released under the [MIT License](LICENSE).
