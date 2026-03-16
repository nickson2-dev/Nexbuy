
import { Product, Reward } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Nexota Crystal HD Projector',
    price: 189.99,
    costPrice: 110.00,
    stock: 50,
    category: 'Home Cinema',
    image: 'https://images.unsplash.com/photo-1535016120720-40c646bebbfc?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-projection-of-a-galaxy-on-a-wall-4416-large.mp4',
    rating: 4.9,
    description: 'Turn any wall into a 120" 4K theater. Native 1080p, built-in apps, and ultra-portable design.',
    isNew: true,
    colors: ['#FFFFFF', '#000000'],
    xpGain: 150,
    specs: { 'Resolution': '4K Native', 'Brightness': '2500 Lumens', 'Connectivity': 'Wi-Fi 6, HDMI 2.1' }
  },
  {
    id: 'p2',
    name: 'AeroMist Portable Blender',
    price: 44.95,
    costPrice: 25.00,
    stock: 50,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    description: 'Smoothies anywhere, anytime. USB-C rechargeable with six stainless steel blades for ice crushing.',
    colors: ['#FF69B4', '#87CEEB', '#FFFFFF'],
    xpGain: 40,
    specs: { 'Battery': '4000mAh', 'Blades': '6x Stainless Steel', 'Capacity': '500ml' }
  },
  {
    id: 'p3',
    name: 'Lumina RGB Aura Bar',
    price: 34.50,
    costPrice: 20.00,
    stock: 50,
    category: 'Setup',
    image: 'https://images.unsplash.com/photo-1550745679-33d01608216a?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-neon-lines-3211-large.mp4',
    rating: 4.7,
    description: 'Sync your lights to your screen or music. 16 million colors with smart app control.',
    isNew: true,
    xpGain: 30,
    specs: { 'Colors': '16.8 Million', 'App': 'Nexota Home', 'Sync': 'Audio Reactive' }
  },
  {
    id: 'p4',
    name: 'Nexus Key-Go Mechanical',
    price: 89.00,
    costPrice: 50.00,
    stock: 50,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    description: 'Ultra-responsive wireless mechanical keyboard. Hot-swappable switches and PBT keycaps.',
    xpGain: 80,
    specs: { 'Switches': 'Nexota Brown (Tactile)', 'Battery': 'Up to 200hrs', 'Layout': '75% Compact' }
  },
  {
    id: 'p5',
    name: 'ErgoRest Memory Pillow',
    price: 59.99,
    costPrice: 35.00,
    stock: 50,
    category: 'Sleep',
    image: 'https://images.unsplash.com/photo-1632174012028-11993f43372c?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    description: 'The last pillow you will ever buy. Cooling gel technology and orthopedic neck support.',
    xpGain: 60,
    specs: { 'Material': 'AeroGel Memory Foam', 'Cover': 'Bamboo Fiber', 'Firmness': 'Medium-Soft' }
  },
  {
    id: 'p6',
    name: 'Zenith 4K DashCam Pro',
    price: 129.00,
    costPrice: 75.00,
    stock: 50,
    category: 'Auto',
    image: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    description: 'Peace of mind on every drive. Night vision, GPS tracking, and instant mobile backup.',
    xpGain: 120,
    specs: { 'Video': '4K @ 30FPS', 'Sensor': 'Sony STARVIS', 'Storage': 'Up to 256GB' }
  },
  {
    id: 'art1',
    name: 'Neon Cyberpunk Glitch',
    price: 450.00,
    costPrice: 0,
    stock: 1,
    category: 'Digital Art',
    sector: 'art',
    image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    description: 'A high-voltage digital piece exploring the intersection of human consciousness and machine logic. Limited edition 1/1.',
    isNew: true,
    xpGain: 500,
    sellerName: 'GlitchMaster'
  },
  {
    id: 'art2',
    name: 'Brutalist Concrete Dreams',
    price: 299.00,
    costPrice: 0,
    stock: 5,
    category: 'Physical Print',
    sector: 'art',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    description: 'A minimalist exploration of urban decay and architectural strength. Printed on high-grade archival paper.',
    xpGain: 300,
    sellerName: 'UrbanGhost'
  },
  {
    id: 'art3',
    name: 'Urban Masterpiece #42',
    price: 1200.00,
    costPrice: 0,
    stock: 1,
    category: 'Graffiti',
    sector: 'art',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    description: 'Raw street energy captured on canvas. This piece was originally a mural in the undercity of Neo-Tokyo.',
    isNew: true,
    xpGain: 1000,
    sellerName: 'VandalX'
  }
];

export const REWARDS: Reward[] = [
  { id: 'r1', title: '15% Discount Code', cost: 500, type: 'discount', icon: '🎟️' },
  { id: 'r2', title: 'Free Express Shipping Upgrade', cost: 300, type: 'shipping', icon: '✈️' },
  { id: 'r3', title: 'Nexota Brand Sticker Pack', cost: 1000, type: 'merch', icon: '🎁' },
];
