import { 
  LayoutDashboard, 
  Users, 
  FileSignature, 
  Briefcase, 
  CheckSquare, 
  CalendarDays, 
  Clock, 
  FolderOpen, 
  DollarSign, 
  Image, 
  ShieldCheck, 
  UserCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Layers,
  GraduationCap,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Images from '../images';

interface AppSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function AppSidebar({ 
  currentPath, 
  onNavigate, 
  collapsed, 
  setCollapsed,
  mobileOpen = false,
  setMobileOpen
}: AppSidebarProps) {
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Our Programmes", path: "/programmes", icon: Layers },
    { name: "Masterclasses", path: "/masterclasses", icon: GraduationCap },
    { name: "Members", path: "/members", icon: Users },
    { name: "Applications", path: "/applications", icon: FileSignature },
    { name: "Projects", path: "/projects", icon: Briefcase },
    { name: "My tasks", path: "/tasks", icon: CheckSquare },
    { name: "Events", path: "/events", icon: CalendarDays },
    { name: "Bookings", path: "/bookings", icon: Clock },
    { name: "Resources", path: "/resources", icon: FolderOpen },
    { name: "Baiskeli Store", path: "/market", icon: ShoppingBag },
    { name: "Finance", path: "/finance", icon: DollarSign },
    { name: "Media", path: "/media", icon: Image },
  ];

  const settingItems = [
    { name: "Team & roles", path: "/settings/users", icon: ShieldCheck },
    { name: "My profile", path: "/settings/profile", icon: UserCircle },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const sidebarContent = (
    <aside 
      className={`bg-zinc-900 border-r border-zinc-800 flex flex-col select-none text-zinc-300 h-full ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Workspace Header */}
      <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-3 overflow-hidden shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-zinc-900 border border-zinc-700/60 flex items-center justify-center">
            <img src={Images.logo} alt="Creatives Garage" className="w-full h-full object-cover" />
          </div>
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-semibold text-sm tracking-tight text-white flex flex-col"
            >
              <span>Creatives Garage</span>
              <span className="text-[10px] font-normal text-zinc-400 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                Community Portal
              </span>
            </motion.div>
          )}
        </div>
        
        {!collapsed && (
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCollapsed(true)}
              className="hidden md:flex p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] items-center justify-center cursor-pointer"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {setMobileOpen && (
              <button
                onClick={() => setMobileOpen(false)}
                className="md:hidden p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                title="Close Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        <div className="space-y-1">
          {!collapsed && (
            <span className="px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
              Management
            </span>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path !== "/dashboard" && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group min-h-[44px] cursor-pointer ${
                  isActive 
                    ? "text-zinc-950 bg-white font-bold shadow-sm" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? "text-zinc-950" : "text-zinc-400 group-hover:text-zinc-200"}`} />
                {!collapsed && (
                  <span className="truncate">{item.name}</span>
                )}
                {collapsed && (
                  <div className="absolute left-14 bg-zinc-950 text-white text-xs px-2.5 py-1.5 rounded shadow-xl border border-zinc-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-1">
          {!collapsed && (
            <span className="px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
              Settings
            </span>
          )}
          {settingItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group min-h-[44px] cursor-pointer ${
                  isActive 
                    ? "text-zinc-950 bg-white font-bold shadow-sm" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? "text-zinc-950" : "text-zinc-400 group-hover:text-zinc-200"}`} />
                {!collapsed && (
                  <span className="truncate">{item.name}</span>
                )}
                {collapsed && (
                  <div className="absolute left-14 bg-zinc-950 text-white text-xs px-2.5 py-1.5 rounded shadow-xl border border-zinc-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expand trigger when collapsed */}
      {collapsed && (
        <div className="p-3 border-t border-zinc-800 flex justify-center shrink-0">
          <button 
            onClick={() => setCollapsed(false)}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            {/* Slide-out Sidebar Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
