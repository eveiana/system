import { useState } from 'react';
import { 
  Member, 
  Application, 
  Project, 
  Task, 
  Event, 
  Transaction 
} from '../types';
import { 
  Users, 
  FileSignature, 
  Briefcase, 
  Coins, 
  CheckSquare, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Activity,
  UserPlus,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  CartesianGrid 
} from 'recharts';

interface DashboardViewProps {
  members: Member[];
  applications: Application[];
  projects: Project[];
  tasks: Task[];
  events: Event[];
  transactions: Transaction[];
  onNavigate: (path: string) => void;
  onToggleTask: (id: string) => void;
}

export function DashboardView({
  members,
  applications,
  projects,
  tasks,
  events,
  transactions,
  onNavigate,
  onToggleTask
}: DashboardViewProps) {
  // Stats calculations
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const pendingApps = applications.filter(a => a.status === 'Pending').length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  
  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Recharts financial data
  const financeData = [
    { name: 'Jan', Income: 8200, Expense: 4100 },
    { name: 'Feb', Income: 9800, Expense: 4900 },
    { name: 'Mar', Income: 11500, Expense: 5300 },
    { name: 'Apr', Income: 12000, Expense: 6800 },
    { name: 'May', Income: 10400, Expense: 7100 },
    { name: 'Jun', Income: 14500, Expense: 8200 },
    { name: 'Jul', Income: totalRevenue, Expense: 5750 },
  ];

  // Members dynamic trend
  const memberTrendData = [
    { name: 'Jan', Total: 120 },
    { name: 'Feb', Total: 135 },
    { name: 'Mar', Total: 155 },
    { name: 'Apr', Total: 182 },
    { name: 'May', Total: 210 },
    { name: 'Jun', Total: 245 },
    { name: 'Jul', Total: 245 + members.length },
  ];

  // Activities feed
  const activities = [
    { id: 1, type: 'member', text: 'Alex Kamau approved new membership rules.', time: '2 hours ago', icon: UserPlus, color: 'text-emerald-500 bg-emerald-50' },
    { id: 2, type: 'app', text: 'New membership application from Sophia Martinez.', time: '4 hours ago', icon: FileSignature, color: 'text-amber-500 bg-amber-50' },
    { id: 3, type: 'project', text: 'Sondeka Awards Selection reached 95% completion milestone.', time: '1 day ago', icon: Briefcase, color: 'text-indigo-500 bg-indigo-50' },
    { id: 4, type: 'finance', text: 'Invoice INV-2026-002 was paid by Zahra Hassan.', time: '2 days ago', icon: Coins, color: 'text-sky-500 bg-sky-50' },
  ];

  const pendingTasks = tasks.filter(t => t.status !== 'Done').slice(0, 4);
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      
      {/* Welcome Banner */}
      <div className="bg-zinc-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-zinc-900/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300 mb-3 border border-zinc-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Creatives Garage Workspace
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Amani, Evaline! 🇰🇪
            </h1>
            <p className="text-zinc-400 text-sm mt-1.5 max-w-xl font-medium leading-relaxed">
              Unlocking creative economies. We are a multi-disciplinary collective for creatives to network, share ideas, collaborate, and access market space.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => onNavigate("/applications")}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 cursor-pointer"
            >
              Review Applications
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => onNavigate("/tasks")}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition-all border border-zinc-700 flex items-center gap-1.5 cursor-pointer"
            >
              My Task Board
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Active Members */}
        <div 
          onClick={() => onNavigate("/members")}
          className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Members</p>
              <h3 className="text-2xl font-bold text-zinc-800 tracking-tight">{activeMembers} / {members.length}</h3>
            </div>
            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 group-hover:scale-105 transition-transform duration-200">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% vs last month</span>
          </div>
        </div>

        {/* Stat 2: Pending Applications */}
        <div 
          onClick={() => onNavigate("/applications")}
          className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Pending Apps</p>
              <h3 className="text-2xl font-bold text-zinc-800 tracking-tight">{pendingApps}</h3>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 group-hover:scale-105 transition-transform duration-200">
              <FileSignature className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs text-amber-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            <span>Needs immediate review</span>
          </div>
        </div>

        {/* Stat 3: Active Projects */}
        <div 
          onClick={() => onNavigate("/projects")}
          className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Projects</p>
              <h3 className="text-2xl font-bold text-zinc-800 tracking-tight">{activeProjects}</h3>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 group-hover:scale-105 transition-transform duration-200">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center mt-4 w-full">
            <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '70%' }}></div>
            </div>
            <span className="text-[10px] font-bold text-zinc-500 ml-2">70%</span>
          </div>
        </div>

        {/* Stat 4: Revenue & Finance */}
        <div 
          onClick={() => onNavigate("/finance")}
          className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Hub Revenue</p>
              <h3 className="text-2xl font-bold text-zinc-800 tracking-tight">KSh {totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-sky-50 rounded-xl text-sky-600 group-hover:scale-105 transition-transform duration-200">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+KSh 3,200 this week</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Sections (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Financial Flow (Bar Chart) */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-zinc-800 text-sm">Financial Activity</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Comparison of monthly inflows vs operational costs</p>
            </div>
            <span className="text-xs font-semibold text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-100">
              Year-to-Date
            </span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="name" fontSize={11} stroke="#a1a1aa" tickLine={false} />
                <YAxis fontSize={11} stroke="#a1a1aa" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#18181b', borderRadius: '12px', border: 'none', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold', fontSize: '12px', color: '#a1a1aa' }}
                />
                <Bar dataKey="Income" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="Expense" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Community growth (Area Chart) */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-zinc-800 text-sm">Community Growth</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Aggregated user signups trend</p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
              Live Trend
            </span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memberTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" fontSize={11} stroke="#a1a1aa" tickLine={false} />
                <YAxis fontSize={11} stroke="#a1a1aa" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#18181b', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Area type="monotone" dataKey="Total" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Task List, Events, and Recent Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1: Urgent Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-zinc-800 text-sm">My Urgent Tasks</h3>
            </div>
            <button 
              onClick={() => onNavigate("/tasks")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              All Tasks
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {pendingTasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <ClipboardList className="w-8 h-8 text-zinc-300 mb-2" />
                <p className="text-zinc-400 text-xs font-semibold">No pending tasks!</p>
              </div>
            ) : (
              pendingTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="p-3 bg-zinc-50 rounded-xl hover:bg-zinc-100/60 transition-colors border border-zinc-100 flex items-start gap-2.5 group"
                >
                  <input 
                    type="checkbox" 
                    checked={task.status === 'Done'}
                    onChange={() => onToggleTask(task.id)}
                    className="w-4 h-4 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 border-zinc-300 transition-all cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-800 group-hover:text-zinc-950 truncate transition-colors">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] font-bold">
                      <span className={`px-1.5 py-0.5 rounded ${
                        task.priority === 'High' 
                          ? 'bg-rose-50 text-rose-600' 
                          : task.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {task.priority} Priority
                      </span>
                      <span className="text-zinc-400">Due {task.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Upcoming Events */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-zinc-800 text-sm">Upcoming Events</h3>
            </div>
            <button 
              onClick={() => onNavigate("/events")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              Calendar
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {upcomingEvents.map((evt) => (
              <div 
                key={evt.id} 
                className="p-3 bg-zinc-50 rounded-xl hover:bg-zinc-100/60 transition-colors border border-zinc-100 flex gap-3"
              >
                <div className="flex flex-col items-center justify-center text-center p-2 bg-indigo-50 text-indigo-600 rounded-lg h-12 w-12 shrink-0">
                  <span className="text-xs font-extrabold leading-none">
                    {new Date(evt.date).getDate()}
                  </span>
                  <span className="text-[9px] font-bold uppercase mt-0.5">
                    {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-zinc-800 truncate">{evt.title}</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5 font-medium truncate">{evt.description}</p>
                  <p className="text-[10px] font-bold text-indigo-600 mt-1">{evt.time} • {evt.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Recent Activity stream */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-100 shadow-sm flex flex-col h-[380px]">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-zinc-800 text-sm">Recent Log Activity</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {activities.map((act) => {
              const IconComponent = act.icon;
              return (
                <div key={act.id} className="flex gap-3">
                  <div className={`p-1.5 rounded-lg h-8 w-8 shrink-0 flex items-center justify-center ${act.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-700 leading-snug">
                      {act.text}
                    </p>
                    <span className="text-[10px] text-zinc-400 mt-1 block font-medium">
                      {act.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
