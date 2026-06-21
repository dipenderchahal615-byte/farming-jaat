import { useState, useEffect } from 'react';
import { Language } from '../types';
import { CalendarRange, Droplets, FlaskConical, Bell, BellRing, Settings, Play, Info, Sparkles } from 'lucide-react';

interface SeasonalAlertsProps {
  language: Language;
}

type RegionKey = 'north' | 'south' | 'west' | 'east';
type SeasonKey = 'kharif' | 'rabi' | 'zaid';

interface AdvisoryDetails {
  title: string;
  planting: string;
  irrigation: string;
  fertilizer: string;
}

// Complete localized region name mapping
const REGIONS: Record<Language, Record<RegionKey, string>> = {
  en: {
    north: "North India (PB, HR, UP)",
    south: "South India (AP, TS, TN, KA)",
    west: "West & Central (MH, GJ, MP)",
    east: "East India (BH, WB, OD)"
  },
  hi: {
    north: "उत्तर भारत (पंजाब, हरियाणा, यूपी)",
    south: "दक्षिण भारत (आंध्र, तेलंगाना, कर्नाटक)",
    west: "पश्चिम व मध्य भारत (महा., गुज., एमपी)",
    east: "पूर्वी भारत (बिहार, बंगाल, ओडिशा)"
  },
  pa: {
    north: "ਉੱਤਰੀ ਭਾਰਤ (ਪੰਜਾਬ, ਹਰਿਆਣਾ, ਯੂ.ਪੀ.)",
    south: "ਦੱਖਣੀ ਭਾਰਤ (ਆਂਧਰਾ, ਤੇਲੰਗਾਨਾ, ਕਰਨਾਟਕ)",
    west: "ਪੱਛਮੀ ਤੇ ਮੱਧ ਭਾਰਤ (ਮਹਾਰਾਸ਼ਟਰ, ਗੁਜਰਾਤ)",
    east: "ਪੂਰਬੀ ਭਾਰਤ (ਬਿਹਾਰ, ਬੰਗਾਲ, ਉੜੀਸਾ)"
  }
};

// Complete localized season name mapping
const SEASONS: Record<Language, Record<SeasonKey, string>> = {
  en: {
    kharif: "Kharif (Monsoon/Rainy)",
    rabi: "Rabi (Winter Season)",
    zaid: "Zaid (Summer/Short crop)"
  },
  hi: {
    kharif: "खरीफ (मानसून/वर्षा ऋतु)",
    rabi: "रबी (शीतकालीन/सर्दी ऋतु)",
    zaid: "जायद (गर्मी की अल्पावधि फसलें)"
  },
  pa: {
    kharif: "ਖ਼ਰੀਫ਼ (ਸੌਣੀ/ਮੀਂਹ ਦਾ ਮੌਸਮ)",
    rabi: "ਹਾੜੀ (ਸਿਆਲ/ਸਰਦੀਆਂ ਦਾ ਮੌਸਮ)",
    zaid: "ਜ਼ੈਦ (ਹਾੜੀ-ਸੌਣੀ ਵਿਚਕਾਰਲੀਆਂ ਫ਼ਸਲਾਂ)"
  }
};

// Rich localized advising database
const ADVISORY_DATA: Record<RegionKey, Record<SeasonKey, Record<Language, AdvisoryDetails>>> = {
  north: {
    kharif: {
      en: {
        title: "Paddy & Cotton Monsoon Advisory",
        planting: "Sow Paddy (PR-126/Kalyani) nurseries by mid-June. Maintain 25-day nursery seedling age before transplanting.",
        irrigation: "Keep water depth at 5cm for first 15 days in transplanted rice. Dry field for 1 day before re-watering to save diesel.",
        fertilizer: "Apply 1/3rd Nitrogen (Urea) at transplanting. Mix Zinc Sulphate 21% @ 10kg/acre to fight khaira disease."
      },
      hi: {
        title: "धान एवं कपास मानसून सलाह",
        planting: "धान की पौध (नर्सरी) जून मध्य तक तैयार करें। रोपाई के समय पौध 25 दिन से अधिक पुरानी न हो।",
        irrigation: "धान प्रिसिंचन: रोपाई के पहले 15 दिन खेत में 5 सेमी पानी रखें। जड़ सांस लेने के लिए 1 दिन खेत सुखाएं फिर सिंचाई करें।",
        fertilizer: "रोपाई पर 1/3 यूरिया डालें। धान को खैरा रोग से बचाने हेतु प्रति एकड़ 10 किलोग्राम जिंक सल्फेट (21%) डालें।"
      },
      pa: {
        title: "ਝੋਨਾ ਅਤੇ ਨਰਮਾ ਮਾਨਸੂਨ ਐਡਵਾਈਜ਼ਰੀ",
        planting: "ਝੋਨੇ (PR-126) ਦੀ ਪਨੀਰੀ ਜੂਨ ਦੇ ਵਿਚਕਾਰ ਲਗਾਓ। ਪਨੀਰੀ ਪੁੱਟ ਕੇ ਲਗਾਉਣ ਵੇਲੇ 25 ਦਿਨਾਂ ਤੋਂ ਵੱਧ ਦੀ ਨਾ ਹੋਵੇ।",
        irrigation: "ਝੋਨੇ ਦੀ ਲੁਆਈ ਦੇ ਪਹਿਲੇ 15 ਦਿਨ ਖੇਤ ਵਿੱਚ 5 ਸੈਂਟੀਮੀਟਰ ਪਾਣੀ ਖੜ੍ਹਾ ਰੱਖੋ। ਪਾਣੀ ਜੀਰਨ ਤੋਂ ਬਾਅਦ ਅਗਲਾ ਪਾਣੀ ਲਗਾਓ।",
        fertilizer: "ਲੁਆਈ ਵੇਲੇ ਤੀਜਾ ਹਿੱਸਾ ਯੂਰੀਆ ਦਿਓ। ਝੋਨੇ ਨੂੰ ਖ਼ਹਿਰਾ ਰੋਗ ਤੋਂ ਬਚਾਉਣ ਲਈ 10 ਕਿੱਲੋ ਜ਼ਿੰਕ ਸਲਫੇਟ (21%) ਪ੍ਰਤੀ ਏਕੜ ਪਾਓ।"
      }
    },
    rabi: {
      en: {
        title: "Wheat & Mustard Winter Advisory",
        planting: "Optimal wheat sowing is Nov 1 to Nov 25. Treat seeds with Tepuconazole @ 1g/kg to prevent loose smut fungal infection.",
        irrigation: "Crucial first irrigation (Crown Root Initiation) at 21 days after sowing. Do not delay, as it stalls tillering.",
        fertilizer: "Apply full Phosphorus (DAP @ 50kg/acre) during sowing. Broad-spread remaining 2 split doses of Urea before irrigation."
      },
      hi: {
        title: "गेहूं और सरसों शीतकालीन सलाह",
        planting: "गेहूं बुआई का सही समय 1 से 25 नवंबर है। फफूंद से बचाव हेतु बीज को टेबुकोनाज़ोल (1 ग्राम/किग्रा) से उपचारित करें।",
        irrigation: "बुआई के 21 दिन बाद पहली सिंचाई (शिखर जड़ विकास अवस्था - CRI) अत्यंत आवश्यक है। ढिलाई से कल्लों/टहनियों का फुटाव रुकता है।",
        fertilizer: "बुआई पर पूरा डीएपी (DAP @ 50 किलो/एकड़) डालें। आधी यूरिया सिंचाई के तुरंत पहले खेत में बराबर फैलाएं।"
      },
      pa: {
        title: "ਕਣਕ ਅਤੇ ਸਰੋਂ ਹਾੜੀ ਐਡਵਾਈਜ਼ਰੀ",
        planting: "ਕਣਕ ਦੀ ਬਿਜਾਈ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ 1 ਤੋਂ 25 ਨਵੰਬਰ ਹੈ। ਬੀਜ ਨੂੰ ਉੱਲੀਨਾਸ਼ਕ ਦਵਾਈ ਨਾਲ ਸੋਧ ਕੇ ਬੀਜੋ।",
        irrigation: "ਕਣਕ ਬੀਜਣ ਤੋਂ 21 ਦਿਨ ਬਾਅਦ ਪਹਿਲਾ ਪਾਣੀ (ਕੋਰ ਪਾਣੀ - CRI) ਜ਼ਰੂਰੀ ਹੈ, ਇਸ ਨਾਲ ਬੂਟੇ ਦੀਆਂ ਜੜ੍ਹਾਂ ਦਾ ਵਧੀਆ ਵਿਕਾਸ ਹੁੰਦਾ ਹੈ।",
        fertilizer: "ਬਿਜਾਈ ਵੇਲੇ ਪੂਰਾ ਡੀਏਪੀ (DAP @ 50 ਕਿੱਲੋ ਪ੍ਰਤੀ ਏਕੜ) ਪਾਓ। ਬਾਕੀ ਰਹਿੰਦੀ ਯੂਰੀਆ ਪਾਣੀ ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਛਿੜਕੋ।"
      }
    },
    zaid: {
      en: {
        title: "Summer Moong & Vegetables Advisory",
        planting: "Sow summer moong bean (SML 1827) immediately after wheat harvest by early to mid-April across rotation blocks.",
        irrigation: "Irrigate every 8-10 days due to high hot dry winds (Loo). Ensure field is wet during pod development stages.",
        fertilizer: "Apply minimum nitrogen; instead, broad-spread Gypsum @ 80kg/acre to increase seed protein and cluster pods yield."
      },
      hi: {
        title: "ग्रीष्मकालीन मूंग व सब्जी सलाह",
        planting: "गेहूं कटाई के तुरंत बाद अप्रैल के पहले पखवाड़े में ग्रीष्मकालीन मूंग (एसएमएल 1827) की बुआई संपन्न करें।",
        irrigation: "गर्म तेज हवाएं (लू) चलने के कारण हर 8-10 दिन में सिंचाई करें। फलियां बनते समय खेत में नमी होना बहुत आवश्यक है।",
        fertilizer: "यूरिया नाममात्र दें; तेल व दानों की चमक बढ़ाने के लिए खेत तैयार करते समय 80 किलोग्राम जिप्सम प्रति एकड़ बिखेरें।"
      },
      pa: {
        title: "ਗਰਮੀ ਦੀ ਮੂੰਗੀ ਤੇ ਸਬਜ਼ੀਆਂ ਦੀ ਸਲਾਹ",
        planting: "ਕਣਕ ਦੀ ਵਾਢੀ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਅਪ੍ਰੈਲ ਦੇ ਪਹਿਲੇ ਹਫ਼ਤੇ ਗਰਮੀ ਦੀ ਮੂੰਗੀ (SML 1827) ਦੀ ਬਿਜਾਈ ਮੁਕੰਮਲ ਕਰੋ।",
        irrigation: "ਤੇਜ਼ ਗਰਮ ਹਵਾਵਾਂ (ਲੂ) ਚੱਲਣ ਕਾਰਨ ਹਰ 8-10 ਦਿਨਾਂ ਬਾਅਦ ਪਾਣੀ ਦਿਓ। ਫਲੀਆਂ ਬਣਨ ਵੇਲੇ ਖੇਤ ਵਿੱਚ ਸਿੱਲ੍ਹ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
        fertilizer: "ਯੂਰੀਆ ਬਹੁਤ ਘੱਟ ਪਾਓ; ਇਸ ਦੀ ਜਗ੍ਹਾ ਖੇਤ ਤਿਆਰ ਕਰਨ ਵੇਲੇ 80 ਕਿੱਲੋ ਜਿਪਸਮ ਪ੍ਰਤੀ ਏਕੜ ਛਿੜਕੋ।"
      }
    }
  },
  south: {
    kharif: {
      en: {
        title: "South Monsoon Rice & Groundnut Care",
        planting: "Transplant long-duration rice varieties by late July. Keep groundnut planting depth at 5cm in light red soils.",
        irrigation: "Conserve rainwater; ensure raised-bed drainage systems for groundnuts to avoid waterlogging and root death.",
        fertilizer: "Apply Gypsum @ 200kg/acre at flowering stage for groundnut peg development and shell filling strength."
      },
      hi: {
        title: "दक्षिण भारत धान एवं मूंगफली मानसून सलाह",
        planting: "जुलाई के अंत तक धान की रोपाई करें। लाल रेतीली मिट्टी में मूंगफली के बीजों को 5 सेमी की गहराई पर बोएं।",
        irrigation: "वर्षा का पानी संचित करें; मूंगफली के खेतों में जलजमाव और जड़ सड़न से बचने के लिए मेड़ बनाकर जल निकासी सुनिश्चित करें।",
        fertilizer: "मूंगफली में सूइयां (Pegs) बनते समय प्रति एकड़ 200 किलो जिप्सम डालें, इससे दाना मजबूत और भरपूर बनता है।"
      },
      pa: {
        title: "ਦੱਖਣੀ ਝੋਨਾ ਅਤੇ ਮੂੰਗਫਲੀ ਮਾਨਸੂਨ ਐਡਵਾਈਜ਼ਰੀ",
        planting: "ਜੁਲਾਈ ਦੇ ਅਖੀਰ ਤੱਕ ਝੋਨੇ ਦੀ ਲੁਆਈ ਮੁਕੰਮਲ ਕਰੋ। ਰੇਤਲੀਆਂ ਲਾਲ ਮਿੱਟੀਆਂ ਵਿੱਚ ਮੂੰਗਫਲੀ ਦੀ ਬਿਜਾਈ 5 ਸੈਂਟੀਮੀਟਰ ਡੂੰਘੀ ਕਰੋ।",
        irrigation: "ਮੀਂਹ ਦਾ ਪਾਣੀ ਸੰਭਾਲੋ; ਮੂੰਗਫਲੀ ਦੇ ਖੇਤਾਂ ਵਿੱਚ ਪਾਣੀ ਖੜ੍ਹਨ ਤੋਂ ਬਚਾਉਣ ਲਈ ਨਿਕਾਸ ਦਾ ਪ੍ਰਬੰਧ ਰੱਖੋ ਤਾਂ ਜੋ ਜੜ੍ਹਾਂ ਨਾ ਗਲਣ।",
        fertilizer: "ਮੂੰਗਫਲੀ ਦੇ ਫੁੱਲ ਆਉਣ ਵੇਲੇ 200 ਕਿੱਲੋ ਜਿਪਸਮ ਪ੍ਰਤੀ ਏਕੜ ਪਾਓ, ਇਸ ਨਾਲ ਦਾਣੇ ਭਰੇ ਹੋਏ ਅਤੇ ਮੋਟੇ ਬਣਦੇ ਹਨ।"
      }
    },
    rabi: {
      en: {
        title: "Rabi Maize & Sorghum Advisory",
        planting: "Sow Rabi tropical hybrid corn by early October. Treat seeds to secure from stem borer attacks early on.",
        irrigation: "Irrigate corn during tasseling, silking, and grain filling stages. Maize is highly sensitive to dry soil during bloom.",
        fertilizer: "Undergo split urea dosing: 20% at planting, 40% at knee-high stage, and 40% near silk bloom stages."
      },
      hi: {
        title: "रबी मक्का एवं ज्वार शीतकालीन सलाह",
        planting: "अक्टूबर की शुरुआत में रबी हाइब्रिड मक्का बोएं। तना छेदक सुंडी से सुरक्षा के लिए बीजोपचार अवश्य करें।",
        irrigation: "मक्के में भुट्टा बनते समय और दाना भरते समय आवधिक सिंचाई करें। फूल आने पर सूखी मिट्टी से पैदावार घट जाती है।",
        fertilizer: "यूरिया 3 भागों में दें: 20% बुआई पर, 40% घुटने तक ऊंचाई आने पर, और 40% भुट्टा मूंछ निकलने पर दें।"
      },
      pa: {
        title: "ਹਾੜੀ ਮੱਕੀ ਅਤੇ ਚਰੀ ਦੀ ਫ਼ਸਲ ਸੰਭਾਲ",
        planting: "ਅਕਤੂਬਰ ਦੀ ਸ਼ੁਰੂਆਤ ਵਿੱਚ ਹਾਈਬ੍ਰਿਡ ਮੱਕੀ ਬੀਜੋ। ਸੁੰਡੀ ਤੋਂ ਬਚਾਅ ਲਈ ਬੀਜਾਂ ਨੂੰ ਦਵਾਈ ਜ਼ਰੂਰ ਲਗਾਓ।",
        irrigation: "ਮੱਕੀ ਦੇ ਨਿਸਰਨ ਅਤੇ ਦਾਣੇ ਪੈਣ ਵੇਲੇ ਪਾਣੀ ਜ਼ਰੂਰ ਲਗਾਓ। ਇਸ ਸਮੇਂ ਪਾਣੀ ਦੀ ਕਮੀ ਝਾੜ ਘਟਾ ਸਕਦੀ ਹੈ।",
        fertilizer: "ਯੂਰੀਆ 3 ਵਾਰੀ ਦਿਓ: 20% ਬਿਜਾਈ ਵੇਲੇ, 40% ਗੋਡਾ-ਗੋਡਾ ਮੱਕੀ ਹੋਣ 'ਤੇ, ਅਤੇ 40% ਨਿਸਰਨ ਵੇਲੇ।"
      }
    },
    zaid: {
      en: {
        title: "Summer Sesame & Pulses Advisory",
        planting: "Sow heat-tolerant Summer Sesame (Til) seeds in early March. Sow thinly to keep plant density highly balanced.",
        irrigation: "Apply irrigation during micro-flowering and capsule production. Drought at capsule formation cuts harvest size.",
        fertilizer: "Add single super phosphate (SSP) @ 100g per spot area or NPK 15:15:15 formulation at 45kg per acre."
      },
      hi: {
        title: "ग्रीष्मकालीन तिल एवं दलहन सलाह",
        planting: "मार्च के शुरू में गर्मी के तिल (तिल्ली) बोएं। पौधों की सघनता सामान्य रखने के लिए बीजों की हल्की छिटकाव बुआई करें।",
        irrigation: "फूल आने और फलियां (Capsules) बनते समय हल्की सिंचाई अवश्य करें। इस समय सूखा पड़ने से फलियां खाली रह सकती हैं।",
        fertilizer: "सिंगल सुपर फास्फेट (SSP) @ 100 ग्राम प्रति थाला या संपूर्ण एनपीके 15:15:15 @ 45 किलो प्रति एकड़ की दर से प्रयोग करें।"
      },
      pa: {
        title: "ਗਰਮੀ ਦੇ ਤਿਲ ਅਤੇ ਦਾਲਾਂ ਦੀ ਐਡਵਾਈਜ਼ਰੀ",
        planting: "ਮਾਰਚ ਦੀ ਸ਼ੁਰੂਆਤ ਵਿੱਚ ਤੇਜ਼ ਗਰਮੀ ਝੱਲਣ ਵਾਲੇ ਤਿਲਾਂ ਦੀ ਬਿਜਾਈ ਕਰੋ। ਦੂਰੀ ਸਹੀ ਰੱਖੋ ਤਾਂ ਜੋ ਬੂਟੇ ਸੰਘਣੇ ਨਾ ਹੋਣ।",
        irrigation: "ਫੁੱਲ ਪੈਣ ਅਤੇ ਫਲੀਆਂ ਬਣਨ ਵੇਲੇ ਹਲਕਾ ਪਾਣੀ ਲਗਾਓ। ਇਸ ਵੇਲੇ ਸੋਕਾ ਪੈਣ ਨਾਲ ਦਾਣੇ ਖ਼ਰਾਬ ਹੋ ਸਕਦੇ ਹਨ।",
        fertilizer: "ਸਿੰਗਲ ਸੁਪਰ ਫਾਸਫੇਟ (SSP) @ 100 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਥਾਂ ਜਾਂ ਐਨ.ਪੀ.ਕੇ. (NPK 15:15:15) @ 45 ਕਿੱਲੋ ਪ੍ਰਤੀ ਏਕੜ ਪਾਓ।"
      }
    }
  },
  west: {
    kharif: {
      en: {
        title: "Cotton & Soybean Rainfed Ground Care",
        planting: "Sow Soybean (JS 335) immediately with first monsoon showers. Ensure seed depth exceeds 3-4cm for stable roots.",
        irrigation: "Maintain proper drainage channels. Cotton is highly vulnerable to standing flood water causing root suffocation.",
        fertilizer: "Apply Sulfur (Bentonite Sulfur @ 10kg/acre) for oil content boosting in soybean and robust fiber in cotton."
      },
      hi: {
        title: "कपास एवं सोयाबीन वर्षा-आधारित फसल सलाह",
        planting: "पहली मानसूनी बारिश के तुरंत बाद सोयाबीन (JS 335) बोएं। मजबूत जड़ों हेतु बीज गहराई 3-4 सेमी ज़रूर रखें।",
        irrigation: "खेतों से पानी निकालने के लिए नालियां बनाएं। कपास की फसलों में पानी का ठहराव जड़ों को सड़ा देता है (Root Suffocation)।",
        fertilizer: "सोयाबीन में तेल और कपास में चमकीले रेशे बढ़ाने के लिए प्रति एकड़ 10 किलो बेंटोनाइट सल्फर का प्रयोग महत्वपूर्ण है।"
      },
      pa: {
        title: "ਕਪਾਹ ਅਤੇ ਸੋਇਆਬੀਨ ਬਰਸਾਤੀ ਫ਼ਸਲ ਸਲਾਹ",
        planting: "ਮਾਨਸੂਨ ਦੀ ਪਹਿਲੀ ਬਾਰਸ਼ ਪੈਣ 'ਤੇ ਸੋਇਆਬੀਨ (JS 335) ਬੀਜੋ। ਸਹੀ ਉਗਣ ਲਈ ਬੀਜ ਦੀ ਡੂੰਘਾਈ 3-4 ਸੈਂਟੀਮੀਟਰ ਰੱਖੋ।",
        irrigation: "ਖੇਤ ਵਿੱਚੋਂ ਪਾਣੀ ਕੱਢਣ ਲਈ ਨਾਲੀਆਂ ਬਣਾਓ। ਨਰਮਾ/ਕਪਾਹ ਵਿੱਚ ਪਾਣੀ ਖੜ੍ਹਨਾ ਜੜ੍ਹਾਂ ਨੂੰ ਨੁਕਸਾਨ ਪਹੁੰਚਾਉਂਦਾ ਹੈ।",
        fertilizer: "ਸੋਇਆਬੀਨ ਦੇ ਤੇਲ ਅਤੇ ਕਪਾਹ ਦੇ ਰੇਸ਼ੇ ਨੂੰ ਵਧੀਆ ਬਣਾਉਣ ਲਈ 10 ਕਿੱਲੋ ਬੈਂਟੋਨਾਈਟ ਸਲਫਰ ਪ੍ਰਤੀ ਏਕੜ ਵਰਤੋ।"
      }
    },
    rabi: {
      en: {
        title: "Rabi Sorghum & Gram (Chana) Advisory",
        planting: "Sow Chickpeas (Chana) by mid-October on residual loam moisture. High soil moisture triggers wilt pathogen.",
        irrigation: "Gram needs only 1 or 2 minimal water turns. Over-irrigation causes excessive leafy canopy instead of flower pods.",
        fertilizer: "Provide Ammonium Phosphate (DAP) starter boost. Do not add excess Nitrogen, as chickpea makes its own root nodules."
      },
      hi: {
        title: "रबी ज्वार एवं चना (काबूली/देसी) सलाह",
        planting: "अक्टूबर मध्य में चने की बुआई करें जब मिट्टी में हल्की नमी हो। अधिक गीली मिट्टी में जड़ सड़न (Wilt) रोग फैल सकता है।",
        irrigation: "चने में केवल 1 या 2 बार ही हल्की सिंचाई करें। अत्यधिक पानी मिलने से पौधा केवल झाड़ बनाएगा और फूल नहीं खिलेंगे।",
        fertilizer: "शुरुआती बढ़वार के लिए केवल अमोनियम फास्फेट (DAP) दें। यूरिया न दें, चना स्वयं जड़ों में नाइट्रोजन गांठ बनाता है।"
      },
      pa: {
        title: "ਹਾੜੀ ਦੀ ਚਰੀ ਅਤੇ ਚਣਿਆਂ ਦੀ ਕਾਸ਼ਤ ਸੰਭਾਲ",
        planting: "ਅਕਤੂਬਰ ਦੇ ਵਿਚਕਾਰ ਹਲਕੀ ਨਮੀ 'ਤੇ ਚਣੇ ਬੀਜੋ। ਜ਼ਿਆਦਾ ਗਿੱਲੀ ਮਿੱਟੀ ਨਾਲ ਚਣੇ ਉਖੇੜਾ (Wilt) ਰੋਗ ਦਾ ਸ਼ਿਕਾਰ ਹੋ ਸਕਦੇ ਹਨ।",
        irrigation: "ਚਣਿਆਂ ਨੂੰ ਸਿਰਫ਼ 1 ਜਾਂ 2 ਹਲਕੇ ਪਾਣੀ ਹੀ ਲਗਾਓ। ਬਹੁਤਾ ਪਾਣੀ ਦੇਣ ਨਾਲ ਬੂਟਾ ਵਧੇਰੇ ਫੈਲਦਾ ਹੈ ਪਰ ਫਲੀਆਂ ਘੱਟ ਲੱਗਦੀਆਂ ਹਨ।",
        fertilizer: "ਸ਼ੁਰੂਆਤੀ ਤਾਕਤ ਲਈ ਡੀਏਪੀ (DAP) ਪਾਓ। ਚਣੇ ਦੀ ਫ਼ਸਲ ਨੂੰ ਯੂਰੀਆ ਦੀ ਬਹੁਤੀ ਲੋੜ ਨਹੀਂ ਹੁੰਦੀ ਕਿਉਂਕਿ ਇਹ ਹਵਾ ਤੋਂ ਨਾਈਟ੍ਰੋਜਨ ਲੈਂਦੀ ਹੈ।"
      }
    },
    zaid: {
      en: {
        title: "West Summer Groundnut & Pearl Millet",
        planting: "Plant summer groundnut varieties by early February. Plant Bajra (pearl millet) spacing at 45cm rows.",
        irrigation: "Irrigate groundnut every 10 days during peg lodging in dry hot clay soil blocks. Keep gypsum dry before bed layout.",
        fertilizer: "Apply Borax @ 4kg/acre to prevent hollow heart seed defects in sandy groundnut soils."
      },
      hi: {
        title: "पश्चिमी ग्रीष्मकालीन मूंगफली व बाजरा सलाह",
        planting: "फरवरी की शुरुआत में ग्रीष्मकालीन मूंगफली बोएं। बाजरे की बुआई कतारों में 45 सेमी की दूरी पर करें।",
        irrigation: "कठोर सूखी मिट्टी में मूंगफली की सूइयां घुसते समय हर 10 दिन में सिंचाई करें। क्यारी बनाने से पहले जिप्सम सूखी मिट्टी में मिलाएं।",
        fertilizer: "मूंगफली के खाली दाने (Hollow Heart) की समस्या से बचने के लिए बुआई के समय प्रति एकड़ 4 किलो बोरेक्स पाउडर डालें।"
      },
      pa: {
        title: "ਗਰਮ ਰੁੱਤ ਦੀ ਮੂੰਗਫਲੀ ਅਤੇ ਬਾਜਰੇ ਦੀ ਐਡਵਾਈਜ਼ਰੀ",
        planting: "ਫ਼ਰਵਰੀ ਦੀ ਸ਼ੁਰੂਆਤ ਵਿੱਚ ਗਰਮ ਰੁੱਤ ਦੀ ਮੂੰਗਫਲੀ ਲਗਾਓ। ਬਾਜਰੇ ਦੀ ਬਿਜਾਈ ਲਾਈਨਾਂ ਵਿੱਚ 45 ਸੈਂਟੀਮੀਟਰ ਦੀ ਦੂਰੀ 'ਤੇ ਕਰੋ।",
        irrigation: "ਮੂੰਗਫਲੀ ਦੀਆਂ ਸੂਈਆਂ ਜ਼ਮੀਨ ਵਿੱਚ ਵੜਨ ਵੇਲੇ ਹਰ 10 ਦਿਨਾਂ ਬਾਅਦ ਪਾਣੀ ਲਗਾਓ। ਖੇਤ ਵਿੱਚ ਸਿੱਲ੍ਹ ਸਹੀ ਰੱਖੋ।",
        fertilizer: "ਮੂੰਗਫਲੀ ਦੇ ਦਾਣੇ ਖਾਲੀ ਰਹਿਣ ਤੋਂ ਬਚਾਉਣ ਲਈ ਬਿਜਾਈ ਵੇਲੇ 4 ਕਿੱਲੋ ਬੋਰੈਕਸ ਪਾਊਡਰ ਪ੍ਰਤੀ ਏਕੜ ਪਾਓ।"
      }
    }
  },
  east: {
    kharif: {
      en: {
        title: "East Paddy Sowing & Jute Advisory",
        planting: "Sow long-duration Swarna Paddy varieties by June 15. Clean Jute fibers in clear slow-moving pool water.",
        irrigation: "High heavy rainfall region; ensure clear drainage slopes to protect vegetable nursery nurseries from washouts.",
        fertilizer: "Apply Single Super Phosphate (SSP) @ 120kg/acre; top-dress Zinc Sulphate to recover leaves from yellow chlorosis."
      },
      hi: {
        title: "पूर्वी धान बुआई एवं पटसन (Jute) सलाह",
        planting: "15 जून तक स्वर्ण धान जैसी लंबी अवधि की किस्में बोएं। पटसन (जूट) के रेशों को साफ पानी के कुंड में सड़न प्रक्रिया दें।",
        irrigation: "भारी बारिश का क्षेत्र होने के कारण, सब्जी पौध को बहने से बचाने के लिए ढलान वाले निकास मार्ग साफ़ रखें।",
        fertilizer: "सिंगल सुपर फास्फेट @ 120 किलो/एकड़ डालें; पत्तियों का पीलापन दूर करने हेतु खड़ी फसल में जिंक सल्फेट छिड़कें।"
      },
      pa: {
        title: "ਪੂਰਬੀ ਝੋਨਾ ਅਤੇ ਜੂਟ ਦੀ ਖ਼ੇਤੀ ਦੀ ਸਲਾਹ",
        planting: "15 ਜੂਨ ਤੱਕ ਲੰਮੇ ਸਮੇਂ ਦੀਆਂ ਝੋਨੇ ਦੀਆਂ ਕਿਸਮਾਂ (ਸਵਰਨਾ) ਬੀਜੋ। ਜੂਟ ਦੇ ਰੇਸ਼ਿਆਂ ਦੀ ਸਫ਼ਾਈ ਲਈ ਸਾਫ਼ ਪਾਣੀ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
        irrigation: "ਵੱਧ ਬਾਰਸ਼ ਵਾਲਾ ਇਲਾਕਾ ਹੋਣ ਕਰਕੇ ਸਬਜ਼ੀਆਂ ਦੀ ਪਨੀਰੀ ਨੂੰ ਵਹਿਣ ਤੋਂ ਬਚਾਉਣ ਲਈ ਪਾਣੀ ਦੀ ਨਿਕਾਸੀ ਸਹੀ ਰੱਖੋ।",
        fertilizer: "ਸਿੰਗਲ ਸੁਪਰ ਫਾਸਫੇਟ @ 120 ਕਿੱਲੋ ਪ੍ਰਤੀ ਏਕੜ ਪਾਓ; ਪੱਤਿਆਂ ਦਾ ਪੀਲਾਪਣ ਹਟਾਉਣ ਲਈ ਖੜ੍ਹੀ ਫ਼ਸਲ 'ਤੇ ਜ਼ਿੰਕ ਦਾ ਸਪਰੇਅ ਕਰੋ।"
      }
    },
    rabi: {
      en: {
        title: "East Rabi Maize & Yellow Mustard Care",
        planting: "Incorporate Boro paddy nurseries or sow rabi maize by mid-November into damp alluvial clay riverbed blocks.",
        irrigation: "Irrigate Boro paddy continuously with 2-3cm standing water to fend off frosty mid-winter night snaps.",
        fertilizer: "Spray foliar Boron 20% @ 1.5g per Liter on mustard during early flower stages to multiply heavy oily pods yield."
      },
      hi: {
        title: "पूर्वी रबी मक्का एवं पीली सरसों सलाह",
        planting: "नवंबर मध्य तक बोरो धान की नर्सरी लगाएं या नदी किनारे दोमट जलोढ़ मिट्टी में रबी मक्का बुआई आरंभ करें।",
        irrigation: "बोरो धान के खेतों में पाले व ठंड से बचाव के लिए रात में 2-3 सेमी लगातार पानी भरकर रखें।",
        fertilizer: "पीली सरसों में फलियां अधिक बनने के लिए फूल आने की अवस्था में 1.5 ग्राम प्रति लीटर बोरॉन (20%) का छिड़काव पत्तियों पर करें।"
      },
      pa: {
        title: "ਪੂਰਬੀ ਹਾੜੀ ਮੱਕੀ ਅਤੇ ਪੀਲੀ ਸਰੋਂ ਦੀ ਸਲਾਹ",
        planting: "ਨਵੰਬਰ ਦੇ ਅੱਧ ਤੱਕ ਬੋਰੋ ਝੋਨੇ ਦੀ ਪਨੀਰੀ ਲਗਾਓ ਜਾਂ ਦਰਿਆਈ ਇਲਾਕਿਆਂ ਵਿੱਚ ਹਾੜੀ ਦੀ ਮੱਕੀ ਦੀ ਬਿਜਾਈ ਕਰੋ।",
        irrigation: "ਬੋਰੋ ਝੋਨੇ ਨੂੰ ਕੋਰੇ (ਠੰਢ) ਤੋਂ ਬਚਾਉਣ ਲਈ ਰਾਤ ਦੇ ਵੇਲੇ ਖੇਤ ਵਿੱਚ 2-3 ਸੈਂਟੀਮੀਟਰ ਪਾਣੀ ਖੜ੍ਹਾ ਰੱਖੋ।",
        fertilizer: "ਪੀਲੀ ਸਰੋਂ ਵਿੱਚ ਤੇਲ ਵਾਲੀਆਂ ਫਲੀਆਂ ਵਧਾਉਣ ਲਈ ਫੁੱਲ ਆਉਣ ਵੇਲੇ 1.5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਬੋਰੋਨ (20%) ਦਾ ਛਿੜਕਾਅ ਕਰੋ।"
      }
    },
    zaid: {
      en: {
        title: "East Sunhemp & Moong Extension",
        planting: "Seed summer vegetables (gourd, okra) by early March. Inter-crop with green sunhemp to plow back as green manure.",
        irrigation: "Water daily in seedbeds. Use mulching (dry leaves/paddy straw) to conserve moisture in high clay blocks.",
        fertilizer: "Apply dynamic bio-fertilizers like Azotobacter + Trichoderma to soil root zones to minimize chemical dependency."
      },
      hi: {
        title: "पूर्वी हरी खाद पटसन व मूंग सलाह",
        planting: "मार्च की शुरुआत में बेलदार सब्जियां (लौकी, भिंडी) बोएं। खेत उपजाऊ बनाने के लिए हरी खाद सनई/मूंग बीच-बीच में बोएं।",
        irrigation: "नर्सरी क्यारियों में रोजाना हल्का पानी दें। मिट्टी की नमी बनाए रखने के लिए सूखी पत्तियां या धान के पुआल से मलचिंग करें।",
        fertilizer: "रसायन निर्भरता कम करने के लिए जड़ों के पास एज़ोटोबैक्टर + ट्राइकोडर्मा जैसी जैविक खाद का सघन छिड़काव करें।"
      },
      pa: {
        title: "ਪੂਰਬੀ ਹਰੀ ਖਾਦ ਅਤੇ ਮੂੰਗੀ ਦੀ ਸਲਾਹ",
        planting: "ਮਾਰਚ ਦੀ ਸ਼ੁਰੂਆਤ ਵਿੱਚ ਵੇਲਦਾਰ ਸਬਜ਼ੀਆਂ (ਕੱਦੂ, ਭਿੰਡੀ) ਬੀਜੋ। ਜ਼ਮੀਨ ਦੀ ਤਾਕਤ ਵਧਾਉਣ ਲਈ ਹਰੀ ਖਾਦ ਸਣ ਦੀ ਬਿਜਾਈ ਕਰੋ।",
        irrigation: "ਕਿਆਰੀਆਂ ਵਿੱਚ ਰੋਜ਼ਾਨਾ ਹਲਕਾ ਪਾਣੀ ਲਗਾਓ। ਖੇਤ ਦੀ ਨਮੀ ਬਚਾਉਣ ਲਈ ਪਰਾਲੀ (ਮਲਚਿੰਗ) ਨਾਲ ਢੱਕ ਕੇ ਰੱਖੋ।",
        fertilizer: "ਰਸਾਇਣਾਂ ਤੋਂ ਬਚਣ ਲਈ ਬਾਇਓ-ਖਾਦਾਂ ਜਿਵੇਂ ਕਿ ਐਜ਼ੋਟੋਬੈਕਟਰ ਅਤੇ ਟ੍ਰਾਈਕੋਡਰਮਾ ਦਾ ਇਸਤੇਮਾਲ ਜੜ੍ਹਾਂ ਵਿੱਚ ਕਰੋ।"
      }
    }
  }
};

// Simulated Notification sounds using browser HTML5 Web Audio API synth
function playChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    // Friendly, reassuring dual-frequency agriculture alert sound
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.12); // A5
    
    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // Suppress Web Audio autoplay blocks or failures gracefully
  }
}

export default function SeasonalAlerts({ language }: SeasonalAlertsProps) {
  // Load initial options from LocalStorage or fall back to defaults
  const [region, setRegion] = useState<RegionKey>(() => {
    return (localStorage.getItem('farmer_region') as RegionKey) || 'north';
  });
  const [season, setSeason] = useState<SeasonKey>(() => {
    return (localStorage.getItem('farmer_season') as SeasonKey) || 'kharif';
  });
  
  // Custom states for the interactive timer-based reminders
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(() => {
    return localStorage.getItem('farmer_alerts_enabled') === 'true';
  });
  const [reminderInterval, setReminderInterval] = useState<number>(() => {
    const val = localStorage.getItem('farmer_alerts_interval');
    return val ? parseInt(val, 10) : 5; // Default: 5 seconds/hours simulation
  });

  // UI Notification feed list state
  const [alertsFeed, setAlertsFeed] = useState<{ id: string; msg: string; time: string; type: 'water' | 'fert' | 'plant' }[]>([]);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [simulatedCounter, setSimulatedCounter] = useState<number>(0);

  // Sync preferences to LocalStorage
  useEffect(() => {
    localStorage.setItem('farmer_region', region);
  }, [region]);

  useEffect(() => {
    localStorage.setItem('farmer_season', season);
  }, [season]);

  useEffect(() => {
    localStorage.setItem('farmer_alerts_enabled', notificationEnabled.toString());
  }, [notificationEnabled]);

  useEffect(() => {
    localStorage.setItem('farmer_alerts_interval', reminderInterval.toString());
  }, [reminderInterval]);

  // Generate a random localized advice notification item based on current active configs
  const triggerSimulatedAlert = (isManual = false) => {
    const details = ADVISORY_DATA[region][season][language];
    const pool = [
      { msg: `🚨 [${details.title}] Sowing Alert: ${details.planting}`, type: 'plant' as const },
      { msg: `💧 Irrigation Alert: ${details.irrigation}`, type: 'water' as const },
      { msg: `🌱 Fertilizer App Alert: ${details.fertilizer}`, type: 'fert' as const }
    ];
    
    // Choose one item randomly or cyclic
    const index = isManual ? Math.floor(Math.random() * pool.length) : (simulatedCounter % pool.length);
    const chosen = pool[index];

    // Play pleasant audio chime
    playChime();

    // Create a toast notification in the feed
    const now = new Date();
    const timeStr = now.toLocaleTimeString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'pa-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const newNotifyItem = {
      id: Math.random().toString(),
      msg: chosen.msg,
      time: timeStr,
      type: chosen.type
    };

    setAlertsFeed(prev => [newNotifyItem, ...prev.slice(0, 4)]);
    setSimulatedCounter(c => c + 1);

    // Also trigger standard in-app custom window notice dispatching for feedback
    const toastElem = document.createElement('div');
    toastElem.className = "fixed bottom-5 right-5 z-50 animate-bounce bg-emerald-900 border-2 border-amber-400 text-slate-100 p-4 rounded-2xl shadow-2xl max-w-sm border-l-8 border-l-amber-500 font-sans text-xs flex flex-col gap-1.5 transition-all duration-500 transform translate-y-0 opacity-100";
    toastElem.innerHTML = `
      <div class="flex items-center justify-between font-bold text-amber-400 text-[10px] tracking-wide uppercase font-mono">
        <span class="flex items-center gap-1">🔔 MITRA SYSTEM ALERT</span>
        <span class="text-[9px] text-emerald-400 font-mono">${timeStr}</span>
      </div>
      <p class="font-medium text-slate-100 leading-normal text-[11px]">${chosen.msg}</p>
    `;
    document.body.appendChild(toastElem);
    
    // Auto-remove standard screen notice after 6 seconds
    setTimeout(() => {
      toastElem.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => toastElem.remove(), 600);
    }, 6000);
  };

  // Simulated background check interval (runs when notificationEnabled is ON)
  useEffect(() => {
    if (!notificationEnabled) return;

    // We scale down simulated hours/days tracker into actual runtime intervals for the web experience
    // Interval units represent seconds to visualize "recurring notifications" cleanly in AI Studio
    const intervalMs = reminderInterval * 1000;
    
    const handler = setInterval(() => {
      triggerSimulatedAlert(false);
    }, intervalMs);

    return () => clearInterval(handler);
  }, [notificationEnabled, reminderInterval, region, season, language, simulatedCounter]);

  // Read current translated labels
  const details = ADVISORY_DATA[region][season][language];

  // Helper title strings
  const titleText = {
    en: "Seasonal Reminders",
    hi: "क्षेत्रीय कृषि अलार्म",
    pa: "ਖੇਤਰੀ ਫ਼ਸਲ ਅਲਾਰਮ"
  }[language];

  const subtext = {
    en: "Select region & season. Configure custom alerts routine.",
    hi: "अपना क्षेत्र व मौसम चुनें। मोबाइल जैसी आवर्तक सूचनाएं चालू करें।",
    pa: "ਆਪਣਾ ਇਲਾਕਾ ਤੇ ਮੌਸਮ ਚੁਣੋ। ਮੋਬਾਈਲ ਵਾਂਗ ਰੀਮਾਈਂਡਰ ਚਾਲੂ ਕਰੋ।"
  }[language];

  const regionLabel = {
    en: "Agricultural Territory",
    hi: "कृषि क्षेत्र / राज्य",
    pa: "ਖੇਤੀਬਾੜੀ ਇਲਾਕਾ"
  }[language];

  const seasonLabel = {
    en: "Cycle Season",
    hi: "फसल ऋतु (Season)",
    pa: "ਫ਼ਸਲ ਰੁੱਤ"
  }[language];

  const alertRoutineLabel = {
    en: "Alert Routine Settings",
    hi: "अलार्म पुनरावृत्ति सैटिंग्स",
    pa: "ਅਲਾਰਮ ਰੁਟੀਨ ਸੈਟਿੰਗਾਂ"
  }[language];

  const intervalLabel = {
    en: "Scan Interval (Simulation)",
    hi: "जांच समयांतराल (सिम्युलेशन)",
    pa: "ਜਾਂਚ ਅੰਤਰਾਲ (ਸਿਮੂਲੇਸ਼ਨ)"
  }[language];

  const statusLabel = {
    en: "Routine Status:",
    hi: "अलार्म स्थिति:",
    pa: "ਅਲਾਰਮ ਸਥਿਤੀ:"
  }[language];

  const enabledStr = {
    en: "ACTIVE DISPATCHING",
    hi: "सक्रिय (घंटी चालू)",
    pa: "ਚਾਲੂ (ਘੰਟੀ ਚਾਲੂ)"
  }[language];

  const disabledStr = {
    en: "DISPATCH OFF",
    hi: "बंद (अलार्म निष्क्रिय)",
    pa: "ਬੰਦ (ਨਿਰ੍ਕ੍ਰਿਯ)"
  }[language];

  const testBtnLabel = {
    en: "Simulate Urgent Push Alert",
    hi: "तत्काल अलार्म का परीक्षण करें",
    pa: "ਤੁਰੰਤ ਅਲਾਰਮ ਟੈਸਟ ਕਰੋ"
  }[language];

  const alertsLogLabel = {
    en: "Delivered Alerts Log",
    hi: "भेजे गए अलार्म संदेश",
    pa: "ਭੇਜੇ ਗਏ ਅਲਾਰਮ ਸੁਨੇਹੇ"
  }[language];

  const emptyLogStr = {
    en: "No simulation runs. Toggle alerts on or click Test above.",
    hi: "कोई अलार्म इतिहास नहीं। परीक्षण बटन दबाएं या पुनरावृत्ति चालू करें।",
    pa: "ਕੋਈ ਅਲਾਰਮ ਇਤਿਹਾਸ ਨਹੀਂ। ਉੱਪਰ ਦਿੱਤਾ ਟੈਸਟ ਬਟਨ ਦਬਾਓ।"
  }[language];

  return (
    <div className="bg-emerald-950/45 border border-emerald-900/25 rounded-xl p-3.5 space-y-3 font-sans transition-all">
      {/* Header and Control Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {notificationEnabled ? (
            <div className="relative">
              <BellRing className="w-4.5 h-4.5 text-amber-400 stroke-[2.5] animate-swing" />
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
            </div>
          ) : (
            <Bell className="w-4.5 h-4.5 text-emerald-400 stroke-[2]" />
          )}
          <div>
            <h3 className="text-xs font-black text-amber-300 font-sans tracking-tight uppercase flex items-center gap-1.5">
              {titleText}
              <span className="text-[8px] bg-red-600/95 text-white font-mono font-bold px-1 py-0.25 rounded animate-pulse">LIVE</span>
            </h3>
            <p className="text-[9px] text-emerald-300/80 leading-snug mt-0.5">
              {subtext}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          className="p-1 px-1.5 hover:bg-emerald-900/40 rounded border border-emerald-800/35 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
          title="Configure alert timing & regions"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="text-[9px] font-bold font-mono">ADJ</span>
        </button>
      </div>

      {/* Configuration Box (collapsible) */}
      {(showConfig || alertsFeed.length === 0) && (
        <div className="p-3 bg-black/45 rounded-lg border border-emerald-950/40 space-y-3.5 animate-fadeIn">
          {/* Territory selecting */}
          <div className="space-y-1">
            <label className="text-[9px] text-amber-400/80 font-bold uppercase tracking-wider font-mono">
              📍 {regionLabel}
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as RegionKey)}
              className="w-full bg-emerald-950/90 text-slate-100 border border-emerald-850 py-1.5 px-2 rounded-md text-xs focus:ring-1 focus:ring-amber-500 outline-none font-sans"
            >
              <option value="north">{REGIONS[language].north}</option>
              <option value="south">{REGIONS[language].south}</option>
              <option value="west">{REGIONS[language].west}</option>
              <option value="east">{REGIONS[language].east}</option>
            </select>
          </div>

          {/* Season selecting */}
          <div className="space-y-1">
            <label className="text-[9px] text-amber-400/80 font-bold uppercase tracking-wider font-mono">
              🌾 {seasonLabel}
            </label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value as SeasonKey)}
              className="w-full bg-emerald-950/90 text-slate-100 border border-emerald-850 py-1.5 px-2 rounded-md text-xs focus:ring-1 focus:ring-amber-500 outline-none font-sans"
            >
              <option value="kharif">{SEASONS[language].kharif}</option>
              <option value="rabi">{SEASONS[language].rabi}</option>
              <option value="zaid">{SEASONS[language].zaid}</option>
            </select>
          </div>

          {/* Alarm recurrence interval control */}
          <div className="p-2 border border-emerald-900/30 rounded-md bg-emerald-950/20 space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-300 font-medium flex items-center gap-1 font-mono uppercase tracking-tight">
                🎚️ {alertRoutineLabel}
              </span>
              <button
                onClick={() => setNotificationEnabled(!notificationEnabled)}
                className={`p-0.5 px-2 rounded font-black text-[8px] tracking-wide cursor-pointer uppercase transition-colors ${
                  notificationEnabled 
                    ? 'bg-amber-500 text-emerald-950 border border-amber-300' 
                    : 'bg-emerald-900/40 text-slate-400 border border-emerald-800/30'
                }`}
              >
                {notificationEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400 font-medium font-mono text-[9px]">
                {intervalLabel}
              </span>
              <select
                disabled={!notificationEnabled}
                value={reminderInterval}
                onChange={(e) => setReminderInterval(parseInt(e.target.value, 10))}
                className="bg-black/40 text-amber-400 border border-emerald-900 rounded px-1.5 py-0.5 text-[9px] font-mono outline-none disabled:opacity-40"
              >
                <option value="5">5s (Simulate)</option>
                <option value="15">15s (Simulate)</option>
                <option value="30">30s (Simulate)</option>
                <option value="60">1 Min (Simulate)</option>
                <option value="300">5 Mins (Simulate)</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-[8px] font-mono font-bold">
              <span className="text-slate-500 uppercase">{statusLabel}</span>
              <span className={`px-1.5 py-0.25 rounded ${notificationEnabled ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`}>
                ● {notificationEnabled ? enabledStr : disabledStr}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Active Local Season Advisory Leaflet Display */}
      <div className="space-y-2">
        <div className="p-2.5 bg-[#041c13] rounded-lg border border-emerald-800/20 space-y-2.5 backdrop-blur-sm shadow-inner">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-900/30 pb-1.5">
            <span className="text-[10px] text-amber-400 font-extrabold font-sans flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400/25 shrink-0" />
              {details.title}
            </span>
            <span className="text-[8px] font-black text-slate-400 bg-emerald-900/40 border border-emerald-800/30 px-1.5 py-0.5 rounded uppercase font-mono">
              {season}
            </span>
          </div>

          {/* Sowing / Sowing-Cycle Segment */}
          <div className="flex gap-2 text-[10.5px]">
            <div className="mt-0.5 h-5 w-5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded flex items-center justify-center shrink-0">
              <CalendarRange className="w-3 h-3" />
            </div>
            <div>
              <p className="text-[9px] font-extrabold text-amber-400/90 font-mono uppercase tracking-wider leading-none">
                Sowing & Planting Cycles
              </p>
              <p className="text-emerald-100 font-sans leading-normal mt-0.5 text-[11px]">
                {details.planting}
              </p>
            </div>
          </div>

          {/* Watering / Irrigation Segment */}
          <div className="flex gap-2 text-[10.5px]">
            <div className="mt-0.5 h-5 w-5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded flex items-center justify-center shrink-0">
              <Droplets className="w-3 h-3" />
            </div>
            <div>
              <p className="text-[9px] font-extrabold text-sky-400/90 font-mono uppercase tracking-wider leading-none">
                Irrigation Schedule Routine
              </p>
              <p className="text-emerald-100 font-sans leading-normal mt-0.5 text-[11px]">
                {details.irrigation}
              </p>
            </div>
          </div>

          {/* Fertilizer Dose Segment */}
          <div className="flex gap-2 text-[10.5px]">
            <div className="mt-0.5 h-5 w-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded flex items-center justify-center shrink-0">
              <FlaskConical className="w-3 h-3" />
            </div>
            <div>
              <p className="text-[9px] font-extrabold text-emerald-400/90 font-mono uppercase tracking-wider leading-none">
                Fertilizer Dosing Split
              </p>
              <p className="text-emerald-100 font-sans leading-normal mt-0.5 text-[11px]">
                {details.fertilizer}
              </p>
            </div>
          </div>
        </div>

        {/* Manual Test Action */}
        <button
          onClick={() => triggerSimulatedAlert(true)}
          className="w-full bg-[#053221] hover:bg-[#09472f] border border-emerald-700/35 hover:border-emerald-500 text-[10.5px] text-amber-300 font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Play className="w-3 h-3 text-amber-400 fill-amber-400/20" />
          {testBtnLabel}
        </button>
      </div>

      {/* Dispatched Alerts Flow Log list */}
      {alertsFeed.length > 0 ? (
        <div className="space-y-1.5 border-t border-emerald-900/20 pt-2 bg-black/10 p-2 rounded-lg">
          <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono uppercase font-bold">
            <span className="flex items-center gap-1">📊 {alertsLogLabel}</span>
            <span className="text-[8px] bg-emerald-900/60 px-1 py-0.25 rounded text-amber-400 leading-none">
              {alertsFeed.length}
            </span>
          </div>

          <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-950 pr-0.5">
            {alertsFeed.map((item) => (
              <div 
                key={item.id} 
                className="p-1 px-1.5 rounded bg-emerald-950/70 border border-emerald-900/20 text-[9px] text-[#b3ffd9] font-sans flex flex-col gap-0.5 animate-fadeIn"
              >
                <div className="flex items-center justify-between text-[8px] font-mono text-amber-400/80">
                  <span className="uppercase flex items-center gap-0.5">
                    {item.type === 'water' ? '💧 WATER' : item.type === 'fert' ? '🌱 FERT' : '📅 CROP'}
                  </span>
                  <span>{item.time}</span>
                </div>
                <p className="leading-snug text-slate-200">
                  {item.msg}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-2 rounded bg-black/15 text-center border border-dashed border-emerald-900/20">
          <p className="text-[8.5px] text-slate-500 font-mono italic leading-normal">
            ℹ️ {emptyLogStr}
          </p>
        </div>
      )}
    </div>
  );
}
