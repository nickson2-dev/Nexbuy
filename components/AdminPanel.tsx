import React, { useState, useEffect } from 'react';
import { Product, Order, AnalyticsData, User } from '../types';
import { fetchOrders, updateOrderStatus, calculateAnalytics, fetchPendingSellers, approveSeller, rejectSeller } from '../services/firebase';
import { 
  X, Edit3, DollarSign, TrendingUp, ShoppingBag, 
  BarChart3, ArrowUpRight, LayoutDashboard, Package, 
  CheckCircle2, XCircle, UserCheck, ShieldCheck, Activity, Globe, Users, Zap, Clock, ShieldAlert
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  onSave: (product: Product) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ products, onSave, onDelete, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'applications'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingSellers, setPendingSellers] = useState<User[]>([]);
  const [liveTraffic, setLiveTraffic] = useState(420);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalProfit: 0,
    activeOrders: 0,
    growthRate: 0
  });

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedOrders, fetchedStats, fetchedSellers] = await Promise.all([
        fetchOrders(),
        calculateAnalytics(),
        fetchPendingSellers()
      ]);
      setOrders(fetchedOrders);
      setAnalytics(fetchedStats);
      setPendingSellers(fetchedSellers);
    } catch (e: any) {
      console.error("Admin data load error:", e);
      setError("Unable to sync with Nexbuy Central. Please verify database security permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
    const interval = setInterval(() => {
      setLiveTraffic(prev => Math.max(100, prev + Math.floor(Math.random() * 21) - 10));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10 animate-fade-in">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-4 italic uppercase">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center italic shadow-xl shadow-indigo-200">N</div>
            Nexus Command
          </h1>
          <p className="text-slate-500 font-medium ml-16 mt-[-8px]">Global Ecosystem Intelligence & Governance</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-[24px] border border-slate-200 shadow-inner">
          {(['overview', 'products', 'orders', 'applications'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'bg-white text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab === 'applications' && pendingSellers.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white text-[9px] flex items-center justify-center rounded-full animate-pulse border-2 border-white">
                  {pendingSellers.length}
                </span>
              )}
              {tab}
            </button>
          ))}
          <button onClick={onClose} className="p-3 ml-2 text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
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
        <div className="py-40 flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Nexus Data...</p>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl group-hover:scale-110 transition-transform"><DollarSign size={24} /></div>
                    <div className="flex items-center gap-1 text-green-500 text-[10px] font-black bg-green-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                      <ArrowUpRight size={14} /> +{analytics.growthRate}%
                    </div>
                  </div>
                  <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Revenue</h4>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter italic">${analytics.totalRevenue.toLocaleString()}</p>
                </div>
                
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl group-hover:scale-110 transition-transform"><TrendingUp size={24} /></div>
                    <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                      Efficient
                    </div>
                  </div>
                  <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Net Yield</h4>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter italic">${analytics.totalProfit.toLocaleString()}</p>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:border-orange-200 transition-all">
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
                 <span className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.3em] bg-indigo-50 px-4 py-2 rounded-full">{pendingSellers.length} Awaiting Verification</span>
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
                    <div key={u.id} className="group bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                      <div className="flex items-center gap-6 mb-10">
                        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center font-black text-3xl group-hover:scale-110 transition-transform">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-slate-900 italic uppercase">{u.storeName}</h4>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1">Founder: {u.name}</p>
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
                            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em] mt-1">${product.price.toLocaleString()} — {product.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-10 text-right">
                           <div className="hidden md:block">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock</p>
                              <p className="text-sm font-black text-slate-900">{product.stock} Units</p>
                           </div>
                           <button className="p-3 bg-slate-50 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm">
                              <Edit3 size={18} />
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
                               NEX-{order.id.toString().slice(-8).toUpperCase()}
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
                             <span className="text-lg font-black text-slate-900 tracking-tighter tabular-nums">${order.total.toLocaleString()}</span>
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
        </>
      )}
    </div>
  );
};

export default AdminPanel;