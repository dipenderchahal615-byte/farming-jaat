import React, { useState } from 'react';
import { 
  Calendar, Sprout, Info, ChevronDown, ChevronUp, CheckCircle2, 
  Droplets, Leaf, Activity, Trash2, TrendingUp, Sparkles, ClipboardList
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid 
} from 'recharts';
import { ChatSession, Language } from '../types';

interface CropGrowthTimelineProps {
  language: Language;
  activeSession: ChatSession;
  onUpdateSession: (id: string, updates: Partial<ChatSession>) => void;
}

// Internal definitions for localized crops and their stages
interface Stage {
  name: { en: string; hi: string; pa: string };
  start: number;
  end: number;
  tips: { en: string; hi: string; pa: string };
  fertilizer: { en: string; hi: string; pa: string };
  water: { en: string; hi: string; pa: string };
}

interface CropDetail {
  id: string;
  name: { en: string; hi: string; pa: string };
  duration: number; // overall duration in days
  icon: string;
  stages: Stage[];
}

const CROPS_DETAILS: Record<string, CropDetail> = {
  wheat: {
    id: 'wheat',
    name: { en: 'Wheat', hi: 'गेहूं (Kanak)', pa: 'ਕਣਕ' },
    duration: 140,
    icon: '🌾',
    stages: [
      {
        name: { en: 'CRI Stage (Crown Root Initiation)', hi: 'जड़ विकास चरण (CRI)', pa: 'ਜੜ੍ਹ ਜੰਮਣ ਦਾ ਪੜਾਅ' },
        start: 0,
        end: 25,
        tips: { 
          en: 'Most critical stage for irrigation. Water stress now heavily reduces yield.', 
          hi: 'सिंचाई के लिए सबसे महत्वपूर्ण चरण। इस समय पानी की कमी से पैदावार बहुत कम हो जाती है।', 
          pa: 'ਸਿੰਚਾਈ ਲਈ ਸਭ ਤੋਂ ਨਾਜ਼ੁਕ ਪੜਾਅ। ਇਸ ਸਮੇਂ ਪਾਣੀ ਦੀ ਘਾਟ ਝਾੜ ਨੂੰ ਬਹੁਤ ਘਟਾਉਂਦੀ ਹੈ।' 
        },
        fertilizer: {
          en: 'Apply first dose of Nitrogen (Urea @ 45kg/acre) after irrigation.',
          hi: 'सिंचाई के ठीक बाद पहली खुराक नाइट्रोजन (यूरिया @ 45 किलो/एकड़) डालें।',
          pa: 'ਸਿੰਚਾਈ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਨਾਈਟ੍ਰੋਜਨ (ਯੂਰੀਆ @ 45 ਕਿਲੋ/ਏਕੜ) ਦੀ ਪਹਿਲੀ ਖੁਰਾਕ ਪਾਓ।'
        },
        water: {
          en: 'Critical light irrigation required. Avoid stagnant standing water.',
          hi: 'हल्की और अत्यंत आवश्यक सिंचाई करें। पानी भरा रहने न दें।',
          pa: 'ਹਲਕੀ ਤੇ ਬਹੁਤ ਜ਼ਰੂਰੀ ਸਿੰਚਾਈ ਕਰੋ। ਪਾਣੀ ਖੜ੍ਹਾ ਨਾ ਹੋਣ ਦਿਓ।'
        }
      },
      {
        name: { en: 'Tillering Stage', hi: 'कल्ले निकलने का चरण', pa: 'ਬੂਟਾ ਮਾਰਨ ਦਾ ਪੜਾਅ' },
        start: 26,
        end: 45,
        tips: { 
          en: 'Crops are starting to branch out. Ensure weed-free fields.', 
          hi: 'इस समय फसल में नए कल्ले फूटना शुरू होते हैं। खेत को खरपतवार मुक्त रखें।', 
          pa: 'ਇਸ ਸਮੇਂ ਫਸਲ ਦੇ ਨਵੇਂ ਕੱਲੇ ਨਿਕਲਦੇ ਹਨ। ਖੇਤ ਨੂੰ ਨਦੀਨ ਮੁਕਤ ਰੱਖੋ।' 
        },
        fertilizer: {
          en: 'Second dose of nitrogen (Urea @ 40-45kg/acre) if soil moisture is good.',
          hi: 'यदि मिट्टी में अच्छी नमी हो तो नाइट्रोजन की दूसरी खुराक (यूरिया @ 40-45 किलो/एकड़) डालें।',
          pa: 'ਜੇਕਰ ਮਿੱਟੀ ਸਹੀ ਨਮੀ ਵਾਲੀ ਹੋਵੇ ਤਾਂ ਯੂਰੀਆ (@ 40-45 ਕਿਲੋ/ਏਕੜ) ਦੀ ਦੂਜੀ ਖੁਰਾਕ ਪਾਓ।'
        },
        water: {
          en: 'Regular moderate irrigation when upper soil feels dry.',
          hi: 'जब ऊपरी मिट्टी सूखी लगे तो मध्यम सिंचाई करें।',
          pa: 'ਜਦੋਂ ਉੱਪਰਲੀ ਮਿੱਟੀ ਸੁੱਕੀ ਲੱਗੇ ਤਾਂ ਦਰਮਿਆਨੀ ਸਿੰਚਾਈ ਕਰੋ।'
        }
      },
      {
        name: { en: 'Jointing Stage', hi: 'गांठ बनने का चरण', pa: 'ਗੰਢਾਂ ਬਣਨ ਦਾ ਪੜਾਅ' },
        start: 46,
        end: 75,
        tips: { 
          en: 'The stem starts to elongate fast. Check leaf health and Yellow Rust symptoms.', 
          hi: 'तना तेजी से लम्बा होने लगता है। पीला रतुआ (Yellow Rust) के लक्षणों पर नजर रखें।', 
          pa: 'ਤਣਾ ਤੇਜ਼ੀ ਨਾਲ ਉੱਪਰ ਜਾਂਦਾ ਹੈ। ਪੀਲੇ ਕੁੰਗੀ (Yellow Rust) ਦੇ ਲੱਛਣਾਂ ‘ਤੇ ਨਜ਼ਰ ਰੱਖੋ।' 
        },
        fertilizer: {
          en: 'A mild top spray of NPK (19:19:19 @ 1kg/acre) boosts vegetative energy.',
          hi: 'एनपीके (19:19:19 @ 1 किलो/एकड़) का हल्का फोलियर स्प्रे पत्तों को मजबूती देता है।',
          pa: 'ਐਨਪੀਕੇ (19:19:19 @ 1 ਕਿਲੋ/ਏਕੜ) ਦਾ ਛਿੜਕਾਅ ਪੱਤਿਆਂ ਦੀ ਮਜ਼ਬੂਤੀ ਲਈ ਵਧੀਆ ਹੈ।'
        },
        water: {
          en: 'Maintain optimum soil moisture level to support rapid stalk growing.',
          hi: 'तेजी से तने की बढ़ोतरी के लिए खेत में नमी का स्तर उचित बनाए रखें।',
          pa: 'ਤਣੇ ਦੇ ਵਾਧੇ ਲਈ ਖੇਤ ਵਿੱਚ ਸਹੀ ਨਮੀ ਬਣਾਈ ਰੱਖੋ।'
        }
      },
      {
        name: { en: 'Flowering & Heading', hi: 'बाली विकास एवं फूल आना', pa: 'ਸਿੱਟਾ ਲੱਗਣ ਤੇ ਫੁੱਲ ਪੈਣ ਦਾ ਪੜਾਅ' },
        start: 76,
        end: 100,
        tips: { 
          en: 'Spikes are emerging. Do not spray harsh chemicals directly on open flowers.', 
          hi: 'बालियां बाहर आ रही होती हैं। खिले हुए फूलों पर सीधे तेज रसायनों का छिड़काव न करें।', 
          pa: 'ਸਿੱਟੇ ਬਾਹਰ ਆ ਰਹੇ ਹੁੰਦੇ ਹਨ। ਖਿੜੇ ਹੋਏ ਫੁੱਲਾਂ ਤੇ ਤੇਜ਼ ਰਸਾਇਣਾਂ ਦਾ ਛਿੜਕਾਅ ਨਾ ਕਰੋ।' 
        },
        fertilizer: {
          en: 'Apply Soluble Potash (0:0:50 @ 1.5kg/acre) for bold, heavy grain development.',
          hi: 'चमकदार और भारी दाने के विकास के लिए पोटेशियम सल्फेट (0:0:50 @ 1.5 किलो/एकड़) का छिड़काव करें।',
          pa: 'ਚਮਕਦਾਰ ਦਾਣਿਆਂ ਲਈ ਪੋਟਾਸ਼ੀਅਮ ਸਲਫੇਟ (0:0:50 @ 1.5 ਕਿਲੋ/ਏਕੜ) ਦਾ ਸਪਰੇਅ ਕਰੋ।'
        },
        water: {
          en: 'Ensure adequate moisture. Avoid lodging due to heavy irrigation during windy days.',
          hi: 'खेत में पर्याप्त नमी रखें। तेज हवा के समय पानी न लगाएं ताकि फसल गिरे नहीं।',
          pa: 'ਖੇਤ ਵਿੱਚ ਨਮੀ ਰੱਖੋ। ਤੇਜ਼ ਹਵਾ ਸਮੇਂ ਪਾਣੀ ਲਗਾਉਣ ਤੋਂ ਬਚੋ ਤਾਂ ਜੋ ਫਸਲ ਡਿੱਗੇ ਨਾ।'
        }
      },
      {
        name: { en: 'Milking & Dough Stage', hi: 'दूधिया और दाना सख्त होने का चरण', pa: 'ਦੁੱਧਾ ਤੇ ਦਾਣਾ ਬਣਨ ਦਾ ਪੜਾਅ' },
        start: 101,
        end: 120,
        tips: { 
          en: 'Grain is soft and liquid. Ensure protection against high temperature wind.', 
          hi: 'दाना काफी मुलायम दूर जैसे भरा होता है। तेज धूप और लू से फसल को बचाएं।', 
          pa: 'ਦਾਣੇ ਵਿੱਚ ਦੁੱਧ ਭਰਿਆ ਹੁੰਦਾ ਹੈ। ਲੂ ਅਤੇ ਤੇਜ਼ ਧੁੱਪ ਤੋਂ ਆਖਰੀ ਬਚਾਅ ਜ਼ਰੂਰੀ ਹੈ।' 
        },
        fertilizer: {
          en: 'No additional soil fertilizers needed. Prevent any chemical residues now.',
          hi: 'अब कोई नया मिट्टी खाद नहीं चाहिए। कीटनाशकों का प्रयोग बंद करें।',
          pa: 'ਹੁਣ ਕੋਈ ਨਵਾਂ ਖਾਦ ਪਾਉਣ ਦੀ ਲੋੜ ਨਹੀਂ। ਕੀਟਨਾਸ਼ਕਾਂ ਦੀ ਵਰਤੋਂ ਬੰਦ ਕਰੋ।'
        },
        water: {
          en: 'Last minor irrigation if needed to complete grain-filling starches.',
          hi: 'दूधिया अवस्था में दाने को पूरा स्टार्च देने के लिए आखिरी हल्की सिंचाई करें।',
          pa: 'ਦਾਣਾ ਭਰਨ ਲਈ ਆਖਰੀ ਹਲਕੀ ਸਿੰਚਾਈ ਕਰੋ।'
        }
      },
      {
        name: { en: 'Maturity / Harvest', hi: 'परिपक्वता एवं फसल कटाई', pa: 'ਪੱਕਣ ਤੇ ਕਟਾਈ ਦਾ ਪੜਾਅ' },
        start: 121,
        end: 140,
        tips: { 
          en: 'Grains have turned hard and golden. Moisture content should be around 14% for storage.', 
          hi: 'दाने सुनहरे और कठोर हो गए हैं। भंडारण के लिए दानों में नमी 14% से कम रखें।', 
          pa: 'ਦਾਣੇ ਸੁਨਹਿਰੀ ਤੇ ਸਖਤ ਹੋ ਗਏ ਹਨ। ਭੰਡਾਰਨ ਲਈ ਨਮੀ 14% ਤੋਂ ਘੱਟ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।' 
        },
        fertilizer: {
          en: 'Ready for harvesting. No fertilizers.',
          hi: 'फसल कटाई के लिए तैयार है। कोई उर्वरक न डालें।',
          pa: 'ਫਸਲ ਕਟਾਈ ਲਈ ਤਿਆਰ ਹੈ। ਕੋਈ ਖਾਦ ਨਾ ਪਾਓ।'
        },
        water: {
          en: 'Stop irrigation completely 15 days prior to harvest.',
          hi: 'कटाई से कम से कम 15 दिन पहले सिंचाई पूरी तरह से बंद कर दें।',
          pa: 'ਕਟਾਈ ਤੋਂ 15 ਦਿਨ ਪਹਿਲਾਂ ਸਿੰਚਾਈ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬੰਦ ਕਰ ਦਿਓ।'
        }
      }
    ]
  },
  rice: {
    id: 'rice',
    name: { en: 'Paddy / Rice', hi: 'धान (Paddy/Rice)', pa: 'ਝੋਨਾ (ਜੀਰੀ)' },
    duration: 145,
    icon: '🌾',
    stages: [
      {
        name: { en: 'Nursery & Transplanting', hi: 'नर्सरी और रोपाई का चरण', pa: 'ਪਨੀਰੀ ਤੇ ਲੁਆਈ ਦਾ ਪੜਾਅ' },
        start: 0,
        end: 25,
        tips: { 
          en: 'Ensure healthy seedlings of 25 days before transplanting into puddled fields.', 
          hi: 'खेत में रोपाई करने से पहले नर्सरी के पौधे 25 दिन के और स्वस्थ होने चाहिए।', 
          pa: 'ਲੁਆਈ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਪਨੀਰੀ ਦੇ ਬੂਟੇ 25 ਦਿਨਾਂ ਦੇ ਤੇ ਤੰਦਰੁਸਤ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ।' 
        },
        fertilizer: {
          en: 'Incorporate starter NPK + Zinc Sulphate (21% @ 10kg/acre) during puddling.',
          hi: 'रोपाई से पहले कद्दू करते समय जिंक सल्फेट (21% @ 10 किलो/एकड़) जरूर मिलाएं।',
          pa: 'ਲੁਆਈ ਸਮੇਂ ਕੱਦੂ ਕਰਦੇ ਹੋਏ ਜ਼ਿੰਕ ਸਲਫੇਟ (@ 10 ਕਿਲੋ/ਏਕੜ) ਜ਼ਰੂਰ ਮਿਲਾਓ।'
        },
        water: {
          en: 'Maintain shallow standing water (2-3 cm) in transplanting phase.',
          hi: 'रोपाई के समय खेत में 2-3 सेमी हल्का खड़ा पानी बनाए रखें।',
          pa: 'ਲੁਆਈ ਦੇ ਸਮੇਂ ਖੇਤ ਵਿੱਚ 2-3 ਸੈਂਟੀਮੀਟਰ ਖੜ੍ਹਾ ਪਾਣੀ ਰੱਖੋ।'
        }
      },
      {
        name: { en: 'Active Tillering Phase', hi: 'सक्रिय कल्ले फूटने का चरण', pa: 'ਬੂਟਾ ਮਾਰਨ ਦਾ ਮੁੱਖ ਪੜਾਅ' },
        start: 26,
        end: 55,
        tips: { 
          en: 'Tillers are emerging. Keep field weeded or apply selective post-emergence weedicide.', 
          hi: 'धान के कल्ले निकल रहे हैं। खेत साफ रखें या उचित खरपतवार नाशक का प्रयोग करें।', 
          pa: 'ਝੋਨੇ ਦੇ ਕੱਲੇ ਨਿਕਲ ਰਹੇ ਹਨ। ਖੇਤ ਸਾਫ਼ ਰੱਖੋ ਜਾਂ ਸਹੀ ਨਦੀਨਨਾਸ਼ਕ ਦੀ ਵਰਤੋਂ ਕਰੋ।' 
        },
        fertilizer: {
          en: 'Top dress Urea (40kg/acre) inside standing water layer.',
          hi: 'खड़े पानी की उपस्थिति में यूरिया खाद (40 किलो/एकड़) का छिड़काव करें।',
          pa: 'ਖੜ੍ਹੇ ਪਾਣੀ ਦੀ ਹਾਜ਼ਰੀ ਵਿਚ ਯੂਰੀਆ (@ 40 ਕਿਲੋ/ਏਕੜ) ਦਾ ਛਿੱਟਾ ਦਿਓ।'
        },
        water: {
          en: 'Steady standing water depth of 5 cm helps tillering consistency.',
          hi: 'खेत में लगातार 5 सेमी पानी का भराव कल्लों की अच्छी बढ़वार में सहायक है।',
          pa: 'ਖੇਤ ਵਿੱਚ ਲਗਾਤਾਰ 5 ਸੈਂਟੀਮੀਟਰ ਪਾਣੀ ਦਾ ਭਰਾਅ ਵਧੀਆ ਬੂਟੇ ਲਈ ਮਦਦਗਾਰ ਹੈ।'
        }
      },
      {
        name: { en: 'Panicle Initiation', hi: 'बाली निर्माण शुरुआत चरण', pa: 'ਨਿਸਾਰੇ ਦੀ ਸ਼ੁਰੂਆਤ' },
        start: 56,
        end: 75,
        tips: { 
          en: 'Inflection point where grain buds form. Monitor closely for Stem Borer bugs.', 
          hi: 'बाली बनने का सबसे मुख्य समय। तना छेदक (Stem Borer) कीट के हमले पर ध्यान दें।', 
          pa: 'ਸਿੱਟਾ ਬਣਨ ਦਾ ਸਭ ਤੋਂ ਖਾਸ ਸਮਾਂ। ਤਣਾ ਛੇਦਕ (Stem Borer) ਕੀੜੇ ‘ਤੇ ਨਜ਼ਰ ਰੱਖੋ।' 
        },
        fertilizer: {
          en: 'Final dose of Nitrogen (Urea @ 35kg/acre). Avoid excess nitrogen in basmati.',
          hi: 'यूरिया की अंतिम खुराक (35 किलो/एकड़) डालें। बासमती में अधिक यूरिया न दें।',
          pa: 'ਯੂਰੀਆ ਦੀ ਆਖਰੀ ਖੁਰਾਕ (35 ਕਿਲੋ/ਏਕੜ) ਪਾਓ। ਬਾਸਮਤੀ ਵਿੱਚ ਜ਼ਿਆਦਾ ਯੂਰੀਆ ਨਾ ਪਾਓ।'
        },
        water: {
          en: 'Must have continuous moisture. Never let the paddy soil dry up during panicling.',
          hi: 'नमी लगातार बनी रहनी चाहिए। इस चरण में खेत को कभी भी सूखा न होने दें।',
          pa: 'ਨਮੀ ਲਗਾਤਾਰ ਬਣੀ ਰਹਿਣੀ ਚਾਹੀਦੀ ਹੈ। ਇਸ ਪੜਾਅ ‘ਤੇ ਖੇਤ ਨੂੰ ਕਦੇ ਸੁੱਕਣ ਨਾ ਦਿਓ।'
        }
      },
      {
        name: { en: 'Heading & Flowering', hi: 'निसारा एवं फूल आने की अवस्था', pa: 'ਪੂਰਾ ਨਿਸਾਰਾ ਤੇ ਫੁੱਲ ਪੈਣਾ' },
        start: 76,
        end: 105,
        tips: { 
          en: 'Flowers open in morning. Monitor temperature. High wind can cause sterile hulls.', 
          hi: 'सुबह बालिओं पर छोटे फूल दिखाई देते हैं। तेज गरम हवाओं पर नजर रखें।', 
          pa: 'ਸਵੇਰੇ ਸਿੱਟਿਆਂ ਤੇ ਫੁੱਲ ਨਜ਼ਰ ਆਉਂਦੇ ਹਨ। ਤੇਜ਼ ਗਰਮ ਹਵਾ ਤੋਂ ਫਸਲ ਦਾ ਬਚਾਅ ਰੱਖੋ।' 
        },
        fertilizer: {
          en: 'Apply potash spray if not supplemented earlier.',
          hi: 'यदि पहले पोटाश नहीं डाला है, तो अब घुलनशील पोटाश सल्फेट का छिड़काव करें।',
          pa: 'ਜੇਕਰ ਪਹਿਲਾਂ ਪੋਟਾਸ਼ ਨਹੀਂ ਪਾਇਆ, ਤਾਂ ਹੁਣ ਘੁਲਣਸ਼ੀਲ ਪੋਟਾਸ਼ ਦਾ ਸਪਰੇਅ ਕਰੋ।'
        },
        water: {
          en: 'Active saturation required. Do not allow lack of water.',
          hi: 'पानी का पर्याप्त स्तर होना अनिवार्य है। पानी की कमी न होने दें।',
          pa: 'ਪਾਣੀ ਦਾ ਸਹੀ ਪੱਧਰ ਹੋਣਾ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ। ਪਾਣੀ ਦੀ ਘਾਟ ਨਾ ਹੋਣ ਦਿਓ।'
        }
      },
      {
        name: { en: 'Grain Filling & Maturity', hi: 'दाना भराव एवं परिपक्वता', pa: 'ਦਾਣਾ ਭਰਨ ਤੇ ਪੱਕਣ ਦਾ ਪੜਾਅ' },
        start: 106,
        end: 145,
        tips: { 
          en: 'White milky juice turns to hard starch. Grains change to golden yellow colors.', 
          hi: 'दूधिया दाना सख्त चावल स्टार्च में बदलने लगता है। दाने सुनहरे पीले हो जाएंगे।', 
          pa: 'ਦੁੱਧਾ ਦਾਣਾ ਸਖਤ ਚੌਲ ਵਿੱਚ ਬਦਲਣ ਲੱਗਦਾ ਹੈ। ਦਾਣੇ ਸੁਨਹਿਰੀ ਪੀਲੇ ਹੋ ਜਾਣਗੇ।' 
        },
        fertilizer: {
          en: 'No fertilization. Let the natural maturity run.',
          hi: 'कोई उर्वरक नहीं। प्राकृतिक रूप से पकने दें।',
          pa: 'ਕੋਈ ਹੋਰ ਖਾਦ ਨਹੀਂ। ਫਸਲ ਨੂੰ ਕੁਦਰਤੀ ਰੂਪ ਵਿਚ ਪੱਕਣ ਦਿਓ।'
        },
        water: {
          en: 'Drain the field entirely 10-14 days before harvest to solidify ground.',
          hi: 'भूमि को मजबूत करने के लिए कटाई से 10-14 दिन पहले खेत का पानी निकाल दें।',
          pa: 'ਜ਼ਮੀਨ ਨੂੰ ਸੁਕਾਉਣ ਲਈ ਕਟਾਈ ਤੋਂ 10-14 ਦਿਨ ਪਹਿਲਾਂ ਖੇਤ ਦਾ ਪਾਣੀ ਕੱਢ ਦਿਓ।'
        }
      }
    ]
  },
  tomato: {
    id: 'tomato',
    name: { en: 'Tomato', hi: 'टमाटर (Tomato)', pa: 'ਟਮਾਟਰ' },
    duration: 120,
    icon: '🍅',
    stages: [
      {
        name: { en: 'Seedling & Transplant', hi: 'पौध विकास और रोपण', pa: 'ਪਨੀਰੀ ਤੇ ਲੁਆਈ' },
        start: 0,
        end: 20,
        tips: { 
          en: 'Transplant sturdy bushy seedlings in rich well-draining soil.', 
          hi: 'अच्छी जल निकासी वाली समृद्ध मिट्टी में स्वस्थ पौधों की रोपाई करें।', 
          pa: 'ਵਧੀਆ ਨਿਕਾਸੀ ਵਾਲੀ ਜ਼ਮੀਨ ਵਿੱਚ ਤੰਦਰੁਸਤ ਬੂਟਿਆਂ ਦੀ ਲੁਆਈ ਕਰੋ।' 
        },
        fertilizer: {
          en: 'Provide a phosphatic starter compost as root bio-booster.',
          hi: 'जड़ों के बेहतर विकास के लिए रोपाई के समय फास्फोरस युक्त जैविक खाद या डीएपी डालें।',
          pa: 'ਜੜ੍ਹਾਂ ਦੇ ਵਧੀਆ ਵਿਕਾਸ ਲਈ ਲੁਆਈ ਸਮੇਂ ਡੀਏਪੀ ਜਾਂ ਜੈਵਿਕ ਖਾਦ ਪਾਓ।'
        },
        water: {
          en: 'Water immediately after transplanting. Keep roots damp.',
          hi: 'रोपाई के तुरंत बाद हल्की सिंचाई करें। जड़ों को सूखने न दें।',
          pa: 'ਲੁਆਈ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਸਿੰਚਾਈ ਕਰੋ। ਜੜ੍ਹਾਂ ਨੂੰ ਸੁੱਕਣ ਨਾ ਦਿਓ।'
        }
      },
      {
        name: { en: 'Vegetative Growth', hi: 'वानस्पतिक विकास चरण', pa: 'ਬੂਟੇ ਦਾ ਵਾਧਾ ਪੜਾਅ' },
        start: 21,
        end: 45,
        tips: { 
          en: 'Set up bamboo stakes or metal cages. Prune early side stems to focus power.', 
          hi: 'पौधों को सहारा देने के लिए बांस की डंडियों या तार से बांधें। शुरुआत की सखाएँ छांटें।', 
          pa: 'ਬੂਟਿਆਂ ਦੇ ਸਹਾਰੇ ਲਈ ਬਾਂਸ ਦੀਆਂ ਸੋਟੀਆਂ ਲਗਾਓ। ਸ਼ੁਰੂਆਤੀ ਵਾਧੂ ਸਾਖਾਂ ਕੱਟ ਦਿਓ।' 
        },
        fertilizer: {
          en: 'Apply nitrogen rich soluble fertilizer (NPK 19:19:19) for leaf development.',
          hi: 'अच्छे हरी पत्तियों के विकास के लिए घुलनशील एनपीके 19:19:19 का छिड़काव करें।',
          pa: 'ਪੱਤਿਆਂ ਦੇ ਵਧੀਆ ਵਾਧੇ ਲਈ ਐਨਪੀਕੇ 19:19:19 ਦਾ ਛਿੜਕਾਅ ਕਰੋ।'
        },
        water: {
          en: 'Deep watering 2-3 times a week. Prevent overhead splashing to avoid leaf blight.',
          hi: 'हफ़्ते में 2-3 बार गहरी सिंचाई करें। पत्तों पर सीधे पानी डालने से बचें ताकि फफूंदी न लगे।',
          pa: 'ਹਫ਼ਤੇ ਵਿੱਚ 2-3 ਵਾਰ ਡੂੰਘੀ ਸਿੰਚਾਈ ਕਰੋ। ਪੱਤਿਆਂ ਤੇ ਸਿੱਧਾ ਪਾਣੀ ਪਾਉਣ ਤੋਂ ਬਚੋ।'
        }
      },
      {
        name: { en: 'Flowering & Setting', hi: 'फूल विकास एवं फल बनना शुरुआत', pa: 'ਫੁੱਲ ਤੇ ਫਲ ਪੈਣ ਦਾ ਸਮਾਂ' },
        start: 46,
        end: 75,
        tips: { 
          en: 'Bright yellow flowers emerge. Blossom end rot occurs if calcium is low in soil.', 
          hi: 'चमकीले पीले फूल आते हैं। मिट्टी में कैल्शियम की कमी होने पर फल नीचे से काले (Blossom end rot) होने लगते हैं।', 
          pa: 'ਪੀਲੇ ਫੁੱਲ ਨਿਕਲਦੇ ਹਨ। ਮਿੱਟੀ ਵਿਚ ਕੈਲਸ਼ੀਅਮ ਦੀ ਕਮੀ ਕਾਰਨ ਫਲ ਹੇਠੋਂ ਕਾਲੇ ਪੈ ਸਕਦੇ ਹਨ।' 
        },
        fertilizer: {
          en: 'Reduce Nitrogen now. Provide Calcium Nitrate (5g/liter) and micronutrient Boron spray.',
          hi: 'अब नाइट्रोजन घटाएं। कली झड़ने से रोकने के लिए कैल्शियम नाइट्रेट और बोरॉन का छिड़काव करें।',
          pa: 'ਹੁਣ ਨਾਈਟ੍ਰੋਜਨ ਘਟਾਓ। ਫੁੱਲ ਝੜਨ ਤੋਂ ਰੋਕਣ ਲਈ ਕੈਲਸ਼ੀਅਮ ਨਾਈਟ੍ਰੇਟ ਤੇ ਬੋਰਾਨ ਦਾ ਸਪਰੇਅ ਕਰੋ।'
        },
        water: {
          en: 'Highly regular water scheduling is critical. Irregular watering cracks mature tomatoes.',
          hi: 'नियमित पानी देना बेहद जरूरी है। अनियमित सिंचाई से टमाटर फटने लगते हैं।',
          pa: 'ਲਗਾਤਾਰ ਸਹੀ ਸਿੰਚਾਈ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ। ਅਨਿਯਮਿਤ ਸਿੰਚਾਈ ਨਾਲ ਟਮਾਟਰ ਪਾਟਣ ਲੱਗ ਜਾਂਦੇ ਹਨ।'
        }
      },
      {
        name: { en: 'Fruit Bulking & Ripening', hi: 'फल विकास और लाल होना', pa: 'ਫਲਾਂ ਦਾ ਵਾਧਾ ਤੇ ਲਾਲ ਹੋਣਾ' },
        start: 76,
        end: 120,
        tips: { 
          en: 'Green fruits swell and start turning orange-red. Harvest when firm and colorful.', 
          hi: 'हरे फल बड़े होते हैं और धीरे-धीरे पककर लाल हो जाते हैं। पूर्ण रूप से स्वस्थ और लाल होने पर तुड़ाई करें।', 
          pa: 'ਹਰੇ ਫਲ ਵੱਡੇ ਹੋ ਕੇ ਲਾਲ ਰੰਗ ਦੇ ਹੋ ਜਾਂਦੇ ਹਨ। ਜਦੋਂ ਫਲ ਲਾਲ ਤੇ ਸਖਤ ਹੋਵੇ, ਉਦੋਂ ਹੀ ਤੋੜੋ।' 
        },
        fertilizer: {
          en: 'Spray NPK 0:0:50 Potash for sweetness and maximum fruit weights.',
          hi: 'टमाटर में मिठास और वजन बढ़ाने के लिए पोटाश (0:0:50 @ 1.5 ग्राम/लीटर) का स्प्रे करें।',
          pa: 'ਟਮਾਟਰ ਵਿਚ ਮਿਠਾਸ ਤੇ ਵਜ਼ਨ ਵਧਾਉਣ ਲਈ ਪੋਟਾਸ਼ (0:0:50) ਦਾ ਸਪਰੇਅ ਕਰੋ।'
        },
        water: {
          en: 'Reduce watering quantity slightly during ripening to concentrate flavors.',
          hi: 'स्वाद और गाढ़ापन बेहतर करने के लिए टमाटर लाल होते समय पानी थोड़ा कम दें।',
          pa: 'ਟਮਾਟਰ ਲਾਲ ਹੋਣ ਵੇਲੇ ਪਾਣੀ ਥੋੜ੍ਹਾ ਘੱਟ ਲਗਾਓ।'
        }
      }
    ]
  },
  potato: {
    id: 'potato',
    name: { en: 'Potato', hi: 'आलू (Potato)', pa: 'ਆਲੂ' },
    duration: 110,
    icon: '🥔',
    stages: [
      {
        name: { en: 'Sprouting & Emergence', hi: 'आलू अंकुरण एवं कली फूटने का चरण', pa: 'ਆਲੂ ਦਾ ਜੰਮਣਾ ਤੇ ਉੱਗਣਾ' },
        start: 0,
        end: 20,
        tips: { 
          en: 'Seed tubers germinate below ridges. Assure no weeds compete at emergence.', 
          hi: 'आलू की बुवाई की हुई मेड (ridges) के नीचे अंकुर फूटने लगते हैं। खेत साफ रखें।', 
          pa: 'ਆਲੂ ਦੀਆਂ ਖੇਲਾਂ (ridges) ਹੇਠਾਂ ਅੰਕੁਰ ਨਿਕਲਣ ਲੱਗਦੇ ਹਨ। ਖੇਤ ਸਾਫ਼ ਰੱਖੋ।' 
        },
        fertilizer: {
          en: 'DAP (50kg/acre) and organic compost added on sowing ridges.',
          hi: 'बुवाई के समय डीएपी (DAP @ 50 किलो/एकड़) और जैविक कम्पोस्ट मेड पर डालें।',
          pa: 'ਬਿਜਾਈ ਦੇ ਸਮੇਂ ਡੀਏਪੀ (@ 50 ਕਿਲੋ/ਏਕੜ) ਤੇ ਦੇਸੀ ਰੂੜੀ ਖਾਦ ਪਾਓ।'
        },
        water: {
          en: 'ridge dampness must be maintained. Do not submerge the ridges.',
          hi: 'आलू की मेड में नमी रखें लेकिन पानी को ऊपर तक न जाने दें ताकि आलू सड़े नहीं।',
          pa: 'ਖੇਲਾਂ ਵਿਚ ਨਮੀ ਰੱਖੋ ਪਰ ਪਾਣੀ ਨੂੰ ਉੱਪਰ ਚੜ੍ਹਨ ਤੋਂ ਰੋਕੋ ਤਾਂ ਜੋ ਆਲੂ ਨਾ ਗਲਣ।'
        }
      },
      {
        name: { en: 'Stolon & Tuber Initiation', hi: 'तना विकास एवं आलू बनने की शुरुआत', pa: 'ਆਲੂ ਦੀਆਂ ਗੰਢਾਂ ਬਣਨ ਦਾ ਪੜਾਅ' },
        start: 21,
        end: 55,
        tips: { 
          en: 'Hilling up (Earthing-up) is critical now to cover stolons with rich soil.', 
          hi: 'मिट्टी चढ़ाने (Earthing-up) का कार्य अवश्य पूरा करें ताकि सूर्य की धूप से आलू हरे न हों।', 
          pa: 'ਆਲੂ ਦੇ ਬੂਟਿਆਂ ‘ਤੇ ਮਿੱਟੀ ਚੜ੍ਹਾਉਣ (Earthing-up) ਦਾ ਕੰਮ ਜ਼ਰੂਰ ਕਰੋ ਤਾਂ ਜੋ ਆਲੂ ਧੁੱਪ ਨਾਲ ਹਰੇ ਨਾ ਹੋਣ।' 
        },
        fertilizer: {
          en: 'Apply Ammonium Sulphate or Urea (45kg/acre) just before earthing up.',
          hi: 'मिट्टी चढ़ाने से ठीक पहले नाइट्रोजन (यूरिया @ 45 किलो/एकड़) डालें।',
          pa: 'ਬੂਟਿਆਂ ਤੇ ਮਿੱਟੀ ਚੜ੍ਹਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਯੂਰੀਆ (@ 45 ਕਿਲੋ/ਏਕੜ) ਪਾਓ।'
        },
        water: {
          en: 'Irrigate regularly. Water stress now results in fewer potatoes per plant.',
          hi: 'नियमित रूप से पानी दें। इस समय पानी की कमी आलू की संख्या कम कर देगी।',
          pa: 'ਸਹੀ ਸਮੇਂ ‘ਤੇ ਪਾਣੀ ਦਿਓ। ਇਸ ਸਮੇਂ ਪਾਣੀ ਦੀ ਘਾਟ ਕਾਰਨ ਆਲੂ ਘੱਟ ਬਣਨਗੇ।'
        }
      },
      {
        name: { en: 'Tuber Bulking', hi: 'आलू का आकार बड़ा होना (Tuber Bulking)', pa: 'ਆਲੂ ਦਾ ਸਾਈਜ਼ ਵਧਣ ਦਾ ਸਮਾਂ' },
        start: 56,
        end: 90,
        tips: { 
          en: 'Cell expansion. Monitor soil moisture carefully to prevent malformed tubers.', 
          hi: 'आलू का आकार तेजी से बढ़ता है। मिट्टी सूखी या कठोर न होने दें वरना आलू का आकार टेढ़ा हो जाएगा।', 
          pa: 'ਆਲੂ ਦਾ ਸਾਈਜ਼ ਤੇਜ਼ੀ ਨਾਲ ਵਧਦਾ ਹੈ। ਮਿੱਟੀ ਸਖਤ ਨਾ ਹੋਣ ਦਿਓ ਨਹੀਂ ਤਾਂ ਆਲੂ ਟੇਢੇ-ਮੇਢੇ ਹੋ ਜਾਣਗੇ।' 
        },
        fertilizer: {
          en: 'Foliar spray Potash NPK 0:0:50 + Micronutrients for dry matter percentage.',
          hi: 'आलू को मजबूत बनाने के लिए पोटाश (0:0:50 @ 15 ग्राम/लीटर) का स्प्रे करें।',
          pa: 'ਆਲੂ ਮਜ਼ਬੂਤ ਬਣਾਉਣ ਲਈ ਪੋਟਾਸ਼ (0:0:50) ਪੱਤਿਆਂ ਤੇ ਸਪਰੇਅ ਕਰੋ।'
        },
        water: {
          en: 'Consistent soil moisture. Late Blight disease thrives in combined cold + humid puddles.',
          hi: 'नमी समान रखें। अत्यधिक ठंड और गीलापन होने पर पछेता झुलसा (Late Blight) रोग का डर रहता है।',
          pa: 'ਨਮੀ ਬਰਾਬਰ ਰੱਖੋ। ਜ਼ਿਆਦਾ ਠੰਢ ਤੇ ਗਿੱਲੇਪਣ ਨਾਲ ਪਛੇਤਾ ਝੁਲਸ ਰੋਗ (Late Blight) ਲੱਗ ਸਕਦਾ ਹੈ।'
        }
      },
      {
        name: { en: 'Maturity / Skin Hardening', hi: 'परिपक्वता एवं खाल सख्त होना', pa: 'ਆਲੂ ਪੱਕਣ ਤੇ ਚਮੜੀ ਸਖਤ ਹੋਣਾ' },
        start: 91,
        end: 110,
        tips: { 
          en: 'Vines might dry or degrade. Skin hardens to resist damage during harvesting.', 
          hi: 'आलू के पत्ते सूखने लगते हैं। खुदाई से पहले आलू की त्वचा का सख्त होना जरूरी है।', 
          pa: 'ਆਲੂ ਦੇ ਪੱਤੇ ਸੁੱਕਣ ਲੱਗਦੇ ਹਨ। ਪੁਟਾਈ ਤੋਂ ਪਹਿਲਾਂ ਆਲੂ ਦੀ ਚਮੜੀ ਸਖਤ ਹੋਣੀ ਜ਼ਰੂਰੀ ਹੈ।' 
        },
        fertilizer: {
          en: 'No fertilizer. (Dehalming can be executed if vine green remains).',
          hi: 'कोई उर्वरक नहीं। खुदाई से 12 दिन पहले पत्तियों को ऊपर से काट (Dehalming) सकते हैं।',
          pa: 'ਕੋਈ ਖਾਦ ਨਹੀਂ। ਪੁਟਾਈ ਤੋਂ 12 ਦਿਨ ਪਹਿਲਾਂ ਪੱਤੇ ਉੱਪਰੋਂ ਕੱਟੇ (Dehalming) ਜਾ ਸਕਦੇ ਹਨ।'
        },
        water: {
          en: 'Stop irrigation entirely 10-14 days before harvest to harden the potato skins.',
          hi: 'खुदाई से 10-14 दिन पहले पानी देना पूरी तरह बंद करें ताकि खुरचन न हो।',
          pa: 'ਪੁਟਾਈ ਤੋਂ 10-14 ਦਿਨ ਪਹਿਲਾਂ ਪਾਣੀ ਬੰਦ ਕਰੋ ਤਾਂ ਜੋ ਚਮੜੀ ਨਾ ਛਿੱਲੇ।'
        }
      }
    ]
  },
  mustard: {
    id: 'mustard',
    name: { en: 'Mustard', hi: 'सरसों (Sarson)', pa: 'ਸਰੋਂ' },
    duration: 120,
    icon: '🟡',
    stages: [
      {
        name: { en: 'Emergence & Seedling', hi: 'अंकुरण एवं छोटा पौधा चरण', pa: 'ਸਰੋਂ ਦਾ ਜੰਮਣਾ ਤੇ ਛੋਟਾ ਬੂਟਾ' },
        start: 0,
        end: 20,
        tips: { 
          en: 'Plants show split first leaves. Protect against Flea Beetles or Painted Bugs.', 
          hi: 'छोटे अंकुर दिखाई देने लगते हैं। पेंटेड बग और पिस्सू भृंग (Flea Beetles) कीट से बचाएं।', 
          pa: 'ਛੋਟੇ ਬੂਟੇ ਨਿਕਲਦੇ ਹਨ। ਪੇਂਟਿਡ ਬੱਗ ਅਤੇ ਫਲੀ ਬੀਟਲ ਕੀੜੇ ਤੋਂ ਬਚਾਅ ਰੱਖੋ।' 
        },
        fertilizer: {
          en: 'Sulphur-containing fertilizers are critical (Single Super Phosphate @ 50kg/acre).',
          hi: 'सल्फर युक्त खाद डालना बहुत जरूरी है (सिंगल सुपर फास्फेट @ 50 किलो/एकड़)।',
          pa: 'ਸਲਫਰ ਵਾਲੀ ਖਾਦ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ (ਸਿੰਗਲ ਸੁਪਰ ਫਾਸਫੇਟ @ 50 ਕਿਲੋ/ਏਕੜ)।'
        },
        water: {
          en: 'Moderate initial moisture. Do not log water.',
          hi: 'मध्यम शुरूआती नमी रखें। क्यारियों में पानी ज्यादा जमा न होने पाए।',
          pa: 'ਦਰਮਿਆਨੀ ਸ਼ੁਰੂਆਤੀ ਨਮੀ ਰੱਖੋ। ਸੁੱਕੀ ਜਾਂ ਹਲਕੀ ਜ਼ਮੀਨ ਮੁਤਾਬਕ ਸਿੰਚਾਈ ਕਰੋ।'
        }
      },
      {
        name: { en: 'Vegetative Growth & Branching', hi: 'शाखाएं निकलने का चरण', pa: 'ਟਾਹਣੀਆਂ ਨਿਕਲਣ ਦਾ ਪੜਾਅ' },
        start: 21,
        end: 45,
        tips: { 
          en: 'Do thinning to keep plant distance 10-15 cm apart for heavy branching.', 
          hi: 'सरसों के पौधों के बीच 10-15 सेमी की दूरी रखने के लिए जरूरत से ज्यादा पौधों को उखाड़ (Thinning) दें।', 
          pa: 'ਬੂਟਿਆਂ ਦੇ ਚੰਗੇ ਵਾਧੇ ਲਈ ਸੰਘਣੇ ਬੂਟੇ ਪੁੱਟ ਕੇ ਦੂਰੀ 10-15 ਸੈਂਟੀਮੀਟਰ ਕਰੋ।' 
        },
        fertilizer: {
          en: 'Top dress half-remaining dose of Nitrogen (Urea @ 35kg/acre).',
          hi: 'नाइट्रोजन की बची हुई आधी खुराक (यूरिया @ 35 किलो/एकड़) का छिड़काव करें।',
          pa: 'ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਬਾਕੀ ਬਚੀ ਅੱਧੀ ਖੁਰਾਕ (ਯੂਰੀਆ @ 35 ਕਿਲੋ/ਏਕੜ) ਪਾਓ।'
        },
        water: {
          en: 'First principal irrigation at 30-35 days before flower initiation.',
          hi: 'बुवाई के 30-35 दिन बाद (फूल आने से पहले) पहली प्रमुख सिंचाई अवश्य करें।',
          pa: 'ਬਿਜਾਈ ਦੇ 30-35 ਦਿਨਾਂ ਬਾਅਦ (ਫੁੱਲ ਪੈਣ ਤੋਂ ਪਹਿਲਾਂ) ਪਹਿਲੀ ਸਿੰਚਾਈ ਜ਼ਰੂਰ ਕਰੋ।'
        }
      },
      {
        name: { en: 'Flowering & Pod (Siliqua) Formation', hi: 'पीले फूल एवं फली बनने की अवस्था', pa: 'ਫੁੱਲ ਤੇ ਫਲੀਆਂ ਬਣਨ ਦਾ ਸਮਾਂ' },
        start: 46,
        end: 85,
        tips: { 
          en: 'Beautiful yellow fields. Watch out for Aphids (chepa insect) attacks during cloudy days.', 
          hi: 'खेतों में पीले फूल। बादलमय मौसम में चेपा कीट (Aphids) के हमले पर विशेष नजर रखें।', 
          pa: 'ਖੇਤਾਂ ਵਿੱਚ ਪੀਲੇ ਫੁੱਲ ਖਿੜਦੇ ਹਨ। ਬੱਦਲਵਾਈ ਵਾਲੇ ਮੌਸਮ ‘ਚ ਚੇਪਾ (Aphids) ਦੇ ਹਮਲੇ ਤੋਂ ਬਚੋ।' 
        },
        fertilizer: {
          en: 'No solid nitrogen now. If Aphids appear, spray organic neem oil or recommended insecticide.',
          hi: 'अब यूरिया बिलकुल न डालें। चेपा दिखने पर नीम के तेल या अनुशंसित दवा का छिड़काव करें।',
          pa: 'ਹੁਣ ਯੂਰੀਆ ਬਿਲਕੁਲ ਨਾ ਪਾਓ। ਚੇਪਾ ਦਿਖਣ ਤੇ ਨਿੰਮ ਦੇ ਤੇਲ ਜਾਂ ਸਹੀ ਦਵਾਈ ਦਾ ਸਪਰੇਅ ਕਰੋ।'
        },
        water: {
          en: 'Second irrigation at pod filling stage. Do not allow severe soil cracks.',
          hi: 'फली बनते समय दूसरी सिंचाई करें। खेत को बहुत अधिक सूखा न छोड़ें।',
          pa: 'ਫਲੀਆਂ ਬਣਨ ਵੇਲੇ ਦੂਜੀ ਸਿੰਚਾਈ ਕਰੋ। ਖੇਤ ਵਿੱਚ ਤਰੇੜਾਂ ਨਾ ਪੈਣ ਦਿਓ।'
        }
      },
      {
        name: { en: 'Maturity & Seed Hardening', hi: 'परिपक्वता एवं फलियां सूखना', pa: 'ਪੱਕਣ ਦਾ ਪੜਾਅ' },
        start: 86,
        end: 120,
        tips: { 
          en: 'Pod turns yellow-brown. Ready to harvest when 75% siliquae turn golden.', 
          hi: 'फलियां पीली-भूरी होने लगती हैं। जब 75% फलियां सुनहरी हो जाएं, तब कटाई करें।', 
          pa: 'ਫਲੀਆਂ ਪੀਲੀਆਂ-ਭੂਰੀਆਂ ਹੋਣ ਲੱਗਦੀਆਂ ਹਨ। ਜਦੋਂ 75% ਫਲੀਆਂ ਸੁਨਹਿਰੀ ਹੋਵਣ, ਤਾਂ ਕਟਾਈ ਕਰੋ।' 
        },
        fertilizer: {
          en: 'Ready for harvest. No fertilizers required.',
          hi: 'कटाई के लिए तैयार। कोई उर्वरक नहीं चाहिए।',
          pa: 'ਕਟਾਈ ਲਈ ਤਿਆਰ। ਕੋਈ ਖਾਦ ਨਹੀਂ ਚਾਹੀਦੀ।'
        },
        water: {
          en: 'Stop irrigation completely to let seed dry inside dry pod pods.',
          hi: 'फलियों में दानों को अच्छी तरह सुखाने के लिए पानी देना बंद कर दें।',
          pa: 'ਦਾਣਿਆਂ ਨੂੰ ਸੁਕਾਉਣ ਲਈ ਸਿੰਚਾਈ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬੰਦ ਕਰ ਦਿਓ।'
        }
      }
    ]
  }
};

export default function CropGrowthTimeline({
  language,
  activeSession,
  onUpdateSession
}: CropGrowthTimelineProps) {
  const [selectedCrop, setSelectedCrop] = useState<string>(activeSession.cropType || 'wheat');
  const [plantingDateStr, setPlantingDateStr] = useState<string>(activeSession.plantingDate || '');
  const [showConfig, setShowConfig] = useState<boolean>(!activeSession.plantingDate);
  const [showDetails, setShowDetails] = useState<boolean>(true);

  // Calculate days since planting
  let daysSincePlanting = 0;
  if (activeSession.plantingDate) {
    const planting = new Date(activeSession.plantingDate);
    const today = new Date();
    // Reset hours to calculate exact days diff
    planting.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today.getTime() - planting.getTime());
    daysSincePlanting = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  const currentCrop = CROPS_DETAILS[activeSession.cropType || ''] || null;

  // Handle saving the crop planting log
  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantingDateStr) return;
    
    onUpdateSession(activeSession.id, {
      plantingDate: plantingDateStr,
      cropType: selectedCrop,
      // update title automatically if it matches standard default title to make it super recognizable
      title: activeSession.title.startsWith('Crop Diagnostic') || activeSession.title.startsWith('नया') || activeSession.title.startsWith('નਵੀਂ')
        ? `${CROPS_DETAILS[selectedCrop].name[language]} Tracker (${plantingDateStr})`
        : activeSession.title
    });
    setShowConfig(false);
  };

  const handleRemoveLog = () => {
    onUpdateSession(activeSession.id, {
      plantingDate: undefined,
      cropType: undefined
    });
    setPlantingDateStr('');
    setShowConfig(true);
  };

  // Find current growth stage based on Days since planting
  const getActiveStage = () => {
    if (!currentCrop) return null;
    const stage = currentCrop.stages.find(
      s => daysSincePlanting >= s.start && daysSincePlanting <= s.end
    );
    // If days exceed, return the last stage (Harvest/Maturity)
    if (!stage && daysSincePlanting > currentCrop.duration) {
      return currentCrop.stages[currentCrop.stages.length - 1];
    }
    return stage || currentCrop.stages[0];
  };

  const activeStage = getActiveStage();

  // Prepare chart data for Recharts area representation
  const getChartData = () => {
    if (!currentCrop) return [];
    
    const data: any[] = [];
    // Start point
    data.push({ day: 0, growth: 5, stageName: language === 'hi' ? 'बुवाई' : language === 'pa' ? 'ਬਿਜਾਈ' : 'Sowing' });

    currentCrop.stages.forEach((stage, idx) => {
      const midDay = Math.floor((stage.start + stage.end) / 2);
      // Growth curve height estimation index for visualization curve
      const heightIndex = Math.min(100, Math.round(((idx + 1) / currentCrop.stages.length) * 100));
      
      data.push({
        day: midDay,
        growth: heightIndex,
        stageName: stage.name[language]
      });
    });

    // End harvest point
    data.push({ 
      day: currentCrop.duration, 
      growth: 100, 
      stageName: language === 'hi' ? 'कटाई' : language === 'pa' ? 'ਕਟਾਈ' : 'Harvesting' 
    });

    return data;
  };

  // Stepper representation lists
  const currentDaysProgressPercent = currentCrop
    ? Math.min(100, Math.round((daysSincePlanting / currentCrop.duration) * 100))
    : 0;

  return (
    <div className="max-w-3xl mx-auto rounded-3xl bg-white border border-emerald-150 overflow-hidden shadow-lg animate-fadeIn text-gray-800 font-sans mb-6">
      
      {/* Header Panel with crop badge */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 px-5 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-emerald-900/40 flex items-center justify-center text-xl">
            {currentCrop ? currentCrop.icon : '🌱'}
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">
              {language === 'hi' ? 'फसल विकास ट्रैकर एवं समय-सीमा' : language === 'pa' ? 'ਫਸਲ ਵਿਕਾਸ ਟਰੈਕਰ ਤੇ ਸਮਾਂ-ਸੀਮਾ' : 'Crop Growth & Planting Log timeline'}
            </h3>
            {currentCrop && (
              <p className="text-[10px] text-emerald-100 font-mono">
                {currentCrop.name[language]} • {language === 'hi' ? `बुवाई तिथि: ${activeSession.plantingDate}` : language === 'pa' ? `ਬਿਜਾਈ ਮਿਤੀ: ${activeSession.plantingDate}` : `Planted on: ${activeSession.plantingDate}`}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentCrop && (
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-900/40 hover:bg-emerald-950/40 rounded-lg border border-emerald-600 transition-colors cursor-pointer"
            >
              {showConfig ? (language === 'hi' ? 'चार्ट देखें' : 'View Plot') : (language === 'hi' ? 'बदलाव करें' : 'Change Date')}
            </button>
          )}

          {currentCrop && (
            <button
              onClick={handleRemoveLog}
              className="p-1 hover:bg-red-800/40 text-red-200 hover:text-red-100 rounded-lg transition-colors cursor-pointer"
              title={language === 'hi' ? 'ट्रैकर हटाएं' : 'Delete log'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="p-1.5 hover:bg-emerald-900/40 rounded-lg transition-colors cursor-pointer"
          >
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="p-5 space-y-5">
          
          {/* Configure Panel when empty or clicking "change date" */}
          {showConfig ? (
            <form onSubmit={handleSaveLog} className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100 space-y-3.5">
              <div className="flex gap-1 items-center font-bold text-emerald-950 text-xs">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? 'खेती बुवाई लॉग दर्ज करें' : language === 'pa' ? 'ਬਿਜਾਈ ਤਾਰੀਖ ਦਰਜ ਕਰੋ' : 'Log Planting Details'}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {language === 'hi' ? 'फसल का प्रकार चुनें' : language === 'pa' ? 'ਫਸਲ ਦੀ ਕਿਸਮ ਚੁਣੋ' : 'Choose Crop'}
                  </label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full text-xs bg-white text-gray-800 border border-emerald-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-emerald-500 font-semibold"
                  >
                    {Object.values(CROPS_DETAILS).map((crop) => (
                      <option key={crop.id} value={crop.id}>
                        {crop.icon} {crop.name[language]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {language === 'hi' ? 'बुवाई / रोपाई की तिथि' : language === 'pa' ? 'ਬਿਜਾਈ / ਲੁਆਈ ਦੀ ਮਿਤੀ' : 'Planted / Sown Date'}
                  </label>
                  <input
                    type="date"
                    required
                    max={new Date().toISOString().split('T')[0]}
                    value={plantingDateStr}
                    onChange={(e) => setPlantingDateStr(e.target.value)}
                    className="w-full text-xs bg-white text-gray-800 border border-emerald-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-emerald-500 font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                {currentCrop && (
                  <button
                    type="button"
                    onClick={() => setShowConfig(false)}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold text-xs px-4 py-2 rounded-xl border border-gray-200 cursor-pointer"
                  >
                    {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2 rounded-xl transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <PlusButtonIcon /> {language === 'hi' ? 'लॉग सहेजें' : language === 'pa' ? 'ਸੇਵ ਕਰੋ' : 'Establish Growth Timeline'}
                </button>
              </div>
            </form>
          ) : (
            currentCrop && (
              <div className="space-y-5">
                
                {/* Active Stage & Alerts Banner */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                  
                  {/* Progress Stats Area */}
                  <div className="md:col-span-4 bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        {language === 'hi' ? 'फसल की आयु' : language === 'pa' ? 'ਫਸਲ ਦੀ ਉਮਰ' : 'Crop Age'}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-emerald-950">{daysSincePlanting}</span>
                        <span className="text-xs font-semibold text-emerald-900">{language === 'hi' ? 'दिन' : language === 'pa' ? 'ਦਿਨ' : 'days'}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-emerald-100/60 mt-3 space-y-2">
                      <div className="flex justify-between items-center text-[11px] font-semibold text-gray-600">
                        <span>{language === 'hi' ? 'कुल अवधि' : language === 'pa' ? 'ਕੁੱਲ ਸਮਾਂ' : 'Total Cycle'}</span>
                        <span className="font-mono text-emerald-950 font-bold">{currentCrop.duration} {language === 'hi' ? 'दिन' : 'days'}</span>
                      </div>
                      
                      <div className="w-full bg-emerald-100/55 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${currentDaysProgressPercent}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-right text-[10px] font-mono text-emerald-800 font-bold">
                        {currentDaysProgressPercent}% completed
                      </div>
                    </div>
                  </div>

                  {/* Active Stage Advice Area */}
                  <div className="md:col-span-8 bg-amber-50/45 border border-amber-200/60 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      {activeStage && (
                        <>
                          <div className="flex gap-1.5 items-center text-xs font-bold text-amber-900 pb-1.5 border-b border-amber-200/40">
                            <Activity className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>
                              {language === 'hi' ? 'वर्तमान स्तर:' : language === 'pa' ? 'ਮੌਜੂਦਾ ਸਟੇਜ:' : 'Active Phase:'}{' '}
                              <span className="text-emerald-950 font-black">{activeStage.name[language]}</span>
                            </span>
                          </div>
                          
                          <p className="text-[12px] leading-relaxed text-amber-950 font-medium mt-2">
                            🌾 <span className="font-bold">{language === 'hi' ? 'कृषि सलाह:' : language === 'pa' ? 'ਸਲਾਹ:' : 'Agronomy Tip:'}</span> {activeStage.tips[language]}
                          </p>
                        </>
                      )}
                    </div>

                    {activeStage && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200/40 mt-1">
                        <div className="text-[11px] text-emerald-900 rounded-lg bg-emerald-50/40 p-2 border border-emerald-100/30">
                          <span className="font-bold flex items-center gap-1 text-emerald-950 text-[10px] uppercase mb-0.5">
                            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                            {language === 'hi' ? 'खाद खुराक' : language === 'pa' ? 'ਖਾਦ ਪੱਧਰ' : 'Fertilization'}
                          </span>
                          <span className="text-[10px] leading-relaxed block">{activeStage.fertilizer[language]}</span>
                        </div>
                        <div className="text-[11px] text-amber-900 rounded-lg bg-amber-50/30 p-2 border border-amber-100/30">
                          <span className="font-bold flex items-center gap-1 text-amber-950 text-[10px] uppercase mb-0.5">
                            <Droplets className="w-3.5 h-3.5 text-blue-600" />
                            {language === 'hi' ? 'सिंचाई सुझाव' : language === 'pa' ? 'ਸਿੰਚਾਈ' : 'Watering'}
                          </span>
                          <span className="text-[10px] leading-relaxed block">{activeStage.water[language]}</span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Recharts Area Chart Visualization */}
                <div className="border border-gray-150 rounded-2xl p-4 bg-gray-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      {language === 'hi' ? 'फसल बढ़वार ग्राफ (उम्र के अनुसार)' : language === 'pa' ? 'ਫਸਲ ਵਿਕਾਸ ਗ੍ਰਾਫ਼' : 'Estimated Growth Height & Target Indices Curve'}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      recharts-assisted
                    </span>
                  </div>
                  
                  <div className="w-full h-44 text-[10px] font-mono leading-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={getChartData()}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="day" 
                          type="number" 
                          domain={[0, currentCrop.duration]} 
                          tickCount={6}
                          tickFormatter={(val) => `D-${val}`}
                          stroke="#6b7280"
                        />
                        <YAxis 
                          domain={[0, 100]}
                          tickFormatter={(val) => `${val}%`}
                          stroke="#6b7280"
                        />
                        <Tooltip 
                          formatter={(value: any, name: any, props: any) => [
                            `${value}% Growth Index`, 
                            props.payload.stageName || 'Stage'
                          ]}
                          labelFormatter={(label) => `Day: ${label}`}
                          contentStyle={{ 
                            borderRadius: '12px', 
                            border: '1px solid #10b981', 
                            fontSize: '11px', 
                            padding: '8px', 
                            boxShadow: '0 2px 5px rgba(0,0,0,0.08)' 
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="growth" 
                          stroke="#059669" 
                          strokeWidth={2.5}
                          fillOpacity={1} 
                          fill="url(#colorGrowth)" 
                        />
                        
                        {/* Reference indicator pointing to TODAY */}
                        {daysSincePlanting <= currentCrop.duration && (
                          <ReferenceLine 
                            x={daysSincePlanting} 
                            stroke="#e11d48" 
                            strokeWidth={2} 
                            strokeDasharray="4 4"
                            label={{ 
                              value: language === 'hi' ? 'आज' : language === 'pa' ? 'ਅੱਜ' : 'Today', 
                              position: 'top', 
                              fill: '#be123c', 
                              fontWeight: 'black',
                              fontSize: 10
                            }} 
                          />
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="text-center text-[10px] text-gray-500 font-medium">
                    {language === 'hi' 
                      ? '💡 सुझाव: बिंदू दाएँ जाने के साथ फसल बढ़ती जाएगी। लाल धारदार रेखा दर्शाती है कि आज आपके पौधे की उम्र कहाँ है।' 
                      : language === 'pa' 
                      ? '💡 ਸਲਾਹ: ਲਾਲ ਬਿੰਦੂ ਅਨੁਸਾਰ ਅੱਜ ਫਸਲ ਦੇ ਦਿਨ ਦਰਸਾਏ ਗਏ ਹਨ।' 
                      : '💡 Tip: Hover on the curve to inspect growth stage coordinates. The red dashed line marks your crop age today.'}
                  </div>
                </div>

                {/* Vertical Interactive Stage Checklist Stepper */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-gray-800 flex items-center gap-1">
                    <ClipboardList className="w-4 h-4 text-emerald-600" />
                    {language === 'hi' ? 'चरण-वार समय-सीमा विवरण' : language === 'pa' ? 'ਪੜਾਅ ਅਨੁਸਾਰ ਗਾਈਡ' : 'Chronological Growth Stages & Actions Checklist'}
                  </div>

                  <div className="relative pl-4 border-l border-emerald-100 space-y-3 mt-1 ml-2">
                    {currentCrop.stages.map((stage, idx) => {
                      const isActive = daysSincePlanting >= stage.start && daysSincePlanting <= stage.end;
                      const isPast = daysSincePlanting > stage.end;

                      return (
                        <div key={idx} className="relative">
                          {/* Stepper Bullet Node */}
                          <div className={`absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 ${
                            isActive 
                              ? 'bg-emerald-600 border-white ring-2 ring-emerald-500 animate-pulse'
                              : isPast
                              ? 'bg-emerald-500 border-white'
                              : 'bg-white border-gray-300'
                          }`} />

                          <div className={`p-3 rounded-xl border ${
                            isActive 
                              ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                              : isPast
                              ? 'bg-gray-50/40 border-gray-100 opacity-65'
                              : 'bg-white border-gray-200/70'
                          }`}>
                            <div className="flex justify-between items-start gap-1">
                              <span className={`text-[12px] font-bold ${isActive ? 'text-emerald-950 font-black' : isPast ? 'text-gray-600' : 'text-gray-800'}`}>
                                {stage.name[language]}
                              </span>
                              <span className="text-[9px] font-mono font-bold bg-gray-100 text-gray-600 rounded-md px-1.5 py-0.5 shrink-0">
                                Day {stage.start}-{stage.end}
                              </span>
                            </div>
                            
                            <p className="text-[10.5px] mt-1 text-gray-600 leading-normal">
                              {stage.tips[language]}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-2">
                              {isActive && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300/60 px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-mono">
                                  <Sparkles className="w-2.5 h-2.5" /> {language === 'hi' ? 'सक्रिय चरण' : language === 'pa' ? 'ਚੱਲ ਰਿਹਾ' : 'Active Period'}
                                </span>
                              )}
                              {isPast && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/50 px-1.5 py-0.5 rounded-sm uppercase">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> {language === 'hi' ? 'सम्पन्न' : language === 'pa' ? 'ਸਮਾਪਤ' : 'Past Stage'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}

function PlusButtonIcon() {
  return (
    <svg className="w-3.5 h-3.5 mr-1 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
