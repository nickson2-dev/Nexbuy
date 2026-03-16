import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getAuth, 
  Auth, 
  onAuthStateChanged as firebaseOnAuthStateChanged, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { getDatabase, ref, get, set, push, onValue, Database, query, orderByChild, equalTo, remove } from "firebase/database";
import { Order, AnalyticsData, User, Product, SupportMessage } from "../types";

const firebaseConfig = {
  apiKey: "AIzaSyDxwOasJWzR6uU9aWJ45u6WUgZRAMP3NdA",
  authDomain: "next-tech-2ed10.firebaseapp.com",
  databaseURL: "https://next-tech-2ed10-default-rtdb.firebaseio.com",
  projectId: "next-tech-2ed10",
  storageBucket: "next-tech-2ed10.firebasestorage.app",
  messagingSenderId: "157161682097",
  appId: "1:157161682097:web:ba8093c6b1d7a0e3a89e90",
  measurementId: "G-SK32PG3TYZ"
};

const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Database = getDatabase(app);

// Initialize Analytics conditionally
export const analytics = typeof window !== 'undefined' ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

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

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const firebaseUser = result.user;
  
  const profile = await getUserProfile(firebaseUser.uid);
  if (!profile) {
    const userData: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || 'User',
      points: 100,
      level: 1,
      streak: 1,
      isLoggedIn: true,
      role: firebaseUser.email?.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'customer',
      sellerStatus: 'none'
    };
    await syncUserProfile(firebaseUser.uid, userData);
    return userData;
  }
  return profile;
};

export const signOut = async () => {
  await firebaseSignOut(auth);
  localStorage.removeItem('nexota_session');
};

export const syncUserProfile = async (uid: string, data: Partial<User>) => {
  if (!db || !uid || uid === 'undefined') return;
  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const existing = snapshot.val();
      await set(userRef, { ...existing, ...data, id: uid });
    } else {
      await set(userRef, { ...data, id: uid });
    }
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
  if (!db || !uid || uid === 'undefined') {
    console.error("applyAsSeller: Invalid UID or DB not initialized", { uid, db: !!db });
    return false;
  }
  try {
    console.log(`Applying as seller for UID: ${uid}, Store: ${storeName}`);
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    const existing = snapshot.exists() ? snapshot.val() : {};
    
    await set(userRef, {
      ...existing,
      id: uid,
      sellerStatus: 'pending',
      storeName,
      storeDescription,
      timestamp: Date.now()
    });
    console.log("Seller application submitted successfully");
    return true;
  } catch (e) {
    console.error("applyAsSeller failed:", e);
    return false;
  }
};

export const fetchPendingSellers = async (): Promise<User[]> => {
  if (!db) return [];
  try {
    const usersRef = ref(db, 'users');
    // Try query first
    const q = query(usersRef, orderByChild('sellerStatus'), equalTo('pending'));
    const snapshot = await get(q);
    
    const users: User[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        users.push({ ...child.val(), id: child.key });
      });
    } else {
      // Fallback: fetch all users and filter manually if query returns nothing (might be due to indexing)
      const allUsersSnapshot = await get(usersRef);
      if (allUsersSnapshot.exists()) {
        allUsersSnapshot.forEach((child) => {
          const u = child.val();
          if (u.sellerStatus === 'pending') {
            users.push({ ...u, id: child.key });
          }
        });
      }
    }
    return users;
  } catch (e) {
    console.error("fetchPendingSellers failed:", e);
    // Fallback on error
    try {
      const usersRef = ref(db, 'users');
      const allUsersSnapshot = await get(usersRef);
      const users: User[] = [];
      if (allUsersSnapshot.exists()) {
        allUsersSnapshot.forEach((child) => {
          const u = child.val();
          if (u.sellerStatus === 'pending') {
            users.push({ ...u, id: child.key });
          }
        });
      }
      return users;
    } catch (innerErr) {
      return [];
    }
  }
};

export const updateSellerBadge = async (uid: string, badge: string) => {
  if (!db) return false;
  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const existing = snapshot.val();
      await set(userRef, { ...existing, sellerBadge: badge });
      
      // Update all products for this seller
      const products = await fetchSellerProducts(uid);
      for (const product of products) {
        const productRef = ref(db, `seller_products/${product.id}`);
        await set(productRef, { ...product, sellerBadge: badge });
      }
      return true;
    }
  } catch (e) {
    console.error("updateSellerBadge failed:", e);
  }
  return false;
};

export const approveSeller = async (uid: string) => {
  if (!db) return false;
  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const existing = snapshot.val();
      // Preserve admin role if they already have it, otherwise promote to seller
      const newRole = existing.role === 'admin' ? 'admin' : 'seller';
      await set(userRef, { ...existing, role: newRole, sellerStatus: 'approved' });
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

export const updateMembership = async (uid: string, isLumiAscend: boolean) => {
  if (!db || !uid || uid === 'undefined') return false;
  try {
    const userRef = ref(db, `users/${uid}/isLumiAscend`);
    await set(userRef, isLumiAscend);
    return true;
  } catch (e) {
    console.error("updateMembership failed:", e);
    return false;
  }
};

export const refreshSellerBadge = async (uid: string) => {
  if (!db || !uid || uid === 'undefined') return;
  try {
    const orders = await fetchOrders();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlySales = orders.reduce((total, order) => {
      const orderDate = new Date(order.timestamp);
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        const sellerItems = order.items.filter(item => item.sellerId === uid);
        return total + sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
      return total;
    }, 0);

    let badge = 'Bronze';
    if (monthlySales >= 20000) badge = 'Platinum';
    else if (monthlySales >= 5000) badge = 'Gold';
    else if (monthlySales >= 1000) badge = 'Silver';

    await updateSellerBadge(uid, badge);
    return badge;
  } catch (e) {
    console.error("refreshSellerBadge failed:", e);
  }
};

export const fetchAllProducts = async (): Promise<Product[]> => {
  if (!db) {
    console.error("fetchAllProducts: Database not initialized");
    return [];
  }
  try {
    const productsRef = ref(db, 'seller_products');
    const snapshot = await get(productsRef);
    if (!snapshot.exists()) {
      console.log("fetchAllProducts: No products found in DB");
      return [];
    }
    const data = snapshot.val();
    console.log("fetchAllProducts: Successfully fetched products", Object.keys(data).length);
    return Object.values(data) as Product[];
  } catch (e) {
    console.error("fetchAllProducts failed:", e);
    return [];
  }
};

export const listenToProducts = (callback: (products: Product[]) => void) => {
  if (!db) {
    console.error("Nexus: Database not initialized");
    return () => {};
  }
  try {
    console.log("Nexus: Initializing real-time product stream...");
    
    // Use 'seller_products' as the primary path
    const paths = ['seller_products'];
    const unsubscribes: (() => void)[] = [];

    paths.forEach(path => {
      const productsRef = ref(db, path);
      const unsub = onValue(productsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const productsList = Object.entries(data).map(([id, val]: [string, any]) => ({
            ...val,
            id: val.id || id // Ensure ID is present
          })) as Product[];
          console.log(`Nexus: Received ${productsList.length} products from Firebase path '${path}'`);
          callback(productsList);
        } else {
          console.log(`Nexus: Path '${path}' is empty or not found`);
        }
      }, (error) => {
        console.error(`Nexus: Error listening to path '${path}':`, error);
      });
      unsubscribes.push(unsub);
    });

    return () => unsubscribes.forEach(u => u());
  } catch (e) {
    console.error("Nexus: Product stream setup failed:", e);
    return () => {};
  }
};

export const seedProducts = async (products: Product[]) => {
  if (!db) {
    console.error("seedProducts: Database not initialized");
    return;
  }
  try {
    const productsRef = ref(db, 'seller_products');
    const snapshot = await get(productsRef);
    if (!snapshot.exists()) {
      console.log("seedProducts: DB empty, seeding initial products...");
      for (const product of products) {
        const productRef = ref(db, `seller_products/${product.id}`);
        await set(productRef, product);
      }
      console.log("seedProducts: Products seeded successfully");
    } else {
      console.log("seedProducts: Products already exist in DB, skipping seed");
    }
  } catch (e) {
    console.error("seedProducts failed (likely permission denied for guest):", e.message);
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

// Support Messaging
export const sendSupportMessage = async (messageData: Omit<SupportMessage, 'id' | 'timestamp' | 'status'>) => {
  if (!db) return null;
  try {
    const messagesRef = ref(db, 'support_messages');
    const newMessageRef = push(messagesRef);
    const fullMessage: SupportMessage = {
      ...messageData,
      id: newMessageRef.key || Date.now().toString(),
      timestamp: Date.now(),
      status: 'unread'
    };
    await set(newMessageRef, fullMessage);
    return fullMessage;
  } catch (e) {
    console.error("sendSupportMessage failed:", e);
    return null;
  }
};

export const fetchSupportMessages = async (): Promise<SupportMessage[]> => {
  if (!db) return [];
  try {
    const messagesRef = ref(db, 'support_messages');
    const snapshot = await get(messagesRef);
    if (!snapshot.exists()) return [];
    return Object.values(snapshot.val()) as SupportMessage[];
  } catch (e) {
    console.error("fetchSupportMessages failed:", e);
    return [];
  }
};

export const listenToSupportMessages = (callback: (messages: SupportMessage[]) => void) => {
  if (!db) return () => {};
  const messagesRef = ref(db, 'support_messages');
  return onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      const messages = Object.values(snapshot.val()) as SupportMessage[];
      callback(messages.sort((a, b) => a.timestamp - b.timestamp));
    } else {
      callback([]);
    }
  });
};

export const updateMessageStatus = async (messageId: string, status: SupportMessage['status']) => {
  if (!db) return false;
  try {
    const statusRef = ref(db, `support_messages/${messageId}/status`);
    await set(statusRef, status);
    return true;
  } catch (e) {
    console.error("updateMessageStatus failed:", e);
    return false;
  }
};
