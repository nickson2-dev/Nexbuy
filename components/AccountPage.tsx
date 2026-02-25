import React, { useState, useEffect } from 'react';
import { User, Order } from '../types';
import { fetchOrders, syncUserProfile } from '../services/firebase';
import { 
  User as UserIcon, LogOut, ChevronRight, Edit3, 
  ShoppingBag, Trophy, Crown, Zap, Star, Save, X, Store, ShieldCheck, Sparkles, Gem, Clock, MapPin, Package
} from 'lucide-react';

interface AccountPageProps {
  user: User;
  isAdmin: boolean;
  onNavigate: (view: any) => void;
  onLogout: () => void;
  onRefreshUser: () => void;
  onOpenMembership: () => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ user, isAdmin, onNavigate, onLogout, onRefreshUser, onOpenMembership }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'membership' | 'awards'>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      if (user.isLoggedIn) {
        const allOrders = await fetchOrders();
        setOrders(allOrders.filter(o => o.userId === user.id));
      }
    };
    loadOrders();
  }, [user]);

  const handleUpdateProfile = async () => {
    setSaving(true);
    await syncUserProfile(user.id, { name: editName });
    await onRefreshUser();
    setSaving(false);
    setIsEditing(false);
  };

  if (!user.isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-6">
          <UserIcon size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase italic">Session Restricted</h2>
        <p className="text-slate-500 mb-10 max-w-sm font-medium">Please authenticate to access your personal Nexbuy interface.</p>
        <button onClick={() => onNavigate('home')} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">Return to Hub</button>
      </div>
    );
  }

  const isMerchant = user.role === 'seller' || user.role === 'admin';

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12 md:py-20 animate-fade-in">
      <div className={`rounded-[48px] p-8 md:p-16 mb-12 relative overflow-hidden group shadow-2xl transition-all duration-700 ${user.isLumiAscend ? 'bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900' : 'bg-slate-900'} text-white`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className={`w-24 md:w-32 h-24 md:h-32 ${user.isLumiAscend ? 'bg-gradient-to-tr from-yellow-400 to-amber-500 text-slate-900' : 'bg-indigo-600 text-white'} rounded-[40px] flex items-center justify-center font-black text-4xl italic shadow-2xl group-hover:scale-105 transition-transform`}>
              {user.name.charAt(0)}
            </div>
            <div className="text-center md:text-left">
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                 <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic flex items-center gap-3">
                    {user.name}
                    {user.isLumiAscend && <Crown size={32} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />}
                 </h1>
               </div>
               <p className="text-slate-400 font-medium mb-4">{user.email}</p>
               <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-2">
                     <Zap size={14} className="text-indigo-400" />
                     <span className="text-xs font-black uppercase tracking-widest">{user.points} XP</span>
                  </div>
                  <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-2">
                     <Star size={14} className="text-yellow-400" />
                     <span className="text-xs font-black uppercase tracking-widest">Level {user.level}</span>
                  </div>
               </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            {!user.isLumiAscend && (
              <button onClick={onOpenMembership} className="px-6 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-amber-500/20">
                <Crown size={16} /> Join Lumi Ascend
              </button>
            )}
            <button onClick={onLogout} className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: 'profile', icon: UserIcon, label: 'Profile HUD' },
            { id: 'membership', icon: Crown, label: 'Membership Status', isCrown: true },
            { id: 'orders', icon: ShoppingBag, label: 'Order History' },
            { id: 'awards', icon: Trophy, label: 'Trophy Room' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>
              <tab.icon size={18} className={tab.isCrown && user.isLumiAscend ? 'text-yellow-400' : ''} /> {tab.label}
            </button>
          ))}
          
          <div className="pt-6">
            <div className="h-[1px] bg-slate-100 mb-6"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">Privileged Panels</p>
            <div className="space-y-2">
               <button onClick={() => onNavigate('seller')} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${isMerchant ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                 <div className="flex items-center gap-3"><Store size={16} /> {isMerchant ? 'Seller Dashboard' : 'Become a Merchant'}</div>
                 <ChevronRight size={14} />
               </button>
               {isAdmin && (
                 <button onClick={() => onNavigate('admin')} className="w-full flex items-center justify-between px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-slate-900 text-white shadow-lg">
                   <div className="flex items-center gap-3"><ShieldCheck size={16} /> Admin Hub</div>
                   <ChevronRight size={14} />
                 </button>
               )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-9 animate-fade-in">
          {activeTab === 'profile' && (
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-slate-900 uppercase italic">Identity Matrix</h3>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-widest">
                    <Edit3 size={14} /> Edit Identity
                  </button>
                ) : (
                  <div className="flex gap-4">
                     <button onClick={handleUpdateProfile} disabled={saving} className="text-emerald-600 font-black uppercase text-[10px] flex items-center gap-1"><Save size={14} /> Save</button>
                     <button onClick={() => { setIsEditing(false); setEditName(user.name); }} className="text-slate-400 font-black uppercase text-[10px] flex items-center gap-1"><X size={14} /> Cancel</button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</label>
                  {isEditing ? <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-slate-50 border border-indigo-100 rounded-2xl p-4 text-sm font-bold" /> : <div className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold">{user.name}</div>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</label>
                  <div className="w-full bg-slate-50 rounded-2xl p-4 text-sm font-bold text-slate-400">{user.email}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'membership' && (
            <div className="space-y-8">
               <div className={`p-10 rounded-[48px] border overflow-hidden relative ${user.isLumiAscend ? 'bg-indigo-950 border-indigo-500/30 text-white' : 'bg-white border-slate-100'}`}>
                  <h3 className="text-3xl font-black uppercase italic mb-2">{user.isLumiAscend ? 'Lumi Ascend: Active' : 'Unlock Elite Tier'}</h3>
                  <p className={`text-sm mb-10 max-w-lg ${user.isLumiAscend ? 'text-indigo-200' : 'text-slate-500'}`}>Premium benefits for high-performance citizens.</p>
                  {!user.isLumiAscend && <button onClick={onOpenMembership} className="bg-slate-900 text-white px-12 py-5 rounded-3xl font-black uppercase text-sm">Perks Overview</button>}
               </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="bg-white p-20 rounded-[40px] text-center border border-dashed">
                   <Package size={48} className="text-slate-200 mx-auto mb-4" />
                   <p className="text-slate-500 font-bold italic">No acquisitions found.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                      <div><p className="text-sm font-black">Order #{order.id.slice(-6).toUpperCase()}</p><p className="text-[10px] text-slate-400">{new Date(order.timestamp).toLocaleDateString()}</p></div>
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-indigo-50 text-indigo-600">{order.status}</span>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span className="font-black">${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'awards' && (
            <div className="bg-white p-10 rounded-[40px] border shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-10">Awards</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-8 bg-indigo-50 rounded-[32px] text-center">
                  <div className="text-4xl mb-2">🚀</div>
                  <p className="font-black text-[10px] uppercase">Alpha Citizen</p>
                </div>
                {user.isLumiAscend && (
                  <div className="p-8 bg-amber-50 rounded-[32px] text-center">
                    <div className="text-4xl mb-2">✨</div>
                    <p className="font-black text-[10px] uppercase">Ascended</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;