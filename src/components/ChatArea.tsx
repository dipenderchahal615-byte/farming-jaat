import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Language, TRANSLATIONS } from '../types';
import { 
  Send, Sparkles, Image, Check, AlertTriangle, FileText, 
  Volume2, VolumeX, Mic, MicOff, RefreshCw, Printer, User, Sprout, ShieldAlert, HeartPulse, X, ClipboardCheck
} from 'lucide-react';

interface ChatAreaProps {
  language: Language;
  messages: ChatMessage[];
  isStreaming: boolean;
  onSendMessage: (text: string, image?: string, imageType?: 'image' | 'video') => void;
  onClearChat: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

// Custom Speech Recognition interface declaration for TypeScript
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
  };
}

interface WebkitSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => WebkitSpeechRecognition;
    SpeechRecognition?: new () => WebkitSpeechRecognition;
  }
}

interface DiagnosisReport {
  crop: string;
  issue: string;
  severity: string;
  chemicalRemedy: string;
  organicRemedy: string;
  reason: string;
  prevention: string;
}

export default function ChatArea({
  language,
  messages,
  isStreaming,
  onSendMessage,
  onClearChat,
  isSidebarCollapsed,
  onToggleSidebar
}: ChatAreaProps) {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<'image' | 'video' | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const speakingUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const t = TRANSLATIONS[language];

  // Auto Scroll on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Initialize Speech-to-Text SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      // Set recognition grammar language
      if (language === 'hi') rec.lang = 'hi-IN';
      else if (language === 'pa') rec.lang = 'pa-IN';
      else rec.lang = 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onresult = (e: SpeechRecognitionEvent) => {
        const transcript = e.results[0][0].transcript;
        setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
      };
      rec.onerror = (err: any) => console.warn("Speech recognition error:", err);
      rec.onend = () => setIsListening(false);

      recognitionRef.current = rec;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please use Chrome or Android web browsers.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (language === 'hi') recognitionRef.current.lang = 'hi-IN';
      else if (language === 'pa') recognitionRef.current.lang = 'pa-IN';
      else recognitionRef.current.lang = 'en-US';

      recognitionRef.current.start();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setSelectedMediaType(isVideo ? 'video' : 'image');
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSelectedMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = () => {
    if (!inputText.trim() && !selectedImage) return;

    onSendMessage(inputText, selectedImage || undefined, selectedMediaType || undefined);
    setInputText('');
    setSelectedImage(null);
    setSelectedMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleQuickPrompt = (prompt: string) => {
    onSendMessage(prompt);
  };

  // Speaks assistant text in localized voice synthesis
  const speakMessage = (messageId: string, fullText: string) => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    if (currentlySpeakingId === messageId) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Remove diagnostic blocks prior to reading
    const scrubbed = fullText.replace(/\[DIAGNOSIS_START\][\s\S]*?\[DIAGNOSIS_END\]/g, '').trim();

    const utterance = new SpeechSynthesisUtterance(scrubbed);
    
    // Choose appropriate voice context if found
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'pa') utterance.lang = 'pa-IN';
    else utterance.lang = 'en-US';

    utterance.onend = () => setCurrentlySpeakingId(null);
    utterance.onerror = () => setCurrentlySpeakingId(null);

    speakingUtteranceRef.current = utterance;
    setCurrentlySpeakingId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  // Parse structured diagnosis tag data blocks
  const parseDiagnosisBlock = (text: string): { cleanText: string; report: DiagnosisReport | null } => {
    const startIndex = text.indexOf('[DIAGNOSIS_START]');
    const endIndex = text.indexOf('[DIAGNOSIS_END]');

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const cleanText = text.slice(0, startIndex) + text.slice(endIndex + '[DIAGNOSIS_END]'.length);
      const block = text.slice(startIndex + '[DIAGNOSIS_START]'.length, endIndex).trim();

      const lines = block.split('\n');
      const report: Partial<DiagnosisReport> = {};

      lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const keyRaw = line.slice(0, colonIndex).trim().toLowerCase();
          const keyClean = keyRaw.replace(/[^a-z0-9_]/g, '');
          const value = line.slice(colonIndex + 1).replace(/^\s*[*-]\s*/, '').trim(); // strip leading bullet markers from value too

          if (keyClean === 'crop') report.crop = value;
          else if (keyClean === 'issue' || keyClean === 'problem') report.issue = value;
          else if (keyClean === 'severity') report.severity = value;
          else if (keyClean === 'chemical_remedy' || keyClean === 'chemicalremedy') report.chemicalRemedy = value;
          else if (keyClean === 'organic_remedy' || keyClean === 'organicremedy' || keyClean === 'natural_remedy' || keyClean === 'naturalremedy') report.organicRemedy = value;
          else if (keyClean === 'reason' || keyClean === 'cause') report.reason = value;
          else if (keyClean === 'prevention') report.prevention = value;
        }
      });

      // Default fallbacks in case some field keys were somehow skipped by LLM
      const finalizedReport: DiagnosisReport = {
        crop: report.crop || (language === 'hi' ? 'फसल' : language === 'pa' ? 'ਫਸਲ' : 'Crop'),
        issue: report.issue || (language === 'hi' ? 'समस्या पाई गई' : language === 'pa' ? 'ਬਿਮਾਰੀ' : 'Issue Detected'),
        severity: report.severity || 'Medium',
        chemicalRemedy: report.chemicalRemedy || (language === 'hi' ? 'विवरण समीक्षा में देखें' : language === 'pa' ? 'ਵੇਰਵੇ ਵਿੱਚ ਦੇਖੋ' : 'Check text details'),
        organicRemedy: report.organicRemedy || (language === 'hi' ? 'देशी उपाय विवरण में देखें' : language === 'pa' ? 'ਦੇਸੀ ਉਪਾਅ ਵੇਰਵੇ ਵਿੱਚ ਦੇਖੋ' : 'Check organic details'),
        reason: report.reason || 'N/A',
        prevention: report.prevention || (language === 'hi' ? 'उचित कृषि विधियाँ अपनाएँ' : language === 'pa' ? 'ਉਚਿਤ ਖੇਤੀ ਵਿਧੀ ਅਪਣਾਓ' : 'Follow standard care procedures')
      };

      return {
        cleanText: cleanText.trim(),
        report: finalizedReport
      };
    }

    return { cleanText: text, report: null };
  };

  // Formatted printing facility for crop sheets with high defense
  const printReport = (report: DiagnosisReport) => {
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${t.diagnosticReport} - ${report.crop}</title>
              <style>
                body { font-family: system-ui, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
                .header { border-bottom: 2px solid #059669; padding-bottom: 15px; margin-bottom: 30px; text-align: center; }
                .header h1 { color: #065f46; font-size: 26px; margin: 0; }
                .header p { color: #047857; margin: 5px 0 0 0; font-size: 14px; font-weight: bold; }
                .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 30px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .meta-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 20px; }
                .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; font-family: monospace; }
                .val { font-size: 16px; font-weight: bold; color: #020617; margin-top: 5px; }
                .severity-high { color: #dc2626; }
                .severity-medium { color: #d97706; }
                .severity-low { color: #16a34a; }
                .section-heading { color: #065f46; font-size: 15px; margin: 20px 0 8px 0; border-left: 4px solid #059669; padding-left: 8px; }
                .section-content { font-size: 14px; line-height: 1.6; margin-bottom: 15px; color: #334155; }
                .footer { text-align: center; font-size: 10px; color: #94a3b8; font-family: monospace; border-top: 1px solid #f1f5f9; padding-top: 15px; margin-top: 40px; }
              </style>
            </head>
            <body onload="window.print()">
              <div class="header">
                <h1>🌾 ${t.diagnosticReport}</h1>
                <p>${t.appName} - Agriculture AI Assistant</p>
              </div>
              
              <div class="card">
                <div class="meta-grid">
                  <div>
                    <div class="label">${t.cropName}</div>
                    <div class="val">${report.crop}</div>
                  </div>
                  <div>
                    <div class="label">${t.severity}</div>
                    <div class="val ${report.severity.toLowerCase().includes('high') ? 'severity-high' : report.severity.toLowerCase().includes('medium') ? 'severity-medium' : 'severity-low'}">${report.severity}</div>
                  </div>
                </div>
                
                <div>
                  <div class="label">${t.problemDetected}</div>
                  <div class="val" style="color: #0d9488; font-size: 17px; margin-bottom: 15px;">${report.issue}</div>
                </div>

                <div class="section-heading">🏥 ${t.treatment}</div>
                <div class="section-content">${report.chemicalRemedy}</div>

                <div class="section-heading">🌿 ${t.naturalRemedy}</div>
                <div class="section-content">${report.organicRemedy}</div>

                <div class="section-heading">🔍 ${t.cropName} Problem Reason</div>
                <div class="section-content">${report.reason}</div>

                <div class="section-heading">🛡️ ${t.prevention}</div>
                <div class="section-content">${report.prevention}</div>
              </div>

              <div class="footer">
                DESI FARMING GPT • PRINTED VIA WEBSPACE INTEGRATED BROWSER FLOW
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        alert(language === 'hi' ? 'कृपया पॉप-अप ब्लॉकर्स को अनुमति दें ताकि किसान मित्र रिपोर्ट प्रिंट हो सके।' : 'Please allow browser popup blockers to enable Kisan Mitra report printing.');
      }
    } catch (err) {
      console.warn("Popup blocked by sandboxed iframe environment, fallback directly to window print:", err);
      window.print();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full chat-gradient relative">
      {/* Top Bar Navigation Info */}
      <header className="h-16 px-5 flex items-center justify-between border-b border-emerald-100 bg-emerald-50/45 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse hidden lg:block"></span>
          <span className="text-xs sm:text-[14px] font-bold font-sans text-emerald-950 flex items-center gap-1.5">
            👨‍🌾 {language === 'hi' ? 'किसान मित्र (Kisan Mitra)' : language === 'pa' ? 'ਕਿਸਾਨ ਮਿੱਤਰ (Kisan Mitra)' : 'Kisan Mitra AI'}
            <span className="text-[9px] bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-950 px-1.5 py-0.5 rounded-md font-black tracking-wider border border-amber-300 shadow-sm ml-1">PRO</span>
          </span>
        </div>

        <button 
          onClick={onClearChat}
          className="text-[11px] bg-white hover:bg-red-50 text-emerald-850 hover:text-red-700 font-bold px-3 py-1.5 rounded-xl border border-emerald-200/50 transition-all shadow-sm cursor-pointer"
        >
          {language === 'hi' ? 'बातचीत साफ करें' : language === 'pa' ? 'ਗੱਲਬਾਤ ਸਾਫ਼ ਕਰੋ' : 'Reset Conversation'}
        </button>
      </header>

      {/* Main Messages Workspace */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
        
        {/* Welcome Empty Dashboard */}
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto space-y-8 mt-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-leaf flex items-center justify-center text-white mx-auto shadow-md border border-emerald-400/30">
                <Sprout className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight pt-2">
                {t.welcomeTitle}
              </h2>
              <p className="text-xs text-gray-600 leading-normal max-w-lg mx-auto font-medium">
                {t.welcomeSubtitle}
              </p>
            </div>

            {/* Quick Informative cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-sm relative group hover:border-emerald-300 hover:shadow transition-all">
                <span className="text-lg block">📸</span>
                <h3 className="text-xs font-bold text-emerald-900 mt-2">
                  {t.cardDiseaseTitle}
                </h3>
                <p className="text-[10px] text-gray-600 leading-normal mt-1">
                  {t.cardDiseaseDesc}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-sm relative group hover:border-emerald-300 hover:shadow transition-all">
                <span className="text-lg block">🌾</span>
                <h3 className="text-xs font-bold text-emerald-900 mt-2">
                  {t.cardFertTab}
                </h3>
                <p className="text-[10px] text-gray-600 leading-normal mt-1">
                  {t.cardFertDesc}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-sm relative group hover:border-emerald-300 hover:shadow transition-all">
                <span className="text-lg block">📈</span>
                <h3 className="text-xs font-bold text-emerald-900 mt-2">
                  {t.cardMandiTab}
                </h3>
                <p className="text-[10px] text-gray-600 leading-normal mt-1">
                  {t.cardMandiDesc}
                </p>
              </div>
            </div>

            {/* Farmer Prompt Pills */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider font-mono text-center">
                📊 {language === 'hi' ? 'जल्दी पूछने के लिए कोई प्रश्न चुनें' : language === 'pa' ? 'ਤੇਜ਼ੀ ਨਾਲ ਪੁੱਛਣ ਲਈ ਸਵਾਲ ਚੁਣੋ' : 'Tap to ask instantly'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => handleQuickPrompt(language === 'hi' ? 'मेरी फसल के पत्ते पीले पड़ रहे हैं, इलाज क्या है?' : language === 'pa' ? 'ਮੇਰੀ ਫਸਲ ਦੇ ਪੱਤੇ ਪੀਲੇ ਪੈ ਰਹੇ ਹਨ, ਇਲਾਜ ਕੀ ਹੈ?' : 'My crop leaves are turning yellow, what is the treatment?')}
                  className="bg-emerald-50 hover:bg-emerald-100 text-[11px] font-semibold text-emerald-800 px-3 py-2 rounded-full border border-emerald-200 transition-all text-left shadow-sm cursor-pointer"
                >
                  🍃 {language === 'hi' ? 'पत्ते पीले पड़ना' : language === 'pa' ? 'ਪੱਤੇ ਪੀਲੇ ਪੈਣਾ' : 'Yellowing Leaves'}
                </button>
                <button
                  onClick={() => handleQuickPrompt(language === 'hi' ? 'गेंहू में पहली यूरिया खाद कब डालनी चाहिए?' : language === 'pa' ? 'ਕਣਕ ਵਿੱਚ ਪਹਿਲੀ ਯੂਰੀਆ ਖਾਦ ਕਦੋਂ ਪਾਉਣੀ ਚਾਹੀਦੀ ਹੈ?' : 'When to apply the first urea fertilizer in wheat?')}
                  className="bg-emerald-50 hover:bg-emerald-100 text-[11px] font-semibold text-emerald-800 px-3 py-2 rounded-full border border-emerald-200 transition-all text-left shadow-sm cursor-pointer"
                >
                  🌾 {language === 'hi' ? 'गेहूं में यूरिया सूझाव' : language === 'pa' ? 'ਕਣਕ ਯੂਰੀਆ ਸਲਾਹ' : 'Wheat Urea timing'}
                </button>
                <button
                  onClick={() => handleQuickPrompt(language === 'hi' ? 'टमाटर में झुलसा रोग (blight) का उपचार बताएं' : language === 'pa' ? 'ਟਮਾਟਰ ਵਿੱਚ ਝੁਲਸ ਰੋਗ (blight) ਦਾ ਇਲਾਜ ਦੱਸੋ' : 'What is the treatment for tomato blight?')}
                  className="bg-emerald-50 hover:bg-emerald-100 text-[11px] font-semibold text-emerald-800 px-3 py-2 rounded-full border border-emerald-200 transition-all text-left shadow-sm cursor-pointer"
                >
                  🍅 {language === 'hi' ? 'टमाटर झुलसा रोग' : language === 'pa' ? 'ਟਮਾਟਰ ਝੁਲਸ ਰੋਗ' : 'Tomato Blight'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message bubbles list */}
        {messages.map((msg) => {
          const isMe = msg.sender === 'user';
          // Extract diagnosis blocks
          const { cleanText, report } = parseDiagnosisBlock(msg.text);

          return (
            <div
              key={msg.id}
              className={`flex gap-4 max-w-3xl mx-auto ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar Column */}
              {!isMe && (
                <div className="w-8 h-8 rounded-lg bg-leaf text-white flex items-center justify-center flex-shrink-0 border border-emerald-400/30 shadow-sm">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                </div>
              )}

              {/* Message Wrapper */}
              <div id={`msg-${msg.id}`} className={`space-y-3.5 max-w-[85%] ${isMe ? 'order-1' : 'order-2'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed transition-all shadow-md ${
                    isMe
                      ? 'bg-emerald-700 text-white rounded-tr-none shadow-emerald-900/10'
                      : 'bg-white border border-emerald-100 text-gray-800 rounded-tl-none whitespace-pre-wrap font-sans'
                  }`}
                >
                  {/* Photo/Video Display if attached */}
                  {msg.image && (
                    <div className="relative mb-2.5 max-w-sm rounded-lg overflow-hidden border border-emerald-100 shadow-sm bg-black">
                      {msg.imageType === 'video' ? (
                        <video 
                          src={msg.image} 
                          controls
                          className="w-full h-auto max-h-56 rounded bg-black"
                          playsInline
                        />
                      ) : (
                        <img 
                          src={msg.image} 
                          alt="Crop Diagnostic Leaf" 
                          className="w-full h-auto object-cover max-h-56"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  )}

                  {/* Bubble Content Text */}
                  <span className="block">{cleanText}</span>

                  {/* Engine/Model info badge underneath text */}
                  {msg.engine && (
                    <div className="mt-2.5 pt-1.5 border-t border-emerald-105/40 text-[10px] font-mono text-emerald-800 flex items-center gap-1.5 font-medium">
                      <span>🛠️ {language === 'hi' ? 'फोटो विश्लेषक तकनीक:' : language === 'pa' ? 'ਫੋਟੋ ਵਿਸ਼ਲੇਸ਼ਣ ਤਕਨਾਲੋਜੀ:' : 'Analysis Tool:'}</span>
                      <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-emerald-900 font-semibold">{msg.engine}</span>
                    </div>
                  )}

                  {/* Search Grounding references list if found */}
                  {msg.groundingSources && msg.groundingSources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-dashed border-emerald-100 text-[11px] text-emerald-800">
                      <span className="font-bold flex items-center gap-1 mb-1">
                        🌐 Real-time Internet Sources (खोज संदर्भ):
                      </span>
                      <div className="flex flex-wrap gap-1.5 matches-sources-panel">
                        {msg.groundingSources.map((src, idx) => (
                          <a
                            key={idx}
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 rounded px-2 py-0.5 text-[10px] font-semibold text-emerald-800 underline active:scale-95 transition-all inline-block truncate max-w-xs"
                            title={src.title}
                          >
                            🔗 {src.title || "Ref"}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Read message audio button and print */}
                  {!isMe && cleanText && (
                    <div className="flex gap-2.5 mt-3 border-t border-gray-100 pt-2.5 justify-end">
                      <button
                        onClick={() => speakMessage(msg.id, msg.text)}
                        className={`text-[10px] font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors border ${
                          currentlySpeakingId === msg.id
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-emerald-50/55 hover:bg-emerald-100 text-emerald-700 border-emerald-200/50'
                        }`}
                        title={t.speakText}
                      >
                        {currentlySpeakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            {t.stopReading}
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            {t.speakText}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Highly structured AI Diagnosis Card sheet if parsed successfully */}
                {report && (
                  <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-sm result-card mt-3">
                    <div className="border-b border-emerald-50 pb-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4.5 h-4.5 text-emerald-600 animate-pulse" />
                        <h4 className="font-sans font-bold text-sm text-emerald-800 uppercase tracking-wide">
                          🌿 {t.diagnosticReport}
                        </h4>
                      </div>

                      <button
                        onClick={() => printReport(report)}
                        className="text-[10px] bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 px-2.5 py-1 text-emerald-700 rounded-md font-semibold transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Printer className="w-3 h-3" />
                        {t.printReport}
                      </button>
                    </div>

                    <div className="space-y-3.5 pt-4">
                      {/* Grid Metadata */}
                      <div className="grid grid-cols-2 gap-3.5 border-b border-gray-100 pb-3">
                        <div>
                          <span className="block text-[10px] text-emerald-700 uppercase font-mono tracking-wider font-bold">{t.cropName}</span>
                          <span className="block text-xs font-bold text-gray-900 mt-0.5">{report.crop}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-emerald-700 uppercase font-mono tracking-wider font-bold">{t.severity}</span>
                          <span className={`inline-block text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded ${
                            report.severity.toLowerCase().includes('high') ? 'bg-red-50 text-red-600 border border-red-200' :
                            report.severity.toLowerCase().includes('medium') ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                            'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          }`}>
                            {report.severity}
                          </span>
                        </div>
                      </div>

                      {/* Diagnostic issue detail */}
                      <div>
                        <span className="block text-[10px] text-emerald-700 uppercase font-mono tracking-wider font-bold">{t.problemDetected}</span>
                        <div className="flex items-start gap-1.5 mt-1 text-xs text-red-600 font-bold leading-normal">
                          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 pt-0.5" />
                          <span>{report.issue}</span>
                        </div>
                      </div>

                      {/* Remedies block split columns */}
                      <div className="space-y-3 pt-1">
                        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4">
                          <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                            <ClipboardCheck className="w-3.5 h-3.5 text-emerald-700" />
                            💊 {t.treatment}
                          </span>
                          <p className="text-xs text-gray-700 leading-relaxed mt-1 font-medium">
                            {report.chemicalRemedy}
                          </p>
                        </div>

                        <div className="bg-teal-50/60 border border-teal-100 rounded-xl p-4">
                          <span className="block text-[10px] font-bold text-teal-800 uppercase tracking-wide flex items-center gap-1">
                            <Sprout className="w-3.5 h-3.5 text-teal-700" />
                            🍃 {t.naturalRemedy}
                          </span>
                          <p className="text-xs text-gray-700 leading-relaxed mt-1 font-medium">
                            {report.organicRemedy}
                          </p>
                        </div>
                      </div>

                      {/* Prevention and cause split */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1 text-xs text-gray-600 leading-normal">
                        <div>
                          <strong className="text-gray-800 block mb-0.5">⚠️ Reason / Cause:</strong>
                          {report.reason}
                        </div>
                        <div>
                          <strong className="text-emerald-700 block mb-0.5">🛡️ {t.prevention}:</strong>
                          {report.prevention}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {isMe && (
                <div className="w-8 h-8 rounded-lg bg-emerald-600 border border-emerald-500/20 text-white flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Streaming Placeholder Caret */}
        {isStreaming && (
          <div className="flex gap-4 max-w-3xl mx-auto justify-start">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center flex-shrink-0 animate-spin shadow-sm">
              <RefreshCw className="w-3.5 h-3.5" />
            </div>
            <div className="p-4 rounded-xl bg-white border border-emerald-100 text-gray-700 text-xs sm:text-[13px] rounded-tl-none shadow-sm">
              <span className="inline-block w-2.5 h-4 bg-emerald-600 text-transparent animate-pulse rounded-sm">|</span>
              <span className="ml-1.5 italic text-gray-400 font-mono">{t.generatingResponse || 'Generative Agricultural reasoning...'}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Mic Audio listening overlay status */}
      {isListening && (
        <div className="absolute inset-x-0 bottom-24 flex justify-center z-10">
          <div className="bg-emerald-50 border border-emerald-200/80 px-4 py-2 rounded-full flex items-center gap-2 select-none shadow-md animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[11px] text-emerald-800 font-sans font-bold">
              🎤 {t.voiceActive}
            </span>
          </div>
        </div>
      )}

      {/* Main Bottom User Input Bar */}
      <footer className="p-4 bg-white border-t border-emerald-100">
        <div className="max-w-3xl mx-auto space-y-3">
          
          {/* Previews attached crop image/video */}
          {selectedImage && (
            <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-emerald-100 rounded-lg relative shadow-sm">
              {selectedMediaType === 'video' ? (
                <video 
                  src={selectedImage} 
                  className="w-14 h-14 object-cover rounded bg-black"
                  muted
                  playsInline
                />
              ) : (
                <img 
                  src={selectedImage} 
                  alt="Upload Attachment Preview" 
                  className="w-14 h-14 object-cover rounded"
                  referrerPolicy="no-referrer"
                />
              )}
              <button
                onClick={clearImage}
                className="p-1 hover:bg-red-50 rounded-md text-red-500 hover:text-red-600 absolute -top-1.5 -right-1.5 bg-white border border-red-100 shadow-sm cursor-pointer"
                title="Remove attachment"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex bg-white border border-emerald-200/80 hover:border-emerald-300 rounded-2xl items-center p-1.5 shadow-sm focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-all">
            {/* Gallery Picker Trigger */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
              title="Upload Crop Photo/Video"
            >
              <Image className="w-5 h-5" />
            </button>
            
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*,video/*"
              className="hidden"
            />

            {/* Core Text input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.inputPlaceholder}
              disabled={isStreaming}
              className="flex-1 text-xs sm:text-[13px] text-gray-900 placeholder-gray-400 bg-transparent py-2 px-3 focus:outline-none focus:ring-0 disabled:opacity-50"
            />

            {/* Microphone Trigger */}
            <button
              onClick={toggleListening}
              className={`p-2 transition-all rounded-xl cursor-pointer ${
                isListening
                  ? 'bg-red-50 text-red-500 shadow-inner border border-red-100'
                  : 'text-gray-500 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
              title="Voice Speech Input"
            >
              {isListening ? <Mic className="w-5 h-5 animate-bounce" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Sender Button */}
            <button
              onClick={handleSend}
              disabled={isStreaming || (!inputText.trim() && !selectedImage)}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-100 text-white disabled:text-gray-300 rounded-xl transition-all font-bold active:scale-95 disabled:scale-100 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed shadow-sm shadow-emerald-900/10"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] text-center text-gray-400 leading-normal italic">
            * Our Agriculture Diagnosis is verified through AI Vision models. Validate chemical treatments against region university manuals before spraying.
          </p>
        </div>
      </footer>
    </div>
  );
}
