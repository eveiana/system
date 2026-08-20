import { useState } from 'react';
import { Application } from '../types';
import { Check, X, Search, Filter, Calendar, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface ApplicationsViewProps {
  applications: Application[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ApplicationsView({
  applications,
  onApprove,
  onReject,
  onDelete
}: ApplicationsViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter application items
  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(search.toLowerCase()) || 
      app.title.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const matchesType = typeFilter === "All" || app.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Ecosystem Applications</h2>
        <p className="text-xs text-zinc-500 mt-1">Review proposals, resource access forms, and newly submitted workspace memberships.</p>
      </div>

      {/* Control panel (search and filters) */}
      <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by applicant name, title, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all text-zinc-800"
          />
        </div>

        <div className="flex gap-2.5">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600 shrink-0">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span>Status:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-zinc-800 cursor-pointer ml-1 text-xs"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600 shrink-0">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span>Type:</span>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-zinc-800 cursor-pointer ml-1 text-xs"
            >
              <option value="All">All Types</option>
              <option value="Membership">Membership</option>
              <option value="Project Funding">Project Funding</option>
              <option value="Resource Access">Resource Access</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of cards */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="bg-white p-12 text-center border border-zinc-100 rounded-2xl text-zinc-400 font-semibold shadow-sm">
            No application files found matching the criteria.
          </div>
        ) : (
          filteredApps.map((app) => {
            const isExpanded = expandedId === app.id;
            return (
              <div 
                key={app.id} 
                className={`bg-white rounded-2xl border transition-all duration-200 ${
                  isExpanded ? "border-indigo-100 ring-4 ring-indigo-50/50 shadow-md" : "border-zinc-100 shadow-sm hover:border-zinc-200"
                }`}
              >
                {/* Main Row summary */}
                <div 
                  onClick={() => toggleExpand(app.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      app.type === 'Membership' 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : app.type === 'Project Funding'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-sky-50 text-sky-600'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-zinc-800 text-sm">{app.title}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          app.type === 'Membership' 
                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                            : app.type === 'Project Funding'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-sky-50 text-sky-600 border border-sky-100'
                        }`}>
                          {app.type}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-xs mt-1">
                        By <span className="font-semibold text-zinc-700">{app.name}</span> • <span className="text-zinc-400">{app.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between md:justify-end shrink-0">
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-1 text-zinc-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{app.submittedDate}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                        app.status === 'Approved' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : app.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <button className="p-1 hover:bg-zinc-50 rounded text-zinc-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details section */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-zinc-100/80 bg-zinc-50/20 text-xs text-zinc-600 font-medium">
                    <div className="space-y-4 max-w-3xl">
                      <div>
                        <h4 className="font-bold text-zinc-800 mb-1">Proposal details:</h4>
                        <p className="leading-relaxed whitespace-pre-line text-zinc-500 font-semibold">{app.description}</p>
                      </div>

                      {/* Action buttons */}
                      {app.status === 'Pending' && (
                        <div className="pt-3 flex gap-2">
                          <button 
                            onClick={() => onApprove(app.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1 transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve Proposal
                          </button>
                          <button 
                            onClick={() => onReject(app.id)}
                            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject Application
                          </button>
                        </div>
                      )}

                      {app.status !== 'Pending' && (
                        <div className="pt-2 text-[11px] text-zinc-400 italic">
                          This application was marked as <span className="font-semibold">{app.status.toLowerCase()}</span>. To change this status, please contact admin support.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
