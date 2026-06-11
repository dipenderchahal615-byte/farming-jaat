export function detectLanguage(lastText: string, systemPrompt: string): 'hi' | 'pa' | 'en' {
  const text = (lastText || "").toLowerCase();
  const containsGurmukhi = /[\u0A00-\u0A7F]/.test(text);
  if (containsGurmukhi) return 'pa';
  
  const containsDevanagari = /[\u0900-\u097F]/.test(text);
  if (containsDevanagari) return 'hi';

  const systemLower = (systemPrompt || "").toLowerCase();
  if (systemLower.includes('hindi') || systemLower.includes('हिंदी') || systemLower.includes('hi_in')) return 'hi';
  if (systemLower.includes('punjabi') || systemLower.includes('ਪੰਜਾਬੀ') || systemLower.includes('pa_in')) return 'pa';

  return 'en';
}

export function getResponseCategory(queryText: string): string {
  const text = (queryText || "").toLowerCase();
  
  if (text.includes("tomato") || text.includes("टमाटर") || text.includes("ਟਮਾਟਰ")) return "tomato";
  if (text.includes("wheat") || text.includes("गेहूं") || text.includes("गेहूँ") || text.includes("ਕਣਕ") || text.includes("gehun") || text.includes("kanak")) return "wheat";
  if (text.includes("paddy") || text.includes("rice") || text.includes("धान") || text.includes("चावल") || text.includes("ਚੌਲ") || text.includes("ਝੋਨਾ") || text.includes("dhan") || text.includes("chawal") || text.includes("jhona")) return "rice";
  if (text.includes("potato") || text.includes("आलू") || text.includes("ਆਲੂ") || text.includes("aloo")) return "potato";
  if (text.includes("cotton") || text.includes("कपास") || text.includes("नरमा") || text.includes("ਨਰਮਾ") || text.includes("kapas") || text.includes("narma")) return "cotton";
  if (text.includes("chilli") || text.includes("mirch") || text.includes("मिर्च") || text.includes("ਮਿਰਚ") || text.includes("pepper")) return "chilli";
  if (text.includes("onion") || text.includes("pyaj") || text.includes("प्याज") || text.includes("ਗੰਢਾ") || text.includes("pyaaz")) return "onion";
  if (text.includes("mustard") || text.includes("sarso") || text.includes("सरसों") || text.includes("ਸਰ੍ਹੋਂ") || text.includes("sarson")) return "mustard";
  if (text.includes("sugarcane") || text.includes("ganna") || text.includes("गन्ना") || text.includes("ਕਮਾਦ")) return "sugarcane";
  if (text.includes("maize") || text.includes("makka") || text.includes("मक्का") || text.includes("ਮੱਕੀ")) return "maize";
  if (text.includes("pea") || text.includes("matar") || text.includes("मटर") || text.includes("ਮਟਰ")) return "pea";
  if (text.includes("brinjal") || text.includes("baigan") || text.includes("बैंगन") || text.includes("ਬੈਂਗਣ")) return "brinjal";
  if (text.includes("fertilizer") || text.includes("khad") || text.includes("खाद") || text.includes("urea") || text.includes("dap") || text.includes("npk") || text.includes("यूरिया") || text.includes("ਯੂਰੀਆ")) return "fertilizer";
  if (text.includes("scheme") || text.includes("pension") || text.includes("yojana") || text.includes("योजना") || text.includes("pm kisan") || text.includes("ਪੈਨਸ਼ਨ") || text.includes("ਯੋਜਨਾ")) return "scheme";
  if (text.includes("mandi") || text.includes("rate") || text.includes("price") || text.includes("भाव") || text.includes("रेट") || text.includes("ਭਾਅ")) return "mandi";
  if (text.includes("dairy") || text.includes("cow") || text.includes("buffalo") || text.includes("milk") || text.includes("भैंस") || text.includes("गाय") || text.includes("ਪਸ਼ੂ") || text.includes("ਦੁੱਧ") || text.includes("pashu")) return "dairy";
  
  return "general";
}

interface CropDetails {
  en: string;
  hi: string;
  pa: string;
}

const CROPS: Record<string, CropDetails> = {
  tomato: { en: "Tomato", hi: "टमाटर", pa: "ਟਮาਟਰ" },
  wheat: { en: "Wheat", hi: "गेहूं", pa: "ਕਣਕ" },
  rice: { en: "Paddy/Rice", hi: "धान/चावल", pa: "ਝੋਨਾ/ਚੌਲ" },
  potato: { en: "Potato", hi: "आलू", pa: "ਆਲੂ" },
  cotton: { en: "Cotton", hi: "कपास (नरमा)", pa: "ਕਪਾਹ (ਨਰਮਾ)" },
  chilli: { en: "Chilli", hi: "मिर्च", pa: "ਮਿਰਚ" },
  onion: { en: "Onion", hi: "प्याज", pa: "ਗੰਢਾ" },
  mustard: { en: "Mustard", hi: "सरसों", pa: "ਸਰ੍ਹੋਂ" },
  sugarcane: { en: "Sugarcane", hi: "गन्ना", pa: "ਕਮਾਦ" },
  maize: { en: "Maize", hi: "मक्का", pa: "ਮੱਕੀ" },
  pea: { en: "Peas", hi: "मटर", pa: "ਮਟਰ" },
  brinjal: { en: "Brinjal", hi: "बैंगन", pa: "ਬੈਂਗਣ" },
  mango: { en: "Mango Tree", hi: "आम", pa: "ਅੰਬ" },
  rose: { en: "Rose Plant", hi: "गुलाब", pa: "ਗੁਲਾਬ" },
  lemon: { en: "Lemon Tree", hi: "नींबू", pa: "ਨਿੰਬੂ" },
  guava: { en: "Guava Tree", hi: "अमरूद", pa: "ਅਮਰੂਦ" },
  apple: { en: "Apple Tree", hi: "सेब", pa: "ਸੇਬ" },
  tulsi: { en: "Tulsi Plant", hi: "तुलसी", pa: "ਤੁਲਸੀ" },
  marigold: { en: "Marigold Plant", hi: "गेंदा", pa: "ਗੇਂਦਾ" },
  aloe: { en: "Aloe Vera Plant", hi: "एलोवेरा", pa: "ਐਲੋਵੇਰਾ" },
  general_plant: { en: "Identified Plant / Tree", hi: "पहचाना गया सामान्य पौधा / पेड़", pa: "ਪਛਾਣਿਆ ਗਿਆ ਸਧਾਰਨ ਪੌਦਾ / ਰੁੱਖ" },
  general: { en: "Crop/Soil", hi: "फसल और भूमि", pa: "ਫਸਲ ਤੇ ਜ਼ਮੀਨ" }
};

interface SeverityData {
  severity: "High" | "Medium" | "Low";
  en: { name: string; cause: string; chemical: string; organic: string; tip: string };
  hi: { name: string; cause: string; chemical: string; organic: string; tip: string };
  pa: { name: string; cause: string; chemical: string; organic: string; tip: string };
}

// Highly specific crop-problem expert database schema to solve "1 hi paragraph aa rha hai" issue
const SPECIFIC_DIAGNOSIS: Record<string, Record<string, SeverityData>> = {
  tomato: {
    yellowing: {
      severity: "Medium",
      en: {
        name: "Tomato Leaf Chlorosis / Nitrogen & Zinc Deficiency",
        cause: "Deficiency of active Nitrogen component which stunts leaf chlorophyll levels, often aggravated by heavy limestone or basic soil pH values.",
        chemical: "Spray Urea (46%) dissolved in water @ 4-5g per Liter or apply NPK 19:19:19 @ 5g per Liter with Zinc Sulphate 21% @ 2g per Liter.",
        organic: "Apply well-fermented sour buttermilk (diluted 1:10 with water) mixed with mustard cake powder solution to drench root zones.",
        tip: "Avoid continuous stagnant clay water around tomato roots. Maintain strict raised ridge cultivation for correct root aeration."
      },
      hi: {
        name: "टमाटर में नाइट्रोजन और जस्ता की कमी (Leaf Yellowing)",
        cause: "मुख्य रूप से नाइट्रोजन या जिंक (जस्ता) की कमी, जो टमाटर के नए और निचले पत्तों में क्लोरोफिल कम करके उन्हें पीला व कमजोर बना देती है।",
        chemical: "एनपीके (NPK 19:19:19) घुलनशील खाद @ 5 ग्राम प्रति लीटर पानी और जिंक सल्फेट 21% @ 2.5 ग्राम प्रति लीटर पानी का घोल बनाकर पत्तों पर स्प्रे करें।",
        organic: "10 दिन पुरानी खट्टी लस्सी (1 लीटर) को 15 लीटर साफ पानी में मिलाकर प्रति सप्ताह पत्तों पर छिड़काव करें। यह नाइट्रोजन देने का उत्तम देसी नुस्खा है।",
        tip: "टमाटर के पौधों की जड़ों के पास पानी रुकने न दें। मेड़ बनाकर (Raised beds) उनपर टमाटर बोएं जिससे जड़ों को पर्याप्त हवा मिले।"
      },
      pa: {
        name: "ਟਮਾਟਰ ਵਿੱਚ ਨਾਈਟ੍ਰੋਜਨ ਤੇ ਜਿੰਕ ਦੀ ਘਾਟ (Yellowing)",
        cause: "ਨਾਈਟ੍ਰੋਜਨ ਜਾਂ ਜਿੰਕ ਦੀ ਕਮੀ ਕਾਰਨ ਪੱਤੇ ਹਲਕੇ ਹਰੇ ਤੋਂ ਪੀਲੇ ਰੰਗ ਵਿੱਚ ਬਦਲ ਜਾਂਦੇ ਹਨ ਅਤੇ ਬੂਟੇ ਦਾ ਵਾਧਾ ਰੁਕ ਜਾਂਦਾ ਹੈ।",
        chemical: "ਐਨ.ਪੀ.ਕੇ. 19:19:19 @ 5 ਗ੍ਰਾਮ ਅਤੇ ਜਿੰਕ ਸਲਫੇਟ @ 2 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਪੱਤਿਆਂ 'ਤੇ ਚੰਗੀ ਤਰ੍ਹਾਂ ਛਿੜਕਾਅ ਕਰੋ।",
        organic: "ਪੁਰਾਣੀ ਖੱਟੀ ਲੱਸੀ @ 1.5 ਲੀਟਰ ਨੂੰ 15 ਲੀਟਰ ਪਾਣੀ ਵਾਲੇ ਸਪਰੇਅ ਪੰਪ ਵਿੱਚ ਪਾ ਕੇ ਹਫ਼ਤੇ ਵਿੱਚ ਇੱਕ ਵਾਰ ਛਿੜਕਾਅ ਕਰੋ।",
        tip: "ਟਮਾਟਰ ਨੂੰ ਹਮੇਸ਼ਾ ਵੱਟਾਂ 'ਤੇ ਬੀਜੋ। ਸਿੱਧਾ ਪਾਣੀ ਲਗਾਉਣ ਨਾਲ ਜੜ੍ਹਾਂ ਸੁੱਕਦੀਆਂ ਅਤੇ ਪੀਲੀਆਂ ਪੈਂਦੀਆਂ ਹਨ।"
      }
    },
    fungus: {
      severity: "High",
      en: {
        name: "Tomato Early & Late Blight disease",
        cause: "Infestation of Alternaria solani kfungus. High leaf moisture and cloudy weather trigger brown Concentric Targets spots on leaves.",
        chemical: "Foliar spray with Syngenta Kavach (Chlorothalonil 75% WP) @ 2g per Liter water, or Metalaxyl 8% + Mancozeb 64% (Ridomil Gold) @ 2.5g per Liter.",
        organic: "Prepare a solution of Turmeric powder @ 5g per Liter (contains curcumin anti-fungal) and drench foliar zones during dry morning hours.",
        tip: "Prune the lower leaves of tomato plants up to 9 inches from the ground to prevent soil-borne fungal spores from splashing onto foliage."
      },
      hi: {
        name: "टमाटर का अगेती व पछेती झुलसा रोग (Early & Late Blight)",
        cause: "अल्टरनेरिया नामक खतरनाक कवक (Fungus)। बार-बार बादल छाने, कोहरे या नमी से पत्तों पर गहरे कत्थई रंग के गोल छल्लेदार धब्बे बनते हैं और फसल नष्ट हो जाती है।",
        chemical: "मेटलॉक्सिल 8% + मैनकोज़ेब 64% (सिंजेंटा रिडोमिल गोल्ड) @ 2.5 ग्राम प्रति लीटर पानी या यूपीएल साफ (SAAF) @ 2 ग्राम प्रति लीटर पानी का छिड़काव करें।",
        organic: "2 लीटर खट्टी लस्सी को तांबे के बर्तन में 8 दिन रखें, फिर उसे 100 ग्राम हल्दी पाउडर और 15 लीटर पानी में मिलाकर पत्तों पर छिड़कें। यह प्राकृतिक तांबा-फफूंदनाशक है।",
        tip: "टमाटर के पौधों के निचले 9 इंच तक के पत्तों को काट दें (Pruning) ताकि हवा और धूप जड़ों तक सीधे पहुंच सके और नमी जमा न हो।"
      },
      pa: {
        name: "ਟਮਾਟਰ ਦਾ ਅਗੇਤੀ ਤੇ ਪਿਛੇਤੀ ਝੁਲਸ ਰੋਗ (Tomato Blight)",
        cause: "ਉੱਲੀ (Alternaria Fungus) ਕਾਰਨ ਹੁੰਦਾ ਹੈ। ਬੱਦਲਵਾਈ ਅਤੇ ਤੇਜ਼ ਨਮੀ ਵਿੱਚ ਪੱਤੇ ਕਾਲੇ ਹੋ ਕੇ ਝੁਲਸ ਜਾਂਦੇ ਹਨ ਅਤੇ ਫਲ ਵੀ ਸੜ ਜਾਂਦੇ ਹਨ।",
        chemical: "ਯੂ.ਪੀ.ਐਲ. ਸਾਫ਼ (SAAF Fungicide) @ 2 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਜਾਂ ਰਿਡੋਮਿਲ ਗੋਲਡ @ 2.5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
        organic: "ਤਾਂਬੇ ਦੇ ਭਾਂਡੇ ਵਿੱਚ 10 ਦਿਨ ਰੱਖੀ ਖੱਟੀ ਲੱਸੀ 1.5 ਲੀਟਰ ਨੂੰ 100 ਗ੍ਰਾਮ ਹਲਦੀ ਦੇ ਨਾਲ 15 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਸਪਰੇਅ ਕਰੋ।",
        tip: "ਟਮਾਟਰ ਦੇ ਬੂਟਿਆਂ ਦੇ ਹੇਠਲੇ 8-9 ਇੰਚ ਤੱਕ ਦੇ ਫਾਲਤੂ ਪੱਤਿਆਂ ਦੀ ਕਟਾਈ ਕਰੋ ਤਾਂ ਜੋ ਹਵਾ ਲੰਘ ਸਕੇ ਅਤੇ ਉੱਲੀ ਨਾ ਫੈਲੇ।"
      }
    },
    insects: {
      severity: "High",
      en: {
        name: "Tomato Fruit Borer Outbreak",
        cause: "Helicoverpa armigera moth caterpillars which drill circular holes into tomato fruits, feeding internally and rotting the crop.",
        chemical: "Spray FMC Coragen (Chlorantraniliprole 18.5% SC) @ 6ml per 15L spraying pump, or Emamectin Benzoate 5% SG @ 0.5g per Liter water.",
        organic: "Spray Neem Seed Kernel Extract (5% NSKE) or Cold Pressed Neem oil (10,000 ppm) @ 5ml/L emulsified with liquid dishwash drops.",
        tip: "Intercrop with African Yellow Marigold flowers (ratio of 16 rows of tomato to 1 row of marigold) as trap crops to divert moth eggs."
      },
      hi: {
        name: "टमाटर का फल छेदक कीट हमला (Fruit Borer)",
        cause: "हेलिकोवर्पा सुंडी कीट। यह सुंडी पत्तों को खाने के बाद टमाटर के फलों में मोटे गोल छेद कर देती है और अंदर घुसकर गूदे को खाकर टमाटर सड़ा देती है।",
        chemical: "एफएमसी कोराजन (FMC Coragen) @ 6 मिली प्रति 15 लीटर पंप, अथवा एमामेक्टिन बेंजोएट 5% SG @ 8 ग्राम प्रति 15 लीटर पंप में मिलाकर छिड़काव करें।",
        organic: "नीम की निंबोली का काढ़ा (5% NSKE) या नीम का शुद्ध तेल (10,000 PPM) @ 75 मिली प्रति 15 लीटर पंप थोड़े सर्फ पानी के साथ मिलाकर स्प्रे करें।",
        tip: "खेत के चारों ओर या प्रत्येक 10 लाइनों के बाद 1 लाइन गेंदे (गेंदा फूल) की अवश्य लगाएं। तितलियां टमाटर को छोड़ गेंदे पर अंडे देती हैं जिससे बचाव होता है।"
      },
      pa: {
        name: "ਟਮਾਟਰ ਦਾ ਫਲ ਛੇਦਕ ਕੀੜਾ (Fruit Borer)",
        cause: "ਸੁੰਡੀ (Caterpillar) ਟਮਾਟਰਾਂ ਦੇ ਅੰਦਰ ਮੋਰੀਆਂ ਕਰਕੇ ਗੂਦੇ ਨੂੰ ਖਾਂਦੀ ਹੈ, ਜਿਸ ਨਾਲ ਫਲ ਵਿਕਣ ਯੋਗ ਨਹੀਂ ਰਹਿੰਦਾ ਅਤੇ ਸੜ ਜਾਂਦਾ ਹੈ।",
        chemical: "ਕੋਰਾਜਨ (Coragen) @ 60 ਮਿਲੀਲੀਟਰ ਪ੍ਰਤੀ ਏਕੜ ਜਾਂ ਐਮਾਮੈਕਟਿਨ ਬੈਂਜੋਏਟ @ 80 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਏਕੜ ਨੂੰ 150 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਛਿੜਕੋ।",
        organic: "ਨੀਮ ਦਾ ਤੇਲ @ 5 ਮਿਲੀਲੀਟਰ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਅਤੇ ਹਲਕਾ ਤਰਲ ਸਾਬਣ ਮਿਲਾ ਕੇ ਫ਼ਸਲ 'ਤੇ ਸਪਰੇਅ ਕਰੋ।",
        tip: "ਟਮਾਟਰਾਂ ਦੇ ਵਿਚਕਾਰ ਗੇਂਦੇ (Marigold) ਦੇ ਫੁੱਲ ਲਗਾਓ। ਕੀੜੇ ਦੇ ਪਤੰਗੇ ਗੇਂਦੇ ਵੱਲ ਆਕਰਸ਼ਿਤ ਹੁੰਦੇ ਹਨ ਤੇ ਟਮਾਟਰ ਬਚ ਜਾਂਦਾ ਹੈ।"
      }
    }
  },
  wheat: {
    yellowing: {
      severity: "Medium",
      en: {
        name: "Wheat Yellow Rust Warning & Nitrogen Deficit",
        cause: "Severe cold stagnation or shortage of Nitrogen and Zinc, or initial symptom of airborne Yellow Rust fungus during foggy cloudy days.",
        chemical: "Avoid early chemicals if rust is absent; apply NPK 19:19:19 @ 1kg per acre with Zinc Sulphate @ 500g in 150L water.",
        organic: "Foliar spray of 200 Liters of Jeevamrut or aged cow urine liquid @ 1:12 ratio with fresh water to provide instant nitrogen spike.",
        tip: "Avoid irrigation logging in wheat fields during initial tillering stage (21 days COR). Use laser level seed drilling always."
      },
      hi: {
        name: "गेहूं के पत्तों का पीलापन व पोषण की कमी",
        cause: "तापमान में उतार-चढ़ाव, मिट्टी में यूरिया (नाइट्रोजन) या जिंक की कमी, अथवा ठंडे नमी वाले मौसम में प्रारंभिक पीला रतुआ बीमारी का आगमन।",
        chemical: "यदि केवल नाइट्रोजन की कमी है तो एनपीके (NPK 19:19:19) @ 1 किलो प्रति एकड़ 150 लीटर पानी में घोलकर छिड़कें। यदि पीला रतुआ है तो प्रोपीकोनाज़ोल (टिल्ट) @ 1 मिली/लीटर स्प्रे करें।",
        organic: "10 लीटर गोमूत्र और 2 किलो गुड़ को 150 लीटर पानी में मिलाकर गेहूं पर प्रति एकड़ स्प्रे करें। यह पत्तों का पीलापन हटाकर गेहूं को तुरंत मजबूत बनाता है।",
        tip: "गेहूं में बुआई के 21 दिनों बाद (मुकुट जड़ बनते समय) पहला पानी हल्का दें। अधिक भारी पानी देने से कनक पीली पड़कर बैठ जाती है।"
      },
      pa: {
        name: "ਕਣਕ ਦਾ ਪੀਲਾਪਨ ਤੇ ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਕਮੀ",
        cause: "ਲਗਾਤਾਰ ਕੋਹਰਾ ਪੈਣ, ਜਿੰਕ ਦੀ ਘਾਟ ਜਾਂ ਭਾਰੀ ਪਾਣੀ ਲਗਾਉਣ ਨਾਲ ਜੜ੍ਹਾਂ ਨੂੰ ਹਵਾ ਨਾ ਮਿਲਣਾ ਅਤੇ ਪੀਲੀ ਕੁੰਗੀ ਦਾ ਮੁੱਢਲਾ ਅਸਰ।",
        chemical: "ਐਨ.ਪੀ.ਕੇ. 19:19:19 @ 1 ਕਿੱਲੋ ਅਤੇ ਜਿੰਕ 21% @ 500 ਗ੍ਰਾਮ ਨੂੰ 150 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਪ੍ਰਤੀ ਏਕੜ ਛਿੜਕਾਅ ਕਰੋ।",
        organic: "ਗਊ ਮੂਤਰ @ 5 ਲੀਟਰ ਨੂੰ 150 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਕਣਕ 'ਤੇ ਸਪਰੇਅ ਕਰੋ। ਇਹ ਫ਼ਸਲ ਨੂੰ ਤੁਰੰਤ ਹਰਾ-ਭਰਾ ਕਰੇਗਾ।",
        tip: "ਕਣਕ ਨੂੰ ਪਹਿਲਾ ਪਾਣੀ (ਬਿਜਾਈ ਦੇ 21ਵੇਂ ਦਿਨ) ਬਹੁਤ ਹਲਕਾ ਲਗਾਓ। ਭਾਰੀ ਪਾਣੀ ਨਾਲ ਫ਼ਸਲ ਪੀਲੀ ਪੈ ਕੇ ਦੱਬ ਜਾਂਦੀ ਹੈ।"
      }
    },
    fungus: {
      severity: "High",
      en: {
        name: "Wheat Yellow Rust / Stripe Rust (Stripe Puccinia)",
        cause: "Fungal pathogen Puccinia striiformis. Spreads as bright yellow powdery stripes on wheat leaves in temperatures of 10-20°C with high fog.",
        chemical: "Foliar spray Propiconazole 25% EC (Syngenta Tilt) @ 1ml per Liter of water, or apply Tebuconazole @ 1ml per Liter water immediately.",
        organic: "Spray fermented Sour Lassi (diluted 1:10) mixed with Neem Leaves Decoction to suppress early fungal spore development.",
        tip: "Regularly monitor your fields from January onwards. If you see yellow powder on your fingers after touching leaves, spray immediately before wind spreads it."
      },
      hi: {
        name: "गेहूं का पीला रतुआ रोग (Yellow Rust / Stripe Rust)",
        cause: "पुक्सिनिया स्ट्रीफॉर्मिस नामक फफूंद कवक। हवा से फैलने वाला यह रोग 10-20 डिग्री तापमान और कोहरे में पत्तियों पर पीली हल्दी जैसा पाउडर की पट्टियां बनाता है।",
        chemical: "प्रभावित क्षेत्रों पर सिंजेंटा टिल्ट (Propiconazole 25% EC) @ 200 मिली प्रति 150 लीटर पानी में मिलाकर तुरंत प्रति एकड़ स्प्रे करें।",
        organic: "10-12 दिन तांबे के बर्तन में रखी खट्टी लस्सी को हल्दी पाउडर के साथ मिलाकर स्प्रे करें, शुरुआती कवक प्रसार को रोकने में यह काफी सहायक है।",
        tip: "जनवरी-फरवरी के महीने में सुबह खेत का चक्कर काटें। यदि छूने पर हाथ में पीला रंग (हल्दी जैसा) लगे तो तुरंत उपचार करें नहीं तो हवा से सारा खेत नष्ट हो जाएगा।"
      },
      pa: {
        name: "ਕਣਕ ਦਾ ਪੀਲਾ ਰਤੂਆ / ਪੀਲੀ ਕੁੰਗੀ (Yellow Rust)",
        cause: "ਹਵਾ ਰਾਹੀਂ ਫੈਲਣ ਵਾਲੀ ਉੱਲੀ (Puccinia Fungus)। ਠੰਡੇ ਤੇ ਸਿੱਲ੍ਹੇ ਮੌਸਮ ਵਿੱਚ ਕਣਕ ਦੇ ਪੱਤਿਆਂ 'ਤੇ ਹਲਦੀ ਵਰਗਾ ਪੀਲਾ ਪਾਊਡਰ ਬਣਨਾ ਸ਼ੁਰੂ ਹੋ ਜਾਂਦਾ ਹੈ।",
        chemical: "ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ 25% EC (Tilt) @ 200 ਮਿਲੀਲੀਟਰ ਪ੍ਰਤੀ ਏਕੜ ਨੂੰ 150 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਤੁਰੰਤ ਸਪਰੇਅ ਕਰੋ।",
        organic: "ਤਾਂਬੇ ਵਾਲੀ 2 ਲੀਟਰ ਖੱਟੀ ਲੱਸੀ ਵਿੱਚ 100 ਗ੍ਰਾਮ ਹਲਦੀ ਪਾ ਕੇ ਪੂਰੇ ਖੇਤ 'ਤੇ ਸਪਰੇਅ ਕਰੋ, ਇਹ ਕੁੰਗੀ ਫੈਲਣ ਤੋਂ ਬਚਾਉਂਦੀ ਹੈ।",
        tip: "ਜਨਵਰੀ ਦੇ ਮਹੀਨੇ ਕਣਕ ਦੇ ਪੱਤਿਆਂ ਨੂੰ ਹੱਥ ਲਗਾ ਕੇ ਦੇਖੋ, ਜੇਕਰ ਹੱਥ ਪੀਲੇ ਰੰਗ ਦੇ ਪਾਊਡਰ ਨਾਲ ਭਰਨ ਤਾਂ ਬਿਨਾਂ ਦੇਰੀ ਦੇ ਸਪਰੇਅ ਕਰੋ।"
      }
    }
  },
  rice: {
    yellowing: {
      severity: "Medium",
      en: {
        name: "Paddy Khaira Disease (Zinc & Nitrogen Deficiency)",
        cause: "Acute deficiency of active Zinc combined with water logging. Leaves display rusty brown spots and base turns yellowish-white.",
        chemical: "Spray Chelated Zinc (12% EDTA) @ 1.5g per Liter or Zinc Sulphate (21%) @ 3g per Liter with Urea @ 4g per Liter water.",
        organic: "Drain stagnant stale water and apply a mixture of neem cake manure @ 50kg/acre along with raw wood ash broadcast.",
        tip: "In subsequent seasons, treat the roots of paddy seedlings in Zinc solution before transplanting from nursery to main flooded fields."
      },
      hi: {
        name: "धान का खैरा रोग (Zinc / जस्ता व नाइट्रोजन कमी)",
        cause: "धान की फसल में जिंक (जस्ता) की भारी कमी। पत्तों के मध्य भाग का पीला पड़ना और धीरे-धीरे उनपर कत्थई (लोहे जैसी जंग जैसे) धब्बे बनना खैरा रोग है।",
        chemical: "जिंक सल्फेट 21% (Zinc Sulphate) @ 5 किलो और बुझा हुआ चूना 2.5 किलो प्रति एकड़ की दर से 150 लीटर पानी में मिलाकर स्प्रे करें।",
        organic: "खेत से पुराना पानी बाहर निकालें और ताज़ी सूखी लकड़ी की राख (Wood Ash) @ 30 किलो प्रति एकड़ खेत में यूरिया की जगह बिखेरें।",
        tip: "अगली बार धान की रोपाई (Transplanting) से पहले पौध (Nursery seedlings) की जड़ों को जिंक सल्फेट घोल में डीप (डुबाकर) करके ही खेत में लगाएं।"
      },
      pa: {
        name: "ਝੋਨੇ ਦਾ ਖ਼ੈਰਾ ਰੋਗ (ਜਿੰਕ ਤੇ ਯੂਰੀਆ ਦੀ ਘਾਟ)",
        cause: "ਜਿੰਕ (Zinc) ਦੀ ਕਮੀ ਕਾਰਨ ਪੱਤਿਆਂ 'ਤੇ ਤਾਂਬੇ ਰੰਗੇ ਜਾਂ ਜੰਗਾਲ ਵਰਗੇ ਭੂਰੇ ਧੱਬੇ ਪੈ ਜਾਂਦੇ ਹਨ ਅਤੇ ਹੌਲੀ-ਹੌਲੀ ਬੂਟਾ ਪੀਲਾ ਪੈ ਕੇ ਸੁੱਕ ਜਾਂਦਾ ਹੈ।",
        chemical: "ਜਿੰਕ ਸਲਫੇਟ 21% @ 5 ਕਿੱਲੋ ਅਤੇ ਕਲੀ ਦਾ ਪਾਣੀ @ 2.5 ਕਿੱਲੋ ਨੂੰ 150 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਪ੍ਰਤੀ ਏਕੜ ਸਪਰੇਅ ਕਰੋ।",
        organic: "ਖੇਤ ਵਿੱਚੋਂ ਖੜ੍ਹਾ ਪਾਣੀ ਕੱਢ ਦਿਓ ਅਤੇ ਮਿੱਟੀ ਦੀ ਗੋਡੀ ਕਰਕੇ 50 ਕਿੱਲੋ ਨੀਮ ਦੀ ਖਲ ਪ੍ਰਤੀ ਏਕੜ ਪਾਓ।",
        tip: "ਝੋਨਾ ਲਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਪਨੀਰੀ ਦੀਆਂ ਜੜ੍ਹਾਂ ਨੂੰ ਜਿੰਕ ਘੋਲ ਵਿੱਚ ਅੱਧਾ ਘੰਟਾ ਡੁਬੋ ਕੇ ਰੱਖੋ ਅਤੇ ਫਿਰ ਬਿਜਾਈ ਕਰੋ।"
      }
    },
    fungus: {
      severity: "High",
      en: {
        name: "Paddy Blast & Sheath Blight disease",
        cause: "Fungus Pyricularia oryzae which generates spindle-shaped eye-like slots with brown margins and grey center on leaves and nodes.",
        chemical: "Spray Tricyclazole 75% WP @ 0.6g per Liter or Azoxystrobin (Amistar) @ 1ml per Liter water directly onto the entire leaf canopy.",
        organic: "Spray Jeevamrut liquid mixed with vermicompost tea during morning dry dry hours to create antagonist bacterial barriers.",
        tip: "Avoid excess Nitrogen over-doses (over-use of Urea) which creates thin watery tissues highly prone to fungal infestation."
      },
      hi: {
        name: "धान का ब्लास्ट व झुलसा रोग (Paddy Blast / Sheath Blight)",
        cause: "पायरीकुलेरिया कवक रोग। इसमें धान की पत्तियों पर सिगार या आंख की आकृति जैसे कत्थई धब्बे बनते हैं, जिससे तना कमजोर होकर टूट जाता है।",
        chemical: "ट्राइसाइक्लाजोल 75% WP @ 120 ग्राम प्रति एकड़ अथवा सिंजेंटा एमिस्टार (Azoxystrobin) @ 150 मिली प्रति एकड़ 150 लीटर पानी में घोलकर छिड़कें।",
        organic: "गाय के ताजे गोबर @ 10 किलो और गोमूत्र @ 5 लीटर को अच्छे से छानकर और छानने के बाद 120 लीटर पानी में मिलाकर धान पर स्प्रे करें।",
        tip: "खेत में अत्यधिक यूरिया (Urea) खाद डालने से बचें। यूरिया अधिक डालने से धान के पौधे बहुत कोमल और रसीले हो जाते हैं, जिनपर कवक तेज़ी से हमला करते हैं।"
      },
      pa: {
        name: "ਝੋਨੇ ਦੀ ਬਿਮਾਰੀ - ਬਲਾਸਟ ਤੇ ਝੁਲਸ ਰੋਗ (Paddy Blast)",
        cause: "ਉੱਲੀ (Fungus) ਰਾਹੀਂ ਫੈਲਣ ਵਾਲੀ ਬਿਮਾਰੀ। ਪੱਤਿਆਂ 'ਤੇ ਅੱਖ ਵਰਗੇ ਅਕਾਰ ਦੇ ਭੂਰੇ ਧੱਬੇ ਪੈਂਦੇ ਹਨ ਅਤੇ ਜੜ੍ਹਾਂ ਦੇ ਨੇੜਿਓਂ ਪੌਦਾ ਕਾਲਾ ਹੋਣ ਲੱਗਦਾ ਹੈ।",
        chemical: "ਟ੍ਰਾਈਸਾਈਕਲਾਜ਼ੋਲ 75% WP @ 100-120 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਏਕੜ ਨੂੰ 150 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਛਿੜਕੋ।",
        organic: "ਖੇਤ ਵਿੱਚ ਨਿੰਮ ਦੇ ਪੱਤਿਆਂ ਦਾ ਕਾੜ੍ਹਾ @ 5 ਲੀਟਰ ਅਤੇ ਗਊ-ਮੂਤਰ @ 2 ਲੀਟਰ ਨੂੰ 150 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਛਿੜਕਾਅ ਕਰੋ।",
        tip: "ਲੋੜ ਤੋਂ ਵੱਧ ਯੂਰੀਆ ਵਰਤਣ ਨਾਲ ਝੋਨੇ ਨੂੰ ਬਿਮਾਰੀ ਜ਼ਿਆਦਾ ਲੱਗਦੀ ਹੈ, ਇਸ ਲਈ ਸਿਫਾਰਿਸ਼ ਕੀਤੀ ਮਾਤਰਾ ਵਿੱਚ ਹੀ ਖਾਦ ਵਰਤੋ।"
      }
    },
    insects: {
      severity: "High",
      en: {
        name: "Paddy Stem Borer & Leaf Folder Pests",
        cause: "Yellow Stem Borer caterpillars drilling into Tillers, causing White Heads (empty white panicles without grain).",
        chemical: "Broad-spread FMC Ferterra (Chlorantraniliprole 0.4% GR) or Cartap Hydrochloride 4G @ 4-5kg per acre mixed with dry sand inside shallow stagnant water.",
        organic: "Install Trichogramma beneficial egg-parasitoid cards in fields (Trichocards @ 3 cards per acre), and use yellow sticky pheromone traps.",
        tip: "Avoid early standing deep water during first 30 days. Let water dry completely for a day between next irrigations."
      },
      hi: {
        name: "धान का तना छेदक व पत्ती लपेटक कीड़ा (Stem Borer)",
        cause: "तना छेदक सुंडी (Yellow Stem Borer) जो तने को भीतर से काटती है, जिससे धान की बालियां सफेद पड़ जाती हैं (White Head) और उनमें दाना नहीं भरता।",
        chemical: "एफएमसी फर्टेरा (FMC Ferterra) या कार्टाप हाइड्रोक्लोराइड 4G @ 4 किलो प्रति एकड़ की दर से खेत में हल्की नमी में यूरिया या बालू रेत में मिलाकर बिखेरें।",
        organic: "पत्ती लपेटक के समाधान हेतु 5% नीम निबोली अर्क का छिड़काव करें अथवा खेत में रस्सी फेरें (एक छोर से दूसरे छोर तक रस्सी खींचें) जिससे कीड़े पानी में गिरकर मर जाएं।",
        tip: "खेत में लगातार गहराई तक पानी भरकर न रखें। बीच-बीच में खेत की गीली दरारें दिखने तक पानी को सूखने दें, इससे सुंडी कीट का दम घुटता है।"
      },
      pa: {
        name: "ਝੋਨੇ ਵਿੱਚ ਪੱਤਾ ਲਪੇਟ ਸੁੰਡੀ ਤੇ ਤਣਾ ਛੇਦਕ (Stem Borer)",
        cause: "ਤਣਾ ਛੇਦਕ ਸੁੰਡੀ ਕਾਰਨ ਝੋਨੇ ਦੇ ਮੁੰਜਰ ਸੁੱਕ ਕੇ ਚਿੱਟੇ ਪੈ ਜਾਂਦੇ ਹਨ (White Ear) ਜਿਸ ਵਿੱਚ ਕੋਈ ਦਾਣਾ ਨਹੀਂ ਬਣਦਾ।",
        chemical: "ਖੇਤ ਵਿੱਚ ਕਾਰਟਾਪ ਹਾਈਡ੍ਰੋਕਲੋਰਾਈਡ 4% ਜੀ (Cartap Hydrochloride) @ 7-8 ਕਿੱਲੋ ਪ੍ਰਤੀ ਏਕੜ ਰੇਤ ਵਿੱਚ ਮਿਲਾ ਕੇ ਖੜ੍ਹੇ ਪਾਣੀ ਵਿੱਚ ਪਾਓ।",
        organic: "ਨੀਮ ਦੀ ਖਲ @ 50 ਕਿੱਲੋ ਪਾ ਕੇ ਸਿੰਚਾਈ ਕਰੋ, ਜਾਂ ਖੇਤ ਉੱਤੋਂ ਲੰਬੀ ਰੱਸੀ ਖਿੱਚ ਕੇ ਲੰਘਾਓ ਤਾਂ ਜੋ ਪੱਤਾ ਲਪੇਟ ਸੁੰਡੀ ਪਾਣੀ ਵਿੱਚ ਡਿੱਗ ਕੇ ਖ਼ਤਮ ਹੋ ਜਾਵੇ।",
        tip: "ਲਗਾਤਾਰ ਖੇਤ ਵਿੱਚ ਪਾਣੀ ਖੜ੍ਹਾ ਨਾ ਰੱਖੋ, ਹਫ਼ਤੇ ਵਿੱਚ ਇੱਕ ਦਿਨ ਜ਼ਮੀਨ ਨੂੰ ਹਵਾ ਲੱਗਣ ਦਿਓ।"
      }
    }
  },
  potato: {
    fungus: {
      severity: "High",
      en: {
        name: "Potato Late Blight disease (Phytophthora infestans)",
        cause: "Extremely destructive fungus thriving in cool damp conditions, destroying whole potato tuber yields in less than 10 days.",
        chemical: "Spray Metalaxyl 8% + Mancozeb 64% (Ridomil Gold) @ 2.5g per Liter or Copper Oxychloride 50% WP @ 3g per Liter water.",
        organic: "Spray 10-day old sour buttermilk copper solution combined with wood ash foliar dusting on potato leaves.",
        tip: "Earthing-up (making deep soil ridges around tubers) protects underground potato skins from fungal spores leaking from infected leaves."
      },
      hi: {
        name: "आलू का पछेती झुलसा रोग (Potato Late Blight)",
        cause: "फाइटोफ्थोरा इन्फेस्टांस नामक कवक। ठंड और बरसात/कोहरे के दौरान यह रोग 7 से 10 दिनों में पूरे आलू के पत्तों और आलुओं को सड़ाकर नष्ट कर देता है।",
        chemical: "मेटलॉक्सिल 8% + मैनकोज़ेब 64% (सिंजेंटा रिडोमिल गोल्ड) @ 2.5 ग्राम प्रति लीटर या कॉपर ऑक्सीक्लोराइड 50% WP @ 3 ग्राम प्रति लीटर पानी में घोलकर छिड़कें।",
        organic: "आलू के पौधों पर लकड़ी की सूखी छनी हुई राख (Wood ash) का भुरकाव करें, तथा खट्टी लस्सी और हल्दी का पानी बनाकर पत्तों पर स्प्रे करें।",
        tip: "आलू के पौधों पर मिट्टी चढ़ाने (Earthing-up) का कार्य अच्छे से करें, यह जड़ों और आलुओं को पत्तों से रिसने वाले कवक बीजाणुओं से सुरक्षित रखता है।"
      },
      pa: {
        name: "ਆਲੂ ਦਾ ਝੁਲਸ ਰੋਗ - ਲੇਟ ਬਲਾਈਟ (Potato Blight)",
        cause: "ਇੱਕ ਬਹੁਤ ਹੀ ਖ਼ਤਰਨਾਕ ਉੱਲੀ (Phytophthora) ਕਾਰਨ ਹੁੰਦਾ ਹੈ। ਧੁੰਦ ਅਤੇ ਸਿੱਲ੍ਹੇ ਮੌਸਮ ਵਿੱਚ ਇਹ 1 ਹਫ਼ਤੇ ਵਿੱਚ ਪੂਰੀ ਫ਼ਸਲ ਕਾਲੀ ਕਰ ਦਿੰਦਾ ਹੈ।",
        chemical: "ਕਾਪਰ ਆਕਸੀਕਲੋਰਾਈਡ 50% WP @ 3 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਜਾਂ ਰਿਡੋਮਿਲ ਗੋਲਡ @ 2.5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
        organic: "ਰੂਹੇ ਦੀ ਰਾਖ ਪੱਤਿਆਂ 'ਤੇ ਛਿੜਕੋ, ਅਤੇ ਤਾਂਬੇ ਵਾਲੇ ਘੋਲ ਦੀ ਸਪਰੇਅ ਕਰੋ।",
        tip: "ਆਲੂਆਂ ਦੇ ਮੁੱਢਾਂ 'ਤੇ ਮਿੱਟੀ ਚੰਗੀ ਤਰ੍ਹਾਂ ਚੜ੍ਹਾ ਕੇ (Earthing-up) ਰੱਖੋ, ਇਹ ਆਲੂਆਂ ਨੂੰ ਸੜਨ ਤੋਂ ਬਚਾਉਂਦਾ ਹੈ।"
      }
    }
  },
  cotton: {
    insects: {
      severity: "High",
      en: {
        name: "Cotton Pink Bollworm & Sucking Whitefly Pests",
        cause: "Pink Bollworm (Pectinophora gossypiella) boring into early green cotton bolls, destroying inside cotton lint fibres entirely.",
        chemical: "For Pink Bollworm, spray FMC Coragen @ 0.4ml per Liter or Profenofos 40% + Cypermethrin 4% EC @ 2ml per Liter water.",
        organic: "Deploy 5-10 Pheromone Trap cards per acre to capture adult moths early, and apply Neem seed extract sprays regularly.",
        tip: "Destroy old remnants of cotton stalks (parali/root stubbles) from last seasons to check overwintering pupae inside soil."
      },
      hi: {
        name: "कपास व नरमा की गुलाबी सुंडी कीट हमला (Pink Bollworm)",
        cause: "गुलाबी सुंडी (पेक्टिनोफोरा सुंडी) तथा सफ़ेद मक्खी कीट। सुंडी कपास के फूलों और कोमल ठींडों (Bolls) के अंदर घुसकर पूरी रूई और बीजों को खाकर नष्ट कर देती है।",
        chemical: "गुलाबी सुंडी हेतु कोराजन (FMC Coragen) @ 6 मिली प्रति 15L पंप, अथवा डेंटासु (Clothianidin 50% WDG) @ 4 ग्राम प्रति 15L पंप रस चूसक सफेद मक्खी के लिए स्प्रे करें।",
        organic: "खेत में प्रति एकड़ 8-10 फेरोमोन ट्रैप (Pheromone Traps - पीला गोंद कार्ड) लगाएं। वयस्क पतंगों को फंसाकर उनकी संख्या नियंत्रित करना सबसे बेहतरीन उपाय है।",
        tip: "कपास की कटाई के बाद खेत में बचे लकड़ी के डंठलों और पुराने खरपतवारों (Stubbles) को नष्ट कर दें, क्योंकि कीड़े सर्दियों में इन्हीं डंठलों में सोते हैं।"
      },
      pa: {
        name: "ਨਰਮੇ ਵਿੱਚ ਗੁਲਾਬੀ ਸੁੰਡੀ ਤੇ ਚਿੱਟੀ ਮੱਖੀ ਦਾ ਹਮਲਾ",
        cause: "ਗੁਲਾਬੀ ਸੁੰਡੀ (Pink Bollworm) ਟੀਂਡਿਆਂ ਦੇ ਅੰਦਰ ਵੜ ਕੇ ਰੂੰ ਅਤੇ ਬੀਜ (ਖਲ) ਨੂੰ ਖਾ ਕੇ ਪੂਰੀ ਕੁਆਲਿਟੀ ਬਰਬਾਦ ਕਰ ਦਿੰਦੀ ਹੈ।",
        chemical: "ਸੁੰਡੀ ਲਈ ਕੋਰਾਜਨ @ 60 ਮਿਲੀਲੀਟਰ ਪ੍ਰਤੀ ਏਕੜ ਜਾਂ ਪ੍ਰੋਫੇਨੋਫੋਸ + ਸਾਈਪਰਮੈਥਰਿਨ @ 300 ਮਿਲੀਲੀਟਰ ਪ੍ਰਤੀ ਏਕੜ ਸਪਰੇਅ ਕਰੋ।",
        organic: "ਨਰਮੇ ਦੇ ਖੇਤ ਵਿੱਚ ਹਲਦੀ ਰੰਗ ਦੇ ਪੀਲੇ ਸਟਿੱਕੀ ਕਾਰਡ (Pheromone Traps) ਲਗਾਓ, ਜੋ ਪਤੰਗਿਆਂ ਨੂੰ ਖਿੱਚ ਕੇ ਫਸਲ ਨੂੰ ਬਚਾਉਂਦੇ ਹਨ।",
        tip: "ਨਰਮਾ ਚੁਗਣ ਤੋਂ ਬਾਅਦ ਖੇਤ ਦੀਆਂ ਛਿਟੀਆਂ ਨੂੰ ਮਾਰੋ, ਕਿਉਂਕਿ ਕੀੜਾ ਸਰਦੀਆਂ ਵਿੱਚ ਇਹਨਾਂ ਛਿਟੀਆਂ ਦੇ ਸੁੱਕੇ ਪੱਤਿਆਂ ਵਿੱਚ ਅੰਡੇ ਦਿੰਦਾ ਹੈ।"
      }
    }
  },
  general_plant: {
    general: {
      severity: "Medium",
      en: {
        name: "General Plant Foliage Care & Maintenance",
        cause: "Inadequate or indirect sunlight exposure, combined with moisture saturation or slight micro-nutrient depletion in the potting soil.",
        chemical: "Apply standard household water-soluble NPK 19:19:19 fertilizer or micro-nutrient spray @ 1g per Liter of water once monthly.",
        organic: "Mix well-composted organic leaf manure or vermicompost @ 100g per pot, and apply dilute cold pressed neem extract spray to repel common pests.",
        tip: "Ensure your plant receives bright indirect sunlight (minimum 3-4 hours daily) and only water when the top 1-inch of soil feels strictly dry to touch."
      },
      hi: {
        name: "घरेलू पौधे की पत्ती स्वास्थ्य व पोषण देखभाल",
        cause: "अपर्याप्त या अप्रत्यक्ष धूप, गमले में पानी रुकने के कारण जड़ों का सांस न ले पाना, अथवा पोषक तत्वों की आंशिक कमी होना।",
        chemical: "महीने में केवल एक बार सामान्य संतुलित एनपीके (NPK 19:19:19) खाद को पानी में घोलकर (1 ग्राम प्रति लीटर) पत्तों और जड़ों में दें।",
        organic: "संजीवनी केंचुआ खाद (वर्मीकंपोस्ट) @ 100 ग्राम प्रति गमला डालें। किसी के संक्रमण से सुरक्षा के लिए नीम के तेल (5 मिली प्रति लीटर) का घोल बनाकर स्प्रे करें।",
        tip: "पौधे को रोजाना कम से कम 3-4 घंटे सुबह या शाम की हल्की धूप दिखाएं। अधिक सिंचाई करने से बचें; पानी तभी डालें जब ऊपरी मिट्टी सूखी दिखे।"
      },
      pa: {
        name: "ਘਰੇਲੂ ਬੂਟੇ ਦੀ ਸਿਹਤ ਤੇ ਪੋਸ਼ਣ ਸੰਭਾਲ",
        cause: "ਸਹੀ ਧੁੱਪ ਨਾ ਮਿਲਣਾ, ਗ਼ਮਲੇ ਵਿੱਚ ਪਾਣੀ ਖੜ੍ਹਨਾ ਜਾਂ ਮਿੱਟੀ ਵਿੱਚ ਖ਼ੁਰਾਕੀ ਤੱਤਾਂ ਦੀ ਕਮੀ ਹੋਣਾ।",
        chemical: "ਸਧਾਰਨ ਘਰਾਂ ਵਿੱਚ ਵਰਤੀ ਜਾਣ ਵਾਲੀ ਐਨ.ਪੀ.ਕੇ. (NPK 19:19:19) @ 1 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਮਹੀਨੇ ਵਿੱਚ ਇੱਕ ਵਾਰ ਛਿੜਕੋ।",
        organic: "ਬੂਟੇ ਵਿੱਚ ਦੇਸੀ ਵਰਮੀਕੰਪੋਸਟ @ 100 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਗ਼ਮਲਾ ਪਾਓ ਅਤੇ ਕੀੜਿਆਂ ਤੋਂ ਬਚਾਅ ਲਈ ਨਿੰਮ ਦੇ ਤੇਲ ਦਾ ਹਲਕਾ ਸਪਰੇਅ ਕਰੋ।",
        tip: "ਬੂਟੇ ਨੂੰ ਰੋਜ਼ਾਨਾ 3-4 ਘੰਟੇ ਹਲਕੀ ਧੁੱਪ ਵਿੱਚ ਜ਼ਰੂਰ ਰੱਖੋ। ਪਾਣੀ ਉਦੋਂ ਹੀ ਦਿਓ ਜਦੋਂ ਗ਼ਮਲੇ ਦੀ ਮਿੱਟੀ ਉੱਪਰੋਂ ਸੁੱਕੀ ਲੱਗੇ।"
      }
    }
  },
  mango: {
    general: {
      severity: "Medium",
      en: {
        name: "Mango Anthracnose leaf spot & PM disease control",
        cause: "High moisture or dew-heavy mornings triggering Colletotrichum fungal spores, damage flower blooms and leaf tissue health.",
        chemical: "Spray Carbendazim 12% + Mancozeb 63% (UPL SAAF) @ 2g per Liter of water or Copper Oxychloride @ 3g per Liter.",
        organic: "Spray 10-day old sour buttermilk (Lassi) diluted 1:10 with fresh water, or cold pressed organic neem oil sprays regularly.",
        tip: "Perform pruning on thick dense branches center to allow direct sunlight inside the tree canopy which naturally kills fungus."
      },
      hi: {
        name: "आम की पत्ती का एन्थ्रेक्नोज धब्बा व खर्रा रोग नियंत्रण",
        cause: "बादल छाए रहने या ओस गिरने से फैलने वाली कवक (Colletotrichum), जिससे पत्तों और बौरों/फूलों पर काले-भूरी सूखी चित्तियां बन जाती हैं।",
        chemical: "फफूंदनाशक दवा यूपीएल साफ (Carbendazim 12% + Mancozeb 63%) @ 2 ग्राम अथवा कॉपर ऑक्सीक्लोराइड @ 3 ग्राम प्रति लीटर पानी का छिड़काव करें।",
        organic: "10 दिन पुरानी खट्टी छाछ / लस्सी को 1:10 अनुपात में पानी में मिलाकर सघन छिड़काव करें, यह पत्तियों को कवक मुक्त बनाती है।",
        tip: "पेड़ के बीच की फालतू घनी टहनियों और सूखी डालियों की कटाई करें जिससे धूप और हवा अंदर तक पहुँच सके।"
      },
      pa: {
        name: "ਅੰਬ ਦੇ ਪੱਤਿਆਂ 'ਤੇ ਲੱਗਣ ਵਾਲਾ ਧੱਬਾ ਰੋਗ",
        cause: "ਹਵਾ ਵਿੱਚ ਜ਼ਿਆਦਾ ਸਿੱਲ੍ਹ ਕਾਰਨ ਉੱਲੀ (Colletotrichum) ਫੈਲਦੀ ਹੈ, ਜਿਸ ਨਾਲ ਪੱਤਿਆਂ ਅਤੇ ਫੁੱਲਾਂ ਕੇਰਿਆਂ 'ਤੇ ਕਾਲੇ-ਭੂਰੇ ਧੱਬੇ ਬਣਦੇ ਹਨ।",
        chemical: "ਉੱਲੀਨਾਸ਼ਕ ਦਵਾਈ ਯੂ.ਪੀ.ਐਲ. ਸਾਫ਼ (SAAF) @ 2 ਗ੍ਰਾਮ ਜਾਂ ਕੋਪਰ ਓਕਸੀਕਲੋਰਾਈਡ @ 3 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਸਪਰੇਅ ਕਰੋ।",
        organic: "ਦੇਸੀ ਖੱਟੀ ਲੱਸੀ ਨੂੰ 1:10 ਦੇ ਹਿਸਾਬ ਨਾਲ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਹਫ਼ਤੇ ਵਿੱਚ ਇੱਕ ਵਾਰ ਛਿੜਕੋ ਜਾਂ ਨਿੰਮ ਦੇ ਤੇਲ ਦੀ ਸਪਰੇਅ ਕਰੋ।",
        tip: "ਅੰਬ ਦੇ ਰੁੱਖ ਵਿਚਾਲੇ ਸੰਘਣੀਆਂ ਟਾਹਣੀਆਂ ਦੀ ਸਫ਼ਾਈ ਕਰੋ ਤਾਂ ਜੋ ਸੂਰਜ ਦੀ ਸਿੱਧੀ ਰੋਸ਼ਨੀ ਅੰਦਰਲੇ ਪੱਤਿਆਂ ਤੱਕ ਪਹੁੰਚ ਸਕੇ।"
      }
    }
  },
  rose: {
    general: {
      severity: "Medium",
      en: {
        name: "Rose Black Spot & Dieback Disease",
        cause: "Fungal pathogen Diplocarpon rosae spreading under high humidity, black spots, or stem dieback where stems turn black from top down.",
        chemical: "Spray Carbendazim + Mancozeb (SAAF) @ 2g per Liter of water or spray Propiconazole (Tilt) @ 1ml per Liter.",
        organic: "Prune affected black shoots from the top, apply turmeric paste on pruned tips, and spray baking soda solution (5g/L water + few drops detergent).",
        tip: "Always irrigate near root bases. Do not wet leaf canopies during evening, as damp foliage is highly prone to black spots."
      },
      hi: {
        name: "गुलाब का काला धब्बा और डाइबैक (Dieback) रोग",
        cause: "अधिक नमी और हवा की कमी के कारण फफूंद (Diplocarpon rosae) का हमला। टहनियां ऊपर से नीचे काले रंग की होकर सूखने लगती हैं।",
        chemical: "गुलाब को बचाने हेतु साफ (SAAF) फफूंदनाशक @ 2 ग्राम अथवा प्रोपिकोनाजोल (टिल्ट) @ 1 मिली प्रति लीटर पानी में मिलाकर पत्ती और तनों पर स्प्रे करें।",
        organic: "संक्रमांकित काली डालियों को ऊपर से थोड़ा नीचे काटें, कटे हुए सिरों पर हल्दी का गाढ़ा पेस्ट लगाएं और बेकिंग सोडा घोल (5 ग्राम + 3 बूंदें तरल साबुन प्रति लीटर) का छिड़काव करें।",
        tip: "सिंचाई केवल गमले की जड़ों के पास करें। पत्तों पर शाम को पानी न छिड़कें, क्योंकि रात भर गीले पत्तों पर काला धब्बा रोग तेजी से फैलता है।"
      },
      pa: {
        name: "ਗੁਲਾਬ ਦੇ ਕਾਲੇ ਧੱਬੇ ਅਤੇ ਡਾਈਬੈਕ (ਡਾਲੀਆਂ ਸੁੱਕਣ) ਦਾ ਰੋਗ",
        cause: "ਹਵਾ ਵਿੱਚ ਸਿੱਲ੍ਹ ਕਾਰਨ ਉੱਲੀ ਦਾ ਫੈਲਣਾ, ਜਿਸ ਨਾਲ ਗੁਲਾਬ ਦੀਆਂ ਟਾਹਣੀਆਂ ਉੱਪਰੋਂ ਸ਼ੁਰੂ ਹੋ ਕੇ ਹੇਠਾਂ ਵੱਲ ਕਾਲੀਆਂ ਹੋ ਕੇ ਸੁੱਕਣ ਲੱਗਦੀਆਂ ਹਨ।",
        chemical: "ਗੁਲਾਬ ਦੇ ਬਚਾਅ ਲਈ ਉੱਲੀਨਾਸ਼ਕ ਸਾਫ਼ (SAAF) @ 2 ਗ੍ਰਾਮ ਜਾਂ ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ (Tilt) @ 1 ਮਿਲੀਲੀਟਰ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਛਿੜਕੋ।",
        organic: "ਸੁੱਕ ਰਹੀਆਂ ਕਾਲੀਆਂ ਟਾਹਣੀਆਂ ਨੂੰ ਕੱਟ ਦਿਓ, ਕੱਟੇ ਹੋਏ ਹਿੱਸੇ 'ਤੇ ਹਲਦੀ ਦਾ ਲੇਪ ਲਗਾਓ ਅਤੇ ਬੇਕਿੰਗ ਸੋਡਾ ਘੋਲ (5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ) ਦਾ ਸਪਰੇਅ ਕਰੋ।",
        tip: "ਗ਼ਮਲੇ ਵਿੱਚ ਪਾਣੀ ਹਮੇਸ਼ਾ ਜੜ੍ਹਾਂ ਦੇ ਕੋਲ ਦਿਓ। ਸ਼ਾਮ ਵੇਲੇ ਪੱਤਿਆਂ ਉੱਪਰ ਪਾਣੀ ਦਾ ਛਿੜਕਾਅ ਨਾ ਕਰੋ।"
      }
    }
  },
  lemon: {
    general: {
      severity: "Medium",
      en: {
        name: "Lemon Citrus Canker / Leaf Miner",
        cause: "Bacterial pathogen Xanthomonas citri creating raised rough lesions on leaves, fruits, and twigs, or citrus leaf miner caterpillars leaving silver trails.",
        chemical: "Spray Streptocycline antibiotic @ 1g per 10 Liters of water combined with Copper Oxychloride @ 3g per Liter of water.",
        organic: "Prune infected twigs, spray neem seed kernel extract (5%) or Neem Oil (10,000 ppm) @ 5ml per Liter water to kill leaf miner larvae.",
        tip: "Feed your lemon tree with Zinc Sulphate and Magnesium Sulphate (each @ 10g/plant) twice a year to promote abundant green canopy and acidic fruit blooms."
      },
      hi: {
        name: "नींबू का सिट्रस कैंकर (Citrus Canker) व पत्ती सुरंगक कीट",
        cause: "बैक्टीरिया (Xanthomonas citri) के कारण पत्तों और नींबू पर खुरदरे पीले-भूरी गांठ बन जाते हैं, या सुरंगी कीड़ा पत्तों के भीतर चांदी जैसी लकीरें बनाता है।",
        chemical: "संक्रमण रोकने हेतु स्ट्रेप्टोसाइक्लिन एंटीबायोटिक @ 1 ग्राम प्रति 10 लीटर पानी में मिलाकर साथ में कॉपर ऑक्सीक्लोराइड @ 3 ग्राम प्रति लीटर मिलाकर स्प्रे करें।",
        organic: "रोगग्रस्त टहनियां काटकर नष्ट करें। सुरंगी कीड़े (Leaf Miner) से सुरक्षा के लिए शुद्ध नीम का तेल @ 5 मिली प्रति लीटर पानी में मिलाकर पत्तों के नीचे स्प्रे करें।",
        tip: "नींबू के पौधे को प्रचुर मात्रा में फल देने हेतु वर्ष में दो बार सूक्ष्म तत्व जैसे जिंक और मैग्नीशियम सल्फेट (प्रत्येक 10 ग्राम) गुड़ाई करके जड़ों में डालें।"
      },
      pa: {
        name: "ਨਿੰਬੂ ਦਾ ਕੋਹੜ ਰੋਗ (Citrus Canker) ਤੇ ਸੁੰਡੀ ਰੋਗ",
        cause: "ਬੈਕਟੀਰੀਆ (Xanthomonas citri) ਕਾਰਨ ਪੱਤਿਆਂ ਅਤੇ ਨਿੰਬੂਆਂ 'ਤੇ ਖੁਰਦਰੇ ਦਾਗ ਬਣ ਜਾਂਦੇ ਹਨ, ਜਾਂ ਸੁੰਡੀ ਪੱਤਿਆਂ ਦੇ ਅੰਦਰ ਚਾਂਦੀ ਰੰਗ ਦੀਆਂ ਲਕੀਰਾਂ ਬਣਾਉਂਦੀ ਹੈ।",
        chemical: "ਇਸ ਦੇ ਇਲਾਜ ਲਈ ਸਟ੍ਰੈਪਟੋਸਾਈਕਲੀਨ @ 1 ਗ੍ਰਾਮ ਨੂੰ 10 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਤਾਂਬੇ ਦੀ ਦਵਾਈ (Copper Oxychloride) 30 ਗ੍ਰਾਮ ਸਮੇਤ ਸਪਰੇਅ ਕਰੋ।",
        organic: "ਰੋਗ ਵਾਲੀਆਂ ਟਾਹਣੀਆਂ ਕੱਟ ਦਿਓ। ਪੱਤੇ ਦੀ ਸੁੰਡੀ (Leaf Miner) ਦੇ ਖ਼ਾਤਮੇ ਲਈ ਨਿੰਮ ਦੇ ਤੇਲ @ 5 ਮਿਲੀਲੀਟਰ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਦੀ ਸਪਰੇਅ ਕਰੋ।",
        tip: "ਨਿੰਬੂ ਦੇ ਬੂਟੇ ਨੂੰ ਸਾਲ ਵਿੱਚ ਦੋ ਵਾਰ ਜਿੰਕ ਅਤੇ ਮੈਗਨੀਸ਼ੀਅਮ ਸਲਫੇਟ (10-10 ਗ੍ਰਾਮ) ਜ਼ਰੂਰ ਦਿਓ, ਇਸ ਨਾਲ ਫਲ ਵੱਧ ਲੱਗਦਾ ਹੈ।"
      }
    }
  },
  guava: {
    general: {
      severity: "High",
      en: {
        name: "Guava Bark Eating Caterpillar / Bronze Leaf Wilt",
        cause: "Borer larvae eating wooden bark tissues of branches, or lack of potash/zinc turning leaves metallic bronze-red leading to wilt.",
        chemical: "Inject Dichlorvos (Nuvan) @ 2ml inside bark holes and seal with wet clay; spray NPK 0:0:50 @ 5g per Liter of water for bronze leaves.",
        organic: "Clean boring tunnels manually with iron wire, apply neem paste on scarred wood, and apply organic neem cake manure @ 500g in root rings.",
        tip: "Do not let clay harden around the guava trunk. Gently till the root zone circularly (Thala pruning) to boost roots aeration."
      },
      hi: {
        name: "अमरूद का छाल खाने वाला कीड़ा व तांबा-रंग पत्ता रोग (Guava Wilt)",
        cause: "छाल खाने वाली सुंडी तने और लकड़ी में सुरंग बनाती है, अथवा पोटाश और जिंक की गंभीर कमी से पत्ते तांबे जैसे लाल-भूरे हो जाते हैं।",
        chemical: "छाल के छिद्रों में डीडीवीपी (dichlorvos) की कुछ बूंदें रूई से भरकर छिद्र को गीली मिट्टी से बंद करें; लाल पत्तों हेतु पोटाश खाद (NPK 0:0:50) @ 5 ग्राम घोलें और स्प्रे करें।",
        organic: "छिद्रों को साफ लोहे के तार से साफ करें, अमरूद के तने पर गोबर-नीम का लेप लगाएं, तथा जड़ों की थाला बनाकर ५०० ग्राम नीम की खली डालें।",
        tip: "अमरूद के मुख्य तने के पास मिट्टी को कड़क न होने दें। समय-समय पर चारों तरफ 'थाला' बनाकर गुड़ाई करें ताकि हवा का आवागमन जड़ों में बना रहे।"
      },
      pa: {
        name: "ਅਮਰੂਦ ਦੀ ਛਿੱਲ ਖਾਣ ਵਾਲੀ ਸੁੰਡੀ ਤੇ ਪੱਤਿਆਂ ਦਾ ਲਾਲ ਹੋਣਾ",
        cause: "ਸੁੰਡੀ ਅਮਰੂਦ ਦੇ ਤਣੇ ਦੇ ਅੰਦਰ ਸੁਰਾਖ ਕਰਦੀ ਹੈ, ਜਾਂ ਪੋਟਾਸ਼ ਦੀ ਘਾਟ ਕਾਰਨ ਪੱਤੇ ਤਾਂਬੇ ਰੰਗ ਦੇ (Bronze) ਹੋ ਕੇ ਸੁੱਕਣ ਲੱਗਦੇ ਹਨ।",
        chemical: "ਤਣੇ ਦੇ ਸੁਰਾਖ਼ ਵਿੱਚ ਰੂੰ ਰਾਹੀਂ ਕੀਟਨਾਸ਼ਕ ਦਵਾਈ ਪਾ ਕੇ ਉੱਪਰੋਂ ਗਿੱਲੀ ਮਿੱਟੀ ਨਾਲ ਬੰਦ ਕਰੋ; ਲਾਲ ਪੱਤਿਆਂ ਲਈ ਪੋਟਾਸ਼ @ 5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਸਪਰੇਅ ਕਰੋ।",
        organic: "ਸੁਰਾਖਾਂ ਨੂੰ ਲੋਹੇ ਦੀ ਤਾਰ ਨਾਲ ਸਾਫ਼ ਕਰੋ ਅਤੇ ਜੜ੍ਹਾਂ ਵਿੱਚ ਨਿੰਮ ਦੀ ਖ਼ਲੜী (Neem Cake) 500 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਬੂਟਾ ਪਾਓ।",
        tip: "ਅਮਰੂਦ ਦੇ ਤਣੇ ਦੁਆਲੇ ਗੋਲ ਥਾਲਾ ਬਣਾ ਕੇ ਗੁਡਾਈ ਕਰੋ, ਇਸ ਨਾਲ ਜੜ੍ਹਾਂ ਦਾ ਵਿਕਾਸ ਵਧੀਆ ਹੁੰਦਾ ਹੈ।"
      }
    }
  },
  apple: {
    general: {
      severity: "High",
      en: {
        name: "Apple Scab / Codling Moth worms",
        cause: "Fungus Venturia inaequalis damaging fruit rinds and leaves, or moth larvae boring circular apple cores and rotting inside tissues.",
        chemical: "Spray Captan 50% WP @ 2g per Liter of water or Mancozeb @ 2.5g per Liter during early petal fall stagings.",
        organic: "Collect and bury fallen scabbed leaves deep into soil compost, and apply cold neem oil (10,000 ppm) @ 5ml/L to control codling moth caterpillars.",
        tip: "Ensure proper winter dormancy pruning. Clean and white-wash apple trunks with lime solution to reflect winter sunburns."
      },
      hi: {
        name: "सेब का पपड़ी रोग (Apple Scab) व कोडलिंग मोथ सुंडी",
        cause: "कवक (Venturia inaequalis) के कारण पत्तियों और सेबों पर भूरे खुरदरे दाग पड़ जाते हैं, या कोडलिंग कीट की सुंडी सेब के अंदर घुसकर फल सड़ा देती है।",
        chemical: "फूलों की पत्तियां गिरते समय कवक नियंत्रण हेतु कैप्टान 50% WP @ 2 ग्राम अथवा मैंकोजेब @ 2.5 ग्राम प्रति लीटर पानी का घोल बनाकर स्प्रे करें।",
        organic: "पेड़ से गिरे संक्रमित पत्तों को इकट्ठा कर मिट्टी में गहरा दबा दें ताकि कवक नष्ट हो सके, तथा सुंडी दमन हेतु नीम बीज अर्क ५% स्प्रे करें।",
        tip: "सर्दिदयों में सेब के मुख्य तने पर चूने के पानी (Lime paint whitening) का पोचारा लगाएं। यह सर्दियों की ठंडी धूप से तने को फटने से रोकता है।"
      },
      pa: {
        name: "ਸੇਬ ਦਾ ਸਕੈਬ (Scab) ਉੱਲੀ ਰੋਗ ਤੇ ਫਲ ਦੀ ਸੁੰਡੀ",
        cause: "ਉੱਲੀ (Venturia inaequalis) ਕਾਰਨ ਸੇਬਾਂ 'ਤੇ ਕਾਲੇ ਖੁਰਦਰੇ ਪੇਪੜੀ ਵਰਗੇ ਦਾਗ ਬਣ ਜਾਂਦੇ ਹਨ, ਜਾਂ ਲਾਰਵਾ ਸੇਬ ਦੇ ਅੰਦਰ ਵੜ ਕੇ ਫਲ ਖ਼ਰਾਬ ਕਰਦਾ ਹੈ।",
        chemical: "ਕੈਪਟਾਨ (Captan 50% WP) @ 2 ਗ੍ਰਾਮ ਜਾਂ ਮੈਨਕੋਜ਼ੇਬ @ 2.5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਫੁੱਲ ਖਿੜਨ ਤੋਂ ਬਾਅਦ ਸਪਰੇਅ ਕਰੋ।",
        organic: "ਕਰੇ ਹੋਏ ਖ਼ਰਾਬ ਪੱਤਿਆਂ ਅਤੇ ਫਲਾਂ ਨੂੰ ਜੜ੍ਹਾਂ ਤੋਂ ਦੂਰ ਦੱਬ ਦਿਓ, ਅਤੇ ਕੋਡਲਿੰਗ ਕੀੜੇ ਤੋਂ ਬਚਾਅ ਲਈ ਨਿੰਮ ਦੇ ਘੋਲ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
        tip: "ਸਰਦੀਆਂ ਵਿੱਚ ਸੇਬ ਦੇ ਤਣੇ 'ਤੇ ਚੂਨਾ (Lime wash) ਫੇਰੋ, ਜਿਸ ਨਾਲ ਧੁੱਪ-ਪਾਲੇ ਤੋਂ ਤਣੇ ਦਾ ਬਚਾਅ ਹੁੰਦਾ ਹੈ।"
      }
    }
  },
  tulsi: {
    general: {
      severity: "Low",
      en: {
        name: "Tulsi Leaf Black Spot / Root Rot",
        cause: "Humid oversaturation of potting soil, or fungal spores causing leaves to develop black spots and drop off during rainy seasons.",
        chemical: "Highly discouraged for holy plants. If catastrophic, spray extremely low toxic Copper Oxychloride @ 1.5g per Liter water strictly on leaves.",
        organic: "Spray 10% pure organic dairy Milk + Water dilution, or spray fresh turmeric and spray neem liquid mix on black foliage zones.",
        tip: "Tulsi is highly vulnerable to waterlogging. Keep the pot in full sun and pinch off black flower spikes (Manjari) regularly to prompt thick bushier growings."
      },
      hi: {
        name: "तुलसी का पत्ता काली चित्ती रोग, जड़ सड़न व मंजरी रोग",
        cause: "अत्यधिक जल भराव, पानी का निकास अवरुद्ध होना या हवा की नमी के कारण पत्तियों पर काली फफूंद चित्तियां बैठना और पत्ते गिरना।",
        chemical: "पवित्र तुलसी पौधे पर रसायनिक ज़हर डालने से बचें। गंभीर स्थिति में केवल न्यूनतम कॉपर ऑक्सीक्लोराइड फफूंदनाशक का हल्का छिड़काव @ 1.5 ग्राम/L पानी करें।",
        organic: "हल्दी अर्क और दालचीनी का पानी स्प्रे करें। कवकनाशक उपाय हेतु 10% गाय के कच्चे दूध को पानी में मिलाकर पत्तियों पर छिड़कें।",
        tip: "तुलसी में जलनिकासी अत्यंत आवश्यक है। समय-समय पर मंजरी (काले फूल मंजरी) को चुटकी से काटकर अलग करते रहें, इससे तुलसी घनी और हरी बनी रहेगी।"
      },
      pa: {
        name: "ਤੁਲਸੀ ਦੇ ਪੱਤਿਆਂ 'ਤੇ ਕਾਲੇ ਧੱਬੇ ਤੇ ਜੜ੍ਹ ਗਲਣ ਦਾ ਰੋਗ",
        cause: "ਗ਼ਮਲੇ ਵਿੱਚ ਬਹੁਤੀ ਨਮੀ ਜਾਂ ਪਾਣੀ ਜਮ੍ਹਾ ਰਹਿਣ ਨਾਲ ਤੁਲਸੀ ਦੇ ਪੱਤੇ ਕਾਲੇ ਹੋ ਕੇ ਝੜਨ ਲੱਗਦੇ ਹਨ।",
        chemical: "ਪਵਿਤੱਰ ਬੂਟੇ 'ਤੇ ਰਸਾਇਣਕ ਦਵਾਈਆਂ ਪਾਉਣ ਤੋਂ ਬਚੋ। ਜੇਕਰ ਬਹੁਤ ਜ਼ਰူਰੀ ਹੋਵੇ ਤਾਂ ਹਲਕੀ ਕਾਪਰ ਦਵਾਈ @ 1.5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਹੀ ਵਰਤੋ।",
        organic: "10% ਗਾਂ ਦੇ ਕੱਚੇ ਦੁੱਧ ਨੂੰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਪੱਤਿਆਂ 'ਤੇ ਛਿੜਕੋ ਜਾਂ ਹਲਦੀ ਵਾਲੇ ਪਾਣੀ ਦਾ ਸਪਰੇਅ ਕਰੋ।",
        tip: "ਤੁਲਸੀ ਨੂੰ ਹਮੇਸ਼ਾ ਚੰਗੀ ਧੁੱਪ ਵਿੱਚ ਰੱਖੋ। ਤੁਲਸੀ ਦੀਆਂ ਮੰਜਰੀਆਂ (ਬੀਜਾਂ) ਨੂੰ ਲਗਾਤਾਰ ਉੱਪਰੋਂ ਤੋੜਦੇ ਰਹੋ, ਇਸ ਨਾਲ ਤੁਲਸੀ ਸੰਘਣੀ ਤੇ ਹਰੀ ਰਹੇਗੀ।"
      }
    }
  },
  marigold: {
    general: {
      severity: "Low",
      en: {
        name: "Marigold Bud Borer / Powdery Mildew",
        cause: "Bud boring caterpillars cutting flower buds, or white powdery fungal bloom covering leave surfaces during cold humid night conditions.",
        chemical: "Spray Chlorantraniliprole (Coragen) @ 0.3ml per Liter of water or Spray Carbendazim (Bavistin) @ 2g per Liter.",
        organic: "Spray Neem Oil (10,000 ppm) @ 5ml per Liter water with liquid emulsifier, or spray cow urine + water mix (1:10 ratio) on powdery foliage.",
        tip: "Pinch off first early flower buds to encourage aggressive lateral branching. This multiplies flower yield threefold."
      },
      hi: {
        name: "गेंदे की कलियों का छेदक कीड़ा व सफेद चूर्ण फफूंद रोग",
        cause: "छोटा कैटरपिलर कलियों के अंदर घुसकर फूल को चौपट कर देता है, या ठंड व कोहरे के दिनों में पत्तों पर सफेद रंग का आटा जैसा पाउडर जम जाता है।",
        chemical: "सुंडी नियंत्रण हेतु कोराजन @ 5 मिली अथवा सफेद चूर्ण कवकनाशक बाविस्टिन (Bavistin) @ 30 ग्राम प्रति 15 लीटर पंप घोलें व स्प्रे करें।",
        organic: "नीम का काढ़ा ८% पत्तों पर स्प्रे करें, अथवा गोमूत्र को पानी में (1:10) मिलाकर छिड़कें। यह पत्तियों की फफूंद को समाप्त कर देता है।",
        tip: "शुरुआती खिलने वाली ३-४ कलियों को ऊपर से तोड़ दें (Pinching)। इससे गेंदे का पौधा चारों तरफ घनी डालियां निकालेगा और फूलों की संख्या 3 गुना बढ़ जाएगी।"
      },
      pa: {
        name: "ਗੇਂਦੇ ਦੀਆਂ ਕਲੀਆਂ ਦੀ ਸੁੰਡੀ ਤੇ ਚਿੱਟੀ ਉੱਲੀ ਦਾ ਰੋਗ",
        cause: "ਸੁੰਡੀ ਕਲੀਆਂ ਦੇ ਅੰਦਰ ਵੜ ਕੇ ਫੁੱਲ ਖ਼ਰਾਬ ਕਰਦੀ ਹੈ, ਜਾਂ ਸਰਦੀਆਂ ਦੇ ਮੌਸਮ ਵਿੱਚ ਪੱਤਿਆਂ 'ਤੇ ਚਿੱਟਾ ਪਾਊਡਰ (Powdery Mildew) ਜਮ੍ਹਾ ਹੋ ਜਾਂਦਾ ਹੈ।",
        chemical: "ਸਪਰੇਅ ਕੋਰਾਜਨ @ 0.3 ਮਿਲੀਲੀਟਰ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਜਾਂ ਬਾਸਫ਼/ਬਾਵਿਸਟਿਨ @ 2 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਛਿੜਕੋ।",
        organic: "ਗੇਂਦੇ ਦੇ ਬੂਟੇ 'ਤੇ ਦੇਸੀ ਗਊ-ਮੂਤਰ ਅਤੇ ਪਾਣੀ (1:10) ਮਿਲਾ ਕੇ ਛਿੜਕਾਅ ਕਰੋ, ਇਹ ਚਿੱਟੀ ਉੱਲੀ ਲਈ ਬਹੁਤ ਲਾਭਦਾਇਕ ਜੈਵਿਕ ਦਵਾਈ ਹੈ।",
        tip: "ਗੇਂਦੇ ਦੀ ਬੁਸ਼ੀ ਗ੍ਰੋਥ ਲਈ ਸ਼ੁਰੂਆਤੀ ਕਲੀਆਂ ਨੂੰ ਉੱਪਰੋਂ ਤੋੜ ਦਿਓ (Pinching), ਇਸ ਨਾਲ ਫੁੱਲ ਬਹੁਤ ਜ਼ਿਆਦਾ ਆਉਣਗੇ।"
      }
    }
  },
  aloe: {
    general: {
      severity: "Low",
      en: {
        name: "Aloe Vera Leaf Soft Rot / Tip Burning",
        cause: "Over-watering and water stagnation inside soil rotting aloe leaf root bases and making cells spongy, dark, and soggy.",
        chemical: "Chemical sprays are highly toxic for juicy Aloe. Drain soil, remove soggy leaves, and spray Copper Oxychloride @ 1.5g per Liter ONLY to soil base.",
        organic: "Limit watering completely. Repot in highly porous sandy soil and spray organic cinnamon/turmeric water around root collars.",
        tip: "Aloe vera is a desert succulent. It needs zero maintenance and very little water. Let the pot soil dry brick-hard before watering again."
      },
      hi: {
        name: "एलोवेरा पत्ती का गलना व सिरा सूखने का रोग",
        cause: "गमले में पानी का ठहराव होना जिससे एलोवेरा की मोटी रसदार पत्तियां जड़ों से सड़ने लगती हैं और भूरी-काली होकर लटक जाती हैं।",
        chemical: "रसायन प्रयोग से बचें। सड़न रोकने हेतु मिट्टी में अतिरिक्त नमी सुखाएं और जड़ों के पास आंशिक कॉपर ऑक्सीक्लोराइड पानी @ 2 ग्राम/ली छिड़कें।",
        organic: "पानी देना पूर्णतः बंद करें। एलोवेरा को गमले से निकालें, सड़े हुए पत्तों को काटें, तथा ६0% रेत और ४0% मिट्टी मिलाकर नए गमले में लगाएं।",
        tip: "एलोवेरा एक रेगिस्तानी पौधा है। इसे बहुत कम पानी की आवश्यकता होती है। जब मिट्टी कड़क सूखी दिखे, तभी हल्का पानी जड़ों में स्प्रे करें।"
      },
      pa: {
        name: "ਐਲੋਵੇਰਾ ਦੇ ਪੱਤਿਆਂ ਦਾ ਗਲਣਾ ਤੇ ਨੋਕਾਂ ਸੁੱਕਣੀਆਂ",
        cause: "ਮਿੱਟੀ ਵਿੱਚ ਪਾਣੀ ਖੜ੍ਹਨ ਨਾਲ ਐਲੋਵੇਰਾ ਦੇ ਮੋਟੇ ਪੱਤੇ ਜੜ੍ਹ ਕੋਲੋਂ ਗਲ ਕੇ ਪੀਲੇ ਤੇ ਕਾਲੇ ਹੋਣ ਲੱਗਦੇ ਹਨ।",
        chemical: "ਐਲੋਵੇਰਾ ਜੂਸ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ, ਰਸਾਇਣਾਂ ਤੋਂ ਬਚੋ। ਜੜ੍ਹ ਕੋਲ ਮਿੱਟੀ ਵਿੱਚ ਹਲਕੀ ਕਾਪਰ ਦਵਾਈ ਦਾ ਛਿੜਕਾਅ ਹੀ ਕਰੋ।",
        organic: "ਪਾਣੀ ਦੇਣਾ ਤੁਰੰਤ ਬੰਦ ਕਰੋ। ਬੂਟੇ ਨੂੰ ਕੱਢ ਕੇ ਰੇਤਲੀ ਮਿੱਟੀ (60% ਰੇਤ, 40% ਮਿੱਟੀ) ਵਿੱਚ ਦੁਬਾਰา ਲਗਾਓ।",
        tip: "ਐਲੋਵੇਰਾ ਮਾਰੂਥਲ ਦਾ ਬੂਟਾ ਹੈ। ਇਸਨੂੰ ਬਹੁਤ ਘੱਟ ਪਾਣੀ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ। ਪਾਣੀ ਉਦੋਂ ਹੀ ਦਿਓ ਜਦੋਂ ਮਿੱਟੀ ਬਿਲਕੁਲ ਸੁੱਕ ਜਾਵੇ।"
      }
    }
  }
};

// Extremely robust database for general conditions to ensure custom fallback when other matches miss
const GENERAL_PROBLEMS: Record<string, SeverityData> = {
  rotting: {
    severity: "High",
    en: {
      name: "Root Rot & Stem Decaying disease",
      cause: "Saturated un-drained soils triggering soil-borne pathogenic water molds like Phytophthora or Pythium, leading to root rot and wilting.",
      chemical: "Drench soil with Metalaxyl 8% + Mancozeb 64% (Syngenta Ridomil Gold) @ 2.5g per Liter of water directly into the root zones of infected plants.",
      organic: "Inoculate the soil with beneficial antagonistic fungi like Trichoderma Viride / Harzianum bio-agent @ 10g per Liter of water combined with neem cake manure.",
      tip: "Level your land perfectly using laser levelling to avoid low-lying points where irrigation water stagnates, drowning the root rootlets."
    },
    hi: {
      name: "जड़ व तना सड़न रोग (Root/Stem Rot)",
      cause: "खेत में पानी का निकास न होने से जड़ें सड़ने लगती हैं और मिट्टी में मौजूद कवक जैसे फाइटोफ्थोरा जड़ों पर आक्रमण कर पौधों का भोजन प्रवाह रोक देते हैं।",
      chemical: "भूमि शोधन हेतु मेन्कोजेब युक्त फफूंदनाशक या मेटलॉक्सिल (सिंजेंटा रिडोमिल गोल्ड) @ 2.5 ग्राम प्रति लीटर पानी में घोलकर मुख्य प्रभावित तनों और जड़ों पर ड्रेन्चिंग करें।",
      organic: "बुआई से पहले या सिंचाई के समय ट्राइकोडर्मा विरिडी (Trichoderma viride) जैव-कवकनाशक पाउडर @ 5 ग्राम प्रति लीटर पानी में मिलाकर जड़ों के पास नमी दें।",
      tip: "खेत को लेज़र लैंड लेवलर द्वारा समतल रखें ताकि किसी एक जगह पानी का भराव न हो। जलजमाव ही जड़ों के सड़ने की सबसे बड़ी वजह है।"
    },
    pa: {
      name: "ਜੜ੍ਹ ਤੇ ਤਣਾ ਗਲਣ ਰੋਗ (Rotting Problem)",
      cause: "ਜ਼ਮੀਨ ਵਿੱਚ ਪਾਣੀ ਦਾ ਸਹੀ ਨਿਕਾਸ ਨਾ ਹੋਣ ਕਾਰਨ ਜੜ੍ਹਾਂ ਨੂੰ ਹਵਾ ਨਹੀਂ ਮਿਲਦੀ ਅਤੇ ਉੱਲੀ ਜੜ੍ਹਾਂ ਨੂੰ ਕੁਦਰਤੀ ਰੂਪ ਵਿੱਚ ਗਾਲ ਦਿੰਦੀ ਹੈ, ਜਿਸ ਨਾਲ ਬੂਟੇ ਸੁੱਕ ਜਾਂਦੇ ਹਨ।",
      chemical: "ਗਲਣ ਰੋਗ ਦੇ ਬਚਾਅ ਲਈ ਮੈਟਾਲੈਕਸਿਲ+ਮੈਨਕੋਜ਼ੇਬ (Ridomil Gold) @ 2.5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਜੜ੍ਹਾਂ ਦੇ ਨੇੜੇ ਪਾਓ (Drenching)।",
      organic: "ਟਰਾਈਕੋਡਰਮਾ ਵਿਰਡੀ (Trichoderma Viride) ਜੈਵਿਕ ਪਾਊਡਰ @ 1 ਕਿੱਲੋ ਨੂੰ 100 ਕਿੱਲੋ ਦੇਸੀ ਰੂੜੀ ਦੀ ਖਾਦ ਵਿੱਚ ਮਿਲਾ ਕੇ ਪ੍ਰਤੀ ਏਕੜ ਜ਼ਮੀਨ ਵਿੱਚ ਪਾਓ।",
      tip: "ਜ਼ਮੀਨ ਤਿਆਰ ਕਰਦੇ ਸਮੇਂ ਹਮੇਸ਼ਾ ਚੰਗਾ ਨਿਕਾਸ ਰੱਖੋ ਅਤੇ ਰੂੜੀ ਦੀ ਖਾਦ ਚੰਗੀ ਤਰ੍ਹਾਂ ਗਲੀ-ਸੜੀ ਹੋਈ ਹੀ ਵਰਤੋ।"
    }
  },
  fertilizer: {
    severity: "Low",
    en: {
      name: "Fertilizer Schedule & Nutrition Guidelines",
      cause: "An imbalance in macro N-P-K elements or skipping key secondary elements (Sulfur, Zinc and Iron) needed for green photosynthesis and strong grain yield.",
      chemical: "Apply balanced NPK chemical ratio (e.g., 18:18:18). Top-dress Urea in three even dynamic splits: early tillering, active jointing, and initial grain filling.",
      organic: "Broadcast home-fermented Jeevamrut liquid organic manure (10kg cow-dung + 10L urine + 2kg jaggery per acre) with irrigation canal water once every fortnight.",
      tip: "Conduct a physical soil test to secure a certified Soil Health Card. This stops you from spending unnecessary money on excess over-fertilizers."
    },
    hi: {
      name: "संतुलित खाद प्रबंधन व पोषण चार्ट",
      cause: "खेत में जिंक, सल्फर या बोरोन की कमी होने या लगातार सिर्फ यूरिया खाद की अत्यधिक मात्रा डालने से मिट्टी कड़क और बंजर होने लगती है।",
      chemical: "केवल यूरिया न डालें। बुआई के समय डीएपी (DAP), और यूरिया को 3 बराबर भागों में बांटकर सिंचाई के तुरंत बाद (पहली व दूसरी सिंचाई पर) खेत में समान रूप से बिखेरें।",
      organic: "जीवामृत टॉनिक बनाएं: 10 किलो गाय का गोबर, 10 लीटर गोमूत्र, 2 किलो गुड़, 2 किलो बेसन को 200 लीटर पानी में 7 दिन सड़ाकर सिंचाई के पानी के साथ खेत में घोलकर बहाएं।",
      tip: "मिट्टी की जांच (Soil Test) के आधार पर ही डीएपी या यूरिया डालें। इससे बेकार खर्च बचेगा और भूमि की प्राकृतिक सुधार शक्ति बनी रहेगी।"
    },
    pa: {
      name: "ਖਾਦ ਦੀ ਸਹੀ ਵਰਤੋਂ ਤੇ ਖੁਰਾਕੀ ਚਾਰਟ",
      cause: "ਜ਼ਮੀਨ ਵਿੱਚ ਲਗਾਤਾਰ ਸਿਰਫ਼ ਯੂਰੀਆ ਪਾਉਣ ਨਾਲ ਮਿੱਟੀ ਸਖ਼ਤ ਹੋ ਜਾਂਦੀ ਹੈ ਅਤੇ ਜਿੰਕ, ਸਲਫ਼ਰ ਜਾਂ ਲੋਹੇ ਵਰਗੇ ਜ਼ਰੂਰੀ ਤੱਤਾਂ ਦੀ ਕਮੀ ਹੋ ਜਾਂਦੀ ਹੈ।",
      chemical: "ਯੂਰੀਆ ਖਾਦ ਹਮੇਸ਼ਾ ਕਿਸ਼ਤਾਂ ਵਿੱਚ ਪਾਓ (ਆਮ ਤੌਰ 'ਤੇ 3 ਵਾਰ)। ਬਿਜਾਈ ਵੇਲੇ ਸੁਪਰ ਫਾਸਫੇਟ ਜਾਂ ਡੀ.ਏ.ਪੀ. (DAP) ਅਤੇ ਪੋਟਾਸ਼ ਦਾ ਸੰਤੁਲਿਤ ਹਿਸਾਬ ਵਰਤੋ।",
      organic: "ਦੇਸੀ ਜੀਵਾਮ੍ਰਿਤ: 10 ਕਿੱਲੋ ਗੋਬਰ, 10 ਲੀਟਰ ਗਊ-ਮੂਤਰ, 2 ਕਿੱਲੋ ਗੁੜ, 2 ਕਿੱਲੋ ਬੇਸਣ ਨੂੰ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਛਾਵੇਂ ਰੱਖੋ ਅਤੇ ਸਿੰਚਾਈ ਨਾਲ ਖੇਤ ਵਿੱਚ ਵਹਾਓ।",
      tip: "ਜ਼ਮੀਨ ਦੀ ਪਰਖ (Soil Testing) ਨਿਯਮਿਤ ਤੌਰ 'ਤੇ ਕਰਵਾਓ, ਤਾਂ ਜੋ ਬੇਲੋੜੀਆਂ ਖਾਦਾਂ ਦਾ ਖਰਚਾ ਬਚਾਇਆ ਜਾ ਸਕੇ।"
    }
  },
  mandi: {
    severity: "Low",
    en: {
      name: "Mandi Market Pricing & Strategic Grains Sales",
      cause: "Fluctuations in public demand margins and high moisture content deductions enforced by purchase merchants during damp harvesting seasons.",
      chemical: "Avoid chemical crop drying. Always sun-dry your harvested grains on open concrete sheets until the moisture level drops strictly below 12% to secure maximum MSP rates.",
      organic: "Download and register on the e-NAM (National Agriculture Market) digitized public platform and secure online dynamic, non-local merchant bids directly.",
      tip: "Ensure your weight scales are calibrated correctly, demand J-Form Sale proof, and avoid middlemen cutting your legal profit percentages."
    },
    hi: {
      name: "मंडी बाजार भाव व फसल बिक्री रणनीति",
      cause: "फसल में नमी (Moisture) अधिक होने से आढ़ती कौड़ियों के दाम में फसल खरीदते हैं या मनमाना डिस्काउंट काटते हैं, जो कि किसान के नुकसान की बड़ी वजह है।",
      chemical: "फसल काटने के बाद दानों को धूप में अच्छे से सुखाएं ताकि नमी का प्रतिशत 12% से नीचे रहे। सूखी फसल लाने पर आपको सरकार द्वारा तय घोषित न्यूनतम समर्थन मूल्य (MSP) पूरा मिलेगा।",
      organic: "आप अपनी फसल को भारत सरकार के डिजिटल पोर्टल e-NAM (ई-नाम) पर दर्ज करें। यहाँ देश भर के खरीदार आपकी फसल की बोली लगाएंगे और आपको सर्वाधिक मूल्य प्राप्त होगा।",
      tip: "मंडी में हमेशा डिजिटल तौल कांटे पर ही तुलाई करवाएं। आढ़ती से अपनी फसल की 'जे-फॉर्म' (J-Form) रसीद अवश्य मांगें जो आपकी कानूनी बिक्री का मूल प्रमाण है।"
    },
    pa: {
      name: "ਅਨਾਜ ਮੰਡੀ ਰੇਟ ਅਤੇ ਫ਼ਸਲ ਵੇਚਣ ਦੀ ਨੀਤੀ",
      cause: "ਕੱਟੀ ਹੋਈ ਫ਼ਸਲ ਵਿੱਚ ਸਿੱੱਲ੍ਹ (Moisture) ਜ਼ਿਆਦਾ ਹੋਣ ਕਾਰਨ ਮੰਡੀ ਵਿੱਚ ਆੜ੍ਹਤੀ ਰੇਟ ਘਟਾ ਦਿੰਦੇ ਹਨ, ਜਿਸ ਨਾਲ ਕਿਸਾਨ ਦਾ ਵੱਡਾ ਨੁਕਸਾਨ ਹੁੰਦਾ ਹੈ।",
      chemical: "ਵੱਢੀ ਹੋਈ ਫਸਲ ਨੂੰ ਮੰਡੀ ਲਿਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਧੁੱਪ ਵਿੱਚ ਸੁਕਾਓ ਤਾਂ ਜੋ ਨਮੀ ਦਾ ਪੱਧਰ 12% ਤੋਂ ਘੱਟ ਹੋਵੇ, ਇਸ ਨਾਲ ਸਰਕਾਰੀ ਐਮ.ਐਸ.ਪੀ (MSP) ਪੂਰਾ ਮਿਲੇਗਾ।",
      organic: "ਆਪਣੀ ਫਸਲ ਨੂੰ ਵੇਚਣ ਲਈ ਈ-ਨਾਮ (e-NAM) ਡਿਜੀਟਲ ਪਲੇਟਫਾਰਮ ਦੀ ਵਰਤੋਂ ਕਰੋ, ਜਿਸ ਨਾਲ ਤੁਸੀਂ ਸਿੱਧਾ ਬਾਹਰਲੇ ਵਪਾਰੀਆਂ ਨੂੰ ਵਧੀਆ ਰੇਟ 'ਤੇ ਫਸਲ ਵੇਚ ਸਕਦੇ ਹੋ।",
      tip: "ਤੋਲ ਕਰਵਾਉਣ ਵੇਲੇ ਕੰਢੇ ਦੀ ਜਾਂਚ ਕਰੋ। ਆਪਣੀ ਫਸਲ ਦੀ ਪੱਕੀ ਆੜ੍ਹਤ ਰਸੀਦ (J-Form) ਆੜ੍ਹਤੀਏ ਤੋਂ ਜ਼ਰੂਰ ਲਓ।"
    }
  },
  dairy: {
    severity: "High",
    en: {
      name: "Dairy Cattle Care & Udder Mastitis Relief",
      cause: "Pathogenic bacteria entering the teat sphincter canals due to wet, muddy stall floors, or mineral trace element gaps in heavy lactating animals.",
      chemical: "Drench the infected teats with Mastiguard/Pendistrin infusion kit, or feed 100ml Ostovet Calcium daily with 50g Agrimin Forte mineral mixture.",
      organic: "Prepare Ayurvedic Cattle Galactagogue Laddus: Boil 200g of Fenugreek (Methi) seeds, mix with 100g fennel, 50g turmeric, and 200g jaggery in mustard oil. Feed every evening.",
      tip: "Do not let animals sit down immediately for 20 minutes after milking, as teat canals remain open. Feed them green fodder immediately to keep them standing."
    },
    hi: {
      name: "डेयरी पशुपालन व थनैला संक्रमण निवारण",
      cause: "दूध निकालने के तुरंत बाद थनों के छिद्र खुले रहते हैं, यदि पशु गोबर-गीले फर्श पर बैठ जाए तो खतरनाक बैक्टीरिया थनों में घुसकर थनैला (Mastitis) रोग फैलाते हैं।",
      chemical: "दूध की मात्रा व गाढ़ापन बढ़ाने हेतु ऑस्टोवेट कैल्शियम @ 100 मिली और एग्रीमिन फोर्ट मिनरल मिक्चर @ 50 ग्राम रोज चारे में दें। थनैला हेतु मैस्टिगाड ट्यूब थन में चढ़वाएं।",
      organic: "दूध बढ़ाने का लड्डू: 200 ग्राम उबाली मेथी, 100 ग्राम सौंफ, 50 ग्राम हल्दी और 200 ग्राम गुड़ को सरसों के तेल में सानकर लड्डू बनायें और शाम को रोज़ाना पशु को खिलाएं।",
      tip: "दूध दुहने के तुरंत बाद 20 मिनट तक गाय या भैंस को जमीन पर बैठने न दें। उनके आगे तुरंत हरा चारा डाल दें, ताकि वे खड़ी रहकर चारा खाएं और थनों के छिद्र बंद हो जाएं।"
    },
    pa: {
      name: "ਡੇਅਰੀ ਪਸ਼ੂਪਾਲਣ ਤੇ ਥਣੈਲਾ ਰੋਗ ਦਾ ਇਲਾਜ",
      cause: "ਦੁੱਧ ਚੋਣ ਤੋਂ ਬਾਅਦ ਥਣਾਂ ਦੇ ਸੁਰਾਖ ਖੁੱਲ੍ਹੇ ਹੁੰਦੇ ਹਨ, ਅਤੇ ਗੰਦੀ ਥਾਂ 'ਤੇ ਬੈਠਣ ਨਾਲ ਨੁਕਸਾਨਦੇਹ ਬੈਕਟੀਰੀਆ ਥਣਾਂ ਰਾਹੀਂ ਅੰਦਰ ਜਾ ਕੇ ਥਣੈਲਾ (Mastitis) ਰੋਗ ਫੈਲਾਉਂਦੇ ਹਨ।",
      chemical: "ਪਸ਼ੂਆਂ ਵਿੱਚ ਦੁੱਧ ਵਧਾਉਣ ਲਈ ਓਸਟੋਵੇਟ ਕੈਲਸ਼ੀਅਮ @ 100 ਮਿਲੀਲੀਟਰ ਅਤੇ ਐਗਰੀਮਿਨ ਫੋਰਟ ਮਿਨਰਲ ਪਾਊਡਰ @ 50 ਗ੍ਰਾਮ ਰੋਜ਼ ਦਿਓ। ਥਣੈਲਾ ਲਈ ਮੈਸਟੀਗਾਰਡ ਟਿਊਬ ਵਰਤੋ।",
      organic: "ਦੁੱਧ ਵਧਾਉਣ ਲਈ ਦੇਸੀ ਪਿੰਨੀ: 250 ਗ੍ਰਾਮ ਉਬਾਲੀ ਮੇਥੀ, 100 ਗ੍ਰਾਮ ਸੌਂਫ, 100 ਗ੍ਰਾਮ ਹਲਦੀ ਪਾਊਡਰ ਅਤੇ 250 ਗ੍ਰਾਮ ਗੁੜ ਨੂੰ ਸਰ੍ਹੋਂ ਦੇ ਤੇਲ ਵਿੱਚ ਮਿਲਾ ਕੇ ਰੋਜ਼ ਸ਼ਾਮ ਨੂੰ ਦਿਓ।",
      tip: "ਦੁੱਧ ਚੋਣ ਤੋਂ ਬਾਅਦ ਪਸ਼ੂ ਨੂੰ ਘੱਟੋ-ਘੱਟ 20 ਮਿੰਟ ਤੱਕ ਬੈਠਣ ਨਾ ਦਿਓ। ਉਸਦੇ ਅੱਗੇ ਹਰਾ ਚਾਰਾ ਸੁੱਟ ਦਿਓ ਤਾਂ ਜੋ ਉਹ ਖੜ੍ਹਾ ਰਹੇ ਅਤੇ ਥਣਾਂ ਦੇ ਸੁਰਾਖ ਬੰਦ ਹੋ ਸਕਣ।"
    }
  },
  yellowing: {
    severity: "Medium",
    en: {
      name: "General Leaf Yellowing / Nutrient Deficiencies",
      cause: "Typically triggered by lack of active Nitrogen (Urea) or Zinc trace minerals, or over-watering which blocks root respiration.",
      chemical: "Broad-spray NPK 19:19:19 @ 5g per Liter of water combined with Zinc Sulphate (21%) @ 3g per Liter to restore immediate leafy green color.",
      organic: "Apply 10-day old highly acidic sour buttermilk (Lassi) diluted 1:10 with water as a foliar spray. This provides helpful organic lactic acids and trace nutrients.",
      tip: "Avoid clay stagnation or water pooling around root zones. Let soil surface dry slightly between waterings to allow oxygen uptake."
    },
    hi: {
      name: "पत्तियों का पीलापन / पोषण की कमी",
      cause: "आमतौर पर नाइट्रोजन (यूरिया), जिंक या लोह तत्वों की कमी से होता है, या फिर मिट्टी में लगातार अधिक पानी रुकने से जड़ें हवा नहीं ले पातीं।",
      chemical: "तत्काल पीलापन दूर करने हेतु यूरिया का हल्का बुरकाव करें अथवा एनपीके (NPK 19:19:19) @ 5 ग्राम और जिंक सल्फेट 21% @ 3 ग्राम प्रति लीटर पानी का घोल बनाकर स्प्रे करें।",
      organic: "10 दिन पुरानी खट्टी छाछ / लस्सी को 1:10 के अनुपात में ताज़े पानी के साथ फसल पर छिड़कें। यह पत्तों की कोशिकाओं को सक्रिय कर हरा रंग लौटाता है।",
      tip: "क्यारियों में अतिरिक्त पानी कभी जमा न होने दें। फसल की समय-समय पर गुड़ाई करें ताकि जड़ों को भरपूर मात्रा में ऑक्सीजन प्राप्त हो सके।"
    },
    pa: {
      name: "ਪੱਤਿਆਂ ਦਾ ਪੀਲਾਪਨ / ਖੁਰਾਕੀ ਤੱਤਾਂ ਦੀ ਕਮੀ",
      cause: "ਕਣਕ ਜਾਂ ਹੋਰ ਫਸਲਾਂ ਵਿੱਚ ਪੀਲਾਪਨ ਨਾਈਟ੍ਰੋਜਨ (ਯੂਰੀਆ), ਜਿੰਕ ਜਾਂ ਲੋਹੇ ਦੀ ਘਾਟ ਕਾਰਨ ਜਾਂ ਜ਼ਿਆਦਾ ਪਾਣੀ ਲੱਗਣ ਕਾਰਨ ਜੜ੍ਹਾਂ ਦੇ ਦੱਬਣ ਨਾਲ ਹੁੰਦਾ ਹੈ।",
      chemical: "ਇਸ ਦੇ ਇਲਾਜ ਲਈ ਐਨ.ਪੀ.ਕੇ. (NPK 19:19:19) @ 1 ਕਿੱਲੋ ਅਤੇ ਜਿੰਕ ਸਲਫੇਟ @ 500 ਗ੍ਰਾਮ ਨੂੰ 150 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਪ੍ਰਤੀ ਏਕੜ ਸਪਰੇਅ ਕਰੋ।",
      organic: "10 ਦਿਨ ਪੁਰਾਣੀ ਖੱਟੀ ਲੱਸੀ ਲੂਣ ਤੋਂ ਬਿਨਾਂ 2 ਲੀਟਰ ਨੂੰ 150 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਛਿੜਕੋ। ਇਹ ਇੱਕ ਕੁਦਰਤੀ ਨਾਈਟ੍ਰੋਜਨ ਅਤੇ ਫੰਗੀਸਾਈਡ ਬੂਸਟਰ ਹੈ।",
      tip: "ਫਸਲ ਨੂੰ ਭਾਰੀ ਪਾਣੀ ਲਗਾਉਣ ਤੋਂ ਬਚੋ। ਹਲਕੀ ਸਿੰਚਾਈ ਹਮੇਸ਼ਾ ਫਸਲ ਦੇ ਵਾਧੇ ਲਈ ਲਾਭਦਾਇਕ ਮੰਨੀ ਜਾਂਦੀ ਹੈ।"
    }
  },
  insects: {
    severity: "High",
    en: {
      name: "Insect Invasion (Worms & Sucking Pests)",
      cause: "Sap-sucking vectors like Whiteflies, Aphids, Thrips, or chewing insects like Bollworms and caterpillars feeding on vital vascular tissues.",
      chemical: "Spray systemic Imidacloprid 17.8% SL @ 0.5ml per Liter of water or FMC Coragen (Chlorantraniliprole) @ 0.4ml per Liter in case of caterpillar/bollworm outbreak.",
      organic: "Drench with Cold Pressed Neem Oil (10,000 ppm) @ 5ml per Liter emulsified with 3-4 drops of simple liquid soap, or apply organic garlic-chilli spray.",
      tip: "Clean weeds, grasses and dense undergrowth on farm dikes to eliminate alternative hiding hosts of destructive insects."
    },
    hi: {
      name: "कीट व सुंडी हमला (Insects / Worms)",
      cause: "चूसने वाले कीट (सफेद मक्खी, चेपा, थ्रिप्स) पत्तों का रस निचोड़ते हैं और गुलाबी सुंडी या कैटरपिलर फसल के फलों, तनों और फूलों को अंदर से कुतर देते हैं।",
      chemical: "रस चूसक कीटों के लिए इमिडाक्लोप्रिड 17.8% SL @ 8 मिली या सुंडी नियंत्रण हेतु एफएमसी कोराजन (Coragen) @ 6 मिली प्रति 15 लीटर वाले स्प्रे पंप में घोलकर छिड़कें।",
      organic: "नीम का शुद्ध तेल (10,000 ppm) @ 5 मिली प्रति लीटर ताज़े पानी में कुछ बूंदें लिक्विड साबुन के मिलाकर पौधों पर अच्छे से स्प्रे करें।",
      tip: "खेत की मेड़ों और किनारों को हमेशा घास-फूस से मुक्त (साफ) रखें, क्योंकि यहीं कीड़े छिपकर प्रजनन करते हैं और फसल पर फिर हमला करते हैं।"
    },
    pa: {
      name: "ਕੀੜੇ ਤੇ ਸੁੰਡੀ ਦਾ ਹਮਲਾ (Pest Outbreak)",
      cause: "ਚਿੱਟੀ ਮੱਖੀ, ਤੇਲਾ, ਅਤੇ ਚੇਪਾ ਪੱਤਿਆਂ ਦਾ ਰਸ ਚੂਸਦੇ ਹਨ ਜਦਕਿ ਗੁਲਾਬੀ ਜਾਂ ਹਰੀ ਸੁੰਡੀ ਫ਼ਸਲ ਦੇ ਡੋਡਿਆਂ ਅਤੇ ਟੀਂਡਿਆਂ ਨੂੰ ਅੰਦਰੋਂ ਖਾ ਕੇ ਖ਼ਰਾਬ ਕਰਦੀ ਹੈ।",
      chemical: "ਤੇਲੇ-ਮੱਖੀ ਲਈ ਇਮੀਡਾਕਲੋਪ੍ਰਿਡ 17.8% SL @ 0.5 ਮਿਲੀਲੀਟਰ ਜਾਂ ਸੁੰਡੀ ਨਾਸ ਲਈ ਕੋਰਾਜਨ (Coragen) @ 60 ਮਿਲੀਲੀਟਰ ਪ੍ਰਤੀ ਏਕੜ ਦੇ ਹਿਸਾਬ ਨਾਲ ਸਪਰੇਅ ਕਰੋ।",
      organic: "5 ਮਿਲੀਲੀਟਰ ਨੀਮ ਦਾ ਤੇਲ 1 ਲੀਟਰ ਕੋਸੇ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਹਫ਼ਤੇ ਵਿੱਚ ਇੱਕ ਵਾਰ ਸਪਰੇਅ ਕਰੋ, ਜੈਵਿਕ ਤਰੀਕੇ ਨਾਲ ਕੀੜੇ ਦੂਰ ਹੋ ਜਾਣਗੇ।",
      tip: "ਖੇਤ ਦੀਆਂ ਵੱਟਾਂ ਨੂੰ ਸਾਫ਼ ਰੱਖੋ। ਜੇਕਰ ਕਿਸੇ ਬੂਟੇ 'ਤੇ ਜ਼ਿਆਦਾ ਹਮਲਾ ਹੋਵੇ, ਤਾਂ ਉਸਨੂੰ ਪੁੱਟ ਕੇ ਦੱਬ ਦਿਓ ਤਾਂ ਜੋ ਬਿਮਾਰੀ ਅੱਗੇ ਨਾ ਫੈਲੇ।"
    }
  },
  fungus: {
    severity: "High",
    en: {
      name: "Fungal Infections (Blight, Rust, Blast & Mildew)",
      cause: "Humid conditions paired with cloudy overcast days or dew-soaked night air, letting pathogenic spores germinate rapidly on the leaves.",
      chemical: "Spray Systemic & Contact Fungicide UPL SAAF (Carbendazim 12% + Mancozeb 63%) @ 2g per Liter of water, or apply Syngenta Amistar / Tilt @ 1ml per Liter.",
      organic: "Create a copper-activated bio-fungicide by keeping 2 Liters of raw unsalted buttermilk (Lassi) in a copper or brass vessel for 8 days, then dilute 1:12 and spray.",
      tip: "Avoid evening or overnight irrigation which keeps plant canopies damp for long periods, creating the ideal environment for fungal spores to spread."
    },
    hi: {
      name: "फफूंद जनित रोग (झुलसा, रतुआ, ब्लास्ट और धब्बा)",
      cause: "सर्दी के समय कोहरे, हवा में अत्यधिक नमी (Moisture) या बार-बार बादल छाए रहने से पत्तियों पर कवक के बीजाणु (Fungal spores) बहुत तेज़ी से फैलते हैं।",
      chemical: "झुलसा या धब्बा दिखने पर तत्काल यूपीएल साफ (UPL SAAF) फफूंदनाशक @ 2 ग्राम या सिंजेंटा टिल्ट (Syngenta Tilt) @ 1 मिली प्रति लीटर पानी के घोल का स्प्रे करें।",
      organic: "2 लीटर ताज़ी बिना नमक की लस्सी को तांबे या कांसे के बर्तन में 8 दिनों के लिए खुला छोड़ दें। इस तांबे-युक्त खट्टी लस्सी को 15 लीटर पानी में घोलकर स्प्रे करें।",
      tip: "शाम के वक्त सिंचाई करने से बचें ताकि रात भर फसल के पत्ते गीले न रहें। सुबह या दोपहर की धूप में सिंचाई करना कवक रोगों से सुरक्षा देता है।"
    },
    pa: {
      name: "ਉੱਲੀਨਾਸ਼ਕ ਰੋਗ (ਝੁਲਸ ਰੋਗ, ਪੀਲੀ ਕੁੰਗੀ ਤੇ ਬਲਾਸਟ)",
      cause: "ਹਵਾ ਵਿੱਚ ਜ਼ਿਆਦਾ ਸਿੱਲ੍ਹ, ਧੁੰਦ ਅਤੇ ਬੱਦਲਵਾਈ ਵਾਲਾ ਮੌਸਮ ਉੱਲੀ (Fungus) ਦੇ ਫੈਲਣ ਲਈ ਸਭ ਤੋਂ ਅਨੁਕੂਲ ਹੁੰਦਾ ਹੈ, ਜਿਸ ਨਾਲ ਪੱਤਿਆਂ 'ਤੇ ਧੱਬੇ ਬਣਦੇ ਹਨ।",
      chemical: "ਕੁੰਗੀ ਜਾਂ ਝੁਲਸ ਰੋਗ ਦਿਖਣ 'ਤੇ ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ (Propiconazole - Tilt) @ 200 ਮਿਲੀਲੀਟਰ ਪ੍ਰਤੀ ਏਕੜ ਜਾਂ ਯੂ.ਪ.ਐਲ. ਸਾਫ਼ @ 400 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਏਕੜ ਸਪਰੇਅ ਕਰੋ।",
      organic: "ਦੇਸੀ ਕਾਪਰ-ਲੱਸੀ ਘੋਲ: 10 ਦਿਨ ਪੁਰਾਣੀ ਲੱਸੀ ਨੂੰ ਤਾਂਬੇ ਦੇ ਭਾਂਡੇ ਵਿੱਚ ਰੱਖ ਕੇ ਤਿਆਰ ਕੀਤਾ ਘੋਲ ਸਪਰੇਅ ਕਰੋ। ਇਹ ਉੱਲੀ ਦੀ ਰੋਕਥਾਮ ਲਈ ਬਹੁਤ ਵਧੀਆ ਜੈਵਿਕ ਦਵਾਈ ਹੈ।",
      tip: "ਫ਼ਸਲ ਦੇ ਪੱਤਿਆਂ ਵਿੱਚੋਂ ਹਵਾ ਦੇ ਲੰਘਣ ਲਈ ਵਿੱਥ ਜ਼ਰੂਰ ਰੱਖੋ, ਸੰਘਣੀ ਬਿਜਾਈ ਵਿੱਚ ਉੱਲੀ ਵਧੇਰੇ ਲੱਗਦੀ ਹੈ।"
    }
  },
  general: {
    severity: "Medium",
    en: {
      name: "Integrated Agriculture & Long-term Farm Optimization",
      cause: "Repeated single-crop cycles (monoculture) stripping critical organic carbon, helpful earthworms and soil microbial populations over consecutive years.",
      chemical: "Plan systematic, certified fertilization schedule using balanced primary Nitrogen, Phosphorus, Potassium (N-P-K) along with Sulfur secondary nutrition.",
      organic: "Inoculate the soil with Jeevamrut culture liquid (desi cow dung + cow urine + sugar jaggery) @ 200 Liters per acre to restore helpful bacterial levels naturally.",
      tip: "Incorporate crop rotation with legumes like Moong lentils or green manures like Dhaincha, which possess root biology to harness free air nitrogen directly."
    },
    hi: {
      name: "प्राकृतिक भूमि सुधार व फसल चक्र नीति",
      cause: "लगातार एक ही तरह की फसल (जैसे धान के बाद गेहूं) उगाने से उत्तम कार्बन तत्व (Organic carbon) और मित्र केंचुए समाप्त हो जाते हैं, जिससे मिट्टी बेजान होने लगती है।",
      chemical: "खेत की उपजाऊ शक्ति बढ़ाने के लिए केवल यूरिया पर निर्भर न रहें। संतुलित एनपीके (NPK) के साथ सुल्फर @ 10 किलो प्रति एकड़ की दर से अवश्य डालें।",
      organic: "जीवामृत बनाकर सींचे: 10 किलो गोबर, 10 लीटर गोमूत्र, 2 किलो गुड़, 2 किलो बेसन और 1 मुट्ठी खेत की सजीव मिट्टी को 200 लीटर पानी में घोलकर सिंचाई के समय बहाएं।",
      tip: "फसल चक्र (Crop Rotation) अपनाएं। धान के बाद मूंग या हरी खाद के रूप में 'ढैंचा' (Dhaincha) की बिजाई करें, यह हवा से नाइट्रोजन खींचकर भूमि को बेहद दमदार बनाती है।"
    },
    pa: {
      name: "ਪ੍ਰਾਕ੍ਰਿਤਿਕ ਜ਼ਮੀਨ ਸੁਧਾਰ ਤੇ ਫ਼ਸਲੀ ਚੱਕਰ",
      cause: "ਲਗਾਤਾਰ ਇੱਕੋ ਜਿਹੀਆਂ ਫ਼ਸਲਾਂ (ਝੋਨਾ ਤੇ ਕਣਕ) ਦੀ ਬਿਜਾਈ ਜ਼ਮੀਨ ਦੀ ਉਪਜาਊ ਸ਼ਕਤੀ (Organic Carbon) ਅਤੇ ਮਿੱਤਰ ਕੀੜਿਆਂ (ਕੈਂਚੂਏ) ਨੂੰ ਖ਼ਤਮ ਕਰ ਦਿੰਦੀ ਹੈ।",
      chemical: "ਜ਼ਮੀਨ ਦੀ ਤਾਕਤ ਬਣਾਈ ਰੱਖਣ ਲਈ ਸੰਤੁਲਿਤ ਐਨ.ਪੀ.ਕੇ. (NPK) ਖਾਦ ਪਾਓ ਅਤੇ ਸਲਫ਼ਰ @ 10 ਕਿੱਲੋ ਪ੍ਰਤੀ ਏਕੜ ਜ਼ਰੂਰ ਵਰਤੋ।",
      organic: "ਜੀਵਾਮ੍ਰਿਤ ਦੀ ਵਰਤੋਂ ਕਰੋ: 10 ਕਿੱਲੋ ਦੇਸੀ ਗੋਬਰ, 10 ਲੀਟਰ ਗਊ-ਮੂਤਰ, 2 ਕਿੱਲੋ ਗੁੜ ਅਤੇ 2 ਕਿੱਲੋ ਬੇਸਣ ਨੂੰ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਖੇਤ ਵਿੱਚ ਵਹਾਓ। ਇਹ ਧਰਤੀ ਨੂੰ ਨਵਾਂ ਜੀਵਨ ਦਿੰਦਾ ਹੈ।",
      tip: "ਫ਼ਸਲੀ ਚੱਕਰ ਅਪਣਾ ਕੇ ਕਣਕ-ਝੋਨੇ ਦੇ ਵਿਚਕਾਰ ਮੂੰਗੀ ਜਾਂ ਜੰਤਰ (Dhaincha) ਜ਼ਰੂਰ ਬੀਜੋ, ਇਹ ਮੁਫ਼ਤ ਨਾਈਟ੍ਰੋਜਨ ਬਣਾਉਂਦਾ ਹੈ।"
    }
  }
};

export function getAdvancedChatGPTResponse(queryText: string, category: string, lang: 'hi' | 'pa' | 'en', hasImage: boolean = false): string {
  const text = (queryText || "").trim().toLowerCase();
  
  // Clean punctuation for matching
  const cleanStr = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
  const isGreeting = 
    cleanStr === "" ||
    cleanStr === "hi" || 
    cleanStr === "hello" || 
    cleanStr === "hey" ||
    cleanStr.includes("नमस्ते") || 
    cleanStr.includes("नमस्कार") || 
    cleanStr.includes("राम राम") || 
    cleanStr.includes("सत श्री अकाल") || 
    cleanStr.includes("ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ") ||
    cleanStr.includes("satsriakal") || 
    cleanStr.includes("ram ram") || 
    cleanStr.includes("namaste") || 
    cleanStr.includes("kaise ho") ||
    cleanStr.includes("kaise hain") ||
    cleanStr.includes("kaisa ho") ||
    cleanStr.includes("kese ho") ||
    cleanStr.includes("kese hain");

  if (isGreeting && !hasImage) {
    if (lang === 'hi') {
      return `**राम राम मेरे किसान भाई! 🙏**

मैं आपका 'किसान मित्र' हूँ। मैं यहाँ आपकी खेतीबाड़ी और फसलों की समस्याओं का पक्का समाधान करने के लिए हूँ। 

आप मुझसे कुछ भी पूछ सकते हैं, जैसे:
1. **फसलों की समस्या**: गेहूं का पीलापन, टमाटर का झुलसा रोग (blight), धान का खैरा रोग या कपास की गुलाबी सुंडी का इलाज।
2. **खाद की गणना**: प्रति एकड़ यूरिया, डीएपी (DAP), जिंक या सुपर खाद की सही मात्रा।
3. **मंडी का ताज़ा भाव**: गेहूं, धान, मक्का या आलू के ताज़ा बाज़ार भाव।
4. **पशुपालन**: गाय-भैंस का दूध बढ़ाने के उपाय या थनैला रोग का इलाज।

आप अपनी फसल की पत्ती की फोटो लगाकर भी मुझसे बीमारी और इलाज पूछ सकते हैं। बताइए, आज मैं आपके कौन से खेत या फसल की समस्या दूर करूं?`;
    } else if (lang === 'pa') {
      return `**ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਮੇਰੇ ਕਿਸਾਨ ਵੀਰ ਜੀ! 🙏**

ਮੈਂ ਤੁਹਾਡਾ 'ਕਿਸਾਨ ਮਿੱਤਰ' ਹਾਂ। ਮੈਂ ਇੱਥੇ ਤੁਹਾਡੀ ਖੇਤੀਬਾੜੀ ਅਤੇ ਫ਼ਸਲਾਂ ਦੀਆਂ ਸਮੱਸਿਆਵਾਂ ਦਾ ਪੱਕਾ ਅਤੇ ਰਸਾਇਣਕ/ਦੇਸੀ ਹੱਲ ਕਰਨ ਲਈ ਹਾਂ। 

ਤੁਸੀਂ ਮੈਨੂੰ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛ ਸਕਦੇ ਹੋ, ਜਿਵੇਂ:
1. **ਫ਼ਸਲਾਂ ਦੀ ਬਿਮਾਰੀ**: ਕਣਕ ਦਾ ਪੀਲਾਪਣ, ਟਮਾਟਰ ਦਾ ਝੁਲਸ ਰੋਗ, ਝੋਨੇ ਦਾ ਖੈਰਾ ਰੋਗ ਜਾਂ ਨਰਮੇ ਦੀ ਗੁਲਾਬੀ ਸੁੰਡੀ ਦਾ ਇਲਾਜ।
2. **ਖਾਦ ਦੀ ਮਾਤਰਾ**: ਪ੍ਰਤੀ ਏਕੜ ਕਿੰਨੀ ਯੂਰੀਆ, ਡੀਏਪੀ (DAP), ਜਿੰਕ ਜਾਂ ਪੋਟਾਸ਼ ਪਾਉਣੀ ਚਾਹੀਦੀ ਹੈ।
3. **ਮੰਡੀ ਦਾ ਤਾਜ਼ਾ ਭਾਅ**: ਕਣਕ, ਝੋਨੇ, ਆਲੂ ਜਾਂ ਸਰ੍ਹੋਂ ਦੇ ਅੱਜ ਦੇ ਤਾਜ਼ਾ ਰੇਟ।
4. **ਪਸ਼ੂਪਾਲਣ**: ਗਾਂ-ਮੱਝ ਦਾ ਦੁੱਧ ਵਧਾਉਣ ਦੇ ਤਰੀਕੇ ਜਾਂ ਥਣੈਲਾ ਰੋਗ ਦਾ ਇਲਾਜ।

ਤੁਸੀਂ ਬਿਮਾਰ ਪੱਤੇ ਦੀ ਫੋਟੋ ਲਗਾ ਕੇ ਵੀ ਪੱਕਾ ਇਲਾਜ ਪੁੱਛ ਸਕਦੇ ਹੋ। ਦੱਸੋ ਵੀਰ ਜੀ, ਅੱਜ ਤੁਹਾਡੀ ਕਿਸ ਫ਼ਸਲ ਜਾਂ ਸਮੱਸਿਆ ਦਾ ਹੱਲ ਕਰੀਏ?`;
    } else {
      return `**Hello, dear farmer friend! 🙏**

I am your 'Kisan Mitra'. I am here to help you solve any disease, pest infestation, or soil nutrient issues in your crops.

You can ask me anything, such as:
1. **Crop Health**: Yellowing in wheat, blight in tomato, khaira disease in paddy, or pink bollworm in cotton.
2. **Fertilizer Guidance**: Exactly how much Urea, DAP, Zinc, or Potash to use per acre.
3. **Mandi Rates**: Real-time market prices for grains or vegetables.
4. **Animal Husbandry**: Increasing milk yield or mastitis treatment in dairy cattle.

You can also upload or take a picture of infected crop foliage/leaves for instant diagnosis. How can I help you today?`;
    }
  }

  // 1. Resolve crop
  let cropKey = "general";
  if (text.includes("tomato") || text.includes("टमाटर") || text.includes("ਟਮਾਟਰ") || text.includes("tamatar") || category === "tomato") cropKey = "tomato";
  else if (text.includes("wheat") || text.includes("गेहूं") || text.includes("गेहूँ") || text.includes("ਕਣਕ") || text.includes("gehun") || text.includes("kanak") || category === "wheat") cropKey = "wheat";
  else if (text.includes("paddy") || text.includes("rice") || text.includes("धान") || text.includes("चावल") || text.includes("ਚੌਲ") || text.includes("ਝੋਨਾ") || text.includes("dhan") || text.includes("chawal") || text.includes("jhona") || category === "rice") cropKey = "rice";
  else if (text.includes("potato") || text.includes("आलू") || text.includes("ਆਲੂ") || text.includes("aloo") || category === "potato") cropKey = "potato";
  else if (text.includes("cotton") || text.includes("कपास") || text.includes("नरमा") || text.includes("ਨਰਮਾ") || text.includes("kapas") || text.includes("narma") || category === "cotton") cropKey = "cotton";
  else if (text.includes("chilli") || text.includes("mirch") || text.includes("मिर्च") || text.includes("ਮਿਰਚ") || text.includes("pepper") || category === "chilli") cropKey = "chilli";
  else if (text.includes("onion") || text.includes("pyaj") || text.includes("प्याज") || text.includes("ਗੰਢਾ") || text.includes("pyaaz") || category === "onion") cropKey = "onion";
  else if (text.includes("mustard") || text.includes("sarso") || text.includes("सरसों") || text.includes("ਸਰ੍ਹੋਂ") || text.includes("sarson") || category === "mustard") cropKey = "mustard";
  else if (text.includes("sugarcane") || text.includes("ganna") || text.includes("गन्ना") || text.includes("ਕਮਾਦ") || category === "sugarcane") cropKey = "sugarcane";
  else if (text.includes("maize") || text.includes("makka") || text.includes("मक्का") || text.includes("ਮੱਕੀ") || category === "maize") cropKey = "maize";
  else if (text.includes("pea") || text.includes("matar") || text.includes("मटर") || text.includes("ਮਟਰ") || category === "pea") cropKey = "pea";
  else if (text.includes("brinjal") || text.includes("baigan") || text.includes("बैंगन") || text.includes("ਬੈਂਗਣ") || category === "brinjal") cropKey = "brinjal";
  else if (text.includes("mango") || text.includes("आम") || text.includes("ਅੰਬ") || text.includes("aam")) cropKey = "mango";
  else if (text.includes("rose") || text.includes("गुलाब") || text.includes("ਗੁਲਾਬ")) cropKey = "rose";
  else if (text.includes("lemon") || text.includes("नींबू") || text.includes("ਨਿੰਬੂ") || text.includes("nimbu")) cropKey = "lemon";
  else if (text.includes("guava") || text.includes("अमरूद") || text.includes("ਅਮਰੂਦ") || text.includes("amrood")) cropKey = "guava";
  else if (text.includes("apple") || text.includes("सेब") || text.includes("ਸੇਬ") || text.includes("seb")) cropKey = "apple";
  else if (text.includes("tulsi") || text.includes("तुलसी") || text.includes("ਤੁਲਸੀ")) cropKey = "tulsi";
  else if (text.includes("marigold") || text.includes("गेंदा") || text.includes("ਗੇਂਦਾ") || text.includes("genda")) cropKey = "marigold";
  else if (text.includes("aloe") || text.includes("एलोवेरा") || text.includes("ਐਲੋਵੇਰਾ")) cropKey = "aloe";

  // 2. Resolve problem category
  let probKey = "general";
  if (text.includes("fertilizer") || text.includes("khad") || text.includes("खाद") || text.includes("urea") || text.includes("dap") || text.includes("npk") || text.includes("यूरिया") || text.includes("ਯੂਰੀਆ") || category === "fertilizer") probKey = "fertilizer";
  else if (text.includes("mandi") || text.includes("rate") || text.includes("price") || text.includes("भाव") || text.includes("रेट") || text.includes("ਭਾਅ") || text.includes("bhav") || category === "mandi") probKey = "mandi";
  else if (text.includes("dairy") || text.includes("cow") || text.includes("buffalo") || text.includes("milk") || text.includes("भैंस") || text.includes("गाय") || text.includes("ਪਸ਼ੂ") || text.includes("ਦੁੱਧ") || text.includes("pashu") || text.includes("दूध") || category === "dairy") probKey = "dairy";
  else if (text.includes("yellow") || text.includes("pila") || text.includes("पीला") || text.includes("ਪੀਲਾ") || text.includes("peela") || text.includes("pilla") || text.includes("peelapan") || text.includes("pilapan")) probKey = "yellowing";
  else if (text.includes("keeda") || text.includes("कीड़ा") || text.includes("ਕੀੜਾ") || text.includes("worm") || text.includes("insect") || text.includes("sundi") || text.includes("sunde") || text.includes("caterpillar") || text.includes("aphid") || text.includes("fly") || text.includes("makkhi") || text.includes("pest")) probKey = "insects";
  else if (text.includes("blight") || text.includes("blast") || text.includes("rust") || text.includes("kungi") || text.includes("jhulsa") || text.includes("dhabba") || text.includes("rot") || text.includes("spot") || text.includes("झुलसा") || text.includes("रतुआ") || text.includes("धब्बा") || text.includes("ਧੱਬਾ") || text.includes("fungus") || text.includes("fafaond") || text.includes("funga") || text.includes("rog")) probKey = "fungus";
  else if (text.includes("rot") || text.includes("galna") || text.includes("गलन") || text.includes("ਗਲਣਾ") || text.includes("ganna") || text.includes("sukhna")) probKey = "rotting";

  // Smart defaults for image-only messages to prevent the "greeting repetition" issue
  if (hasImage) {
    if (cropKey === "general") {
      cropKey = "general_plant"; // Default to generic plant care instead of hardcoded Tomato
    }
    if (probKey === "general") {
      probKey = "general"; // Use friendly general care guidelines as standard template
    }
  }

  // 3. Fallback search: look inside specific diagnoses, else look inside general diagnoses
  let probData: SeverityData | null = null;
  if (SPECIFIC_DIAGNOSIS[cropKey] && SPECIFIC_DIAGNOSIS[cropKey][probKey]) {
    probData = SPECIFIC_DIAGNOSIS[cropKey][probKey];
  } else if (SPECIFIC_DIAGNOSIS[cropKey] && probKey === "general") {
    // If crop is resolved but problem is general, try to give the fungus or insects as crop default to be smart
    const keys = Object.keys(SPECIFIC_DIAGNOSIS[cropKey]);
    if (keys.length > 0) {
      probData = SPECIFIC_DIAGNOSIS[cropKey][keys[0]]; // pick first specific disease (e.g. Blight) as smart fallback instead of soil rotation
    }
  }

  // Fallback to general problem dictionary
  if (!probData) {
    probData = GENERAL_PROBLEMS[probKey] || GENERAL_PROBLEMS.general;
  }

  const cropData = CROPS[cropKey] || CROPS.general;
  const cropName = cropData[lang];
  const cropEnName = cropData.en;
  const problemName = probData[lang].name;

  // Construct complete diagnostic card block for UI rendering
  const diagnosisBlock = `\n\n[DIAGNOSIS_START]
Crop: ${cropEnName}
Issue: ${probData.en.name}
Severity: ${probData.severity}
Chemical_Remedy: ${probData.en.chemical}
Organic_Remedy: ${probData.en.organic}
Reason: ${probData.en.cause}
Prevention: ${probData.en.tip}
[DIAGNOSIS_END]`;

  if (hasImage) {
    if (lang === 'hi') {
      const responseText = `**1. पेड़ या पौधे का नाम:** ${cropName}
**2. बीमारी या समस्या:** ${problemName}
**3. उसका पक्का इलाज:** ${probData.hi.chemical} या ${probData.hi.organic}

(यह समाधान किसान मित्र ऑफलाइन डेटाबेस द्वारा तैयार किया गया है।)${diagnosisBlock}`;
      return responseText;
    } else if (lang === 'pa') {
       const responseText = `**1. ਪੌਦੇ ਜਾਂ ਰੁੱਖ ਦਾ ਨਾਮ:** ${cropName}
**2. ਬੀਮਾਰੀ ਜਾਂ ਸਮੱਸਿਆ:** ${problemName}
**3. ਉਸਦਾ ਪੱਕਾ ਇਲਾਜ:** ${probData.pa.chemical} ਜਾਂ ${probData.pa.organic}

(ਇਹ ਹੱਲ ਕਿਸਾਨ ਮਿੱਤਰ ਆਫਲਾਈਨ ਡੇਟਾਬੇਸ ਦੁਆਰਾ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਹੈ।)${diagnosisBlock}`;
      return responseText;
    } else {
       const responseText = `**1. Plant/Tree Name:** ${cropEnName}
**2. Disease or Problem:** ${probData.en.name}
**3. Cure / Treatment:** ${probData.en.chemical} or ${probData.en.organic}

(This solution is prepared by Kisan Mitra Offline Database.)${diagnosisBlock}`;
      return responseText;
    }
  }

  let assurance = "";
  let causeHeader = "";
  let chemicalHeader = "";
  let organicHeader = "";
  let tipHeader = "";

  if (lang === 'hi') {
    assurance = `**देसी दिलासा (Farmer Support)**:
घबराइए मत मेरे किसान भाई साहब, ${cropName} की फसल में ${problemName} की समस्या कोई बड़ी बात नहीं है। आपका भाई 'किसान मित्र' आपके साथ खड़ा है! इसके लिए हमारे पास अत्यंत विश्वसनीय और वैज्ञानिक समाधान मौजूद हैं। आपकी मेहनत से उगाई गई फसल फिर से लहलहा उठेगी और भरपूर उत्पादन देगी। ज़रा भी परेशान न हों!`;

    causeHeader = `\n\n**समस्या का असली कारण (Biological Cause)**:
${probData.hi.cause} विशेष रूप से ${cropName} की फसल में यह समस्या कवक या कीटों के हमले से पौधों के स्वास्थ्य को तेज़ी से प्रभावित करती है।`;

    chemicalHeader = `\n\n**पक्का इलाज केमिकल (Highly Advanced Chemical Formula)**:
${probData.hi.chemical}`;

    organicHeader = `\n\n**देसी नुस्खा / जैविक उपाय (Zero-Cost Bio/Organic Remedy)**:
${probData.hi.organic}`;

    tipHeader = `\n\n**खास मित्र टिप 💡 (Expert Agri-Goldtip)**:
${probData.hi.tip}`;
  } else if (lang === 'pa') {
    assurance = `**ਦੇਸੀ ਦਿਲਾਸਾ (Farmer Support)**:
ਘਬਰਾਉਣਾ ਨਹੀਂ ਵੀਰ ਜੀ, ਤੁਹਾਡਾ ਭਰਾ 'ਕਿਸਾਨ ਮਿੱਤਰ' ਤੁਹਾਡੇ ਨਾਲ ਖੜ੍ਹਾ ਹੈ! ${cropName} ਦੀ ਫ਼ਸਲ ਵਿੱਚ ${problemName} ਦੀ ਸਮੱਸਿਆ ਦਾ ਪੱਕਾ ਅਤੇ ਅਸਰਦਾਰ ਇਲਾਜ ਮੌਜੂਦ ਹੈ। ਕਿਸਾਨ ਮਿੱਤਰ ਦੀ ਇਹ ਸਲਾਹ ਵਰਤੋ, ਤੁਹਾਡੀ ਮਿਹਨਤ ਨਾਲ ਬੀਜੀ ਫ਼ਸਲ ਫਿਰ ਤੋਂ ਹਰੀ-ਭਰੀ ਹੋ ਜਾਵੇਗੀ ਅਤੇ ਬੰਪਰ ਝਾੜ ਦੇਵੇਗੀ, ਚਿੰਤਾ ਬਿਲਕੁਲ ਛੱਡ ਦਿਓ।`;

    causeHeader = `\n\n**ਬਿਮਾਰੀ ਦਾ ਅਸਲੀ ਕਾਰਨ (Primary Cause)**:
${probData.pa.cause} ਖ਼ਾਸ ਤੌਰ 'ਤੇ ${cropName} ਦੀ ਫ਼ਸਲ ਵਿੱਚ ਇਹ ਦਿੱਕਤ ਬੂਟਿਆਂ ਦੇ ਸਹੀ ਵਾਧੇ ਨੂੰ ਰੋਕ ਦਿੰਦੀ ਹੈ।`;

    chemicalHeader = `\n\n**ਪੱਕਾ ਰਸਾਇਣਕ ਇਲਾਜ (Chemical Treatment)**:
${probData.pa.chemical}`;

    organicHeader = `\n\n**ਦੇਸੀ ਘਰੇਲੂ / ਜੈਵਿਕ ਨੁਸਖਾ (Organic Alternative)**:
${probData.pa.organic}`;

    tipHeader = `\n\n**ਖਾਸ ਮਿੱਤਰ ਟਿੱਪ 💡 (Expert Tip)**:
${probData.pa.tip}`;
  } else {
    assurance = `**Expert Reassurance (Farmer Support)**:
Please do not worry at all! Managing ${problemName} in your ${cropName} crop is completely straightforward. 'Kisan Mitra' is here to help you. I have drafted an advanced, highly effective treatment program that will fully restore your crop health and optimize your hard-earned harvest yields.`;

    causeHeader = `\n\n**Underlying Cause (Biological Analysis)**:
${probData.en.cause} Sourcing these critical factors early protects your precious ${cropName} from structural canopy damage.`;

    chemicalHeader = `\n\n**Actionable Chemical Treatment (Advanced Formulas)**:
${probData.en.chemical}`;

    organicHeader = `\n\n**Traditional Bio-Remedy (Zero-Cost Organic Alternative)**:
${probData.en.organic}`;

    tipHeader = `\n\n**Expert Kisan Mitra Pro-Tip 💡**:
${probData.en.tip}`;
  }

  return `${assurance}${causeHeader}${chemicalHeader}${organicHeader}${tipHeader}${diagnosisBlock}`;
}
