import { useState } from 'react';
import { Shield, Users, Check, Lock, Info, Server, Settings, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Member, MemberRole } from '../types';

interface SettingsUsersViewProps {
  members?: Member[];
  onUpdateMember?: (id: string, updates: Partial<Member>) => void;
}

interface RolePermissionItem {
  id: string;
  role: string;
  desc: string;
  users: string;
  permissions: string[];
}

export function SettingsUsersView({ members = [], onUpdateMember }: SettingsUsersViewProps) {
  const [allowPublicApplications, setAllowPublicApplications] = useState(true);
  const [requireBookingVerification, setRequireBookingVerification] = useState(false);
  const [automaticEmailInvites, setAutomaticEmailInvites] = useState(true);

  const [rolePermissions, setRolePermissions] = useState<RolePermissionItem[]>([
    {
      id: "owner",
      role: "Owner / Creator",
      desc: "Full administrative and financial authority over Creatives Garage.",
      users: "Evaline Atieno",
      permissions: ["Financial Ledger Access", "Delete Workspace", "Approve applications", "Modify configurations", "Reserve labs"]
    },
    {
      id: "admin",
      role: "Portal Admin",
      desc: "Help manage directory partners, approve memberships, and maintain calendar events.",
      users: "Alex Kamau, Zahra Hassan",
      permissions: ["Approve applications", "Modify configurations", "Reserve labs", "Onboard new partners"]
    },
    {
      id: "member",
      role: "Ecosystem Member",
      desc: "Standard workspace user. Can reserve spaces, join events, and upload shared board resource files.",
      users: "240+ Portal Members",
      permissions: ["Reserve labs", "Join events", "Upload shared files"]
    },
    {
      id: "guest",
      role: "Visiting Guest",
      desc: "Restricted viewer access. Can join open community fireside events, read guides, but cannot upload.",
      users: "Public Visitors",
      permissions: ["Join events", "Read public guides"]
    }
  ]);

  const [editingRole, setEditingRole] = useState<RolePermissionItem | null>(null);
  const [newPermissionText, setNewPermissionText] = useState("");

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Team & Workspace Roles</h2>
        <p className="text-xs text-zinc-500 mt-1">Configure workspace parameters, roles, permissions, and directory visibility.</p>
      </div>

      {/* Control center switches */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 space-y-4">
        <h3 className="font-extrabold text-zinc-800 text-sm flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-indigo-600" />
          General Workspace Controls
        </h3>

        <div className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-600">
          {/* Switch 1 */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="font-bold text-zinc-800">Allow Public Onboarding Applications</h4>
              <p className="text-[11px] text-zinc-400 font-medium">When enabled, external founders can submit membership applications to join Creatives Garage.</p>
            </div>
            <button 
              onClick={() => setAllowPublicApplications(!allowPublicApplications)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                allowPublicApplications ? 'bg-indigo-600' : 'bg-zinc-200'
              }`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                allowPublicApplications ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Switch 2 */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="font-bold text-zinc-800">Enforce Room Booking Approvals</h4>
              <p className="text-[11px] text-zinc-400 font-medium">Require administrative checkoff before workspace bookings are officially approved.</p>
            </div>
            <button 
              onClick={() => setRequireBookingVerification(!requireBookingVerification)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                requireBookingVerification ? 'bg-indigo-600' : 'bg-zinc-200'
              }`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                requireBookingVerification ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Switch 3 */}
          <div className="py-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="font-bold text-zinc-800">Automatic Onboarding Email Invites</h4>
              <p className="text-[11px] text-zinc-400 font-medium">Send greeting workspace credentials automatically once a directory user is added.</p>
            </div>
            <button 
              onClick={() => setAutomaticEmailInvites(!automaticEmailInvites)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                automaticEmailInvites ? 'bg-indigo-600' : 'bg-zinc-200'
              }`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                automaticEmailInvites ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Permissions matrix */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-50 bg-zinc-50/20 flex justify-between items-center">
          <h3 className="font-extrabold text-zinc-800 text-xs flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-indigo-600" />
            Roles & Operations Permission matrix
          </h3>
          <span className="text-[11px] text-zinc-400 font-medium">Click any role to edit name & privileges</span>
        </div>

        <div className="divide-y divide-zinc-100">
          {rolePermissions.map((item) => (
            <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 text-xs font-semibold text-zinc-600 hover:bg-zinc-50/30 transition-colors">
              <div className="space-y-1.5 md:max-w-md">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-zinc-800 text-sm">
                    {item.role}
                  </h4>
                  <span className="text-[10px] font-bold text-zinc-500 font-mono bg-zinc-100 px-2 py-0.5 rounded-full">
                    {item.users}
                  </span>
                  <button 
                    onClick={() => setEditingRole(item)}
                    className="p-1 hover:bg-white text-zinc-400 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer ml-1 shadow-xs"
                    title="Edit Role Name & Permissions"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Permissions list */}
              <div className="flex flex-wrap gap-1.5 md:max-w-md justify-end items-center">
                {item.permissions.map((perm) => (
                  <span 
                    key={perm} 
                    className="px-2.5 py-1 bg-indigo-50/40 text-indigo-700 border border-indigo-100 rounded-lg text-[10px] font-bold flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-indigo-500" />
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Directory Member Roles Quick Overview */}
      {members.length > 0 && (
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-zinc-800 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Active Directory Member Roles
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Quickly adjust workspace member roles</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {members.map((m) => (
              <div key={m.id} className="p-3 bg-zinc-50/80 border border-zinc-200/80 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-zinc-200" referrerPolicy="no-referrer" />
                  <div className="min-w-0">
                    <p className="font-bold text-zinc-800 text-xs truncate">{m.name}</p>
                    <p className="text-[10px] text-zinc-400 truncate font-medium">{m.email}</p>
                  </div>
                </div>
                {onUpdateMember && (
                  <select 
                    value={m.role}
                    onChange={(e) => onUpdateMember(m.id, { role: e.target.value as MemberRole })}
                    className="bg-white border border-zinc-200 rounded-lg px-2 py-1 text-[11px] font-bold text-zinc-800 outline-none cursor-pointer shrink-0"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                    <option value="Guest">Guest</option>
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingRole && (
        <div 
          onClick={() => setEditingRole(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-zinc-900 text-sm">Edit Role & Permissions</h3>
              </div>
              <button onClick={() => setEditingRole(null)} className="p-1 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-semibold text-zinc-600">
              <div>
                <label className="block text-zinc-700 font-bold mb-1">Role Title</label>
                <input 
                  type="text"
                  value={editingRole.role}
                  onChange={(e) => setEditingRole({ ...editingRole, role: e.target.value })}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 rounded-xl font-bold text-zinc-900 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1">Assigned Users Label</label>
                <input 
                  type="text"
                  value={editingRole.users}
                  onChange={(e) => setEditingRole({ ...editingRole, users: e.target.value })}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 rounded-xl font-medium text-zinc-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1">Role Description</label>
                <textarea 
                  rows={2}
                  value={editingRole.desc}
                  onChange={(e) => setEditingRole({ ...editingRole, desc: e.target.value })}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 rounded-xl font-medium text-zinc-800 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1">Role Permissions</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {editingRole.permissions.map((p, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-[11px] font-bold flex items-center gap-1">
                      {p}
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingRole({
                            ...editingRole,
                            permissions: editingRole.permissions.filter((_, i) => i !== idx)
                          });
                        }}
                        className="hover:text-rose-600 cursor-pointer ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Add permission capability..."
                    value={newPermissionText}
                    onChange={(e) => setNewPermissionText(e.target.value)}
                    className="flex-1 p-2 border border-zinc-200 rounded-xl text-xs font-medium outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if (newPermissionText.trim()) {
                        setEditingRole({
                          ...editingRole,
                          permissions: [...editingRole.permissions, newPermissionText.trim()]
                        });
                        setNewPermissionText("");
                      }
                    }}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 flex justify-end gap-2">
              <button 
                onClick={() => setEditingRole(null)}
                className="px-4 py-2 border border-zinc-200 hover:bg-zinc-50 rounded-xl font-bold text-zinc-600 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setRolePermissions(prev => prev.map(r => r.id === editingRole.id ? editingRole : r));
                  setEditingRole(null);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs cursor-pointer shadow"
              >
                Save Role Config
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

