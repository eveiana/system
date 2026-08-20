import { useState, FormEvent } from 'react';
import { Event } from '../types';
import { Search, Plus, Calendar, Clock, MapPin, Users, Trash2, X, Smile } from 'lucide-react';

interface EventsViewProps {
  events: Event[];
  currentUser: string;
  onAddEvent: (event: Omit<Event, 'id' | 'registeredMembers'>) => void;
  onRegisterEvent: (id: string, name: string) => void;
  onUnregisterEvent: (id: string, name: string) => void;
  onDeleteEvent: (id: string) => void;
}

export function EventsView({
  events,
  currentUser,
  onAddEvent,
  onRegisterEvent,
  onUnregisterEvent,
  onDeleteEvent
}: EventsViewProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<'Workshop' | 'Meetup' | 'Networking' | 'Conference'>("Meetup");

  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(search.toLowerCase()) || evt.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || evt.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !location) {
      alert("All fields are required to organize a community event!");
      return;
    }

    onAddEvent({
      title,
      description,
      date,
      time,
      location,
      category
    });

    // Reset and Close
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setLocation("");
    setCategory("Meetup");
    setIsModalOpen(false);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Workshop': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Meetup': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Conference': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Networking': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-zinc-50 text-zinc-700 border-zinc-100';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Community Events</h2>
          <p className="text-xs text-zinc-500 mt-1">Join workshops, startup meetups, and evening social firesides.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Organize Event
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search events by keyword, location, speaker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all text-zinc-800"
          />
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-600 shrink-0">
          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          <span>Category:</span>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent border-none outline-none font-bold text-zinc-800 cursor-pointer ml-1 text-xs"
          >
            <option value="All">All Categories</option>
            <option value="Workshop">Workshop</option>
            <option value="Meetup">Meetup</option>
            <option value="Conference">Conference</option>
            <option value="Networking">Networking</option>
          </select>
        </div>
      </div>

      {/* Grid displaying the list of events */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center border border-zinc-100 rounded-2xl text-zinc-400 font-semibold shadow-sm">
            No community gatherings scheduled at this time.
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isRegistered = evt.registeredMembers.includes(currentUser);
            return (
              <div key={evt.id} className="bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between gap-5 relative group overflow-hidden">
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold border ${getCategoryColor(evt.category)}`}>
                      {evt.category}
                    </span>
                    
                    <button 
                      onClick={() => {
                        if (confirm(`Cancel event "${evt.title}"?`)) {
                          onDeleteEvent(evt.id);
                        }
                      }}
                      className="text-zinc-300 hover:text-rose-500 transition-colors p-1 rounded hover:bg-rose-50 opacity-0 group-hover:opacity-100 duration-200"
                      title="Cancel Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-zinc-800 text-sm group-hover:text-indigo-600 transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-zinc-500 text-xs mt-1.5 font-medium leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>
                  </div>
                </div>

                {/* Event Schedule Details and Registration Button */}
                <div className="space-y-4 pt-3 border-t border-zinc-50">
                  <div className="space-y-1.5 text-[11px] font-bold text-zinc-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-indigo-600">{evt.registeredMembers.length} attending</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (isRegistered) {
                        onUnregisterEvent(evt.id, currentUser);
                      } else {
                        onRegisterEvent(evt.id, currentUser);
                      }
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isRegistered 
                        ? 'bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-200/60' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                    }`}
                  >
                    <Smile className="w-4 h-4" />
                    {isRegistered ? "Going (Leave)" : "Secure Spot (Join)"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Event Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h3 className="font-extrabold text-zinc-800 text-sm">Organize Community Gathering</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs font-semibold text-zinc-600">
              <div className="space-y-1.5">
                <label className="block text-zinc-500">Event Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Founders Evening Fireside"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-zinc-500">Event Description</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Tell our partners what this event is about, what they will learn, and who should attend..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-zinc-500">Date</label>
                  <input 
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-500">Time Range</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. 18:00 - 20:00"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-zinc-500">Specific Location</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Roof Terrace Bar"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-500">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-zinc-200 bg-white rounded-xl outline-none font-bold text-zinc-800"
                  >
                    <option value="Meetup">Meetup</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Conference">Conference</option>
                    <option value="Networking">Networking</option>
                  </select>
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
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
