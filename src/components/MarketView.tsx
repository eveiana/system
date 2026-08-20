import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { MarketItem, MarketSale } from '../types';
import Images from '../images';
import { compressImageFile } from '../lib/imageCompressor';
import { 
  Search, Plus, Filter, Grid, List, Eye, Trash2, 
  ShoppingBag, Tag, Sparkles, X, Package, 
  TrendingUp, Coins, Layers, CheckCircle2, AlertTriangle, 
  Calendar, Award, User, Layers3, Upload, Pencil, Image as ImageIcon,
  FileUp
} from 'lucide-react';

interface MarketViewProps {
  items: MarketItem[];
  sales: MarketSale[];
  currentUser: string;
  onAddItem: (item: Omit<MarketItem, 'id' | 'salesCount'>) => void;
  onUpdateItem?: (item: MarketItem) => void;
  onDeleteItem: (id: string) => void;
  onRecordSale: (sale: Omit<MarketSale, 'id'>) => void;
  onUpdateStock: (itemId: string, newStock: number) => void;
}

export function MarketView({
  items,
  sales,
  currentUser,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onRecordSale,
  onUpdateStock
}: MarketViewProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'catalog' | 'sales'>('catalog');
  
  // Filtering & search
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal states - View Item & Sub-Items Details
  const [viewingItem, setViewingItem] = useState<MarketItem | null>(null);

  // Modal states - Add Product
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [prodTitle, setProdTitle] = useState("");
  const [prodCreator, setProdCreator] = useState(currentUser);
  const [prodCategory, setProdCategory] = useState<MarketItem['category']>("Fashion & Wear");
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodStock, setProdStock] = useState<number>(5);
  const [prodDesc, setProdDesc] = useState("");
  const [prodUrl, setProdUrl] = useState("");
  const [prodType, setProdType] = useState<'Physical' | 'Digital'>("Physical");

  // Modal states - Edit Product Item
  const [editingItem, setEditingItem] = useState<MarketItem | null>(null);

  // Modal states - Record Sale
  const [selectedSaleItem, setSelectedSaleItem] = useState<MarketItem | null>(null);
  const [saleBuyer, setSaleBuyer] = useState("");
  const [saleUnits, setSaleUnits] = useState<number>(1);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);

  // Helper: Read selected file as compressed Data URL
  const handleImageFileRead = (file: File, callback: (dataUrl: string) => void) => {
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file (PNG, JPG, WEBP, SVG).");
      return;
    }
    compressImageFile(file, 900, 900, 0.85).then((dataUrl) => {
      if (dataUrl) {
        callback(dataUrl);
      }
    });
  };

  // Calculations for stats
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalUnitsSold = sales.reduce((sum, s) => sum + s.units, 0);
  const totalItemsCount = items.length;
  const lowStockCount = items.filter(i => i.type === 'Physical' && i.stock <= 3 && i.stock > 0).length;
  const outOfStockCount = items.filter(i => i.type === 'Physical' && i.stock === 0).length;

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.creatorName.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const matchesType = typeFilter === "All" || item.type === typeFilter;
    
    let matchesSubCategory = true;
    if (subCategoryFilter !== "All") {
      const sub = subCategoryFilter.toLowerCase();
      matchesSubCategory = item.title.toLowerCase().includes(sub) ||
                           item.description.toLowerCase().includes(sub) ||
                           item.category.toLowerCase().includes(sub);
    }

    return matchesSearch && matchesCategory && matchesType && matchesSubCategory;
  });

  const handleAddProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!prodTitle || prodPrice <= 0 || prodStock < 0) {
      alert("Product title, price, and initial stock are required!");
      return;
    }

    // Default stock photo if url is empty
    let finalUrl = prodUrl.trim();
    if (!finalUrl) {
      const categoryKeywords: Record<string, string> = {
        "Alternative Art": "painting",
        "Fashion & Wear": "apparel",
        "Literature & Books": "book",
        "Audio & Beats": "synthesizer",
        "Eco Crafts": "bamboo",
        "Other": "gift"
      };
      const keyword = categoryKeywords[prodCategory] || "handicraft";
      finalUrl = `https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600`;
    }

    onAddItem({
      title: prodTitle,
      creatorName: prodCreator,
      category: prodCategory,
      price: prodPrice,
      stock: prodType === 'Digital' ? 999 : prodStock,
      description: prodDesc,
      url: finalUrl,
      type: prodType
    });

    // Reset
    setProdTitle("");
    setProdCreator(currentUser);
    setProdCategory("Alternative Art");
    setProdPrice(0);
    setProdStock(5);
    setProdDesc("");
    setProdUrl("");
    setProdType("Physical");
    setIsAddModalOpen(false);
  };

  const handleRecordSaleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSaleItem) return;
    if (!saleBuyer.trim()) {
      alert("Buyer name is required to log a sale.");
      return;
    }
    if (saleUnits <= 0) {
      alert("Units must be at least 1.");
      return;
    }

    if (selectedSaleItem.type === 'Physical' && selectedSaleItem.stock < saleUnits) {
      alert(`Insufficient stock! Only ${selectedSaleItem.stock} items remaining.`);
      return;
    }

    const totalAmount = selectedSaleItem.price * saleUnits;

    onRecordSale({
      itemId: selectedSaleItem.id,
      itemTitle: selectedSaleItem.title,
      buyerName: saleBuyer,
      units: saleUnits,
      totalAmount,
      date: saleDate,
      payoutStatus: "Paid"
    });

    // Deduct stock for physical items
    if (selectedSaleItem.type === 'Physical') {
      onUpdateStock(selectedSaleItem.id, selectedSaleItem.stock - saleUnits);
    }

    // Reset
    setSelectedSaleItem(null);
    setSaleBuyer("");
    setSaleUnits(1);
    setSaleDate(new Date().toISOString().split('T')[0]);
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'Alternative Art': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Fashion & Wear': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Literature & Books': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Audio & Beats': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Eco Crafts': return 'bg-sky-50 text-sky-700 border-sky-100';
      default: return 'bg-zinc-50 text-zinc-600 border-zinc-100';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-900" />
              Baiskeli Store & Market Sales Tracker
            </h2>
            <a 
              href="https://creativesgarage.org/baiskeli-shop" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-2.5 py-0.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-[10px] font-extrabold rounded-full border border-zinc-300 flex items-center gap-1 transition-all"
            >
              <Sparkles className="w-3 h-3 text-zinc-700" />
              <span>baiskeli-shop</span>
            </a>
          </div>
          <p className="text-xs text-zinc-500 mt-1 max-w-3xl">
            Creatives Garage's flagship retail space & e-commerce shop. Swahili for "bicycle", Baiskeli offers a curated journey through East African pop & contemporary culture across published books, zines, comics, official merchandise, apparel, and alternative art prints.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <a
            href="https://creativesgarage.org/baiskeli-shop"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto"
          >
            <Sparkles className="w-4 h-4 text-zinc-300" />
            <span>Visit Baiskeli Shop Online</span>
          </a>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Catalogue Item
          </button>
        </div>
      </div>

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">Total Market Gross</span>
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold tracking-tight text-zinc-800">KSh {totalRevenue.toLocaleString()}</h3>
            <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>Direct supporting creative economies</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">Total Units Sold</span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold tracking-tight text-zinc-800">{totalUnitsSold} Units</h3>
            <p className="text-[10px] text-zinc-400 mt-1 font-semibold">Physical & digital deliveries combined</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">Listed Creator Works</span>
            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold tracking-tight text-zinc-800">{totalItemsCount} Products</h3>
            <p className="text-[10px] text-zinc-400 mt-1 font-semibold">Spanning alternative categories</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">Critical Stock Status</span>
            <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold tracking-tight text-zinc-800">
              {outOfStockCount > 0 ? `${outOfStockCount} Out` : `${lowStockCount} Low`}
            </h3>
            <p className="text-[10px] text-zinc-400 mt-1 font-semibold">
              {outOfStockCount} out of stock, {lowStockCount} items running low
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Layers3 className="w-4 h-4" />
            Active Products Catalogue ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`pb-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sales'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Walk-in & Online Sales Ledger ({sales.length})
          </button>
        </nav>
      </div>

      {/* Catalog Tab */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search catalog by title, creator, or material info..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all text-zinc-800"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600">
                <Filter className="w-3.5 h-3.5 text-zinc-400" />
                <span>Category:</span>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent border-none outline-none font-bold text-zinc-800 cursor-pointer ml-1 text-xs"
                >
                  <option value="All">All Categories</option>
                  <option value="Alternative Art">Alternative Art</option>
                  <option value="Fashion & Wear">Fashion & Wear</option>
                  <option value="Literature & Books">Literature & Books</option>
                  <option value="Audio & Beats">Audio & Beats</option>
                  <option value="Eco Crafts">Eco Crafts</option>
                  <option value="Other">Other Works</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600">
                <span>Format:</span>
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-transparent border-none outline-none font-bold text-zinc-800 cursor-pointer ml-1 text-xs"
                >
                  <option value="All">All Formats</option>
                  <option value="Physical">Physical Delivery</option>
                  <option value="Digital">Digital Download</option>
                </select>
              </div>

              <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50 p-0.5 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-zinc-400 hover:text-zinc-600'}`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-zinc-400 hover:text-zinc-600'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sub-Items Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 whitespace-nowrap shrink-0">Sub-Item Groups:</span>
            {[
              { label: "All Items", value: "All" },
              { label: "🎨 Digital Art Canvas", value: "Canvas" },
              { label: "📓 Notebooks", value: "Notebook" },
              { label: "☕ ChaiTEA Mugs", value: "Mug" },
              { label: "🖼️ 10x10 Canvas Art", value: "10x10" },
              { label: "🛍️ Tote Bags", value: "Tote" },
              { label: "👝 Toiletry Bags", value: "Toiletry" },
              { label: "✏️ Pencil Pouches", value: "Pouch" },
              { label: "🖼️ Posters", value: "Poster" },
              { label: "🧲 Magnets", value: "Magnet" },
              { label: "🛋️ Cushions", value: "Cushion" },
              { label: "☕ Coasters", value: "Coaster" },
              { label: "👕 Pop Tees", value: "Tee" },
              { label: "📚 Books & Anthologies", value: "Book" },
              { label: "🎵 Audio Beats", value: "Beat" }
            ].map((chip) => (
              <button
                key={chip.value}
                onClick={() => setSubCategoryFilter(chip.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                  subCategoryFilter === chip.value
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl border border-zinc-150/80 hover:border-zinc-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group relative"
                >
                  {/* Photo area */}
                  <div className="aspect-[4/3] w-full overflow-hidden relative bg-zinc-50 border-b border-zinc-100 flex items-center justify-center group/photo">
                    {item.url ? (
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/photo:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="p-4 text-center">
                        <ShoppingBag className="w-8 h-8 text-zinc-300 mx-auto mb-1" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">{item.category}</span>
                      </div>
                    )}

                    {/* Quick upload overlay button */}
                    <label 
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover/photo:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer font-bold text-xs backdrop-blur-[2px] z-10"
                      title="Upload new image from device"
                    >
                      <Upload className="w-5 h-5 text-indigo-300" />
                      <span>Change Image</span>
                      <span className="text-[9px] text-zinc-300 font-medium">Click to select file</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && onUpdateItem) {
                            handleImageFileRead(file, (dataUrl) => {
                              onUpdateItem({ ...item, url: dataUrl });
                            });
                          }
                        }}
                      />
                    </label>

                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-zinc-800 text-[9px] font-extrabold px-2 py-0.5 rounded-md border border-zinc-100 shadow-sm flex items-center gap-1 pointer-events-none">
                      <Tag className="w-3 h-3 text-indigo-500" />
                      <span>{item.type}</span>
                    </div>

                    <span className="absolute bottom-3 right-3 bg-zinc-900/90 text-white text-[11px] font-mono font-extrabold px-2 py-0.5 rounded shadow-sm pointer-events-none">
                      KSh {item.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${getCategoryBadgeColor(item.category)}`}>
                          {item.category}
                        </span>
                        
                        <div className="text-[10px] font-bold text-zinc-400">
                          {item.type === 'Digital' ? (
                            <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Unlimited</span>
                          ) : item.stock === 0 ? (
                            <span className="text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 flex items-center gap-0.5">
                              <AlertTriangle className="w-3 h-3" /> Out of stock
                            </span>
                          ) : item.stock <= 3 ? (
                            <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">Only {item.stock} left</span>
                          ) : (
                            <span className="text-zinc-500">{item.stock} in stock</span>
                          )}
                        </div>
                      </div>
                      
                      <h4 className="text-xs font-extrabold text-zinc-800 group-hover:text-indigo-600 transition-colors pt-1 leading-snug line-clamp-2" title={item.title}>
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
                        <User className="w-3 h-3" />
                        By <span className="text-zinc-600 font-semibold">{item.creatorName}</span>
                      </p>
                      <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center gap-2 justify-between">
                      <div className="text-[10px] text-zinc-400 font-extrabold">
                        {item.salesCount} sold
                      </div>

                      <div className="flex gap-1.5 items-center">
                        <button
                          onClick={() => setViewingItem(item)}
                          className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-indigo-100"
                          title="View Details & Sub-Items"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          disabled={item.type === 'Physical' && item.stock === 0}
                          onClick={() => setSelectedSaleItem(item)}
                          className={`px-2.5 py-1.5 text-[10px] font-extrabold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                            item.type === 'Physical' && item.stock === 0
                              ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed'
                              : 'bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-xs'
                          }`}
                        >
                          <ShoppingBag className="w-3 h-3" />
                          Record Sale
                        </button>

                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-indigo-100"
                          title="Edit Details & Upload Image"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove "${item.title}" from the catalog?`)) {
                              onDeleteItem(item.id);
                            }
                          }}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="col-span-full bg-white p-12 text-center border border-zinc-100 rounded-2xl text-zinc-400 font-semibold shadow-sm">
                  No products match the selected filter criteria. Organize your catalogue by adding creative items!
                </div>
              )}
            </div>
          ) : (
            /* Catalog List view */
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Item details</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Format</th>
                      <th className="px-6 py-4">Unit Price</th>
                      <th className="px-6 py-4">Availability</th>
                      <th className="px-6 py-4">Sales Vol</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs font-medium text-zinc-700">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative group/thumb shrink-0">
                              {item.url ? (
                                <img src={item.url} alt={item.title} className="w-10 h-10 rounded-lg object-cover border border-zinc-200 bg-zinc-50" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400">
                                  <ShoppingBag className="w-4 h-4" />
                                </div>
                              )}
                              <label className="absolute inset-0 bg-black/60 rounded-lg text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" title="Upload new photo">
                                <Upload className="w-3.5 h-3.5" />
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file && onUpdateItem) {
                                      handleImageFileRead(file, (dataUrl) => {
                                        onUpdateItem({ ...item, url: dataUrl });
                                      });
                                    }
                                  }}
                                />
                              </label>
                            </div>
                            <div>
                              <p className="font-extrabold text-zinc-800 line-clamp-1">{item.title}</p>
                              <p className="text-[10px] text-zinc-400 font-bold">By {item.creatorName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getCategoryBadgeColor(item.category)}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-zinc-600">
                          {item.type}
                        </td>
                        <td className="px-6 py-4 font-mono font-extrabold text-zinc-800">
                          KSh {item.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {item.type === 'Digital' ? (
                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-[10px] font-bold">Unlimited</span>
                          ) : item.stock === 0 ? (
                            <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 text-[10px] font-bold">Sold Out</span>
                          ) : (
                            <span className="font-semibold text-zinc-700">{item.stock} left</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-zinc-500">
                          {item.salesCount} sold
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingItem(item)}
                              className="p-1.5 hover:bg-indigo-50 text-zinc-400 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                              title="View Details & Sub-Items"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              disabled={item.type === 'Physical' && item.stock === 0}
                              onClick={() => setSelectedSaleItem(item)}
                              className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                                item.type === 'Physical' && item.stock === 0
                                  ? 'bg-zinc-50 border border-zinc-200 text-zinc-400 cursor-not-allowed'
                                  : 'bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
                              }`}
                            >
                              Log Sale
                            </button>
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-1.5 hover:bg-indigo-50 text-zinc-400 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                              title="Edit Details / Upload Photo"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete catalog item "${item.title}"?`)) {
                                  onDeleteItem(item.id);
                                }
                              }}
                              className="p-1.5 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredItems.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-zinc-400 font-semibold">
                          No listed creative products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === 'sales' && (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-zinc-100 bg-zinc-50/30 flex flex-col sm:flex-row justify-between items-center gap-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-indigo-500" />
              Sondeka & Garage Market Sales Ledger
            </h3>
            <div className="text-[11px] font-bold text-zinc-400">
              Total Recorded Revenue: <span className="text-zinc-800 font-extrabold font-mono">KSh {totalRevenue.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Sondeka Catalog Item</th>
                  <th className="px-6 py-4">Buyer/Customer</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Posting Date</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-medium text-zinc-700">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-zinc-400 uppercase">
                      {sale.id}
                    </td>
                    <td className="px-6 py-4 font-bold text-zinc-800">
                      {sale.itemTitle}
                    </td>
                    <td className="px-6 py-4 text-zinc-600 font-semibold">
                      {sale.buyerName}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-zinc-500">
                      {sale.units}x
                    </td>
                    <td className="px-6 py-4 font-mono font-extrabold text-indigo-600">
                      KSh {sale.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-zinc-400 font-semibold">
                      {sale.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                        sale.payoutStatus === 'Paid' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : sale.payoutStatus === 'Processing'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : 'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {sale.payoutStatus}
                      </span>
                    </td>
                  </tr>
                ))}

                {sales.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-400 font-semibold">
                      No sales logs on record. Try selecting "Record Sale" on one of the products cards!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Product Item */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-150 flex justify-between items-center bg-zinc-50/50">
              <div>
                <h3 className="font-extrabold text-sm text-zinc-800">Add Catalogue Product</h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">List a new physical craft or digital audio/literature asset.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-bold text-zinc-700">Product Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Acoustic EP, Upcycled Bamboo Hat"
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-zinc-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700">Category</label>
                  <select 
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as MarketItem['category'])}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg outline-none text-zinc-800 font-bold cursor-pointer"
                  >
                    <option value="Alternative Art">Alternative Art</option>
                    <option value="Fashion & Wear">Fashion & Wear</option>
                    <option value="Literature & Books">Literature & Books</option>
                    <option value="Audio & Beats">Audio & Beats</option>
                    <option value="Eco Crafts">Eco Crafts</option>
                    <option value="Other">Other Alternative Works</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700">Format</label>
                  <select 
                    value={prodType}
                    onChange={(e) => {
                      const selected = e.target.value as 'Physical' | 'Digital';
                      setProdType(selected);
                      if (selected === 'Digital') {
                        setProdStock(999);
                      } else {
                        setProdStock(5);
                      }
                    }}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg outline-none text-zinc-800 font-bold cursor-pointer"
                  >
                    <option value="Physical">Physical Delivery</option>
                    <option value="Digital">Digital Download</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700">Price (KSh)</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    value={prodPrice || ""}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    placeholder="KSh e.g., 2500"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-zinc-800 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700">Creator Name</label>
                  <input 
                    type="text" 
                    required
                    value={prodCreator}
                    onChange={(e) => setProdCreator(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-zinc-800 font-semibold"
                  />
                </div>
              </div>

              {prodType === 'Physical' && (
                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700">Available Stock Quantity</label>
                  <input 
                    type="number" 
                    required
                    min={0}
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-zinc-800 font-medium"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block font-bold text-zinc-700">Product Cover Image</label>
                
                {/* File Upload Drop Area */}
                <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 rounded-xl p-4 text-center transition-all">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-800 text-xs">
                        Upload Image File directly
                      </p>
                      <p className="text-[10px] text-zinc-400">PNG, JPG, WEBP, SVG from your device</p>
                    </div>
                    <label className="px-3 py-1.5 bg-white border border-zinc-200 hover:border-indigo-300 text-zinc-700 font-extrabold text-[11px] rounded-lg cursor-pointer shadow-2xs hover:bg-zinc-50 transition-colors inline-flex items-center gap-1.5 mt-1">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                      Select Local Photo
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageFileRead(file, (dataUrl) => {
                              setProdUrl(dataUrl);
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {prodUrl && (
                  <div className="mt-2 p-2 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-3">
                    <img src={prodUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg border shrink-0 bg-white" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-emerald-600 text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Image Loaded Successfully
                      </p>
                      <p className="text-[10px] text-zinc-400 truncate">{prodUrl.startsWith('data:') ? 'Local Base64 Image File' : prodUrl}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setProdUrl("")}
                      className="p-1 text-zinc-400 hover:text-rose-600 text-[10px] font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="pt-1">
                  <span className="text-[10px] text-zinc-400 font-semibold">Or paste image URL link:</span>
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/..."
                    value={prodUrl.startsWith('data:') ? '' : prodUrl}
                    onChange={(e) => setProdUrl(e.target.value)}
                    className="w-full px-3 py-1.5 mt-1 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-zinc-800 font-medium text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-zinc-700">Description</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Material specs, file download includes, track lengths, or craft details..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-zinc-800 font-medium resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-150">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Product Item & Image */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-150 flex justify-between items-center bg-zinc-50/50 shrink-0">
              <div>
                <h3 className="font-extrabold text-sm text-zinc-800">Edit Product & Image</h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">Update details or upload a new photo directly from your device.</p>
              </div>
              <button 
                onClick={() => setEditingItem(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (onUpdateItem && editingItem) {
                  onUpdateItem(editingItem);
                  setEditingItem(null);
                }
              }} 
              className="p-6 space-y-4 text-xs overflow-y-auto flex-1"
            >
              <div className="space-y-1.5">
                <label className="block font-bold text-zinc-700">Product Title</label>
                <input 
                  type="text" 
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-zinc-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700">Category</label>
                  <select 
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as MarketItem['category'] })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg outline-none text-zinc-800 font-bold cursor-pointer"
                  >
                    <option value="Alternative Art">Alternative Art</option>
                    <option value="Fashion & Wear">Fashion & Wear</option>
                    <option value="Literature & Books">Literature & Books</option>
                    <option value="Audio & Beats">Audio & Beats</option>
                    <option value="Eco Crafts">Eco Crafts</option>
                    <option value="Other">Other Alternative Works</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700">Format</label>
                  <select 
                    value={editingItem.type}
                    onChange={(e) => {
                      const selected = e.target.value as 'Physical' | 'Digital';
                      setEditingItem({
                        ...editingItem,
                        type: selected,
                        stock: selected === 'Digital' ? 999 : editingItem.stock
                      });
                    }}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg outline-none text-zinc-800 font-bold cursor-pointer"
                  >
                    <option value="Physical">Physical Delivery</option>
                    <option value="Digital">Digital Download</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700">Price (KSh)</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-zinc-800 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700">Creator Name</label>
                  <input 
                    type="text" 
                    required
                    value={editingItem.creatorName}
                    onChange={(e) => setEditingItem({ ...editingItem, creatorName: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-zinc-800 font-semibold"
                  />
                </div>
              </div>

              {editingItem.type === 'Physical' && (
                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700">Available Stock Quantity</label>
                  <input 
                    type="number" 
                    required
                    min={0}
                    value={editingItem.stock}
                    onChange={(e) => setEditingItem({ ...editingItem, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-zinc-800 font-medium"
                  />
                </div>
              )}

              {/* Direct File Upload Section */}
              <div className="space-y-2">
                <label className="block font-bold text-zinc-700">Product Image File</label>
                
                <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 rounded-xl p-4 text-center transition-all">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-800 text-xs">
                        Upload new photo straight from device
                      </p>
                      <p className="text-[10px] text-zinc-400">Select image file from your computer or phone</p>
                    </div>
                    <label className="px-3 py-1.5 bg-white border border-zinc-200 hover:border-indigo-300 text-zinc-700 font-extrabold text-[11px] rounded-lg cursor-pointer shadow-2xs hover:bg-zinc-50 transition-colors inline-flex items-center gap-1.5 mt-1">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                      Browse Files
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageFileRead(file, (dataUrl) => {
                              setEditingItem({ ...editingItem, url: dataUrl });
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {editingItem.url && (
                  <div className="mt-2 p-2 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-3">
                    <img src={editingItem.url} alt="Current Preview" className="w-12 h-12 object-cover rounded-lg border shrink-0 bg-white" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-indigo-600 text-[10px]">Active Product Photo</p>
                      <p className="text-[10px] text-zinc-400 truncate">{editingItem.url.startsWith('data:') ? 'Local Base64 Image' : editingItem.url}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-zinc-700">Description</label>
                <textarea 
                  rows={3}
                  required
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-zinc-800 font-medium resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-150">
                <button 
                  type="button" 
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedSaleItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-zinc-150 flex justify-between items-center bg-zinc-50/50">
              <div>
                <h3 className="font-extrabold text-sm text-zinc-800">Log Customer Purchase</h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">Deducts stock automatically and logs gross proceeds.</p>
              </div>
              <button 
                onClick={() => setSelectedSaleItem(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordSaleSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center gap-3">
                {selectedSaleItem.url && (
                  <img src={selectedSaleItem.url} alt={selectedSaleItem.title} className="w-12 h-12 object-cover rounded-lg border shrink-0 bg-white" referrerPolicy="no-referrer" />
                )}
                <div>
                  <h4 className="font-bold text-zinc-800 line-clamp-1">{selectedSaleItem.title}</h4>
                  <p className="text-[10px] text-zinc-400 font-semibold">
                    KSh {selectedSaleItem.price.toLocaleString()} • {selectedSaleItem.type}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-zinc-700">Buyer/Customer Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Evaline Atieno, Walk-in Creative"
                  value={saleBuyer}
                  onChange={(e) => setSaleBuyer(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-zinc-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700">Quantity Sold</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    max={selectedSaleItem.type === 'Physical' ? selectedSaleItem.stock : 999}
                    value={saleUnits}
                    onChange={(e) => setSaleUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-zinc-800 font-medium"
                  />
                  {selectedSaleItem.type === 'Physical' && (
                    <span className="text-[10px] text-zinc-400 block font-semibold mt-0.5">Max: {selectedSaleItem.stock} available</span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700">Transaction Date</label>
                  <input 
                    type="date" 
                    required
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-zinc-800 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-150 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold block">Total Amount Due</span>
                  <span className="text-sm font-extrabold text-indigo-600 font-mono">
                    KSh {(selectedSaleItem.price * saleUnits).toLocaleString()}
                  </span>
                </div>

                <div className="flex gap-2.5">
                  <button 
                    type="button" 
                    onClick={() => setSelectedSaleItem(null)}
                    className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Record Sale
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal: View Item Details & Sub-Items */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-150 flex justify-between items-center bg-zinc-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getCategoryBadgeColor(viewingItem.category)}`}>
                  {viewingItem.category}
                </span>
                <span className="text-xs font-extrabold text-zinc-800">
                  Item Specifications & Sub-Item Details
                </span>
              </div>
              <button 
                onClick={() => setViewingItem(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Top info card */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-1/2 aspect-square rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200 relative shrink-0">
                  {viewingItem.url ? (
                    <img src={viewingItem.url} alt={viewingItem.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                      <ShoppingBag className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/95 text-zinc-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md border shadow-xs">
                    {viewingItem.type} Delivery
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-base font-extrabold text-zinc-900 leading-snug">{viewingItem.title}</h3>
                    <p className="text-xs text-zinc-400 font-bold mt-1">
                      Crafted by <span className="text-indigo-600">{viewingItem.creatorName}</span>
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-zinc-500">Retail Unit Price</span>
                      <span className="font-mono text-indigo-600 font-extrabold">KSh {viewingItem.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-zinc-500">Inventory Status</span>
                      <span className={viewingItem.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {viewingItem.type === 'Digital' ? 'Unlimited Downloads' : `${viewingItem.stock} items remaining`}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-zinc-500">Sales Volume</span>
                      <span className="text-zinc-800 font-mono">{viewingItem.salesCount} units sold</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50/50 p-3 rounded-xl border border-zinc-150">
                    {viewingItem.description}
                  </p>
                </div>
              </div>

              {/* Sub-Items & Specifications Breakdown */}
              <div className="space-y-3 pt-4 border-t border-zinc-150">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Sub-Items, Variants & Specifications
                  </h4>
                  <span className="text-[10px] font-bold text-zinc-400">Baiskeli Store Specs</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-400 block">Available Sizes & Dimensions</span>
                    <p className="font-bold text-zinc-800">
                      {viewingItem.title.includes("10x10") ? "10\" x 10\" (25cm x 25cm)" : 
                       viewingItem.title.includes("Tee") ? "S, M, L, XL, XXL Unisex" :
                       viewingItem.title.includes("Tote") ? "15\" x 16\" with 11\" Drop Handles" :
                       viewingItem.title.includes("Mug") ? "11 oz / 325ml High-Grade Ceramic" :
                       viewingItem.title.includes("Notebook") ? "A5 Standard (148 x 210 mm)" :
                       viewingItem.title.includes("Canvas") ? "16\" x 20\" Stretched Canvas" :
                       "Standard Authentic Size"}
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-400 block">Material & Craftsmanship</span>
                    <p className="font-bold text-zinc-800">
                      {viewingItem.title.includes("Canvas") ? "100% Cotton Canvas & Wooden Frame" :
                       viewingItem.title.includes("Tee") ? "100% Breathable Organic Cotton" :
                       viewingItem.title.includes("Tote") ? "Heavyweight Natural Eco-Canvas" :
                       viewingItem.title.includes("Mug") ? "Microwave & Dishwasher Safe Ceramic" :
                       viewingItem.title.includes("Book") || viewingItem.title.includes("Anthology") ? "Archival Matte Paper & Softcover" :
                       "Hand-crafted East African Media"}
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-400 block">Fulfillment & Delivery</span>
                    <p className="font-bold text-zinc-800">
                      {viewingItem.type === 'Digital' ? "Instant High-Res File Download" : "Same-day Pickup at The Mall, Westlands / Nationwide Delivery"}
                    </p>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-zinc-400 block">Creative Program Attribution</span>
                    <p className="font-bold text-indigo-600">
                      Creatives Garage Market Access • Baiskeli Store
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-150 flex items-center justify-between shrink-0">
              <button
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-600 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Details
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const itemToEdit = viewingItem;
                    setViewingItem(null);
                    setEditingItem(itemToEdit);
                  }}
                  className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Item
                </button>

                <button
                  disabled={viewingItem.type === 'Physical' && viewingItem.stock === 0}
                  onClick={() => {
                    const itemToSell = viewingItem;
                    setViewingItem(null);
                    setSelectedSaleItem(itemToSell);
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewingItem.type === 'Physical' && viewingItem.stock === 0
                      ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Record Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
