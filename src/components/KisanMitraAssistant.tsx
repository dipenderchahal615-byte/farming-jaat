import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Volume2, VolumeX, Mic, MicOff, Send, X, 
  Sparkles, Play, Square, Loader2, ArrowRight, AlertCircle, RefreshCw
} from 'lucide-react';
import { Language } from '../types';

interface KisanMitraAssistantProps {
  language: Language;
}

interface AssistantMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
}

const KISAN_MITRA_SYSTEM_PROMPT = `You are Kisan Mitra, voice assistant for Farming AI GPT.
You help Indian farmers. Keep answers SHORT (2-4 lines max) because 
you will speak the answer out loud. 
- Reply in same language as user (Hindi/Punjabi/English)
- Use simple words a farmer can understand
- Give practical farming advice only
- Start every reply with "Kisan Bhai" or "Ji haan"`;

// Premium 3D-style Farmer Robotic Avatar with animated glow, eyes, straw hat, body, halo, and speech waves
interface FarmerRobotAvatarProps {
  isListening: boolean;
  isSpeaking: boolean;
  size: number;
}

function FarmerRobotAvatar({ isListening, isSpeaking, size }: FarmerRobotAvatarProps) {
  return (
    <div 
      className="relative flex items-center justify-center select-none animate-[bodyFloat_3s_infinite_ease-in-out]"
      style={{ width: size, height: size }}
    >
      {/* 1. Halo pulsing ring around the launcher avatar when listening or speaking */}
      {isListening && (
        <div className="absolute inset-0 rounded-full border border-emerald-500/85 bg-emerald-500/10 animate-[listenRingGlow_2s_infinite_ease-in-out]" />
      )}
      {/* Halo pulse outer glow ring */}
      {isListening && (
        <div className="absolute -inset-2 rounded-full border border-emerald-500/30 animate-pulse" />
      )}

      {/* Golden ring border around the avatar */}
      <div 
        className={`rounded-full border-4 border-[#F9A825] overflow-hidden flex items-center justify-center bg-white shadow-xl transition-all duration-300 ${
          isListening ? 'ring-8 ring-[#F9A825]/40 scale-105' : isSpeaking ? 'ring-4 ring-emerald-500/30' : ''
        }`}
        style={{ width: size - 8, height: size - 8 }}
      >
        <img 
          src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png" 
          alt="Kisan Mitra Avatar" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Floating active pulsing expander ring */}
      {isListening && (
        <div className="absolute inset-0 rounded-full border-2 border-[#F9A825]/60 animate-ping pointer-events-none -z-10" />
      )}
    </div>
  );
}

export default function KisanMitraAssistant({ language }: KisanMitraAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputText, setInputText] = useState('');
  
  // Operational States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(true);
  const [errorText, setErrorText] = useState('');
  
  // Voice flow status: idle, listening, user-speaking, understanding, processing, ai-speaking
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'user-speaking' | 'understanding' | 'processing' | 'ai-speaking'>('idle');

  // Refs to prevent stale-closure bugs in Web Speech event listeners of SpeechRecognition / Synthesis
  const isVoiceModeActiveRef = useRef(true);
  const isGeneratingRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const isListeningRef = useRef(false);
  const isOpenRef = useRef(false);
  const voiceStatusRef = useRef<'idle' | 'listening' | 'user-speaking' | 'understanding' | 'processing' | 'ai-speaking'>('idle');
  const accumulatedTranscriptRef = useRef('');
  const silenceTimerRef = useRef<any>(null);

  const recognitionRef = useRef<any>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dragging & Tooltip persistence states
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initializedPos, setInitializedPos] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const [hasClickedOnce, setHasClickedOnce] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('mitra_clicked_once') === 'true';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set initial position: bottom: 120px (innerHeight - 120 - 64_btn_height) -> y: innerHeight - 184
      // right: 20px (innerWidth - 20 - 64_btn_width) -> x: innerWidth - 84
      setPosition({
        x: window.innerWidth - 84,
        y: window.innerHeight - 184
      });
      setInitializedPos(true);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    dragStartPosRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      isDraggingRef.current = true;
      let newX = moveEvent.clientX - dragStartPosRef.current.x;
      let newY = moveEvent.clientY - dragStartPosRef.current.y;
      
      // Constrain inside viewport boundaries
      newX = Math.max(10, Math.min(newX, window.innerWidth - 74));
      newY = Math.max(10, Math.min(newY, window.innerHeight - 74));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      if (!isDraggingRef.current) {
        setHasClickedOnce(true);
        localStorage.setItem('mitra_clicked_once', 'true');
        handleToggleOpen();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    const touch = e.touches[0];
    dragStartPosRef.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    };

    const handleTouchMove = (moveEvent: TouchEvent) => {
      isDraggingRef.current = true;
      const t = moveEvent.touches[0];
      let newX = t.clientX - dragStartPosRef.current.x;
      let newY = t.clientY - dragStartPosRef.current.y;

      // Boundaries
      newX = Math.max(10, Math.min(newX, window.innerWidth - 74));
      newY = Math.max(10, Math.min(newY, window.innerHeight - 74));

      setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);

      if (!isDraggingRef.current) {
        setHasClickedOnce(true);
        localStorage.setItem('mitra_clicked_once', 'true');
        handleToggleOpen();
      }
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Synchronize state values to refs on every update
  useEffect(() => {
    isVoiceModeActiveRef.current = isVoiceModeActive;
  }, [isVoiceModeActive]);

  useEffect(() => {
    isGeneratingRef.current = isGenerating;
  }, [isGenerating]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    voiceStatusRef.current = voiceStatus;
  }, [voiceStatus]);

  // Handle Tab hidden / page visibility state - pause mic if tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Stop synthesized voice
        handleStopSpeaking();
        // Abort active listening securely
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
        setIsListening(false);
      } else {
        // Tab visible again: if open and voice mode is high, trigger auto-listen
        if (isOpenRef.current && isVoiceModeActiveRef.current && !isGeneratingRef.current && !isSpeakingRef.current) {
          startListening();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Clean up all resources when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  // Auto Scroll to Chat bottoms
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating, isListening]);

  // Audio browser initial capabilities loader
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  // Web Speech API Voice synthesis helper
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // Temporarily pause listening while speaking so the robot does not listen to itself
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    setIsListening(false);

    // Cancel active audios first
    window.speechSynthesis.cancel();

    // Clean markdown characters (*, _, #) & clean emojis for a beautiful natural narration
    const cleanedText = text
      .replace(/[\*\_\#\-\`]/g, '')
      .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    currentUtteranceRef.current = utterance;

    // Resolve language locale accents
    let speechLang = 'hi-IN';
    if (language === 'pa') {
       speechLang = 'hi-IN'; // Fallback to Indian Hindi voice tone if local Punjabi language engine is absent
    } else if (language === 'en') {
      speechLang = 'en-IN';
    }
    utterance.lang = speechLang;

    // Find custom high priority local indian voices
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.lang.startsWith(speechLang) || v.lang.includes(language));
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    utterance.pitch = 1.05; // Slightly cheerful and caring tone
    utterance.rate = 1.0;   // Humanly readable speed pacing

    utterance.onstart = () => {
      setIsSpeaking(true);
      setVoiceStatus('ai-speaking');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setVoiceStatus('listening');
      // Auto-start listening loop immediately after speech synthesis finishes!
      setTimeout(() => {
        if (isOpenRef.current && isVoiceModeActiveRef.current && !isGeneratingRef.current && !isListeningRef.current) {
          startListening();
        }
      }, 350);
    };

    utterance.onerror = (e) => {
      console.warn("Speech Synthesis error captured:", e);
      setIsSpeaking(false);
      setVoiceStatus('listening');
      // Fallback: trigger listing anyway to prevent the hands-free interface from locking up
      setTimeout(() => {
        if (isOpenRef.current && isVoiceModeActiveRef.current && !isGeneratingRef.current && !isListeningRef.current) {
          startListening();
        }
      }, 350);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Immediate abort for speech audio synthesis
  const handleStopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Launch Hands-free Web SpeechRecognition
  const startListening = async () => {
    if (typeof window === 'undefined') return;

    // Do not double launch listening if already active, speaking or generating
    if (isListeningRef.current || isSpeakingRef.current || isGeneratingRef.current || !isOpenRef.current) {
      return;
    }

    try {
      // Request mic permission first
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      });
      stream.getTracks().forEach(track => track.stop());
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setErrorText(language === 'hi' 
          ? 'आपके ब्राउज़र में आवाज़ पहचान तकनीक समर्थित नहीं है। कृपया टाइप करें।' 
          : 'Voice typing is not supported on your browser. Please type.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true; // continuous true allows minor pause handling via silentTimer rather than early aborts
      recognition.interimResults = true; // track draft texts

      let searchLocale = 'hi-IN';
      if (language === 'pa') searchLocale = 'pa-IN';
      else if (language === 'en') searchLocale = 'en-IN';

      recognition.lang = searchLocale;
      accumulatedTranscriptRef.current = '';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus('listening');
        setErrorText('');
      };

      recognition.onresult = (event: any) => {
        clearTimeout(silenceTimerRef.current);
        setVoiceStatus('user-speaking');

        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentDraftText = finalTranscript || interimTranscript;
        if (currentDraftText) {
          setInputText(currentDraftText);
          accumulatedTranscriptRef.current = currentDraftText;
        }

        silenceTimerRef.current = setTimeout(() => {
          setVoiceStatus('understanding');
          try {
            recognition.stop(); // will trigger onend
          } catch (e) {}
        }, 1500); // 1.5 seconds silence = done speaking
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech Recognition Error received:", event.error);
        if (event.error === 'no-speech') {
          // Silently restart - no error shown
          setTimeout(() => {
            if (isOpenRef.current && isVoiceModeActiveRef.current && !isGeneratingRef.current && !isSpeakingRef.current && !isListeningRef.current) {
              try { recognition.start(); } catch(e) {}
            }
          }, 1000);
        } else if (event.error === 'audio-capture') {
          setErrorText('Kisan Bhai, mic allow karein settings mein 🎤');
        } else if (event.error === 'not-allowed') {
          setErrorText('Mic ki permission denied hai. Browser settings check karein.');
        } else {
          // Any other error - restart silently
          setTimeout(() => {
            if (isOpenRef.current && isVoiceModeActiveRef.current && !isGeneratingRef.current && !isSpeakingRef.current && !isListeningRef.current) {
              try { recognition.start(); } catch(e) {}
            }
          }, 1000);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        clearTimeout(silenceTimerRef.current);

        const textToProcess = accumulatedTranscriptRef.current.trim();
        accumulatedTranscriptRef.current = '';

        if (textToProcess && voiceStatusRef.current === 'understanding') {
          setInputText('');
          setVoiceStatus('processing');
          handleSend(textToProcess);
        } else {
          setVoiceStatus(isVoiceModeActiveRef.current ? 'listening' : 'idle');
          if (isVoiceModeActiveRef.current && !isSpeakingRef.current && !isGeneratingRef.current && isOpenRef.current) {
            setTimeout(() => {
              try { recognition.start(); } catch(e) {}
            }, 500);
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setErrorText('Mic access nahi mila. Please allow karein 🙏');
      setIsListening(false);
    }
  };

  // Toggle open / close assistant overlay cabinet
  const handleToggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
      // Activated voice mode by default
      setIsVoiceModeActive(true);
      isVoiceModeActiveRef.current = true;
      setErrorText('');

      // Setup the welcome greeting text based on locale
      const welcomeHi = "जय किसान! बोलिए, आपका क्या सवाल है?";
      const welcomePa = "ਜੈ ਕਿਸਾਨ! ਬੋਲੋ, ਤੁਹਾਡਾ ਕੀ ਸਵਾਲ ਹੈ?";
      const welcomeEn = "Jai Kisaan! Speak, what is your question?";

      let msgText = welcomeHi;
      if (language === 'en') msgText = welcomeEn;
      else if (language === 'pa') msgText = welcomePa;

      setMessages([
        {
          id: 'welcome',
          sender: 'model',
          text: msgText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      // Auto-start listening immediately and show "Sun raha hoon... 🎤" animation right away
      setVoiceStatus('listening');
      setTimeout(() => {
        if (isOpenRef.current && isVoiceModeActiveRef.current && !isListeningRef.current) {
          startListening();
        }
      }, 200);

    } else {
      // Clean up completely on close
      handleStopSpeaking();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      clearTimeout(silenceTimerRef.current);
      setIsListening(false);
      setVoiceStatus('idle');
    }
  };

  // Manual Trigger to Stop/Start voice listening mode dynamically
  const toggleVoiceMode = () => {
    const nextState = !isVoiceModeActive;
    setIsVoiceModeActive(nextState);
    isVoiceModeActiveRef.current = nextState;

    if (nextState) {
      setErrorText('');
      startListening();
    } else {
      handleStopSpeaking();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      clearTimeout(silenceTimerRef.current);
      setIsListening(false);
      setVoiceStatus('idle');
    }
  };

  // Send transcription or typed query to server API
  const handleSend = async (forcedText?: string) => {
    const textToSend = forcedText || inputText;
    if (!textToSend.trim() || isGenerating) return;

    // Reset temporary states
    setInputText('');
    setErrorText('');

    // Pre-emptively stop speech recognition so it is absolutely silent during translation
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    setIsListening(false);
    setVoiceStatus('processing');

    // Save user dialog bubble
    const userMsgId = 'usr-' + Date.now();
    const newUserMessage: AssistantMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsGenerating(true);

    // Create temporary model response bubble
    const botMsgId = 'bot-' + Date.now();
    const initialBotMessage: AssistantMessage = {
      id: botMsgId,
      sender: 'model',
      text: '...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, initialBotMessage]);

    try {
      const formattedHistory = updatedMessages.map(m => ({
        sender: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: formattedHistory,
          systemPrompt: KISAN_MITRA_SYSTEM_PROMPT
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream context is missing.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';
      let accumulatedText = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: !doneReading });
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || '';

          for (const part of parts) {
            const lines = part.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const rawData = line.slice(6).trim();
                if (rawData === '[DONE]') {
                  done = true;
                  break;
                }
                try {
                  const parsed = JSON.parse(rawData);
                  if (parsed) {
                    if (parsed.error) {
                      accumulatedText = parsed.error;
                      done = true;
                      break;
                    }
                    if (parsed.text) {
                      accumulatedText += parsed.text;
                    }

                    setMessages(prev => 
                      prev.map(m => m.id === botMsgId ? { ...m, text: accumulatedText } : m)
                    );
                  }
                } catch (e) {
                  // chunk segment parsing safety
                }
              }
            }
          }
        }
      }

      setIsGenerating(false);

      // Automatically speak the resulting AI advice out loud!
      if (accumulatedText && accumulatedText !== '...') {
        speakText(accumulatedText);
      }

    } catch (err: any) {
      console.error(err);
      setMessages(prev => 
        prev.map(m => m.id === botMsgId ? { 
          ...m, 
          text: language === 'hi' 
            ? 'क्षमा करें, किसान भाई। नेटवर्क कनेक्शन में कुछ परेशानी है। कृपया दोबारा प्रयास करें।' 
            : 'Apologies. A network glitch occurred. Please try asking again.' 
        } : m)
      );
      setIsGenerating(false);
      setVoiceStatus('listening');

      // Restart listening after errors
      setTimeout(() => {
        if (isOpenRef.current && isVoiceModeActiveRef.current && !isListeningRef.current) {
          startListening();
        }
      }, 500);
    }
  };

  return (
    <>
      {/* 1. Floating Circular Avatar Launcher Icon (Draggable & Positional) */}
      <div 
        className="fixed z-45"
        style={{ 
          left: initializedPos ? `${position.x}px` : 'auto', 
          top: initializedPos ? `${position.y}px` : 'auto', 
          bottom: initializedPos ? 'auto' : '120px', 
          right: initializedPos ? 'auto' : '20px' 
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Animated pulsing Tooltip label above the button */}
        {!isOpen && !hasClickedOnce && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-emerald-950 font-sans font-extrabold text-[10px] px-3 py-1.5 rounded-xl shadow-xl border border-amber-300 animate-bounce text-center whitespace-nowrap leading-none select-none pointer-events-none tracking-wide uppercase">
            👆 Tap to Talk / Drag me
          </div>
        )}
        <button 
          id="floating-kisan-mitra"
          className={`relative group flex items-center justify-center w-16 h-16 rounded-full border border-emerald-400 bg-slate-900 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer ${
            isOpen ? 'rotate-90 bg-slate-800 border-none' : ''
          }`}
          title="Kisan Mitra Voice Helper"
        >
          {/* Animated pulsing red/green locator circles around physical launcher */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20 group-hover:animate-ping -z-10"></span>
          
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="w-[60px] h-[60px] flex items-center justify-center overflow-visible">
              <FarmerRobotAvatar 
                isListening={isListening} 
                isSpeaking={isSpeaking} 
                size={60} 
              />
            </div>
          )}
        </button>
      </div>

      {/* 2. Interactive Voice Popup Modal/Drawer */}
      {isOpen && (
        <div 
          id="kisan-mitra-cabinet"
          className="fixed bottom-24 right-4 md:right-6 z-50 w-[92vw] sm:w-[410px] h-[580px] bg-slate-950/95 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn text-slate-100"
        >
          {/* Embedding Custom Breathing & Glowing utility keyframes */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes listenRingGlow {
              0% { box-shadow: 0 0 10px rgba(16, 185, 129, 0.4), inset 0 0 5px rgba(16, 185, 129, 0.2); border-color: rgba(52, 211, 153, 0.5); }
              50% { box-shadow: 0 0 25px rgba(16, 185, 129, 0.8), inset 0 0 15px rgba(16, 185, 129, 0.4); border-color: rgba(16, 185, 129, 1); }
              100% { box-shadow: 0 0 10px rgba(16, 185, 129, 0.4), inset 0 0 5px rgba(16, 185, 129, 0.2); border-color: rgba(52, 211, 153, 0.5); }
            }
            @keyframes bodyFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-4px); }
            }
            @keyframes eyeGlow {
              0%, 100% { filter: drop-shadow(0 0 2px #22d3ee); }
              50% { filter: drop-shadow(0 0 7px #22d3ee) brightness(1.2); }
            }
            @keyframes speakingFlow {
              0%, 100% { height: 10px; }
              50% { height: 35px; }
            }
            .pulse-listening-ring {
              animation: listenRingGlow 2s infinite ease-in-out;
            }
            .sound-bar-1 { animation: speakingFlow 0.8s infinite ease-in-out; }
            .sound-bar-2 { animation: speakingFlow 0.6s infinite ease-in-out 0.1s; }
            .sound-bar-3 { animation: speakingFlow 0.9s infinite ease-in-out 0.2s; }
            .sound-bar-4 { animation: speakingFlow 0.7s infinite ease-in-out 0.3s; }
            .sound-bar-5 { animation: speakingFlow 0.5s infinite ease-in-out 0.15s; }
          `}} />

          {/* Assistant HEADER Panel featuring Animated Visual Robot Avatar */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800/80 p-5 shrink-0 flex flex-col items-center relative">
            <button 
              onClick={handleToggleOpen}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing avatar frame container - Pulsing green ring around avatar when listening */}
            <div className="mb-3 flex items-center justify-center">
              <FarmerRobotAvatar 
                isListening={voiceStatus === 'listening' || voiceStatus === 'user-speaking'} 
                isSpeaking={voiceStatus === 'ai-speaking'} 
                size={120} 
              />
            </div>

            <div className="text-center w-full">
              <h2 className="text-base font-bold text-white flex items-center justify-center gap-1.5 leading-none">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Kisan Mitra / किसान मित्र</span>
              </h2>

              {/* Mandatory Core Operational Status text line strictly handled */}
              <div className="h-6 mt-1 flex items-center justify-center">
                <p className="text-xs font-mono tracking-wide font-medium">
                  {voiceStatus === 'listening' ? (
                    <span className="text-emerald-400 animate-pulse flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                      Sun raha hoon... 🎤
                    </span>
                  ) : voiceStatus === 'user-speaking' ? (
                    <span className="text-teal-400 animate-pulse flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping inline-block"></span>
                      Bol rahe hain... 🎤
                    </span>
                  ) : voiceStatus === 'understanding' ? (
                    <span className="text-sky-400 flex items-center gap-1.5 justify-center">
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse inline-block"></span>
                      Samajh raha hoon... ⏳
                    </span>
                  ) : voiceStatus === 'processing' ? (
                    <span className="text-amber-400 flex items-center gap-1.5 justify-center">
                      <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                      Jawab aa raha hai... 🤔
                    </span>
                  ) : voiceStatus === 'ai-speaking' ? (
                    <span className="text-teal-400 animate-pulse flex items-center gap-1">
                      🔊 Bol raha hoon... 🔊
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      {isVoiceModeActive ? 'Sun raha hoon... 🎤' : 'Muted'}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Speaking audio sound wave lines in Header */}
            {voiceStatus === 'ai-speaking' && (
              <div className="absolute bottom-1.5 flex items-end gap-1.5 h-10 px-2">
                <div className="w-1 bg-emerald-400 rounded-full sound-bar-1"></div>
                <div className="w-1 bg-emerald-300 rounded-full sound-bar-2"></div>
                <div className="w-1 bg-emerald-400 rounded-full sound-bar-3"></div>
                <div className="w-1 bg-teal-400 rounded-full sound-bar-4"></div>
                <div className="w-1 bg-emerald-400 rounded-full sound-bar-5"></div>
              </div>
            )}
          </div>

          {/* Middle scrollable conversation log view screen */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/60">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                <p className="text-xs">Sankat Mochan active...</p>
              </div>
            ) : (
              messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} max-w-full`}
                >
                  <div className="text-[10px] text-slate-500 mb-1 px-1.5 font-mono">
                    {m.sender === 'user' ? 'Kisan Bhai (You)' : 'Kisan Mitra'}
                  </div>
                  
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed max-w-[85%] break-words shadow-md transition-all ${
                    m.sender === 'user' 
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white rounded-tr-none' 
                      : 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-tl-none'
                  }`}>
                    {m.text === '...' ? (
                      <div className="flex items-center gap-1.5 py-1.5 px-3">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    ) : (
                      <p className="whitespace-pre-line font-medium">{m.text}</p>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-600 mt-1 px-1.5">{m.timestamp}</span>
                </div>
              ))
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Core System friendly warnings / permission notices error text rendering */}
          {errorText && (
            <div className="px-4 py-2.5 bg-rose-950/90 border-t border-rose-900 text-xs text-rose-200 flex items-start gap-2 animate-fadeIn font-medium">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorText}</span>
            </div>
          )}

          {/* Quick Voice Mode active loop indicator / pause toggle drawer */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/40 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-400">
              <span className={`w-2 h-2 rounded-full ${isVoiceModeActive ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
              {isVoiceModeActive 
                ? (language === 'hi' ? 'ऑटोमैटिक आवाज़ मोड चालू है' : 'Hands-Free Voice Mode ON') 
                : (language === 'hi' ? 'आवाज़ मोड बंद है' : 'Hands-Free Voice Mode OFF')}
            </span>
            <button 
              onClick={toggleVoiceMode}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                isVoiceModeActive 
                  ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-900/40' 
                  : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-900/40'
              }`}
            >
              {isVoiceModeActive 
                ? (language === 'hi' ? 'रोकें (Pause)' : 'Pause Voice') 
                : (language === 'hi' ? 'शुरू करें (Resume)' : 'Resume Voice')}
            </button>
          </div>

          {/* Bottom Control Actions & big microphone switch */}
          <div className="p-4 bg-slate-950 border-t border-slate-900 shrink-0 space-y-3">
            
            {/* Massive friendly circular control microphone buttons */}
            <div className="flex flex-col items-center justify-center py-1">
              <button 
                id="mic-speak"
                onClick={toggleVoiceMode}
                className={`relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 cursor-pointer ${
                  isListening 
                    ? 'bg-rose-600 text-white ring-8 ring-rose-900/60 animate-pulse scale-105' 
                    : isVoiceModeActive 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105 ring-4 ring-emerald-900/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:scale-105 ring-4 ring-slate-900'
                }`}
                title={isVoiceModeActive ? "Stop listening mode" : "Resume listening mode"}
              >
                {isListening ? (
                  <Mic className="w-7 h-7" />
                ) : isVoiceModeActive ? (
                  <Mic className="w-7 h-7" />
                ) : (
                  <MicOff className="w-7 h-7" />
                )}
                
                {/* Visual expansion waves around physical buttons */}
                {isListening && (
                  <span className="absolute inset-0 rounded-full bg-rose-500 opacity-30 animate-ping -z-10"></span>
                )}
              </button>
              <span className="text-[10px] text-slate-400 mt-2 font-sans font-semibold tracking-wide">
                {voiceStatus === 'listening' 
                  ? "Sun raha hoon... 🎤" 
                  : voiceStatus === 'user-speaking'
                  ? "Bol rahe hain... 🎤"
                  : voiceStatus === 'understanding'
                  ? "Samajh raha hoon... ⏳"
                  : voiceStatus === 'processing'
                  ? "Jawab aa raha hai... 🤔"
                  : voiceStatus === 'ai-speaking'
                  ? "Bol raha hoon... 🔊"
                  : isVoiceModeActive
                  ? "Sun raha hoon... 🎤"
                  : "Tap to Activate Mic"}
              </span>
            </div>

            {/* fallback classical text input panel */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2.5 focus-within:border-emerald-600 transition-colors"
            >
              <input 
                type="text"
                placeholder={
                  language === 'hi' 
                    ? 'यहाँ लिख कर भी सवाल पूछें...' 
                    : language === 'pa' 
                    ? 'ਇੱਥੇ ਲਿਖ ਕੇ ਵੀ ਸਵਾਲ ਪੁੱਛੋ...' 
                    : 'Type your farming question...'
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                disabled={isGenerating}
              />
              <button 
                id="send-typed-chat"
                type="submit"
                disabled={!inputText.trim() || isGenerating}
                className="p-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
