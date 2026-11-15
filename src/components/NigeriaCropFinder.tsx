import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AlertTriangle,
  CalendarDays,
  Compass,
  Droplets,
  ExternalLink,
  MapPin,
  Mountain,
  Sparkles,
  Sprout,
  Sun,
} from 'lucide-react';
import {
  NIGERIAN_CROP_PRESETS,
  NIGERIA_FINDER_COPY,
  buildStaticNigeriaCropResult,
} from '../data/nigeriaCropData';
import { parseNasaPowerPayload } from '../data/gombeData';
import type {
  Language,
  MapLayerMode,
  NigeriaCropAnalysisResult,
  NigeriaCropRegion,
} from '../types/farm';

interface NigeriaCropFinderProps {
  language: Language;
  simpleMode: boolean;
}

interface RegionTelemetry {
  wetnessPct: number;
  maxTempC: number;
  viableDays: number;
  elevationM: number;
  source: 'live' | 'baseline';
}

const ESRI_PLACES_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';
const ESRI_TRANSPORT_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}';
const GIBS_MODIS_URL =
  'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/2025-10-16/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png';
const GIBS_SMAP_URL =
  'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/SMAP_L4_Analyzed_Root_Zone_Soil_Moisture/default/2025-10-01/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png';

function createPinIcon() {
  return L.divIcon({
    className: '',
    iconSize: [32, 40],
    iconAnchor: [16, 38],
    html: `
      <svg width="32" height="40" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.45));">
        <path d="M17 1C8.71573 1 2 7.71573 2 16C2 26.5 17 41 17 41C17 41 32 26.5 32 16C32 7.71573 25.2843 1 17 1Z" fill="#1B4332" stroke="#FFFFFF" stroke-width="2.5"/>
        <circle cx="17" cy="16" r="5.5" fill="#FAF8F5"/>
      </svg>
    `,
  });
}

export function NigeriaCropFinder({ language, simpleMode }: NigeriaCropFinderProps) {
  const copy = NIGERIA_FINDER_COPY[language];

  const [selectedPresetId, setSelectedPresetId] = useState<string>('cowpea');
  const [customCrop, setCustomCrop] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [result, setResult] = useState<NigeriaCropAnalysisResult | null>(null);

  const [selectedRegionIdx, setSelectedRegionIdx] = useState<number>(0);
  const [regionTelemetry, setRegionTelemetry] = useState<RegionTelemetry | null>(null);
  const [isLoadingRegionNasa, setIsLoadingRegionNasa] = useState<boolean>(false);
  const [layerMode, setLayerMode] = useState<MapLayerMode>('aerial');

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const gibsLayerRef = useRef<L.TileLayer | null>(null);

  const selectedRegion: NigeriaCropRegion | null =
    result && result.topRegions[selectedRegionIdx] ? result.topRegions[selectedRegionIdx] : null;

  const activeCropName =
    customCrop.trim() ||
    NIGERIAN_CROP_PRESETS.find((c) => c.id === selectedPresetId)?.labels[language] ||
    '60-Day Cowpea / Beans';

  const handleFindRegions = async () => {
    setIsSearching(true);
    setSearchError(null);

    try {
      const res = await fetch('/api/advisor/nigeria-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          simpleMode,
          cropName: activeCropName,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.status === 404 || !contentType.includes('application/json')) {
        const fallback = buildStaticNigeriaCropResult(activeCropName, language);
        setResult(fallback);
        setSelectedRegionIdx(0);
        return;
      }

      const data = await res.json();
      if (!res.ok || !Array.isArray(data?.topRegions) || data.topRegions.length === 0) {
        throw new Error(data?.error || 'Unable to analyze Nigeria crop zones right now.');
      }

      setResult(data as NigeriaCropAnalysisResult);
      setSelectedRegionIdx(0);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Connection error while searching.');
    } finally {
      setIsSearching(false);
    }
  };

  // Fetch live NASA POWER + SRTM Elevation whenever user selects one of the recommended state cards
  useEffect(() => {
    if (!selectedRegion) return;

    const controller = new AbortController();
    const { lat, lon } = selectedRegion;
    setIsLoadingRegionNasa(true);

    const elevPromise = fetch(
      `https://api.open-meteo.com/v1/elevation?latitude=${encodeURIComponent(
        lat.toFixed(4)
      )}&longitude=${encodeURIComponent(lon.toFixed(4))}`,
      { signal: controller.signal }
    )
      .then(async (r) => {
        if (!r.ok) return 310;
        const d = (await r.json()) as { elevation?: number[] };
        const val = d?.elevation?.[0];
        return typeof val === 'number' && Number.isFinite(val) ? Math.round(val) : 310;
      })
      .catch(() => 310);

    const directPowerUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR,T2M_MAX,GWETROOT,EVPTRNS&community=AG&longitude=${lon.toFixed(
      4
    )}&latitude=${lat.toFixed(4)}&start=20250901&end=20251110&format=JSON`;

    const powerPromise = fetch(
      `/api/nasa-power?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`,
      { signal: controller.signal }
    )
      .then(async (res) => {
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          return res.json();
        }
        const directRes = await fetch(directPowerUrl, { signal: controller.signal });
        return directRes.ok ? directRes.json() : null;
      })
      .catch(async () => {
        try {
          const directRes = await fetch(directPowerUrl, { signal: controller.signal });
          return directRes.ok ? directRes.json() : null;
        } catch {
          return null;
        }
      });

    Promise.all([elevPromise, powerPromise])
      .then(([elevM, payload]) => {
        if (controller.signal.aborted) return;

        if (payload) {
          const parsed = parseNasaPowerPayload(payload, 175, elevM);
          if (parsed) {
            setRegionTelemetry({
              wetnessPct: parsed.latestGwetrootPct,
              maxTempC: parsed.latestTempMaxC,
              viableDays: parsed.viableDays,
              elevationM: elevM,
              source: 'live',
            });
            setIsLoadingRegionNasa(false);
            return;
          }
        }

        // Clean latitude-adjusted baseline if NASA POWER is temporarily unreachable
        const southernBonus = Math.max(0, Math.round((11 - lat) * 5));
        const wetnessPct = Math.min(82, Math.max(38, 50 + southernBonus));
        setRegionTelemetry({
          wetnessPct,
          maxTempC: Number((34.5 - southernBonus * 0.12).toFixed(1)),
          viableDays: Math.round(45 + southernBonus * 1.4),
          elevationM: elevM,
          source: 'baseline',
        });
        setIsLoadingRegionNasa(false);
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setIsLoadingRegionNasa(false);
      });

    return () => controller.abort();
  }, [selectedRegion]);

  // Initialize / fly Leaflet hybrid satellite map for selected state region
  useEffect(() => {
    if (!selectedRegion || !mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [selectedRegion.lat, selectedRegion.lon],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri World Imagery',
          maxZoom: 19,
        }
      ).addTo(map);

      const labelsPane = map.createPane('nigeriaLabelsPane');
      labelsPane.style.zIndex = '450';
      labelsPane.style.pointerEvents = 'none';

      L.tileLayer(ESRI_TRANSPORT_URL, {
        attribution: 'Roads &copy; Esri',
        maxZoom: 19,
        pane: 'nigeriaLabelsPane',
      }).addTo(map);

      L.tileLayer(ESRI_PLACES_URL, {
        attribution: 'Places &copy; Esri',
        maxZoom: 19,
        pane: 'nigeriaLabelsPane',
      }).addTo(map);

      const marker = L.marker([selectedRegion.lat, selectedRegion.lon], {
        icon: createPinIcon(),
      }).addTo(map);

      mapRef.current = map;
      markerRef.current = marker;

      window.setTimeout(() => {
        map.invalidateSize();
      }, 150);
      return;
    }

    markerRef.current?.setLatLng([selectedRegion.lat, selectedRegion.lon]);
    mapRef.current.flyTo([selectedRegion.lat, selectedRegion.lon], layerMode === 'aerial' ? 13 : 8, {
      duration: 0.9,
    });
  }, [selectedRegion]);

  // Cleanup map on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        gibsLayerRef.current = null;
      }
    };
  }, []);

  // Sync NASA GIBS overlay toggle on regional map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (gibsLayerRef.current) {
      map.removeLayer(gibsLayerRef.current);
      gibsLayerRef.current = null;
    }

    if (layerMode === 'modis') {
      const layer = L.tileLayer(GIBS_MODIS_URL, {
        maxNativeZoom: 9,
        maxZoom: 19,
        opacity: 0.72,
      });
      layer.addTo(map);
      gibsLayerRef.current = layer;
      if (selectedRegion) map.flyTo([selectedRegion.lat, selectedRegion.lon], 9, { duration: 0.7 });
    } else if (layerMode === 'smap') {
      const layer = L.tileLayer(GIBS_SMAP_URL, {
        maxNativeZoom: 6,
        maxZoom: 19,
        opacity: 0.72,
      });
      layer.addTo(map);
      gibsLayerRef.current = layer;
      if (selectedRegion) map.flyTo([selectedRegion.lat, selectedRegion.lon], 7, { duration: 0.7 });
    } else if (selectedRegion) {
      map.flyTo([selectedRegion.lat, selectedRegion.lon], 13, { duration: 0.7 });
    }
  }, [layerMode]);

  const googleMapsUrl = selectedRegion
    ? `https://www.google.com/maps/@?api=1&map_action=map&center=${selectedRegion.lat.toFixed(
        5
      )},${selectedRegion.lon.toFixed(5)}&zoom=14&basemap=satellite`
    : '#';

  return (
    <div className="space-y-6">
      {/* 1. Crop Selector & Custom Input Card */}
      <section className="bg-white border border-[#E5E0D5] rounded-2xl p-4 sm:p-6 space-y-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-[#1C241F] flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-[#1B4332] shrink-0" aria-hidden="true" />
            <span>{copy.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#525E56] mt-1">{copy.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nigeria-crop-preset" className="flex items-center gap-2 text-xs font-semibold text-[#1B4332] mb-2">
              <Sprout className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{copy.presetLabel}</span>
            </label>
            <select
              id="nigeria-crop-preset"
              value={selectedPresetId}
              onChange={(e) => {
                setSelectedPresetId(e.target.value);
                setCustomCrop('');
              }}
              className="w-full min-h-[46px] px-3.5 py-2.5 text-sm font-medium bg-[#FAF8F5] border border-[#D8D1C5] rounded-xl text-[#1C241F] focus:outline-none focus:border-[#1B4332] cursor-pointer"
            >
              {NIGERIAN_CROP_PRESETS.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.labels[language]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="nigeria-custom-crop" className="block text-xs font-semibold text-[#1B4332] mb-2">
              {copy.customLabel}
            </label>
            <input
              id="nigeria-custom-crop"
              type="text"
              value={customCrop}
              onChange={(e) => setCustomCrop(e.target.value)}
              placeholder={copy.customPlaceholder}
              className="w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#D8D1C5] rounded-xl text-[#1C241F] placeholder:text-[#7A847D] focus:outline-none focus:border-[#1B4332]"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleFindRegions}
          disabled={isSearching}
          className="w-full min-h-[52px] px-6 py-3 rounded-xl bg-[#1B4332] text-white text-sm sm:text-base font-semibold hover:bg-[#143326] active:scale-[0.99] disabled:opacity-60 transition-all flex items-center justify-center gap-2.5 shadow-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
        >
          <Sparkles className={`w-5 h-5 shrink-0 ${isSearching ? 'animate-pulse' : ''}`} aria-hidden="true" />
          <span>{isSearching ? copy.findingBtn : copy.findBtn}</span>
        </button>

        {searchError && (
          <div className="p-3.5 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-xs sm:text-sm text-[#9A3412] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{searchError}</span>
          </div>
        )}
      </section>

      {/* 2. AI Nationwide Breakdown & Top 4 States */}
      {result && (
        <>
          <section className="bg-white border border-[#E5E0D5] rounded-2xl p-5 sm:p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-[#1C241F]">{result.cropName}</h2>
              <p className="text-sm sm:text-base text-[#1C241F] leading-relaxed mt-1.5">
                {result.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4332]">
                  <CalendarDays className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{copy.plantingWindowLabel}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#1C241F] leading-relaxed">
                  {result.plantingWindow}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#9A3412]">
                  <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" aria-hidden="true" />
                  <span>{copy.keyRiskLabel}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#1C241F] leading-relaxed">
                  {result.keyRisk}
                </p>
              </div>
            </div>

            {/* Top 4 Clickable State Cards */}
            <div className="space-y-3 pt-1">
              <div>
                <h3 className="text-sm font-semibold text-[#1C241F]">{copy.topRegionsHeading}</h3>
                <p className="text-xs text-[#525E56] mt-0.5">{copy.topRegionsHint}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {result.topRegions.slice(0, 4).map((region, idx) => {
                  const isActive = idx === selectedRegionIdx;
                  return (
                    <button
                      key={`${region.stateName}-${idx}`}
                      type="button"
                      onClick={() => setSelectedRegionIdx(idx)}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1B4332] ${
                        isActive
                          ? 'bg-[#F0FDF4] border-2 border-[#1B4332] shadow-xs'
                          : 'bg-[#FAF8F5] border-[#E5E0D5] hover:border-[#1B4332]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-semibold text-[#1B4332]">
                            #{idx + 1} · {region.ecologicalZone}
                          </div>
                          <div className="text-base font-semibold text-[#1C241F] mt-0.5">
                            {region.stateName}
                          </div>
                          <div className="text-xs font-medium text-[#525E56] flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#1B4332] shrink-0" aria-hidden="true" />
                            <span>{region.townBasin}</span>
                          </div>
                        </div>

                        <span className="font-mono tabular-nums text-[11px] text-[#525E56] shrink-0">
                          {region.lat.toFixed(2)}°N, {region.lon.toFixed(2)}°E
                        </span>
                      </div>

                      <p className="text-xs text-[#1C241F] leading-relaxed mt-2.5 pt-2.5 border-t border-black/5">
                        {region.whyItFits}
                      </p>

                      {isActive && (
                        <div className="mt-2 text-[11px] font-semibold text-[#1B4332]">
                          {copy.tapCardHint}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 3. Live NASA Check & Hybrid Satellite Inspector for Selected State */}
          {selectedRegion && (
            <section className="bg-white border border-[#E5E0D5] rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-[#1C241F]">
                    {copy.liveNasaHeading}: {selectedRegion.townBasin}, {selectedRegion.stateName}
                  </h3>
                  <p className="text-xs font-mono tabular-nums text-[#525E56] mt-0.5">
                    {selectedRegion.lat.toFixed(4)}°N, {selectedRegion.lon.toFixed(4)}°E ·{' '}
                    {selectedRegion.ecologicalZone}
                  </p>
                </div>

                <div
                  role="group"
                  aria-label="Satellite Map Layers"
                  className="inline-flex flex-wrap items-center p-1 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5] gap-1 self-start"
                >
                  {(
                    [
                      { id: 'aerial', label: copy.layerAerial },
                      { id: 'modis', label: copy.layerModis },
                      { id: 'smap', label: copy.layerSmap },
                    ] as const
                  ).map((item) => {
                    const active = layerMode === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setLayerMode(item.id)}
                        className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          active ? 'bg-[#1B4332] text-white' : 'text-[#525E56] hover:text-[#1C241F]'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live NASA POWER + SRTM Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5]">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#525E56]">
                    <Droplets className="w-3.5 h-3.5 text-[#1B4332]" aria-hidden="true" />
                    <span>{copy.wetnessLabel}</span>
                  </div>
                  <div className="mt-1 text-lg font-bold font-mono tabular-nums text-[#1C241F]">
                    {isLoadingRegionNasa || !regionTelemetry ? '…' : `${regionTelemetry.wetnessPct}%`}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5]">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#525E56]">
                    <Sun className="w-3.5 h-3.5 text-[#D97706]" aria-hidden="true" />
                    <span>{copy.peakTempLabel}</span>
                  </div>
                  <div className="mt-1 text-lg font-bold font-mono tabular-nums text-[#1C241F]">
                    {isLoadingRegionNasa || !regionTelemetry ? '…' : `${regionTelemetry.maxTempC}°C`}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5]">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#525E56]">
                    <CalendarDays className="w-3.5 h-3.5 text-[#1B4332]" aria-hidden="true" />
                    <span>{copy.waterLeftLabel}</span>
                  </div>
                  <div className="mt-1 text-lg font-bold font-mono tabular-nums text-[#1C241F]">
                    {isLoadingRegionNasa || !regionTelemetry
                      ? '…'
                      : `${regionTelemetry.viableDays} ${copy.daysUnit}`}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5]">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#525E56]">
                    <Mountain className="w-3.5 h-3.5 text-[#1B4332]" aria-hidden="true" />
                    <span>{copy.elevationLabel}</span>
                  </div>
                  <div className="mt-1 text-lg font-bold font-mono tabular-nums text-[#1C241F]">
                    {isLoadingRegionNasa || !regionTelemetry ? '…' : `${regionTelemetry.elevationM}m`}
                  </div>
                </div>
              </div>

              {/* Satellite Map Viewport */}
              <div className="relative rounded-xl overflow-hidden border border-[#D8D1C5] h-[270px] sm:h-[320px] w-full bg-[#1C241F]">
                <div ref={mapContainerRef} className="w-full h-full z-10" />
              </div>

              <div className="flex justify-end">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143326] transition-colors inline-flex items-center gap-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
                >
                  <span>{copy.openMapsLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                </a>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
