import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Star,
  Store,
  Filter,
  CheckCircle,
  Tag,
  ArrowRight,
  Plus,
  Minus
} from 'lucide-react';
import { CampusProduct, CampusMerchant } from '../../types/zeroq';

interface ZeroQMarketplaceProps {
  products: CampusProduct[];
  merchants: CampusMerchant[];
  onAddToCart: (product: CampusProduct, quantity: number) => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const ZeroQMarketplace: React.FC<ZeroQMarketplaceProps> = ({
  products,
  merchants,
  onAddToCart,
  onOpenCart,
  cartCount,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMerchantId, setSelectedMerchantId] = useState('All');
  const [addedItemNotification, setAddedItemNotification] = useState<string | null>(null);

  const categories = [
    'All',
    'Books and Stationery',
    'Electronics',
    'Clothing',
    'Food and Restaurants',
    'Laundry',
    'Campus Services',
    'Groceries',
    'Personal Care',
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesMerchant = selectedMerchantId === 'All' || p.merchantId === selectedMerchantId;
    const matchesSearch =
      searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.merchantName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesMerchant && matchesSearch;
  });

  const handleAdd = (product: CampusProduct) => {
    onAddToCart(product, 1);
    setAddedItemNotification(`Added "${product.name}" to cart`);
    setTimeout(() => setAddedItemNotification(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Cart Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-violet-400 bg-violet-950 px-2.5 py-0.5 rounded uppercase tracking-wider border border-violet-800">
              Campus Commerce
            </span>
            <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
              DEMO MERCHANTS
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            ZeroQ Student Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Order student supplies, meal tickets, and laundry passes. Pay with Demo M-Pesa to generate collection QR vouchers.
          </p>
        </div>

        <button
          onClick={onOpenCart}
          className="px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>View Cart ({cartCount})</span>
        </button>
      </div>

      {addedItemNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{addedItemNotification}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search products by title, description, or merchant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Product Image */}
              <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-bold bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
                  {product.category}
                </span>
                {product.isVoucherEligible && (
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold bg-teal-500 text-slate-950 px-2 py-0.5 rounded-md shadow-2xs">
                    QR Voucher
                  </span>
                )}
              </div>

              {/* Product Content */}
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Store className="w-3.5 h-3.5 text-violet-600" />
                  <span className="truncate">{product.merchantName}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                  {product.name}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-2 pt-1 text-xs">
                  <div className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="ml-1 text-slate-700 font-mono">{product.rating}</span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {product.stockQuantity} in demo stock
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Add to Cart button */}
            <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Price</span>
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  KSh {product.priceKSh.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => handleAdd(product)}
                className="px-3.5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
