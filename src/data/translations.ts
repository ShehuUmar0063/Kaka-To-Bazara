import type { Language, RotationOptionId, TerrainClass } from '../types/farm';

export interface RotationOptionCopy {
  title: string;
  tag: string;
  waterLine: string;
  faoGaezBadge: string;
  keyPoint: string;
  whyNasaTech: string;
  whyNasaSimple: string;
  dataGaps: string;
  farmerChecks: string;
}

export interface NasaSourceCredit {
  name: string;
  detailTech: string;
  detailSimple: string;
}

export interface TranslationPack {
  langLabel: string;
  speechLang: string;
  appTitle: string;

  // Welcome Screen
  welcomeIntro: string;
  startExploring: string;

  // Settings Modal
  settingsTitle: string;
  languageLabel: string;
  simpleModeLabel: string;
  simpleModeHint: string;
  doneLabel: string;

  // Main Screen
  lgaPickerLabel: string;
  loadingLabel: string;

  // SRTM Elevation & Terrain
  elevationLabel: string;
  terrainLabels: Record<TerrainClass, string>;
  retentionAdjustedNote: string;

  // Satellite Map ("Pin Your Exact Farm")
  mapTitle: string;
  mapTapHint: string;
  useGpsBtn: string;
  gpsLocating: string;
  gpsUnsupported: string;
  gpsDenied: string;
  openGoogleMapsBtn: string;
  plotSizeLabel: string;
  higherMoistureZoneLabel: string;
  drierZoneLabel: string;
  layerAerial: string;
  layerModis: string;
  layerSmap: string;
  opacityLabel: string;
  zoomPlotBtn: string;
  zoomRegionBtn: string;
  exactPlaceLabel: string;

  // Section 1: Water Status Card
  soilWaterLeftLabel: string;
  daysUnit: string;
  soilWetnessLabel: string;
  verdictLabel: string;
  verdictGood: string;
  verdictDry: string;

  // Section 2: Simple Soil Water Chart
  chartTitleTech: string;
  chartTitleSimple: string;
  chartLegendTech: string;
  chartLegendSimple: string;

  // Section 3: 3 Crop Rotation Options
  optionsTitle: string;
  tapDetailsHint: string;
  faoCalibrationNote: string;
  modalWhyNasa: string;
  modalDataGaps: string;
  modalFarmerChecks: string;
  closeLabel: string;
  options: Record<RotationOptionId, RotationOptionCopy>;

  // Bottom NASA Badge & Sources Popup
  nasaBadgeText: string;
  nasaPopupTitle: string;
  nasaSourcesList: NasaSourceCredit[];
  nasaGlobalNoteTitle: string;
  nasaGlobalNoteBody: string;

  // Floating AI Chat Sheet
  aiTitle: string;
  aiGreeting: string;
  aiPlaceholder: string;
  aiSend: string;
  aiThinking: string;
  aiReadAloud: string;
  aiStopAudio: string;
  quickQuestions: string[];
}

export const TRANSLATIONS: Record<Language, TranslationPack> = {
  en: {
    langLabel: 'English',
    speechLang: 'en-NG',
    appTitle: 'Kaka-to-Bazara',

    welcomeIntro:
      'Find hidden soil water after harvest in Gombe State using NASA satellite data. Grow a bonus dry-season crop without fuel pumps.',
    startExploring: 'Start Exploring',

    settingsTitle: 'Settings',
    languageLabel: 'Language',
    simpleModeLabel: 'Simple Mode',
    simpleModeHint: 'Use plain farming words instead of NASA science terms',
    doneLabel: 'Done',

    lgaPickerLabel: 'Gombe Local Government Area',
    loadingLabel: 'Updating soil water…',

    elevationLabel: 'SRTM 30m Elevation',
    terrainLabels: {
      lowland: 'Lowland Basin',
      valley: 'Mid-Valley',
      upland: 'Upland Slope',
    },
    retentionAdjustedNote: 'Retention adjusted for terrain drainage',

    mapTitle: 'Pin Your Exact Farm',
    mapTapHint: 'Tap map or drag pin to update live NASA soil water & SRTM elevation',
    useGpsBtn: 'Use My Current GPS Location',
    gpsLocating: 'Finding GPS…',
    gpsUnsupported: 'GPS is not supported on this device.',
    gpsDenied: 'Location permission denied. Tap the map to pin manually.',
    openGoogleMapsBtn: 'Open Exact Spot in Google Maps',
    plotSizeLabel: '1-Hectare Plot (100m × 100m)',
    higherMoistureZoneLabel: 'Higher Moisture Zone',
    drierZoneLabel: 'Drier Zone',
    layerAerial: 'Aerial Farm View',
    layerModis: 'NASA MODIS Vegetation',
    layerSmap: 'NASA SMAP Soil Moisture',
    opacityLabel: 'Overlay Opacity',
    zoomPlotBtn: 'Farm Zoom',
    zoomRegionBtn: 'Gombe View',
    exactPlaceLabel: 'Exact Place',

    soilWaterLeftLabel: 'Soil Water Left',
    daysUnit: 'Days',
    soilWetnessLabel: 'Soil Wetness',
    verdictLabel: 'Verdict',
    verdictGood: 'Good for 60-Day Cowpea',
    verdictDry: 'Too Dry — Mulch Recommended',

    chartTitleTech: 'Root-Zone Soil Wetness (Sept – Nov)',
    chartTitleSimple: 'Soil Water From September to November',
    chartLegendTech: 'GWETROOT Wetness (%)',
    chartLegendSimple: 'Soil Water (%)',

    optionsTitle: '3 Crop Rotation Options',
    tapDetailsHint: 'Calibrated to FAO GAEZ savanna crop standards · Tap card for details',
    faoCalibrationNote: 'Calibrated to FAO Global Agro-Ecological Zones (GAEZ)',
    modalWhyNasa: 'Why NASA & FAO GAEZ suggest it',
    modalDataGaps: 'Data gaps',
    modalFarmerChecks: 'Local farmer checks needed',
    closeLabel: 'Close',
    options: {
      bare: {
        title: 'Leave Field Bare',
        tag: 'Current Practice',
        waterLine: '0mm · 0 Days Water',
        faoGaezBadge: 'FAO GAEZ: Unprotected Fallow',
        keyPoint: 'Risk: Wind erosion & dry soil.',
        whyNasaTech:
          'MODIS/Landsat NDVI drops below 0.22 and ECOSTRESS shows bare soil heating +6°C hotter.',
        whyNasaSimple:
          'Satellite photos show bare ground gets +6°C hotter under the dry-season sun and loses topsoil.',
        dataGaps: 'Satellites cannot measure localized gully damage or Striga weed seed buildup.',
        farmerChecks: 'Leave harvested maize or sorghum stalks flat on the soil to block sun and wind.',
      },
      cowpea: {
        title: '60-Day Early Cowpea',
        tag: 'Recommended',
        waterLine: '180mm (Needs 55+ Days)',
        faoGaezBadge: 'FAO GAEZ Savanna Standard: 180mm',
        keyPoint: 'Benefit: Extra cash & adds soil nitrogen.',
        whyNasaTech:
          'NASA POWER GWETROOT and SMAP confirm Fadama and lowland basin soils meet the 180mm FAO GAEZ threshold for 60-day IT99K-573-1-1 cowpea.',
        whyNasaSimple:
          'Deep soil moisture stays long enough in lowland farms to meet the 180mm water mark for quick 60-day beans.',
        dataGaps: 'Satellites miss hard underground soil pans (15–20 cm) and local aphid outbreaks.',
        farmerChecks: 'Dig 20 cm to check moisture by hand and test 20 market seeds in wet cloth first.',
      },
      lablab: {
        title: 'Dual-Purpose Lablab / Fodder',
        tag: 'Soil Shield',
        waterLine: '150mm (Needs 50+ Days)',
        faoGaezBadge: 'FAO GAEZ Savanna Standard: 150mm',
        keyPoint: 'Benefit: Shades soil & feeds livestock.',
        whyNasaTech:
          'High EVPTRNS heat loss calls for fast canopy cover; deep taproots meet the 150mm FAO GAEZ drought-hardened fodder threshold.',
        whyNasaSimple:
          'Spreading green leaves cover the soil like an umbrella and grow rich feed for cattle and goats on 150mm of water.',
        dataGaps: 'Open-grazing cattle routes (burtali) are invisible on NASA satellite maps.',
        farmerChecks: 'Coordinate grazing boundaries with local herders or add thorn fencing around the plot.',
      },
    },

    nasaBadgeText: 'Powered by NASA Earth Data',
    nasaPopupTitle: 'NASA Sources Used',
    nasaSourcesList: [
      {
        name: 'NASA POWER',
        detailTech: 'Daily rainfall (PRECTOTCORR), max temperature (T2M_MAX), root-zone wetness (GWETROOT), and evapotranspiration (EVPTRNS).',
        detailSimple: 'Measures daily rain, afternoon sun heat, and deep root water across Gombe State.',
      },
      {
        name: 'NASA SMAP (L4)',
        detailTech: '9 km analyzed root-zone soil moisture GIBS imagery and lowland vs. upland retention modeling.',
        detailSimple: 'Space radar showing where valleys hold water while sandy hills dry out.',
      },
      {
        name: 'GPM / IMERG',
        detailTech: 'Global Precipitation Measurement satellite rainfall fusion underlying late-season recharge curves.',
        detailSimple: 'Tracks how much late rainy-season water soaked into the ground.',
      },
      {
        name: 'MODIS & Landsat NDVI',
        detailTech: '8-day MODIS Terra NDVI GIBS overlay and 30 m Landsat greenness for post-harvest cover checks.',
        detailSimple: 'Space leaf cameras showing green relay fields vs. bare dry ground.',
      },
      {
        name: 'SRTM 30m Elevation',
        detailTech: 'Live 30-meter digital elevation lookup adjusting moisture retention for lowland basins vs. upland slopes.',
        detailSimple: 'Measures exact farm height so low basins and high slopes get accurate water estimates.',
      },
      {
        name: 'ECOSTRESS',
        detailTech: '70 m land surface thermal stress insights comparing bare fallow (+6°C hotter) to shaded plots.',
        detailSimple: 'Shows how leaving soil bare makes the ground much hotter in the sun.',
      },
      {
        name: 'FAO GAEZ',
        detailTech: 'Global Agro-Ecological Zones savanna crop water suitability thresholds (180mm Cowpea, 150mm Lablab).',
        detailSimple: 'Global crop rules confirming how much water cowpea (180mm) and lablab (150mm) need.',
      },
    ],
    nasaGlobalNoteTitle: 'Why Global Equivalents Were Used for Nigeria',
    nasaGlobalNoteBody:
      'U.S.-only datasets like USDA SSURGO soil surveys and the USDA Cropland Data Layer (CDL) cover only the United States. We replaced them with official global equivalents—FAO GAEZ crop suitability and SRTM 30m terrain drainage—so Gombe State farmers get accurate local results.',

    aiTitle: 'Farm Extension Assistant',
    aiGreeting:
      'Hello! Ask me anything about soil water, your farm’s elevation, 60-day cowpea (180mm), or protecting your plot in this Gombe LGA.',
    aiPlaceholder: 'Ask a farming question…',
    aiSend: 'Send',
    aiThinking: 'Checking advice…',
    aiReadAloud: 'Listen',
    aiStopAudio: 'Stop',
    quickQuestions: [
      'Can 60-day cowpea survive here?',
      'How does my elevation affect drainage?',
      'How do I protect fodder from cattle?',
    ],
  },

  ha: {
    langLabel: 'Hausa',
    speechLang: 'ha-NG',
    appTitle: 'Kaka-to-Bazara',

    welcomeIntro:
      'Gano boyayyen damshin kasa bayan girbin Kaka a Jihar Gombe ta amfani da bayanan NASA. Yi shukar Bazara ba tare da famfon fetur ba.',
    startExploring: 'Fara Bincike',

    settingsTitle: 'Saituna',
    languageLabel: 'Harshe',
    simpleModeLabel: 'Tsari Mai Sauki',
    simpleModeHint: 'Yi amfani da hausar gona mai sauki maimakon kalmomin kimiyya',
    doneLabel: 'An Gama',

    lgaPickerLabel: 'Karamar Hukumar Gombe',
    loadingLabel: 'Ana sabunta damshin kasa…',

    elevationLabel: 'Tsayin Kasa (SRTM 30m)',
    terrainLabels: {
      lowland: 'Kwarin Fadama',
      valley: 'Tsakiyar Kwari',
      upland: 'Kasar Tudu',
    },
    retentionAdjustedNote: 'An daidaita rikon damshi da tsayin kasa',

    mapTitle: 'Nuna Gonarka a Taswirar Sama',
    mapTapHint: 'Danna taswira ko ja alamar don sabunta damshin kasa da tsayin gona',
    useGpsBtn: 'Yi Amfani da GPS na Yanzu',
    gpsLocating: 'Ana neman GPS…',
    gpsUnsupported: 'Wannan na’ura ba ta goyon bayan GPS.',
    gpsDenied: 'An hana izinin wuri. Danna kan taswira don nuna gonarka.',
    openGoogleMapsBtn: 'Bude Wurin a Google Maps',
    plotSizeLabel: 'Filin Hectare 1 (100m × 100m)',
    higherMoistureZoneLabel: 'Bangaren Mai Damshi',
    drierZoneLabel: 'Bangaren Mai Bushewa',
    layerAerial: 'Hoton Gona Kai Tsaye',
    layerModis: 'Ganyen NASA MODIS',
    layerSmap: 'Damshin NASA SMAP',
    opacityLabel: 'Hasken Taswira',
    zoomPlotBtn: 'Kusanto Gona',
    zoomRegionBtn: 'Dubi Gombe',
    exactPlaceLabel: 'Takamaimai Wuri',

    soilWaterLeftLabel: 'Kwanakin Damshi',
    daysUnit: 'Kwana',
    soilWetnessLabel: 'Damshin Kasa',
    verdictLabel: 'Shawara',
    verdictGood: 'Ya Dace da Waken Kwana 60',
    verdictDry: 'Ya Bushe — Yi Rufin Gona',

    chartTitleTech: 'Damshin Kasa na Saiwa (Satumba – Nuwamba)',
    chartTitleSimple: 'Yadda Damshin Kasa ke Sauka (Satumba – Nuwamba)',
    chartLegendTech: 'GWETROOT Damshi (%)',
    chartLegendSimple: 'Damshin Kasa (%)',

    optionsTitle: 'Hanyoyi 3 na Shukar Bazara',
    tapDetailsHint: 'An daidaita da ma’aunin FAO GAEZ · Danna kowane zabi don cikakken bayani',
    faoCalibrationNote: 'An daidaita da ma’aunin FAO GAEZ na Savanna',
    modalWhyNasa: 'Dalilin da NASA da FAO GAEZ suka ba da shawarar',
    modalDataGaps: 'Abubuwan da tauraro ba ya gani',
    modalFarmerChecks: 'Binciken da manomi zai yi da kansa',
    closeLabel: 'Rufe',
    options: {
      bare: {
        title: 'Barin Gona Fanko',
        tag: 'Tsarin Yanzu',
        waterLine: '0mm · 0 Kwana Ruwa',
        faoGaezBadge: 'FAO GAEZ: Kasa Fanko',
        keyPoint: 'Hadari: Iska tana kwashe kasa kuma tana bushewa.',
        whyNasaTech:
          'MODIS/Landsat NDVI na faduwa kasa da 0.22 kuma ECOSTRESS ya nuna zafi yana karuwa da +6°C.',
        whyNasaSimple:
          'Hoton sama ya nuna kasar fanko tana daukar zafi +6°C a lokacin Bazara kuma iska tana kwashe takin kasa.',
        dataGaps: 'Tauraro ba ya gane kananan zaizayar kasa ko kwayoyin ciyawar Wuta-wuta (Striga).',
        farmerChecks: 'A bar karan Masara ko Dawa a kwance kan kasa don rufe rana da iska.',
      },
      cowpea: {
        title: 'Waken Kwana 60 (Wake)',
        tag: 'An Fi Ba da Shawara',
        waterLine: '180mm (Kwana 55+)',
        faoGaezBadge: 'Ma’aunin FAO GAEZ: 180mm',
        keyPoint: 'Amfani: Karin kudi da takin Nitrogen a kasa.',
        whyNasaTech:
          'NASA POWER GWETROOT da SMAP sun tabbatar Fadama suna cika ma’aunin FAO GAEZ 180mm na Waken IT99K-573-1-1.',
        whyNasaSimple:
          'Damshin kasa a Fadama da kwari yana kaiwa ma’aunin ruwa 180mm har Wake mai kwana 60 ya nuna.',
        dataGaps: 'Tauraro ba ya ganin tauri a kasan kasa (cm 15–20) ko kwari a gona.',
        farmerChecks: 'A haka cm 20 don tabbatar da damshi, a gwada tsiron kwaya 20 cikin jika-jikakken kyalle.',
      },
      lablab: {
        title: 'Lablab / Waken Dabbobi',
        tag: 'Kariyar Kasa',
        waterLine: '150mm (Kwana 50+)',
        faoGaezBadge: 'Ma’aunin FAO GAEZ: 150mm',
        keyPoint: 'Amfani: Yana rufe kasa da ciyar da dabbobi.',
        whyNasaTech:
          'Zafin EVPTRNS yana bukatar ganye masu saurin rufe kasa; Lablab na jurewa da ma’aunin FAO GAEZ 150mm.',
        whyNasaSimple:
          'Ganyen Lablab suna rufe kasa kamar lema da ruwa 150mm kuma suna ba shanu da awaki abinci.',
        dataGaps: 'Hanyoyin kiwon shanu (burtali) ba sa bayyana a taswirar NASA.',
        farmerChecks: 'A yi yarjejeniya da makiyaya ko a kewaye gona da shingen kaya kafin shuka.',
      },
    },

    nasaBadgeText: 'Powered by NASA Earth Data',
    nasaPopupTitle: 'Tushen Bayanan NASA da Aka Yi Amfani da Su',
    nasaSourcesList: [
      {
        name: 'NASA POWER',
        detailTech: 'Ruwan sama (PRECTOTCORR), zafin rana (T2M_MAX), damshin saiwa (GWETROOT), da bushewa (EVPTRNS).',
        detailSimple: 'Yana auna ruwan sama, zafin rana, da damshin kasa a dukkan Gombe.',
      },
      {
        name: 'NASA SMAP (L4)',
        detailTech: 'Hoton damshin kasa mai fadin 9 km na GIBS da bambancin Fadama da tudu.',
        detailSimple: 'Yana nuna kwarin da ke rike ruwa da tudun da ke bushewa da sauri.',
      },
      {
        name: 'GPM / IMERG',
        detailTech: 'Binciken ruwan sama daga sararin samaniya da ke ciyar da lissafin damshin kasa.',
        detailSimple: 'Yana bin diddigin yawan ruwan damina da ya shiga kasa.',
      },
      {
        name: 'MODIS & Landsat NDVI',
        detailTech: 'Hoton GIBS na ganye (MODIS) da Landsat 30m don duba korewar shuka bayan girbi.',
        detailSimple: 'Kamera ta sama tana ganin gonar da ke da ganye kore ko fanko.',
      },
      {
        name: 'SRTM 30m Elevation',
        detailTech: 'Auna tsayin kasa mita 30 kai tsaye don daidaita rikon damshi tsakanin Fadama da tudu.',
        detailSimple: 'Yana auna tsayin gonarka don sanin ko ruwa yana taruwa ko yana gudu.',
      },
      {
        name: 'ECOSTRESS',
        detailTech: 'Binciken zafin kasa (70 m) da ke nuna kasar fanko na zafi fiye da +6°C.',
        detailSimple: 'Yana nuna yadda kasa fanko ke konewa a zafin rana.',
      },
      {
        name: 'FAO GAEZ',
        detailTech: 'Ma’aunin amfanin gona na duniya (180mm ga Wake, 150mm ga Lablab a yankin Savanna).',
        detailSimple: 'Ka’idojin duniya na yawan ruwan da Wake (180mm) da Lablab (150mm) ke bukata.',
      },
    ],
    nasaGlobalNoteTitle: 'Dalilin Amfani da Ma’aunin Duniya a Najeriya',
    nasaGlobalNoteBody:
      'Bayanan kasar Amurka kamar USDA SSURGO da CDL suna aiki a Amurka kadai. Mun sauya su da takwarorinsu na duniya—FAO GAEZ da SRTM 30m—domin manoman Jihar Gombe su samu sakamako daidai da kasarsu.',

    aiTitle: 'Mai Ba da Shawarar Noma AI',
    aiGreeting:
      'Sannu! Tambaye ni komai kan damshin kasa, tsayin gonarka, Waken kwana 60 (180mm), ko kare amfaninka a wannan yankin Gombe.',
    aiPlaceholder: 'Rubuta tambayarka ta noma…',
    aiSend: 'Aika',
    aiThinking: 'Ana duba shawara…',
    aiReadAloud: 'Saurara',
    aiStopAudio: 'Tsayar',
    quickQuestions: [
      'Shin damshin kasa zai ishi shukar wake?',
      'Yaya tsayin gona ke shafar ruwan kasa?',
      'Yaya zan kare gona daga shanu?',
    ],
  },

  ff: {
    langLabel: 'Fulfulde',
    speechLang: 'en-NG',
    appTitle: 'Kaka-to-Bazara',

    welcomeIntro:
      'Yiit ndiyam leydi keddiɗam caggal Nduungu e Gombe e ballal limtooji NASA. Aaw gawri Ceedu tawa a huutoraaki pompi.',
    startExploring: 'Fuɗɗo Yiylaade',

    settingsTitle: 'Teelte',
    languageLabel: 'Ɗemngal',
    simpleModeLabel: 'Laawol Ko Hoyi',
    simpleModeHint: 'Huutoro haala demal laaɓka tawa alaa kelme satelit',
    doneLabel: 'Gasii',

    lgaPickerLabel: 'Nokku Gombe (LGA)',
    loadingLabel: 'Ina hesɗitina ndiyam leydi…',

    elevationLabel: 'Tooweendi (SRTM 30m)',
    terrainLabels: {
      lowland: 'Waalo Fadama',
      valley: 'Hakkunde Waalo',
      upland: 'Towndi',
    },
    retentionAdjustedNote: 'Jogagol ndiyam feewnaama e tooweendi leydi',

    mapTitle: 'Maanto Ngesa Maa e Kartal',
    mapTapHint: 'Ñoƴƴu kartal walla daas maande ngam hesɗitinde ndiyam NASA e tooweendi',
    useGpsBtn: 'Huutoro GPS Am Jooni',
    gpsLocating: 'Ina yiylaade GPS…',
    gpsUnsupported: 'GPS alaa e ndee masiŋ.',
    gpsDenied: 'Yamiroore nokku ronkii. Ñoƴƴu kartal ngam maantude.',
    openGoogleMapsBtn: 'Uddit Nokku e Google Maps',
    plotSizeLabel: 'Ngesa Hectare 1 (100m × 100m)',
    higherMoistureZoneLabel: 'Bannge Ndiyam Ɓurɗam',
    drierZoneLabel: 'Bannge Ɓurɗo Yoorgo',
    layerAerial: 'Foto Ngesa',
    layerModis: 'Leeɓi NASA MODIS',
    layerSmap: 'Ndiyam NASA SMAP',
    opacityLabel: 'Laaɓal Kartal',
    zoomPlotBtn: 'Ngesa',
    zoomRegionBtn: 'Gombe Fof',
    exactPlaceLabel: 'Nokku Tigi',

    soilWaterLeftLabel: 'Balɗe Ndiyam',
    daysUnit: 'Balɗe',
    soilWetnessLabel: 'Ndiyam Leydi',
    verdictLabel: 'Kuulal',
    verdictGood: 'Moƴƴii e Nyebbe Balɗe 60',
    verdictDry: 'Yoorii — Suuɗ Leydi',

    chartTitleTech: 'Ndiyam Leydi e Ɗaɗi (Sept – Nov)',
    chartTitleSimple: 'Ndiyam Leydi Gila Setambar Haa Noowambar',
    chartLegendTech: 'GWETROOT Ndiyam (%)',
    chartLegendSimple: 'Ndiyam Leydi (%)',

    optionsTitle: 'Peeje 3 ngam Aawde e Ceedu',
    tapDetailsHint: 'Feewnaa e maanda FAO GAEZ · Ñoƴƴu feere fof ngam humpito',
    faoCalibrationNote: 'Feewnaa e maanda FAO GAEZ',
    modalWhyNasa: 'Ko waɗi NASA & FAO GAEZ ina wasiyoo ɗum',
    modalDataGaps: 'Ko satelit waawaa yiyde',
    modalFarmerChecks: 'Ko demoowo haani ƴeewde',
    closeLabel: 'Uddu',
    options: {
      bare: {
        title: 'Accude Ngesa Meere',
        tag: 'Ko Woonnoo',
        waterLine: '0mm · 0 Balɗe Ndiyam',
        faoGaezBadge: 'FAO GAEZ: Leydi Meere',
        keyPoint: 'Mbonndi: Henndu ina itta leydi e yoorgol.',
        whyNasaTech:
          'MODIS/Landsat NDVI ina jippoo les 0.22 e ECOSTRESS ina holla nguleeki +6°C dow leydi meere.',
        whyNasaSimple:
          'Kameraa asamaan ina holla leydi meere ina wula +6°C e Ceedu, henndu ina itta moƴƴere leydi.',
        dataGaps: 'Satelit waawaa yiyde ilam tokoosam walla hudo Striga.',
        farmerChecks: 'Accu gawri joorndi dow leydi ngam suuɗde naange e henndu.',
      },
      cowpea: {
        title: 'Nyebbe Balɗe 60',
        tag: 'Ɓuri Moƴƴude',
        waterLine: '180mm (Balɗe 55+)',
        faoGaezBadge: 'Maanda FAO GAEZ: 180mm',
        keyPoint: 'Nafa: Kaalis e ɓeydude moƴƴere leydi.',
        whyNasaTech:
          'NASA POWER GWETROOT e SMAP ina kollita Fadama ina timmina 180mm FAO GAEZ ngam nyebbe IT99K-573-1-1.',
        whyNasaSimple:
          'Ndiyam les leydi e Fadama e waalo ina timmina 180mm haa nyebbe balɗe 60 bennda.',
        dataGaps: 'Satelit waawaa yiyde tiiɗgol les leydi (15–20 cm) walla bojel.',
        farmerChecks: 'As 20 cm ngam ƴeewde ndiyam e jarrib 20 aawdi e comci ɓuuɓɗi.',
      },
      lablab: {
        title: 'Lablab / Nyebbe Nay',
        tag: 'Cuuɗol Leydi',
        waterLine: '150mm (Balɗe 50+)',
        faoGaezBadge: 'Maanda FAO GAEZ: 150mm',
        keyPoint: 'Nafa: Ina suuɗa leydi e ñamminta nay.',
        whyNasaTech:
          'Yoorgol EVPTRNS ina haani leeɓi jaawɗi; Lablab ina muña e 150mm FAO GAEZ.',
        whyNasaSimple:
          'Leeɓi Lablab ina cuuɗa leydi e 150mm ndiyam e ina ndokka nay e baali ñaamdu e Ceedu.',
        dataGaps: 'Laabi nay (burtali) njiyataake e kartal NASA.',
        farmerChecks: 'Nanondir e waynaaɓe ko adii aawde walla waɗ galle giɗe.',
      },
    },

    nasaBadgeText: 'Powered by NASA Earth Data',
    nasaPopupTitle: 'Limtooji NASA Kuutoraaɗi',
    nasaSourcesList: [
      {
        name: 'NASA POWER',
        detailTech: 'Toɓo (PRECTOTCORR), nguleeki (T2M_MAX), ndiyam ɗaɗi (GWETROOT), e yoorgol (EVPTRNS).',
        detailSimple: 'Ina limta toɓo, nguleeki naange, e ndiyam les leydi e Gombe.',
      },
      {
        name: 'NASA SMAP (L4)',
        detailTech: 'Kartal GIBS ndiyam leydi 9 km e seerndude Fadama e towndi.',
        detailSimple: 'Raadaar hollitoowo nokkuuji waalo jogiiɗi ndiyam.',
      },
      {
        name: 'GPM / IMERG',
        detailTech: 'Limto toɓo satelit winndereere mooftinoowo ndiyam caggal Nduungu.',
        detailSimple: 'Ina reena no toɓo naatiri e les leydi.',
      },
      {
        name: 'MODIS & Landsat NDVI',
        detailTech: 'Kartal GIBS MODIS NDVI e Landsat 30 m ngam ƴeewde keccol leydi.',
        detailSimple: 'Kameraa asamaan yiyowo keccol leydi caggal ittaango.',
      },
      {
        name: 'SRTM 30m Elevation',
        detailTech: 'Tooweendi leydi meeter 30 feewnitoowo jogagol ndiyam e waalo walla towndi.',
        detailSimple: 'Ina auna tooweendi ngesa maa ngam anndude ɗo ndiyam mooftotoo.',
      },
      {
        name: 'ECOSTRESS',
        detailTech: 'Aunugol nguleeki leydi 70 m hollitoowol leydi meere ina wula +6°C.',
        detailSimple: 'Ina holla no leydi meere ɓurata wulde e naange.',
      },
      {
        name: 'FAO GAEZ',
        detailTech: 'Maanda winndere ngam aawdi Savanna (180mm Nyebbe, 150mm Lablab).',
        detailSimple: 'Kuule winndere hollirooje haaju ndiyam nyebbe (180mm) e lablab (150mm).',
      },
    ],
    nasaGlobalNoteTitle: 'Ko Waɗi Min Kuutorii Maanda Winndere ngam Najeriya',
    nasaGlobalNoteBody:
      'Limtooji Amerik tan ko wayi no USDA SSURGO e CDL ina ngolloo e Amerik tan. Min lomtini ɗi e maanda winndere laawɗuɗi—FAO GAEZ e SRTM 30m—mbele remooɓe Gombe ina keɓa humpito laaɓtungo.',

    aiTitle: 'Balloowo Demal AI',
    aiGreeting:
      'Jam waali! Ƴam am dow ndiyam leydi, tooweendi ngesa maa, nyebbe balɗe 60 (180mm), walla reennde ngesa maa e Gombe.',
    aiPlaceholder: 'Winndu ƴamol maa…',
    aiSend: 'Neldu',
    aiThinking: 'Ina miijoo…',
    aiReadAloud: 'Heɗo',
    aiStopAudio: 'Dartin',
    quickQuestions: [
      'Ndiyam ina yona nyebbe balɗe 60?',
      'Hol no tooweendi waylata ndiyam leydi?',
      'Hol no ndeenir-mi hudo e nay?',
    ],
  },

  pcm: {
    langLabel: 'Pidgin',
    speechLang: 'en-NG',
    appTitle: 'Kaka-to-Bazara',

    welcomeIntro:
      'Find hidden soil water after harvest for Gombe State using NASA satellite data. Grow extra dry-season crop without fuel pump.',
    startExploring: 'Start Exploring',

    settingsTitle: 'Settings',
    languageLabel: 'Language',
    simpleModeLabel: 'Simple Mode',
    simpleModeHint: 'Use plain farm talk instead of NASA big grammar',
    doneLabel: 'Done',

    lgaPickerLabel: 'Gombe Local Government Area',
    loadingLabel: 'Dey check soil water…',

    elevationLabel: 'SRTM 30m Height',
    terrainLabels: {
      lowland: 'Lowland Basin',
      valley: 'Mid-Valley',
      upland: 'Upland Slope',
    },
    retentionAdjustedNote: 'Water hold adjusted by land height',

    mapTitle: 'Pin Your Exact Farm',
    mapTapHint: 'Tap map or drag pin to update live NASA soil water & ground height',
    useGpsBtn: 'Use My Current GPS Location',
    gpsLocating: 'Dey find GPS…',
    gpsUnsupported: 'GPS no dey work for dis phone.',
    gpsDenied: 'Location permission block. Tap map to drop pin by hand.',
    openGoogleMapsBtn: 'Open Exact Spot in Google Maps',
    plotSizeLabel: '1-Hectare Plot (100m × 100m)',
    higherMoistureZoneLabel: 'Higher Moisture Zone',
    drierZoneLabel: 'Drier Zone',
    layerAerial: 'Aerial Farm View',
    layerModis: 'NASA MODIS Vegetation',
    layerSmap: 'NASA SMAP Soil Moisture',
    opacityLabel: 'Overlay Opacity',
    zoomPlotBtn: 'Farm Zoom',
    zoomRegionBtn: 'Gombe View',
    exactPlaceLabel: 'Exact Place',

    soilWaterLeftLabel: 'Soil Water Left',
    daysUnit: 'Days',
    soilWetnessLabel: 'Soil Wetness',
    verdictLabel: 'Verdict',
    verdictGood: 'Good for 60-Day Cowpea',
    verdictDry: 'Too Dry — Mulch Recommended',

    chartTitleTech: 'Root-Zone Soil Wetness (Sept – Nov)',
    chartTitleSimple: 'Soil Water From September to November',
    chartLegendTech: 'GWETROOT Wetness (%)',
    chartLegendSimple: 'Soil Water (%)',

    optionsTitle: '3 Crop Rotation Options',
    tapDetailsHint: 'Calibrated to FAO GAEZ savanna standards · Tap card for details',
    faoCalibrationNote: 'Calibrated to FAO Global Agro-Ecological Zones (GAEZ)',
    modalWhyNasa: 'Why NASA & FAO GAEZ suggest am',
    modalDataGaps: 'Wetin satellite no fit see',
    modalFarmerChecks: 'Wetin farmer must check for ground',
    closeLabel: 'Close',
    options: {
      bare: {
        title: 'Leave Field Bare',
        tag: 'Current Practice',
        waterLine: '0mm · 0 Days Water',
        faoGaezBadge: 'FAO GAEZ: Bare Fallow',
        keyPoint: 'Risk: Wind erosion & dry soil.',
        whyNasaTech:
          'MODIS/Landsat NDVI drop under 0.22 and ECOSTRESS show empty soil hot +6°C pass covered farm.',
        whyNasaSimple:
          'Space camera show empty ground dey burn +6°C hotter under dry-season sun and breeze dey blow sand.',
        dataGaps: 'Satellite no fit see small gully erosion or Striga weed seed inside farm.',
        farmerChecks: 'Spread dry maize or sorghum stalk on top ground to block sun and wind.',
      },
      cowpea: {
        title: '60-Day Early Cowpea',
        tag: 'Recommended',
        waterLine: '180mm (Needs 55+ Days)',
        faoGaezBadge: 'FAO GAEZ Savanna Standard: 180mm',
        keyPoint: 'Benefit: Extra cash & adds soil nitrogen.',
        whyNasaTech:
          'NASA POWER GWETROOT and SMAP show Fadama lowland meet di 180mm FAO GAEZ water mark for 60-day IT99K-573-1-1 beans.',
        whyNasaSimple:
          'Deep soil water inside lowland farm reach 180mm mark so quick 60-day beans go mature.',
        dataGaps: 'Satellite no fit see hard pan underground (15–20 cm) or insects.',
        farmerChecks: 'Dig 20 cm check water with hand and test 20 market seeds inside wet cloth first.',
      },
      lablab: {
        title: 'Dual-Purpose Lablab / Fodder',
        tag: 'Soil Shield',
        waterLine: '150mm (Needs 50+ Days)',
        faoGaezBadge: 'FAO GAEZ Savanna Standard: 150mm',
        keyPoint: 'Benefit: Shades soil & feeds livestock.',
        whyNasaTech:
          'High EVPTRNS drying need quick leaf shade; Lablab fit di 150mm FAO GAEZ drought-hardened fodder level.',
        whyNasaSimple:
          'Wide green leaves cover ground like umbrella and grow animal food on 150mm water.',
        dataGaps: 'Cattle grazing paths (burtali) no dey show on NASA satellite map.',
        farmerChecks: 'Agree with herders before planting or put thorn fence around di farm.',
      },
    },

    nasaBadgeText: 'Powered by NASA Earth Data',
    nasaPopupTitle: 'NASA Sources Used',
    nasaSourcesList: [
      {
        name: 'NASA POWER',
        detailTech: 'Daily rain (PRECTOTCORR), max heat (T2M_MAX), root water (GWETROOT), and drying (EVPTRNS).',
        detailSimple: 'Measures daily rain, hot sun, and deep root water for Gombe.',
      },
      {
        name: 'NASA SMAP (L4)',
        detailTech: '9 km soil moisture GIBS satellite layer showing lowland vs. upland water retention.',
        detailSimple: 'Space radar showing wet valleys vs. fast-drying hills.',
      },
      {
        name: 'GPM / IMERG',
        detailTech: 'Global rainfall satellite fusion backing seasonal soil moisture recharge.',
        detailSimple: 'Tracks how much late rain enter inside soil.',
      },
      {
        name: 'MODIS & Landsat NDVI',
        detailTech: '8-day MODIS GIBS greenness overlay and 30 m Landsat crop-cover checks.',
        detailSimple: 'Space leaf cameras showing green farms vs. dry empty sand.',
      },
      {
        name: 'SRTM 30m Elevation',
        detailTech: 'Live 30-meter height lookup adjusting soil water retention for basins vs. upland slopes.',
        detailSimple: 'Checks exact land height so low valleys and high hills get correct water days.',
      },
      {
        name: 'ECOSTRESS',
        detailTech: '70 m land surface heat checks showing bare dry soil dey +6°C hotter than shaded farm.',
        detailSimple: 'Measures how empty farm dey burn hotter under sun.',
      },
      {
        name: 'FAO GAEZ',
        detailTech: 'Global savanna crop-water standards (180mm Cowpea, 150mm Lablab).',
        detailSimple: 'Global crop rules showing 180mm needed for cowpea and 150mm for lablab.',
      },
    ],
    nasaGlobalNoteTitle: 'Why Global Data Replace US-Only Datasets',
    nasaGlobalNoteBody:
      'US-only datasets like USDA SSURGO soil maps and USDA Cropland Data Layer (CDL) work only inside America. We use global FAO GAEZ crop standards and SRTM 30m terrain data so Nigerian farmers in Gombe get real local guidance.',

    aiTitle: 'Farm Extension Assistant',
    aiGreeting:
      'How far! Ask me anything about soil water, your farm height, 60-day beans (180mm), or protecting your plot for this Gombe LGA.',
    aiPlaceholder: 'Ask your farm question…',
    aiSend: 'Send',
    aiThinking: 'Dey check…',
    aiReadAloud: 'Listen',
    aiStopAudio: 'Stop',
    quickQuestions: [
      '60-day beans fit survive here?',
      'How my farm height affect water?',
      'How I go guard fodder from cows?',
    ],
  },
};
