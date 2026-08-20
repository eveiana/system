import { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { User, LogOut, Settings, Shield, Bell, HelpCircle } from 'lucide-react';

interface UserMenuProps {
  user: UserProfile;
  onNavigate: (path: string) => void;
  onLogout?: () => void;
}

export function UserMenu({ user, onNavigate, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-3" ref={menuRef}>
      {/* Notifications trigger (mock) */}
      <button className="p-1.5 hover:bg-zinc-100 rounded-full text-zinc-500 hover:text-zinc-800 transition-colors relative">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
      </button>

      <div className="h-4 w-px bg-zinc-200" />

      {/* Main Avatar Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 hover:bg-zinc-100 rounded-lg text-left transition-colors cursor-pointer"
      >
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-100"
          referrerPolicy="no-referrer"
        />
        <div className="hidden md:flex flex-col select-none">
          <span className="text-xs font-semibold text-zinc-800 leading-none">{user.name}</span>
          <span className="text-[10px] text-zinc-500 leading-none mt-0.5">{user.role}</span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-11 w-56 bg-white rounded-xl shadow-2xl border border-zinc-100 py-1.5 z-50 text-sm font-medium text-zinc-700 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3.5 py-2.5 border-b border-zinc-100">
            <p className="text-xs text-zinc-400 font-normal">Signed in as</p>
            <p className="font-semibold text-zinc-900 truncate mt-0.5">{user.name}</p>
            <p className="text-xs text-zinc-500 truncate mt-0.5">{user.email}</p>
          </div>

          <div className="py-1">
            <button 
              onClick={() => {
                onNavigate("/settings/profile");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
            >
              <User className="w-4 h-4 text-zinc-400" />
              <span>My Profile</span>
            </button>
            <button 
              onClick={() => {
                onNavigate("/settings/users");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
            >
              <Shield className="w-4 h-4 text-zinc-400" />
              <span>Team & Roles</span>
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 text-left transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-zinc-400" />
              <span>Help Center</span>
            </button>
          </div>

          <div className="border-t border-zinc-100 pt-1.5">
            <button 
              onClick={() => {
                setIsOpen(false);
                if (onLogout) {
                  onLogout();
                } else {
                  alert("This is a demo space. Logging out is simulated! Safe travels.");
                }
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-600 hover:bg-rose-50 text-left transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
