/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'hi' | 'pa';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  image?: string; // base64 representation of crop photo/video
  imageType?: 'image' | 'video'; // matches if media is image or video
  groundingSources?: { uri: string; title: string }[]; // dynamic web references
  timestamp: string;
  isDiagnostic?: boolean; // If this message triggered a diagnostic summary
  engine?: string; // AI model or database engine used for analysis
}

export interface ChatSession {
  id: string;
  title: string;
  crop?: string;
  language: Language;
  createdAt: string;
  messages: ChatMessage[];
}

export interface MandiPrice {
  id: string;
  crop: {
    en: string;
    hi: string;
    pa: string;
  };
  market: {
    en: string;
    hi: string;
    pa: string;
  };
  price: number; // in INR per Quintal
  change: 'up' | 'down' | 'stable';
  changeAmount: number;
}

export interface FertilizerRecommendation {
  crop: string;
  source: string;
  nitrogen: number; // kg per acre
  phosphorus: number; // kg per acre
  potassium: number; // kg per acre
}

// Full Localized Dictionaries for English, Hindi, and Punjabi
export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appName: "Kisan Mitra AI",
    appSubtitle: "Your Expert Farming Friend",
    newChat: "New Chat",
    clearHistory: "Clear All Chats",
    mandiPrices: "Mandi Market Rates",
    fertilizerCalc: "Fertilizer Calculator",
    weatherAlerts: "Weather & Advisory",
    language: "Language",
    inputPlaceholder: "Ask Kisan Mitra any farming question...",
    voiceReading: "Voice Assistant (TTS)",
    voiceReadingActive: "Reading aloud activated",
    voiceReadingInactive: "Voice reading deactivated",
    stopReading: "Stop Reading",
    diagnosticReport: "Kisan Mitra Diagnostic Summary",
    cropName: "Crop Name",
    problemDetected: "Issue Found",
    severity: "Severity Level",
    treatment: "Urgent Treatment",
    bestFertilizerPesticide: "Best Fertilizer/Pesticide",
    prevention: "Prevention Tip",
    printReport: "Download / Print Report",
    naturalRemedy: "Organic Alternative (देशी उपाय)",
    high: "High 🔴",
    medium: "Medium 🟡",
    low: "Low 🟢",
    welcomeTitle: "Bhai, kya masla hai aaj? 🌾",
    welcomeSubtitle: "Fasal, keeda, khaad, mandi — kuch bhi poochho! Main hoon aapka Kisan Mitra.",
    cardDiseaseTitle: "Crop Leaf Diagnosis",
    cardDiseaseDesc: "Upload or capture a leaf photo. AI detects fungal leaf blight, mildew, nutrition deficiency, or pests.",
    cardFertTab: "Fertilizer suggestion",
    cardFertDesc: "Ask how much granular fertilizer (Urea, DAP, Zinc) to apply per acre based on soil type.",
    cardMandiTab: "Mandi Rates Finder",
    cardMandiDesc: "Track real-time grain market prices in Khanna, Karnal, Bhatinda, and Amritsar markets.",
    voiceActive: "Kisan bhai boliye, hum sun rahe hain...",
    notFarmingRefusal: "Bhai, main kisaan ka beta hoon aur sirf kheti-baadi ke sawaal ka jawaab de sakta hoon! Kheti ka kuch bhi poochho.",
    history: "Inspections Chat History",
    noHistory: "No chat history. Start your agricultural inspection!",
    speakText: "Speak Out Loud",
    calculating: "Calculating...",
    acreageInput: "Enter Farm Area (Acre)",
    selectCrop: "Select Crop",
    calcUrea: "Urea (N)",
    calcDap: "DAP (P)",
    calcMop: "MOP/Potash (K)",
    calcBags: "Required quantities (in 50kg bags)",
    weatherHot: "Warm & Dry. Keep moisture high for crops.",
    weatherRain: "Light Rain Expected. Hold off pesticide sprays.",
    weatherMild: "Ideal temperate weather. Good for urea broadcasting.",
    searchMarket: "Search crops or market..."
  },
  hi: {
    appName: "किसान मित्र (Kisan Mitra)",
    appSubtitle: "आपका अपना देसी खेती एक्सपर्ट",
    newChat: "नया संवाद (New Chat)",
    clearHistory: "सभी चैट मिटाएं",
    mandiPrices: "मंडी बाजार भाव",
    fertilizerCalc: "खाद मात्रा कैलकुलेटर",
    weatherAlerts: "मौसम और कृषि सलाह",
    language: "भाषा",
    inputPlaceholder: "अपने किसान मित्र से खेती का सवाल पूछें...",
    voiceReading: "आवाज सहायक (बोलकर बताएं)",
    voiceReadingActive: "बोलकर सुनाने की सेवा चालू है",
    voiceReadingInactive: "बोलकर सुनाने की सेवा बंद है",
    stopReading: "आवाज बंद करें",
    diagnosticReport: "किसान मित्र रोग निदान रिपोर्ट",
    cropName: "फसल का नाम",
    problemDetected: "देखी गई समस्या",
    severity: "गंभीरता का स्तर",
    treatment: "त्वरित उपचार विधि",
    bestFertilizerPesticide: "उत्तम खाद/कीटनाशक",
    prevention: "बचाव के मुख्य तरीके",
    printReport: "रिपोर्ट डाउनलोड / प्रिंट करें",
    naturalRemedy: "जैविक/देशी इलाज उपाय",
    high: "अत्यधिक गंभीर 🔴",
    medium: "मध्यम गंभीर 🟡",
    low: "सामान्य स्थिति 🟢",
    welcomeTitle: "भाई, क्या मसला है आज? 🌾",
    welcomeSubtitle: "फसल, कीड़ा, खाद, मंडी — कुछ भी पूछो! मैं हूँ आपका किसान मित्र।",
    cardDiseaseTitle: "पत्तियों का रोग निदान",
    cardDiseaseDesc: "पत्ते की फोटो खींचे या लगाएं। किसान मित्र फफूंदी, पीलापन, सुंडी कीट हमला या पोषक तत्वों की कमी बताएगा।",
    cardFertTab: "खाद की खुराक जानकारी",
    cardFertDesc: "मिट्टी के प्रकार के आधार पर जानें कि प्रति एकड़ कितनी यूरिया, डीएपी (DAP), जिंक या सुपर खाद डालनी है।",
    cardMandiTab: "ताज़ा मंडी भाव खोज",
    cardMandiDesc: "खन्ना, करनाल, अमृतसर, और बठिंडा मंडियों में अपनी फसल के उचित भाव को आसानी से ट्रैक करें।",
    voiceActive: "किसान भाई बोलिए, हम सुन रहे हैं...",
    notFarmingRefusal: "भाई, मैं किसान का बेटा हूँ और सिर्फ खेती-बाड़ी या पशुपालन से जुड़े सवालों के जवाब दे सकता हूँ। कृपया खेती का सवाल पूछें!",
    history: "पिछली जांचों का इतिहास",
    noHistory: "कोई इतिहास नहीं है। एक नई फसल रोग जांच शुरू करें!",
    speakText: "बोलकर सुनाएं",
    calculating: "गणना हो रही है...",
    acreageInput: "खेत का क्षेत्रफल दर्ज करें (एकड़)",
    selectCrop: "फसल चुनें",
    calcUrea: "यूरिया (यूरिया खाद)",
    calcDap: "डीएपी (DAP)",
    calcMop: "पोटाश (एमओपी)",
    calcBags: "आवश्यक मात्रा (50 किलो वाली बोरियों में)",
    weatherHot: "मौसम शुष्क व गर्म है। नमी बनाए रखने के लिए उपयुक्त सिंचाई करें।",
    weatherRain: "हल्की बारिश की संभावना है। दबाव दवाओं या कीटनाशक छिड़काव अभी रोकें।",
    weatherMild: "शुद्ध अनुकूल मौसम। यूरिया छिड़काव के लिए बहुत उत्तम समय है।",
    searchMarket: "फसल या मंडी का नाम खोजें..."
  },
  pa: {
    appName: "ਕਿਸਾਨ ਮਿੱਤਰ (Kisan Mitra)",
    appSubtitle: "ਤੁਹਾਡਾ ਆਪਣਾ ਦੇਸੀ ਖੇਤੀ ਸਹਾਇਕ",
    newChat: "ਨਵਾਂ ਚੈਟ (New Chat)",
    clearHistory: "ਸਾਰਾ ਇਤਿਹਾਸ ਮਿਟਾਓ",
    mandiPrices: "ਮੰਡੀ ਦੇ ਤਾਜ਼ਾ ਭਾਅ",
    fertilizerCalc: "ਖਾਦ ਕੈਲਕੁਲੇਟਰ",
    weatherAlerts: "ਮੌਸਮ ਤੇ ਸਲਾਹ",
    language: "ਭਾਸ਼ਾ",
    inputPlaceholder: "ਆਪਣੇ ਕਿਸਾਨ ਮਿੱਤਰ ਤੋਂ ਖੇਤੀਬਾੜੀ ਸਵਾਲ ਪੁੱਛੋ...",
    voiceReading: "ਆਵਾਜ਼ ਸਹਾਇਕ (ਆਵਾਜ਼ ਸੁਣੋ)",
    voiceReadingActive: "ਆਵਾਜ਼ ਸਹਾਇਕ ਚਾਲੂ ਹੈ",
    voiceReadingInactive: "ਆਵਾਜ਼ ਸਹਾਇਕ ਬੰਦ ਹੈ",
    stopReading: "ਆਵਾਜ਼ ਬੰਦ ਕਰੋ",
    diagnosticReport: "ਕਿਸਾਨ ਮਿੱਤਰ ਬਿਮਾਰੀ ਰਿਪੋਰਟ",
    cropName: "ਫਸਲ ਦਾ ਨਾਮ",
    problemDetected: "ਬਿਮਾਰੀ/ਸਮੱਸਿਆ",
    severity: "ਗੰਭੀਰਤਾ ਦਾ ਪੱਧਰ",
    treatment: "ਤੁਰੰਤ ਇਲਾਜ",
    bestFertilizerPesticide: "ਵਧੀਆ ਦਵਾਈ/ਖਾਦ",
    prevention: "ਬਚਾਅ ਦੇ ਤਰੀਕੇ",
    printReport: "ਰਿਪੋਰਟ ਡਾਊਨਲੋਡ/ਪ੍ਰਿੰਟ ਕਰੋ",
    naturalRemedy: "ਦੇਸੀ/ਆਰਗੈਨਿਕ ਉਪਾਅ",
    high: "ਬਹੁਤ ਗੰਭੀਰ 🔴",
    medium: "ਦਰਮਿਆਨਾ 🟡",
    low: "ਸਧਾਰਨ ਸਥਿਤੀ 🟢",
    welcomeTitle: "ਵੀਰ ਜੀ, ਅੱਜ ਕੀ ਮਸਲਾ ਹੈ? 🌾",
    welcomeSubtitle: "ਫਸਲ, ਕੀੜੇ, ਖาਦ, ਮੰਡੀ — ਕੁਝ ਵੀ ਪੁੱਛੋ! ਮੈਂ ਹਾਂ ਤੁਹਾਡਾ ਕਿਸਾਨ ਮਿੱਤਰ।",
    cardDiseaseTitle: "ਪੱਤਿਆਂ ਦੀ ਬੀਮਾਰੀ ਜਾਂਚ",
    cardDiseaseDesc: "ਪੱਤੇ ਦੀ ਫੋਟੋ ਖਿੱਚੋ ਜਾਂ ਅਪਲੋਡ ਕਰੋ। ਕਿਸਾਨ ਮਿੱਤਰ ਉੱਲੀ, ਪੀਲਾ ਰਸਟ, ਕੀੜੇ ਜਾਂ ਖੁਰਾਕੀ ਤੱਤਾਂ ਦੀ ਕਮੀ ਦੱਸੇਗਾ।",
    cardFertTab: "ਖਾਦ ਦੀ ਸਹੀ ਮਾਤਰਾ",
    cardFertDesc: "ਜਾਣੋ ਕਿ ਪ੍ਰਤੀ ਏਕੜ ਕਿੰਨੀ ਯੂਰੀਆ, ਡੀਏਪੀ (DAP) ਜਾਂ ਸੁਪਰ ਫਾਸਫੇਟ ਪਾਉਣ ਦੀ ਲੋੜ ਹੈ।",
    cardMandiTab: "ਮੰਡੀ ਰੇਟ ਟਰੈਕਰ",
    cardMandiDesc: "ਖੰਨਾ, ਕਰਨਾਲ, ਬਠਿੰਡਾ, ਅਤੇ ਪਟਿਆਲਾ ਦੀਆਂ ਅਨਾਜ ਮੰਡੀਆਂ ਦੇ ਅੱਜ ਦੇ ਰੇਟ ਦੇਖੋ।",


    voiceActive: "ਕਿਸਾਨ ਵੀਰ ਜੀ ਬੋਲੋ, ਅਸੀਂ ਸੁਣ ਰਹੇ ਹਾਂ...",
    notFarmingRefusal: "ਵੀਰ ਜੀ, ਮੈਂ ਕਿਸਾਨ ਦਾ ਪੁੱਤ ਹਾਂ ਤੇ ਸਿਰਫ ਖੇਤੀਬਾੜੀ ਦੇ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦੇ ਸਕਦਾ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਖੇਤੀ ਬਾਰੇ ਪੁੱਛੋ!",
    history: "ਪੁਰਾਣੀ ਜਾਂਚ ਇਤਿਹਾਸ",
    noHistory: "ਕੋਈ ਪੁਰਾਣਾ ਇਤਿਹਾਸ ਨਹੀਂ ਹੈ। ਇੱਕ ਨਵੀਂ ਫਸਲ ਜਾਂਚ ਸ਼ੁਰੂ ਕਰੋ!",
    speakText: "ਆਵਾਜ਼ ਸੁਣੋ",
    calculating: "ਹਿਸਾਬ ਲਾਇਆ ਜਾ ਰਿਹਾ ਹੈ...",
    acreageInput: "ਖੇਤ ਦਾ ਰਕਬਾ ਦਰਜ ਕਰੋ (ਏਕੜ)",
    selectCrop: "ਫਸਲ ਚੁਣੋ",
    calcUrea: "ਯੂਰੀਆ ਖਾਦ",
    calcDap: "ਡੀਏਪੀ (DAP)",
    calcMop: "ਪੋਟਾਸ਼ (ਐਮਓਪੀ)",
    calcBags: "ਲੋੜੀਂਦੀ ਮਾਤਰਾ (50 ਕਿੱਲੋ ਵਾਲੀਆਂ ਬੋਰੀਆਂ)",
    weatherHot: "ਮੌਸਮ ਖੁਸ਼ਕ ਤੇ ਗਰਮ ਹੈ। ਨਮੀ ਬਣਾਈ ਰੱਖਣ ਲਈ ਢੁਕਵੀਂ ਸਿੰਚਾਈ ਕਰੋ।",
    weatherRain: "ਹਲਕੇ ਮੀਂह ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਦਵਾਈਆਂ ਦਾ ਛਿੜਕਾਅ ਹਾਲੇ ਰੋਕ ਦਿਓ।",
    weatherMild: "ਅਨੁਕੂਲ ਮੌਸਮ ਹੈ। ਯੂਰੀਆ ਦੇ ਛਿੱਟੇ ਲਈ ਬਹੁਤ ਵਧੀਆ ਸਮਾਂ ਹੈ।",
    searchMarket: "ਫਸਲ ਜਾਂ ਮੰਡੀ ਦਾ ਨਾਮ ਲੱਭੋ..."
  }
};

// Static representation of regional market grain rates
export const MOCK_MANDI_PRICES: MandiPrice[] = [
  { id: '1', crop: { en: 'Wheat', hi: 'गेहूं (कनक)', pa: 'ਕਣਕ' }, market: { en: 'Khanna (Asia\'s Largest)', hi: 'खन्ना (एशिया की सबसे बड़ी)', pa: 'ਖੰਨਾ' }, price: 2325, change: 'up', changeAmount: 15 },
  { id: '2', crop: { en: 'Wheat', hi: 'गेहूं', pa: 'ਕਣਕ' }, market: { en: 'Karnal Grain Market', hi: 'करनाल अनाज मंडी', pa: 'ਕਰਨਾਲ' }, price: 2315, change: 'stable', changeAmount: 0 },
  { id: '3', crop: { en: 'Wheat', hi: 'गेहूं', pa: 'ਕਣਕ' }, market: { en: 'Bathinda Market', hi: 'बठिंडा मंडी', pa: 'ਬਠਿੰਡਾ' }, price: 2330, change: 'up', changeAmount: 20 },
  { id: '4', crop: { en: 'Padddy (PR-126)', hi: 'धान (पीआर-126)', pa: 'ਝੋਨਾ (PR-126)' }, market: { en: 'Khanna Market', hi: 'खन्ना मंडी', pa: 'ਖੰਨਾ' }, price: 2205, change: 'down', changeAmount: 10 },
  { id: '5', crop: { en: 'Paddy (Basmati 1121)', hi: 'धान (बासमती 1121)', pa: 'ਬਾਸਮਤੀ 1121' }, market: { en: 'Amritsar Vallah', hi: 'अमृतसर वल्ला मंडी', pa: 'ਅੰਮ੍ਰਿਤਸਰ' }, price: 4250, change: 'up', changeAmount: 75 },
  { id: '6', crop: { en: 'Paddy (Basmati 1509)', hi: 'धान (बासमती 1509)', pa: 'ਬਾਸਮਤੀ 1509' }, market: { en: 'Karnal Market', hi: 'करनाल मंडी', pa: 'ਕਰਨਾਲ' }, price: 3820, change: 'down', changeAmount: 40 },
  { id: '7', crop: { en: 'Mustard (Sarson)', hi: 'सरसों', pa: 'ਸਰੋਂ' }, market: { en: 'Sirsa Grain Yard', hi: 'सिरसा अनाज मंडी', pa: 'ਸਿਰਸਾ' }, price: 5450, change: 'up', changeAmount: 120 },
  { id: '8', crop: { en: 'Mustard (Sarson)', hi: 'सरसों', pa: 'ਸਰੋਂ' }, market: { en: 'Bathinda Market', hi: 'बठिंडा मंडी', pa: 'ਬਠਿੰਡਾ' }, price: 5420, change: 'stable', changeAmount: 0 },
  { id: '9', crop: { en: 'Potato', hi: 'आलू', pa: 'ਆਲੂ' }, market: { en: 'Jalandhar Vegetable Market', hi: 'जालंधर सब्जी मंडी', pa: 'ਜਲੰਧਰ' }, price: 1100, change: 'up', changeAmount: 30 },
  { id: '10', crop: { en: 'Cotton (Narma)', hi: 'नरमा कपास', pa: 'ਨਰਮਾ ਕਪਾਹ' }, market: { en: 'Abohar Mandi', hi: 'अबोहर मंडी', pa: 'ਅਬੋਹਰ' }, price: 7100, change: 'down', changeAmount: 150 },
  { id: '11', crop: { en: 'Tomato', hi: 'टमाटर', pa: 'ਟਮਾਟਰ' }, market: { en: 'Karnal Mandi', hi: 'करनाल मंडी', pa: 'ਕਰਨਾਲ' }, price: 1800, change: 'up', changeAmount: 50 },
  { id: '12', crop: { en: 'Peas (Matar)', hi: 'मटर', pa: 'ਮਟਰ' }, market: { en: 'Hoshiarpur Mandi', hi: 'ਹੁਸ਼ਿਆਰਪੁਰ ਮੰਡੀ', pa: 'ਹੁਸ਼ਿਆਰਪੁਰ' }, price: 2800, change: 'down', changeAmount: 100 }
];

// Technical fertilizer dosages based on Agriculture University recommendations
export const FERTILIZER_RECOMMENDATIONS: FertilizerRecommendation[] = [
  { crop: "wheat", source: "Wheat (गेहूं / ਕਣਕ)", nitrogen: 50, phosphorus: 25, potassium: 12 },
  { crop: "rice", source: "Paddy/Rice (धान / ਝੋਨਾ)", nitrogen: 60, phosphorus: 30, potassium: 15 },
  { crop: "maize", source: "Maize (मक्का / ਮੱਕੀ)", nitrogen: 55, phosphorus: 24, potassium: 12 },
  { crop: "potato", source: "Potato (आलू / ਆਲੂ)", nitrogen: 75, phosphorus: 40, potassium: 50 },
  { crop: "cotton", source: "Cotton (नरमा कपास / ਕਪਾਹ)", nitrogen: 40, phosphorus: 20, potassium: 10 },
  { crop: "mustard", source: "Mustard (सरसों / ਸਰੋਂ)", nitrogen: 40, phosphorus: 15, potassium: 15 },
  { crop: "tomato", source: "Tomato (टमाटर / ਟਮਾਟਰ)", nitrogen: 60, phosphorus: 40, potassium: 48 },
  { crop: "pea", source: "Peas / Matar (मटर / ਮਟਰ)", nitrogen: 15, phosphorus: 20, potassium: 10 }
];
