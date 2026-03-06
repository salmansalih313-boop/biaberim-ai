import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Bot, User, Loader2, MapPin, Car, Phone, Info, 
  ShieldCheck, Heart, Truck, Droplets, Construction, 
  Dribbble, Printer, FileText, Smartphone, ExternalLink
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getGeminiResponse } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'سلام! من دستیار هوشمند "بیابریم" هستم. بیابریم آغاز تحول در دایکندی و یک همکاری مردمی مبتنی بر اعتماد است. چطور می‌توانم به شما کمک کنم؟',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

      const responseText = await getGeminiResponse(input, history);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText || 'متاسفم، مشکلی در دریافت پاسخ پیش آمد.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: 'خطایی رخ داد. لطفا دوباره تلاش کنید.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f4f7f6] font-sans overflow-hidden" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
            <Car className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-neutral-900 leading-tight tracking-tight">بیابریم AI</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[11px] text-neutral-500 font-semibold uppercase tracking-wider">دستیار هوشمند دایکندی</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <a href="tel:0775804785" className="p-2.5 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all group" title="تماس با مدیر">
            <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </a>
          <button className="p-2.5 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-500">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-neutral-300">
        <div className="max-w-3xl mx-auto space-y-8 py-4">
          {/* Welcome Card */}
          {messages.length <= 1 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-white p-8 rounded-[2rem] border border-neutral-200 shadow-xl shadow-neutral-200/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5" />
                    <span>سیستم مبتنی بر اعتماد و همکاری محلی</span>
                  </div>
                  <h2 className="text-3xl font-black text-neutral-900 leading-tight">
                    دایکُندی را هوشمندتر <br />از قبل تجربه کنید! 🇦🇫
                  </h2>
                  <p className="text-neutral-600 text-base leading-relaxed font-medium">
                    بیابریم یک اپلیکیشن نیست، یک تحول مردمی برای تسهیل زندگی شما در نیلی و تمام ولسوالی‌هاست.
                  </p>
                  
                  <div className="pt-4 grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                      <Car className="w-6 h-6 text-emerald-600 mb-2" />
                      <h3 className="font-bold text-neutral-800 text-sm">حمل و نقل</h3>
                      <p className="text-[11px] text-neutral-500">تاکسی، موتور، زرنج و موترهای باربری</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                      <Printer className="w-6 h-6 text-blue-600 mb-2" />
                      <h3 className="font-bold text-neutral-800 text-sm">خدمات و سفارش</h3>
                      <p className="text-[11px] text-neutral-500">دیزاین، چاپ و ثبت‌نام‌های اینترنتی</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Truck, text: 'باربری سنگین', color: 'bg-orange-100 text-orange-600' },
                  { icon: Droplets, text: 'تانکر آب', color: 'bg-cyan-100 text-cyan-600' },
                  { icon: Construction, text: 'ماشین‌آلات', color: 'bg-yellow-100 text-yellow-600' },
                  { icon: Dribbble, text: 'سالن ورزشی', color: 'bg-pink-100 text-pink-600' },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm flex flex-col items-center gap-2 text-center">
                    <div className={cn("p-2 rounded-xl", item.color)}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-700">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Trust Banner */}
              <div className="bg-neutral-900 text-white p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="text-red-500 fill-red-500 w-5 h-5" />
                  <span className="text-xs font-bold">اعتماد شما سرمایه ماست</span>
                </div>
                <div className="text-[10px] opacity-70">مدیر: سلمان صالح</div>
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex w-full gap-4",
                  message.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md",
                  message.role === 'user' ? "bg-neutral-800" : "bg-emerald-600"
                )}>
                  {message.role === 'user' ? (
                    <User className="text-white w-6 h-6" />
                  ) : (
                    <Bot className="text-white w-6 h-6" />
                  )}
                </div>
                <div className={cn(
                  "max-w-[85%] px-5 py-4 rounded-[1.5rem] shadow-sm",
                  message.role === 'user' 
                    ? "bg-neutral-800 text-white rounded-tr-none" 
                    : "bg-white border border-neutral-200 text-neutral-800 rounded-tl-none"
                )}>
                  <div className="markdown-body prose prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  <div className={cn(
                    "flex items-center gap-2 mt-2 opacity-40 text-[9px] font-bold",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}>
                    <span>{message.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
                    {message.role === 'model' && <span>• بیابریم AI</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="text-white w-6 h-6" />
              </div>
              <div className="bg-white border border-neutral-200 px-5 py-4 rounded-[1.5rem] rounded-tl-none shadow-sm flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
                </div>
                <span className="text-xs text-neutral-500 font-bold">در حال بررسی درخواست شما...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-neutral-200 p-4 pb-8 sm:pb-4 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="چطور می‌توانم به شما کمک کنم؟"
                className="w-full bg-neutral-100 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl py-4 pr-4 pl-12 text-sm transition-all outline-none text-neutral-800 placeholder:text-neutral-400 font-medium"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-neutral-400">
                <Smartphone className="w-4 h-4" />
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-4 rounded-2xl transition-all flex items-center justify-center",
                input.trim() && !isLoading 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95" 
                  : "bg-neutral-200 text-neutral-400"
              )}
            >
              <Send className="w-5 h-5 rotate-180" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold">
              <ShieldCheck className="w-3 h-3" />
              <span>امن و معتبر</span>
            </div>
            <div className="w-1 h-1 bg-neutral-300 rounded-full"></div>
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-bold">
              <Phone className="w-3 h-3" />
              <span>پشتیبانی ۲۴ ساعته</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

