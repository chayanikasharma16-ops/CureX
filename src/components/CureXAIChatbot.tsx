import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Volume2,
  VolumeX,
  RotateCcw,
  Maximize2,
  Minimize2,
  X,
  BrainCircuit,
  MessageCircleQuestion,
  PhoneCall,
  Search,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  citations?: { title: string; uri: string }[];
  modelUsed?: string;
  isEmergencyAlert?: boolean;
}

interface CureXAIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCommentBoxWithAIQuery?: (query: string, aiAnswer: string) => void;
  initialPrompt?: string;
}

export default function CureXAIChatbot({
  isOpen,
  onClose,
  onOpenCommentBoxWithAIQuery,
  initialPrompt = '',
}: CureXAIChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello, I am **CureX AI Healthcare Assistant** — your clinical guidance companion.\n\nI have comprehensive medical knowledge across internal medicine, pharmacology, symptoms triage, first aid, and preventive care. How can I assist you or your family today?\n\n*Note: In an acute life-threatening emergency, please call Indian Emergency Services (112 or 108) immediately.*`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [useThinking, setUseThinking] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      setInput(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    // Detect potential acute emergency keywords in user query
    const emergencyRegex = /(chest\s*pain|heart\s*attack|stroke|unconscious|choking|heavy\s*bleeding|difficulty\s*breathing|cannot\s*breathe|face\s*droop)/i;
    const isCriticalQuery = emergencyRegex.test(text);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build server request
      const formattedHistory = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedHistory,
          userMessage: text,
          useThinking,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: data.reply || 'I am having trouble retrieving that medical information. Please consult a registered medical doctor.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || [],
        modelUsed: data.modelUsed,
        isEmergencyAlert: isCriticalQuery,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `### Clinical Service Notice\n\nI was unable to connect to the medical knowledge server. Here is general guidance:\n\n- If you are experiencing sudden, severe chest pain, shortness of breath, or neurological deficits, call **112 / 108** immediately.\n- For non-emergency complaints, please schedule a consultation with our verified doctors or visit your nearest hospital.\n\n*Error details: ${err.message || 'Network timeout'}*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner audio
    const cleanText = text.replace(/[*#_`>-]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const quickPrompts = [
    'I have a dry cough and mild fever for 3 days',
    'Explain difference between Type 1 and Type 2 diabetes',
    'What are first-aid steps for a suspected sprained ankle?',
    'Safe home remedies and warning signs for acidity and GERD',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 ${
          isFullScreen ? 'w-full h-full rounded-none' : 'w-full max-w-4xl h-[90vh] max-h-[820px]'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#071A2E] to-[#0A2540] text-white flex items-center justify-between border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-semibold tracking-tight text-white">
                  CureX AI Healthcare Assistant
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Medical AI
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Encyclopedic Clinical Intelligence · Powered by Gemini with Google Search Grounding
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Thinking mode toggle */}
            <button
              onClick={() => setUseThinking(!useThinking)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                useThinking
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle deep reasoning mode with Gemini 4 Argon"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">High Thinking</span>
            </button>

            {/* Clear history */}
            <button
              onClick={() =>
                setMessages([
                  {
                    id: 'reset',
                    role: 'model',
                    text: 'Consultation restarted. How can I help with your health today?',
                    timestamp: 'Just now',
                  },
                ])
              }
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
              title="Clear conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
              title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen Consultation'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-rose-500/20 hover:text-rose-300 transition-colors cursor-pointer"
              title="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Emergency SOS Banner (Quick Access) */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              If you have acute crushing chest pain, difficulty breathing, or stroke symptoms, immediately dial emergency dispatch.
            </span>
          </div>
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs shrink-0 transition-colors ml-2"
          >
            <PhoneCall className="w-3 h-3" /> Call 112 / 108
          </a>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#F8FAF9]">
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0A2540] text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-900 border border-slate-200/80 rounded-tl-none'
                }`}
              >
                {/* Emergency Red-flag banner inside response */}
                {msg.isEmergencyAlert && msg.role === 'model' && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <b className="font-semibold block text-red-700">Urgent Clinical Red Flag Alert:</b>
                      The symptoms you mentioned require immediate emergency evaluation. Please reach a hospital emergency room or dial 112/108 without delay.
                    </div>
                  </div>
                )}

                {/* Text Formatted */}
                <div className="space-y-2 whitespace-pre-line font-sans">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => {
                    // Check for headers
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h4 key={pIdx} className="font-serif font-bold text-base text-slate-900 mt-2 mb-1">
                          {paragraph.replace('### ', '')}
                        </h4>
                      );
                    }
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h3 key={pIdx} className="font-serif font-bold text-lg text-slate-900 mt-2 mb-1">
                          {paragraph.replace('## ', '')}
                        </h3>
                      );
                    }
                    return <p key={pIdx}>{paragraph}</p>;
                  })}
                </div>

                {/* Grounding Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Search className="w-3 h-3 text-emerald-600" /> Grounded Medical Sources:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cite, cIdx) => (
                        <a
                          key={cIdx}
                          href={cite.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded text-[11px] text-slate-600 transition-colors"
                        >
                          <span className="truncate max-w-[200px]">{cite.title}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bot Message Actions & Community Feedback Trigger */}
                {msg.role === 'model' && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex items-center gap-1 hover:text-slate-700 transition-colors cursor-pointer"
                        title="Copy medical response"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {/* Read aloud */}
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        className="flex items-center gap-1 hover:text-slate-700 transition-colors cursor-pointer"
                        title="Listen to advice"
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Report / Correct in Community Comment Box */}
                    {onOpenCommentBoxWithAIQuery && idx > 0 && (
                      <button
                        onClick={() => {
                          const userQuery = messages[idx - 1]?.text || '';
                          onOpenCommentBoxWithAIQuery(userQuery, msg.text);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer"
                        title="If AI misunderstood or missed something, submit a correction to the Comment Box"
                      >
                        <MessageCircleQuestion className="w-3 h-3" />
                        <span>Not quite right? Correct in Comment Box</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 mr-auto">
              <div className="w-8 h-8 rounded-full bg-[#0A2540] text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-sm flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {useThinking ? 'Synthesizing clinical differential diagnosis...' : 'Consulting CureX medical knowledge...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick starter chips */}
        {messages.length <= 2 && (
          <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-500 font-semibold shrink-0">Try asking:</span>
            {quickPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                className="px-3 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-full shrink-0 transition-colors cursor-pointer text-xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-2.5"
          >
            <div className="flex-1 relative bg-slate-50 border border-slate-200 rounded-2xl focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={2}
                placeholder="Describe your symptoms, question about medication dosage, or health query..."
                className="w-full bg-transparent px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                input.trim() && !isLoading
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-700/30'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
              title="Send medical query"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-2 text-[11px] text-center text-slate-400">
            CureX AI provides intelligent clinical advice for informational triage. Always consult registered doctors for definitive diagnoses.
          </div>
        </div>
      </div>
    </div>
  );
}
