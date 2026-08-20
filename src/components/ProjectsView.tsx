import { useState, FormEvent, ChangeEvent } from 'react';
import { Project, ProjectStatus } from '../types';
import { resolveImageUrl } from '../images';
import { compressImageFile } from '../lib/imageCompressor';
import { 
  Search, Plus, Calendar, DollarSign, Users, Trash2, Sliders, X, 
  CheckCircle, Upload, Image as ImageIcon, Heart, Sparkles, BookOpen, 
  ShieldCheck, Award, MessageCircle, Pencil, Tag
} from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onDeleteProject: (id: string) => void;
}

export function ProjectsView({
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject
}: ProjectsViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Modal State - New Project
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState<number>(150000);
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Planning");
  const [category, setCategory] = useState<string>("Women Programme");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Modal State - Edit Project
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const defaultMembersPool = ["Evaline Atieno", "Zahra Hassan", "Alex Kamau", "Sarah Jenkins", "Elena Rostova", "Michael Chen"];

  // Read file as Data URL with compression
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

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !deadline) {
      alert("Name and Target Date fields are required!");
      return;
    }
    
    onAddProject({
      name,
      description,
      budget,
      deadline,
      status,
      category,
      imageUrl: imageUrl || undefined,
      progress: status === 'Completed' ? 100 : 0,
      members: selectedMembers.length > 0 ? selectedMembers : ["Evaline Atieno"]
    });

    // Reset and Close
    setName("");
    setDescription("");
    setBudget(150000);
    setDeadline("");
    setStatus("Planning");
    setCategory("Women Programme");
    setImageUrl("");
    setSelectedMembers([]);
    setIsModalOpen(false);
  };

  const toggleMemberSelection = (memberName: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberName) 
        ? prev.filter(m => m !== memberName) 
        : [...prev, memberName]
    );
  };

  const getStatusColor = (s: ProjectStatus) => {
    switch (s) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'In Progress': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Planning': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'On Hold': return 'bg-rose-50 text-rose-700 border-rose-100';
    }
  };

  const womenCount = projects.filter(p => p.category === "Women Programme").length;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            Active Hub Projects & Programmes
            {womenCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                {womenCount} Women Initiatives
              </span>
            )}
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Review, manage, and upload artwork for ecosystem initiatives & creative projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Launch New Project
        </button>
      </div>



      {/* Control panel */}
      <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search projects by title, keywords or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all text-zinc-800"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600">
            <Tag className="w-3.5 h-3.5 text-zinc-400" />
            <span>Category:</span>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-zinc-800 cursor-pointer ml-1 text-xs"
            >
              <option value="All">All Categories</option>
              <option value="Co-Lab X">Co-Lab X</option>
              <option value="Women Programme">Women Programme</option>
              <option value="Commerce & Trade">Commerce & Trade</option>
              <option value="Collection of Thoughts">Collection of Thoughts</option>
              <option value="General Hub">General Hub</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600">
            <Sliders className="w-3.5 h-3.5 text-zinc-400" />
            <span>Status:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-zinc-800 cursor-pointer ml-1 text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center border border-zinc-100 rounded-2xl text-zinc-400 font-semibold shadow-sm">
            No projects found matching your filter selection.
          </div>
        ) : (
          filteredProjects.map((proj) => (
            <div key={proj.id} className="bg-white rounded-2xl border border-zinc-150/80 hover:border-zinc-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between relative group">
              {/* Project Image Banner */}
              <div className="aspect-[16/9] w-full overflow-hidden relative bg-zinc-900 border-b border-zinc-100 flex items-center justify-center group/photo">
                {proj.imageUrl ? (
                  <img 
                    src={resolveImageUrl(proj.imageUrl)} 
                    alt={proj.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/photo:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" fill="%2318181B"><rect width="800" height="450" fill="%2327272A"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23A1A1AA" font-family="sans-serif" font-size="20" font-weight="bold">Creatives Garage</text></svg>';
                    }}
                  />
                ) : (
                  <div className="text-center p-4">
                    <Sparkles className="w-8 h-8 text-zinc-600 mx-auto mb-1" />
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">No Cover Image</span>
                  </div>
                )}

                {/* Direct Upload Image Overlay */}
                <label 
                  className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover/photo:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer font-bold text-xs backdrop-blur-[2px] z-10"
                  title="Upload project cover image from device"
                >
                  <Upload className="w-5 h-5 text-indigo-300" />
                  <span>Change Cover Image</span>
                  <span className="text-[9px] text-zinc-300 font-medium">Click to upload file</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageFileRead(file, (dataUrl) => {
                          onUpdateProject(proj.id, { imageUrl: dataUrl });
                        });
                      }
                    }}
                  />
                </label>

                {/* Category tag */}
                {proj.category && (
                  <span className={`absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md shadow-sm border ${
                    proj.category === 'Women Programme'
                      ? 'bg-rose-900/90 text-rose-100 border-rose-700/50'
                      : 'bg-zinc-900/90 text-zinc-100 border-zinc-700/50'
                  }`}>
                    {proj.category}
                  </span>
                )}

                {/* Status tag */}
                <span className={`absolute top-3 right-3 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border shadow-sm ${getStatusColor(proj.status)}`}>
                  {proj.status}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {proj.name}
                  </h3>
                  <p className="text-zinc-600 text-xs mt-1 font-medium leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>
                </div>

                {/* Progress Slider */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400">
                    <span>PROGRESS</span>
                    <span className="text-zinc-700">{proj.progress}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={proj.progress}
                      onChange={(e) => onUpdateProject(proj.id, { 
                        progress: parseInt(e.target.value),
                        status: parseInt(e.target.value) === 100 ? 'Completed' : proj.status === 'Completed' ? 'In Progress' : proj.status
                      })}
                      className="flex-1 accent-indigo-600 h-1.5 rounded-lg cursor-pointer bg-zinc-100"
                    />
                  </div>
                </div>

                {/* Meta stats block */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] font-bold text-zinc-500">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{proj.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                      <span>KSh {proj.budget.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Team Members stack & Edit/Delete actions */}
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {proj.members.map((member, idx) => (
                        <div 
                          key={idx} 
                          className="w-5 h-5 rounded-full bg-zinc-800 text-[8px] text-white flex items-center justify-center font-bold ring-2 ring-white cursor-help"
                          title={member}
                        >
                          {member.split(' ').map(n=>n[0]).join('')}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setEditingProject(proj)}
                      className="p-1 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Details & Upload Photo"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button 
                      onClick={() => {
                        if (confirm(`Delete project "${proj.name}"?`)) {
                          onDeleteProject(proj.id);
                        }
                      }}
                      className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: New Project */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 shrink-0">
              <h3 className="font-extrabold text-zinc-800 text-sm">Launch New Incubator Project</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs font-semibold text-zinc-600 overflow-y-auto flex-1">
              <div className="space-y-1.5">
                <label className="block text-zinc-700 font-bold">Project Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Tales of Dreamers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 border border-zinc-200 bg-white rounded-xl outline-none font-bold text-zinc-800 cursor-pointer"
                  >
                    <option value="Co-Lab X">Co-Lab X</option>
                    <option value="Women Programme">Women Programme</option>
                    <option value="Commerce & Trade">Commerce & Trade</option>
                    <option value="Collection of Thoughts">Collection of Thoughts</option>
                    <option value="General Hub">General Hub</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">Project Phase</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                    className="w-full p-2.5 border border-zinc-200 bg-white rounded-xl outline-none font-bold text-zinc-800 cursor-pointer"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-zinc-700 font-bold">Scope and Description</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Describe the goals, stories, and community impact of this project..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800 resize-none"
                />
              </div>

              {/* Direct File Upload Area */}
              <div className="space-y-2">
                <label className="block text-zinc-700 font-bold">Cover Artwork Image</label>
                
                <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 rounded-xl p-3.5 text-center transition-all">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-full">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-800 text-xs">Upload Cover Image from device</p>
                      <p className="text-[10px] text-zinc-400">PNG, JPG, WEBP, SVG</p>
                    </div>
                    <label className="px-3 py-1 bg-white border border-zinc-200 hover:border-indigo-300 text-zinc-700 font-extrabold text-[11px] rounded-lg cursor-pointer shadow-2xs hover:bg-zinc-50 transition-colors inline-flex items-center gap-1.5 mt-1">
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
                              setImageUrl(dataUrl);
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {imageUrl && (
                  <div className="mt-2 p-2 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-3">
                    <img src={resolveImageUrl(imageUrl)} alt="Preview" className="w-10 h-10 object-cover rounded-lg border shrink-0 bg-white" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-emerald-600 text-[10px] flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Image Loaded
                      </p>
                      <p className="text-[10px] text-zinc-400 truncate">{imageUrl.startsWith('data:') ? 'Local Base64 File' : imageUrl}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setImageUrl("")}
                      className="p-1 text-zinc-400 hover:text-rose-600 text-[10px] font-bold cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">Total Budget (KSh)</label>
                  <input 
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value))}
                    className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">Deadline Target</label>
                  <input 
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                  />
                </div>
              </div>

              {/* Assign Team list */}
              <div className="space-y-1.5">
                <label className="block text-zinc-700 font-bold">Assign Hub Partners (Select Multiple)</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {defaultMembersPool.map(m => {
                    const isSelected = selectedMembers.includes(m);
                    return (
                      <button
                        type="button"
                        key={m}
                        onClick={() => toggleMemberSelection(m)}
                        className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs' 
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-zinc-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer shadow-lg shadow-indigo-600/15"
                >
                  Launch Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Project */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 shrink-0">
              <h3 className="font-extrabold text-zinc-800 text-sm">Edit Project & Cover Artwork</h3>
              <button 
                onClick={() => setEditingProject(null)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateProject(editingProject.id, editingProject);
                setEditingProject(null);
              }} 
              className="p-5 space-y-4 text-xs font-semibold text-zinc-600 overflow-y-auto flex-1"
            >
              <div className="space-y-1.5">
                <label className="block text-zinc-700 font-bold">Project Name</label>
                <input 
                  type="text"
                  required
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">Category</label>
                  <select 
                    value={editingProject.category || 'General Hub'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full p-2.5 border border-zinc-200 bg-white rounded-xl outline-none font-bold text-zinc-800 cursor-pointer"
                  >
                    <option value="Co-Lab X">Co-Lab X</option>
                    <option value="Women Programme">Women Programme</option>
                    <option value="Commerce & Trade">Commerce & Trade</option>
                    <option value="Collection of Thoughts">Collection of Thoughts</option>
                    <option value="General Hub">General Hub</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">Status</label>
                  <select 
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as ProjectStatus })}
                    className="w-full p-2.5 border border-zinc-200 bg-white rounded-xl outline-none font-bold text-zinc-800 cursor-pointer"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-zinc-700 font-bold">Description</label>
                <textarea 
                  rows={3}
                  required
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800 resize-none"
                />
              </div>

              {/* Direct File Upload Area */}
              <div className="space-y-2">
                <label className="block text-zinc-700 font-bold">Cover Image File</label>
                
                <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 rounded-xl p-3.5 text-center transition-all">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-full">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-800 text-xs">Upload new image straight from device</p>
                      <p className="text-[10px] text-zinc-400">PNG, JPG, WEBP, SVG</p>
                    </div>
                    <label className="px-3 py-1 bg-white border border-zinc-200 hover:border-indigo-300 text-zinc-700 font-extrabold text-[11px] rounded-lg cursor-pointer shadow-2xs hover:bg-zinc-50 transition-colors inline-flex items-center gap-1.5 mt-1">
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
                              setEditingProject({ ...editingProject, imageUrl: dataUrl });
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {editingProject.imageUrl && (
                  <div className="mt-2 p-2 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-3">
                    <img src={resolveImageUrl(editingProject.imageUrl)} alt="Preview" className="w-10 h-10 object-cover rounded-lg border shrink-0 bg-white" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-indigo-600 text-[10px]">Active Project Cover</p>
                      <p className="text-[10px] text-zinc-400 truncate">{editingProject.imageUrl.startsWith('data:') ? 'Local Base64 File' : editingProject.imageUrl}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">Total Budget (KSh)</label>
                  <input 
                    type="number"
                    value={editingProject.budget}
                    onChange={(e) => setEditingProject({ ...editingProject, budget: parseInt(e.target.value) })}
                    className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">Deadline Target</label>
                  <input 
                    type="date"
                    required
                    value={editingProject.deadline}
                    onChange={(e) => setEditingProject({ ...editingProject, deadline: e.target.value })}
                    className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2.5 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-zinc-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer shadow-lg shadow-indigo-600/15"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
