import { useState, useRef, DragEvent, ChangeEvent, MouseEvent, FormEvent } from 'react';
import { compressImageFile } from '../lib/imageCompressor';
import { 
  Search, 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  ZoomIn, 
  Upload, 
  X, 
  ExternalLink, 
  Pencil, 
  Calendar, 
  Check, 
  RefreshCw,
  Copy,
  Download,
  Grid,
  List,
  Tag,
  Sparkles,
  Info,
  Filter,
  SlidersHorizontal,
  HardDrive,
  Eye,
  User,
  CheckCircle2,
  Share2
} from 'lucide-react';

export interface MediaViewItem {
  id: string;
  url: string;
  title: string;
  category: string;
  size: string;
  uploadedDate: string;
  uploaderName: string;
  description?: string;
  tags?: string[];
  dimensions?: string;
  downloadCount?: number;
}

interface MediaViewProps {
  media: MediaViewItem[];
  currentUser: string;
  onAddMedia: (item: Omit<MediaViewItem, 'id' | 'uploadedDate'>) => void;
  onUpdateMedia?: (item: MediaViewItem) => void;
  onDeleteMedia: (id: string) => void;
  onResetData?: () => void;
}

export function MediaView({
  media,
  currentUser,
  onAddMedia,
  onUpdateMedia,
  onDeleteMedia,
  onResetData
}: MediaViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'size'>('newest');
  
  const [isDragActive, setIsDragActive] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<MediaViewItem | null>(null);
  const [editingItem, setEditingItem] = useState<MediaViewItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Media Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Events");
  const [newUrl, setNewUrl] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTagsStr, setNewTagsStr] = useState("");
  const [newDimensions, setNewDimensions] = useState("1920 x 1080");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "All",
    "Events",
    "Workspace",
    "Marketing",
    "Projects",
    "Branding",
    "Press Kit"
  ];

  // Extract all unique tags
  const allTags = Array.from(
    new Set(media.flatMap(item => item.tags || []))
  );

  // Filter & Sort Logic
  const filteredMedia = media
    .filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(search.toLowerCase()) || 
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.uploaderName.toLowerCase().includes(search.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));

      const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
      const matchesTag = !selectedTag || (item.tags && item.tags.includes(selectedTag));

      return matchesSearch && matchesCat && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.uploadedDate).getTime() - new Date(b.uploadedDate).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'size') {
        const parseMB = (s: string) => {
          if (s.includes('KB')) return parseFloat(s) / 1024;
          return parseFloat(s) || 0;
        };
        return parseMB(b.size) - parseMB(a.size);
      }
      return 0;
    });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Events':
        return 'bg-amber-500/90 text-white border-amber-400/30';
      case 'Workspace':
        return 'bg-emerald-600/90 text-white border-emerald-400/30';
      case 'Marketing':
        return 'bg-purple-600/90 text-white border-purple-400/30';
      case 'Projects':
        return 'bg-blue-600/90 text-white border-blue-400/30';
      case 'Branding':
        return 'bg-indigo-600/90 text-white border-indigo-400/30';
      case 'Press Kit':
        return 'bg-rose-600/90 text-white border-rose-400/30';
      default:
        return 'bg-zinc-800 text-white border-zinc-700';
    }
  };

  const processUploadedFiles = (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const title = file.name.split('.').slice(0, -1).join('.') || file.name;
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const sizeStr = parseFloat(sizeMB) > 0.1 ? `${sizeMB} MB` : `${(file.size / 1024).toFixed(0)} KB`;

      if (file.type.startsWith('image/')) {
        compressImageFile(file, 1000, 1000, 0.85).then((url) => {
          if (url) {
            onAddMedia({
              title,
              url,
              size: sizeStr,
              category: "Workspace",
              uploaderName: currentUser,
              description: `Uploaded media asset (${file.type})`,
              tags: ["Upload", "Local"],
              dimensions: "Compressed Res",
              downloadCount: 0
            });
          }
        });
      } else {
        const randomSeed = Math.floor(Math.random() * 1000);
        const url = `https://picsum.photos/seed/${randomSeed}/1200/800`;
        onAddMedia({
          title,
          url,
          size: sizeStr,
          category: "Workspace",
          uploaderName: currentUser,
          description: "Media asset attachment",
          tags: ["Document"],
          dimensions: "Doc Preview",
          downloadCount: 0
        });
      }
    }
  };

  const handleCopyUrl = (url: string, id: string, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadAsset = (item: MediaViewItem, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `${item.title.replace(/\s+/g, '_')}_asset`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onUpdateMedia) {
      onUpdateMedia({
        ...item,
        downloadCount: (item.downloadCount || 0) + 1
      });
    }
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFiles(e.target.files);
    }
  };

  const handleCreateNewMediaSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert("Please enter a title for the media asset.");
      return;
    }

    const tagsArray = newTagsStr
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onAddMedia({
      title: newTitle.trim(),
      url: newUrl.trim() || "https://images.unsplash.com/photo-1542744173-8e0ee268cfec?auto=format&fit=crop&q=80&w=1200",
      category: newCategory,
      size: "2.5 MB",
      uploaderName: currentUser,
      description: newDescription.trim() || "Official ecosystem media asset.",
      tags: tagsArray.length > 0 ? tagsArray : [newCategory],
      dimensions: newDimensions || "1920 x 1080",
      downloadCount: 0
    });

    setIsAddModalOpen(false);
    setNewTitle("");
    setNewUrl("");
    setNewDescription("");
    setNewTagsStr("");
  };

  // Stats calculation
  const totalAssets = media.length;
  const totalDownloads = media.reduce((acc, m) => acc + (m.downloadCount || 0), 0);
  const totalCategories = new Set(media.map(m => m.category)).size;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Banner & Header */}
      <div className="relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl border border-zinc-800/80 overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.25),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-indigo-300 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Creatives Garage Asset Repository</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Ecosystem Media & Press Board
            </h1>

            <p className="text-zinc-300 text-xs sm:text-sm font-medium leading-relaxed">
              Centralized hub for high-resolution brand vectors, festival photography, workspace photos, press kits, and project storyboards. Upload, edit, and share assets across the team.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/30 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Media Asset</span>
            </button>

            {onResetData && (
              <button
                onClick={() => {
                  if (window.confirm("Restore sample media assets and reset stored local data?")) {
                    onResetData();
                  }
                }}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Restore default sample assets"
              >
                <RefreshCw className="w-3.5 h-3.5 text-zinc-300" />
                <span>Restore Default Media</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Pill Strip */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10 text-xs font-medium text-zinc-300">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-zinc-400 block">Total Assets</span>
              <span className="text-base font-black text-white">{totalAssets} items</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-zinc-400 block">Categories</span>
              <span className="text-base font-black text-white">{totalCategories} Active</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-zinc-400 block">Asset Downloads</span>
              <span className="text-base font-black text-white">{totalDownloads} Total</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-zinc-400 block">Active Contributor</span>
              <span className="text-base font-black text-white truncate max-w-[120px]">{currentUser}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Quick Zone */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 select-none ${
          isDragActive 
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.005]' 
            : 'border-zinc-200/90 bg-white hover:bg-zinc-50/80 hover:border-indigo-300 shadow-xs'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          className="hidden" 
        />
        <div className="flex items-center gap-4 text-left">
          <div className={`p-3 rounded-2xl ${isDragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-50 text-indigo-600'} shadow-xs`}>
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-900">
              {isDragActive ? "Drop image files to upload directly!" : "Quick File Upload: Drag & drop launch photos or click to browse"}
            </p>
            <p className="text-[11px] text-zinc-500 font-medium mt-0.5">Supports PNG, JPEG, SVG, WebP up to 25MB per file</p>
          </div>
        </div>

        <button 
          type="button" 
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 transition-colors"
        >
          Select Files
        </button>
      </div>

      {/* Control Toolbar: Search, Filters, View Modes */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs space-y-4">
        {/* Top Controls: Search, Sort & View Switches */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search assets by title, category, uploader, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all text-zinc-800"
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Select */}
            <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-700">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-400 hidden sm:inline">Sort:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-zinc-800 outline-none cursor-pointer"
              >
                <option value="newest">Newest Uploads</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title (A-Z)</option>
                <option value="size">File Size</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200/60">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-white text-zinc-900 shadow-xs font-bold' 
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  viewMode === 'list' 
                    ? 'bg-white text-zinc-900 shadow-xs font-bold' 
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-zinc-100">
          <span className="text-[11px] font-extrabold uppercase text-zinc-400 tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category:
          </span>
          {categories.map((cat) => {
            const count = cat === "All" 
              ? media.length 
              : media.filter(m => m.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200/60"
                }`}
              >
                <span>{cat}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? "bg-white/20 text-white" : "bg-zinc-200/70 text-zinc-600"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tag Filter Pills (if tags exist) */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3" /> Tag Filter:
            </span>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Clear ({selectedTag})</span>
                <X className="w-3 h-3" />
              </button>
            )}
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedTag === tag
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Media Grid / List View */}
      {filteredMedia.length === 0 ? (
        <div className="bg-white p-16 text-center border border-zinc-200/80 rounded-3xl text-zinc-400 space-y-3 shadow-xs">
          <ImageIcon className="w-12 h-12 text-zinc-300 mx-auto" />
          <p className="text-sm font-bold text-zinc-700">No media assets found</p>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Try adjusting your search criteria, category tab, or upload a new media asset using the button above.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Bento Grid Display */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all duration-300 overflow-hidden flex flex-col group relative cursor-pointer"
              onClick={() => setLightboxItem(item)}
            >
              {/* Media Aspect Preview Frame */}
              <div className="aspect-[4/3] w-full overflow-hidden relative bg-zinc-900 border-b border-zinc-100">
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Category Badge Pill */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${getCategoryBadgeClass(item.category)}`}>
                    {item.category}
                  </span>
                </div>

                {/* Hover Quick Action Controls Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3.5 z-20">
                  {/* Top Right Action Buttons */}
                  <div className="flex justify-end gap-1.5">
                    <button 
                      onClick={(e) => handleCopyUrl(item.url, item.id, e)}
                      className="p-2 bg-white/90 hover:bg-white text-zinc-700 rounded-xl transition-all shadow-md cursor-pointer"
                      title="Copy Direct URL"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button 
                      onClick={(e) => handleDownloadAsset(item, e)}
                      className="p-2 bg-white/90 hover:bg-white text-zinc-700 rounded-xl transition-all shadow-md cursor-pointer"
                      title="Download Asset File"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-600" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingItem(item);
                      }}
                      className="p-2 bg-white/90 hover:bg-white text-zinc-700 rounded-xl transition-all shadow-md cursor-pointer"
                      title="Edit Asset Details"
                    >
                      <Pencil className="w-3.5 h-3.5 text-zinc-800" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Remove media asset "${item.title}"?`)) {
                          onDeleteMedia(item.id);
                        }
                      }}
                      className="p-2 bg-white/90 hover:bg-rose-50 text-rose-600 rounded-xl transition-all shadow-md cursor-pointer"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Center Zoom Cue */}
                  <div className="self-center p-3 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30 scale-90 group-hover:scale-100 transition-transform">
                    <ZoomIn className="w-5 h-5" />
                  </div>

                  {/* Bottom Dimension Indicator */}
                  <div className="flex justify-between items-center text-[10px] text-zinc-200 font-mono font-bold">
                    <span>{item.dimensions || "1920x1080"}</span>
                    <span>{item.size}</span>
                  </div>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-bold text-zinc-900 text-xs truncate" title={item.title}>
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-snug">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Tags Strip */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[9px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer Metadata */}
                <div className="pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[10px] font-semibold text-zinc-400">
                  <span className="truncate max-w-[120px]" title={item.uploaderName}>
                    By <strong className="text-zinc-700">{item.uploaderName}</strong>
                  </span>
                  <span>{item.uploadedDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List / Table View Display */
        <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-extrabold uppercase text-zinc-400 tracking-wider">
                  <th className="py-3.5 px-4">Preview & Asset Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Size & Specs</th>
                  <th className="py-3.5 px-4">Uploader</th>
                  <th className="py-3.5 px-4">Upload Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-medium text-zinc-700">
                {filteredMedia.map((item) => (
                  <tr 
                    key={item.id}
                    onClick={() => setLightboxItem(item)}
                    className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.url} 
                          alt={item.title} 
                          className="w-12 h-12 rounded-xl object-cover border border-zinc-200 shrink-0 bg-zinc-900"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <h5 className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors truncate">
                            {item.title}
                          </h5>
                          <p className="text-[11px] text-zinc-400 truncate max-w-xs">
                            {item.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getCategoryBadgeClass(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-zinc-600">
                      <div>{item.size}</div>
                      <div className="text-[10px] text-zinc-400">{item.dimensions || "1920 x 1080"}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-zinc-800">
                      {item.uploaderName}
                    </td>
                    <td className="py-3 px-4 text-zinc-500 whitespace-nowrap">
                      {item.uploadedDate}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleCopyUrl(item.url, item.id, e)}
                          className="p-1.5 hover:bg-zinc-100 text-zinc-600 rounded-lg transition-colors cursor-pointer"
                          title="Copy Link"
                        >
                          {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={(e) => handleDownloadAsset(item, e)}
                          className="p-1.5 hover:bg-zinc-100 text-indigo-600 rounded-lg transition-colors cursor-pointer"
                          title="Download Asset"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1.5 hover:bg-zinc-100 text-zinc-600 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete asset "${item.title}"?`)) {
                              onDeleteMedia(item.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lightbox / High-Res Preview Modal */}
      {lightboxItem && (
        <div 
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-950 rounded-3xl w-full max-w-5xl shadow-2xl border border-zinc-800 overflow-hidden text-white flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/80">
              <div className="min-w-0 flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getCategoryBadgeClass(lightboxItem.category)}`}>
                  {lightboxItem.category}
                </span>
                <h3 className="font-extrabold text-base text-zinc-100 truncate">{lightboxItem.title}</h3>
              </div>
              <button 
                onClick={() => setLightboxItem(null)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stage Body */}
            <div className="flex-1 bg-black/60 flex flex-col lg:flex-row overflow-hidden">
              {/* Image Preview Canvas */}
              <div className="flex-1 p-6 flex items-center justify-center min-h-[350px]">
                <img 
                  src={lightboxItem.url} 
                  alt={lightboxItem.title} 
                  className="max-w-full max-h-[55vh] lg:max-h-[65vh] object-contain rounded-2xl shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Sidebar Info Panel */}
              <div className="w-full lg:w-80 bg-zinc-900/90 border-t lg:border-t-0 lg:border-l border-zinc-800 p-6 space-y-5 overflow-y-auto text-xs">
                <div>
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider block mb-1">
                    Asset Details
                  </span>
                  <p className="text-zinc-300 font-medium leading-relaxed">
                    {lightboxItem.description || "Official Creatives Garage ecosystem media file."}
                  </p>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-zinc-800 text-zinc-300">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-bold">Uploaded By:</span>
                    <span className="font-bold text-white">{lightboxItem.uploaderName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-bold">Upload Date:</span>
                    <span className="font-mono">{lightboxItem.uploadedDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-bold">File Size:</span>
                    <span className="font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-200">{lightboxItem.size}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-bold">Dimensions:</span>
                    <span className="font-mono">{lightboxItem.dimensions || "1920 x 1080"}</span>
                  </div>
                </div>

                {lightboxItem.tags && lightboxItem.tags.length > 0 && (
                  <div className="pt-3 border-t border-zinc-800">
                    <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider block mb-2">
                      Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {lightboxItem.tags.map((t, idx) => (
                        <span key={idx} className="bg-zinc-800 text-indigo-300 font-medium px-2.5 py-1 rounded-lg text-[10px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Action Buttons */}
                <div className="pt-4 border-t border-zinc-800 space-y-2">
                  <button
                    onClick={() => handleDownloadAsset(lightboxItem)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download High-Res Asset</span>
                  </button>

                  <button
                    onClick={() => handleCopyUrl(lightboxItem.url, lightboxItem.id)}
                    className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    {copiedId === lightboxItem.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>URL Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Copy Public Image Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-zinc-900 bg-zinc-900/80 flex justify-between items-center text-xs">
              <a 
                href={lightboxItem.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Raw Image in New Tab</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(lightboxItem);
                  }}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl flex items-center gap-1.5 font-bold cursor-pointer transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Edit Details</span>
                </button>
                <button 
                  onClick={() => setLightboxItem(null)}
                  className="px-4 py-1.5 bg-white text-zinc-900 hover:bg-zinc-100 font-extrabold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Media Modal */}
      {isAddModalOpen && (
        <div 
          onClick={() => setIsAddModalOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-900">Upload Media Asset</h3>
                  <p className="text-xs text-zinc-500">Publish high-resolution artwork or press kit files</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewMediaSubmit} className="space-y-4">
              {/* Asset Title */}
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Asset Title *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Sondeka Festival 2026 Poster Artwork"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-bold text-zinc-900 outline-none"
                />
              </div>

              {/* Category & Resolution Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-bold text-zinc-800 outline-none"
                  >
                    <option value="Events">Events</option>
                    <option value="Workspace">Workspace</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Projects">Projects</option>
                    <option value="Branding">Branding</option>
                    <option value="Press Kit">Press Kit</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Resolution / Dimensions</label>
                  <input 
                    type="text"
                    placeholder="e.g. 1920 x 1080"
                    value={newDimensions}
                    onChange={(e) => setNewDimensions(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium text-zinc-800 outline-none"
                  />
                </div>
              </div>

              {/* Image Source File / URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700 block">Image Source File or URL</label>
                
                <div className="flex gap-2 items-center">
                  <input 
                    type="file" 
                    ref={modalFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        compressImageFile(file, 1000, 1000, 0.85).then((dataUrl) => {
                          if (dataUrl) {
                            setNewUrl(dataUrl);
                          }
                        });
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File</span>
                  </button>
                  <span className="text-[11px] text-zinc-400">or enter image link below</span>
                </div>

                <input 
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-mono text-zinc-800 outline-none"
                />

                {newUrl && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-200 mt-2">
                    <img src={newUrl} alt="Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Description</label>
                <textarea 
                  rows={2}
                  placeholder="Add details about this photo, press release, or project visual..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium text-zinc-800 outline-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Tags (Comma-separated)</label>
                <input 
                  type="text"
                  placeholder="e.g. Festival, Westlands, AI, Branding"
                  value={newTagsStr}
                  onChange={(e) => setNewTagsStr(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium text-zinc-800 outline-none"
                />
              </div>

              {/* Submit Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Publish Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Media Modal */}
      {editingItem && (
        <div 
          onClick={() => setEditingItem(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-900">Edit Media Asset</h3>
                  <p className="text-xs text-zinc-500">Update image source, title, category, and metadata</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingItem(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media Image Preview & Replace Controls */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700 block">Image Preview & File Source</label>
              
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 group">
                <img 
                  src={editingItem.url} 
                  alt={editingItem.title} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex gap-2 items-center pt-1">
                <input 
                  type="file" 
                  ref={replaceFileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
                      const sizeStr = parseFloat(sizeMB) > 0.1 ? `${sizeMB} MB` : `${(file.size / 1024).toFixed(0)} KB`;
                      compressImageFile(file, 1000, 1000, 0.85).then((dataUrl) => {
                        if (dataUrl) {
                          setEditingItem(prev => prev ? { ...prev, url: dataUrl, size: sizeStr } : null);
                        }
                      });
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => replaceFileInputRef.current?.click()}
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Choose New Image File
                </button>
                <span className="text-[11px] text-zinc-400 font-medium">or edit URL link</span>
              </div>

              <div>
                <input 
                  type="text"
                  value={editingItem.url}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-mono text-zinc-800 outline-none"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Asset Title</label>
              <input 
                type="text"
                value={editingItem.title}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-bold text-zinc-900 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Description</label>
              <textarea 
                rows={2}
                value={editingItem.description || ""}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium text-zinc-800 outline-none"
              />
            </div>

            {/* Date & Category Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  Uploaded Date
                </label>
                <input 
                  type="date"
                  value={editingItem.uploadedDate}
                  onChange={(e) => setEditingItem({ ...editingItem, uploadedDate: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold text-zinc-800 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Category</label>
                <select 
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold text-zinc-800 outline-none"
                >
                  <option value="Events">Events</option>
                  <option value="Workspace">Workspace</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Projects">Projects</option>
                  <option value="Branding">Branding</option>
                  <option value="Press Kit">Press Kit</option>
                </select>
              </div>
            </div>

            {/* Uploader Name & Dimensions */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Uploader Name</label>
                <input 
                  type="text"
                  value={editingItem.uploaderName}
                  onChange={(e) => setEditingItem({ ...editingItem, uploaderName: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium text-zinc-800 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Dimensions</label>
                <input 
                  type="text"
                  value={editingItem.dimensions || "1920 x 1080"}
                  onChange={(e) => setEditingItem({ ...editingItem, dimensions: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium text-zinc-800 outline-none"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Tags (Comma-separated)</label>
              <input 
                type="text"
                value={editingItem.tags ? editingItem.tags.join(', ') : ''}
                onChange={(e) => {
                  const tagList = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                  setEditingItem({ ...editingItem, tags: tagList });
                }}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium text-zinc-800 outline-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onUpdateMedia && editingItem) {
                    onUpdateMedia(editingItem);
                    if (lightboxItem?.id === editingItem.id) {
                      setLightboxItem(editingItem);
                    }
                  }
                  setEditingItem(null);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
