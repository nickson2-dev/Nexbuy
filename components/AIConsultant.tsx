import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, X, User as UserIcon, GripVertical, Bot, Crown, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getShoppingAdvice } from '../services/geminiService';
import { Product, User } from '../types';

interface AIConsultantProps {
  onAddToCart: (product: Product) => void;
  products: Product[];
  user: User;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ onAddToCart, products, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: user.isLumiAscend 
      ? `Welcome back, ${user.name}. I am your dedicated Nexota Concierge. How may I assist with your high-end acquisitions today?` 
      : 'Hi! I\'m Nexa, your personal shopping assistant. Looking for something specific today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Window State
  const [position, setPosition] = useState({ x: 24, y: window.innerHeight - 100 });
  const [size, setSize] = useState({ width: 380, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });
  const initialSize = useRef({ width: 0, height: 0 });
  const hasMoved = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Drag & Resize Handlers
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, type: 'drag' | 'resize') => {
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    
    if (type === 'drag') {
      setIsDragging(true);
      hasMoved.current = false;
      dragStartPos.current = { x: clientX, y: clientY };
      initialPos.current = { x: position.x, y: position.y };
    } else {
      setIsResizing(true);
      dragStartPos.current = { x: clientX, y: clientY };
      initialSize.current = { width: size.width, height: size.height };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

      if (isDragging) {
        const dx = clientX - dragStartPos.current.x;
        const dy = clientY - dragStartPos.current.y;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          hasMoved.current = true;
        }

        const newX = Math.max(10, Math.min(window.innerWidth - 70, initialPos.current.x + dx));
        const newY = Math.max(10, Math.min(window.innerHeight - 70, initialPos.current.y + dy));
        setPosition({ x: newX, y: newY });
      }

      if (isResizing) {
        const dx = clientX - dragStartPos.current.x;
        const dy = clientY - dragStartPos.current.y;

        const newWidth = Math.max(300, Math.min(window.innerWidth - position.x - 20, initialSize.current.width + dx));
        const newHeight = Math.max(300, Math.min(window.innerHeight - 100, initialSize.current.height + dy));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, isResizing, position.x]);

  const toggleOpen = () => {
    if (!hasMoved.current) {
      setIsOpen(!isOpen);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userQuery = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsLoading(true);

    const advice = await getShoppingAdvice(userQuery, products);
    setMessages(prev => [...prev, { role: 'ai', text: advice || "I'm here to help you choose the best tech." }]);
    setIsLoading(false);
  };

  const findProductInText = (text: string) => {
    return products.find(p => text.toLowerCase().includes(p.name.toLowerCase()));
  };

  return (
    <div 
      className="fixed z-[300] touch-none"
      style={{ left: position.x, top: isOpen ? Math.max(20, position.y - size.height + 60) : position.y }}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{ width: size.width, height: size.height }}
            className="bg-white rounded-[32px] shadow-[0_30px_90px_rgba(0,0,0,0.25)] border border-slate-100 flex flex-col overflow-hidden relative"
          >
            {/* Header */}
            <div 
              className={`p-5 ${user.isLumiAscend ? 'bg-slate-900 border-b border-yellow-400/20' : 'bg-indigo-600'} text-white flex items-center justify-between shrink-0 cursor-move transition-colors duration-500`}
              onMouseDown={(e) => handleMouseDown(e, 'drag')}
              onTouchStart={(e) => handleMouseDown(e, 'drag')}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${user.isLumiAscend ? 'bg-gradient-to-br from-yellow-400 to-amber-600' : 'bg-white text-indigo-600'} rounded-xl flex items-center justify-center font-black italic shadow-lg`}>
                  {user.isLumiAscend ? <Crown size={20} className="text-white fill-current" /> : 'NX'}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{user.isLumiAscend ? 'Nexota Concierge' : 'Nexa AI'}</h4>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 ${user.isLumiAscend ? 'bg-yellow-400' : 'bg-green-400'} rounded-full animate-pulse`}></span>
                    <span className={`text-[9px] ${user.isLumiAscend ? 'text-amber-200' : 'text-indigo-100'} uppercase tracking-widest font-black`}>
                      {user.isLumiAscend ? 'Premium Protocol' : 'Protocol Active'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <GripVertical size={16} className="text-white/30 cursor-move" />
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="hover:bg-white/20 p-2 rounded-xl transition-all active:scale-90"
                  aria-label="Close Assistant"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat area */}
            <div ref={scrollRef} className="flex-grow p-5 overflow-y-auto space-y-5 bg-slate-50/50 scroll-smooth">
              {messages.map((msg, idx) => {
                const suggestedProduct = msg.role === 'ai' ? findProductInText(msg.text) : null;
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={idx} 
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                      : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    
                    {suggestedProduct && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 w-[85%] bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex items-center gap-3"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden shrink-0">
                          <img src={suggestedProduct.image} alt={suggestedProduct.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest truncate">{suggestedProduct.name}</p>
                          <p className="text-xs font-bold text-slate-900">${suggestedProduct.price}</p>
                        </div>
                        <button 
                          onClick={() => onAddToCart(suggestedProduct)}
                          className="bg-slate-900 text-white p-2 rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                          <Send size={14} className="rotate-90" />
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 rounded-tl-none flex gap-1.5 items-center">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mr-2">Thinking</div>
                    <div className="w-1 h-1 bg-indigo-300 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-5 border-t border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Nexa about assets..."
                  className="flex-grow bg-transparent outline-none text-sm px-3 py-1.5 font-medium"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:scale-100 active:scale-90"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>

            {/* Resize Handle */}
            <div 
              className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-end justify-end p-1 group"
              onMouseDown={(e) => handleMouseDown(e, 'resize')}
              onTouchStart={(e) => handleMouseDown(e, 'resize')}
            >
              <div className="w-2 h-2 border-r-2 border-b-2 border-slate-300 group-hover:border-indigo-400 transition-colors"></div>
            </div>
          </motion.div>
        ) : (
          <motion.button 
            layoutId="ai-button"
            onMouseDown={(e) => handleMouseDown(e, 'drag')}
            onTouchStart={(e) => handleMouseDown(e, 'drag')}
            onClick={toggleOpen}
            className={`group relative w-16 h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center shadow-2xl transition-all hover:scale-110 hover:bg-indigo-600 active:scale-95 border border-white/10 ${isDragging ? 'cursor-grabbing scale-110 ring-4 ring-indigo-400/30' : 'cursor-grab'}`}
            aria-label="Open Assistant"
          >
            <div className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
            </div>
            <div className="font-black text-2xl italic">NX</div>
            {!hasMoved.current && (
              <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 border border-white/10">
                <Sparkles size={10} className="text-indigo-400" /> Nexa Assistant
              </div>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIConsultant;