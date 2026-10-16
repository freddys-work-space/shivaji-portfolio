import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
  RotateCcw
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import resumeData from "@/data/resume.json";
import SiriOrb from "./ui/SiriOrb";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Local Knowledge-Base Fallback Engine ─────────────────────────────────────
const generateLocalResponse = (query: string): string => {
  const q = query.toLowerCase().trim();
  const info = resumeData.personal_info;
  const skills = resumeData.technical_skills;
  const exp = resumeData.professional_experience?.[0];
  const edu = resumeData.education;
  const projects = resumeData.projects;

  // Greetings & casual
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|who are you|what can you do)/i.test(q)) {
    return `Hello! I'm Shivaji's AI portfolio assistant. I can tell you all about Shivaji's data analytics skills in Python, SQL, Tableau, and Power BI, his data science projects like Ride IT Analysis, Credit Card Churn, and Airbnb Data Analysis, certifications, education, or how to contact him. What would you like to know?`;
  }

  // Summary / Who is Shivaji
  if (/who (is|are)|about (shivaji|him|yourself)|introduce|tell me about (shivaji|yourself|him)|summary|background/i.test(q)) {
    return `${info.name} is an Aspiring Data Analyst based in ${info.location} with a strong foundation in Python, SQL, Excel, Tableau, and Power BI. He specializes in uncovering patterns, data cleaning, predictive modeling, and designing high-impact interactive dashboards to drive data-driven business decisions.`;
  }

  // Skills
  if (/skill|tech stack|technologies|stack|language|tool|python|sql|tableau|power bi|excel|postgres|data/i.test(q)) {
    return `Here are Shivaji's core technical skills:
• Programming & Tools: ${skills.programming_tools.join(", ")}
• Data Management: ${skills.data_management_engineering.join(", ")}
• Statistical & ML Techniques: ${skills.statistical_ml.join(", ")}
• Visualization & Dashboards: ${skills.data_visualization.join(", ")}
• Business Analytics: ${skills.business_analytics.join(", ")}`;
  }

  // Experience & Certifications
  if (/certif|experience|work|job|company|datalab|role|employment|career|microsoft|google|pl-300/i.test(q)) {
    const points = exp?.points ? exp.points.map(p => `• ${p}`).join("\n") : "";
    return `Shivaji is currently working as a ${exp?.role || "Junior Data Analyst"} at ${exp?.company || "DataLab Private Limited"} (${exp?.period || "SEP 2025 – Present"}).
Key contributions:
${points}

He is also certified as a Microsoft Power BI Data Analyst Associate (PL-300) and Google Data Analytics Professional.`;
  }

  // Projects
  if (/project|portfolio|ride it|churn|airbnb|analysis|model|pipeline|dashboard/i.test(q)) {
    const list = projects.map(p => `• ${p.name}: ${p.highlights[0]} ${p.highlights[1] || ""}`).join("\n\n");
    return `Here are Shivaji's key featured data analytics projects:

${list}`;
  }

  // Education
  if (/education|degree|college|university|mca|bachelor|btech|cbit|dundalk|gpa|study|qualification/i.test(q)) {
    const eduList = edu.map(e => `• ${e.degree} from ${e.school} (${e.period}) - GPA/Grade: ${e.cgpa}`).join("\n");
    return `Shivaji's educational background:
${eduList}`;
  }

  // Contact / Hire
  if (/contact|hire|email|phone|reach|call|message|location|address|linkedin|github/i.test(q)) {
    return `You can connect with Shivaji directly:
• Email: ${info.email}
• Phone: ${info.phone}
• Location: ${info.location}
• Status: Available for full-time Data Analyst opportunities.`;
  }

  // Default intelligent fallback
  return `Shivaji Charavarthe M is an Aspiring Data Analyst skilled in Python, SQL, Power BI, Excel, and Tableau. He has developed projects including Ride IT Analysis, Credit Card Churn Prediction, and Airbnb Data Analysis. Feel free to ask about his skills, projects, certifications, or education!`;
};

// Clean markdown and symbols so Text-to-Speech sounds natural and smooth
const cleanTextForSpeech = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^•\s*/gm, '')
    .replace(/^-\s*/gm, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/Power BI/gi, 'Power B I')
    .replace(/PL-300/gi, 'P L 300')
    .replace(/SQL/gi, 'S Q L')
    .replace(/EDA/gi, 'E D A')
    .replace(/KPI/g, 'K P I')
    .replace(/KPIs/g, 'K P Eyes')
    .replace(/PostgreSQL/gi, 'Postgres Q L')
    .replace(/API/g, 'A P I')
    .replace(/APIs/g, 'A P Eyes')
    .replace(/CGPA/g, 'C G P A')
    .replace(/GPA/g, 'G P A')
    .replace(/MCA/g, 'M C A')
    .replace(/\s+/g, ' ')
    .trim();
};

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mute, setMute] = useState(false);
  const [listeningTime, setListeningTime] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const speechIdRef = useRef(0);
  const transcriptRef = useRef('');
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const keepAliveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasSpokenGreeting = useRef(false);
  const pendingSpeechRef = useRef('');
  const muteRef = useRef(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const activeUtterancesRef = useRef<SpeechSynthesisUtterance[]>([]);

  // Sync mute state to ref
  useEffect(() => {
    muteRef.current = mute;
    if (mute) {
      stopSpeaking();
    }
  }, [mute]);

  // Determine greeting based on time
  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning!";
      if (hour < 17) return "Good afternoon!";
      return "Good evening!";
    };

    setMessages([
      { role: 'assistant', content: `Shivaji told me to say ${getGreeting()} to you! I'm his AI assistant. How can I help you today?` }
    ]);
  }, []);

  // Track listening time
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isListening) {
      intervalId = setInterval(() => {
        setListeningTime((t) => t + 1);
      }, 1000);
    } else {
      setListeningTime(0);
    }
    return () => clearInterval(intervalId);
  }, [isListening]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  // Pre-load and cache voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) voicesRef.current = v;
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Stop active speech synthesis cleanly and immediately
  const stopSpeaking = useCallback(() => {
    speechIdRef.current += 1;
    isSpeakingRef.current = false;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        activeUtterancesRef.current.forEach(utt => {
          utt.onend = null;
          utt.onerror = null;
          utt.onstart = null;
        });
        activeUtterancesRef.current = [];
        window.speechSynthesis.cancel();
      } catch (_) { }
    }

    if (keepAliveTimerRef.current) {
      clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
    }

    setIsSpeaking(false);
  }, []);

  // Natural Text-to-Speech handler with chunking & cancellation check
  const speak = useCallback((text: string) => {
    pendingSpeechRef.current = text;
    if (muteRef.current || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    stopSpeaking();

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;

    const sentences = cleanText
      .split(/(?<=[.?!:])\s+/)
      .filter((s) => s.trim().length > 0);

    if (sentences.length === 0) return;

    const currentSpeechId = ++speechIdRef.current;
    isSpeakingRef.current = true;
    setIsSpeaking(true);

    const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();

    const preferredVoice =
      voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online'))) ||
      voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
      voices.find(v => v.lang.startsWith('en-US')) ||
      voices.find(v => v.lang.startsWith('en')) ||
      voices[0];

    keepAliveTimerRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);

    let currentIndex = 0;

    const speakNextChunk = () => {
      if (speechIdRef.current !== currentSpeechId || !isSpeakingRef.current || muteRef.current) {
        stopSpeaking();
        return;
      }

      if (currentIndex >= sentences.length) {
        stopSpeaking();
        return;
      }

      const chunk = sentences[currentIndex];
      const utterance = new SpeechSynthesisUtterance(chunk);

      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      utterance.onend = () => {
        if (speechIdRef.current !== currentSpeechId || !isSpeakingRef.current) return;
        currentIndex++;
        speakNextChunk();
      };

      utterance.onerror = (e) => {
        if (e.error === 'canceled' || e.error === 'interrupted' || speechIdRef.current !== currentSpeechId || !isSpeakingRef.current) {
          return;
        }
        currentIndex++;
        speakNextChunk();
      };

      activeUtterancesRef.current.push(utterance);
      window.speechSynthesis.speak(utterance);
    };

    speakNextChunk();
  }, [stopSpeaking]);

  // Speak greeting automatically when opened like previously existed
  useEffect(() => {
    if (isOpen && !hasSpokenGreeting.current && messages.length > 0) {
      speak(messages[0].content);
      hasSpokenGreeting.current = true;
    }
  }, [isOpen, messages, speak]);

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscript += res[0].transcript + ' ';
          } else {
            interimTranscript += res[0].transcript;
          }
        }

        const currentText = (finalTranscript + interimTranscript).trim();
        if (currentText) {
          setInput(currentText);
          transcriptRef.current = currentText;
        }

        // Silence detection to auto-send after user stops talking
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        if (currentText.length > 1) {
          silenceTimerRef.current = setTimeout(() => {
            if (isListeningRef.current && transcriptRef.current.trim()) {
              stopListeningAndSend(transcriptRef.current.trim());
            }
          }, 1500);
        }
      };

      recognition.onerror = () => {
        isListeningRef.current = false;
        setIsListening(false);
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.error("Speech recognition initialization error:", e);
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (keepAliveTimerRef.current) clearInterval(keepAliveTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) { }
      }
    };
  }, []);

  const stopListeningAndSend = (capturedText: string) => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current && isListeningRef.current) {
      try { recognitionRef.current.stop(); } catch (_) { }
    }
    isListeningRef.current = false;
    setIsListening(false);

    if (capturedText.trim()) {
      handleSend(capturedText.trim(), true);
    }
  };

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    stopSpeaking();

    if (isListening || isListeningRef.current) {
      const text = transcriptRef.current || input;
      stopListeningAndSend(text);
    } else {
      setInput('');
      transcriptRef.current = '';

      try {
        recognitionRef.current?.start();
        isListeningRef.current = true;
        setIsListening(true);
      } catch (err) {
        try {
          recognitionRef.current?.abort();
          setTimeout(() => {
            recognitionRef.current?.start();
            isListeningRef.current = true;
            setIsListening(true);
          }, 100);
        } catch (_) { }
      }
    }
  };

  const handleSend = async (textOverride?: string, fromVoice = false) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    transcriptRef.current = '';
    setIsLoading(true);
    stopSpeaking();

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (apiKey && apiKey.trim() !== '') {
      try {
        const payload = {
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `You are a friendly and helpful AI assistant for Shivaji Charavarthe M's portfolio. 
Answer professional questions based on: ${JSON.stringify(resumeData, null, 2)}
Guidelines:
1. Be professional yet conversational.
2. Handle normal greetings and casual chat warmly.
3. If asked about facts not in the resume, admit you don't know but offer to help with Shivaji's data analytics experience.
4. For any list of information, use bullet points starting with "• " (bullet character + space).
5. Keep responses concise.
6. Short replies (greetings, simple answers) do NOT need bullets.`
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: textToSend }
          ],
          max_tokens: Number(import.meta.env.VITE_MAX_TOKENS) || 150,
        };

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          const aiContent = data.choices[0].message.content;
          setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);

          if (fromVoice) {
            speak(aiContent);
          }
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.warn("API request fallback:", error);
      }
    }

    // Seamless Local Fallback Response (works offline or without key)
    setTimeout(() => {
      const localReply = generateLocalResponse(textToSend);
      setMessages(prev => [...prev, { role: 'assistant', content: localReply }]);
      if (fromVoice) {
        speak(localReply);
      }
      setIsLoading(false);
    }, 300);
  };

  const renderContent = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim());
    const hasBullets = lines.some(l => l.trim().startsWith('•') || l.trim().startsWith('-'));
    if (!hasBullets) return <span>{text}</span>;
    return (
      <ul className="space-y-1.5 list-none">
        {lines.map((line, idx) => {
          const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
          const content = line.replace(/^[•\-]\s*/, '');
          return isBullet ? (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-60 flex-shrink-0" />
              <span>{content}</span>
            </li>
          ) : (
            <li key={idx}>{line}</li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-12 px-4 rounded-full bg-background/80 backdrop-blur-xl border border-white/10 flex items-center gap-3 shadow-2xl hover:bg-background/90 transition-all group overflow-hidden cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <SiriOrb size="28px" className="relative z-10" />
        <span className="text-sm font-bold tracking-tight text-foreground/90 relative z-10">
          AI Chat
        </span>
      </motion.button>

      <Sheet open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          stopSpeaking();
          if (isListening) {
            try { recognitionRef.current?.abort(); } catch (_) { }
            setIsListening(false);
          }
        }
      }} modal={false}>
        <SheetContent side="right" className="w-full sm:max-w-[400px] p-0 flex flex-col h-full bg-background/95 backdrop-blur-xl border-l border-white/10 shadow-2xl">
          <SheetHeader className="p-4 border-b border-white/10 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                  AI Assistant
                </SheetTitle>
                <SheetDescription className="sr-only">Chat with Shivaji's AI.</SheetDescription>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  title="Stop speaking"
                  className="px-3 py-1.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full transition-all flex items-center gap-1.5 text-xs font-bold shadow-md cursor-pointer active:scale-95"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </button>
              )}

              <button
                onClick={() => {
                  const newMute = !mute;
                  setMute(newMute);
                  muteRef.current = newMute;
                  if (newMute) {
                    stopSpeaking();
                  } else {
                    if (pendingSpeechRef.current) {
                      speak(pendingSpeechRef.current);
                    }
                  }
                }}
                className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                title={mute ? "Unmute" : "Mute"}
              >
                {mute ? <VolumeX className="w-4 h-4 text-muted-foreground" /> : <Volume2 className="w-4 h-4 text-primary" />}
              </button>

              <button
                onClick={() => {
                  hasSpokenGreeting.current = false;
                  const hour = new Date().getHours();
                  const getGreeting = () => hour < 12 ? "Good morning!" : hour < 17 ? "Good afternoon!" : "Good evening!";
                  const initialMsg = `Shivaji told me to say ${getGreeting()} to you! I'm his AI assistant. How can I help you today?`;
                  setMessages([{ role: 'assistant', content: initialMsg }]);
                  speak(initialMsg);
                }}
                title="Restart Chat"
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-hidden relative">
            <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "max-w-[85%] rounded-2xl p-4 text-sm font-medium leading-relaxed shadow-sm",
                    msg.role === 'user'
                      ? "ml-auto bg-primary text-primary-foreground rounded-br-none"
                      : "mr-auto bg-muted/50 text-foreground border border-white/5 rounded-bl-none"
                  )}
                >
                  {renderContent(msg.content)}
                </motion.div>
              ))}

              {isLoading && (
                <div className="mr-auto bg-muted/50 rounded-2xl p-4 flex items-center gap-2 border border-white/5">
                  <span className="text-xs text-muted-foreground">Thinking</span>
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-foreground/50 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1 h-1 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence>
              {(isSpeaking || isListening) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={cn(
                    "absolute bottom-4 left-0 right-0 mx-auto w-[90%] max-w-[340px] flex flex-col items-center gap-3 backdrop-blur-2xl p-4 rounded-3xl border shadow-2xl z-50 transition-colors duration-300",
                    isListening ? "bg-background/95 border-white/20" : "bg-background/95 border-primary/30"
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2.5">
                      {isListening && (
                        <div
                          className="h-3.5 w-3.5 animate-spin rounded-sm bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                          style={{ animationDuration: "3s" }}
                        />
                      )}
                      {!isListening && isSpeaking && (
                        <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                      )}
                      <span className={cn("text-xs font-mono tabular-nums tracking-wider uppercase font-black", isListening ? "text-foreground" : "text-primary")}>
                        {isListening ? `LISTENING (${formatTime(listeningTime)})` : "SPEAKING"}
                      </span>
                    </div>

                    {/* Instant STOP button when speaking */}
                    {isSpeaking && (
                      <button
                        onClick={stopSpeaking}
                        className="px-3 py-1.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                        title="Stop speaking"
                      >
                        <Square className="w-3 h-3 fill-current" />
                        <span>Stop</span>
                      </button>
                    )}

                    {/* Done button when listening */}
                    {isListening && (
                      <button
                        onClick={() => toggleListening()}
                        className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                        title="Finish listening"
                      >
                        <Square className="w-3 h-3 fill-current" />
                        <span>Done</span>
                      </button>
                    )}
                  </div>

                  {isListening && (
                    <div className="flex h-5 w-48 items-center justify-center gap-0.5">
                      {[...Array(32)].map((_, i) => (
                        <div
                          key={i}
                          className="w-0.5 rounded-full bg-primary/70 animate-pulse transition-all duration-300 shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]"
                          style={{
                            height: `${30 + Math.random() * 70}%`,
                            animationDelay: `${i * 0.05}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {!isListening && isSpeaking && (
                    <div className="flex gap-1 h-3 items-end">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ height: [4, 14, 4] }}
                          transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.08 }}
                          className="w-1 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]"
                        />
                      ))}
                    </div>
                  )}

                  <p className={cn("text-[10px] uppercase font-black tracking-[0.2em]", isListening ? "text-muted-foreground" : "text-primary/70")}>
                    {isListening ? "Listening... Speak now" : "Tap Stop to interrupt"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-white/10 bg-background/50">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(undefined, false); }} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me something..."
                  className="w-full bg-muted/50 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={toggleListening}
                  className={cn("absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors cursor-pointer", isListening ? "bg-red-500 text-white" : "text-muted-foreground hover:text-foreground")}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>

              {isSpeaking ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={stopSpeaking}
                  className="rounded-xl px-3 flex items-center gap-1 text-xs font-bold"
                  title="Stop AI speech"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop</span>
                </Button>
              ) : (
                <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                  <Send className="w-5 h-5" />
                </Button>
              )}
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AIAssistant;
