import type { Language, PlannedCropId, SoilKindId } from '../types/farm';

export interface FarmInputsCopy {
  farmSizeLabel: string;
  hectaresUnit: string;
  soilKindLabel: string;
  soilKinds: Record<SoilKindId, string>;
  plannedCropLabel: string;
  plannedCrops: Record<PlannedCropId, string>;
  analyzeBtnLabel: string;
  analyzingBtnLabel: string;
  analysisResultTitle: string;
  alternativesHeading: string;
  prosLabel: string;
  risksLabel: string;
  staleHint: string;
  shareBtnLabel: string;
  copiedBtnLabel: string;
  shareSummaryLocation: string;
  shareSummarySize: string;
  shareSummarySoil: string;
  shareSummaryCrop: string;
  shareSummarySoilStatus: string;
  shareSummaryVerdict: string;
  shareSummaryOptions: string;
  shareSummaryMapLink: string;
}

export const FARM_INPUTS_COPY: Record<Language, FarmInputsCopy> = {
  en: {
    farmSizeLabel: 'Farm Size',
    hectaresUnit: 'ha',
    soilKindLabel: 'Kind of Sand / Soil on Your Farm',
    soilKinds: {
      sandy: 'Sandy Soil (Fast Draining)',
      loamy: 'Mixed Loamy Soil (Balanced)',
      clay: 'Clay / Fadama Soil (Holds Water Long)',
    },
    plannedCropLabel: 'What Do You Want to Plant Now?',
    plannedCrops: {
      maize: 'Maize (Masara)',
      cowpea: '60-Day Cowpea / Beans (Wake)',
      sorghum: 'Sorghum (Dawa)',
      groundnut: 'Groundnut (Gyada)',
      millet: 'Millet (Gero)',
      rice: 'Lowland Rice (Shinkafa)',
      vegetables: 'Vegetables / Okra',
    },
    analyzeBtnLabel: 'Check If My Crop Will Work',
    analyzingBtnLabel: 'Checking your exact farm spot…',
    analysisResultTitle: 'Your Farm Crop Check',
    alternativesHeading: 'Better Rotation Alternatives',
    prosLabel: 'Good',
    risksLabel: 'Risk',
    staleHint: 'Pin or crop changed — tap again to refresh your check.',
    shareBtnLabel: 'Share',
    copiedBtnLabel: 'Copied!',
    shareSummaryLocation: 'Location',
    shareSummarySize: 'Farm Size',
    shareSummarySoil: 'Soil Type',
    shareSummaryCrop: 'Planned Crop',
    shareSummarySoilStatus: 'Current Soil Status',
    shareSummaryVerdict: 'Result',
    shareSummaryOptions: 'Crop Options',
    shareSummaryMapLink: 'Farm Pin',
  },

  ha: {
    farmSizeLabel: 'Girman Gona',
    hectaresUnit: 'ha',
    soilKindLabel: 'Nau’in Yashi / Kasa a Gonarka',
    soilKinds: {
      sandy: 'Kasar Yashi (Mai Saurin Bushewa)',
      loamy: 'Kasar Gami-gami (Matsakaiciya)',
      clay: 'Kasar Laka / Fadama (Mai Rike Ruwa)',
    },
    plannedCropLabel: 'Me Kake So Ka Shuka Yanzu?',
    plannedCrops: {
      maize: 'Masara (Maize)',
      cowpea: 'Waken Kwana 60 (Wake)',
      sorghum: 'Dawa (Sorghum)',
      groundnut: 'Gyada (Groundnut)',
      millet: 'Gero (Millet)',
      rice: 'Shinkafar Fadama (Rice)',
      vegetables: 'Kayan Lambu / Kubewa',
    },
    analyzeBtnLabel: 'Duba Ko Shukata Za Ta Yi',
    analyzingBtnLabel: 'Ana duba kasar gonarka…',
    analysisResultTitle: 'Sakamakon Binciken Gonarka',
    alternativesHeading: 'Zabin Shuka Mafi Kyau (3)',
    prosLabel: 'Amfani',
    risksLabel: 'Hadari',
    staleHint: 'Wuri ko shuka ya canza — danna don sabunta bincike.',
    shareBtnLabel: 'Aika (Share)',
    copiedBtnLabel: 'An Kwafe!',
    shareSummaryLocation: 'Wuri',
    shareSummarySize: 'Girman Gona',
    shareSummarySoil: 'Nau’in Kasa',
    shareSummaryCrop: 'Shukar da Ake So',
    shareSummarySoilStatus: 'Yanayin Damshin Kasa',
    shareSummaryVerdict: 'Hukunci',
    shareSummaryOptions: 'Zabin Shuka',
    shareSummaryMapLink: 'Taswirar Gona',
  },

  ff: {
    farmSizeLabel: 'Mawneendi Ngesa',
    hectaresUnit: 'ha',
    soilKindLabel: 'No Njaareendi / Leydi Ngesa Maa Wayi',
    soilKinds: {
      sandy: 'Njaareendi (Yaawndi Yoorgo)',
      loamy: 'Leydi Jillundi (Hakkundeeri)',
      clay: 'Loopeeri / Fadama (Jogotoondi Ndiyam)',
    },
    plannedCropLabel: 'Ko Njiɗ-ɗaa Aawde Jooni?',
    plannedCrops: {
      maize: 'Butaali / Masara (Maize)',
      cowpea: 'Nyebbe Balɗe 60 (Wake)',
      sorghum: 'Bayeeri / Dawa (Sorghum)',
      groundnut: 'Biriiji / Gyada (Groundnut)',
      millet: 'Muuri / Gero (Millet)',
      rice: 'Maaro Fadama (Rice)',
      vegetables: 'Gubbi / Kaaku',
    },
    analyzeBtnLabel: 'Ƴeew So Aawdi Am Ina Moƴƴa',
    analyzingBtnLabel: 'Ina ƴeewa leydi ngesa maa…',
    analysisResultTitle: 'Ɓeto Aawdi Ngesa Maa',
    alternativesHeading: 'Peeje Ɓurɗe Moƴƴude (3)',
    prosLabel: 'Nafa',
    risksLabel: 'Mbonndi',
    staleHint: 'Nokku walla aawdi wayliima — ñoƴƴu kadi ngam hesɗitinde.',
    shareBtnLabel: 'Lolli (Share)',
    copiedBtnLabel: 'Nattitaama!',
    shareSummaryLocation: 'Nokku',
    shareSummarySize: 'Mawneendi Ngesa',
    shareSummarySoil: 'No Leydi Wayi',
    shareSummaryCrop: 'Aawdi Njiɗaandi',
    shareSummarySoilStatus: 'Ngonka Ndiyam Leydi',
    shareSummaryVerdict: 'Sartu',
    shareSummaryOptions: 'Peeje Aawdi',
    shareSummaryMapLink: 'Nokku Ngesa',
  },

  pcm: {
    farmSizeLabel: 'Farm Size',
    hectaresUnit: 'ha',
    soilKindLabel: 'Kind of Sand / Soil for Your Farm',
    soilKinds: {
      sandy: 'Sandy Soil (Fast Draining)',
      loamy: 'Mixed Loamy Soil (Balanced)',
      clay: 'Clay / Fadama Soil (Holds Water Long)',
    },
    plannedCropLabel: 'Wetin You Wan Plant Now?',
    plannedCrops: {
      maize: 'Maize (Masara)',
      cowpea: '60-Day Cowpea / Beans (Wake)',
      sorghum: 'Sorghum (Dawa)',
      groundnut: 'Groundnut (Gyada)',
      millet: 'Millet (Gero)',
      rice: 'Lowland Rice (Shinkafa)',
      vegetables: 'Vegetables / Okra',
    },
    analyzeBtnLabel: 'Check If My Crop Will Work',
    analyzingBtnLabel: 'Dey check your exact farm ground…',
    analysisResultTitle: 'Your Farm Crop Check',
    alternativesHeading: 'Better Rotation Alternatives',
    prosLabel: 'Good',
    risksLabel: 'Risk',
    staleHint: 'Pin or crop don change — tap again to check fresh.',
    shareBtnLabel: 'Share',
    copiedBtnLabel: 'Copied!',
    shareSummaryLocation: 'Place',
    shareSummarySize: 'Farm Size',
    shareSummarySoil: 'Soil Kind',
    shareSummaryCrop: 'Crop Wey You Wan Plant',
    shareSummarySoilStatus: 'Soil Water Now',
    shareSummaryVerdict: 'Result',
    shareSummaryOptions: 'Crop Options',
    shareSummaryMapLink: 'Farm Pin',
  },
};
