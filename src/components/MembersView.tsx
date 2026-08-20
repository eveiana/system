import { useState, FormEvent, useRef } from 'react';
import { Member, MemberRole, MemberStatus } from '../types';
import { compressImageFile } from '../lib/imageCompressor';
import { Search, UserPlus, Filter, Mail, Trash2, Shield, MoreVertical, X, Pencil, Check, Upload, Calendar } from 'lucide-react';

interface MembersViewProps {
  members: Member[];
  onAddMember: (member: Omit<Member, 'id' | 'joinedDate'>) => void;
  onUpdateMember: (id: string, updates: Partial<Member>) => void;
  onDeleteMember: (id: string) => void;
}

export function MembersView({
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember
}: MembersViewProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<MemberRole>("Member");
  const [newMemberStatus, setNewMemberStatus] = useState<MemberStatus>("Active");
  const [newMemberDept, setNewMemberDept] = useState("Product Design");

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const departments = ["Product Design", "Software Engineering", "Marketing & Growth", "Finance", "Sustainability", "Community"];

  // Filtered members list
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || m.role === roleFilter;
    const matchesStatus = statusFilter === "All" || m.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSubmitAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) {
      alert("Please fill in Name and Email fields!");
      return;
    }

    // Default avatars matching search query
    const avatarNum = Math.floor(Math.random() * 70) + 1;
    const mockAvatar = `https://i.pravatar.cc/150?img=${avatarNum}`;

    onAddMember({
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      status: newMemberStatus,
      avatar: mockAvatar,
      department: newMemberDept
    });

    // Reset fields & close
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberRole("Member");
    setNewMemberStatus("Active");
    setNewMemberDept("Product Design");
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Upper header action area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Community Directory</h2>
          <p className="text-xs text-zinc-500 mt-1">Manage, onboard, and assign roles to your hub workspace partners.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Onboard New Member
        </button>
      </div>

      {/* Filter and search bar controls */}
      <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by name, email, team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all text-zinc-800 placeholder-zinc-400"
          />
        </div>

        {/* Role filter dropdown */}
        <div className="flex gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600 shrink-0">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span>Role:</span>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-zinc-800 cursor-pointer ml-1 text-xs"
            >
              <option value="All">All</option>
              <option value="Owner">Owner</option>
              <option value="Admin">Admin</option>
              <option value="Member">Member</option>
              <option value="Guest">Guest</option>
            </select>
          </div>

          {/* Status filter dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600 shrink-0">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span>Status:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-zinc-800 cursor-pointer ml-1 text-xs"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Table Display */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider">
                <th className="px-6 py-4">Partner Profile</th>
                <th className="px-6 py-4">Department / Team</th>
                <th className="px-6 py-4">Workspace Role</th>
                <th className="px-6 py-4">Membership Status</th>
                <th className="px-6 py-4">Onboarded On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs font-medium text-zinc-700">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-400 font-semibold">
                    No community partners found matching filters.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          className="w-10 h-10 rounded-full object-cover border border-zinc-200 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setEditingMember(member)}
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <button 
                            type="button"
                            onClick={() => setEditingMember(member)}
                            className="font-bold text-zinc-800 text-sm leading-none hover:text-indigo-600 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                          >
                            <span>{member.name}</span>
                            <Pencil className="w-3 h-3 text-zinc-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          <p className="text-[11px] text-zinc-400 mt-1 font-semibold flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-full text-[10px] font-bold">
                        {member.department}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={member.role}
                        onChange={(e) => onUpdateMember(member.id, { role: e.target.value as MemberRole })}
                        className="bg-transparent hover:bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 font-semibold text-zinc-800 cursor-pointer text-xs focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="Owner">Owner</option>
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                        <option value="Guest">Guest</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={member.status}
                        onChange={(e) => onUpdateMember(member.id, { status: e.target.value as MemberStatus })}
                        className={`bg-transparent hover:bg-zinc-50 border rounded-lg px-2 py-1 font-bold cursor-pointer text-xs ${
                          member.status === 'Active' 
                            ? 'text-emerald-700 border-emerald-200' 
                            : member.status === 'Pending'
                            ? 'text-amber-700 border-amber-200'
                            : 'text-zinc-500 border-zinc-200'
                        }`}
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 font-mono text-zinc-400 font-medium">
                      {member.joinedDate}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => setEditingMember(member)}
                          className="p-1.5 hover:bg-white text-zinc-400 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer shadow-xs"
                          title="Edit Member Name & Details"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove ${member.name} from the directory?`)) {
                              onDeleteMember(member.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-lg transition-colors cursor-pointer"
                          title="Delete Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard New Member modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h3 className="font-extrabold text-zinc-800 text-sm">Onboard New Hub Partner</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="p-5 space-y-4 text-xs font-semibold text-zinc-600">
              <div className="space-y-1.5">
                <label className="block text-zinc-500">Partner Full Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Victor Wanyama"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-zinc-500">Work Email Address</label>
                <input 
                  type="email"
                  required
                  placeholder="e.g. victor@football.ke"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-zinc-500">Space Role</label>
                  <select 
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as MemberRole)}
                    className="w-full p-2.5 border border-zinc-200 bg-white rounded-xl outline-none font-bold text-zinc-800"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                    <option value="Guest">Guest</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-500">Default Status</label>
                  <select 
                    value={newMemberStatus}
                    onChange={(e) => setNewMemberStatus(e.target.value as MemberStatus)}
                    className="w-full p-2.5 border border-zinc-200 bg-white rounded-xl outline-none font-bold text-zinc-800"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-zinc-500">Primary Team / Department</label>
                <select 
                  value={newMemberDept}
                  onChange={(e) => setNewMemberDept(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 bg-white rounded-xl outline-none font-bold text-zinc-800"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-zinc-600 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer shadow-lg shadow-indigo-600/15"
                >
                  Onboard Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div 
          onClick={() => setEditingMember(null)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-sm">Edit Member Details</h3>
                  <p className="text-[11px] text-zinc-400 font-medium">Update profile name, email, workspace role, and team status</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingMember(null)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-semibold text-zinc-600">
              {/* Avatar Preview & Upload */}
              <div className="flex items-center gap-4 p-3 bg-zinc-50/70 border border-zinc-200/80 rounded-xl">
                <img 
                  src={editingMember.avatar} 
                  alt={editingMember.name} 
                  className="w-14 h-14 rounded-full object-cover border border-zinc-300 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1.5 flex-1">
                  <span className="text-[11px] font-bold text-zinc-500 block">Member Avatar</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      ref={avatarInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          compressImageFile(e.target.files[0], 500, 500, 0.85).then((dataUrl) => {
                            if (dataUrl) {
                              setEditingMember(prev => prev ? { ...prev, avatar: dataUrl } : null);
                            }
                          });
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-white text-indigo-700 hover:shadow-xs rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload Avatar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const randomImg = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;
                        setEditingMember({ ...editingMember, avatar: randomImg });
                      }}
                      className="px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Randomize
                    </button>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-zinc-700 font-bold">Member Full Name</label>
                <input 
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-bold text-zinc-900 text-sm"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-zinc-700 font-bold">Work Email Address</label>
                <input 
                  type="email"
                  required
                  value={editingMember.email}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                />
              </div>

              {/* Role & Status Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">Workspace Role</label>
                  <select 
                    value={editingMember.role}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value as MemberRole })}
                    className="w-full p-2.5 border border-zinc-200 bg-white focus:border-indigo-500 rounded-xl outline-none font-bold text-zinc-800"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                    <option value="Guest">Guest</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">Membership Status</label>
                  <select 
                    value={editingMember.status}
                    onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value as MemberStatus })}
                    className="w-full p-2.5 border border-zinc-200 bg-white focus:border-indigo-500 rounded-xl outline-none font-bold text-zinc-800"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Department & Joined Date Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold">Team / Department</label>
                  <select 
                    value={editingMember.department}
                    onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                    className="w-full p-2.5 border border-zinc-200 bg-white focus:border-indigo-500 rounded-xl outline-none font-bold text-zinc-800"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-700 font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    Onboarded Date
                  </label>
                  <input 
                    type="date"
                    value={editingMember.joinedDate || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, joinedDate: e.target.value })}
                    className="w-full p-2.5 border border-zinc-200 bg-white focus:border-indigo-500 rounded-xl outline-none font-semibold text-zinc-800"
                  />
                </div>
              </div>

              {/* Save & Cancel */}
              <div className="pt-4 border-t border-zinc-100 flex justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2.5 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-zinc-600 font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (editingMember) {
                      onUpdateMember(editingMember.id, {
                        name: editingMember.name,
                        email: editingMember.email,
                        role: editingMember.role,
                        status: editingMember.status,
                        department: editingMember.department,
                        joinedDate: editingMember.joinedDate,
                        avatar: editingMember.avatar
                      });
                      setEditingMember(null);
                    }
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer shadow-lg shadow-indigo-600/15 flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
