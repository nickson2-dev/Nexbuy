import React, { useState, useEffect, useRef } from 'react';
import { Product, Order, AnalyticsData, User, SupportMessage } from '../types';
import { 
  fetchOrders, updateOrderStatus, calculateAnalytics, 
  fetchPendingSellers, approveSeller, rejectSeller,
  fetchShippingRates, updateShippingRate, deleteShippingRate,
  listenToSupportMessages, sendSupportMessage, updateMessageStatus
} from '../services/firebase';
import SectionLoader from './SectionLoader';
import { useCurrency } from '../src/context/CurrencyContext';
import { 
  X, Edit3, DollarSign, TrendingUp, ShoppingBag, 
  BarChart3, ArrowUpRight, LayoutDashboard, Package, 
  CheckCircle2, XCircle, UserCheck, ShieldCheck, Activity, Globe, Users, Zap, Clock, ShieldAlert, Truck, Plus, Trash2, MapPin, MessageSquare, Send
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  onSave: (product: Product) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, onSave, onDelete, onClose }) => {
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'applications' | 'logistics' | 'support'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingSellers, setPendingSellers] = useState<User[]>([]);
  const [shippingRates, setShippingRates] = useState<Record<string, number>>({});
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [selectedUserChat, setSelectedUserChat] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newCost, setNewCost] = useState('');
  const [liveTraffic, setLiveTraffic] = useState(420);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalProfit: 0,
    activeOrders: 0,
    growthRate: 0
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedOrders, fetchedStats, fetchedSellers, fetchedRates] = await Promise.all([
        fetchOrders(),
        calculateAnalytics(),
        fetchPendingSellers(),
        fetchShippingRates()
      ]);
      setOrders(fetchedOrders);
      setAnalytics(fetchedStats);
      setPendingSellers(fetchedSellers);
      setShippingRates(fetchedRates);
    } catch (e: any) {
      console.error("Admin data load error:", e);
      setError("Unable to sync with Nexota Central. Please verify database security permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
    const unsubscribeSupport = listenToSupportMessages((messages) => {
      setSupportMessages(messages);
    });

    const interval = setInterval(() => {
      setLiveTraffic(prev => Math.max(100, prev + Math.floor(Math.random() * 21) - 10));
    }, 3000);

    return () => {
      unsubscribeSupport();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedUserChat, supportMessages]);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    if (await updateOrderStatus(orderId, status)) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

  const handleApproveSeller = async (uid: string) => {
    if (await approveSeller(uid)) {
      setPendingSellers(prev => prev.filter(u => u.id !== uid));
    }
  };

  const handleRejectSeller = async (uid: string) => {
    if (await rejectSeller(uid)) {
      setPendingSellers(prev => prev.filter(u => u.id !== uid));
    }
  };

  const handleAddRate = async () => {
    if (!newDistrict || !newCost) return;
    const costNum = parseFloat(newCost);
    if (isNaN(costNum)) return;

    if (await updateShippingRate(newDistrict, costNum)) {
      setShippingRates(prev => ({ ...prev, [newDistrict]: costNum }));
      setNewDistrict('');
      setNewCost('');
    }
  };

  const handleDeleteRate = async (district: string) => {
    if (await deleteShippingRate(district)) {
      const updated = { ...shippingRates };
      delete updated[district];
      setShippingRates(updated);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedUserChat) return;

    const lastMsg = supportMessages.find(m => m.userId === selectedUserChat);
    if (!lastMsg) return;

    await sendSupportMessage({
      userId: selectedUserChat,
      userName: lastMsg.userName,
      userEmail: lastMsg.userEmail,
      message: replyText.trim(),
      isAdmin: true,
    });
    setReplyText('');
  };

  const unreadMessagesCount = supportMessages.filter(m => m.status === 'unread' && !m.isAdmin).length;
  const userChats = Array.from(new Set(supportMessages.map(m => m.userId))).map(userId => {
    const userMsgs = supportMessages.filter(m => m.userId === userId);
    const lastMsg = userMsgs[userMsgs.length - 1];
    const unreadCount = userMsgs.filter(m => m.status === 'unread' && !m.isAdmin).length;
    return { userId, lastMsg, unreadCount };
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10 animate-fade-in cyber-grid min-h-screen">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-4 italic uppercase glitch">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center italic shadow-xl shadow-indigo-200 nexus-pulse">N</div>
            Nexus Command
          </h1>
          <p className="text-slate-500 font-medium ml-16 mt-[-8px]">Global Ecosystem Intelligence & Governance</p>
        </div>
        
        <div className="w-full lg:w-auto overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex bg-slate-100 p-1.5 rounded-[24px] border border-slate-200 shadow-inner min-w-max lg:min-w-0">
            {(['overview', 'products', 'orders', 'applications', 'logistics', 'support'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                  activeTab === tab ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'applications' && pendingSellers.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white text-[9px] flex items-center justify-center rounded-full animate-pulse border-2 border-white">
                    {pendingSellers.length}
                  </span>
                )}
                {tab === 'support' && unreadMessagesCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white text-[9px] flex items-center justify-center rounded-full animate-pulse border-2 border-white">
                    {unreadMessagesCount}
                  </span>
                )}
                {tab}
              </button>
            ))}
            <button onClick={onClose} className="p-3 ml-2 text-slate-400 hover:text-red-500 transition-colors shrink-0"><X size={20} /></button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-10 p-6 bg-red-50 border border-red-100 rounded-[32px] flex items-center gap-4 text-red-600 animate-slide-up">
          <ShieldAlert size={24} />
          <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
          <button onClick={loadAdminData} className="ml-auto px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Retry Sync</button>
        </div>
      )}

      {loading ? (
        <SectionLoader message="Synchronizing Nexus Data..." />
      ) : (
        <>
          {activeTab === 'overview' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all hover:neon-glow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl group-hover:scale-110 transition-transform"><DollarSign size={24} /></div>
                    <div className="flex items-center gap-1 text-green-500 text-[10px] font-black bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                      <ArrowUpRight size={14} /> +{analytics.growthRate}%
                    </div>
                  </div>
                  <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Revenue</h4>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{formatPrice(analytics.totalRevenue)}</p>
                </div>
                
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all hover:neon-glow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl group-hover:scale-110 transition-transform"><TrendingUp size={24} /></div>
                    <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                      Efficient
                    </div>
                  </div>
                  <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Net Yield</h4>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{formatPrice(analytics.totalProfit)}</p>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:border-orange-200 transition-all hover:neon-glow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-3xl group-hover:scale-110 transition-transform"><ShoppingBag size={24} /></div>
                  </div>
                  <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Order Volume</h4>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{analytics.activeOrders}</p>
                </div>

                <div className="bg-slate-900 p-8 rounded-[40px] text-white relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={80} /></div>
                   <div className="relative z-10">
                     <div className="flex items-center gap-2 mb-6">
                       <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
                       <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">Live Traffic</h4>
                     </div>
                     <p className="text-4xl font-black italic tracking-tighter">{liveTraffic}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Active Sessions Hub</p>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
                   <div className="flex justify-between items-center mb-10">
                     <h3 className="text-xl font-black uppercase italic flex items-center gap-3">
                       <Globe size={20} className="text-indigo-600" />
                       Geographic Impact
                     </h3>
                     <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Full Map View</button>
                   </div>
                   <div className="h-64 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                      <div className="relative flex flex-col items-center gap-4">
                         <Users size={32} className="text-slate-300" />
                         <p className="text-slate-400 text-sm font-medium italic">Nexus Global presence visualized in 42 regions.</p>
                      </div>
                   </div>
                </div>

                <div className="bg-indigo-600 p-10 rounded-[48px] text-white flex flex-col justify-between shadow-2xl shadow-indigo-200">
                   <div>
                     <Zap size={32} className="mb-6 text-indigo-300 fill-indigo-300/20" />
                     <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-none mb-4">System Core<br/>Status: Nominal</h3>
                     <p className="text-indigo-100 text-sm opacity-80 font-medium">Global AI protocols are currently processing merchant requests at 99.8% accuracy.</p>
                   </div>
                   <div className="mt-10 space-y-4">
                     <div className="flex justify-between items-center border-t border-white/10 pt-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Latency</span>
                        <span className="text-xs font-black">24ms</span>
                     </div>
                     <div className="flex justify-between items-center border-t border-white/10 pt-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Auth Shield</span>
                        <span className="text-xs font-black">Active</span>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-10 animate-slide-up">
              <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-black text-slate-900 uppercase italic">Merchant Pipeline</h3>
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={loadAdminData}
                      disabled={loading}
                      className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-90 disabled:opacity-50"
                      title="Sync Data"
                    >
                      <Activity size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.3em] bg-indigo-50 px-4 py-2 rounded-full">{pendingSellers.length} Awaiting Verification</span>
                 </div>
              </div>

              {pendingSellers.length === 0 ? (
                <div className="bg-white rounded-[56px] p-32 text-center border border-dashed border-slate-200 shadow-sm">
                   <ShieldCheck size={64} className="text-slate-100 mx-auto mb-6" />
                   <h4 className="text-2xl font-black text-slate-300 uppercase italic">All Systems Clear</h4>
                   <p className="text-slate-400 font-medium italic mt-2">No pending merchant applications in current quadrant.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {pendingSellers.map(u => (
                    <div key={u.id} className="group bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-200">
                      <div className="flex items-center gap-6 mb-10">
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center font-black text-3xl group-hover:scale-110 transition-transform">
                          {(u.name || 'U').charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-slate-900 italic uppercase">{u.storeName}</h4>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1">Founder: {u.name || 'Unknown'}</p>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 p-8 rounded-[32px] mb-10 border border-slate-100">
                         <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Edit3 size={12} /> Prospectus
                         </div>
                         <p className="text-sm text-slate-600 font-medium italic leading-relaxed">"{u.storeDescription}"</p>
                      </div>

                      <div className="flex gap-6">
                        <button 
                          onClick={() => handleApproveSeller(u.id)}
                          className="flex-grow bg-slate-900 text-white h-16 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-xl"
                        >
                          <CheckCircle2 size={18} /> Approve
                        </button>
                        <button 
                          onClick={() => handleRejectSeller(u.id)}
                          className="w-20 bg-slate-100 text-slate-400 h-16 rounded-2xl font-black uppercase hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center"
                          title="Reject Application"
                        >
                          <XCircle size={24} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'logistics' && (
            <div className="space-y-10 animate-slide-up">
              <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-black text-slate-900 uppercase italic">Logistics Governance</h3>
                 <p className="text-slate-500 text-sm font-medium">Configure district-based shipping costs for the global network.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm h-fit">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Plus size={14} className="text-indigo-600" /> Add New District
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">District Name</label>
                      <input 
                        type="text" 
                        value={newDistrict}
                        onChange={(e) => setNewDistrict(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold"
                        placeholder="e.g. Kampala"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Shipping Cost ($)</label>
                      <input 
                        type="number" 
                        value={newCost}
                        onChange={(e) => setNewCost(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold"
                        placeholder="0.00"
                      />
                    </div>
                    <button 
                      onClick={handleAddRate}
                      className="w-full bg-slate-900 text-white h-14 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-indigo-600 transition-all shadow-lg"
                    >
                      Deploy Rate
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Shipping Matrix</h4>
                    <Truck size={16} className="text-slate-300" />
                  </div>
                  <div className="divide-y divide-slate-50">
                    {Object.entries(shippingRates).length === 0 ? (
                      <div className="p-20 text-center text-slate-400 italic text-sm">No shipping rates defined.</div>
                    ) : (
                      Object.entries(shippingRates).map(([district, cost]) => (
                        <div key={district} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                              <MapPin size={18} />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 uppercase italic">{district}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">District Zone</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <p className="text-lg font-black text-indigo-600 tracking-tighter tabular-nums">{formatPrice(cost)}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Delivery Fee</p>
                            </div>
                            <button 
                              onClick={() => handleDeleteRate(district)}
                              className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-slide-up">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="font-black text-slate-900 uppercase tracking-widest text-xs italic">Asset Stream (Global)</h2>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                       <Clock size={12} /> Updated Realtime
                    </div>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {products.map(product => (
                      <div key={product.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all group">
                        <div className="flex items-center gap-6">
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                            <img src={product.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          </div>
                          <div>
                            <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight italic">{product.name}</h3>
                            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em] mt-1">
                              {formatPrice(product.price)} — {product.category}
                              {product.sector === 'art' && <span className="ml-2 text-[#00ff00]">[ART SECTOR]</span>}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-10 text-right">
                           <div className="hidden md:block">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock</p>
                              <p className="text-sm font-black text-slate-900">{product.stock} Units</p>
                           </div>
                           <button 
                             onClick={() => setEditingProduct(product)}
                             className="p-3 bg-slate-50 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm"
                           >
                              <Edit3 size={18} />
                           </button>
                           <button 
                             onClick={() => onDelete(product.id)}
                             className="p-3 bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm"
                           >
                              <Trash2 size={18} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                 <div className="bg-indigo-600 p-10 rounded-[48px] text-white flex flex-col items-center justify-center text-center shadow-2xl shadow-indigo-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
                    <Package size={48} className="text-indigo-300 mb-6 drop-shadow-lg" />
                    <h4 className="text-xl font-black uppercase italic tracking-tighter mb-2">Asset Cloud Sync</h4>
                    <p className="text-indigo-100 text-xs font-medium opacity-80 mb-8">All products are decentralized across the Nexus CDN.</p>
                    <div className="w-full bg-white/10 p-6 rounded-3xl border border-white/10">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4">Storage Metrics</p>
                       <div className="flex justify-between items-center text-xs">
                          <span>Occupancy</span>
                          <span className="font-black">8.2 TB</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Inventory Alerts</h4>
                    <div className="space-y-4">
                       <div className="flex items-center gap-4 p-4 bg-orange-50 text-orange-600 rounded-2xl border border-orange-100">
                          <Zap size={16} />
                          <p className="text-[10px] font-black uppercase tracking-widest">3 Items Low Stock</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-[56px] border border-slate-100 shadow-sm overflow-hidden animate-slide-up">
              <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase italic">Transaction Ledger</h3>
                  <p className="text-slate-500 text-sm font-medium mt-1">Verified global fulfillment logs sourced from Stripe API Relay.</p>
                </div>
                <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100">
                   <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-white text-indigo-600 rounded-xl shadow-sm">Export Logs</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.3em]">
                      <th className="px-10 py-6">ID Signature</th>
                      <th className="px-10 py-6">Identity</th>
                      <th className="px-10 py-6">Logic Status</th>
                      <th className="px-10 py-6">Yield</th>
                      <th className="px-10 py-6 text-center">Protocol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center text-slate-400 italic">No orders logged in current ecosystem.</td>
                      </tr>
                    ) : (
                      orders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-all group">
                          <td className="px-10 py-8">
                            <span className="text-sm font-black text-slate-900 font-mono tracking-tighter">
                                NX-{order.id.toString().slice(-8).toUpperCase()}
                            </span>
                          </td>
                          <td className="px-10 py-8">
                            <div className="text-sm font-black text-slate-900 uppercase italic leading-none mb-1">{order.customerName}</div>
                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{new Date(order.timestamp).toLocaleString()}</div>
                          </td>
                          <td className="px-10 py-8">
                            <div className="relative inline-block w-full max-w-[140px]">
                              <select 
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                className={`w-full text-[10px] font-black uppercase px-4 py-2.5 rounded-xl border border-slate-100 outline-none cursor-pointer transition-all appearance-none ${
                                  order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                             <span className="text-lg font-black text-slate-900 tracking-tighter tabular-nums">{formatPrice(order.total)}</span>
                          </td>
                          <td className="px-10 py-8 text-center">
                            <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm">
                               <BarChart3 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 h-[700px] animate-slide-up">
              <div className="lg:col-span-1 bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-8 bg-slate-50 border-b border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Active Channels</h3>
                </div>
                <div className="flex-grow overflow-y-auto divide-y divide-slate-50">
                  {userChats.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 italic text-sm">No active support protocols.</div>
                  ) : (
                    userChats.map(chat => (
                      <button 
                        key={chat.userId}
                        onClick={() => {
                          setSelectedUserChat(chat.userId);
                          // Mark as read
                          supportMessages
                            .filter(m => m.userId === chat.userId && m.status === 'unread' && !m.isAdmin)
                            .forEach(m => updateMessageStatus(m.id, 'read'));
                        }}
                        className={`w-full p-6 text-left hover:bg-slate-50 transition-all flex items-center gap-4 ${selectedUserChat === chat.userId ? 'bg-indigo-50/50 border-r-4 border-indigo-600' : ''}`}
                      >
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black relative">
                          <UserCheck size={20} />
                          {chat.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[9px] flex items-center justify-center rounded-full border-2 border-white">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-sm font-black text-slate-900 truncate uppercase italic">{chat.lastMsg.userName}</h4>
                            <span className="text-[9px] font-bold text-slate-400 uppercase">
                              {new Date(chat.lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate font-medium">{chat.lastMsg.message}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 bg-slate-900 rounded-[48px] shadow-2xl border border-white/5 flex flex-col overflow-hidden">
                {selectedUserChat ? (
                  <>
                    <div className="p-8 bg-slate-800/50 border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                          <MessageSquare size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-white uppercase italic tracking-tight">
                            {supportMessages.find(m => m.userId === selectedUserChat)?.userName}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            {supportMessages.find(m => m.userId === selectedUserChat)?.userEmail}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div 
                      ref={scrollRef}
                      className="flex-grow overflow-y-auto p-8 space-y-4 no-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent"
                    >
                      {supportMessages.filter(m => m.userId === selectedUserChat).map(msg => (
                        <div 
                          key={msg.id} 
                          className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'} animate-fade-in`}
                        >
                          <div className={`max-w-[70%] p-5 rounded-[32px] text-sm ${
                            msg.isAdmin 
                            ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20' 
                            : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'
                          }`}>
                            <p className="font-medium leading-relaxed">{msg.message}</p>
                            <div className="flex items-center justify-between mt-3 opacity-50">
                              <span className="text-[9px] font-black uppercase tracking-widest">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {msg.isAdmin && (
                                <span className="text-[9px] font-black uppercase tracking-widest">Sent by Admin</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-8 bg-slate-800/50 border-t border-white/5">
                      <form onSubmit={handleSendReply} className="flex gap-4">
                        <input 
                          type="text" 
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your response to the user..."
                          className="flex-grow bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                        />
                        <button 
                          type="submit"
                          disabled={!replyText.trim()}
                          className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-50 transition-all active:scale-90 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-indigo-600/20"
                        >
                          <Send size={24} />
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-20 space-y-6 opacity-30">
                    <div className="w-24 h-24 bg-slate-800 rounded-[40px] flex items-center justify-center">
                      <MessageSquare size={48} className="text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-400 uppercase italic">Select a Protocol</h3>
                      <p className="text-slate-500 text-sm font-medium mt-2">Choose a communication channel from the left to begin governance interaction.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
      {editingProduct && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setEditingProduct(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[40px] p-10 shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black uppercase italic">Edit Asset Matrix</h3>
              <button onClick={() => setEditingProduct(null)} className="p-2 text-slate-400 hover:text-red-500"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Name</label>
                <input 
                  type="text" 
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price</label>
                  <input 
                    type="number" 
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock</label>
                  <input 
                    type="number" 
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-black"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sector</label>
                  <select 
                    value={editingProduct.sector || 'tech'}
                    onChange={(e) => setEditingProduct({...editingProduct, sector: e.target.value as 'tech' | 'art'})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-black"
                  >
                    <option value="tech">Tech</option>
                    <option value="art">Art (Professional Showcase)</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={() => { onSave(editingProduct); setEditingProduct(null); }}
                className="w-full bg-slate-900 text-white h-16 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
              >
                Commit Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
