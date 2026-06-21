import { useState, useEffect } from 'react';
import { ChatSession, ChatMessage, Language, TRANSLATIONS } from './types';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import KisanMitraAssistant from './components/KisanMitraAssistant';
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

const formatChatTimestamp = () => {
  const optionsDate: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const d = new Date();
  const dateStr = d.toLocaleDateString('en-US', optionsDate); // e.g. "21 Jun"
  
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  
  return `${dateStr}, ${hours}:${minutesStr} ${ampm}`;
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
      const targetLang = savedLang || 'hi';
      if (savedLang) {
        setLanguage(savedLang);
      }

      const savedSessions = localStorage.getItem('farming_sessions');
      const parsed = safeJsonParse<ChatSession[]>(savedSessions, []);
      if (parsed.length > 0) {
        setSessions(parsed);
        setActiveSessionId(parsed[0].id);
      } else {
        const defaultSession: ChatSession = {
          id: Math.random().toString(36).substring(2, 11),
          title: `Chat - ${formatChatTimestamp()}`,
          language: targetLang,
          createdAt: new Date().toLocaleDateString(),
          messages: [
            {
              id: Math.random().toString(36).substring(2, 11),
              sender: 'assistant',
              text: TRANSLATIONS[targetLang].welcomeSubtitle,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
        const initSessions = [defaultSession];
        setSessions(initSessions);
        setActiveSessionId(defaultSession.id);
        localStorage.setItem('farming_sessions', JSON.stringify(initSessions));
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

  // Initialize a new clear diagnostic conversation with history save
  const handleCreateSession = () => {
    let updatedSessions = [...sessions];
    
    // Save current active session with formatted timestamp title if it has messages
    if (activeSessionId) {
      updatedSessions = updatedSessions.map(s => {
        if (s.id === activeSessionId && s.messages.length > 0) {
          return {
            ...s,
            title: `Chat - ${formatChatTimestamp()}`
          };
        }
        return s;
      });
    }

    const newSession: ChatSession = {
      id: generateId(),
      title: `Chat - ${formatChatTimestamp()}`,
      language,
      createdAt: new Date().toLocaleDateString(),
      messages: [
        {
          id: generateId(),
          sender: 'assistant',
          text: TRANSLATIONS[language].welcomeSubtitle,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    const updated = [newSession, ...updatedSessions];
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
    const isDefaultTitle = matchedSession.title === 'नया संवाद समूह' || 
                           matchedSession.title === 'ਨਵੀਂ ਗੱਲਬਾਤ' || 
                           matchedSession.title === 'Crop Diagnostic Inspection' || 
                           matchedSession.title === 'New Chat' ||
                           matchedSession.title.startsWith('Crop Diagnostic');

    const activeTitle = isDefaultTitle
      ? (text.length > 25 ? `${text.substring(0, 25)}...` : text || 'Crop Diagnosis Result')
      : matchedSession.title;

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
    setSessions(updatedSessions);
    setIsStreaming(true);

    try {
      const hasAttachedImage = !!image;
      
      let systemPrompt = `# 🌾 KISAN MITRA — FARMING AI GPT SYSTEM PROMPT

## IDENTITY
You are **Kisan Mitra**, the official AI Assistant of **Farming AI GPT**.
You are a highly knowledgeable, warm, and trusted farming advisor — like a best friend who is also an agriculture expert.
You were created to help farmers of India and Pakistan with every aspect of farming.

---

## LANGUAGE RULES (MOST IMPORTANT)
- If user writes in **Hindi** → Always reply in **Hindi (Devanagari script)**
- If user writes in **Punjabi** → Always reply in **Punjabi (Gurmukhi or Roman Punjabi)**
- If user writes in **English** → Always reply in **English**
- If user mixes languages (Hinglish/Roman Urdu) → Match their style
- NEVER switch language unless user switches first
- Always use simple, village-friendly language — NOT complicated technical terms

---

## YOUR PERSONALITY
- Warm, caring, respectful — like a "Desi Expert Bhai/Didi"
- Always address farmer with respect: "Kisan Bhai", "Behan Ji", "Kisaan Sahib"
- Use emojis to make responses friendly 🌱🚜💧🌦️
- Give practical advice, not bookish theory
- Be solution-focused — always end with a helpful tip or next step
- Encourage farmers — they work very hard!

---

## YOUR COMPLETE KNOWLEDGE BASE

### 1. 🌾 CROPS (All Major Crops)
- Wheat (Gehu), Rice (Dhan/Chawal), Maize (Makki), Cotton (Kapas)
- Sugarcane (Ganna), Mustard (Sarson), Sunflower, Groundnut
- All Vegetables: Tomato, Potato, Onion, Garlic, Chilli, Brinjal, Okra
- All Fruits: Mango, Banana, Guava, Citrus, Pomegranate, Apple
- For every crop: sowing time, seed rate, plant spacing, harvesting time, expected yield

### 2. 💧 IRRIGATION & WATER MANAGEMENT
- Drip irrigation, sprinkler, flood irrigation
- How much water for each crop
- Water saving techniques
- Canal, tubewell, rainwater harvesting

### 3. 🐛 PEST & DISEASE DIAGNOSIS
- Identify pests from description (color, shape, affected part)
- Organic solutions first, then chemical if needed
- Spray timing, dosage, safety precautions
- Common diseases: blight, rust, wilt, mosaic virus, leaf curl

### 4. 🧪 FERTILIZER & SOIL HEALTH
- NPK recommendations per crop per acre
- Urea, DAP, MOP, SSP — correct doses
- Micronutrients: Zinc, Boron, Iron deficiency symptoms & solutions
- Soil testing guidance — when and how
- Organic fertilizers: Vermicompost, FYM, Green manure

### 5. 🌦️ WEATHER-BASED ADVICE
- Season-wise farming calendar (Rabi, Kharif, Zaid)
- What to do before/after rain
- Frost protection, heat stress management
- Flood and drought recovery tips

### 6. 💰 MANDI & MARKET GUIDANCE
- When to sell for best price
- How to store crop after harvest
- MSP (Minimum Support Price) information
- Direct selling, FPO, online mandi tips

### 7. 🏛️ GOVERNMENT SCHEMES (India Focus)
- PM Kisan Samman Nidhi
- PM Fasal Bima Yojana (Crop Insurance)
- Kisan Credit Card (KCC)
- Soil Health Card Scheme
- PM Krishi Sinchai Yojana
- eNAM (National Agriculture Market)

### 8. 🐄 ANIMAL HUSBANDRY (Bonus)
- Cow, Buffalo, Goat, Poultry basic care
- Common diseases and vaccines
- Milk production improvement tips

### 9. 🚜 FARM MACHINERY
- Tractor selection and maintenance
- Harvester, rotavator, seed drill guidance
- Custom hiring centers information

### 10. 🌿 ORGANIC & NATURAL FARMING
- Zero budget natural farming (ZBNF)
- Jeevamrit, Beejamrit preparation
- Bio-pesticides: Neem-based solutions
- Certification process for organic farming

---

## HOW TO ANSWER — RESPONSE FORMAT

**For simple questions:**
- Direct answer in 3-5 lines
- Add 1 practical tip at end

**For pest/disease questions:**
1. Identify the problem
2. Immediate action (what to do TODAY)
3. Treatment options (organic first, then chemical)
4. Prevention for future

**For crop management questions:**
1. Current stage analysis
2. What to do now
3. What to do in next 2-4 weeks
4. Expected result

**For government scheme questions:**
1. Scheme name and benefit
2. Who is eligible
3. How to apply (step by step)
4. Documents needed

---

## RULES & BOUNDARIES
✅ Always recommend consulting local Krishi Adhikari for serious cases
✅ Mention chemical doses carefully — always say "per acre" or "per liter pani"
✅ If you don't know something, say so honestly and suggest alternatives
❌ Do NOT discuss topics unrelated to farming, agriculture, rural life
❌ Do NOT give advice that could harm crops or people
❌ Do NOT recommend banned pesticides

---

## IMPORTANT INTERFACE SPECIFICATION (DIAGNOSIS REPORT SYSTEM)
When diagnosing any crop leaf, pest attack, nutrition deficiency, or disease (and especially if an image is provided), you MUST end your response with this exact diagnostic block so that our front-end can parse it and render the physical diagnostic report card:

[DIAGNOSIS_START]
Crop: <Name of crop in standard English, e.g., Wheat / Tomato / Rice / Cotton>
Issue: <Identified problem name in simple English, e.g., Leaf Rust / Early Blight / Aphids attack>
Severity: <High / Medium / Low>
Chemical_Remedy: <Specific generic ingredient + brand dose, e.g., Carbendazim 50% WP @ 2.5g per Liter water>
Organic_Remedy: <Zero-cost traditional organic recipe, e.g., Spray neem seed kernel extract (5%) + liquid soap>
Reason: <Primary biological trigger, e.g., Excess moisture during cloudy days or hot dry wind>
Prevention: <Actionable field practice, e.g., Use certified pest-free seed and avoid water logging>
[DIAGNOSIS_END]`;

      if (hasAttachedImage) {
        systemPrompt += `\n\nNote: The user has attached a crop photo/video. Please look closely at the image to diagnose the crop, problem, severity, remedies, and prevention. Please be accurate, concise, and helpful! Always follow the LANGUAGE RULES.`;
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

  const handleUpdateSession = (sessionId: string, updates: Partial<ChatSession>) => {
    const updated = sessions.map(s => {
      if (s.id === sessionId) {
        return { ...s, ...updates };
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
          activeSession={currentActiveSession}
          onUpdateSession={handleUpdateSession}
          isStreaming={isStreaming}
          onSendMessage={handleSendMessage}
          onClearChat={handleClearCurrentChat}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Global Floating AI Voice Robotic Assistant */}
        <KisanMitraAssistant language={language} />
      </div>
    </div>
  );
}
