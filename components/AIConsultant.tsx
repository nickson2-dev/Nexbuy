import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, X, User as UserIcon, GripVertical, Bot } from 'lucide-react';
import { getShoppingAdvice } from '../services/geminiService';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

interface AIConsultantProps {
  onAddToCart: (product: Product) => void;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ onAddToCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: 'Hi! I\'m Nexa, your personal shopping assistant. Looking for something specific today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Draggable State
  const [position, setPosition] = useState({ x: 24, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    
    setIsDragging(true);
    hasMoved.current = false;
    dragStartPos.current = { x: clientX, y: clientY };
    initialPos.current = { x: position.x, y: position.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      
      const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

      const dx = clientX - dragStartPos.current.x;
      const dy = clientY - dragStartPos.current.y;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasMoved.current = true;
      }

      const newX = Math.max(10, Math.min(window.innerWidth - 70, initialPos.current.x + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 70, initialPos.current.y + dy));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
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
  }, [isDragging]);

  const toggleOpen = (e: React.MouseEvent | React.TouchEvent) => {
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

    const advice = await getShoppingAdvice(userQuery, PRODUCTS);
    setMessages(prev => [...prev, { role: 'ai', text: advice || "I'm here to help you choose the best tech." }]);
    setIsLoading(false);
  };

  return (
    <div 
      className="fixed z-[300] touch-none"
      style={{ left: position.x, top: isOpen ? Math.max(20, position.y - 450) : position.y }}
    >
      {isOpen ? (
        <div className="w-[calc(100vw-3rem)] sm:w-96 h-[500px] max-h-[70vh] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div 
            className="p-4 bg-indigo-600 text-white flex items-center justify-between shrink-0 cursor-move"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-indigo-600 rounded-xl flex items-center justify-center font-black italic shadow-lg">
                NB
              </div>
              <div>
                <h4 className="font-bold">Nexa AI</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-indigo-100 uppercase tracking-widest font-bold">Protocol Active</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <GripVertical size={18} className="text-white/40" />
              <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
                className="hover:bg-white/20 p-2 rounded-xl transition-colors active:scale-95"
                aria-label="Close Assistant"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Chat area */}
          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg' 
                  : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100 bg-white shrink-0">
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Nexa about assets..."
                className="flex-grow bg-transparent outline-none text-sm px-2 py-1"
              />
              <button 
                onClick={handleSend}
                className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onClick={toggleOpen}
          className={`group relative w-16 h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center shadow-2xl transition-all hover:scale-110 hover:bg-indigo-600 active:scale-95 border border-white/10 ${isDragging ? 'cursor-grabbing scale-110 ring-4 ring-indigo-400/30' : 'cursor-grab'}`}
          aria-label="Open Assistant"
        >
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
          </div>
          <div className="font-black text-2xl italic">NB</div>
          {!hasMoved.current && !isOpen && (
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 border border-white/10">
              <Sparkles size={10} className="text-indigo-400" /> Nexa Assistant
            </div>
          )}
        </button>
      )}
    </div>
  );
};

export default AIConsultant;