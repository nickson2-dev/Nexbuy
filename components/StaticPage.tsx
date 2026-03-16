import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Shield, Info, HelpCircle, FileText, Mail, Briefcase, Leaf, TrendingUp, Truck, RefreshCw, Clock, Send, User as UserIcon, Zap, ShieldCheck } from 'lucide-react';
import { User, SupportMessage } from '../types';
import { sendSupportMessage, listenToSupportMessages } from '../services/firebase';

interface StaticPageProps {
  title: string;
  onBack: () => void;
  user: User;
}

const StaticPage: React.FC<StaticPageProps> = ({ title, onBack, user }) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<SupportMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (title.toLowerCase().includes('help') && user.isLoggedIn) {
      const unsubscribe = listenToSupportMessages((messages) => {
        // Filter messages for this user
        const userMessages = messages.filter(m => m.userId === user.id);
        setChatMessages(userMessages);
      });
      return () => unsubscribe();
    }
  }, [title, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user.isLoggedIn) return;

    setIsSending(true);
    try {
      await sendSupportMessage({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        message: message.trim(),
        isAdmin: false,
      });
      setMessage('');
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const getIcon = () => {
    const t = title.toLowerCase();
    if (t.includes('help')) return <HelpCircle size={48} className="text-indigo-500" />;
    if (t.includes('privacy') || t.includes('terms') || t.includes('cookie')) return <Shield size={48} className="text-indigo-500" />;
    if (t.includes('story')) return <Info size={48} className="text-indigo-500" />;
    if (t.includes('contact')) return <Mail size={48} className="text-indigo-500" />;
    if (t.includes('career')) return <Briefcase size={48} className="text-indigo-500" />;
    if (t.includes('sustain')) return <Leaf size={48} className="text-indigo-500" />;
    if (t.includes('invest')) return <TrendingUp size={48} className="text-indigo-500" />;
    if (t.includes('shipping')) return <Truck size={48} className="text-indigo-500" />;
    if (t.includes('return')) return <RefreshCw size={48} className="text-indigo-500" />;
    if (t.includes('status')) return <Clock size={48} className="text-indigo-500" />;
    return <FileText size={48} className="text-indigo-500" />;
  };

  const isHelpCenter = title.toLowerCase().includes('help');

  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-24">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-black uppercase tracking-widest">Back to Interface</span>
        </button>

        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-24 h-24 bg-indigo-50 rounded-[32px] flex items-center justify-center mb-8">
            {getIcon()}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic uppercase mb-6">
            {title}
          </h1>
          <div className="w-20 h-1.5 bg-indigo-600 rounded-full"></div>
        </div>

        {isHelpCenter ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                  <Zap size={20} className="text-indigo-600" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest mb-2">Instant Support</h4>
                <p className="text-[10px] text-slate-500 font-medium">Average response time: 2 mins</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                  <ShieldCheck size={20} className="text-indigo-600" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest mb-2">Secure Protocol</h4>
                <p className="text-[10px] text-slate-500 font-medium">End-to-end encrypted channel</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                  <Mail size={20} className="text-indigo-600" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest mb-2">Direct Access</h4>
                <p className="text-[10px] text-slate-500 font-medium">Connect with Nexota Governance</p>
              </div>
            </div>

            {/* Messaging Interface */}
            <div className="bg-slate-900 rounded-[48px] overflow-hidden shadow-2xl border border-white/5 flex flex-col h-[600px]">
              <div className="p-6 bg-slate-800/50 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <Zap size={20} className="text-white fill-current" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Nexus Support Node</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Protocol</span>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                ref={scrollRef}
                className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent"
              >
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <HelpCircle size={48} className="text-slate-600" />
                    <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Initialize communication below</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'} animate-fade-in`}
                    >
                      <div className={`max-w-[80%] p-4 rounded-3xl text-sm ${
                        msg.isAdmin 
                        ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5' 
                        : 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20'
                      }`}>
                        <p className="font-medium leading-relaxed">{msg.message}</p>
                        <p className={`text-[9px] mt-2 font-black uppercase tracking-widest opacity-50 ${msg.isAdmin ? 'text-slate-400' : 'text-indigo-100'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 bg-slate-800/50 border-t border-white/5">
                {user.isLoggedIn ? (
                  <form onSubmit={handleSendMessage} className="flex gap-4">
                    <input 
                      type="text" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message to Governance..."
                      className="flex-grow bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                    />
                    <button 
                      type="submit"
                      disabled={isSending || !message.trim()}
                      className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-500 transition-all active:scale-90 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-indigo-600/20"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Please connect to initialize support protocol</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="prose prose-slate max-w-none">
            <p className="text-xl text-slate-600 leading-relaxed mb-8 font-medium">
              Welcome to the {title} portal. This section is currently being optimized for the Nexota ecosystem.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4">Protocol Update</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Our governance team is currently drafting the latest documentation for this sector. We ensure all information meets the Nexota standard of excellence.
                </p>
              </div>
              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4">Need Assistance?</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  If you require immediate information regarding {title}, please consult with Nexa AI or contact our priority support nodes.
                </p>
              </div>
            </div>

            <div className="mt-16 p-12 bg-slate-900 rounded-[48px] text-center text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
              <h2 className="text-2xl font-black italic uppercase mb-4 relative z-10">Nexota Intelligence</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto relative z-10">
                All data within this sector is encrypted and verified by the Nexus Protocol.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaticPage;
