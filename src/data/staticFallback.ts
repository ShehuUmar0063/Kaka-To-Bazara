import type { FarmAnalysisResult, Language, PlannedCropId, SoilKindId } from '../types/farm';
import type { FarmInputsCopy } from './farmInputsTranslations';

const CROP_REQUIRED_DAYS: Record<PlannedCropId, number> = {
  maize: 90,
  cowpea: 55,
  sorghum: 95,
  groundnut: 75,
  millet: 65,
  rice: 110,
  vegetables: 60,
};

export function buildStaticFarmAnalysis(
  language: Language,
  farmCopy: FarmInputsCopy,
  plannedCrop: PlannedCropId,
  soilKind: SoilKindId,
  farmSizeHa: number,
  viableDays: number,
  soilWetnessPct: number
): FarmAnalysisResult {
  const requiredDays = CROP_REQUIRED_DAYS[plannedCrop];
  const isViable = viableDays >= requiredDays && !(plannedCrop === 'rice' && soilKind !== 'clay');
  const cropName = farmCopy.plannedCrops[plannedCrop];
  const soilName = farmCopy.soilKinds[soilKind];

  const badges: Record<Language, { yes: string; warn: string }> = {
    en: { yes: 'YES — Good to Plant', warn: 'WARNING — High Risk of Failure' },
    ha: { yes: 'EH — Za a Iya Shuka', warn: 'GARGADI — Hadarin Bushewa Yana da Yawa' },
    ff: { yes: 'EEY — Ina Moƴƴi Aawde', warn: 'REENTU — Ina Woodi Mbonndi Yoorgol' },
    pcm: { yes: 'YES — Good to Plant', warn: 'WARNING — High Risk Make E Fail' },
  };

  const whyByLang: Record<Language, string> = {
    en: isViable
      ? `Your ${farmSizeHa} ha ${soilName.toLowerCase()} currently holds ${soilWetnessPct}% moisture, giving roughly ${viableDays} days of soil water. That fits ${cropName}, which needs about ${requiredDays} days to finish cleanly.`
      : `Your ${farmSizeHa} ha ${soilName.toLowerCase()} only has about ${viableDays} days of residual water left (${soilWetnessPct}% wetness). ${cropName} needs closer to ${requiredDays} days of water, so planting it now risks drying out before harvest.`,
    ha: isViable
      ? `Gonarka mai girman ${farmSizeHa} ha (${soilName}) tana da damshin ${soilWetnessPct}% wanda zai kai kimanin kwana ${viableDays}. Wannan ya dace da ${cropName} wanda ke bukatar kimanin kwana ${requiredDays}.`
      : `Gonarka mai girman ${farmSizeHa} ha (${soilName}) tana da ruwan kasa na kimanin kwana ${viableDays} ne kawai (damshi ${soilWetnessPct}%). ${cropName} na bukatar kwana ${requiredDays}, don haka akwai hadarin bushewa kafin girbi.`,
    ff: isViable
      ? `Ngesa maa ${farmSizeHa} ha (${soilName}) ina jogii ndiyam ${soilWetnessPct}%, ko heewi balɗe ${viableDays}. Ɗum ina haaɓani ${cropName} baɗoowo balɗe ${requiredDays}.`
      : `Ngesa maa ${farmSizeHa} ha (${soilName}) ina jogii balɗe ${viableDays} tan e ndiyam leydi (${soilWetnessPct}%). ${cropName} ina haani balɗe ${requiredDays}, ko waawi yoorgo ko adii koƴgol.`,
    pcm: isViable
      ? `Your ${farmSizeHa} ha ${soilName.toLowerCase()} get ${soilWetnessPct}% water inside ground now, wey fit last about ${viableDays} days. Dis one match ${cropName} wey need around ${requiredDays} days to ready.`
      : `Your ${farmSizeHa} ha ${soilName.toLowerCase()} only get about ${viableDays} days of water left (${soilWetnessPct}% wetness). ${cropName} need near ${requiredDays} days of water, so e fit dry off before harvest.`,
  };

  const altLabels: Record<
    Language,
    {
      yours: string;
      smart: string;
      safe: string;
      yourPro: string;
      yourRisk: string;
      cowpeaName: string;
      cowpeaPro: string;
      cowpeaRisk: string;
      lablabName: string;
      lablabPro: string;
      lablabRisk: string;
    }
  > = {
    en: {
      yours: 'Your Choice',
      smart: 'Smart Option',
      safe: 'Safe Backup',
      yourPro: isViable
        ? `Matches your ${viableDays}-day soil water window.`
        : 'Can start early while topsoil is still damp.',
      yourRisk: isViable
        ? 'Weed early so grass does not steal moisture.'
        : `Needs ~${requiredDays} days vs ${viableDays} days left in soil.`,
      cowpeaName: '60-Day Cowpea / Beans (Wake)',
      cowpeaPro: 'Matures fast in 55–60 days using deep residual moisture and feeds the soil.',
      cowpeaRisk: 'Watch for aphids and weed early in the first 3 weeks.',
      lablabName: 'Dual-Purpose Lablab Fodder',
      lablabPro: 'Thrives on ~50 days of moisture, giving both grain and dry-season livestock feed.',
      lablabRisk: 'Plant right away before surface moisture drops.',
    },
    ha: {
      yours: 'Zabinka',
      smart: 'Zabi Mafi Kyau',
      safe: 'Madadi Mai Aminci',
      yourPro: isViable
        ? `Ya dace da damshin kwana ${viableDays} da ke kasa.`
        : 'Zai iya tsirowa da wuri yayin da saman kasa ke da danshi.',
      yourRisk: isViable
        ? 'A yi noman ciyawa da wuri don kar ta sha ruwa.'
        : `Yana bukatar kwana ${requiredDays} amma kwana ${viableDays} ne suka rage.`,
      cowpeaName: 'Waken Kwana 60 (Wake)',
      cowpeaPro: 'Yana nuna cikin kwana 55–60 da ragowar damshin kasa kuma yana kara taki.',
      cowpeaRisk: 'A kula da kwari da ciyawa a makonni 3 na farko.',
      lablabName: 'Wake-Dawa na Kiwo (Lablab)',
      lablabPro: 'Yana rayuwa da damshin kwana 50, yana ba da hatsi da abincin dabbobi.',
      lablabRisk: 'A shuka nan take kafin zafi ya karu.',
    },
    ff: {
      yours: 'Suɓo Maa',
      smart: 'Feere Ɓurnde',
      safe: 'Feere Kisal',
      yourPro: isViable
        ? `Ina haaɓani balɗe ${viableDays} ndiyam leydi.`
        : 'Ina waawi fuɗde law tawa dow leydi ina ɓuuɓi.',
      yourRisk: isViable
        ? 'Demma huɗo law ngam hoto ɗum yara ndiyam.'
        : `Ina haani balɗe ${requiredDays} kono balɗe ${viableDays} tan heddii.`,
      cowpeaName: 'Nyebbe Balɗe 60',
      cowpeaPro: 'Ina bennda e balɗe 55–60 e ndiyam leydi keddiiɗam, ina semmbina leydi.',
      cowpeaRisk: 'Reento kulle e huɗo e jonte 3 gadane.',
      lablabName: 'Lablab (Nyaamdu & Geyna)',
      lablabPro: 'Ina wuuri e balɗe 50 ndiyam, ina hokka nyebbe e huɗo na’i.',
      lablabRisk: 'Aaw jooni ko adii nde naange ɓeydotoo.',
    },
    pcm: {
      yours: 'Your Choice',
      smart: 'Smart Option',
      safe: 'Safe Backup',
      yourPro: isViable
        ? `E enter well inside your ${viableDays}-day ground water.`
        : 'E fit sprout quick while top ground still get small water.',
      yourRisk: isViable
        ? 'Clear grass early make e no drink your crop water.'
        : `Need ~${requiredDays} days, pass the ${viableDays} days wey remain.`,
      cowpeaName: '60-Day Cowpea / Beans (Wake)',
      cowpeaPro: 'E dey ready quick in 55–60 days with underground water and dey help soil.',
      cowpeaRisk: 'Check for insects and clear weed early for first 3 weeks.',
      lablabName: 'Dual-Purpose Lablab Fodder',
      lablabPro: 'Dey survive with ~50 days water, give beans plus food for cows/goats.',
      lablabRisk: 'Plant sharp sharp before dry sun too hot.',
    },
  };

  const l = altLabels[language];

  return {
    verdict: isViable ? 'YES' : 'WARNING',
    verdictBadge: isViable ? badges[language].yes : badges[language].warn,
    why: whyByLang[language],
    alternatives: [
      {
        cropName,
        tag: l.yours,
        pros: l.yourPro,
        risks: l.yourRisk,
      },
      {
        cropName: l.cowpeaName,
        tag: l.smart,
        pros: l.cowpeaPro,
        risks: l.cowpeaRisk,
      },
      {
        cropName: l.lablabName,
        tag: l.safe,
        pros: l.lablabPro,
        risks: l.lablabRisk,
      },
    ],
  };
}

export function buildStaticChatReply(
  language: Language,
  lgaName: string,
  viableDays: number,
  soilWetnessPct: number,
  farmSizeHa: number
): string {
  const replies: Record<Language, string> = {
    en: `For your ${farmSizeHa} ha plot in ${lgaName}, satellite soil wetness is ${soilWetnessPct}% (about ${viableDays} days of water left). Short-cycle 60-Day Cowpea or Lablab fodder is safest if water is below 70 days. (Note: Live AI chat is active when running the Node.js server with GEMINI_API_KEY; check actual topsoil moisture by hand before planting.)`,
    ha: `A gonarka ta ${farmSizeHa} ha a ${lgaName}, damshin kasa yana ${soilWetnessPct}% (kimanin kwana ${viableDays} na ruwa). Waken kwana 60 ko Lablab ya fi aminci idan kwanakin sun gaza 70. (Saboda ana amfani da shafin static ne ba tare da uwar garken Node ba, a tabbatar da danshin kasa da hannu kafin shuka.)`,
    ff: `E ngesa maa ${farmSizeHa} ha to ${lgaName}, ndiyam leydi ko ${soilWetnessPct}% (hedde balɗe ${viableDays}). Nyebbe balɗe 60 walla Lablab ɓuri hisde so balɗe ɗee ngonaani 70. (Ƴeew ndiyam leydi e junngo maa ko adii aawde.)`,
    pcm: `For your ${farmSizeHa} ha farm for ${lgaName}, ground wetness dey ${soilWetnessPct}% (around ${viableDays} days water left). 60-Day Cowpea or Lablab safe pass if water days never reach 70. (Always check ground with hand before you plant.)`,
  };
  return replies[language];
}
