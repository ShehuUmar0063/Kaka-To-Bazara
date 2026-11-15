import type {
  Language,
  NigeriaCropAnalysisResult,
  PlantingCalendarResult,
} from '../types/farm';

export interface NigerianCropPreset {
  id: string;
  labels: Record<Language, string>;
}

export const NIGERIAN_CROP_PRESETS: NigerianCropPreset[] = [
  {
    id: 'cowpea',
    labels: {
      en: '60-Day Cowpea / Beans',
      ha: 'Waken Kwana 60 (Wake)',
      ff: 'Nyebbe Balɗe 60',
      pcm: '60-Day Cowpea / Beans',
    },
  },
  {
    id: 'maize',
    labels: {
      en: 'Maize',
      ha: 'Masara',
      ff: 'Butaali / Masara',
      pcm: 'Maize (Corn)',
    },
  },
  {
    id: 'rice',
    labels: {
      en: 'Lowland Rice',
      ha: 'Shinkafar Fadama',
      ff: 'Maaro Fadama',
      pcm: 'Lowland Rice',
    },
  },
  {
    id: 'sorghum',
    labels: {
      en: 'Sorghum',
      ha: 'Dawa',
      ff: 'Bayeeri / Dawa',
      pcm: 'Sorghum (Guinea Corn)',
    },
  },
  {
    id: 'millet',
    labels: {
      en: 'Millet',
      ha: 'Gero',
      ff: 'Muuri / Gero',
      pcm: 'Millet',
    },
  },
  {
    id: 'groundnut',
    labels: {
      en: 'Groundnut',
      ha: 'Gyada',
      ff: 'Biriiji / Gyada',
      pcm: 'Groundnut',
    },
  },
  {
    id: 'sesame',
    labels: {
      en: 'Sesame',
      ha: 'Ridi',
      ff: 'Noome / Ridi',
      pcm: 'Sesame (Beniseed)',
    },
  },
  {
    id: 'tomato_pepper',
    labels: {
      en: 'Tomato & Peppers',
      ha: 'Tumatir da Barkono',
      ff: 'Tumaati e Citta',
      pcm: 'Tomato & Pepper',
    },
  },
  {
    id: 'onions',
    labels: {
      en: 'Onions',
      ha: 'Albasa',
      ff: 'Tingeeje / Albasa',
      pcm: 'Onions',
    },
  },
  {
    id: 'yam',
    labels: {
      en: 'Yam',
      ha: 'Doya',
      ff: 'Doya / Kappu',
      pcm: 'Yam',
    },
  },
  {
    id: 'cassava',
    labels: {
      en: 'Cassava',
      ha: 'Rogo',
      ff: 'Mbay / Rogo',
      pcm: 'Cassava',
    },
  },
  {
    id: 'soybean',
    labels: {
      en: 'Soybean',
      ha: 'Waken Suya',
      ff: 'Nyebbe Suya',
      pcm: 'Soyabeans',
    },
  },
  {
    id: 'ginger',
    labels: {
      en: 'Ginger',
      ha: 'Citta Mai Yatsu',
      ff: 'Citta',
      pcm: 'Ginger',
    },
  },
  {
    id: 'cocoa',
    labels: {
      en: 'Cocoa',
      ha: 'Koko',
      ff: 'Koko',
      pcm: 'Cocoa',
    },
  },
];

export interface NigeriaFinderCopy {
  tabGombe: string;
  tabNigeria: string;
  title: string;
  subtitle: string;
  presetLabel: string;
  customLabel: string;
  customPlaceholder: string;
  findBtn: string;
  findingBtn: string;
  topRegionsHeading: string;
  topRegionsHint: string;
  plantingWindowLabel: string;
  keyRiskLabel: string;
  liveNasaHeading: string;
  wetnessLabel: string;
  peakTempLabel: string;
  waterLeftLabel: string;
  elevationLabel: string;
  daysUnit: string;
  openMapsLabel: string;
  tapCardHint: string;
  layerAerial: string;
  layerModis: string;
  layerSmap: string;
  subTabPlaces: string;
  subTabCalendar: string;
  calendarLocationLabel: string;
  calendarCustomLocationLabel: string;
  calendarCustomLocationPlaceholder: string;
  calendarBuildBtn: string;
  calendarBuildingBtn: string;
  calendarRainySummaryLabel: string;
  calendarRainFedTitle: string;
  calendarDrySeasonTitle: string;
  calendarPlantLabel: string;
  calendarHarvestLabel: string;
  calendarLegendRainPlant: string;
  calendarLegendDryPlant: string;
  calendarLegendHarvest: string;
  calendarLegendGrowRest: string;
  calendarRainLevels: Record<'dry' | 'light' | 'moderate' | 'heavy', string>;
}

export interface NigeriaLocationPreset {
  id: string;
  name: string;
  zone: string;
  rainMonths: [number, number]; // 1-indexed start & end of rainy season
}

export const NIGERIA_CALENDAR_LOCATIONS: NigeriaLocationPreset[] = [
  { id: 'gombe', name: 'Gombe (Dadinkowa / Akko)', zone: 'Sudan-Guinea Transition & Fadama', rainMonths: [5, 10] },
  { id: 'kano', name: 'Kano (Kadawa / Kano Basin)', zone: 'Sudan Savanna', rainMonths: [6, 9] },
  { id: 'kaduna', name: 'Kaduna (Zaria / Kafanchan)', zone: 'Northern Guinea Savanna', rainMonths: [5, 10] },
  { id: 'jigawa', name: "Jigawa (Hadejia-Jama'are)", zone: 'Sudan Savanna Fadama', rainMonths: [6, 9] },
  { id: 'sokoto', name: 'Sokoto (Goronyo / Rima Basin)', zone: 'Sahel-Sudan Fadama', rainMonths: [6, 9] },
  { id: 'kebbi', name: 'Kebbi (Argungu / Birnin Kebbi)', zone: 'Sokoto-Rima Floodplain', rainMonths: [6, 9] },
  { id: 'zamfara', name: 'Zamfara (Bakolori / Talata Mafara)', zone: 'Sudan Savanna', rainMonths: [6, 9] },
  { id: 'benue', name: 'Benue (Makurdi / Gboko Valley)', zone: 'Southern Guinea Savanna', rainMonths: [4, 10] },
  { id: 'plateau', name: 'Plateau (Jos South / Pankshin)', zone: 'Mid-Altitude Plateau', rainMonths: [4, 10] },
  { id: 'nasarawa', name: 'Nasarawa (Lafia / Doma Basin)', zone: 'Guinea Savanna', rainMonths: [4, 10] },
  { id: 'niger', name: 'Niger (Bida / Mokwa)', zone: 'Southern Guinea Savanna', rainMonths: [5, 10] },
  { id: 'adamawa', name: 'Adamawa (Yola / Numan Basin)', zone: 'Benue-Gongola Valley', rainMonths: [5, 10] },
  { id: 'ondo', name: 'Ondo (Akure / Idanre)', zone: 'Tropical Rainforest', rainMonths: [3, 11] },
  { id: 'oyo', name: 'Oyo (Ibadan / Ogbomoso)', zone: 'Derived Savanna & Forest', rainMonths: [3, 11] },
  { id: 'enugu', name: 'Enugu (Nsukka / Adani Basin)', zone: 'Derived Savanna & Rainforest', rainMonths: [3, 11] },
];

export const NIGERIA_FINDER_COPY: Record<Language, NigeriaFinderCopy> = {
  en: {
    tabGombe: 'My Farm Checker',
    tabNigeria: 'Nigeria Crop Finder',
    title: 'Nigeria Crop Finder',
    subtitle: 'Pick any crop to see the best states, planting calendar, and live NASA satellite soil conditions across Nigeria.',
    presetLabel: 'Choose a Nigerian Crop',
    customLabel: 'Or Type Any Crop Name',
    customPlaceholder: 'e.g. Watermelon, Sweet Potato, Tiger Nut…',
    findBtn: 'Find Best Farming Places in Nigeria',
    findingBtn: 'Checking Nigeria zones & soils…',
    topRegionsHeading: 'Top 4 Best States & Basins',
    topRegionsHint: 'Tap any state card below to inspect its live NASA soil wetness & satellite farmland view',
    plantingWindowLabel: 'Best Planting & Harvest Window',
    keyRiskLabel: 'Key Risk to Watch Out For',
    liveNasaHeading: 'Live NASA Satellite Check',
    wetnessLabel: 'Soil Wetness',
    peakTempLabel: 'Peak Heat',
    waterLeftLabel: 'Water Left',
    elevationLabel: 'Elevation',
    daysUnit: 'Days',
    openMapsLabel: 'Open Spot in Google Maps',
    tapCardHint: 'Selected for satellite inspection',
    layerAerial: 'Hybrid Satellite',
    layerModis: 'NASA MODIS',
    layerSmap: 'NASA SMAP',
    subTabPlaces: 'Best Farming Places',
    subTabCalendar: 'Planting Calendar',
    calendarLocationLabel: 'Choose State / Farming Location',
    calendarCustomLocationLabel: 'Or Type Town / State',
    calendarCustomLocationPlaceholder: 'e.g. Bauchi, Taraba, Kwara…',
    calendarBuildBtn: 'Generate AI Planting Calendar',
    calendarBuildingBtn: 'Building month-by-month calendar…',
    calendarRainySummaryLabel: 'Typical Rainy Season Pattern',
    calendarRainFedTitle: 'Rain-Fed Season',
    calendarDrySeasonTitle: 'Dry-Season / Fadama Residual',
    calendarPlantLabel: 'Plant',
    calendarHarvestLabel: 'Harvest',
    calendarLegendRainPlant: 'Rain-Fed Planting',
    calendarLegendDryPlant: 'Dry / Fadama Planting',
    calendarLegendHarvest: 'Harvest Window',
    calendarLegendGrowRest: 'Growing / Prep / Rest',
    calendarRainLevels: {
      dry: 'Dry',
      light: 'Light Rain',
      moderate: 'Steady Rain',
      heavy: 'Peak Rain',
    },
  },
  ha: {
    tabGombe: 'Binciken Gonata',
    tabNigeria: 'Neman Wurin Noma a Najeriya',
    title: 'Neman Wurin Noma a Najeriya',
    subtitle: 'Zabi kowane irin amfani don ganin jihohin da suka fi dacewa, kalandar shuka, da halin danshin kasa na NASA.',
    presetLabel: 'Zabi Irin Shukar Najeriya',
    customLabel: 'Ko Rubuta Sunan Wata Shuka',
    customPlaceholder: 'Misali: Kankana, Dankali, Aya…',
    findBtn: 'Nemo Wuraren Noma Mafi Kyau a Najeriya',
    findingBtn: 'Ana binciken jihohin Najeriya…',
    topRegionsHeading: 'Jihohi 4 Mafi Kyau da Yankunan Noma',
    topRegionsHint: 'Danna kowane katin jiha don ganin damshin kasa na NASA da taswirar gona kai tsaye',
    plantingWindowLabel: 'Mafi Kyawun Lokacin Shuka da Girbi',
    keyRiskLabel: 'Babban Hadarin da Za a Kula da Shi',
    liveNasaHeading: 'Binciken Tauraron Dan Adam na NASA Kai Tsaye',
    wetnessLabel: 'Damshin Kasa',
    peakTempLabel: 'Zafin Rana',
    waterLeftLabel: 'Kwanakin Ruwa',
    elevationLabel: 'Tsayin Kasa',
    daysUnit: 'Kwana',
    openMapsLabel: 'Bude a Google Maps',
    tapCardHint: 'An zaba don duba taswira',
    layerAerial: 'Taswirar Sama',
    layerModis: 'NASA MODIS',
    layerSmap: 'NASA SMAP',
    subTabPlaces: 'Mafi Kyawun Wuraren Noma',
    subTabCalendar: 'Kalandar Shuka',
    calendarLocationLabel: 'Zabi Jiha / Wurin Noma',
    calendarCustomLocationLabel: 'Ko Rubuta Gari / Jiha',
    calendarCustomLocationPlaceholder: 'Misali: Bauchi, Taraba, Katsina…',
    calendarBuildBtn: 'Fitar da Kalandar Shuka ta AI',
    calendarBuildingBtn: 'Ana tsara kalandar watanni 12…',
    calendarRainySummaryLabel: 'Tsarin Damina a Wannan Wuri',
    calendarRainFedTitle: 'Lokacin Damina',
    calendarDrySeasonTitle: 'Lokacin Rani / Fadama',
    calendarPlantLabel: 'Shuka',
    calendarHarvestLabel: 'Girbi',
    calendarLegendRainPlant: 'Shukar Damina',
    calendarLegendDryPlant: 'Shukar Rani / Fadama',
    calendarLegendHarvest: 'Lokacin Girbi',
    calendarLegendGrowRest: 'Girma / Shiri / Hutu',
    calendarRainLevels: {
      dry: 'Rani',
      light: 'Karamin Ruwa',
      moderate: 'Ruwa Sosai',
      heavy: 'Kololuwar Ruwa',
    },
  },
  ff: {
    tabGombe: 'Ɓeto Ngesa Am',
    tabNigeria: 'Yiylagol Nokku Demal Naajeeriya',
    title: 'Yiylagol Nokku Demal Naajeeriya',
    subtitle: 'Suɓo kala aawdi ngam yiyde diiwanuuji ɓurɗi moƴƴude, limlebbi aawgol, e ngonka ndiyam leydi NASA.',
    presetLabel: 'Suɓo Aawdi Naajeeriya',
    customLabel: 'Walla Winndu Innde Aawdi Goɗɗi',
    customPlaceholder: 'Yeru: Dende, Kudaku, Aya…',
    findBtn: 'Yiylo Nokkuuje Demal Ɓurɗe Moƴƴude',
    findingBtn: 'Ina ƴeewa diiwanuuji Naajeeriya…',
    topRegionsHeading: 'Diiwanuuji 4 Ɓurɗi Moƴƴude',
    topRegionsHint: 'Ñoƴƴu kartal diiwal ngam yiyde ndiyam leydi NASA e foto satelit ngesa',
    plantingWindowLabel: 'Sahaa Aawgol e Koƴgol Ɓurɗo Moƴƴude',
    keyRiskLabel: 'Mbonndi Potndi Reentaade',
    liveNasaHeading: 'Ɓeto Satelit NASA Jooni',
    wetnessLabel: 'Ndiyam Leydi',
    peakTempLabel: 'Nguleeki',
    waterLeftLabel: 'Balɗe Ndiyam',
    elevationLabel: 'Tooweendi',
    daysUnit: 'Balɗe',
    openMapsLabel: 'Uddit e Google Maps',
    tapCardHint: 'Suɓaama ngam ƴeewde kartal',
    layerAerial: 'Foto Satelit',
    layerModis: 'NASA MODIS',
    layerSmap: 'NASA SMAP',
    subTabPlaces: 'Nokkuuje Ɓurɗe Moƴƴude',
    subTabCalendar: 'Limlebbi Aawgol',
    calendarLocationLabel: 'Suɓo Diiwal / Nokku',
    calendarCustomLocationLabel: 'Walla Winndu Wuro / Diiwal',
    calendarCustomLocationPlaceholder: 'Yeru: Bauchi, Taraba, Adamawa…',
    calendarBuildBtn: 'Feewnu Limlebbi Aawgol AI',
    calendarBuildingBtn: 'Ina feewna limlebbi lebbi 12…',
    calendarRainySummaryLabel: 'Ngonka Nduungu e Nokku Oo',
    calendarRainFedTitle: 'Sahaa Nduungu',
    calendarDrySeasonTitle: 'Sahaa Ceedu / Fadama',
    calendarPlantLabel: 'Aawgol',
    calendarHarvestLabel: 'Koƴgol',
    calendarLegendRainPlant: 'Aawgol Nduungu',
    calendarLegendDryPlant: 'Aawgol Ceedu / Fadama',
    calendarLegendHarvest: 'Sahaa Koƴgol',
    calendarLegendGrowRest: 'Mawnugol / Heɓlude',
    calendarRainLevels: {
      dry: 'Ceedu',
      light: 'Toɓo Seɗa',
      moderate: 'Toɓo Moƴƴo',
      heavy: 'Toɓo Mawngo',
    },
  },
  pcm: {
    tabGombe: 'My Farm Checker',
    tabNigeria: 'Nigeria Crop Finder',
    title: 'Nigeria Crop Finder',
    subtitle: 'Pick any crop wey you wan harvest to see the best states for Nigeria, planting calendar, and live NASA soil water.',
    presetLabel: 'Pick Nigerian Crop',
    customLabel: 'Or Type Any Crop Name',
    customPlaceholder: 'e.g. Watermelon, Sweet Potato, Tiger Nut…',
    findBtn: 'Find Best Farming Places in Nigeria',
    findingBtn: 'Dey check states & soil for Nigeria…',
    topRegionsHeading: 'Top 4 Best States & Farming Areas',
    topRegionsHint: 'Tap any state card below to check live NASA soil water and see the farmland map',
    plantingWindowLabel: 'Best Planting & Harvest Time',
    keyRiskLabel: 'Main Risk Make You Watch Out',
    liveNasaHeading: 'Live NASA Satellite Check',
    wetnessLabel: 'Soil Wetness',
    peakTempLabel: 'Peak Heat',
    waterLeftLabel: 'Water Left',
    elevationLabel: 'Height',
    daysUnit: 'Days',
    openMapsLabel: 'Open Spot for Google Maps',
    tapCardHint: 'Selected for map check',
    layerAerial: 'Hybrid Satellite',
    layerModis: 'NASA MODIS',
    layerSmap: 'NASA SMAP',
    subTabPlaces: 'Best Farming Places',
    subTabCalendar: 'Planting Calendar',
    calendarLocationLabel: 'Pick State / Farming Area',
    calendarCustomLocationLabel: 'Or Type Town / State',
    calendarCustomLocationPlaceholder: 'e.g. Bauchi, Taraba, Kwara…',
    calendarBuildBtn: 'Make AI Planting Calendar',
    calendarBuildingBtn: 'Dey arrange 12-month calendar…',
    calendarRainySummaryLabel: 'Normal Rainy Season Pattern',
    calendarRainFedTitle: 'Rainy Season Farming',
    calendarDrySeasonTitle: 'Dry-Season / Fadama Farming',
    calendarPlantLabel: 'Plant',
    calendarHarvestLabel: 'Harvest',
    calendarLegendRainPlant: 'Rainy Planting',
    calendarLegendDryPlant: 'Dry / Fadama Planting',
    calendarLegendHarvest: 'Harvest Time',
    calendarLegendGrowRest: 'Growing / Prep / Rest',
    calendarRainLevels: {
      dry: 'Dry',
      light: 'Small Rain',
      moderate: 'Steady Rain',
      heavy: 'Heavy Rain',
    },
  },
};

export function buildStaticNigeriaCropResult(
  cropName: string,
  language: Language
): NigeriaCropAnalysisResult {
  const lower = cropName.toLowerCase();

  const isRootOrRainforest =
    lower.includes('cocoa') ||
    lower.includes('koko') ||
    lower.includes('yam') ||
    lower.includes('doya') ||
    lower.includes('cassava') ||
    lower.includes('rogo') ||
    lower.includes('ginger') ||
    lower.includes('citta');

  const isIrrigationOrFadama =
    lower.includes('rice') ||
    lower.includes('shinkafa') ||
    lower.includes('maaro') ||
    lower.includes('tomato') ||
    lower.includes('tumatir') ||
    lower.includes('onion') ||
    lower.includes('albasa');

  if (isRootOrRainforest) {
    return {
      cropName,
      summary:
        language === 'ha'
          ? `${cropName} na bukatar ruwan sama mai yawa ko kasar daji/tsakiya mai zurfi da danshi na tsawon watanni da dama.`
          : `${cropName} thrives in deep, well-drained loamy soils with long rainy seasons across Nigeria’s Guinea Savanna, Mid-Altitude, and Rainforest belts.`,
      plantingWindow:
        language === 'ha'
          ? 'A shuka da farkon damina (Afrilu zuwa Yuni) don amfani da dogon ruwan sama.'
          : 'Rain-fed planting from April to June works best so crops establish before peak rains and harvest cleanly.',
      keyRisk:
        language === 'ha'
          ? 'Kwanciyar ruwa a kasa ko tsutsar tushe na iya lalata amfani idan babu magudanar ruwa.'
          : 'Waterlogging or fungal root rot in poorly drained clay depressions.',
      topRegions: [
        {
          stateName: 'Benue State',
          townBasin: 'Gboko / Benue Valley',
          ecologicalZone: 'Southern Guinea Savanna',
          lat: 7.336,
          lon: 9.005,
          whyItFits: 'Deep alluvial loams and a 7-month rainy season ideal for heavy root and tree crop growth.',
        },
        {
          stateName: 'Kaduna State',
          townBasin: 'Kafanchan / Southern Kaduna',
          ecologicalZone: 'Mid-Altitude / Guinea Savanna',
          lat: 9.581,
          lon: 8.292,
          whyItFits: 'Cooler mid-altitude temperatures and fertile loamy soils renowned for ginger and root crops.',
        },
        {
          stateName: 'Ondo State',
          townBasin: 'Idanre / Akure Belt',
          ecologicalZone: 'Tropical Rainforest',
          lat: 7.103,
          lon: 5.115,
          whyItFits: 'High annual rainfall, rich forest humus, and shaded humidity suited for cocoa and cassava.',
        },
        {
          stateName: 'Nasarawa State',
          townBasin: 'Lafia / Doma Basin',
          ecologicalZone: 'Guinea Savanna',
          lat: 8.494,
          lon: 8.515,
          whyItFits: 'Balanced sandy-loam ridges that drain excess storm rain while holding deep moisture.',
        },
      ],
    };
  }

  if (isIrrigationOrFadama) {
    return {
      cropName,
      summary:
        language === 'ha'
          ? `${cropName} na bunƙasa sosai a filayen Fadama da kwarin koguna inda kasa ke rike da ruwa bayan damina.`
          : `${cropName} yields best in fertile Fadama floodplains and river basins with steady root-zone water and bright dry-season sunshine.`,
      plantingWindow:
        language === 'ha'
          ? 'Damina (Yuli–Agusta) ko noman rani na Fadama (Oktoba–Janairu).'
          : 'Rain-fed planting in July–August, plus high-value dry-season Fadama relay planting from October to January.',
      keyRisk:
        language === 'ha'
          ? 'Zafin rana mai tsanani ko bushewar ruwa lokacin fitowar furanni/ya’ya.'
          : 'Mid-season dry spells or heat stress during flowering if basin moisture drops too fast.',
      topRegions: [
        {
          stateName: 'Gombe State',
          townBasin: 'Dadinkowa / Yamaltu-Deba',
          ecologicalZone: 'Fadama River Basin',
          lat: 10.32,
          lon: 11.48,
          whyItFits: 'Rich Dadinkowa Gongola Fadama clay holds moisture well into the dry season for rice and vegetables.',
        },
        {
          stateName: 'Jigawa State',
          townBasin: "Hadejia-Jama'are Basin",
          ecologicalZone: 'Sudan Savanna Fadama',
          lat: 12.453,
          lon: 10.041,
          whyItFits: 'Expansive alluvial floodplains ideal for lowland rice, onions, and dry-season tomato.',
        },
        {
          stateName: 'Kebbi State',
          townBasin: 'Argungu / Birnin Kebbi Fadama',
          ecologicalZone: 'Sokoto-Rima River Basin',
          lat: 12.744,
          lon: 4.525,
          whyItFits: 'Deep floodplain soils with reliable residual river moisture supporting high-tonnage rice and onions.',
        },
        {
          stateName: 'Kano State',
          townBasin: 'Kadawa / Kano River Basin',
          ecologicalZone: 'Sudan Savanna Basin',
          lat: 11.645,
          lon: 8.431,
          whyItFits: 'Well-established river basin loams with cool Harmattan nights ideal for onions and tomatoes.',
        },
      ],
    };
  }

  return {
    cropName,
    summary:
      language === 'ha'
        ? `${cropName} ya dace da yankunan Savanna na Najeriya masu isasshen hasken rana da kasa mai gami-gami.`
        : `${cropName} performs strongly across Nigeria’s Sudan and Guinea Savanna belts in warm, well-drained soils with good post-rain moisture.`,
    plantingWindow:
      language === 'ha'
        ? 'Shukar damina a watan Yuni–Yuli ko shukar rani a karshen Satumba–Oktoba a wuraren Fadama.'
        : 'Main rain-fed window from June–July, with short-cycle relay planting in late September–October on moist lowlands.',
    keyRisk:
      language === 'ha'
        ? 'Ciyawa da kwari a farkon girma da kuma karancin ruwa idan an makara shuka.'
        : 'Late planting into fast-drying sandy upland soils and early weed competition.',
    topRegions: [
      {
        stateName: 'Gombe State',
        townBasin: 'Dadinkowa / Akko Corridor',
        ecologicalZone: 'Sudan-Guinea Transition',
        lat: 10.32,
        lon: 11.48,
        whyItFits: 'Fertile savanna loams and Fadama moisture pockets support strong legume and grain harvests.',
      },
      {
        stateName: 'Kaduna State',
        townBasin: 'Zaria / Giwa Belt',
        ecologicalZone: 'Northern Guinea Savanna',
        lat: 11.085,
        lon: 7.719,
        whyItFits: 'Balanced rainfall and deep loamy plains ideal for maize, sorghum, soybean, and cowpea.',
      },
      {
        stateName: 'Zamfara State',
        townBasin: 'Bakolori / Talata Mafara',
        ecologicalZone: 'Sudan Savanna Basin',
        lat: 12.567,
        lon: 6.062,
        whyItFits: 'Warm sunshine and river-basin moisture favor fast-maturing cowpea, millet, and groundnut.',
      },
      {
        stateName: 'Plateau State',
        townBasin: 'Jos South / Pankshin',
        ecologicalZone: 'Mid-Altitude Plateau',
        lat: 9.754,
        lon: 8.867,
        whyItFits: 'Mild daytime temperatures reduce moisture evaporation and boost grain and vegetable quality.',
      },
    ],
  };
}

export function buildStaticPlantingCalendar(
  cropName: string,
  locationName: string,
  language: Language
): PlantingCalendarResult {
  const lowerLoc = locationName.toLowerCase();
  const isSouthern =
    lowerLoc.includes('ondo') ||
    lowerLoc.includes('oyo') ||
    lowerLoc.includes('enugu') ||
    lowerLoc.includes('benue');

  const rainStart = isSouthern ? 4 : 6;
  const rainEnd = isSouthern ? 10 : 9;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const months = monthNames.map((m, i) => {
    const idx = i + 1;
    if (idx === rainStart - 1) {
      return { month: m, phase: 'land_prep' as const, rainLevel: 'light' as const, note: 'Clear & prepare ridges' };
    }
    if (idx === rainStart) {
      return { month: m, phase: 'rain_plant' as const, rainLevel: 'moderate' as const, note: 'Ideal rain-fed planting' };
    }
    if (idx > rainStart && idx < rainEnd) {
      return {
        month: m,
        phase: 'rain_grow' as const,
        rainLevel: idx === rainEnd - 1 ? ('heavy' as const) : ('moderate' as const),
        note: 'Active growth & weeding',
      };
    }
    if (idx === rainEnd) {
      return { month: m, phase: 'rain_harvest' as const, rainLevel: 'light' as const, note: 'Harvest rain-fed crop' };
    }
    if (idx === rainEnd + 1) {
      return { month: m, phase: 'dry_plant' as const, rainLevel: 'dry' as const, note: 'Fadama / residual planting' };
    }
    if (idx === 1 || idx === 2) {
      return { month: m, phase: 'dry_harvest' as const, rainLevel: 'dry' as const, note: 'Dry-season harvest' };
    }
    return { month: m, phase: 'off_season' as const, rainLevel: 'dry' as const, note: 'Mulch & rest soil' };
  });

  return {
    cropName,
    locationName,
    rainySeasonSummary:
      language === 'ha'
        ? `A yankin ${locationName}, ruwan sama yawanci yana fara sauka a watan ${monthNames[rainStart - 1]} kuma ya kare a ${monthNames[rainEnd - 1]}.`
        : `In ${locationName}, steady rains typically run from ${monthNames[rainStart - 1]} to ${monthNames[rainEnd - 1]}, leaving residual Fadama moisture through ${monthNames[rainEnd]}.`,
    rainFedWindow: {
      plantMonths: `${monthNames[rainStart - 1]} – ${monthNames[rainStart]}`,
      harvestMonths: `${monthNames[rainEnd - 1]} – ${monthNames[rainEnd]}`,
      tip: 'Sow once the first two steady rains soak the top 15 cm of soil.',
    },
    drySeasonWindow: {
      plantMonths: `${monthNames[rainEnd]} – ${monthNames[Math.min(11, rainEnd + 1)]}`,
      harvestMonths: 'Jan – Feb',
      tip: 'Best in lowland Fadama or deep clay basins that keep moisture after rains retreat.',
      isRecommended: true,
    },
    months,
  };
}
