import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  Auth, 
  onAuthStateChanged as firebaseOnAuthStateChanged, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { getDatabase, ref, get, set, push, onValue, Database, query, orderByChild, equalTo, remove } from "firebase/database";
import { Order, AnalyticsData, User, Product } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyDxwOasJWzR6uU9aWJ45u6WUgZRAMP3NdA",
  authDomain: "next-tech-2ed10.firebaseapp.com",
  databaseURL: "https://next-tech-2ed10-default-rtdb.firebaseio.com",
  projectId: "next-tech-2ed10",
  storageBucket: "next-tech-2ed10.firebasestorage.app",
  messagingSenderId: "157161682097",
  appId: "1:157161682097:web:ba8093c6b1d7a0e3a89e90"
};

const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Database = getDatabase(app);

const ADMIN_EMAIL = 'ematannick@gmail.com';

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          callback({ 
            ...profile, 
            email: profile.email || firebaseUser.email || '',
            isLoggedIn: true 
          });
        } else {
          callback({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'User',
            points: 0,
            level: 1,
            streak: 1,
            isLoggedIn: true,
            role: firebaseUser.email?.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'customer'
          });
        }
      } catch (error) {
        console.error("Firebase Auth State Fetch Error:", error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

export const signUp = async (email: string, pass: string, name: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(result.user, { displayName: name });
  const userData: User = {
    id: result.user.uid,
    email: email,
    name: name,
    points: 100,
    level: 1,
    streak: 1,
    isLoggedIn: true,
    role: email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'customer',
    sellerStatus: 'none'
  };
  await syncUserProfile(result.user.uid, userData);
  return userData;
};

export const signIn = async (email: string, pass: string) => {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return await getUserProfile(result.user.uid);
};

export const signOut = async () => {
  await firebaseSignOut(auth);
  localStorage.removeItem('nexbuy_session');
};

export const syncUserProfile = async (uid: string, data: Partial<User>) => {
  if (!db) return;
  try {
    const userRef = ref(db, `users/${uid}`);
    await set(userRef, { ...data, id: uid });
  } catch (e) {
    console.error("syncUserProfile failed:", e);
  }
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
  if (!db) return null;
  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : null;
  } catch (e) {
    console.error("getUserProfile failed:", e);
    return null;
  }
};

export const applyAsSeller = async (uid: string, storeName: string, storeDescription: string) => {
  if (!db) return false;
  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const existing = snapshot.val();
      await set(userRef, {
        ...existing,
        sellerStatus: 'pending',
        storeName,
        storeDescription
      });
      return true;
    }
  } catch (e) {
    console.error("applyAsSeller failed:", e);
  }
  return false;
};

export const fetchPendingSellers = async (): Promise<User[]> => {
  if (!db) return [];
  try {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    if (!snapshot.exists()) return [];
    const users = Object.values(snapshot.val()) as User[];
    return users.filter(u => u.sellerStatus === 'pending');
  } catch (e) {
    console.error("fetchPendingSellers failed:", e);
    return [];
  }
};

export const approveSeller = async (uid: string) => {
  if (!db) return false;
  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const existing = snapshot.val();
      await set(userRef, { ...existing, role: 'seller', sellerStatus: 'approved' });
      return true;
    }
  } catch (e) {
    console.error("approveSeller failed:", e);
  }
  return false;
};

export const rejectSeller = async (uid: string) => {
  if (!db) return false;
  try {
    const userRef = ref(db, `users/${uid}/sellerStatus`);
    await set(userRef, 'rejected');
    return true;
  } catch (e) {
    console.error("rejectSeller failed:", e);
    return false;
  }
};

export const fetchSellerProducts = async (sellerId: string): Promise<Product[]> => {
  if (!db) return [];
  try {
    const productsRef = ref(db, 'seller_products');
    // NOTE: Fetching all products and filtering locally to bypass index requirement
    const snapshot = await get(productsRef);
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    const products = Object.values(data) as Product[];
    return products.filter(p => p.sellerId === sellerId);
  } catch (e) {
    console.error("fetchSellerProducts failed (possibly due to rules or missing data):", e);
    return [];
  }
};

export const createSellerProduct = async (productData: Omit<Product, 'id'>) => {
  if (!db) return null;
  try {
    const productsRef = ref(db, 'seller_products');
    const newProductRef = push(productsRef);
    const fullProduct = { ...productData, id: newProductRef.key };
    await set(newProductRef, fullProduct);
    return fullProduct;
  } catch (e) {
    console.error("createSellerProduct failed:", e);
    return null;
  }
};

export const updateSellerProduct = async (productId: string, data: Partial<Product>) => {
  if (!db) return false;
  try {
    const productRef = ref(db, `seller_products/${productId}`);
    await set(productRef, data);
    return true;
  } catch (e) {
    console.error("updateSellerProduct failed:", e);
    return false;
  }
};

export const deleteSellerProduct = async (productId: string) => {
  if (!db) return false;
  try {
    const productRef = ref(db, `seller_products/${productId}`);
    await remove(productRef);
    return true;
  } catch (e) {
    console.error("deleteSellerProduct failed:", e);
    return false;
  }
};

export const pushNotification = async (name: string, location: string, item: string) => {
  if (!db) return;
  try {
    const notifyRef = ref(db, 'notifications');
    await push(notifyRef, { name, location, item, timestamp: Date.now() });
  } catch (e) {
    console.debug("Notification push failed (silent):", e.message);
  }
};

export const listenToNotifications = (callback: (data: any) => void) => {
  if (!db) return () => {};
  try {
    const notifyRef = ref(db, 'notifications');
    return onValue(notifyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const latest = Object.values(data).sort((a: any, b: any) => b.timestamp - a.timestamp)[0];
        callback(latest);
      }
    }, (error) => {
      console.debug("Notification listener error (silent):", error.message);
    });
  } catch (e) {
    return () => {};
  }
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'timestamp'>) => {
  if (!db) return null;
  try {
    const ordersRef = ref(db, 'orders');
    const newOrderRef = push(ordersRef);
    const fullOrder: Order = {
      ...orderData,
      id: newOrderRef.key || Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    await set(newOrderRef, fullOrder);
    const locations = ['London', 'New York', 'Paris', 'Tokyo', 'Berlin', 'Dubai'];
    await pushNotification(orderData.customerName, locations[Math.floor(Math.random() * locations.length)], orderData.items[0]?.name || 'Tech');
    return fullOrder;
  } catch (e) {
    console.error("createOrder failed:", e);
    return null;
  }
};

export const fetchOrders = async (): Promise<Order[]> => {
  if (!db) return [];
  try {
    const ordersRef = ref(db, 'orders');
    const snapshot = await get(ordersRef);
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
  } catch (e) {
    console.error("fetchOrders failed:", e);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  if (!db) return false;
  try {
    const statusRef = ref(db, `orders/${orderId}/status`);
    await set(statusRef, status);
    return true;
  } catch (e) {
    console.error("updateOrderStatus failed:", e);
    return false;
  }
};

export const calculateAnalytics = async (): Promise<AnalyticsData> => {
  try {
    const orders = await fetchOrders();
    const validOrders = orders.filter(o => o.status !== 'cancelled');
    return {
      totalRevenue: validOrders.reduce((sum, o) => sum + o.total, 0),
      totalProfit: validOrders.reduce((sum, o) => sum + o.profit, 0),
      activeOrders: validOrders.length,
      growthRate: 18.2
    };
  } catch (e) {
    return { totalRevenue: 0, totalProfit: 0, activeOrders: 0, growthRate: 0 };
  }
};

// Shipping Rates Management
export const fetchShippingRates = async (): Promise<Record<string, number>> => {
  if (!db) return {};
  try {
    const ratesRef = ref(db, 'shipping_rates');
    const snapshot = await get(ratesRef);
    return snapshot.exists() ? snapshot.val() : {};
  } catch (e) {
    console.error("fetchShippingRates failed:", e);
    return {};
  }
};

export const updateShippingRate = async (district: string, cost: number) => {
  if (!db) return false;
  try {
    const rateRef = ref(db, `shipping_rates/${district}`);
    await set(rateRef, cost);
    return true;
  } catch (e) {
    console.error("updateShippingRate failed:", e);
    return false;
  }
};

export const deleteShippingRate = async (district: string) => {
  if (!db) return false;
  try {
    const rateRef = ref(db, `shipping_rates/${district}`);
    await remove(rateRef);
    return true;
  } catch (e) {
    console.error("deleteShippingRate failed:", e);
    return false;
  }
};