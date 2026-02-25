
import { createClient } from '@supabase/supabase-js';
import { Order, AnalyticsData, User, Product } from '../types';

// Provided credentials
const SUPABASE_URL = "https://awkkeiyxilyspyadlxom.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_k42QK7xAUVPFOvoYaWMtLg_1pdJN-Kj";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_EMAIL = 'ematannick@gmail.com';

// --- Authentication ---
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const profile = await getUserProfile(session.user.id);
      if (profile) {
        callback({ ...profile, isLoggedIn: true });
      } else {
        callback({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || 'User',
          points: 0,
          level: 1,
          streak: 1,
          isLoggedIn: true,
          role: session.user.email?.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'customer'
        });
      }
    } else {
      callback(null);
    }
  });
};

export const signUp = async (email: string, pass: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: { data: { full_name: name } }
  });
  if (error) throw error;
  if (data.user) {
    const userData: User = {
      id: data.user.id,
      email: email,
      name: name,
      points: 100,
      level: 1,
      streak: 1,
      isLoggedIn: true,
      role: email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'customer'
    };
    await syncUserProfile(data.user.id, userData);
    return userData;
  }
  return null;
};

export const signIn = async (email: string, pass: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
  if (error) throw error;
  if (data.user) {
    const profile = await getUserProfile(data.user.id);
    return profile;
  }
  return null;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  localStorage.removeItem('nexbuy_session');
};

// --- User Profile ---
export const syncUserProfile = async (uid: string, data: Partial<User>) => {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: uid, ...data });
  if (error) console.error("Profile sync error:", error);
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uid)
    .single();
  if (error) return null;
  return data;
};

export const applyAsSeller = async (uid: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ role: 'seller' })
    .eq('id', uid);
  return !error;
};

// --- Products (Multi-vendor) ---
export const fetchSellerProducts = async (sellerId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('seller_products')
    .select('*')
    .eq('sellerId', sellerId);
  if (error) return [];
  return data;
};

export const createSellerProduct = async (productData: Omit<Product, 'id'>) => {
  const { data, error } = await supabase
    .from('seller_products')
    .insert([productData])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// --- Real-time Notifications ---
export const pushNotification = async (name: string, location: string, item: string) => {
  const channel = supabase.channel('public:notifications');
  await channel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.send({
        type: 'broadcast',
        event: 'purchase',
        payload: { name, location, item, timestamp: Date.now() },
      });
    }
  });
};

export const listenToNotifications = (callback: (data: any) => void) => {
  const channel = supabase.channel('public:notifications')
    .on('broadcast', { event: 'purchase' }, (payload) => {
      callback(payload.payload);
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
};

// --- Order Management ---
export const createOrder = async (orderData: Omit<Order, 'id' | 'timestamp'>) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ ...orderData, timestamp: new Date().toISOString() }])
    .select()
    .single();

  if (error) {
    console.error("Supabase Order Error:", error);
    return null;
  }

  const locations = ['London', 'New York', 'Paris', 'Tokyo', 'Berlin', 'Dubai'];
  const loc = locations[Math.floor(Math.random() * locations.length)];
  await pushNotification(orderData.customerName, loc, orderData.items[0]?.name || 'Tech');

  return data;
};

export const fetchOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('timestamp', { ascending: false });
  if (error) return [];
  return data;
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);
  return !error;
};

export const calculateAnalytics = async (): Promise<AnalyticsData> => {
  const orders = await fetchOrders();
  const validOrders = orders.filter(o => o.status !== 'cancelled');
  const totalRevenue = validOrders.reduce((sum, order) => sum + order.total, 0);
  const totalProfit = validOrders.reduce((sum, order) => sum + order.profit, 0);
  
  return {
    totalRevenue,
    totalProfit,
    activeOrders: validOrders.length,
    growthRate: 12.5
  };
};
