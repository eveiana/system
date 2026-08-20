import { useState, FormEvent } from 'react';
import { Booking } from '../types';
import { Search, Plus, Calendar, Clock, Laptop, Compass, Video, HelpCircle, Trash2, X, Users } from 'lucide-react';

interface BookingsViewProps {
  bookings: Booking[];
  currentUser: string;
  onAddBooking: (booking: Omit<Booking, 'id'>) => void;
  onCancelBooking: (id: string) => void;
}

export function BookingsView({
  bookings,
  currentUser,
  onAddBooking,
  onCancelBooking
}: BookingsViewProps) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Booking form states
  const [resourceName, setResourceName] = useState("Conference Room A (Glass Wall)");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");

  const resources = [
    { name: "Conference Room A (Glass Wall)", capacity: "12 people", icon: Users, color: "text-indigo-600 bg-indigo-50" },
    { name: "Podcast & Media Studio", capacity: "4 people", icon: Video, color: "text-amber-600 bg-amber-50" },
    { name: "Innovation Sandbox Lab", capacity: "25 people", icon: Compass, color: "text-emerald-600 bg-emerald-50" },
    { name: "Hot Desk Section B", capacity: "1 person per desk", icon: Laptop, color: "text-sky-600 bg-sky-50" },
  ];

  const filteredBookings = bookings.filter(b => {
    return b.resourceName.toLowerCase().includes(search.toLowerCase()) || 
           b.purpose.toLowerCase().includes(search.toLowerCase()) ||
           b.userName.toLowerCase().includes(search.toLowerCase());
  });

  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !endTime || !purpose) {
      alert("Please complete all fields to schedule your session!");
      return;
    }

    onAddBooking({
      resourceName,
      userName: currentUser,
      date,
      startTime,
      endTime,
      purpose
    });

    // Reset
    setDate("");
    setStartTime("");
    setEndTime("");
    setPurpose("");
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Resource Bookings</h2>
          <p className="text-xs text-zinc-500 mt-1">Reserve private booths, conference boards, labs, and podcast studios instantly.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Reserve Space
        </button>
      </div>

      {/* Grid of Available resource templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((res) => {
          const IconComponent = res.icon;
          return (
            <div 
              key={res.name}
              onClick={() => {
                setResourceName(res.name);
                setIsModalOpen(true);
              }}
              className="bg-white p-4 rounded-xl border border-zinc-100 shadow-xs hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group flex items-center gap-3.5"
            >
              <div className={`p-2.5 rounded-xl ${res.color} group-hover:scale-105 transition-transform`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-800 text-xs truncate max-w-[180px]">{res.name}</h4>
                <p className="text-[10px] text-zinc-400 mt-0.5 font-bold">Capacity: {res.capacity}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking schedule search */}
      <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search booking logs by user, workspace, purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-medium outline-none transition-all text-zinc-800"
          />
        </div>
      </div>

      {/* Booking List Cards */}
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-50 bg-zinc-50/20">
          <h3 className="font-extrabold text-zinc-800 text-xs">Today's Reservations Feed</h3>
        </div>
        
        <div className="divide-y divide-zinc-100">
          {filteredBookings.length === 0 ? (
            <div className="p-10 text-center text-zinc-400 font-semibold text-xs">
              No active bookings scheduled for this workspace.
            </div>
          ) : (
            filteredBookings.map((book) => (
              <div key={book.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/30 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-800 text-xs">{book.resourceName}</h4>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      Reserved by <span className="font-bold text-zinc-700">{book.userName}</span> for <span className="italic">"{book.purpose}"</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 text-xs font-semibold">
                  <div className="flex items-center gap-3 text-zinc-500 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{book.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{book.startTime} - {book.endTime}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (confirm(`Cancel booking for "${book.resourceName}"?`)) {
                        onCancelBooking(book.id);
                      }
                    }}
                    className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-lg transition-colors cursor-pointer"
                    title="Cancel Booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-zinc-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h3 className="font-extrabold text-zinc-800 text-sm">Reserve Hub Workspace</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-5 space-y-4 text-xs font-semibold text-zinc-600">
              <div className="space-y-1.5">
                <label className="block text-zinc-500">Selected Workspace</label>
                <select 
                  value={resourceName}
                  onChange={(e) => setResourceName(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 bg-white rounded-xl outline-none font-bold text-zinc-800"
                >
                  <option value="Conference Room A (Glass Wall)">Conference Room A (Glass Wall)</option>
                  <option value="Podcast & Media Studio">Podcast & Media Studio</option>
                  <option value="Innovation Sandbox Lab">Innovation Sandbox Lab</option>
                  <option value="Hot Desk Section B">Hot Desk Section B</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-zinc-500">Booking Purpose</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Brainstorming, recording session..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                />
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-zinc-500">Start Time</label>
                  <input 
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-500">End Time</label>
                  <input 
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2.5 border border-zinc-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none font-medium text-zinc-800"
                  />
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
                  Reserve Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
