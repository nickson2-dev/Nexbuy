import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import GamificationWidget from './components/GamificationWidget';
import AIConsultant from './components/AIConsultant';
import CartModal from './components/CartModal';
import LoginModal from './components/LoginModal';
import MembershipModal from './components/MembershipModal';
import Footer from './components/Footer';
import WishlistPage from './components/WishlistPage';
import ProductPage from './components/ProductPage';
import SettingsPage from './components/SettingsPage';
import AccountPage from './components/AccountPage';
import AdminPanel from './components/AdminPanel';
import SellerPortal from './components/SellerPortal';
import ExperienceCenter from './components/ExperienceCenter';
import Sidebar from './components/Sidebar';
import MobileNavbar from './components/MobileNavbar';
import CartToast from './components/CartToast';
import LoadingScreen from './components/LoadingScreen';
import { Product, CartItem, User } from './types';
import { onAuthStateChanged, signOut, listenToNotifications, syncUserProfile, getUserProfile, fetchAllSellerProducts } from './services/firebase';
import { PRODUCTS } from './constants';
import { Zap, Search } from 'lucide-react';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [priceTier, setPriceTier] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'wishlist' | 'product' | 'settings' | 'account' | 'admin' | 'seller' | 'experience'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartPulse, setCartPulse] = useState(false);
  const [addedToCartToast, setAddedToCartToast] = useState({ name: '', show: false });
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User>({
    id: '', email: '', name: 'Guest', points: 0, level: 1, streak: 0, isLoggedIn: false, role: 'customer', isLumiAscend: false
  });

  const categories = useMemo(() => ['All', ...new Set(PRODUCTS.map(p => p.category))], []);
  const isAdmin = useMemo(() => user.isLoggedIn && (user.email?.toLowerCase() === 'ematannick@gmail.com' || user.role === 'admin'), [user]);

  useEffect(() => {
    const loadSellerProducts = async () => {
      const sp = await fetchAllSellerProducts();
      setSellerProducts(sp);
    };
    loadSellerProducts();

    const unsubscribeAuth = onAuthStateChanged((profile) => {
      if (profile) {
        setUser(profile);
      } else {
        setUser({ id: '', email: '', name: 'Guest', points: 0, level: 1, streak: 0, isLoggedIn: false, role: 'customer', isLumiAscend: false });
      }
      setLoading(false);
    });
    const unsubscribeNotify = listenToNotifications(() => {});
    return () => {
      unsubscribeNotify();
      unsubscribeAuth();
    };
  }, []);

  const refreshUserData = async () => {
    if (user.id) {
      const profile = await getUserProfile(user.id);
      if (profile) setUser({ ...profile, isLoggedIn: true });
    }
  };

  const allProducts = useMemo(() => [...PRODUCTS, ...sellerProducts], [sellerProducts]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return allProducts.filter(p => {
      if (p.isExclusive && !user.isLumiAscend && !isAdmin) return false;
      const matchesSearch = !query || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      let matchesPrice = true;
      if (priceTier === 'under50') matchesPrice = p.price < 50;
      else if (priceTier === '50-150') matchesPrice = p.price >= 50 && p.price <= 150;
      else if (priceTier === 'over150') matchesPrice = p.price > 150;
      return matchesSearch && matchesCategory && matchesPrice && p.rating >= minRating;
    });
  }, [searchQuery, activeCategory, priceTier, minRating, user.isLumiAscend, isAdmin]);

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      const savedCart = localStorage.getItem('cart');
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {
      console.warn("Hydration failed", e);
    }
  }, []);

  useEffect(() => { if (!loading) localStorage.setItem('wishlist', JSON.stringify(wishlist)); }, [wishlist, loading]);
  useEffect(() => { if (!loading) localStorage.setItem('cart', JSON.stringify(cart)); }, [cart, loading]);

  const handlePointsUpdate = useCallback(async (points: number) => {
    if (!user.isLoggedIn) return;
    const finalPoints = user.isLumiAscend ? points * 2 : points;
    const newPoints = user.points + finalPoints;
    const newLevel = Math.floor(newPoints / 1000) + 1;
    const updated = { ...user, points: newPoints, level: newLevel };
    setUser(updated);
    try { await syncUserProfile(user.id, updated); } catch (e) { console.error(e); }
  }, [user]);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setAddedToCartToast({ name: product.name, show: true });
    setCartPulse(true);
    setTimeout(() => setAddedToCartToast(p => ({ ...p, show: false })), 3000);
    setTimeout(() => setCartPulse(false), 500);
    handlePointsUpdate(10);
  }, [handlePointsUpdate]);

  const handleNavigation = (view: any) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsSearchOpen(false);
  };

  const openProductPage = (product: Product) => {
    setSelectedProduct(product);
    handleNavigation('product');
  };

  const handleBack = () => {
    handleNavigation('home');
  };

  useEffect(() => {
    const viewTitles: Record<string, string> = {
      home: 'Nexbuy | The Future of Tech Curation',
      wishlist: 'My Wishlist | Nexbuy',
      account: 'My Account | Nexbuy',
      seller: 'Seller Portal | Nexbuy Hub',
      admin: 'Nexus Command | Admin Control',
      experience: 'Nexbuy Labs | Future Tech Experience',
      settings: 'Settings | Nexbuy'
    };
    
    const viewDescriptions: Record<string, string> = {
      home: 'Discover Nexbuy, the premier destination for curated high-tech gadgets and premium gear.',
      wishlist: 'View and manage your saved premium tech gadgets at Nexbuy.',
      account: 'Manage your Nexbuy profile, points, and citizen status.',
      seller: 'Access the Nexbuy Seller Portal to manage your premium tech inventory.',
      admin: 'Nexus Command Center for global ecosystem governance.',
      experience: 'Explore the future of tech in the Nexbuy Labs experience center.',
      settings: 'Configure your Nexbuy interface and account preferences.'
    };
    
    if (currentView !== 'product') {
      document.title = viewTitles[currentView] || 'Nexbuy | Premium Tech';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', viewDescriptions[currentView] || 'Premium tech curation and decentralized retail ecosystem.');
      }
    }
  }, [currentView]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] overflow-x-hidden">
      <div className="flex flex-grow w-full overflow-x-hidden">
        <Sidebar 
          currentView={currentView} 
          onNavigate={handleNavigation} 
          user={user} 
          isAdmin={isAdmin} 
          onLogout={() => { signOut(); handleNavigation('home'); }} 
          onOpenLogin={() => setIsLoginOpen(true)} 
        />
        <div className="flex-grow flex flex-col min-w-0 pt-16 lg:pt-20">
          <Header 
            currentView={currentView}
            cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
            wishlistCount={wishlist.length} 
            onOpenCart={() => setIsCartOpen(true)} 
            onOpenLogin={() => setIsLoginOpen(true)} 
            onOpenWishlist={() => handleNavigation('wishlist')} 
            onOpenAdmin={() => handleNavigation('admin')} 
            onOpenSeller={() => handleNavigation('seller')} 
            onOpenExperience={() => handleNavigation('experience')} 
            onGoHome={() => handleNavigation('home')} 
            onBack={handleBack}
            onOpenAccount={() => handleNavigation('account')} 
            user={user} 
            onLogout={() => { signOut(); handleNavigation('home'); }} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            isCartPulsing={cartPulse} 
          />
          
          <div className="bg-slate-900 text-white py-2 overflow-hidden border-b border-white/5 shrink-0 w-full sticky top-16 lg:top-20 z-[140]">
            <div className="flex animate-marquee gap-16 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
              <span className="flex items-center gap-2"><Zap size={12} className="text-indigo-400" /> Rewards Active</span>
              <span>🔒 Secure Checkout</span>
              <span>🌍 Premium Tech Curation</span>
            </div>
          </div>

          <main className="flex-grow pb-20 md:pb-0 w-full">
            {currentView === 'home' && (
              <>
                <Hero onShopNow={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} onLaunchLabs={() => handleNavigation('experience')} isLumiAscend={user.isLumiAscend} onOpenMembership={() => setIsMembershipOpen(true)} />
                <div id="products" className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">The Collection</h2>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 w-full lg:w-auto">
                      {categories.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'}`}>{cat}</button>
                      ))}
                    </div>
                  </div>
                  <ProductGrid products={filteredProducts} onAddToCart={addToCart} onToggleWishlist={p => setWishlist(prev => prev.some(w => w.id === p.id) ? prev.filter(w => w.id !== p.id) : [...prev, p])} wishlist={wishlist} onQuickView={openProductPage} onProductClick={openProductPage} priceTier={priceTier} setPriceTier={setPriceTier} minRating={minRating} setMinRating={setMinRating} onReset={() => { setSearchQuery(''); setActiveCategory('All'); setPriceTier('all'); setMinRating(0); }} />
                </div>
              </>
            )}
            {currentView === 'product' && selectedProduct && <ProductPage product={selectedProduct} onAddToCart={addToCart} onToggleWishlist={p => setWishlist(prev => prev.some(w => w.id === p.id) ? prev.filter(w => w.id !== p.id) : [...prev, p])} wishlist={wishlist} onBack={handleBack} />}
            {currentView === 'wishlist' && <WishlistPage products={wishlist} onAddToCart={addToCart} onToggleWishlist={p => setWishlist(prev => prev.filter(w => w.id !== p.id))} onGoHome={handleBack} />}
            {currentView === 'settings' && <SettingsPage onBack={handleBack} />}
            {currentView === 'account' && <AccountPage user={user} isAdmin={isAdmin} onNavigate={handleNavigation} onLogout={() => { signOut(); handleNavigation('home'); }} onRefreshUser={refreshUserData} onOpenMembership={() => setIsMembershipOpen(true)} />}
            {currentView === 'admin' && isAdmin && <AdminPanel products={PRODUCTS} onSave={() => {}} onDelete={() => {}} onClose={handleBack} />}
            {currentView === 'seller' && <SellerPortal user={user} onClose={handleBack} onRefreshUser={refreshUserData} />}
            {currentView === 'experience' && <ExperienceCenter products={PRODUCTS.filter(p => !!p.videoUrl)} onAddToCart={addToCart} onClose={handleBack} />}
          </main>
          <Footer />
        </div>
      </div>
      
      <MobileNavbar currentView={currentView} onNavigate={handleNavigation} onOpenCart={() => setIsCartOpen(true)} onOpenSearch={() => { handleNavigation('home'); setIsSearchOpen(true); }} cartCount={cart.reduce((s, i) => s + i.quantity, 0)} user={user} />
      
      {isSearchOpen && (
        <div className="fixed inset-0 z-[250] bg-white animate-fade-in flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex-grow flex items-center bg-slate-100 rounded-2xl px-4 py-3">
                <Search size={20} className="text-slate-400 mr-3" />
                <input 
                  autoFocus 
                  type="text" 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  placeholder="Search Nexbuy..." 
                  className="bg-transparent border-none outline-none w-full text-slate-900 font-bold" 
                />
              </div>
              <button onClick={() => setIsSearchOpen(false)} className="text-xs font-black uppercase tracking-widest text-slate-400">Cancel</button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-6">
            {searchQuery.trim().length < 2 ? (
              <div className="space-y-10">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Zap size={14} className="text-indigo-500" /> Trending Searches
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.filter(c => c !== 'All').map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSearchQuery(cat);
                          setIsSearchOpen(false);
                        }}
                        className="px-5 py-3 bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold transition-all active:scale-95"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Recommended for you</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {PRODUCTS.slice(0, 3).map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedProduct(p);
                          setCurrentView('product');
                          setIsSearchOpen(false);
                        }}
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-[32px] text-left active:scale-[0.98] transition-all"
                      >
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-tight">{p.name}</p>
                          <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mt-1">${p.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {PRODUCTS.filter(p => 
                  p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  p.category.toLowerCase().includes(searchQuery.toLowerCase())
                ).length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {PRODUCTS.filter(p => 
                      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      p.category.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedProduct(p);
                          setCurrentView('product');
                          setIsSearchOpen(false);
                        }}
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-[32px] text-left active:scale-[0.98] transition-all"
                      >
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-tight">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{p.category}</p>
                        </div>
                        <div className="ml-auto text-sm font-black text-indigo-600">${p.price}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-slate-400 font-medium italic">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-slate-100">
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="w-full bg-slate-900 text-white h-14 rounded-2xl font-black uppercase text-[11px] tracking-widest"
            >
              View All Results
            </button>
          </div>
        </div>
      )}

      <CartToast name={addedToCartToast.name} show={addedToCartToast.show} onOpenCart={() => setIsCartOpen(true)} />
      <GamificationWidget user={user} onDailyClaim={() => handlePointsUpdate(100)} />
      <AIConsultant onAddToCart={addToCart} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} total={cart.reduce((s, i) => s + (i.price * i.quantity), 0)} onUpdateQuantity={(id, d) => setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + d) } : item))} onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))} user={user} onClearCart={() => setCart([])} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <MembershipModal isOpen={isMembershipOpen} onClose={() => setIsMembershipOpen(false)} onUpgrade={() => { setUser(prev => ({...prev, isLumiAscend: true})); setIsMembershipOpen(false); }} />
    </div>
  );
};

export default App;