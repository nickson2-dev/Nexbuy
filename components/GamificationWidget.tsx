import React, { useState, useRef, useEffect } from 'react';
import { User, Reward } from '../types';
import { REWARDS } from '../constants';
import { Trophy, Gift, Zap, ShieldCheck, X, GripVertical, Crown } from 'lucide-react';

interface GamificationWidgetProps {
  user: User;
  onDailyClaim: () => void;
}

const GamificationWidget: React.FC<GamificationWidgetProps> = ({ user, onDailyClaim }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [claimedToday, setClaimedToday] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 80),
        y: Math.min(prev.y, window.innerHeight - 80)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClaim = () => {
    onDailyClaim();
    setClaimedToday(true);
  };

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
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasMoved.current = true;
      const newX = Math.max(10, Math.min(window.innerWidth - 90, initialPos.current.x + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 90, initialPos.current.y + dy));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => setIsDragging(false);
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

  const toggleOpen = () => {
    if (!hasMoved.current) setIsOpen(!isOpen);
  };

  if (!user.isLoggedIn) return null;

  const progress = (user.points % 1000) / 10;

  return (
    <div 
      className="fixed z-[200] flex flex-col items-end touch-none"
      style={{ left: position.x - 80, top: isOpen ? Math.max(20, position.y - 500) : position.y }}
    >
      {isOpen && (
        <div className="mb-4 w-[320px] bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-slide-up">
          <div 
            className={`p-6 ${user.isLumiAscend ? 'bg-indigo-950' : 'bg-slate-900'} text-white cursor-move`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black">{user.level}</div>
                <div>
                  <h4 className="font-bold text-sm uppercase">{user.name}</h4>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck size={10} /> Citizen
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full"><X size={18} /></button>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-[9px] text-slate-400 mt-2 uppercase font-bold tracking-widest">{1000 - (user.points % 1000)} XP to next Level</p>
          </div>
          <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
            <button 
              disabled={claimedToday}
              onClick={handleClaim}
              className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${claimedToday ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}
            >
              {claimedToday ? 'Daily Claimed' : 'Claim Daily Bonus'}
            </button>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rewards</p>
              {REWARDS.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm font-bold">{r.title}</span>
                  <span className="text-[10px] font-black text-indigo-600">{r.cost} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <button 
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onClick={toggleOpen}
        className={`w-16 h-16 ${user.isLumiAscend ? 'bg-indigo-700' : 'bg-slate-900'} text-white rounded-[24px] flex items-center justify-center shadow-2xl transition-all border border-white/5 ${isDragging ? 'cursor-grabbing scale-110' : 'cursor-grab hover:scale-105'}`}
      >
        <Trophy size={28} />
      </button>
    </div>
  );
};

export default GamificationWidget;