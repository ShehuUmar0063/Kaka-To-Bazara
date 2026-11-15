import type { Language, NigeriaCropAnalysisResult } from '../types/farm';

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
}

export const NIGERIA_FINDER_COPY: Record<Language, NigeriaFinderCopy> = {
  en: {
    tabGombe: 'My Farm Checker',
    tabNigeria: 'Nigeria Crop Finder',
    title: 'Nigeria Crop Finder',
    subtitle: 'Pick any crop to see the best states, planting windows, and live NASA satellite soil conditions across Nigeria.',
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
  },
  ha: {
    tabGombe: 'Binciken Gonata',
    tabNigeria: 'Neman Wurin Noma a Najeriya',
    title: 'Neman Wurin Noma a Najeriya',
    subtitle: 'Zabi kowane irin amfani don ganin jihohin da suka fi dacewa, lokacin shuka, da halin danshin kasa na tauraron dan adam na NASA.',
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
  },
  ff: {
    tabGombe: 'Ɓeto Ngesa Am',
    tabNigeria: 'Yiylagol Nokku Demal Naajeeriya',
    title: 'Yiylagol Nokku Demal Naajeeriya',
    subtitle: 'Suɓo kala aawdi ngam yiyde diiwanuuji ɓurɗi moƴƴude, sahaa aawgol, e ngonka ndiyam leydi NASA e nder Naajeeriya.',
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
  },
  pcm: {
    tabGombe: 'My Farm Checker',
    tabNigeria: 'Nigeria Crop Finder',
    title: 'Nigeria Crop Finder',
    subtitle: 'Pick any crop wey you wan harvest to see the best states for Nigeria, best planting time, and live NASA soil water.',
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
