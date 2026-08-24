import { useState, useEffect } from 'react';
import { 
  INITIAL_USER, 
  INITIAL_MEMBERS, 
  INITIAL_APPLICATIONS, 
  INITIAL_PROJECTS, 
  INITIAL_TASKS, 
  INITIAL_EVENTS, 
  INITIAL_BOOKINGS, 
  INITIAL_RESOURCES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_INVOICES, 
  INITIAL_MEDIA,
  INITIAL_MARKET_ITEMS,
  INITIAL_MARKET_SALES,
  INITIAL_PROGRAMMES,
  INITIAL_MASTERCLASSES
} from './data';
import { 
  UserProfile, 
  Member, 
  Application, 
  Project, 
  Task, 
  Event, 
  Booking, 
  ResourceFile, 
  Transaction, 
  Invoice, 
  MediaItem,
  MarketItem,
  MarketSale,
  Programme,
  Masterclass
} from './types';

import { resolveImageUrl } from './images';
import { loadStorage, saveStorage, loadFromIDB } from './lib/storage';

// Sidebar & Header components
import { AppSidebar } from './components/AppSidebar';
import { UserMenu } from './components/UserMenu';

// Page Views
import { DashboardView } from './components/DashboardView';
import { ProgrammesView } from './components/ProgrammesView';
import { MasterclassesView } from './components/MasterclassesView';
import { MembersView } from './components/MembersView';
import { ApplicationsView } from './components/ApplicationsView';
import { ProjectsView } from './components/ProjectsView';
import { TasksView } from './components/TasksView';
import { EventsView } from './components/EventsView';
import { BookingsView } from './components/BookingsView';
import { ResourcesView } from './components/ResourcesView';
import { FinanceView } from './components/FinanceView';
import { MediaView, MediaViewItem } from './components/MediaView';
import { MarketView } from './components/MarketView';
import { SettingsUsersView } from './components/SettingsUsersView';
import { SettingsProfileView } from './components/SettingsProfileView';
import { SignInView } from './components/SignInView';

import { Menu, ChevronRight, LayoutDashboard, Layers, Briefcase, CheckSquare, Sparkles } from 'lucide-react';

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/programmes": "Our Programmes",
  "/masterclasses": "Masterclasses & Workshops",
  "/members": "Members Directory",
  "/applications": "Applications",
  "/projects": "Incubator Projects",
  "/tasks": "My Tasks Board",
  "/events": "Ecosystem Events",
  "/bookings": "Space Bookings",
  "/resources": "Ecosystem Drive",
  "/finance": "Finance ledger",
  "/media": "Media Board",
  "/market": "Garage Market Catalogue",
  "/settings/users": "Team & Roles Settings",
  "/settings/profile": "My Profile Settings",
};

// Initialize seed data with pre-resolved asset URLs
const SEED_PROJECTS = INITIAL_PROJECTS.map(p => ({
  ...p,
  imageUrl: p.imageUrl ? resolveImageUrl(p.imageUrl) : p.imageUrl
}));

const SEED_MEDIA = INITIAL_MEDIA.map(m => ({
  ...m,
  url: m.url ? resolveImageUrl(m.url) : m.url
}));

const SEED_MARKET_ITEMS = INITIAL_MARKET_ITEMS.map(item => ({
  ...item,
  url: item.url ? resolveImageUrl(item.url) : item.url,
  imageUrl: item.imageUrl ? resolveImageUrl(item.imageUrl) : (item.url ? resolveImageUrl(item.url) : undefined)
}));

const SEED_PROGRAMMES = INITIAL_PROGRAMMES.map(p => ({
  ...p,
  imageUrl: p.imageUrl ? resolveImageUrl(p.imageUrl) : p.imageUrl,
  keyProjects: p.keyProjects?.map(kp => ({
    ...kp,
    imageUrl: kp.imageUrl ? resolveImageUrl(kp.imageUrl) : kp.imageUrl
  }))
}));

export default function App() {
  // State Engine with High-Capacity Durable Persistence
  const [user, setUser] = useState<UserProfile>(() => loadStorage('cg_user', INITIAL_USER));
  const [members, setMembers] = useState<Member[]>(() => loadStorage('cg_members', INITIAL_MEMBERS));
  const [applications, setApplications] = useState<Application[]>(() => loadStorage('cg_applications', INITIAL_APPLICATIONS));
  const [projects, setProjects] = useState<Project[]>(() => loadStorage('cg_projects', SEED_PROJECTS));
  const [tasks, setTasks] = useState<Task[]>(() => loadStorage('cg_tasks', INITIAL_TASKS));
  const [events, setEvents] = useState<Event[]>(() => loadStorage('cg_events', INITIAL_EVENTS));
  const [bookings, setBookings] = useState<Booking[]>(() => loadStorage('cg_bookings', INITIAL_BOOKINGS));
  const [resources, setResources] = useState<ResourceFile[]>(() => loadStorage('cg_resources', INITIAL_RESOURCES));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadStorage('cg_transactions', INITIAL_TRANSACTIONS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadStorage('cg_invoices', INITIAL_INVOICES));
  const [media, setMedia] = useState<MediaItem[]>(() => loadStorage('cg_media', SEED_MEDIA));
  const [marketItems, setMarketItems] = useState<MarketItem[]>(() => loadStorage('cg_marketItems', SEED_MARKET_ITEMS));
  const [marketSales, setMarketSales] = useState<MarketSale[]>(() => loadStorage('cg_marketSales', INITIAL_MARKET_SALES));
  const [programmes, setProgrammes] = useState<Programme[]>(() => loadStorage('cg_programmes', SEED_PROGRAMMES));
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>(() => loadStorage('cg_masterclasses', INITIAL_MASTERCLASSES));
  const [isHydrated, setIsHydrated] = useState(false);

  // Async IndexedDB hydration on app startup
  useEffect(() => {
    let isMounted = true;
    async function hydrate() {
      const keysAndSetters: [string, (val: any) => void][] = [
        ['cg_user', setUser],
        ['cg_members', setMembers],
        ['cg_applications', setApplications],
        ['cg_projects', setProjects],
        ['cg_tasks', setTasks],
        ['cg_events', setEvents],
        ['cg_bookings', setBookings],
        ['cg_resources', setResources],
        ['cg_transactions', setTransactions],
        ['cg_invoices', setInvoices],
        ['cg_media', setMedia],
        ['cg_marketItems', setMarketItems],
        ['cg_marketSales', setMarketSales],
        ['cg_programmes', setProgrammes],
        ['cg_masterclasses', setMasterclasses],
      ];

      for (const [key, setter] of keysAndSetters) {
        try {
          const idbData = await loadFromIDB(key);
          if (isMounted && idbData !== null && idbData !== undefined) {
            setter(idbData);
          }
        } catch {
          // IndexedDB hydration failed silently, localStorage copy already active
        }
      }

      if (isMounted) {
        setIsHydrated(true);
      }
    }
    hydrate();
    return () => { isMounted = false; };
  }, []);

  // Sync state changes with high-capacity storage only AFTER initial hydration completes
  useEffect(() => { if (isHydrated) saveStorage('cg_user', user); }, [user, isHydrated]);
  useEffect(() => { if (isHydrated) saveStorage('cg_members', members); }, [members, isHydrated]);
  useEffect(() => { if (isHydrated) saveStorage('cg_applications', applications); }, [applications, isHydrated]);
  useEffect(() => { if (isHydrated) saveStorage('cg_projects', projects); }, [projects, isHydrated]);
  useEffect(() => { if (isHydrated) saveStorage('cg_tasks', tasks); }, [tasks, isHydrated]);
  useEffect(() => { if (isHydrated) saveStorage('cg_events', events); }, [events, isHydrated]);
  useEffect(() => { if (isHydrated) saveStorage('cg_bookings', bookings); }, [bookings, isHydrated]);
  useEffect(() => { if (isHydrated) saveStorage('cg_resources', resources); }, [resources, isHydrated]);
  useEffect(() => { if (isHydrated) saveStorage('cg_transactions', transactions); }, [transactions, isHydrated]);
  useEffect(() => { if (isHydrated) saveStorage('cg_invoices', invoices); }, [invoices, isHydrated]);
  useEffect(() => { if (isHydrated) saveStorage('cg_media', media); }, [media, isHydrated]);
  useEffect(() => { if (isHydrated) saveStorage('cg_marketItems', marketItems); }, [marketItems, isHydrated]);
  useEffect(() => { if (isHydrated) saveStorage('cg_marketSales', marketSales); }, [marketSales, isHydrated]);
  useEffect(() => { if (isHydrated) saveStorage('cg_programmes', programmes); }, [programmes, isHydrated]);
  useEffect(() => { if (isHydrated) saveStorage('cg_masterclasses', masterclasses); }, [masterclasses, isHydrated]);

  const handleAddProgramme = (newProg: Omit<Programme, 'id'>) => {
    const prog: Programme = {
      ...newProg,
      id: `prog-${Date.now()}`
    };
    setProgrammes(prev => [prog, ...prev]);
  };

  const handleDeleteProgramme = (id: string) => {
    setProgrammes(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateProgramme = (id: string, updates: Partial<Programme>) => {
    setProgrammes(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      
      // Synchronize key project image updates with corresponding projects
      if (updates.keyProjects) {
        updates.keyProjects.forEach(kp => {
          if (kp.imageUrl) {
            setProjects(projList => projList.map(proj => 
              proj.name.toLowerCase() === kp.title.toLowerCase() || 
              proj.name.toLowerCase().includes(kp.title.toLowerCase()) || 
              kp.title.toLowerCase().includes(proj.name.toLowerCase())
                ? { ...proj, imageUrl: kp.imageUrl }
                : proj
            ));
          }
        });
      }
      return updated;
    });
  };

  const handleEnrollMasterclass = (id: string) => {
    setMasterclasses(prev => prev.map(m => m.id === id ? { ...m, enrolledCount: m.enrolledCount + 1 } : m));
  };

  const handleAddMasterclass = (newMc: Omit<Masterclass, 'id' | 'enrolledCount'>) => {
    setMasterclasses(prev => [{ ...newMc, id: `mc-${Date.now()}`, enrolledCount: 1 }, ...prev]);
  };

  const handleUpdateMasterclass = (mc: Masterclass) => {
    setMasterclasses(prev => prev.map(m => m.id === mc.id ? mc : m));
  };

  const handleDeleteMasterclass = (id: string) => {
    setMasterclasses(prev => prev.filter(m => m.id !== id));
  };

  const handleResetData = () => {
    setUser(INITIAL_USER);
    setMembers(INITIAL_MEMBERS);
    setApplications(INITIAL_APPLICATIONS);
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setEvents(INITIAL_EVENTS);
    setBookings(INITIAL_BOOKINGS);
    setResources(INITIAL_RESOURCES);
    setTransactions(INITIAL_TRANSACTIONS);
    setInvoices(INITIAL_INVOICES);
    setMedia(INITIAL_MEDIA);
    setMarketItems(INITIAL_MARKET_ITEMS);
    setMarketSales(INITIAL_MARKET_SALES);
    setProgrammes(INITIAL_PROGRAMMES);
    setMasterclasses(INITIAL_MASTERCLASSES);
    localStorage.clear();
    localStorage.setItem('cg_authenticated', 'true');
  };


  // Layout & Navigation State
  const [currentPath, setCurrentPath] = useState<string>("/dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cg_authenticated') === 'true';
  });

  // Cross-Tab Real-Time Data & Auth Synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cg_authenticated') {
        setIsAuthenticated(e.newValue === 'true');
      } else if (e.key === 'cg_user' && e.newValue) {
        setUser(JSON.parse(e.newValue));
      } else if (e.key === 'cg_members' && e.newValue) {
        setMembers(JSON.parse(e.newValue));
      } else if (e.key === 'cg_projects' && e.newValue) {
        setProjects(JSON.parse(e.newValue));
      } else if (e.key === 'cg_tasks' && e.newValue) {
        setTasks(JSON.parse(e.newValue));
      } else if (e.key === 'cg_events' && e.newValue) {
        setEvents(JSON.parse(e.newValue));
      } else if (e.key === 'cg_bookings' && e.newValue) {
        setBookings(JSON.parse(e.newValue));
      } else if (e.key === 'cg_resources' && e.newValue) {
        setResources(JSON.parse(e.newValue));
      } else if (e.key === 'cg_transactions' && e.newValue) {
        setTransactions(JSON.parse(e.newValue));
      } else if (e.key === 'cg_invoices' && e.newValue) {
        setInvoices(JSON.parse(e.newValue));
      } else if (e.key === 'cg_media' && e.newValue) {
        setMedia(JSON.parse(e.newValue));
      } else if (e.key === 'cg_marketItems' && e.newValue) {
        setMarketItems(JSON.parse(e.newValue));
      } else if (e.key === 'cg_marketSales' && e.newValue) {
        setMarketSales(JSON.parse(e.newValue));
      } else if (e.key === 'cg_programmes' && e.newValue) {
        setProgrammes(JSON.parse(e.newValue));
      } else if (e.key === 'cg_masterclasses' && e.newValue) {
        setMasterclasses(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSignIn = (customName?: string, customEmail?: string) => {
    if (customName || customEmail) {
      setUser({
        name: customName || 'Evaline Atieno',
        email: customEmail || 'evalineatieno857@gmail.com',
        role: 'Ecosystem Member',
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
      });
    } else {
      setUser(INITIAL_USER);
    }
    setIsAuthenticated(true);
    localStorage.setItem('cg_authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('cg_authenticated');
  };

  // Synchronize route with hash URLs
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const path = hash.replace("#", "");
      if (TITLES[path]) {
        setCurrentPath(path);
      } else {
        setCurrentPath("/dashboard");
      }
    };

    // Initialize route on mount
    if (window.location.hash) {
      handleHashChange();
    } else {
      window.location.hash = "#/dashboard";
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (path: string) => {
    window.location.hash = "#" + path;
  };

  // State update handlers
  const handleUpdateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  // Members Actions
  const handleAddMember = (newMember: Omit<Member, 'id' | 'joinedDate'>) => {
    const member: Member = {
      ...newMember,
      id: `mem-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setMembers(prev => [member, ...prev]);
  };

  const handleUpdateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const handleDeleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  // Applications Actions
  const handleApproveApplication = (id: string) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;

    // Set status to approved
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));

    // If it was a membership application, automatically onboard them as a Member!
    if (app.type === 'Membership') {
      handleAddMember({
        name: app.name,
        email: app.email,
        role: 'Member',
        status: 'Active',
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
        department: 'Community'
      });
    } else if (app.type === 'Project Funding') {
      // If it was funding, generate a transaction and project
      handleAddProject({
        name: app.title,
        description: app.description,
        progress: 10,
        status: 'Planning',
        members: ['Evaline Atieno', app.name],
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
        budget: 5000
      });

      handleAddTransaction({
        description: `Funding grant payout for "${app.title}"`,
        amount: 5000,
        type: 'expense',
        category: 'Startup Funding Grant',
        status: 'Completed'
      });
    }
  };

  const handleRejectApplication = (id: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  // Projects Actions
  const handleAddProject = (newProject: Omit<Project, 'id'>) => {
    const proj: Project = {
      ...newProject,
      id: `proj-${Date.now()}`
    };
    setProjects(prev => [proj, ...prev]);
  };

  const handleUpdateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      
      // Sync project image updates to matching subprojects/keyProjects in programmes
      const targetProject = updated.find(p => p.id === id);
      if (targetProject && updates.imageUrl) {
        setProgrammes(progList => progList.map(prog => {
          if (!prog.keyProjects) return prog;
          let changed = false;
          const newKeyProjects = prog.keyProjects.map(kp => {
            if (
              kp.title.toLowerCase() === targetProject.name.toLowerCase() || 
              targetProject.name.toLowerCase().includes(kp.title.toLowerCase()) ||
              kp.title.toLowerCase().includes(targetProject.name.toLowerCase())
            ) {
              changed = true;
              return { ...kp, imageUrl: updates.imageUrl };
            }
            return kp;
          });
          return changed ? { ...prog, keyProjects: newKeyProjects } : prog;
        }));
      }
      return updated;
    });
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Tasks Actions
  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Done' ? 'Todo' : 'Done';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`
    };
    setTasks(prev => [task, ...prev]);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Events Actions
  const handleAddEvent = (newEvent: Omit<Event, 'id' | 'registeredMembers'>) => {
    const evt: Event = {
      ...newEvent,
      id: `evt-${Date.now()}`,
      registeredMembers: [user.name]
    };
    setEvents(prev => [evt, ...prev]);
  };

  const handleRegisterEvent = (id: string, name: string) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === id && !evt.registeredMembers.includes(name)) {
        return { ...evt, registeredMembers: [...evt.registeredMembers, name] };
      }
      return evt;
    }));
  };

  const handleUnregisterEvent = (id: string, name: string) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === id) {
        return { ...evt, registeredMembers: evt.registeredMembers.filter(n => n !== name) };
      }
      return evt;
    }));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(evt => evt.id !== id));
  };

  // Bookings Actions
  const handleAddBooking = (newBooking: Omit<Booking, 'id'>) => {
    const booking: Booking = {
      ...newBooking,
      id: `book-${Date.now()}`
    };
    setBookings(prev => [booking, ...prev]);

    // Automatically record booking operational micro-fee if it's the premium room
    if (newBooking.resourceName.includes("Podcast")) {
      handleAddTransaction({
        description: `Room Booking Reservation fee: ${newBooking.resourceName}`,
        amount: 35,
        type: 'income',
        category: 'Room Booking',
        status: 'Completed'
      });
    }
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  // Resources Actions
  const handleAddResource = (newResource: Omit<ResourceFile, 'id' | 'uploadDate'>) => {
    const file: ResourceFile = {
      ...newResource,
      id: `res-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setResources(prev => [file, ...prev]);
  };

  const handleUpdateResource = (updatedFile: ResourceFile) => {
    setResources(prev => prev.map(r => r.id === updatedFile.id ? updatedFile : r));
  };

  const handleDeleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  // Transactions Actions
  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'date'>) => {
    const tx: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Invoices Actions
  const handleAddInvoice = (newInv: { clientName: string; amount: number; dueDate: string; status: 'Sent' | 'Paid' }) => {
    const inv: Invoice = {
      id: `INV-2026-${Math.floor(Math.random() * 900) + 100}`,
      recipient: newInv.clientName,
      amount: newInv.amount,
      status: newInv.status === 'Sent' ? 'Unpaid' : 'Paid',
      dueDate: newInv.dueDate,
      issueDate: new Date().toISOString().split('T')[0]
    };
    setInvoices(prev => [inv, ...prev]);
  };

  const handleUpdateInvoiceStatus = (id: string, status: 'Paid' | 'Sent' | 'Overdue') => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        let mappedStatus: any = 'Unpaid';
        if (status === 'Paid') {
          mappedStatus = 'Paid';
          
          // Also automatically record it in our Transactions balance!
          handleAddTransaction({
            description: `Paid Customer Invoice settlement (${inv.id})`,
            amount: inv.amount,
            type: 'income',
            category: 'Memberships',
            status: 'Completed'
          });
        } else if (status === 'Overdue') {
          mappedStatus = 'Overdue';
        }
        return { ...inv, status: mappedStatus };
      }
      return inv;
    }));
  };

  // Media Actions
  const handleAddMedia = (newMedia: Omit<MediaViewItem, 'id' | 'uploadedDate'>) => {
    const item: MediaItem = {
      id: `med-${Date.now()}`,
      url: newMedia.url,
      title: newMedia.title,
      category: newMedia.category as any,
      size: newMedia.size,
      date: new Date().toISOString().split('T')[0]
    };
    setMedia(prev => [item, ...prev]);
  };

  const handleUpdateMedia = (updatedMedia: MediaViewItem) => {
    setMedia(prev => prev.map(m => {
      if (m.id === updatedMedia.id) {
        return {
          ...m,
          title: updatedMedia.title,
          url: updatedMedia.url,
          category: updatedMedia.category as any,
          size: updatedMedia.size,
          date: updatedMedia.uploadedDate,
          uploadedDate: updatedMedia.uploadedDate,
          uploaderName: updatedMedia.uploaderName
        };
      }
      return m;
    }));
  };

  const handleDeleteMedia = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id));
  };

  // Market Actions
  const handleAddMarketItem = (newItem: Omit<MarketItem, 'id' | 'salesCount'>) => {
    const item: MarketItem = {
      ...newItem,
      id: `mkt-${Date.now()}`,
      salesCount: 0
    };
    setMarketItems(prev => [item, ...prev]);
  };

  const handleUpdateMarketItem = (updatedItem: MarketItem) => {
    setMarketItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleDeleteMarketItem = (id: string) => {
    setMarketItems(prev => prev.filter(item => item.id !== id));
  };

  const handleRecordMarketSale = (newSale: Omit<MarketSale, 'id'>) => {
    const sale: MarketSale = {
      ...newSale,
      id: `sale-${Date.now()}`
    };
    setMarketSales(prev => [sale, ...prev]);

    // Automatically increment product sales count
    setMarketItems(prev => prev.map(item => {
      if (item.id === newSale.itemId) {
        return { ...item, salesCount: item.salesCount + newSale.units };
      }
      return item;
    }));

    // Log income in our finance ledger automatically
    handleAddTransaction({
      description: `Market Sale: ${newSale.units}x "${newSale.itemTitle}" (Buyer: ${newSale.buyerName})`,
      amount: newSale.totalAmount,
      type: 'income',
      category: 'Marketplace Proceeds',
      status: 'Completed'
    });
  };

  const handleUpdateMarketStock = (itemId: string, newStock: number) => {
    setMarketItems(prev => prev.map(item => item.id === itemId ? { ...item, stock: newStock } : item));
  };

  // View Routing dispatcher
  const renderView = () => {
    switch (currentPath) {
      case "/dashboard":
        return (
          <DashboardView 
            members={members}
            applications={applications}
            projects={projects}
            tasks={tasks}
            events={events}
            transactions={transactions}
            onNavigate={handleNavigate}
            onToggleTask={handleToggleTask}
          />
        );
      case "/programmes":
        return (
          <ProgrammesView 
            programmes={programmes}
            onUpdateProgramme={handleUpdateProgramme}
            onAddProgramme={handleAddProgramme}
            onDeleteProgramme={handleDeleteProgramme}
            onNavigateToProjects={(cat) => handleNavigate('/projects')}
          />
        );
      case "/masterclasses":
        return (
          <MasterclassesView 
            masterclasses={masterclasses}
            currentUser={user.name}
            onEnroll={handleEnrollMasterclass}
            onAddMasterclass={handleAddMasterclass}
            onUpdateMasterclass={handleUpdateMasterclass}
            onDeleteMasterclass={handleDeleteMasterclass}
            onResetData={handleResetData}
          />
        );
      case "/members":

        return (
          <MembersView 
            members={members}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        );
      case "/applications":
        return (
          <ApplicationsView 
            applications={applications}
            onApprove={handleApproveApplication}
            onReject={handleRejectApplication}
            onDelete={handleDeleteApplication}
          />
        );
      case "/projects":
        return (
          <ProjectsView 
            projects={projects}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
          />
        );
      case "/tasks":
        return (
          <TasksView 
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case "/events":
        return (
          <EventsView 
            events={events}
            currentUser={user.name}
            onAddEvent={handleAddEvent}
            onRegisterEvent={handleRegisterEvent}
            onUnregisterEvent={handleUnregisterEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      case "/bookings":
        return (
          <BookingsView 
            bookings={bookings}
            currentUser={user.name}
            onAddBooking={handleAddBooking}
            onCancelBooking={handleCancelBooking}
          />
        );
      case "/resources":
        return (
          <ResourcesView 
            resources={resources}
            currentUser={user.name}
            onAddResource={handleAddResource}
            onUpdateResource={handleUpdateResource}
            onDeleteResource={handleDeleteResource}
            onResetData={handleResetData}
          />
        );
      case "/finance":
        // Finance View Adapters: map types to match FinanceView props exactly
        const mappedInvoices = invoices.map(inv => ({
          id: inv.id,
          invoiceNumber: inv.id,
          clientName: inv.recipient,
          issueDate: inv.issueDate,
          dueDate: inv.dueDate,
          amount: inv.amount,
          status: inv.status === 'Unpaid' ? 'Sent' : inv.status
        })) as any[];

        return (
          <FinanceView 
            transactions={transactions}
            invoices={mappedInvoices}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onAddInvoice={handleAddInvoice}
            onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
          />
        );
      case "/media":
        // Media View Adapters
        const mappedMedia = media.map(m => ({
          id: m.id,
          url: m.url,
          title: m.title,
          category: m.category,
          size: m.size,
          uploadedDate: m.date || (m as any).uploadedDate || "2026-07-01",
          uploaderName: m.uploaderName || "Michael Chen",
          description: m.description,
          tags: m.tags,
          dimensions: m.dimensions,
          downloadCount: m.downloadCount
        }));

        return (
          <MediaView 
            media={mappedMedia}
            currentUser={user.name}
            onAddMedia={handleAddMedia}
            onUpdateMedia={handleUpdateMedia}
            onDeleteMedia={handleDeleteMedia}
            onResetData={handleResetData}
          />
        );
      case "/market":
        return (
          <MarketView 
            items={marketItems}
            sales={marketSales}
            currentUser={user.name}
            onAddItem={handleAddMarketItem}
            onUpdateItem={handleUpdateMarketItem}
            onDeleteItem={handleDeleteMarketItem}
            onRecordSale={handleRecordMarketSale}
            onUpdateStock={handleUpdateMarketStock}
          />
        );
      case "/settings/users":
        return (
          <SettingsUsersView 
            members={members}
            onUpdateMember={handleUpdateMember}
          />
        );
      case "/settings/profile":
        return (
          <SettingsProfileView 
            user={user}
            onUpdateUser={handleUpdateUser}
          />
        );
      default:
        return <div className="p-8 text-center text-zinc-500 font-bold">404 - Workspace View Not Found</div>;
    }
  };

  if (!isAuthenticated) {
    return <SignInView onSignIn={handleSignIn} />;
  }

  return (
    <div className="min-h-screen flex bg-zinc-50 antialiased font-sans">
      
      {/* Collapsible & Mobile Overlay Sidebar Navigation Panel */}
      <AppSidebar 
        currentPath={currentPath}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen pb-16 md:pb-0">
        
        {/* Global Hub Header Bar */}
        <header className="h-14 border-b border-zinc-200 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-xs z-20 select-none">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 hover:text-zinc-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              title="Open Navigation Drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Sidebar Expand Button */}
            {sidebarCollapsed && (
              <button 
                onClick={() => setSidebarCollapsed(false)}
                className="hidden md:flex p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors min-h-[44px] min-w-[44px] items-center justify-center cursor-pointer"
                title="Expand Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-zinc-400">
              <span className="hover:text-zinc-600 transition-colors cursor-pointer hidden sm:inline" onClick={() => handleNavigate("/dashboard")}>
                Creatives Garage
              </span>
              <span className="hover:text-zinc-600 transition-colors cursor-pointer sm:hidden" onClick={() => handleNavigate("/dashboard")}>
                CG
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
              <span className="text-zinc-800 font-extrabold truncate max-w-[140px] sm:max-w-none">
                {TITLES[currentPath] || "Portal"}
              </span>
            </div>
          </div>

          {/* User Profile Quick Menu */}
          <UserMenu 
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        </header>

        {/* Dynamic View Scrollable Frame */}
        <main className="flex-1 overflow-y-auto bg-zinc-50 scrollbar-thin">
          {renderView()}
        </main>

      </div>

      {/* Mobile Bottom Navigation Bar (Phone Quick Access) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-900 border-t border-zinc-800 text-zinc-400 flex items-center justify-around h-16 px-2 shadow-2xl backdrop-blur-lg">
        <button
          onClick={() => handleNavigate("/dashboard")}
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] cursor-pointer transition-colors ${
            currentPath === "/dashboard" ? "text-white font-bold" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${currentPath === "/dashboard" ? "text-white" : ""}`} />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </button>

        <button
          onClick={() => handleNavigate("/programmes")}
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] cursor-pointer transition-colors ${
            currentPath.startsWith("/programmes") ? "text-white font-bold" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Layers className={`w-5 h-5 ${currentPath.startsWith("/programmes") ? "text-white" : ""}`} />
          <span className="text-[10px] mt-1 font-medium">Programmes</span>
        </button>

        <button
          onClick={() => handleNavigate("/projects")}
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] cursor-pointer transition-colors ${
            currentPath.startsWith("/projects") ? "text-white font-bold" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Briefcase className={`w-5 h-5 ${currentPath.startsWith("/projects") ? "text-white" : ""}`} />
          <span className="text-[10px] mt-1 font-medium">Projects</span>
        </button>

        <button
          onClick={() => handleNavigate("/tasks")}
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] cursor-pointer transition-colors ${
            currentPath === "/tasks" ? "text-white font-bold" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <CheckSquare className={`w-5 h-5 ${currentPath === "/tasks" ? "text-white" : ""}`} />
          <span className="text-[10px] mt-1 font-medium">Tasks</span>
        </button>

        <button
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Menu className="w-5 h-5 text-zinc-300" />
          <span className="text-[10px] mt-1 font-medium">Menu</span>
        </button>
      </nav>

    </div>
  );
}
