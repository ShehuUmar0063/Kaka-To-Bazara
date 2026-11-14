import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed, ExternalLink, MapPinned, Mountain, Layers, Maximize2 } from 'lucide-react';
import type { TranslationPack } from '../data/translations';
import type { FarmInputsCopy } from '../data/farmInputsTranslations';
import type { MapLayerMode, TerrainClass } from '../types/farm';

interface FarmSatelliteMapProps {
  lat: number;
  lon: number;
  flyTrigger: number;
  farmSizeHa: number;
  soilWetnessPct: number;
  elevationM: number;
  terrainClass: TerrainClass;
  isLoadingElevation: boolean;
  t: TranslationPack;
  farmCopy: FarmInputsCopy;
  onPinChange: (nextLat: number, nextLon: number) => void;
  onFarmSizeChange: (nextHa: number) => void;
}

const GIBS_MODIS_URL =
  'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/2025-10-16/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png';

const GIBS_SMAP_URL =
  'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/SMAP_L4_Analyzed_Root_Zone_Soil_Moisture/default/2025-10-01/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png';

function createPinIcon() {
  return L.divIcon({
    className: '',
    iconSize: [34, 42],
    iconAnchor: [17, 40],
    html: `
      <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.45));">
        <path d="M17 1C8.71573 1 2 7.71573 2 16C2 26.5 17 41 17 41C17 41 32 26.5 32 16C32 7.71573 25.2843 1 17 1Z" fill="#1B4332" stroke="#FFFFFF" stroke-width="2.5"/>
        <circle cx="17" cy="16" r="5.5" fill="#FAF8F5"/>
      </svg>
    `,
  });
}

export function FarmSatelliteMap({
  lat,
  lon,
  flyTrigger,
  farmSizeHa,
  soilWetnessPct,
  elevationM,
  terrainClass,
  isLoadingElevation,
  t,
  farmCopy,
  onPinChange,
  onFarmSizeChange,
}: FarmSatelliteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);
  const gibsLayerRef = useRef<L.TileLayer | null>(null);

  const onPinChangeRef = useRef(onPinChange);
  onPinChangeRef.current = onPinChange;

  const [layerMode, setLayerMode] = useState<MapLayerMode>('aerial');
  const [gibsOpacity, setGibsOpacity] = useState<number>(0.72);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Initialize Leaflet map once with Esri World Imagery
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lon],
      zoom: 15,
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

    const zonesLayer = L.layerGroup().addTo(map);
    const marker = L.marker([lat, lon], {
      draggable: true,
      icon: createPinIcon(),
    }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onPinChangeRef.current(Number(pos.lat.toFixed(5)), Number(pos.lng.toFixed(5)));
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      const clickedLat = Number(e.latlng.lat.toFixed(5));
      const clickedLon = Number(e.latlng.lng.toFixed(5));
      marker.setLatLng([clickedLat, clickedLon]);
      onPinChangeRef.current(clickedLat, clickedLon);
    });

    mapRef.current = map;
    markerRef.current = marker;
    zonesLayerRef.current = zonesLayer;

    const resizeTimer = window.setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      window.clearTimeout(resizeTimer);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      zonesLayerRef.current = null;
      gibsLayerRef.current = null;
    };
  }, []);

  // Fly smoothly when LGA changes
  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    marker.setLatLng([lat, lon]);
    if (flyTrigger > 0) {
      map.flyTo([lat, lon], layerMode === 'aerial' ? 15 : map.getZoom(), { duration: 1.0 });
    }
  }, [flyTrigger]);

  // Keep marker synced on tap/GPS
  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      marker.setLatLng([lat, lon]);
    }
  }, [lat, lon]);

  // Manage NASA GIBS overlay layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (gibsLayerRef.current) {
      map.removeLayer(gibsLayerRef.current);
      gibsLayerRef.current = null;
    }

    if (layerMode === 'modis') {
      const modisLayer = L.tileLayer(GIBS_MODIS_URL, {
        attribution: 'NASA GIBS MODIS Terra NDVI',
        maxNativeZoom: 9,
        maxZoom: 19,
        opacity: gibsOpacity,
      });
      modisLayer.addTo(map);
      gibsLayerRef.current = modisLayer;
    } else if (layerMode === 'smap') {
      const smapLayer = L.tileLayer(GIBS_SMAP_URL, {
        attribution: 'NASA GIBS SMAP L4 Soil Moisture',
        maxNativeZoom: 6,
        maxZoom: 19,
        opacity: gibsOpacity,
      });
      smapLayer.addTo(map);
      gibsLayerRef.current = smapLayer;
    }
  }, [layerMode]);

  useEffect(() => {
    if (gibsLayerRef.current) {
      gibsLayerRef.current.setOpacity(gibsOpacity);
    }
  }, [gibsOpacity]);

  // Draw dynamic farm plot square matching custom farmSizeHa (0.2 to 50 Hectares)
  useEffect(() => {
    const zonesLayer = zonesLayerRef.current;
    if (!zonesLayer) return;

    zonesLayer.clearLayers();

    const clampedHa = Math.min(50, Math.max(0.2, farmSizeHa));
    // 1 ha = 10,000 m² -> side = 100 * sqrt(ha) meters; half-side = 50 * sqrt(ha)
    const metersHalf = 50 * Math.sqrt(clampedHa);
    const sideMeters = Math.round(metersHalf * 2);

    const dLat = metersHalf / 111320;
    const dLon = metersHalf / (111320 * Math.max(0.15, Math.cos((lat * Math.PI) / 180)));

    const wetnessNorm = Math.min(1, Math.max(0.2, soilWetnessPct / 80));
    const wetOpacity = Number((0.26 + wetnessNorm * 0.24).toFixed(2));
    const dryOpacity = Number((0.42 - wetnessNorm * 0.14).toFixed(2));

    // Outer green boundary box matching farmer's chosen farm size
    L.rectangle(
      [
        [lat - dLat, lon - dLon],
        [lat + dLat, lon + dLon],
      ],
      {
        color: '#22C55E',
        weight: 2.5,
        fill: false,
        interactive: false,
      }
    ).addTo(zonesLayer);

    // SW - Lower/Wetter Side
    L.rectangle(
      [
        [lat - dLat, lon - dLon],
        [lat, lon],
      ],
      {
        color: '#10B981',
        weight: 1,
        fillColor: '#0EA5E9',
        fillOpacity: wetOpacity,
      }
    )
      .bindTooltip(`${t.higherMoistureZoneLabel} · ${clampedHa} ha (${sideMeters}m × ${sideMeters}m)`, {
        direction: 'center',
      })
      .addTo(zonesLayer);

    // SE - Lower/Wetter Side
    L.rectangle(
      [
        [lat - dLat, lon],
        [lat, lon + dLon],
      ],
      {
        color: '#10B981',
        weight: 1,
        fillColor: '#10B981',
        fillOpacity: wetOpacity,
      }
    )
      .bindTooltip(`${t.higherMoistureZoneLabel} · ${soilWetnessPct}%`, { direction: 'center' })
      .addTo(zonesLayer);

    // NW - Higher/Exposed Side
    L.rectangle(
      [
        [lat, lon - dLon],
        [lat + dLat, lon],
      ],
      {
        color: '#D97706',
        weight: 1,
        fillColor: '#F59E0B',
        fillOpacity: dryOpacity,
      }
    )
      .bindTooltip(`${t.drierZoneLabel} · ${Math.max(12, soilWetnessPct - 10)}%`, { direction: 'center' })
      .addTo(zonesLayer);

    // NE - Higher/Exposed Side
    L.rectangle(
      [
        [lat, lon],
        [lat + dLat, lon + dLon],
      ],
      {
        color: '#D97706',
        weight: 1,
        fillColor: '#D97706',
        fillOpacity: Math.min(0.55, dryOpacity + 0.06),
      }
    )
      .bindTooltip(`${t.drierZoneLabel} · ${Math.max(10, soilWetnessPct - 14)}%`, { direction: 'center' })
      .addTo(zonesLayer);
  }, [lat, lon, farmSizeHa, soilWetnessPct, t.higherMoistureZoneLabel, t.drierZoneLabel]);

  const handleUseGps = () => {
    setGpsError(null);
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setGpsError(t.gpsUnsupported);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const gpsLat = Number(pos.coords.latitude.toFixed(5));
        const gpsLon = Number(pos.coords.longitude.toFixed(5));
        onPinChange(gpsLat, gpsLon);
        mapRef.current?.flyTo([gpsLat, gpsLon], 15, { duration: 1.0 });
      },
      () => {
        setIsLocating(false);
        setGpsError(t.gpsDenied);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleLayerSelect = (nextMode: MapLayerMode) => {
    setLayerMode(nextMode);
    if (mapRef.current) {
      if (nextMode === 'aerial' && mapRef.current.getZoom() < 13) {
        mapRef.current.flyTo([lat, lon], 15, { duration: 0.8 });
      } else if (nextMode !== 'aerial' && mapRef.current.getZoom() > 11) {
        mapRef.current.flyTo([lat, lon], nextMode === 'smap' ? 7 : 9, { duration: 0.8 });
      }
    }
  };

  const handleNumberInput = (raw: string) => {
    const val = Number(raw);
    if (!Number.isFinite(val)) return;
    onFarmSizeChange(Math.min(50, Math.max(0.2, Number(val.toFixed(1)))));
  };

  const sideLengthM = Math.round(100 * Math.sqrt(Math.min(50, Math.max(0.2, farmSizeHa))));
  const googleMapsUrl = `https://www.google.com/maps/@?api=1&map_action=map&center=${lat.toFixed(
    5
  )},${lon.toFixed(5)}&zoom=17&basemap=satellite`;

  return (
    <section
      aria-labelledby="farm-map-heading"
      className="bg-white border border-[#E5E0D5] rounded-2xl p-4 sm:p-5 space-y-3.5"
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 id="farm-map-heading" className="text-base font-semibold text-[#1C241F] flex items-center gap-2">
            <MapPinned className="w-4 h-4 text-[#1B4332] shrink-0" aria-hidden="true" />
            <span>{t.mapTitle}</span>
          </h2>
          <p className="text-xs text-[#525E56] mt-0.5">{t.mapTapHint}</p>
        </div>

        <button
          type="button"
          onClick={handleUseGps}
          disabled={isLocating}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#FAF8F5] border border-[#D8D1C5] text-xs font-semibold text-[#1B4332] hover:border-[#1B4332] hover:bg-[#1B4332]/5 disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1B4332]"
        >
          <LocateFixed className={`w-4 h-4 shrink-0 ${isLocating ? 'animate-spin' : ''}`} aria-hidden="true" />
          <span>{isLocating ? t.gpsLocating : t.useGpsBtn}</span>
        </button>
      </div>

      {/* Live NASA GIBS Layer Switcher & Opacity Control */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-1">
        <div
          role="group"
          aria-label="Satellite Map Layers"
          className="inline-flex flex-wrap items-center p-1 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D5] gap-1 self-start"
        >
          {(
            [
              { id: 'aerial', label: t.layerAerial },
              { id: 'modis', label: t.layerModis },
              { id: 'smap', label: t.layerSmap },
            ] as const
          ).map((item) => {
            const active = layerMode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLayerSelect(item.id)}
                aria-pressed={active}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1B4332] ${
                  active ? 'bg-[#1B4332] text-white' : 'text-[#525E56] hover:text-[#1C241F]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {layerMode !== 'aerial' && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#525E56]">
            <label className="inline-flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#1B4332] shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">{t.opacityLabel}</span>
              <input
                type="range"
                min={0.25}
                max={1}
                step={0.05}
                value={gibsOpacity}
                onChange={(e) => setGibsOpacity(Number(e.target.value))}
                className="w-24 accent-[#1B4332] cursor-pointer"
              />
              <span className="font-mono tabular-nums w-9 text-[#1C241F]">
                {Math.round(gibsOpacity * 100)}%
              </span>
            </label>

            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => mapRef.current?.flyTo([lat, lon], 15, { duration: 0.8 })}
                className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#D8D1C5] text-[11px] font-medium text-[#1C241F] hover:border-[#1B4332] cursor-pointer"
              >
                {t.zoomPlotBtn}
              </button>
              <button
                type="button"
                onClick={() =>
                  mapRef.current?.flyTo([lat, lon], layerMode === 'smap' ? 7 : 9, { duration: 0.8 })
                }
                className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#D8D1C5] text-[11px] font-medium text-[#1C241F] hover:border-[#1B4332] cursor-pointer"
              >
                {t.zoomRegionBtn}
              </button>
            </div>
          </div>
        )}
      </div>

      {gpsError && (
        <p className="text-xs text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-3.5 py-2">
          {gpsError}
        </p>
      )}

      {/* Interactive Satellite Map Viewport */}
      <div className="relative rounded-xl overflow-hidden border border-[#D8D1C5] h-[270px] sm:h-[330px] w-full bg-[#1C241F]">
        <div ref={containerRef} className="w-full h-full z-10" />
      </div>

      {/* Custom Farm Size Slider & Number Input (0.2 to 50 Hectares) */}
      <div className="bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#1C241F] shrink-0">
          <Maximize2 className="w-4 h-4 text-[#1B4332] shrink-0" aria-hidden="true" />
          <span>{farmCopy.farmSizeLabel}</span>
          <span className="font-mono tabular-nums font-normal text-[#525E56]">
            ({sideLengthM}m × {sideLengthM}m)
          </span>
        </div>

        <div className="flex items-center gap-3 flex-1 sm:max-w-md">
          <input
            type="range"
            aria-label={farmCopy.farmSizeLabel}
            min={0.2}
            max={50}
            step={0.1}
            value={farmSizeHa}
            onChange={(e) => onFarmSizeChange(Number(e.target.value))}
            className="flex-1 accent-[#1B4332] cursor-pointer"
          />

          <div className="flex items-center gap-1.5 shrink-0">
            <input
              type="number"
              aria-label={`${farmCopy.farmSizeLabel} (${farmCopy.hectaresUnit})`}
              min={0.2}
              max={50}
              step={0.1}
              value={farmSizeHa}
              onChange={(e) => handleNumberInput(e.target.value)}
              className="w-20 min-h-[38px] px-2.5 py-1 text-xs font-mono tabular-nums font-semibold bg-white border border-[#D8D1C5] rounded-lg text-[#1C241F] text-right focus:outline-none focus:border-[#1B4332]"
            />
            <span className="text-xs font-mono text-[#525E56]">{farmCopy.hectaresUnit}</span>
          </div>
        </div>
      </div>

      {/* Bottom Coordinates, Live SRTM 30m Elevation, Subzone Legend & Google Maps Link */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[#525E56]">
          <span className="font-mono tabular-nums font-semibold text-[#1C241F]">
            {lat.toFixed(5)}°N, {lon.toFixed(5)}°E
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 font-mono tabular-nums font-medium text-[#1B4332]">
            <Mountain className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>
              {isLoadingElevation ? '…' : `${elevationM}m — ${t.terrainLabels[terrainClass]}`}
            </span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#0EA5E9] inline-block" aria-hidden="true" />
            <span>{t.higherMoistureZoneLabel}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#D97706] inline-block" aria-hidden="true" />
            <span>{t.drierZoneLabel}</span>
          </span>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143326] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
        >
          <span>{t.openGoogleMapsBtn}</span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
