
import React from 'react';
import { Product } from '../types';
import ProductGrid from './ProductGrid';
import { Heart, ChevronLeft } from 'lucide-react';

interface WishlistPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onGoHome: () => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ 
  products, 
  onAddToCart, 
  onToggleWishlist,
  onGoHome 
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade-in">
      <button 
        onClick={onGoHome}
        className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:translate-x-[-4px] transition-transform"
      >
        <ChevronLeft size={20} />
        Back to Shopping
      </button>

      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-3xl flex items-center justify-center shadow-lg">
          <Heart size={32} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-900">My Wishlist</h1>
          <p className="text-slate-500">Products you've saved for later.</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-slate-100 p-20 text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Explore our collections and tap the heart icon on any product to save it here for later.
          </p>
          <button 
            onClick={onGoHome}
            className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl"
          >
            Start Exploring
          </button>
        </div>
      ) : (
        <ProductGrid 
          products={products} 
          onAddToCart={onAddToCart} 
          onToggleWishlist={onToggleWishlist} 
          wishlist={products}
        />
      )}
    </div>
  );
};

export default WishlistPage;
