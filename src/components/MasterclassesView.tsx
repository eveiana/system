import { useState, FormEvent, MouseEvent, useRef } from 'react';
import { resolveImageUrl } from '../images';
import { compressImageFile } from '../lib/imageCompressor';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  X, 
  Filter, 
  Users, 
  Award, 
  DollarSign, 
  Layers, 
  Grid, 
  List, 
  ChevronRight, 
  Send, 
  Share2, 
  Tag, 
  HelpCircle,
  Pencil,
  Trash2,
  Ticket,
  Check,
  RefreshCw,
  Upload
} from 'lucide-react';
import { Masterclass } from '../types';

interface MasterclassesViewProps {
  masterclasses: Masterclass[];
  currentUser: string;
  onEnroll: (masterclassId: string) => void;
  onAddMasterclass: (masterclass: Omit<Masterclass, 'id' | 'enrolledCount'>) => void;
  onUpdateMasterclass?: (masterclass: Masterclass) => void;
  onDeleteMasterclass?: (id: string) => void;
  onResetData?: () => void;
}

export function MasterclassesView({
  masterclasses,
  currentUser,
  onEnroll,
  onAddMasterclass,
  onUpdateMasterclass,
  onDeleteMasterclass,
  onResetData
}: MasterclassesViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals & Lightbox states
  const [selectedMasterclass, setSelectedMasterclass] = useState<Masterclass | null>(null);
  const [enrollModalItem, setEnrollModalItem] = useState<Masterclass | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [enrolledSuccessId, setEnrolledSuccessId] = useState<string | null>(null);

  // Enrollment Form State
  const [attendeeName, setAttendeeName] = useState(currentUser);
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [attendanceMode, setAttendanceMode] = useState<'in_person' | 'virtual'>('in_person');
  const [phone, setPhone] = useState("");

  // Propose Masterclass Form State
  const [propTitle, setPropTitle] = useState("");
  const [propCategory, setPropCategory] = useState("AI & Innovation");
  const [propTagline, setPropTagline] = useState("");
  const [propDescription, setPropDescription] = useState("");
  const [propFacilitatorName, setPropFacilitatorName] = useState(currentUser);
  const [propFacilitatorBio, setPropFacilitatorBio] = useState("");
  const [propDate, setPropDate] = useState("");
  const [propTime, setPropTime] = useState("10:00 AM - 1:00 PM EAT");
  const [propLocation, setPropLocation] = useState("Creatives Garage Hub, The Mall Westlands");
  const [propPrice, setPropPrice] = useState("KES 1,500");
  const [propIsPaid, setPropIsPaid] = useState(true);
  const [propCapacity, setPropCapacity] = useState(30);
  const [propLevel, setPropLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'>("All Levels");
  const [propOutcomes, setPropOutcomes] = useState("");
  const [propImageUrl, setPropImageUrl] = useState("");
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "All",
    "AI & Innovation",
    "Digital Arts & Media",
    "Legal & Business",
    "Film & Cinema",
    "Audio & Music",
    "Music & Business",
    "Heritage & Music",
    "Performance",
    "Visual Arts"
  ];

  const levels = ["All", "All Levels", "Beginner", "Intermediate", "Advanced"];
  const statuses = ["All", "Enrolling", "Upcoming", "On-Demand", "Completed"];

  // Filtering
  const filteredMasterclasses = masterclasses.filter(mc => {
    const matchesSearch = 
      mc.title.toLowerCase().includes(search.toLowerCase()) ||
      mc.tagline.toLowerCase().includes(search.toLowerCase()) ||
      mc.description.toLowerCase().includes(search.toLowerCase()) ||
      mc.facilitatorName.toLowerCase().includes(search.toLowerCase()) ||
      mc.category.toLowerCase().includes(search.toLowerCase());

    const matchesCat = selectedCategory === "All" || mc.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || mc.level === selectedLevel;
    const matchesStatus = selectedStatus === "All" || mc.status === selectedStatus;

    return matchesSearch && matchesCat && matchesLevel && matchesStatus;
  });

  const handleEnrollSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!enrollModalItem) return;

    onEnroll(enrollModalItem.id);
    setEnrolledSuccessId(enrollModalItem.id);
    
    setTimeout(() => {
      setEnrolledSuccessId(null);
      setEnrollModalItem(null);
    }, 2500);
  };

  const handleProposalSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!propTitle.trim()) {
      alert("Please enter a masterclass title.");
      return;
    }

    const outcomesArray = propOutcomes
      .split('\n')
      .map(o => o.trim())
      .filter(Boolean);

    onAddMasterclass({
      title: propTitle.trim(),
      category: propCategory,
      tagline: propTagline.trim() || "Professional creative masterclass by industry practitioners.",
      description: propDescription.trim() || "An intensive, practical workshop designed to build real-world skills.",
      facilitatorName: propFacilitatorName.trim() || currentUser,
      facilitatorBio: propFacilitatorBio.trim() || "Experienced creative practitioner and instructor.",
      facilitatorAvatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300`,
      date: propDate || "2026-08-15",
      time: propTime || "10:00 AM - 1:00 PM EAT",
      duration: "3 Hours",
      location: propLocation || "Creatives Garage Hub, The Mall Westlands",
      price: propIsPaid ? (propPrice || "KES 1,500") : "Free",
      isPaid: propIsPaid,
      capacity: Number(propCapacity) || 30,
      level: propLevel,
      imageUrl: propImageUrl || "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200",
      learningOutcomes: outcomesArray.length > 0 ? outcomesArray : [
        "Hands-on practical experience with industry tools",
        "Direct feedback from experienced African creative mentors",
        "Networking with fellow creative entrepreneurs in Westlands"
      ],
      prerequisites: "Open to all passionate creators.",
      status: "Enrolling",
      externalUrl: "https://creativesgarage.org/masterclasses"
    });

    setIsProposalModalOpen(false);
    // Reset form
    setPropTitle("");
    setPropTagline("");
    setPropDescription("");
    setPropFacilitatorBio("");
    setPropOutcomes("");
    alert("Masterclass proposal published successfully!");
  };

  // Stats calculation
  const totalMasterclasses = masterclasses.length;
  const totalEnrolled = masterclasses.reduce((acc, m) => acc + (m.enrolledCount || 0), 0);
  const totalFree = masterclasses.filter(m => !m.isPaid).length;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl border border-zinc-800 overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.3),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold backdrop-blur-md">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Official Creatives Garage Hub</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              Masterclasses & Workshops
            </h1>

            <p className="text-zinc-300 text-xs sm:text-sm font-medium leading-relaxed">
              Hands-on masterclasses in AI, podcasting, digital storytelling, film directing, intellectual property, traditional percussion, voice acting, and music business led by top African creative practitioners.
            </p>

            {/* Official Website Banner Link */}
            <div className="pt-1 flex items-center gap-2">
              <span className="text-[11px] font-bold text-zinc-400">Official Directory:</span>
              <a 
                href="https://creativesgarage.org/masterclasses" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-300 hover:text-indigo-200 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-xl border border-white/15 transition-all"
              >
                <span>creativesgarage.org/masterclasses</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsProposalModalOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-900/40 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Propose & Lead a Masterclass</span>
            </button>

            {onResetData && (
              <button
                onClick={() => {
                  if (confirm("Reset masterclasses to official defaults?")) {
                    onResetData();
                  }
                }}
                className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Restore default masterclasses"
              >
                <RefreshCw className="w-3.5 h-3.5 text-zinc-300" />
                <span>Reset Defaults</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Pill Strip */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10 text-xs font-medium text-zinc-300">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-zinc-400 block">Total Workshops</span>
              <span className="text-base font-black text-white">{totalMasterclasses} Masterclasses</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-zinc-400 block">Total Enrolled</span>
              <span className="text-base font-black text-white">{totalEnrolled} Students</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-zinc-400 block">Free Workshops</span>
              <span className="text-base font-black text-white">{totalFree} Open Sessions</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-zinc-400 block">Hub Location</span>
              <span className="text-base font-black text-white truncate max-w-[130px]">The Mall Westlands</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Toolbar: Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search masterclasses by title, AI, podcasting, facilitator, or skills..."
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

          <div className="flex flex-wrap items-center gap-2">
            {/* Level Select */}
            <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-700">
              <Award className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-400 hidden sm:inline">Level:</span>
              <select 
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-transparent font-bold text-zinc-800 outline-none cursor-pointer"
              >
                {levels.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Status Select */}
            <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs font-medium text-zinc-700">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-400 hidden sm:inline">Status:</span>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent font-bold text-zinc-800 outline-none cursor-pointer"
              >
                {statuses.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
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

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-zinc-100">
          <span className="text-[11px] font-extrabold uppercase text-zinc-400 tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Discipline:
          </span>
          {categories.map((cat) => {
            const count = cat === "All" 
              ? masterclasses.length 
              : masterclasses.filter(m => m.category === cat).length;
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
      </div>

      {/* Grid or List Display */}
      {filteredMasterclasses.length === 0 ? (
        <div className="bg-white p-16 text-center border border-zinc-200/80 rounded-3xl text-zinc-400 space-y-3 shadow-xs">
          <GraduationCap className="w-12 h-12 text-zinc-300 mx-auto" />
          <p className="text-sm font-bold text-zinc-700">No masterclasses found</p>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Try adjusting your search query, discipline tab, or level filter. You can also propose a new masterclass topic!
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMasterclasses.map((item) => {
            const seatsRemaining = item.capacity - item.enrolledCount;
            const isFull = seatsRemaining <= 0;

            return (
              <div 
                key={item.id}
                className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer relative"
                onClick={() => setSelectedMasterclass(item)}
              >
                {/* Image Cover Banner */}
                <div className="aspect-[16/9] w-full overflow-hidden relative bg-zinc-900 border-b border-zinc-100">
                  <img 
                    src={resolveImageUrl(item.imageUrl)} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" fill="%2318181B"><rect width="800" height="450" fill="%2327272A"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23A1A1AA" font-family="sans-serif" font-size="20" font-weight="bold">Creatives Garage</text></svg>';
                    }}
                  />
                  
                  <div className="absolute top-3 left-3 z-10 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-zinc-900/90 text-white border border-white/20 backdrop-blur-md">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider ${
                      item.isPaid ? 'bg-indigo-600 text-white shadow-md' : 'bg-emerald-600 text-white shadow-md'
                    }`}>
                      {item.price}
                    </span>
                  </div>

                  {/* Level Pill Bottom */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-black/60 text-zinc-200 border border-white/10 backdrop-blur-md">
                      {item.level}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Facilitator Row */}
                    <div className="flex items-center gap-2.5 text-xs text-zinc-600">
                      <img 
                        src={item.facilitatorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"} 
                        alt={item.facilitatorName}
                        className="w-6 h-6 rounded-full object-cover border border-zinc-200"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-bold text-zinc-800 text-[11px]">
                        Led by {item.facilitatorName}
                      </span>
                    </div>

                    <h3 className="font-black text-zinc-900 text-base leading-tight group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-zinc-500 font-medium line-clamp-2 leading-relaxed">
                      {item.tagline}
                    </p>
                  </div>

                  {/* Key Outcomes Teaser */}
                  {item.learningOutcomes && item.learningOutcomes.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                      <span className="text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider block">
                        What You'll Learn:
                      </span>
                      <ul className="space-y-1">
                        {item.learningOutcomes.slice(0, 2).map((outcome, idx) => (
                          <li key={idx} className="text-[11px] text-zinc-600 flex items-start gap-1.5 font-medium leading-snug">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Schedule & Capacity Details */}
                  <div className="pt-3 border-t border-zinc-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-zinc-600 font-medium text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{item.duration}</span>
                      </div>
                    </div>

                    {/* Progress Bar for Enrolled Seats */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 mb-1">
                        <span>Enrolled Students</span>
                        <span>{item.enrolledCount} / {item.capacity} Seats</span>
                      </div>
                      <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFull ? 'bg-rose-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${Math.min(100, (item.enrolledCount / item.capacity) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedMasterclass(item)}
                        className="px-3 py-2 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Syllabus & Info
                      </button>

                      <button
                        onClick={() => setEnrollModalItem(item)}
                        disabled={isFull}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                          isFull
                            ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/20'
                        }`}
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>{isFull ? 'Seats Full' : item.isPaid ? 'Enroll Now' : 'RSVP Free'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode View */
        <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-extrabold uppercase text-zinc-400 tracking-wider">
                  <th className="py-3.5 px-4">Masterclass & Instructor</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date & Duration</th>
                  <th className="py-3.5 px-4">Fee / Access</th>
                  <th className="py-3.5 px-4">Enrolled Seats</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-medium text-zinc-700">
                {filteredMasterclasses.map((item) => {
                  const isFull = item.enrolledCount >= item.capacity;

                  return (
                    <tr 
                      key={item.id}
                      onClick={() => setSelectedMasterclass(item)}
                      className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-14 h-12 rounded-xl object-cover border border-zinc-200 shrink-0 bg-zinc-900"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <h5 className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors truncate text-sm">
                              {item.title}
                            </h5>
                            <p className="text-[11px] text-zinc-500 truncate max-w-sm">
                              Led by <strong className="text-zinc-700">{item.facilitatorName}</strong> — {item.tagline}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-zinc-100 text-zinc-800 border border-zinc-200">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-600">
                        <div className="font-bold">{item.date}</div>
                        <div className="text-[11px] text-zinc-400 font-mono">{item.duration}</div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold">
                        <span className={item.isPaid ? 'text-indigo-600' : 'text-emerald-600'}>
                          {item.price}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-zinc-800 font-bold">
                          {item.enrolledCount} / {item.capacity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setEnrollModalItem(item)}
                            disabled={isFull}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isFull
                                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                          >
                            {isFull ? 'Full' : 'Enroll'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail / Syllabus Modal */}
      {selectedMasterclass && (
        <div 
          onClick={() => setSelectedMasterclass(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-950 rounded-3xl w-full max-w-4xl shadow-2xl border border-zinc-800 overflow-hidden text-white flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/80">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  {selectedMasterclass.category}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  Level: {selectedMasterclass.level}
                </span>
              </div>
              <button 
                onClick={() => setSelectedMasterclass(null)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Cover Banner */}
              <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-zinc-900 border border-zinc-800">
                <img 
                  src={resolveImageUrl(selectedMasterclass.imageUrl)} 
                  alt={selectedMasterclass.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" fill="%2318181B"><rect width="800" height="450" fill="%2327272A"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23A1A1AA" font-family="sans-serif" font-size="20" font-weight="bold">Creatives Garage</text></svg>';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent flex items-end p-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">{selectedMasterclass.title}</h2>
                    <p className="text-zinc-300 text-xs sm:text-sm mt-1">{selectedMasterclass.tagline}</p>
                  </div>
                </div>
              </div>

              {/* Grid split info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main 2-cols: Overview & Syllabus */}
                <div className="md:col-span-2 space-y-6 text-xs text-zinc-300">
                  <div>
                    <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> About This Masterclass
                    </h4>
                    <p className="leading-relaxed text-zinc-300 text-sm">
                      {selectedMasterclass.description}
                    </p>
                  </div>

                  {/* Learning Outcomes */}
                  {selectedMasterclass.learningOutcomes && (
                    <div className="space-y-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
                      <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Learning Outcomes
                      </h4>
                      <ul className="space-y-2">
                        {selectedMasterclass.learningOutcomes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-zinc-200 leading-snug">
                            <span className="p-1 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-[10px] shrink-0 mt-0.5">
                              0{idx + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {selectedMasterclass.prerequisites && (
                    <div>
                      <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider mb-1">
                        Prerequisites & Preparation
                      </h4>
                      <p className="text-zinc-400 italic">{selectedMasterclass.prerequisites}</p>
                    </div>
                  )}

                  {/* Facilitator Bio */}
                  <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-start gap-4">
                    <img 
                      src={selectedMasterclass.facilitatorAvatar} 
                      alt={selectedMasterclass.facilitatorName}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-zinc-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h5 className="font-extrabold text-white text-sm">
                        Instructor: {selectedMasterclass.facilitatorName}
                      </h5>
                      <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                        {selectedMasterclass.facilitatorBio}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sidebar 1-col: Logistics & Enroll Action */}
                <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-4 text-xs h-fit">
                  <div className="text-center p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase block">Registration Fee</span>
                    <span className="text-2xl font-black text-white">{selectedMasterclass.price}</span>
                  </div>

                  <div className="space-y-3 text-zinc-300">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-white">Date & Time</span>
                        <span className="text-zinc-400">{selectedMasterclass.date} ({selectedMasterclass.time})</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-white">Duration</span>
                        <span className="text-zinc-400">{selectedMasterclass.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-white">Venue</span>
                        <span className="text-zinc-400">{selectedMasterclass.location}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Users className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-white">Seats Availability</span>
                        <span className="text-zinc-400">{selectedMasterclass.enrolledCount} of {selectedMasterclass.capacity} Seats Filled</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEnrollModalItem(selectedMasterclass);
                      setSelectedMasterclass(null);
                    }}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-colors"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Reserve Seat Now</span>
                  </button>

                  <a 
                    href="https://creativesgarage.org/masterclasses" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View on Official Website</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Modal */}
      {enrollModalItem && (
        <div 
          onClick={() => setEnrollModalItem(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-in zoom-in-95 duration-200"
          >
            {enrolledSuccessId ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-zinc-900">Registration Confirmed!</h3>
                <p className="text-xs text-zinc-600 max-w-xs mx-auto">
                  You are registered for <strong>{enrollModalItem.title}</strong>. A calendar invite has been sent to your email.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-base text-zinc-900">Masterclass Registration</h3>
                    <p className="text-xs text-zinc-500 truncate max-w-xs">{enrollModalItem.title}</p>
                  </div>
                  <button 
                    onClick={() => setEnrollModalItem(null)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-zinc-700 block mb-1">Full Name *</label>
                    <input 
                      type="text"
                      required
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-zinc-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-zinc-700 block mb-1">Email Address *</label>
                    <input 
                      type="email"
                      required
                      placeholder="e.g. creative@domain.com"
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl font-medium text-zinc-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-zinc-700 block mb-1">Phone Number (M-Pesa Updates)</label>
                    <input 
                      type="tel"
                      placeholder="e.g. +254 712 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl font-medium text-zinc-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-zinc-700 block mb-1">Attendance Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAttendanceMode('in_person')}
                        className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                          attendanceMode === 'in_person' 
                            ? 'bg-zinc-900 text-white border-zinc-900' 
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>In-Person Hub</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAttendanceMode('virtual')}
                        className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                          attendanceMode === 'virtual' 
                            ? 'bg-zinc-900 text-white border-zinc-900' 
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Virtual Stream</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-indigo-600 block">Total Fee</span>
                      <span className="text-base font-black text-zinc-900">{enrollModalItem.price}</span>
                    </div>
                    <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-2 py-1 rounded-lg">
                      {enrollModalItem.isPaid ? 'M-Pesa / Card' : 'Free Entry'}
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEnrollModalItem(null)}
                      className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Confirm Registration</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Proposal Modal */}
      {isProposalModalOpen && (
        <div 
          onClick={() => setIsProposalModalOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-900">Propose & Lead a Masterclass</h3>
                  <p className="text-xs text-zinc-500">Share your creative expertise with the Westlands hub community</p>
                </div>
              </div>
              <button 
                onClick={() => setIsProposalModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProposalSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-700 block mb-1">Masterclass Title *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. AI-Assisted Screenwriting & Worldbuilding"
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-zinc-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Discipline Category</label>
                  <select 
                    value={propCategory}
                    onChange={(e) => setPropCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-zinc-800 outline-none"
                  >
                    <option value="AI & Innovation">AI & Innovation</option>
                    <option value="Digital Arts & Media">Digital Arts & Media</option>
                    <option value="Legal & Business">Legal & Business</option>
                    <option value="Film & Cinema">Film & Cinema</option>
                    <option value="Audio & Music">Audio & Music</option>
                    <option value="Music & Business">Music & Business</option>
                    <option value="Heritage & Music">Heritage & Music</option>
                    <option value="Performance">Performance</option>
                    <option value="Visual Arts">Visual Arts</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Skill Level</label>
                  <select 
                    value={propLevel}
                    onChange={(e) => setPropLevel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-zinc-800 outline-none"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Tagline / Catchphrase</label>
                <input 
                  type="text"
                  placeholder="e.g. Practical workflow secrets from real-world AI script production"
                  value={propTagline}
                  onChange={(e) => setPropTagline(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl font-medium text-zinc-800 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Detailed Description & Agenda</label>
                <textarea 
                  rows={3}
                  placeholder="Outline what participants will learn, hands-on activities, tools used..."
                  value={propDescription}
                  onChange={(e) => setPropDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl font-medium text-zinc-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Facilitator Name</label>
                  <input 
                    type="text"
                    value={propFacilitatorName}
                    onChange={(e) => setPropFacilitatorName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-zinc-800 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Fee & Access</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="text"
                      disabled={!propIsPaid}
                      placeholder="KES 1,500"
                      value={propPrice}
                      onChange={(e) => setPropPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl font-bold text-zinc-800 outline-none disabled:opacity-50"
                    />
                    <label className="flex items-center gap-1 font-bold text-[11px] shrink-0 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={!propIsPaid} 
                        onChange={(e) => setPropIsPaid(!e.target.checked)} 
                      />
                      <span>Free</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Masterclass Cover Image</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="file" 
                    ref={coverFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        compressImageFile(e.target.files[0], 1000, 1000, 0.85).then((dataUrl) => {
                          if (dataUrl) setPropImageUrl(dataUrl);
                        });
                      }
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    className="px-3 py-2 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Image File
                  </button>
                  <input 
                    type="text"
                    value={propImageUrl}
                    onChange={(e) => setPropImageUrl(e.target.value)}
                    placeholder="or paste image URL..."
                    className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-mono outline-none text-zinc-800"
                  />
                </div>
                {propImageUrl && (
                  <img 
                    src={propImageUrl} 
                    alt="Preview" 
                    className="mt-2 h-20 w-full object-cover rounded-xl border border-zinc-200"
                  />
                )}
              </div>

              <div>
                <label className="font-bold text-zinc-700 block mb-1">Key Learning Outcomes (1 per line)</label>
                <textarea 
                  rows={2}
                  placeholder="Outcome 1&#10;Outcome 2&#10;Outcome 3"
                  value={propOutcomes}
                  onChange={(e) => setPropOutcomes(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl font-medium text-zinc-800 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsProposalModalOpen(false)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Masterclass Proposal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
