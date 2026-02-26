import React, { useState, useEffect, useMemo } from 'react';
import { User, Product, Order } from '../types';
import { applyAsSeller, fetchSellerProducts, createSellerProduct, fetchOrders, updateSellerProduct, deleteSellerProduct } from '../services/firebase';
import SectionLoader from './SectionLoader';
import ButtonLoader from './ButtonLoader';
import { 
  Store, Package, TrendingUp, DollarSign, Plus, X, 
  ChevronRight, BarChart3, CheckCircle2,
  Target, Activity, ShieldAlert, Zap, ArrowLeft, ChevronLeft, List, Edit3, Trash2, ShieldCheck, Info, Search, Filter
} from 'lucide-react';

interface SellerPortalProps {
  user: User;
  onClose: () => void;
  onRefreshUser: () => void;
}

const SellerPortal: React.FC<SellerPortalProps> = ({ user, onClose, onRefreshUser }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'orders'>('dashboard');
  const [isApplying, setIsApplying] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [appStoreName, setAppStoreName] = useState('');
  const [appStoreDesc, setAppStoreDesc] = useState('');

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'sellerId'>>({
    name: '', price: 0, costPrice: 0, category: 'Electronics', image: '', rating: 5.0, description: '', stock: 10, specs: {}, xpGain: 100
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const hasFullAccess = user.role === 'admin' || (user.role === 'seller' && user.sellerStatus === 'approved');

  const loadSellerData = async () => {
    if (!hasFullAccess) return;
    setLoading(true);
    setError(null);
    try {
      const [p, o] = await Promise.all([fetchSellerProducts(user.id), fetchOrders()]);
      setProducts(p || []);
      // Filter orders that contain items belonging to this seller
      setOrders((o || []).filter(order => order.items.some(item => item.sellerId === user.id)));
    } catch (err: any) {
      console.error("Seller portal load failed:", err);
      setError("Asset relay sync interrupted. Please verify merchant credentials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellerData();
  }, [user.id, hasFullAccess]);

  const metrics = useMemo(() => {
    let rev = 0;
    const trend = new Array(12).fill(0).map(() => 10 + Math.floor(Math.random() * 80));
    orders.forEach(o => {
      const sellerItems = o.items.filter(i => i.sellerId === user.id);
      rev += sellerItems.reduce((s, i) => s + (i.price * i.quantity), 0);
    });
    return { rev, trend };
  }, [orders, user.id]);

  const addSpec = () => {
    if (specKey && specValue) {
      if (editingProduct) {
        setEditingProduct(p => p ? ({ ...p, specs: { ...p.specs, [specKey]: specValue } }) : null);
      } else {
        setNewProduct(p => ({ ...p, specs: { ...p.specs, [specKey]: specValue } }));
      }
      setSpecKey(''); setSpecValue('');
    }
  };

  const removeSpec = (key: string) => {
    if (editingProduct) {
      const newSpecs = { ...editingProduct.specs };
      delete newSpecs[key];
      setEditingProduct({ ...editingProduct, specs: newSpecs });
    } else {
      const newSpecs = { ...newProduct.specs };
      delete newSpecs[key];
      setNewProduct({ ...newProduct, specs: newSpecs });
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appStoreName.trim()) return;
    setIsApplying(true);
    if (await applyAsSeller(user.id, appStoreName, appStoreDesc)) await onRefreshUser();
    setIsApplying(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || newProduct.price <= 0) return;
    setLoading(true);
    const added = await createSellerProduct({ ...newProduct, sellerId: user.id, sellerName: user.storeName });
    if (added) {
      const updatedProducts = await fetchSellerProducts(user.id);
      setProducts(updatedProducts);
      setShowAddProduct(false);
      setNewProduct({ name: '', price: 0, costPrice: 0, category: 'Electronics', image: '', rating: 5.0, description: '', stock: 10, specs: {}, xpGain: 100 });
    }
    setLoading(false);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setLoading(true);
    if (await updateSellerProduct(editingProduct.id, editingProduct)) {
      const updatedProducts = await fetchSellerProducts(user.id);
      setProducts(updatedProducts);
      setEditingProduct(null);
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset from the catalog?")) return;
    if (await deleteSellerProduct(id)) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  if (!hasFullAccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24 animate-fade-in text-center">
        <button onClick={onClose} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black uppercase text-[10px] tracking-[0.3em] mb-12 transition-all"><ChevronLeft size={16} /> Matrix Return</button>
        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-100"><Store size={48} /></div>
        <h1 className="text-5xl font-black mb-6 uppercase italic tracking-tighter">Nexbuy Merchant <br/>Onboarding</h1>
        
        {user.sellerStatus === 'pending' ? (
          <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm space-y-6">
             <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Activity size={32} />
             </div>
             <h3 className="text-2xl font-black text-slate-900 italic uppercase">Application Pending</h3>
             <p className="text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
               The global governance board is currently reviewing <span className="text-indigo-600 font-black">"{user.storeName}"</span>. You will receive a neural notification once approved.
             </p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-2xl space-y-8 animate-slide-up">
            <div className="text-left space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Store Identity</label>
               <input type="text" placeholder="e.g. Future Components Corp" value={appStoreName} onChange={e => setAppStoreName(e.target.value)} className="w-full bg-slate-50 p-6 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold" required />
            </div>
            <div className="text-left space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Merchant Prospectus</label>
               <textarea placeholder="Describe your catalog and vision..." value={appStoreDesc} onChange={e => setAppStoreDesc(e.target.value)} className="w-full bg-slate-50 p-6 rounded-2xl outline-none h-40 focus:ring-2 focus:ring-indigo-500 transition-all font-medium" />
            </div>
            <button type="submit" disabled={isApplying} className="w-full bg-slate-900 text-white h-20 rounded-[32px] font-black uppercase text-lg shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-3">
               {isApplying ? <ButtonLoader /> : 'Initialize Merchant Request'}
            </button>
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
               <ShieldCheck size={14} className="text-emerald-500" /> Authorized Nexbuy Logistics Hub
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center italic shadow-xl shadow-emerald-200">M</div>
            Merchant Hub
          </h1>
          <p className="text-slate-500 font-medium ml-16 mt-[-8px]">Operational dashboard for <span className="text-slate-900 font-black">"{user.storeName}"</span></p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-[24px] border border-slate-200 shadow-inner">
          {(['dashboard', 'inventory', 'orders'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-emerald-600 shadow-xl' : 'text-slate-500 hover:text-slate-900'}`}>{t}</button>
          ))}
          <button onClick={onClose} className="p-3 ml-2 text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-[32px] flex items-center gap-4 text-red-600 animate-slide-up">
          <ShieldAlert size={24} />
          <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
          <button onClick={loadSellerData} className="ml-auto px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Retry Sync</button>
        </div>
      )}

      {loading ? (
        <SectionLoader message="Loading Merchant Data..." />
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl group-hover:scale-110 transition-transform"><DollarSign size={24} /></div>
                    <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest">Live</div>
                  </div>
                  <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Yield</h4>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter italic">${metrics.rev.toLocaleString()}</p>
                </div>
                
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl group-hover:scale-110 transition-transform"><Package size={24} /></div>
                  </div>
                  <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Cataloged Assets</h4>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{products.length}</p>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:border-orange-200 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-3xl group-hover:scale-110 transition-transform"><TrendingUp size={24} /></div>
                  </div>
                  <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Orders Fulfilled</h4>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter italic">{orders.length}</p>
                </div>

                <div className="bg-slate-900 p-8 rounded-[40px] text-white flex flex-col justify-center">
                   <div className="flex items-center gap-2 mb-4">
                      <Activity size={16} className="text-emerald-400" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Merchant Health</h4>
                   </div>
                   <p className="text-2xl font-black italic tracking-tighter">Verified Alpha</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Ecosystem Status: Sync</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                  <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-xl font-black uppercase italic flex items-center gap-3">
                        <BarChart3 size={20} className="text-emerald-600" />
                        Sales Velocity (Daily)
                      </h3>
                      <div className="flex gap-2">
                        <div className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black rounded-lg">LAST 12 DAYS</div>
                      </div>
                    </div>
                    <div className="flex items-end justify-between h-48 gap-3">
                      {metrics.trend.map((h, i) => (
                        <div key={i} className="flex-grow group relative">
                          <div 
                            className="w-full bg-slate-100 rounded-t-xl group-hover:bg-emerald-500 transition-all duration-500 cursor-help" 
                            style={{ height: `${h}%` }}
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                ${h*10}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      <span>Phase Start</span>
                      <span>Current Realtime</span>
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-black uppercase italic flex items-center gap-3">
                        <List size={20} className="text-indigo-600" />
                        Recent Merchant Orders
                      </h3>
                      <button onClick={() => setActiveTab('orders')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-indigo-200 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm font-black text-xs italic">
                              {order.id.slice(-4)}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900">{order.customerName}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(order.timestamp).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-indigo-600">${order.items.filter(i => i.sellerId === user.id).reduce((s, i) => s + (i.price * i.quantity), 0).toLocaleString()}</p>
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                              order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {orders.length === 0 && (
                        <div className="py-10 text-center text-slate-400">
                          <p className="text-sm font-bold uppercase tracking-widest">No orders recorded in current cycle.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="bg-slate-900 p-10 rounded-[48px] text-white space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
                        <Activity size={20} />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Merchant Health</h4>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-black italic tracking-tighter">Verified Alpha</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ecosystem Status: Synchronized</p>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[92%]" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      Your merchant account is performing in the top 8% of the Nexbuy ecosystem.
                    </p>
                  </div>

                  <div className="bg-indigo-600 p-10 rounded-[48px] text-white space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 text-white rounded-2xl flex items-center justify-center">
                        <Target size={20} />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Growth Target</h4>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-black italic tracking-tighter">Next Tier: Elite</p>
                      <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest">Progress: 750 / 1000 XP</p>
                    </div>
                    <div className="h-2 bg-indigo-500 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-[75%]" />
                    </div>
                    <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 transition-all">
                      View Rewards
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-10 animate-slide-up">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <h3 className="text-2xl font-black uppercase italic">Global Asset Catalog</h3>
                <div className="flex gap-4 w-full md:w-auto">
                   <div className="flex-grow bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center px-4">
                      <Search size={16} className="text-slate-400 mr-2" />
                      <input type="text" placeholder="Search Assets..." className="bg-transparent outline-none text-sm py-2 font-medium w-full" />
                   </div>
                   <button onClick={() => setShowAddProduct(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100">
                      <Plus size={20} /> New Asset Ingestion
                   </button>
                </div>
              </div>

              <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        <th className="px-10 py-6">Visual ID</th>
                        <th className="px-10 py-6">Matrix Category</th>
                        <th className="px-10 py-6">Stock Yield</th>
                        <th className="px-10 py-6">Unit Price</th>
                        <th className="px-10 py-6 text-right">Action Protocol</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {products.map(p => (
                        <tr key={p.id} className="group hover:bg-slate-50 transition-all">
                          <td className="px-10 py-8 flex items-center gap-6">
                             <div className="w-16 h-16 rounded-2xl overflow-hidden border bg-slate-100">
                                <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                             </div>
                             <span className="font-black text-slate-900 uppercase italic tracking-tighter text-lg">{p.name}</span>
                          </td>
                          <td className="px-10 py-8">
                             <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest">{p.category}</span>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-2">
                               <span className={`w-2 h-2 rounded-full ${p.stock < 5 ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                               <span className="font-black text-slate-900 tabular-nums">{p.stock} Units</span>
                             </div>
                          </td>
                          <td className="px-10 py-8 font-black text-lg tracking-tighter tabular-nums text-slate-900">${p.price.toLocaleString()}</td>
                          <td className="px-10 py-8 text-right space-x-2">
                            <button onClick={() => setEditingProduct(p)} className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 rounded-xl transition-all shadow-sm">
                               <Edit3 size={18} />
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 rounded-xl transition-all shadow-sm">
                               <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-32 text-center">
                             <Package size={48} className="text-slate-100 mx-auto mb-4" />
                             <p className="text-slate-400 font-bold italic">No assets ingested. Start the protocol with "New Asset".</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden animate-slide-up">
               <div className="p-10 border-b border-slate-100 flex justify-between items-center">
                  <div>
                     <h3 className="text-2xl font-black uppercase italic tracking-tighter">Transaction Matrix</h3>
                     <p className="text-slate-500 text-sm font-medium mt-1">Realtime logs for products belonging to your merchant ID.</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                        <Filter size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase text-slate-600">All Time</span>
                     </div>
                  </div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        <th className="px-10 py-6">Relay ID</th>
                        <th className="px-10 py-6">Logic Status</th>
                        <th className="px-10 py-6">Items Flow</th>
                        <th className="px-10 py-6 text-right">Merchant Yield</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {orders.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-20 text-center text-slate-400 italic">No transaction relay detected in this quadrant.</td>
                        </tr>
                       ) : (
                        orders.map(o => {
                          const merchantItems = o.items.filter(i => i.sellerId === user.id);
                          const merchantTotal = merchantItems.reduce((s, i) => s + (i.price * i.quantity), 0);
                          return (
                            <tr key={o.id} className="hover:bg-slate-50 transition-all">
                               <td className="px-10 py-8">
                                  <p className="text-sm font-black text-slate-900 font-mono tracking-tighter">NEX-{o.id.slice(-8).toUpperCase()}</p>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{new Date(o.timestamp).toLocaleDateString()}</p>
                               </td>
                               <td className="px-10 py-8">
                                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    o.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                                  }`}>{o.status}</span>
                               </td>
                               <td className="px-10 py-8">
                                  <div className="flex -space-x-3">
                                     {merchantItems.map((item, idx) => (
                                        <div key={idx} className="w-10 h-10 rounded-xl border-2 border-white overflow-hidden shadow-sm" title={item.name}>
                                           <img src={item.image} className="w-full h-full object-cover" />
                                        </div>
                                     ))}
                                  </div>
                               </td>
                               <td className="px-10 py-8 text-right font-black text-lg tracking-tighter tabular-nums text-slate-900">
                                  ${merchantTotal.toLocaleString()}
                               </td>
                            </tr>
                          );
                        })
                       )}
                    </tbody>
                 </table>
               </div>
            </div>
          )}
        </>
      )}

      {(showAddProduct || editingProduct) && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => { setShowAddProduct(false); setEditingProduct(null); }} />
          <div className="relative w-full max-w-4xl bg-white rounded-[56px] p-12 overflow-y-auto max-h-[90vh] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10 animate-slide-up">
            <div className="flex justify-between items-center mb-10">
               <div>
                 <h3 className="text-4xl font-black italic uppercase tracking-tighter">{editingProduct ? 'Update Core Asset' : 'New Asset Ingestion'}</h3>
                 <p className="text-slate-500 font-medium">Define parameters for the global catalog</p>
               </div>
               <button onClick={() => { setShowAddProduct(false); setEditingProduct(null); }} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                  <X size={24} />
               </button>
            </div>
            
            <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="col-span-1 md:col-span-2 space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Asset Name</label>
                 <input 
                    type="text" 
                    placeholder="e.g. Chronos Neural Watch" 
                    value={editingProduct ? editingProduct.name : newProduct.name} 
                    onChange={e => editingProduct ? setEditingProduct({...editingProduct, name: e.target.value}) : setNewProduct({...newProduct, name: e.target.value})} 
                    className="w-full bg-slate-50 p-6 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold" 
                    required 
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Market Price ($)</label>
                 <input 
                    type="number" 
                    placeholder="0.00" 
                    value={editingProduct ? editingProduct.price : (newProduct.price || '')} 
                    onChange={e => {
                      const v = parseFloat(e.target.value);
                      editingProduct ? setEditingProduct({...editingProduct, price: v}) : setNewProduct({...newProduct, price: v});
                    }} 
                    className="w-full bg-slate-50 p-6 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-black tabular-nums" 
                    required 
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Production Cost ($)</label>
                 <input 
                    type="number" 
                    placeholder="0.00" 
                    value={editingProduct ? editingProduct.costPrice : (newProduct.costPrice || '')} 
                    onChange={e => {
                      const v = parseFloat(e.target.value);
                      editingProduct ? setEditingProduct({...editingProduct, costPrice: v}) : setNewProduct({...newProduct, costPrice: v});
                    }} 
                    className="w-full bg-slate-50 p-6 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-black tabular-nums" 
                    required 
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Visual Asset URL</label>
                 <input 
                    type="text" 
                    placeholder="https://..." 
                    value={editingProduct ? editingProduct.image : newProduct.image} 
                    onChange={e => editingProduct ? setEditingProduct({...editingProduct, image: e.target.value}) : setNewProduct({...newProduct, image: e.target.value})} 
                    className="w-full bg-slate-50 p-6 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm" 
                    required 
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Initial Stock</label>
                 <input 
                    type="number" 
                    placeholder="10" 
                    value={editingProduct ? editingProduct.stock : newProduct.stock} 
                    onChange={e => {
                      const v = parseInt(e.target.value);
                      editingProduct ? setEditingProduct({...editingProduct, stock: v}) : setNewProduct({...newProduct, stock: v});
                    }} 
                    className="w-full bg-slate-50 p-6 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-black" 
                    required 
                 />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Technical Specification Map</label>
                 <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-6">
                    <div className="flex flex-wrap gap-4">
                       {Object.entries((editingProduct ? editingProduct.specs : newProduct.specs) || {}).map(([k, v]) => (
                         <div key={k} className="bg-white px-5 py-2.5 rounded-xl border border-slate-200 flex items-center gap-3 group">
                            <div className="flex flex-col leading-none">
                               <span className="text-[8px] font-black uppercase text-slate-400 mb-1">{k}</span>
                               <span className="text-xs font-bold text-slate-900">{v}</span>
                            </div>
                            <button type="button" onClick={() => removeSpec(k)} className="text-slate-300 hover:text-red-500 transition-colors">
                               <X size={14} />
                            </button>
                         </div>
                       ))}
                    </div>
                    <div className="flex gap-4">
                       <input type="text" placeholder="Key (e.g. CPU)" value={specKey} onChange={e => setSpecKey(e.target.value)} className="w-1/2 bg-white px-5 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold" />
                       <input type="text" placeholder="Value (e.g. X1 Chip)" value={specValue} onChange={e => setSpecValue(e.target.value)} className="w-1/2 bg-white px-5 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold" />
                       <button type="button" onClick={addSpec} className="px-6 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 transition-all">Add</button>
                    </div>
                 </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Asset Narrative</label>
                 <textarea 
                    placeholder="Describe the engineering and benefit..." 
                    value={editingProduct ? editingProduct.description : newProduct.description} 
                    onChange={e => editingProduct ? setEditingProduct({...editingProduct, description: e.target.value}) : setNewProduct({...newProduct, description: e.target.value})} 
                    className="w-full bg-slate-50 p-6 rounded-2xl outline-none h-40 focus:ring-2 focus:ring-emerald-500 transition-all font-medium leading-relaxed" 
                    required 
                 />
              </div>

              <div className="col-span-1 md:col-span-2 flex items-center gap-6 pt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-grow bg-slate-900 text-white h-20 rounded-[32px] font-black text-xl hover:bg-emerald-600 transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-4"
                >
                  {loading ? <ButtonLoader /> : (
                    <>
                      <Zap size={24} />
                      {editingProduct ? 'Commit Matrix Update' : 'Initialize Asset Ingestion'}
                    </>
                  )}
                </button>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4 hidden md:flex">
                   <ShieldCheck className="text-emerald-500" size={24} />
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                     Every asset ingestion is verified for supply chain integrity.
                   </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerPortal;