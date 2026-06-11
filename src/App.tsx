import { useState, useEffect } from 'react';
import { ChatSession, ChatMessage, Language, TRANSLATIONS } from './types';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { Sprout, Menu, X, HelpCircle, Check, Play } from 'lucide-react';

// Extremely robust, fail-safe JSON parser to prevent any possible "Uncaught SyntaxError" crashes in the app
const safeJsonParse = <T,>(str: any, fallback: T): T => {
  if (str === null || str === undefined) return fallback;
  try {
    const rawStr = typeof str === 'string' ? str : String(str);
    const trimmed = rawStr.trim();
    if (
      trimmed === "" || 
      trimmed === "undefined" || 
      trimmed === "null" || 
      trimmed === "NaN" || 
      trimmed === "[object Object]"
    ) {
      return fallback;
    }
    // Double check that it looks like a JSON array or object before parsing
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return fallback;
    }
    return JSON.parse(trimmed) as T;
  } catch (error) {
    console.warn("Safe JSON parser caught a benign parse failure:", error);
    return fallback;
  }
};

export default function App() {
  const [language, setLanguage] = useState<Language>('hi'); // Default to Hindi, highly accessible
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Collapsible sidebar for independent auto-adjusting view
  
  // Mobile UI Sidebar Toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load configuration and data from LocalStorage with absolute defense
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('farming_lang') as Language;
      if (savedLang) {
        setLanguage(savedLang);
      }

      const savedSessions = localStorage.getItem('farming_sessions');
      const parsed = safeJsonParse<ChatSession[]>(savedSessions, []);
      setSessions(parsed);
      if (parsed.length > 0) {
        setActiveSessionId(parsed[0].id);
      }
    } catch (e) {
      console.warn("Local storage restoration intercepted and reset gracefully:", e);
      setSessions([]);
      localStorage.removeItem('farming_sessions');
    }
  }, []);

  // Sync state changes with LocalStorage
  const saveSessions = (updated: ChatSession[]) => {
    setSessions(updated);
    localStorage.setItem('farming_sessions', JSON.stringify(updated));
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('farming_lang', lang);

    // If active session language is different, update active session language context
    if (activeSessionId) {
      const updated = sessions.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, language: lang };
        }
        return s;
      });
      saveSessions(updated);
    }
  };

  const generateId = () => Math.random().toString(36).substring(2, 11);

  // Initialize a new clear diagnostic conversation
  const handleCreateSession = () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: language === 'hi' ? 'नया संवाद समूह' : language === 'pa' ? 'ਨਵੀਂ ਗੱਲਬਾਤ' : 'Crop Diagnostic Inspection',
      language,
      createdAt: new Date().toLocaleDateString(),
      messages: []
    };

    const updated = [newSession, ...sessions];
    saveSessions(updated);
    setActiveSessionId(newSession.id);
    setIsSidebarOpen(false); // Close on mobile
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    saveSessions(updated);
    
    if (activeSessionId === id) {
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id);
      } else {
        setActiveSessionId(null);
      }
    }
  };

  const handleClearSessions = () => {
    const userConfirmed = window.confirm(
      language === 'hi' ? 'क्या आप सचमुच सभी कृषि इतिहास मिटाना चाहते हैं?' :
      language === 'pa' ? 'ਕੀ ਤੁਸੀਂ ਸੱਚਮੁੱਚ ਸਾਰਾ ਖੇਤੀ ਇਤਿਹਾਸ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?' :
      'Are you sure you want to clear your crop diagnostic search histories?'
    );
    if (userConfirmed) {
      saveSessions([]);
      setActiveSessionId(null);
    }
  };

  const handleSendMessage = async (text: string, image?: string, imageType?: 'image' | 'video') => {
    // If no session exists, bootstrap one immediately
    let currentSessionId = activeSessionId;
    let currentSessions = [...sessions];
    
    if (!currentSessionId) {
      const newSession: ChatSession = {
        id: generateId(),
        title: text.length > 25 ? `${text.substring(0, 25)}...` : text || 'Crop Diagnosis Result',
        language,
        createdAt: new Date().toLocaleDateString(),
        messages: []
      };
      currentSessions = [newSession, ...sessions];
      saveSessions(currentSessions);
      currentSessionId = newSession.id;
      setActiveSessionId(newSession.id);
    }

    const matchedSession = currentSessions.find(s => s.id === currentSessionId);
    if (!matchedSession) return;

    // Create a new user message
    const userMessage: ChatMessage = {
      id: generateId(),
      sender: 'user',
      text,
      image,
      imageType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Auto update chat title based on query if it was default
    let activeTitle = matchedSession.title;
    if (matchedSession.messages.length === 0) {
      activeTitle = text.length > 25 ? `${text.substring(0, 25)}...` : text || 'Crop Attachment Analysis';
    }

    const updatedMessages = [...matchedSession.messages, userMessage];
    const updatedSessions = currentSessions.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          title: activeTitle,
          messages: updatedMessages
        };
      }
      return s;
    });

    saveSessions(updatedSessions);
    setIsStreaming(true);

    const hasAttachedImage = !!image || updatedMessages.some(m => m.image);

    try {
      let systemPrompt = "";
      if (hasAttachedImage) {
        if (language === 'hi') {
          systemPrompt = `आप 'किसान मित्र' (Kisan Mitra) हैं - एक विशेषज्ञ कृषि सलाहकार और फसल डॉक्टर।
चूंकि किसान भाई ने अपने पौधे या पत्ते की फोटो भेजी है, आपको उनका जवाब बेहद सीधा, सरल और बिना किसी फालतू गपशप/जटिलता के देना है।

आपके उत्तर में केवल निम्नलिखित 3 चीजें होनी चाहिए:
1. **पेड़ या पौधे का नाम**: (पहचाने गए पेड़ या पौधे का नाम लिखें)
2. **बीमारी या समस्या**: (पत्ते या पौधे में देखी गई बीमारी या समस्या का नाम)
3. **उसका पक्का इलाज**: (आवश्यक रसायनिक दवा या घरेलू जैविक उपाय और छिड़काव की मात्रा/विधि)

कृपया कोई भी अन्य अतिरिक्त पैराग्राफ, परिचय, या जटिल बातें मत लिखें। किसान को बिल्कुल सीधा और सरल उत्तर पसंद है।

उत्तर के अंत में आपको यह सटीक डायग्नोसिस ब्लॉक भी दिखाना होगा, ताकि सिस्टम कार्ड बना सके:
[DIAGNOSIS_START]
Crop: <फसल/पेड़ का अंग्रेजी नाम, जैसे Tomato या Wheat>
Issue: <बीमारी का अंग्रेजी नाम, जैसे Leaves Blight या Leaf Rust>
Severity: <High / Medium / Low>
Chemical_Remedy: <दवा का नाम और मात्रा>
Organic_Remedy: <जैविक घरेलू इलाज>
Reason: <बीमारी का कारण>
Prevention: <आगे के लिए बचाव>
[DIAGNOSIS_END]`;
        } else if (language === 'pa') {
          systemPrompt = `ਤੁਸੀਂ 'ਕਿਸਾਨ ਮਿੱਤਰ' (Kisan Mitra) ਹੋ - ਇੱਕ ਖੇਤੀਬਾੜੀ ਮਾਹਰ ਅਤੇ ਫਸਲ ਡਾਕਟਰ।
ਕਿਉਂਕਿ ਕਿਸਾਨ ਵੀਰ ਨੇ ਪੌਦੇ/ਪੱਤੇ ਦੀ ਫੋਟੋ ਭੇਜੀ ਹੈ, ਤੁਹਾਨੂੰ ਉਹਨਾਂ ਦਾ ਜਵਾਬ ਬਹੁਤ ਸਿੱਧਾ, ਸਰਲ ਅਤੇ ਬਿਨਾਂ ਕਿਸੇ ਫਾਲਤੂ ਗੱਲਬਾਤ ਦੇ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।

ਤੁਹਾਡੇ ਜਵਾਬ ਵਿੱਚ ਸਿਰਫ਼ ਹੇਠ ਲਿਖੀਆਂ 3 ਚੀਜ਼ਾਂ ਹੋਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ:
1. **ਪੌਦੇ ਜਾਂ ਰੁੱਖ ਦਾ ਨਾਮ**: (ਪਛਾਣੇ ਗਏ ਪੌਦੇ/ਰੁੱਖ ਦਾ ਨਾਮ ਲਿਖੋ)
2. **ਬੀਮਾਰੀ ਜਾਂ ਸਮੱਸਿਆ**: (ਪੱਤੇ ਜਾਂ ਪੌਦੇ ਵਿੱਚ ਦੇਖੀ ਗਈ ਬੀਮਾਰੀ/ਸਮੱਸਿਆ ਦਾ ਨਾਮ)
3. **ਉਸਦਾ ਪੱਕਾ ਇਲਾਜ**: (ਲੋੜੀਂਦੀ ਦਵਾਈ ਜਾਂ ਦੇਸੀ ਉਪਾਅ ਅਤੇ ਛਿੜਕਾਅ ਦਾ ਤਰੀਕਾ)

ਕਿਰਪਾ ਕਰਕੇ ਕੋਈ ਹੋਰ ਵਾਧੂ ਪੈਰਾਗ੍ਰਾਫ, ਜਾਣ-ਪਛਾਣ, ਜਾਂ ਗੁੰਝਲਦਾਰ ਗੱਲਾਂ ਨਾ ਲਿਖੋ। ਕਿਸਾਨ ਨੂੰ ਬਿਲਕੁਲ ਸਿੱਧਾ ਅਤੇ ਸਰਲ ਜਵਾਬ ਪਸੰਦ ਹੈ।

ਜਵਾਬ ਦੇ ਅੰਤ ਵਿੱਚ ਤੁਹਾਨੂੰ ਇਹ ਸਹੀ ਡਾਇਗਨੋਸਿਸ ਬਲਾਕ ਵੀ ਦਿਖਾਉਣਾ ਹੋਵੇਗਾ, ਤਾਂ ਜੋ ਸਿਸਟਮ ਕਾਰਡ ਬਣਾ ਸਕੇ:
[DIAGNOSIS_START]
Crop: <ਫਸਲ/ਰੁੱਖ ਦਾ ਅੰਗਰੇਜ਼ੀ ਨਾਮ, ਜਿਵੇਂ Tomato ਜੀ Wheat>
Issue: <ਬੀਮਾਰੀ ਦਾ ਅੰਗਰੇਜ਼ੀ ਨਾਮ, ਜਿਵੇਂ Leaves Blight ਜੀ Leaf Rust>
Severity: <High / Medium / Low>
Chemical_Remedy: <ਦਵਾਈ ਦਾ ਨਾਮ ਅਤੇ ਮਾਤਰਾ>
Organic_Remedy: <ਦੇਸੀ ਘਰੇਲੂ ਇਲਾਜ>
Reason: <ਬੀਮਾਰੀ ਦਾ ਕਾਰਨ>
Prevention: <ਅੱਗੇ ਲਈ ਬਚਾਅ>
[DIAGNOSIS_END]`;
        } else {
          systemPrompt = `You are 'Kisan Mitra' (Kisan Mitra) - an expert Agriculture advisor and crop doctor.
Since the farmer has shared a photo of a crop/plant, your response must be extremely direct, simple, and free of any conversational fluff.

Your response must contain ONLY these 3 direct elements:
1. **Plant/Tree Name**: (Identified plant or tree name)
2. **Disease or Problem**: (The identified disease, pest, or nutrient issue)
3. **Cure / Treatment**: (Exact recommended medicine, spray instructions or organic solution)

Do not write any other paragraphs, long intros or complicated systems. Keep it clean and straight to the point.

At the very end of your response, you MUST print this raw block started with [DIAGNOSIS_START] and ended with [DIAGNOSIS_END] so the system card can display properly:
[DIAGNOSIS_START]
Crop: <Name of crop in standard English, e.g., Wheat / Tomato>
Issue: <Identified problem in English, e.g., Early Blight / Aphids>
Severity: <High / Medium / Low>
Chemical_Remedy: <Specific ingredient + brand dose>
Organic_Remedy: <Organic alternative>
Reason: <Primary biological trigger>
Prevention: <Prevention practice>
[DIAGNOSIS_END]`;
        }
      } else {
        systemPrompt = `You are "Kisan Mitra" (किसान मित्र / ਕਿਸਾਨ ਮਿੱਤਰ), an extremely warm, polite, and highly expert Indian agricultural specialist and friendly crop doctor.
Today's Date: ${new Date().toDateString()}, Current local time: ${new Date().toLocaleTimeString()} (India Timezone).

Communication Vibe (CRITICAL):
1. ALWAYS communicate in friendly, warm, respectful Hinglish (Hindi + English mix), pure Hindi, or pure Punjabi matching the user's selected interface language.
2. Use comforting local terms like "Bhai", "Veer ji", "Ram Ram", "Satsriakal" to build an authentic rural relationship. Always be polite, passionate, and encouraging!
3. Avoid dry robotic blocky English or academic text. Speak like a caring farmer's son who is also a modern agricultural university gold medalist.
4. Structure the text beautifully with double spaces and bold titles so it is incredibly clean to read.

Response Blueprint (Structure every answer beautifully):
- **देसी दिलासा (Reassurance)**: Start with 1-2 positive comforting sentences instantly validating their issue. Say things like "Ghabraiye mat veer ji, iska pakka ilaaj ho jayega!"
- **समस्या का असली कारण (The Cause)**: Explain why the yellowing, insect attack, or rot happened in incredibly simple terms (e.g., damp climate, over-fertilization, lack of zinc).
- **पक्का इलाज केमिकल (Urgent Chemical Treatment)**:
  - State the exact Chemical remedy. Mention BOTH the active scientific ingredient name AND extremely common Indian local brands (e.g., "Saaf by UP&L", "Syngenta's Tilt", "Kavach", "Amistar", "Coragen", "M-45").
  - Give precise dosages (e.g., "per 15L pump" or "per acre") and correct spraying timing (e.g., evening, morning or dry day).
  - Indicate the exact price rate / approximate MSP if asked.
- **देसी नुस्खा / जैविक उपाय (Organic alternative / देशी उपाय)**:
  - Give a low-cost or zero-cost organic alternative (such as spraying Neem oil (10,000 ppm), sour lassi / buttermilk spray, wood ash, or multi-cropping). This makes your helper incredibly valuable for low-margin farmers!
- **खास मित्र टिप 💡 (Expert tip)**: A useful tip regarding optimal watering (sinchai), future cropping, or soil safety.

Domain Specialties:
- Diagnosing plant foliage/leaf/stem diseases, suggesting top pesticides, calculating DAP/Urea quantities, dairy farming/poultry cattle feed, PM-Kisan scheme applications, Mandi rates, organic methods.
- Rejection Rule: For general generic queries not related to crops, seeds, machines, soil, animal husbandry, pashupalan or farming, refuse with an affectionate smile: "Arey bhai, main toh simple Kisan Mitra hoon. Main kheti-baadi ya pashupalan ke sawaल ही समझता हूँ! Kheti ka kuch bhi poocho, aapka bhai turant bataega!"

Crucial Diagnostic Block Instruction:
At the very end of every Leaf analysis, pest attack, crop disease, or plant deficiency solution, you MUST print this raw block EXACTLY starts with [DIAGNOSIS_START] and ends with [DIAGNOSIS_END]. Do not translate uppercase labels:
[DIAGNOSIS_START]
Crop: <Name of crop in standard English, e.g., Wheat / Potato / Rice / Tomato / Cotton>
Issue: <Identified problem name in simple English, e.g., Leaf Rust / Early Blight / Aphids attack>
Severity: <High / Medium / Low>
Chemical_Remedy: <Specific generic ingredient + brand dose, e.g., Carbendazim 50% WP @ 2.5g per Liter water>
Organic_Remedy: <Zero-cost traditional organic recipe, e.g., Spray neem seed kernel extract (5%) + liquid soap>
Reason: <Primary biological trigger, e.g., Excess moisture during cloudy days or hot dry wind>
Prevention: <Actionable field practice, e.g., Use certified pest-free seed and avoid water logging>
[DIAGNOSIS_END]`;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: updatedMessages,
          systemPrompt
        })
      });

      if (!response.body) {
        throw new Error("No readable response stream arrived from farming backend");
      }

      const botMessageId = generateId();
      
      // Inject initial skeletal bot message
      const streamBotMessage: ChatMessage = {
        id: botMessageId,
        sender: 'assistant',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalSessionsWithPlaceholder = updatedSessions.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...updatedMessages, streamBotMessage]
          };
        }
        return s;
      });

      setSessions(finalSessionsWithPlaceholder);

      // SSE Buffer reading loop
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = "";
      let accumulatedText = "";
      let latestGroundingSources: { uri: string; title: string }[] | undefined = undefined;
      let latestEngineName = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if (value) {
          buffer += decoder.decode(value, { stream: !doneReading });
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || "";

          for (const part of parts) {
            const lines = part.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();
                if (dataStr === '[DONE]') {
                  done = true;
                  break;
                }
                try {
                  const parsed = safeJsonParse<{ error?: string; text?: string; engine?: string; groundingSources?: { uri: string; title: string }[] } | null>(dataStr, null);
                  if (parsed) {
                    if (parsed.error) {
                      accumulatedText = parsed.error;
                      done = true;
                      break;
                    }
                    if (parsed.text) {
                      accumulatedText += parsed.text;
                    }
                    if (parsed.engine) {
                      latestEngineName = parsed.engine;
                    }
                    if (parsed.groundingSources && parsed.groundingSources.length > 0) {
                      latestGroundingSources = parsed.groundingSources;
                    }
                    
                    // Live update active session rendering
                    setSessions(prevSessions => {
                      return prevSessions.map(s => {
                        if (s.id === currentSessionId) {
                          return {
                            ...s,
                            messages: s.messages.map(m => {
                              if (m.id === botMessageId) {
                                return { 
                                  ...m, 
                                  text: accumulatedText,
                                  groundingSources: latestGroundingSources || m.groundingSources,
                                  engine: latestEngineName || m.engine
                                };
                              }
                              return m;
                              })
                          };
                        }
                        return s;
                      });
                    });
                  }
                } catch (e) {
                  // Ignore parse fails on fragmented chunks
                }
              }
            }
          }
        }
      }

      // Synchronize final result into local persistence
      setSessions(prevSessions => {
        const fullyUpdated = prevSessions.map(s => {
          if (s.id === currentSessionId) {
            return {
              ...s,
              messages: s.messages.map(m => {
                if (m.id === botMessageId) {
                  return { 
                    ...m, 
                    text: accumulatedText,
                    groundingSources: latestGroundingSources || m.groundingSources,
                    engine: latestEngineName || m.engine
                  };
                }
                return m;
              })
            };
          }
          return s;
        });
        localStorage.setItem('farming_sessions', JSON.stringify(fullyUpdated));
        return fullyUpdated;
      });

    } catch (err: any) {
      console.error("Diagnostic streaming error:", err);
      // Append fallback error notification
      setSessions(prev => {
        const errorSessions = prev.map(s => {
          if (s.id === currentSessionId) {
            return {
              ...s,
              messages: [
                ...s.messages,
                {
                  id: generateId(),
                  sender: 'assistant',
                  text: `⚠️ Error diagnosing crop condition: ${err.message || "Endpoint connection timed out."}`,
                  timestamp: new Date().toLocaleTimeString()
                }
              ]
            };
          }
          return s;
        });
        localStorage.setItem('farming_sessions', JSON.stringify(errorSessions));
        return errorSessions;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleClearCurrentChat = () => {
    if (!activeSessionId) return;

    // Direct state clearance to fully bypass iframe window.confirm blocking restrictions
    const updated = sessions.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, messages: [] };
      }
      return s;
    });
    saveSessions(updated);
  };

  const currentActiveSession = sessions.find(s => s.id === activeSessionId) || null;

  return (
    <div className="flex h-screen bg-emerald-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar - Desktop Layout */}
      {!isSidebarCollapsed && (
        <div className="hidden lg:block h-full flex-shrink-0 transition-all duration-300">
          <Sidebar
            language={language}
            setLanguage={handleSetLanguage}
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={(id) => {
              setActiveSessionId(id);
              setIsSidebarOpen(false);
            }}
            onCreateSession={handleCreateSession}
            onDeleteSession={handleDeleteSession}
            onClearSessions={handleClearSessions}
          />
        </div>
      )}

      {/* Sidebar - Mobile Sliding Drawer Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Drawer Element */}
      <div 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 h-full bg-slate-950 transition-transform duration-300 transform lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-3 border-b border-emerald-950/30 bg-slate-900/60">
          <span className="text-xs font-bold font-mono text-emerald-500 uppercase tracking-widest">🚜 FARMER TOOL MENU</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 hover:bg-slate-900 text-slate-400 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Sidebar
          language={language}
          setLanguage={handleSetLanguage}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={(id) => {
            setActiveSessionId(id);
            setIsSidebarOpen(false);
          }}
          onCreateSession={handleCreateSession}
          onDeleteSession={handleDeleteSession}
          onClearSessions={handleClearSessions}
        />
      </div>

      {/* Core Dynamic Content Canvas Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Mobile App Header Bar */}
        <div className="lg:hidden px-4 py-3 bg-slate-950 border-b border-emerald-950/30 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-emerald-400 rounded-lg border border-slate-800 transition-colors"
            title="Menu Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <span className="font-sans font-bold text-sm tracking-wide text-white">
            🌾 {TRANSLATIONS[language].appName}
          </span>

          {/* Removed upper right language badge for a cleaner, unified farmer layout */}
          <div className="w-8"></div>
        </div>

        {/* Main Conversation viewport component */}
        <ChatArea
          language={language}
          messages={currentActiveSession ? currentActiveSession.messages : []}
          isStreaming={isStreaming}
          onSendMessage={handleSendMessage}
          onClearChat={handleClearCurrentChat}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>
    </div>
  );
}
