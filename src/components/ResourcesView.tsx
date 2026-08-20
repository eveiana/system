import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { ResourceFile } from '../types';
import { compressImageFile } from '../lib/imageCompressor';
import { Search, Plus, FileDown, Trash2, Upload, Filter, Sparkles, X, Grid, List, Eye, ExternalLink, Pencil, Calendar, Check, RefreshCw } from 'lucide-react';

interface ResourcesViewProps {
  resources: ResourceFile[];
  currentUser: string;
  onAddResource: (file: Omit<ResourceFile, 'id' | 'uploadDate'>) => void;
  onUpdateResource?: (file: ResourceFile) => void;
  onDeleteResource: (id: string) => void;
  onResetData?: () => void;
}

export function ResourcesView({
  resources,
  currentUser,
  onAddResource,
  onUpdateResource,
  onDeleteResource,
  onResetData
}: ResourcesViewProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [isDragActive, setIsDragActive] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [lightboxItem, setLightboxItem] = useState<ResourceFile | null>(null);
  const [editingItem, setEditingItem] = useState<ResourceFile | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || res.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (id: string, name: string) => {
    setDownloadingId(id);
    // Simulate download progress
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Downloaded successfully: ${name}`);
    }, 1200);
  };

  const processUploadedFiles = (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const name = file.name;
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const sizeStr = parseFloat(sizeMB) > 0.1 ? `${sizeMB} MB` : `${(file.size / 1024).toFixed(0)} KB`;
      const ext = (name.split('.').pop() || 'file').toLowerCase();

      // Guess category
      let category: 'Guides' | 'Templates' | 'Assets' | 'Legal' = 'Assets';
      if (['pdf', 'epub'].includes(ext)) category = 'Guides';
      else if (['zip', 'rar', 'tar'].includes(ext)) category = 'Templates';
      else if (['doc', 'docx', 'xls', 'xlsx', 'txt'].includes(ext)) category = 'Legal';

      if (file.type.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
        compressImageFile(file, 1000, 1000, 0.85).then((url) => {
          onAddResource({
            name,
            category,
            type: ext,
            size: sizeStr,
            uploaderName: currentUser,
            url: url || undefined
          });
        });
      } else {
        onAddResource({
          name,
          category,
          type: ext,
          size: sizeStr,
          uploaderName: currentUser
        });
      }
    }
  };

  // Drag and drop handlers
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

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'Guides': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Templates': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Assets': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Legal': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-zinc-50 text-zinc-600 border-zinc-100';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Ecosystem Drive & Assets</h2>
          <p className="text-xs text-zinc-500 mt-1">Access and upload shared creative assets, poster graphics, project guides, and brand materials.</p>
        </div>
        {onResetData && (
          <button
            onClick={() => {
              if (window.confirm("Restore sample drive files and reset stored local data?")) {
                onResetData();
              }
            }}
            className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
            title="Restore sample drive files"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
            Restore Sample Drive
          </button>
        )}
      </div>

      {/* Drag & Drop Upload Zone */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3.5 select-none ${
          isDragActive 
            ? 'border-indigo-500 bg-indigo-50/40 scale-[1.01]' 
            : 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 hover:border-indigo-300'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple
          onChange={handleFileInputChange}
          className="hidden" 
        />
        <div className={`p-3.5 rounded-full ${isDragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-zinc-400'} shadow-sm transition-colors`}>
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-800">
            {isDragActive ? "Drop files to share instantly!" : "Drag & drop file assets here, or click to browse"}
          </p>
          <p className="text-[11px] text-zinc-400 mt-1.5 font-bold">Supports PNG, JPG, SVG, WebP, PDF, ZIP up to 100MB</p>
        </div>
      </div>

      {/* Control panel */}
      <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search drive assets by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all text-zinc-800"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span>Category:</span>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-zinc-800 cursor-pointer ml-1 text-xs"
            >
              <option value="All">All Categories</option>
              <option value="Guides">Guides</option>
              <option value="Templates">Templates</option>
              <option value="Assets">Assets</option>
              <option value="Legal">Legal</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50 p-0.5 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'text-zinc-400 hover:text-zinc-600'}`}
              title="Grid / Gallery View"
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

      {/* Main drive files area */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Resource File Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">File Size</th>
                  <th className="px-6 py-4">Uploaded By</th>
                  <th className="px-6 py-4">Upload Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-medium text-zinc-700">
                {filteredResources.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-400 font-semibold">
                      No matching shared files found in this category.
                    </td>
                  </tr>
                ) : (
                  filteredResources.map((res) => (
                    <tr key={res.id} className="hover:bg-zinc-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {res.url ? (
                            <div 
                              onClick={() => setLightboxItem(res)}
                              className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 cursor-zoom-in relative group shrink-0 bg-zinc-50"
                            >
                              <img src={res.url} alt={res.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Eye className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-[10px] text-zinc-500 uppercase border border-zinc-200 shrink-0">
                              {res.type}
                            </div>
                          )}
                          <span 
                            onClick={res.url ? () => setLightboxItem(res) : undefined}
                            className={`font-bold text-zinc-800 truncate max-w-[280px] ${res.url ? 'hover:text-indigo-600 hover:underline cursor-zoom-in' : ''}`}
                            title={res.name}
                          >
                            {res.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getCategoryBadgeColor(res.category)}`}>
                          {res.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-zinc-500">
                        {res.size}
                      </td>
                      <td className="px-6 py-4 text-zinc-600 font-semibold">
                        {res.uploaderName}
                      </td>
                      <td className="px-6 py-4 font-mono text-zinc-400">
                        {res.uploadDate}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {res.url && (
                            <button
                              onClick={() => setLightboxItem(res)}
                              className="p-1.5 rounded-lg border border-zinc-100 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 transition-colors cursor-pointer"
                              title="Preview Image"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingItem(res);
                            }}
                            className="p-1.5 rounded-lg border border-zinc-100 bg-zinc-50 hover:bg-white text-zinc-500 hover:text-indigo-600 transition-colors cursor-pointer"
                            title="Edit Resource"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            disabled={downloadingId === res.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(res.id, res.name);
                            }}
                            className={`p-1.5 rounded-lg border text-indigo-600 hover:text-white hover:bg-indigo-600 cursor-pointer transition-colors ${
                              downloadingId === res.id 
                                ? 'bg-zinc-100 border-zinc-200 text-zinc-400' 
                                : 'border-indigo-100 bg-indigo-50/40'
                            }`}
                            title="Download Resource"
                          >
                            {downloadingId === res.id ? (
                              <span className="block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FileDown className="w-4 h-4" />
                            )}
                          </button>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Remove resource file "${res.name}"?`)) {
                                onDeleteResource(res.id);
                              }
                            }}
                            className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-lg transition-colors cursor-pointer"
                            title="Delete File"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Asset Bento Gallery Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredResources.length === 0 ? (
            <div className="col-span-full bg-white p-12 text-center border border-zinc-100 rounded-2xl text-zinc-400 font-semibold shadow-sm">
              No matching resources in this category. Start adding or dragging media to build your hub!
            </div>
          ) : (
            filteredResources.map((res) => (
              <div 
                key={res.id} 
                className="bg-white rounded-2xl border border-zinc-150/80 hover:border-zinc-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group relative"
              >
                {/* Visual Area (Image preview or standard document box) */}
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-zinc-50 border-b border-zinc-100 flex items-center justify-center">
                  {res.url ? (
                    <>
                      <img 
                        src={res.url} 
                        alt={res.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setLightboxItem(res)}
                          className="p-2 bg-white text-zinc-800 rounded-full shadow hover:scale-105 transition-transform"
                          title="Preview Image"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                        <button 
                          onClick={() => handleDownload(res.id, res.name)}
                          className="p-2 bg-white text-indigo-600 rounded-full shadow hover:scale-105 transition-transform"
                          title="Download"
                        >
                          <FileDown className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-400 group-hover:text-zinc-600 transition-colors">
                      <div className="px-3.5 py-2.5 bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-xl font-extrabold uppercase text-xs shadow-xs tracking-wider">
                        {res.type}
                      </div>
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">{res.category}</span>
                    </div>
                  )}

                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-zinc-800 text-[9px] font-extrabold px-2 py-0.5 rounded-md border border-zinc-100 shadow-sm">
                    {res.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                  <div>
                    <h4 
                      onClick={res.url ? () => setLightboxItem(res) : undefined}
                      className={`text-xs font-extrabold text-zinc-800 line-clamp-2 leading-tight ${res.url ? 'cursor-pointer hover:text-indigo-600 hover:underline' : ''}`} 
                      title={res.name}
                    >
                      {res.name}
                    </h4>
                    <p className="text-[10px] text-zinc-400 font-bold mt-1">
                      By <span className="text-zinc-600 font-semibold">{res.uploaderName}</span>
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-100 flex items-center justify-between text-[10px] font-bold text-zinc-400 shrink-0">
                    <span className="font-mono bg-zinc-50 px-1.5 py-0.5 rounded text-zinc-500 border border-zinc-100">{res.size}</span>
                    <span>{res.uploadDate}</span>
                  </div>
                </div>

                {/* Floating controls */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingItem(res);
                    }}
                    className="p-1.5 bg-white/95 backdrop-blur-xs hover:bg-white text-zinc-500 hover:text-indigo-600 rounded-lg transition-colors shadow border border-zinc-200 cursor-pointer"
                    title="Edit asset details"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Remove resource "${res.name}"?`)) {
                        onDeleteResource(res.id);
                      }
                    }}
                    className="p-1.5 bg-white/95 backdrop-blur-xs hover:bg-rose-50 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors shadow border border-zinc-200 cursor-pointer"
                    title="Remove asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Lightbox Modal for Image Assets */}
      {lightboxItem && (
        <div 
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-950 rounded-2xl w-full max-w-4xl shadow-2xl border border-zinc-800 overflow-hidden text-white flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="px-5 py-3 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/50">
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-zinc-100 truncate">{lightboxItem.name}</h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Category: <span className="font-semibold">{lightboxItem.category}</span> • Shared by {lightboxItem.uploaderName}
                </p>
              </div>
              <button 
                onClick={() => setLightboxItem(null)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Stage */}
            <div className="flex-1 bg-zinc-950 flex items-center justify-center overflow-hidden p-6 min-h-[40vh]">
              <img 
                src={lightboxItem.url} 
                alt={lightboxItem.name} 
                className="max-w-full max-h-[55vh] object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-zinc-900 bg-zinc-900/50 text-[11px] font-bold text-zinc-400 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="font-mono bg-zinc-800 px-2.5 py-1 rounded text-zinc-300">{lightboxItem.size}</span>
                <span>Uploaded: {lightboxItem.uploadDate}</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(lightboxItem);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Asset & Details
                </button>
                <button 
                  onClick={() => {
                    handleDownload(lightboxItem.id, lightboxItem.name);
                    setLightboxItem(null);
                  }}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Download
                </button>
                {lightboxItem.url && (
                  <a 
                    href={lightboxItem.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Original
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Resource Modal */}
      {editingItem && (
        <div 
          onClick={() => setEditingItem(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-900">Edit Resource File</h3>
                  <p className="text-xs text-zinc-500">Update file name, upload date, image/url, and category</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingItem(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* File Image Preview & Replace Controls */}
            {editingItem.url && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700 block">Image Preview & File Source</label>
                
                <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 group">
                  <img 
                    src={editingItem.url} 
                    alt={editingItem.name} 
                    className="w-full h-full object-contain bg-zinc-900/5"
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
                    className="px-3 py-2 bg-indigo-50 hover:bg-white text-indigo-700 hover:shadow-xs rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Replace Image File
                  </button>
                  <span className="text-[11px] text-zinc-400 font-medium">or edit URL below</span>
                </div>

                <div>
                  <input 
                    type="text"
                    value={editingItem.url || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-mono text-zinc-800 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Resource Name</label>
              <input 
                type="text"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-bold text-zinc-900 outline-none"
              />
            </div>

            {/* Date & Category Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Date */}
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  Upload Date
                </label>
                <input 
                  type="date"
                  value={editingItem.uploadDate}
                  onChange={(e) => setEditingItem({ ...editingItem, uploadDate: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold text-zinc-800 outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Category</label>
                <select 
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-semibold text-zinc-800 outline-none"
                >
                  <option value="Guides">Guides</option>
                  <option value="Templates">Templates</option>
                  <option value="Assets">Assets</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>
            </div>

            {/* Uploader Name */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Uploader Name</label>
              <input 
                type="text"
                value={editingItem.uploaderName}
                onChange={(e) => setEditingItem({ ...editingItem, uploaderName: e.target.value })}
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
                  if (onUpdateResource && editingItem) {
                    onUpdateResource(editingItem);
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
