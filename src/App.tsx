import { useCallback, useEffect, useMemo, useState } from 'react';
import { Menu, MapPin, Sparkles, Satellite } from 'lucide-react';
import {
  GOMBE_LGAS,
  SOIL_KIND_CAPACITY_MM,
  getLgaById,
  buildBaselineTelemetry,
  parseNasaPowerPayload,
  classifyElevationTerrain,
} from './data/gombeData';
import { TRANSLATIONS } from './data/translations';
import { FARM_INPUTS_COPY } from './data/farmInputsTranslations';
import { buildStaticChatReply, buildStaticFarmAnalysis } from './data/staticFallback';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SettingsModal } from './components/SettingsModal';
import { FarmSatelliteMap } from './components/FarmSatelliteMap';
import { FarmAnalyzerPanel } from './components/FarmAnalyzerPanel';
import { WaterStatusCard } from './components/WaterStatusCard';
import { SoilWaterChart } from './components/SoilWaterChart';
import { RotationCards } from './components/RotationCards';
import { NasaSourcesModal } from './components/NasaSourcesModal';
import { AiAdvisorSheet } from './components/AiAdvisorSheet';
import type {
  ChatMessage,
  FarmAnalysisResult,
  FarmTelemetry,
  GombeLgaId,
  Language,
  PlannedCropId,
  SoilKindId,
} from './types/farm';

interface NominatimResponse {
  name?: string;
  display_name?: string;
  address?: {
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    quarter?: string;
    village?: string;
    hamlet?: string;
    town?: string;
    city?: string;
    county?: string;
    state_district?: string;
    state?: string;
  };
}

function formatNominatimPlace(data: NominatimResponse | null, fallbackName: string): string {
  if (!data) return fallbackName;
  const addr = data.address ?? {};
  const candidates = [
    data.name,
    addr.road,
    addr.neighbourhood || addr.suburb || addr.quarter,
    addr.village || addr.hamlet || addr.town || addr.city,
    addr.county || addr.state_district,
    addr.state,
  ];
  const unique: string[] = [];
  for (const raw of candidates) {
    const clean = typeof raw === 'string' ? raw.trim() : '';
    if (!clean) continue;
    if (!unique.some((existing) => existing.toLowerCase() === clean.toLowerCase())) {
      unique.push(clean);
    }
  }
  if (unique.length > 0) {
    return unique.slice(0, 3).join(', ');
  }
  if (typeof data.display_name === 'string' && data.display_name.trim()) {
    return data.display_name
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s && s.toLowerCase() !== 'nigeria')
      .slice(0, 3)
      .join(', ');
  }
  return fallbackName;
}

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [simpleMode, setSimpleMode] = useState(true);

  const [selectedLgaId, setSelectedLgaId] = useState<GombeLgaId>('yamaltu_deba');
  const selectedLga = useMemo(() => getLgaById(selectedLgaId), [selectedLgaId]);

  const [pinLat, setPinLat] = useState<number>(selectedLga.lat);
  const [pinLon, setPinLon] = useState<number>(selectedLga.lon);
  const [flyTrigger, setFlyTrigger] = useState<number>(0);

  const [farmSizeHa, setFarmSizeHa] = useState<number>(1.0);
  const [soilKind, setSoilKind] = useState<SoilKindId>(selectedLga.defaultSoilKind);
  const [plannedCrop, setPlannedCrop] = useState<PlannedCropId>('cowpea');

  const [elevationM, setElevationM] = useState<number>(selectedLga.defaultElevationM);
  const [isLoadingElevation, setIsLoadingElevation] = useState<boolean>(false);

  const [exactPlaceName, setExactPlaceName] = useState<string>(`${selectedLga.name}, Gombe`);
  const [isLoadingPlace, setIsLoadingPlace] = useState<boolean>(false);

  const [telemetry, setTelemetry] = useState<FarmTelemetry>(() =>
    buildBaselineTelemetry(getLgaById('yamaltu_deba'))
  );
  const [isLoadingTelemetry, setIsLoadingTelemetry] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FarmAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalysisStale, setIsAnalysisStale] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNasaPopupOpen, setIsNasaPopupOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'greeting', role: 'model', text: TRANSLATIONS.en.aiGreeting },
  ]);
  const [isSendingAi, setIsSendingAi] = useState(false);

  const t = TRANSLATIONS[language];
  const farmCopy = FARM_INPUTS_COPY[language];
  const terrainClass = useMemo(() => classifyElevationTerrain(elevationM), [elevationM]);

  // Sync greeting when language changes if user hasn't sent messages yet
  useEffect(() => {
    setChatMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'greeting') {
        return [{ id: 'greeting', role: 'model', text: TRANSLATIONS[language].aiGreeting }];
      }
      return prev;
    });
  }, [language]);

  const fetchPlotTelemetryAndElevation = useCallback(
    async (
      lat: number,
      lon: number,
      lgaId: GombeLgaId,
      activeSoilKind: SoilKindId,
      signal?: AbortSignal
    ) => {
      const lga = getLgaById(lgaId);
      const baseCapacityMm = SOIL_KIND_CAPACITY_MM[activeSoilKind];
      const fallbackPlace = `${lga.name}, Gombe`;
      setIsLoadingTelemetry(true);
      setIsLoadingElevation(true);
      setIsLoadingPlace(true);

      let resolvedElevation = lga.defaultElevationM;
      const elevPromise = fetch(
        `https://api.open-meteo.com/v1/elevation?latitude=${encodeURIComponent(
          lat.toFixed(5)
        )}&longitude=${encodeURIComponent(lon.toFixed(5))}`,
        { signal }
      )
        .then(async (res) => {
          if (!res.ok) return lga.defaultElevationM;
          const data = (await res.json()) as { elevation?: number[] };
          const val = data?.elevation?.[0];
          return typeof val === 'number' && Number.isFinite(val)
            ? Math.round(val)
            : lga.defaultElevationM;
        })
        .catch(() => lga.defaultElevationM);

      // Reverse geocode exact tapped spot with OpenStreetMap Nominatim (no API key required)
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
          lat.toFixed(5)
        )}&lon=${encodeURIComponent(lon.toFixed(5))}`,
        { signal, headers: { Accept: 'application/json' } }
      )
        .then(async (res) => {
          if (!res.ok) return null;
          return (await res.json()) as NominatimResponse;
        })
        .then((data) => {
          if (signal?.aborted) return;
          setExactPlaceName(formatNominatimPlace(data, fallbackPlace));
          setIsLoadingPlace(false);
        })
        .catch((err) => {
          if (err instanceof Error && err.name === 'AbortError') return;
          setExactPlaceName(fallbackPlace);
          setIsLoadingPlace(false);
        });

      const directPowerUrl = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR,T2M_MAX,GWETROOT,EVPTRNS&community=AG&longitude=${lon.toFixed(
        4
      )}&latitude=${lat.toFixed(4)}&start=20250901&end=20251110&format=JSON`;

      const powerPromise = fetch(
        `/api/nasa-power?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`,
        { signal }
      )
        .then(async (res) => {
          const contentType = res.headers.get('content-type') || '';
          if (res.ok && contentType.includes('application/json')) {
            return res.json();
          }
          // Static hosting (e.g. GitHub Pages): NASA POWER supports browser CORS directly
          const directRes = await fetch(directPowerUrl, { signal });
          return directRes.ok ? directRes.json() : null;
        })
        .catch(async () => {
          try {
            const directRes = await fetch(directPowerUrl, { signal });
            return directRes.ok ? directRes.json() : null;
          } catch {
            return null;
          }
        });

      try {
        const [elevResult, powerPayload] = await Promise.all([elevPromise, powerPromise]);
        if (signal?.aborted) return;

        resolvedElevation = elevResult;
        setElevationM(resolvedElevation);
        setIsLoadingElevation(false);

        if (powerPayload) {
          const parsed = parseNasaPowerPayload(powerPayload, baseCapacityMm, resolvedElevation);
          if (parsed) {
            setTelemetry(parsed);
            setIsLoadingTelemetry(false);
            return;
          }
        }

        setTelemetry(buildBaselineTelemetry(lga, resolvedElevation, baseCapacityMm));
        setIsLoadingTelemetry(false);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setElevationM(resolvedElevation);
        setIsLoadingElevation(false);
        setTelemetry(buildBaselineTelemetry(lga, resolvedElevation, baseCapacityMm));
        setIsLoadingTelemetry(false);
      }
    },
    []
  );

  // Trigger live SRTM elevation + NASA POWER update whenever LGA, pinned coords, or soil kind changes
  useEffect(() => {
    const controller = new AbortController();
    fetchPlotTelemetryAndElevation(pinLat, pinLon, selectedLgaId, soilKind, controller.signal);
    return () => controller.abort();
  }, [pinLat, pinLon, selectedLgaId, soilKind, fetchPlotTelemetryAndElevation]);

  const handleSelectLga = (lgaId: GombeLgaId) => {
    const lga = getLgaById(lgaId);
    setSelectedLgaId(lgaId);
    setPinLat(lga.lat);
    setPinLon(lga.lon);
    setSoilKind(lga.defaultSoilKind);
    setFlyTrigger((n) => n + 1);
    if (analysisResult) setIsAnalysisStale(true);
  };

  const handlePinChange = (nextLat: number, nextLon: number) => {
    setPinLat(nextLat);
    setPinLon(nextLon);
    if (analysisResult) setIsAnalysisStale(true);
  };

  const handleFarmSizeChange = (nextHa: number) => {
    setFarmSizeHa(nextHa);
    if (analysisResult) setIsAnalysisStale(true);
  };

  const handleSoilKindChange = (nextSoil: SoilKindId) => {
    setSoilKind(nextSoil);
    if (analysisResult) setIsAnalysisStale(true);
  };

  const handlePlannedCropChange = (nextCrop: PlannedCropId) => {
    setPlannedCrop(nextCrop);
    if (analysisResult) setIsAnalysisStale(true);
  };

  const handleAnalyzeFarm = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const res = await fetch('/api/advisor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          lgaName: selectedLga.name,
          exactPlaceName,
          lat: pinLat,
          lon: pinLon,
          elevationM,
          terrainLabel: t.terrainLabels[terrainClass],
          farmSizeHa,
          soilKindLabel: farmCopy.soilKinds[soilKind],
          plannedCropLabel: farmCopy.plannedCrops[plannedCrop],
          soilWetnessPct: telemetry.latestGwetrootPct,
          viableDays: telemetry.viableDays,
          dailyLossMm: telemetry.recentAvgLossMm,
          maxTempC: telemetry.latestTempMaxC,
          totalRainMm: telemetry.totalRainMm,
          dataSource: telemetry.source,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.status === 404 || !contentType.includes('application/json')) {
        // Static hosting fallback (e.g. GitHub Pages without Express backend)
        const fallback = buildStaticFarmAnalysis(
          language,
          farmCopy,
          plannedCrop,
          soilKind,
          farmSizeHa,
          telemetry.viableDays,
          telemetry.latestGwetrootPct
        );
        setAnalysisResult(fallback);
        setIsAnalysisStale(false);
        return;
      }

      const data = await res.json();
      if (!res.ok || !data?.verdictBadge) {
        throw new Error(data?.error || 'Unable to check your farm crop right now.');
      }

      setAnalysisResult(data as FarmAnalysisResult);
      setIsAnalysisStale(false);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'Connection error while analyzing plot.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendAiMessage = async (text: string) => {
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text };
    const nextHistory = [...chatMessages, userMsg];
    setChatMessages(nextHistory);
    setIsSendingAi(true);

    try {
      const historyForApi = nextHistory
        .filter((m) => m.id !== 'greeting' && !m.error)
        .slice(0, -1)
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyForApi,
          context: {
            language,
            simpleMode,
            lgaName: selectedLga.name,
            exactPlaceName,
            terrain: selectedLga.terrain,
            lat: pinLat,
            lon: pinLon,
            elevationM,
            terrainLabel: t.terrainLabels[terrainClass],
            farmSizeHa,
            soilKindLabel: farmCopy.soilKinds[soilKind],
            plannedCropLabel: farmCopy.plannedCrops[plannedCrop],
            soilWetnessPct: telemetry.latestGwetrootPct,
            viableDays: telemetry.viableDays,
            verdict: telemetry.isViable ? t.verdictGood : t.verdictDry,
            dataSource: telemetry.source,
          },
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.status === 404 || !contentType.includes('application/json')) {
        const staticReply = buildStaticChatReply(
          language,
          selectedLga.name,
          telemetry.viableDays,
          telemetry.latestGwetrootPct,
          farmSizeHa
        );
        setChatMessages((prev) => [
          ...prev,
          { id: `m-${Date.now()}`, role: 'model', text: staticReply },
        ]);
        return;
      }

      const data = await res.json();
      if (!res.ok || !data?.reply) {
        throw new Error(data?.error || 'Unable to connect to AI assistant.');
      }

      setChatMessages((prev) => [
        ...prev,
        { id: `m-${Date.now()}`, role: 'model', text: data.reply },
      ]);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Connection error.';
      setChatMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, role: 'model', text: errMsg, error: true },
      ]);
    } finally {
      setIsSendingAi(false);
    }
  };

  return (
    <>
      {!hasStarted ? (
        <WelcomeScreen
          t={t}
          onStart={() => setHasStarted(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      ) : (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1C241F] flex flex-col">
          {/* Minimal Top Menu Trigger (no bar) */}
          <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-3 flex items-center justify-end">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              aria-label={t.settingsTitle}
              className="min-h-[44px] min-w-[44px] -mr-2 rounded-lg flex items-center justify-center text-[#1C241F] hover:bg-black/5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1B4332]"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          </header>

          {/* Main Content */}
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-3 pb-24 space-y-6">
            {/* Simple 11-LGA Dropdown Location Picker */}
            <div className="bg-white border border-[#E5E0D5] rounded-2xl p-4 sm:px-5 sm:py-4">
              <label htmlFor="lga-select" className="flex items-center gap-2 text-xs font-semibold text-[#1B4332] mb-2">
                <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t.lgaPickerLabel}</span>
              </label>

              <select
                id="lga-select"
                value={selectedLgaId}
                onChange={(e) => handleSelectLga(e.target.value as GombeLgaId)}
                className="w-full min-h-[44px] px-3.5 py-2.5 text-sm font-medium bg-[#FAF8F5] border border-[#D8D1C5] rounded-xl text-[#1C241F] focus:outline-none focus:border-[#1B4332] cursor-pointer"
              >
                {GOMBE_LGAS.map((lga) => (
                  <option key={lga.id} value={lga.id}>
                    {lga.name} ({lga.lat.toFixed(2)}, {lga.lon.toFixed(2)} - {lga.terrain})
                  </option>
                ))}
              </select>
            </div>

            {/* Interactive Touch Satellite Map + Custom Farm Size */}
            <FarmSatelliteMap
              lat={pinLat}
              lon={pinLon}
              flyTrigger={flyTrigger}
              farmSizeHa={farmSizeHa}
              soilWetnessPct={telemetry.latestGwetrootPct}
              elevationM={elevationM}
              terrainClass={terrainClass}
              isLoadingElevation={isLoadingElevation}
              exactPlaceName={exactPlaceName}
              isLoadingPlace={isLoadingPlace}
              t={t}
              farmCopy={farmCopy}
              onPinChange={handlePinChange}
              onFarmSizeChange={handleFarmSizeChange}
            />

            {/* Simple Farmer Inputs (Soil Type & Planned Crop) + Check If My Crop Will Work AI Summary */}
            <FarmAnalyzerPanel
              copy={farmCopy}
              soilKind={soilKind}
              plannedCrop={plannedCrop}
              onChangeSoilKind={handleSoilKindChange}
              onChangePlannedCrop={handlePlannedCropChange}
              onAnalyze={handleAnalyzeFarm}
              isAnalyzing={isAnalyzing}
              analysis={analysisResult}
              analysisError={analysisError}
              isStale={isAnalysisStale}
              farmDetails={{
                lgaName: selectedLga.name,
                exactPlaceName,
                lat: pinLat,
                lon: pinLon,
                elevationM,
                terrainLabel: t.terrainLabels[terrainClass],
                farmSizeHa,
                soilWetnessPct: telemetry.latestGwetrootPct,
                viableDays: telemetry.viableDays,
                dailyLossMm: telemetry.recentAvgLossMm,
                maxTempC: telemetry.latestTempMaxC,
                soilWaterLeftLabel: t.soilWaterLeftLabel,
                daysUnit: t.daysUnit,
                soilWetnessLabel: t.soilWetnessLabel,
                soilVerdictText: telemetry.isViable ? t.verdictGood : t.verdictDry,
              }}
            />

            {/* Section 1: Water Status Card */}
            <WaterStatusCard
              telemetry={telemetry}
              elevationM={elevationM}
              terrainClass={terrainClass}
              t={t}
              isLoading={isLoadingTelemetry}
            />

            {/* Section 2: Simple Soil Water Chart */}
            <SoilWaterChart
              points={telemetry.points}
              t={t}
              simpleMode={simpleMode}
              isLoading={isLoadingTelemetry}
            />

            {/* Section 3: 3 Crop Rotation Options (FAO GAEZ Calibrated) */}
            <RotationCards t={t} simpleMode={simpleMode} isViable={telemetry.isViable} />

            {/* Subtle Bottom NASA Data Badge */}
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => setIsNasaPopupOpen(true)}
                className="min-h-[40px] px-4 py-2 rounded-full text-xs text-[#525E56] hover:text-[#1B4332] hover:bg-white border border-transparent hover:border-[#E5E0D5] transition-colors inline-flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#1B4332]"
              >
                <Satellite className="w-3.5 h-3.5 text-[#1B4332] shrink-0" aria-hidden="true" />
                <span>{t.nasaBadgeText}</span>
              </button>
            </div>
          </main>

          {/* Clean Round Floating AI Icon Button (Bottom-Right Corner, Icon Only) */}
          {!isAiOpen && (
            <button
              type="button"
              onClick={() => setIsAiOpen(true)}
              aria-label={t.aiTitle}
              className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-[#1B4332] text-white shadow-lg hover:bg-[#143326] active:scale-95 transition-all flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
            >
              <Sparkles className="w-6 h-6" aria-hidden="true" />
            </button>
          )}
        </div>
      )}

      {/* Modals & Sheets */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        t={t}
        language={language}
        onSelectLanguage={setLanguage}
        simpleMode={simpleMode}
        onToggleSimpleMode={() => setSimpleMode((prev) => !prev)}
      />

      <NasaSourcesModal
        isOpen={isNasaPopupOpen}
        onClose={() => setIsNasaPopupOpen(false)}
        t={t}
        simpleMode={simpleMode}
      />

      <AiAdvisorSheet
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        t={t}
        messages={chatMessages}
        isSending={isSendingAi}
        onSendMessage={handleSendAiMessage}
        lgaName={`${selectedLga.name} · ${farmSizeHa} ha · ${elevationM}m`}
        viableDays={telemetry.viableDays}
      />
    </>
  );
}
