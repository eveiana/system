import { useState, FormEvent, useRef } from 'react';
import { UserProfile } from '../types';
import { compressImageFile } from '../lib/imageCompressor';
import { User, Mail, MapPin, Phone, FileText, CheckCircle2, Sparkles, Key, Upload } from 'lucide-react';

interface SettingsProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
}

export function SettingsProfileView({
  user,
  onUpdateUser
}: SettingsProfileViewProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [avatar, setAvatar] = useState(user.avatar);
  const [phone, setPhone] = useState("+254 712 345678");
  const [location, setLocation] = useState("Nairobi, Kenya");
  const [bio, setBio] = useState("Lead Community Onboarder and Ecosystem Developer focused on high-quality Kenyan and Pan-African start-up incubation workspaces.");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      email,
      role,
      avatar
    });
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRandomAvatar = () => {
    const r = Math.floor(Math.random() * 70) + 1;
    const newAvatar = `https://i.pravatar.cc/150?img=${r}`;
    setAvatar(newAvatar);
  };

  return (
    <div className="p-6 space-y-6 max-w-[900px] mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">My Profile Settings</h2>
        <p className="text-xs text-zinc-500 mt-1">Manage your identity details, roles, contact numbers, and profile avatars.</p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        
        {/* Banner with avatar selection */}
        <div className="bg-zinc-900 h-28 relative flex items-end p-5">
          <div className="absolute top-0 right-0 w-32 h-28 bg-indigo-500/10 rounded-full blur-2xl" />
          
          <div className="flex items-center gap-3 translate-y-10 z-10">
            <img 
              src={avatar} 
              alt={name} 
              className="w-18 h-18 rounded-full border-4 border-white object-cover bg-white shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex items-center gap-2 mt-5">
              <input 
                type="file" 
                ref={avatarInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    compressImageFile(e.target.files[0], 400, 400, 0.85).then((dataUrl) => {
                      if (dataUrl) setAvatar(dataUrl);
                    });
                  }
                }}
              />
              <button 
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="px-3 py-1 bg-zinc-900 hover:bg-black text-white text-[10px] font-extrabold rounded-xl border border-zinc-800 transition-colors shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                Upload Photo
              </button>
              <button 
                type="button"
                onClick={handleRandomAvatar}
                className="px-2.5 py-1 bg-white hover:bg-zinc-50 text-zinc-700 text-[10px] font-extrabold rounded-xl border border-zinc-200 transition-colors shadow-xs cursor-pointer"
              >
                Rotate
              </button>
            </div>
          </div>
        </div>

        {/* Profile Inputs */}
        <form onSubmit={handleSubmit} className="p-5 pt-14 space-y-5 text-xs font-semibold text-zinc-600">
          
          {/* Status feedback */}
          {isSaved && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl flex items-center gap-2 font-bold animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Profile details saved successfully! App header is synchronized.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-zinc-500">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all text-zinc-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-zinc-500">Work Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all text-zinc-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-zinc-500">Telephone / Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all text-zinc-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-zinc-500">Operational Base / Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all text-zinc-800"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-zinc-500">Workspace Member Role (Simulated)</label>
            <div className="relative">
              <Key className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                disabled
                value={role}
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-extrabold outline-none text-zinc-500 cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-zinc-400 font-bold mt-1">To update your security rank or role, contact workspace support.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-zinc-500">Biographical Narrative</label>
            <textarea 
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-zinc-100 flex justify-end">
            <button 
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer shadow-lg shadow-indigo-600/15 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
