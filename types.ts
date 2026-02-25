
export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  category: string;
  image: string;
  rating: number;
  description: string;
  isNew?: boolean;
  colors?: string[];
  stock: number;
  sellerId?: string;
  videoUrl?: string; // For immersive experience
  xpGain?: number; // How much XP user gets for buying
  specs?: Record<string, string>;
  isExclusive?: boolean; // For Lumi Ascend members
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  lat?: number;
  lng?: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  profit: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  timestamp: string;
  supplierRef?: string;
  paymentMethod?: 'stripe' | 'points' | 'cod';
  paymentStatus?: 'paid' | 'unpaid' | 'pending';
  shippingAddress?: ShippingAddress;
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingCost?: number;
}

export interface ShippingRate {
  district: string;
  cost: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  points: number;
  level: number;
  streak: number;
  isLoggedIn: boolean;
  role: 'admin' | 'seller' | 'customer';
  sellerStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  storeName?: string;
  storeDescription?: string;
  isLumiAscend?: boolean; // Paid membership tier
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  type: 'discount' | 'shipping' | 'merch';
  icon: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalProfit: number;
  activeOrders: number;
  growthRate: number;
}
