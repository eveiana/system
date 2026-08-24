import { useState } from 'react';
import { Programme } from '../types';
import { resolveImageUrl } from '../images';
import { compressImageFile } from '../lib/imageCompressor';
import { 
  Sparkles, 
  Search, 
  Layers, 
  BookOpen, 
  Cpu, 
  HeartHandshake, 
  Palette, 
  Users, 
  ShoppingBag, 
  Smile, 
  Film, 
  GraduationCap, 
  MessageSquare, 
  ArrowRight, 
  Plus, 
  Upload, 
  X, 
  CheckCircle,
  FolderPlus,
  Image as ImageIcon,
  Camera,
  Trash2
} from 'lucide-react';

interface ProgrammesViewProps {
  programmes: Programme[];
  onUpdateProgramme?: (id: string, updates: Partial<Programme>) => void;
  onAddProgramme?: (prog: Omit<Programme, 'id'>) => void;
  onDeleteProgramme?: (id: string) => void;
  onNavigateToProjects?: (categoryFilter?: string) => void;
}

export function ProgrammesView({ 
  programmes, 
  onUpdateProgramme,
  onAddProgramme,
  onDeleteProgramme,
  onNavigateToProjects 
}: ProgrammesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProgramme, setActiveProgramme] = useState<Programme | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Programme Form State
  const [newTitle, setNewTitle] = useState("");
  const [newTagline, setNewTagline] = useState("");
  const [newCategory, setNewCategory] = useState("Multi-Disciplinary Innovation");
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  // Modal State for Uploading Image
  const [uploadingForId, setUploadingForId] = useState<string | null>(null);

  const categories = [
    "All",
    "Multi-Disciplinary Innovation",
    "AI & Innovation",
    "Civic & Activism",
    "Inclusion & Identity",
    "Gender Equity",
    "Commerce & Trade",
    "Youth & Edutainment",
    "Cinema & New Media",
    "Education & Skills",
    "Editorial & Dialogue"
  ];

  const filteredProgrammes = programmes.filter(p => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Multi-Disciplinary Innovation': return Sparkles;
      case 'AI & Innovation': return Cpu;
      case 'Civic & Activism': return Palette;
      case 'Inclusion & Identity': return HeartHandshake;
      case 'Gender Equity': return Users;
      case 'Commerce & Trade': return ShoppingBag;
      case 'Youth & Edutainment': return Smile;
      case 'Cinema & New Media': return Film;
      case 'Education & Skills': return GraduationCap;
      case 'Editorial & Dialogue': return MessageSquare;
      default: return Layers;
    }
  };

  const handleImageFileRead = (file: File, callback: (dataUrl: string) => void) => {
    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file (PNG, JPG, WEBP, SVG).");
      return;
    }
    compressImageFile(file, 1000, 1000, 0.85).then((dataUrl) => {
      if (dataUrl) {
        callback(dataUrl);
      }
    });
  };

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
      {/* Top Hero Banner */}
      <div className="relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-zinc-800/80 overflow-hidden">
        {/* Background Subtle Accents */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.25),transparent_70%)] pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-indigo-300 text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Creatives Garage Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Our Programmes
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base font-medium leading-relaxed max-w-3xl">
            At Creatives Garage, our programmes champion African storytellers, artists, innovators, and disruptors. From AI research and queer activism to gender equality, child edutainment, independent film festivals, and global market access — we provide the platform, safe spaces, and resources for creative liberation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-zinc-400">
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              9 Core Active Programmes
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Impactful African Stories & Labs
            </span>
          </div>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat);
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 text-white shadow-md shadow-zinc-900/20"
                    : "bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border border-zinc-200/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-400" : "text-zinc-400"}`} />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-2">
          {/* Search Field */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search programmes or projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all text-zinc-800"
            />
          </div>

          {onAddProgramme && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Programme</span>
            </button>
          )}
        </div>
      </div>

      {/* Programmes List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredProgrammes.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center border border-zinc-200/80 rounded-2xl text-zinc-400 font-semibold shadow-xs">
            No programmes found matching your search.
          </div>
        ) : (
          filteredProgrammes.map((prog) => {
            const IconComponent = getCategoryIcon(prog.category);

            return (
              <div 
                key={prog.id}
                className="bg-white rounded-3xl border border-zinc-200/80 hover:border-zinc-300 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Header Image & Badge */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
                  {prog.imageUrl ? (
                    <img 
                      src={resolveImageUrl(prog.imageUrl)} 
                      alt={prog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" fill="%2318181B"><rect width="800" height="450" fill="%2327272A"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23A1A1AA" font-family="sans-serif" font-size="20" font-weight="bold">Creatives Garage</text></svg>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-zinc-500">
                      <IconComponent className="w-12 h-12 text-zinc-600 mb-2" />
                      <span className="text-xs font-bold text-zinc-400">{prog.title}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Category Pill Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md border ${prog.badgeColor || 'bg-zinc-900/80 text-white border-zinc-700'}`}>
                      {prog.category}
                    </span>
                  </div>

                  {/* Quick Image Upload Button */}
                  <label 
                    className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-xl text-xs font-bold backdrop-blur-md cursor-pointer transition-all border border-white/20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100"
                    title="Upload artwork for this programme"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-300" />
                    <span>Upload Cover</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && onUpdateProgramme) {
                          handleImageFileRead(file, (dataUrl) => {
                            onUpdateProgramme(prog.id, { imageUrl: dataUrl });
                          });
                        }
                      }}
                    />
                  </label>

                  {/* Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-black tracking-tight leading-snug">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-zinc-200 font-medium line-clamp-1 opacity-90">
                      {prog.tagline}
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                  {/* Description */}
                  <p className="text-zinc-600 text-xs font-medium leading-relaxed">
                    {prog.description}
                  </p>

                  {/* Core Pillars */}
                  {prog.pillars && prog.pillars.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 block">
                        Core Pillars & Focus
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {prog.pillars.map((pillar, idx) => (
                          <div key={idx} className="bg-zinc-50 border border-zinc-200/60 rounded-xl p-2.5 space-y-0.5">
                            <span className="text-xs font-bold text-zinc-900 block truncate">
                              {pillar.title}
                            </span>
                            <span className="text-[11px] text-zinc-500 font-medium leading-snug block line-clamp-2">
                              {pillar.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Featured Projects Showcase */}
                  {prog.keyProjects && prog.keyProjects.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 block">
                          Key Projects & Subprojects
                        </span>
                        <span className="text-[10px] text-zinc-400 font-bold hidden sm:inline">
                          Hover thumbnail or click to upload cover photo
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {prog.keyProjects.slice(0, 4).map((kp, idx) => (
                          <div key={idx} className="bg-white border border-zinc-200/80 hover:border-indigo-200 rounded-xl p-3 flex gap-3 items-center group/kp transition-colors">
                            {/* Subproject Cover Photo with Upload Overlay */}
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-900 border border-zinc-200 group/subphoto flex items-center justify-center">
                              {kp.imageUrl ? (
                                <img 
                                  src={kp.imageUrl} 
                                  alt={kp.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover/subphoto:scale-105"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%2327272A"><rect width="100" height="100" fill="%2327272A"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23A1A1AA" font-family="sans-serif" font-size="10" font-weight="bold">CG</text></svg>';
                                  }}
                                />
                              ) : (
                                <div className="p-1 text-center">
                                  <ImageIcon className="w-5 h-5 text-zinc-500 mx-auto" />
                                  <span className="text-[8px] text-zinc-400 font-bold block">No Photo</span>
                                </div>
                              )}

                              {/* Hover File Upload */}
                              <label 
                                className="absolute inset-0 bg-black/75 text-white opacity-0 group-hover/subphoto:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer font-bold text-[8px] backdrop-blur-[1px] z-10 text-center p-0.5"
                                title={`Upload cover photo for ${kp.title}`}
                              >
                                <Upload className="w-3.5 h-3.5 text-indigo-300 mb-0.5" />
                                <span>Upload</span>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file && onUpdateProgramme) {
                                      handleImageFileRead(file, (dataUrl) => {
                                        const updatedKeyProjects = prog.keyProjects!.map((item, i) => 
                                          i === idx ? { ...item, imageUrl: dataUrl } : item
                                        );
                                        onUpdateProgramme(prog.id, { keyProjects: updatedKeyProjects });
                                      });
                                    }
                                  }}
                                />
                              </label>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="text-xs font-bold text-zinc-900 truncate group-hover/kp:text-indigo-600 transition-colors">
                                  {kp.title}
                                </h4>
                                {kp.tag && (
                                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded">
                                    {kp.tag}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                                {kp.description}
                              </p>

                              {/* Direct text link to change cover photo */}
                              <label className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                                <Camera className="w-3 h-3 text-indigo-500" />
                                <span>{kp.imageUrl ? 'Change Photo' : 'Upload Cover'}</span>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file && onUpdateProgramme) {
                                      handleImageFileRead(file, (dataUrl) => {
                                        const updatedKeyProjects = prog.keyProjects!.map((item, i) => 
                                          i === idx ? { ...item, imageUrl: dataUrl } : item
                                        );
                                        onUpdateProgramme(prog.id, { keyProjects: updatedKeyProjects });
                                      });
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveProgramme(prog)}
                        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <span>Explore Overview</span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-300" />
                      </button>

                      {prog.externalUrl && (
                        <a
                          href={prog.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1"
                          title={`Visit ${prog.title} official page`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
                          <span>Co-Lab Website</span>
                        </a>
                      )}
                    </div>

                    {onNavigateToProjects && (
                      <button
                        onClick={() => {
                          if (prog.title.includes('Co-Lab') || prog.category === 'Co-Lab X' || prog.category === 'Multi-Disciplinary Innovation') {
                            onNavigateToProjects('Co-Lab X');
                          } else if (prog.title.includes('Women')) {
                            onNavigateToProjects('Women Programme');
                          } else {
                            onNavigateToProjects('All');
                          }
                        }}
                        className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <FolderPlus className="w-3.5 h-3.5 text-zinc-700" />
                        <span>View Active Projects</span>
                      </button>
                    )}

                    {onDeleteProgramme && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to permanently delete "${prog.title}"?`)) {
                            onDeleteProgramme(prog.id);
                          }
                        }}
                        className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                        title="Delete Programme"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal for Selected Programme */}
      {activeProgramme && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Modal Header Banner */}
            <div className="relative h-48 bg-zinc-900 overflow-hidden shrink-0">
              {activeProgramme.imageUrl ? (
                <img 
                  src={activeProgramme.imageUrl} 
                  alt={activeProgramme.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-zinc-900 to-indigo-950 flex items-center justify-center text-zinc-500">
                  <Sparkles className="w-12 h-12 text-zinc-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              <button 
                onClick={() => setActiveProgramme(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-indigo-600/90 border border-indigo-400/40">
                  {activeProgramme.category}
                </span>
                <h2 className="text-2xl font-black">{activeProgramme.title}</h2>
                <p className="text-xs text-zinc-300 font-medium">{activeProgramme.tagline}</p>
              </div>
            </div>

            {/* Modal Body Scroll */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              <div>
                <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider mb-2">
                  Programme Overview & Mission
                </h4>
                <p className="text-zinc-600 font-medium leading-relaxed text-sm">
                  {activeProgramme.description}
                </p>
              </div>

              {/* Pillars */}
              {activeProgramme.pillars && (
                <div>
                  <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider mb-3">
                    Strategic Pillars
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeProgramme.pillars.map((pil, idx) => (
                      <div key={idx} className="bg-zinc-50 border border-zinc-200 p-3.5 rounded-2xl space-y-1">
                        <span className="font-bold text-zinc-900 block text-xs">{pil.title}</span>
                        <span className="text-zinc-500 text-xs font-medium leading-relaxed block">{pil.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {activeProgramme.keyProjects && (
                <div>
                  <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider mb-3">
                    Key Initiatives & Subproject Cover Photos
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeProgramme.keyProjects.map((kp, idx) => (
                      <div key={idx} className="border border-zinc-200 p-3.5 rounded-2xl flex items-start gap-3 bg-white hover:border-zinc-300 transition-all">
                        {/* Subproject Cover Photo with Upload Overlay */}
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-zinc-200 group/modalphoto flex items-center justify-center">
                          {kp.imageUrl ? (
                            <img 
                              src={kp.imageUrl} 
                              alt={kp.title} 
                              className="w-full h-full object-cover transition-transform duration-300 group-hover/modalphoto:scale-105"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="p-1 text-center">
                              <ImageIcon className="w-5 h-5 text-zinc-500 mx-auto" />
                              <span className="text-[8px] text-zinc-400 font-bold block">No Cover</span>
                            </div>
                          )}

                          <label 
                            className="absolute inset-0 bg-black/75 text-white opacity-0 group-hover/modalphoto:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer font-bold text-[8px] backdrop-blur-[1px] z-10 text-center p-0.5"
                            title={`Upload cover photo for ${kp.title}`}
                          >
                            <Upload className="w-3.5 h-3.5 text-indigo-300 mb-0.5" />
                            <span>Upload</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && onUpdateProgramme) {
                                  handleImageFileRead(file, (dataUrl) => {
                                    const updatedKeyProjects = activeProgramme.keyProjects!.map((item, i) => 
                                      i === idx ? { ...item, imageUrl: dataUrl } : item
                                    );
                                    setActiveProgramme({ ...activeProgramme, keyProjects: updatedKeyProjects });
                                    onUpdateProgramme(activeProgramme.id, { keyProjects: updatedKeyProjects });
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h5 className="font-bold text-zinc-900 text-xs">{kp.title}</h5>
                            {kp.tag && <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-zinc-100 text-zinc-700 rounded">{kp.tag}</span>}
                          </div>
                          <p className="text-zinc-500 text-[11px] mt-1 leading-snug line-clamp-2">{kp.description}</p>
                          
                          <label className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                            <Camera className="w-3 h-3 text-indigo-500" />
                            <span>{kp.imageUrl ? 'Change Photo' : 'Upload Cover'}</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && onUpdateProgramme) {
                                  handleImageFileRead(file, (dataUrl) => {
                                    const updatedKeyProjects = activeProgramme.keyProjects!.map((item, i) => 
                                      i === idx ? { ...item, imageUrl: dataUrl } : item
                                    );
                                    setActiveProgramme({ ...activeProgramme, keyProjects: updatedKeyProjects });
                                    onUpdateProgramme(activeProgramme.id, { keyProjects: updatedKeyProjects });
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex flex-wrap justify-between items-center gap-3 shrink-0">
              <div className="flex items-center gap-2">
                {onDeleteProgramme && (
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to permanently delete "${activeProgramme.title}"?`)) {
                        onDeleteProgramme(activeProgramme.id);
                        setActiveProgramme(null);
                      }
                    }}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Programme</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeProgramme.externalUrl && (
                  <a
                    href={activeProgramme.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
                    <span>Open Co-Lab Website</span>
                  </a>
                )}
                <button 
                  onClick={() => setActiveProgramme(null)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Programme Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-zinc-900 text-base">Add New Programme</h3>
                <p className="text-zinc-500 text-xs mt-0.5">Create and document a new organizational programme initiative</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTitle.trim() || !newTagline.trim()) {
                  alert('Please enter a title and tagline.');
                  return;
                }
                if (onAddProgramme) {
                  onAddProgramme({
                    title: newTitle.trim(),
                    tagline: newTagline.trim(),
                    category: newCategory,
                    description: newDescription.trim() || newTagline.trim(),
                    imageUrl: newImageUrl || undefined,
                    badgeColor: 'bg-indigo-600/90 text-white border-indigo-400',
                    pillars: [],
                    keyProjects: []
                  });
                }
                setIsAddModalOpen(false);
                setNewTitle("");
                setNewTagline("");
                setNewDescription("");
                setNewImageUrl("");
              }}
              className="p-6 space-y-4 text-xs font-semibold text-zinc-600 max-h-[75vh] overflow-y-auto"
            >
              <div>
                <label className="block text-zinc-500 mb-1">Programme Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. East African XR & Immersive Storytelling Lab"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs outline-none focus:border-indigo-500 focus:bg-white text-zinc-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-500 mb-1">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs outline-none focus:border-indigo-500 focus:bg-white text-zinc-800 cursor-pointer"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-500 mb-1">Short Tagline</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Empowering immersive virtual reality creators"
                    value={newTagline}
                    onChange={(e) => setNewTagline(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs outline-none focus:border-indigo-500 focus:bg-white text-zinc-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Description & Mission</label>
                <textarea 
                  rows={3}
                  placeholder="Provide comprehensive details about this programme's mandate, cohort timeline, and objectives..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs outline-none focus:border-indigo-500 focus:bg-white text-zinc-800"
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Cover Artwork</label>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 border border-zinc-200">
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Upload Image File</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageFileRead(file, (dataUrl) => {
                            setNewImageUrl(dataUrl);
                          });
                        }
                      }}
                    />
                  </label>
                  {newImageUrl && (
                    <div className="flex items-center gap-2">
                      <img src={newImageUrl} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-zinc-200" />
                      <span className="text-[11px] text-emerald-600 font-bold">Image attached</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-600 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  Create Programme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
