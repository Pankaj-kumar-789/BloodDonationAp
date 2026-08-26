"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Bot, Loader2, HeartPulse } from "lucide-react";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{id: string, role: string, content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMsg = { id: Date.now().toString(), role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      
      if (!res.ok) throw new Error("Failed to connect to AI");
      
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");
      
      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantId = (Date.now() + 1).toString();
      
      setMessages([...newMessages, { id: assistantId, role: 'assistant', content: "" }]);
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        assistantContent += chunk;
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m));
      }
      
      // If the AI SDK swallowed a rate limit or crashed silently, it returns an empty stream.
      // We replace the empty bubble with a polite fallback message.
      if (assistantContent.trim() === "") {
         setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: "I'm currently receiving too many requests and need a quick breather! Please wait a moment and try asking again." } : m));
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-[380px] h-[600px] max-h-[80vh] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#C62121] to-rose-700 p-4 text-white flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shadow-sm">
                  <HeartPulse className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">RaktaSetu AI</h3>
                  <p className="text-xs text-white/80 font-medium">Eligibility & Medical Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-gray-50/50 dark:bg-slate-950/50">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-950/30 text-[#C62121] rounded-2xl flex items-center justify-center mx-auto mb-5 rotate-3 shadow-sm border border-red-200 dark:border-slate-800">
                    <Bot className="w-8 h-8 -rotate-3" />
                  </div>
                  <p className="font-black text-xl text-gray-900 dark:text-white mb-2">How can I help?</p>
                  <p className="text-sm px-4 leading-relaxed">Ask me about blood donation eligibility, preparation, or post-donation care.</p>
                  
                  <div className="mt-8 flex flex-col gap-3 px-2">
                    <button onClick={() => setInput("Can I donate if I recently got a tattoo?")} className="text-sm font-semibold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-3 rounded-xl text-left hover:bg-red-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-0.5 shadow-sm">
                      Can I donate if I recently got a tattoo?
                    </button>
                    <button onClick={() => setInput("What should I eat before donating blood?")} className="text-sm font-semibold bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-3 rounded-xl text-left hover:bg-red-50 dark:hover:bg-slate-700 transition-all hover:-translate-y-0.5 shadow-sm">
                      What should I eat before donating blood?
                    </button>
                  </div>
                </div>
              )}
              
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${m.role === 'user' ? 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300' : 'bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-slate-700 text-[#C62121]'}`}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-3.5 text-[14px] leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-[#C62121] text-white rounded-tr-none shadow-md shadow-red-500/20' : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              
              {error && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-slate-700 text-[#C62121] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl rounded-tl-none p-3.5 text-[14px] shadow-sm">
                    <strong>Error:</strong> {error.message || "Failed to connect to AI."}
                  </div>
                </div>
              )}
              {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-slate-700 text-[#C62121] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-[#C62121]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 z-10">
              <form onSubmit={handleFormSubmit} className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a medical question..."
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl pl-4 pr-12 py-3.5 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#C62121]/50 focus:border-[#C62121] transition-all dark:text-white placeholder:text-gray-400"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-[#C62121] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-[#C62121] transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <div className="relative group">
        {!isOpen && (
          <span className="absolute -inset-1 rounded-2xl bg-red-500 opacity-50 animate-ping group-hover:hidden"></span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative z-10 w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-1 ${isOpen ? 'bg-gray-800 dark:bg-slate-700 hover:bg-gray-900 rotate-90 rounded-full' : 'bg-gradient-to-br from-[#C62121] to-rose-600 hover:shadow-red-500/25'}`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}
