
import React, { useState, useMemo } from 'react';
import { Booking, ItineraryDay, BookingStatus } from '../types';

interface AdminDashboardProps {
  bookings: Booking[];
  itinerary: ItineraryDay[];
  updateBookings: (bookings: Booking[]) => void;
  updateItinerary: (itinerary: ItineraryDay[]) => void;
}

type SortKey = 'timestamp' | 'fullName' | 'totalAmount' | 'status';
type SortOrder = 'asc' | 'desc';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  bookings, 
  itinerary, 
  updateBookings, 
  updateItinerary 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'itinerary'>('bookings');
  const [editDay, setEditDay] = useState<ItineraryDay | null>(null);
  const [syncing, setSyncing] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({ 
    key: 'timestamp', 
    order: 'desc' 
  });

  const stats = useMemo(() => ({
    total: bookings.length,
    verified: bookings.filter(b => b.status === 'Verified').length,
    pending: bookings.filter(b => b.status === 'Pending Verification').length
  }), [bookings]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Basam@2212') {
      setIsAuthenticated(true);
    } else {
      alert('Access Denied: Invalid Credentials');
    }
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    setSyncing(true);
    const newBookings = bookings.map(b => b.id === id ? { ...b, status } : b);
    updateBookings(newBookings);
    setTimeout(() => setSyncing(false), 800);
  };

  const handleItinerarySave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDay) return;
    setSyncing(true);

    let newItinerary;
    if (itinerary.find(d => d.id === editDay.id)) {
      newItinerary = itinerary.map(d => d.id === editDay.id ? editDay : d);
    } else {
      newItinerary = [...itinerary, editDay].sort((a, b) => a.dayNumber - b.dayNumber);
    }
    
    updateItinerary(newItinerary);
    setEditDay(null);
    setTimeout(() => setSyncing(false), 800);
  };

  const requestSort = (key: SortKey) => {
    let order: SortOrder = 'asc';
    if (sortConfig.key === key && sortConfig.order === 'asc') {
      order = 'desc';
    }
    setSortConfig({ key, order });
  };

  const filteredAndSortedBookings = useMemo(() => {
    return bookings
      .filter(b => 
        b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.mobile.includes(searchTerm) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.order === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.order === 'asc' ? 1 : -1;
        return 0;
      });
  }, [bookings, searchTerm, sortConfig]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-md w-full bg-white p-14 rounded-[56px] shadow-2xl animate-fade-in-up border border-gray-100">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-emerald-600 text-white flex items-center justify-center rounded-[32px] text-4xl font-black mx-auto mb-8 shadow-xl shadow-emerald-200">HT</div>
            <h2 className="text-3xl font-black text-gray-900">Admin Control</h2>
            <p className="text-gray-500 font-medium">Premium Dashboard Access (2026 Season)</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 ml-1 tracking-widest">Master Key</label>
              <input 
                type="password" 
                className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-black" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            <button className="w-full bg-gray-900 text-white font-black py-6 rounded-3xl hover:bg-emerald-600 transition-all shadow-xl active:scale-95 text-lg">
              Unlock Terminal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8 bg-white p-10 rounded-[56px] shadow-sm border border-gray-50">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Management Suite</h2>
          <div className="flex items-center mt-3 space-x-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Django Service: Active (2026)</span>
          </div>
        </div>
        <div className="flex space-x-3 bg-gray-100/50 p-2.5 rounded-[32px]">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-10 py-4 rounded-[24px] text-xs font-black tracking-[0.15em] uppercase transition-all ${activeTab === 'bookings' ? 'bg-white shadow-xl text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Leads
          </button>
          <button 
            onClick={() => setActiveTab('itinerary')}
            className={`px-10 py-4 rounded-[24px] text-xs font-black tracking-[0.15em] uppercase transition-all ${activeTab === 'itinerary' ? 'bg-white shadow-xl text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            CMS
          </button>
        </div>
      </div>

      {activeTab === 'bookings' ? (
        <div className="space-y-12">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Gross Inquiries", val: stats.total, color: "gray" },
              { label: "Verified Revenue", val: stats.verified, color: "emerald" },
              { label: "Action Required", val: stats.pending, color: "amber" }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-12 rounded-[56px] shadow-sm border border-gray-50 hover:border-emerald-100 transition-all group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 rounded-full -mr-16 -mt-16`}></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{stat.label}</p>
                <p className={`text-7xl font-black group-hover:scale-105 transition-transform text-${stat.color}-600`}>{stat.val}</p>
              </div>
            ))}
          </div>

          {/* Table Container */}
          <div className="space-y-6">
            <div className="relative max-w-xl">
              <input 
                type="text" 
                placeholder="Find leads by name or contact..." 
                className="w-full px-14 py-6 rounded-[32px] bg-white border border-gray-100 shadow-sm focus:ring-8 focus:ring-emerald-50 outline-none transition-all font-bold"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
            </div>

            <div className="bg-white rounded-[56px] shadow-2xl border border-gray-50 overflow-hidden relative">
              {syncing && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[4px] z-50 flex items-center justify-center font-black text-emerald-600 text-lg uppercase tracking-widest animate-pulse">
                  Syncing Database...
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th onClick={() => requestSort('fullName')} className="px-12 py-8 text-[10px] font-black uppercase text-gray-400 tracking-widest cursor-pointer hover:text-emerald-600 transition-colors">Guest {sortConfig.key === 'fullName' ? (sortConfig.order === 'asc' ? '↑' : '↓') : ''}</th>
                      <th className="px-12 py-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Party Size</th>
                      <th onClick={() => requestSort('totalAmount')} className="px-12 py-8 text-[10px] font-black uppercase text-gray-400 tracking-widest cursor-pointer hover:text-emerald-600 transition-colors">Investment {sortConfig.key === 'totalAmount' ? (sortConfig.order === 'asc' ? '↑' : '↓') : ''}</th>
                      <th onClick={() => requestSort('status')} className="px-12 py-8 text-[10px] font-black uppercase text-gray-400 tracking-widest cursor-pointer hover:text-emerald-600 transition-colors">Status {sortConfig.key === 'status' ? (sortConfig.order === 'asc' ? '↑' : '↓') : ''}</th>
                      <th onClick={() => requestSort('timestamp')} className="px-12 py-8 text-[10px] font-black uppercase text-gray-400 tracking-widest cursor-pointer hover:text-emerald-600 transition-colors text-right">Date {sortConfig.key === 'timestamp' ? (sortConfig.order === 'asc' ? '↑' : '↓') : ''}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredAndSortedBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-emerald-50/20 transition-colors group">
                        <td className="px-12 py-10">
                          <div className="font-black text-gray-900 text-xl mb-1">{b.fullName}</div>
                          <div className="text-xs text-gray-400 font-bold">{b.mobile} • {b.email}</div>
                        </td>
                        <td className="px-12 py-10">
                          <div className="flex gap-2">
                            <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">{b.adults} Adults</span>
                            {b.children > 0 && <span className="bg-amber-50 text-amber-700 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">{b.children} Kids</span>}
                          </div>
                        </td>
                        <td className="px-12 py-10 font-black text-gray-900 text-lg">₹{b.totalAmount.toLocaleString()}</td>
                        <td className="px-12 py-10">
                          <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] ${
                            b.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 
                            b.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-12 py-10 text-right space-x-3">
                          {b.status === 'Pending Verification' ? (
                            <>
                              <button onClick={() => updateBookingStatus(b.id, 'Verified')} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-emerald-700 transition-all shadow-xl active:scale-95">Approve</button>
                              <button onClick={() => updateBookingStatus(b.id, 'Rejected')} className="bg-gray-100 text-gray-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-rose-600 hover:text-white transition-all">Deny</button>
                            </>
                          ) : (
                            <button onClick={() => updateBookingStatus(b.id, 'Pending Verification')} className="text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-700 underline underline-offset-4">Reset Lead</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="flex justify-between items-center bg-white p-10 rounded-[48px] shadow-sm border border-gray-50">
            <div>
              <h3 className="text-3xl font-black">Content Architect</h3>
              <p className="text-gray-500 font-medium">Update the public itinerary in real-time</p>
            </div>
            <button 
              onClick={() => setEditDay({
                id: Math.random().toString(36).substr(2, 9),
                dayNumber: itinerary.length + 1,
                title: 'New Trip Chapter',
                description: 'Capture the magic of this day here...',
                imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800'
              })}
              className="bg-emerald-600 text-white px-10 py-5 rounded-[28px] font-black shadow-[0_20px_40px_rgba(5,150,105,0.2)] hover:bg-emerald-700 transition-all flex items-center space-x-3 active:scale-95"
            >
              <span>+ Add Trip Event</span>
            </button>
          </div>
          
          <div className="grid gap-8">
            {itinerary.map((day) => (
              <div key={day.id} className="bg-white p-10 rounded-[56px] shadow-sm border border-gray-50 flex flex-col md:flex-row md:items-center gap-10 group">
                <div className="w-40 h-40 bg-gray-100 rounded-[40px] overflow-hidden shrink-0 shadow-lg border-4 border-white group-hover:border-emerald-50 transition-all">
                  <img src={day.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="grow">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-emerald-50 text-emerald-900 text-[10px] font-black uppercase px-4 py-2 rounded-2xl">Day 0{day.dayNumber}</span>
                    <h4 className="font-black text-3xl group-hover:text-emerald-600 transition-colors">{day.title}</h4>
                  </div>
                  <p className="text-gray-500 font-medium leading-relaxed line-clamp-2 max-w-2xl">{day.description}</p>
                </div>
                <div className="flex space-x-4">
                  <button onClick={() => setEditDay(day)} className="px-8 py-4 bg-emerald-50 text-emerald-600 rounded-[20px] font-black text-xs hover:bg-emerald-600 hover:text-white transition-all shadow-sm">Modify</button>
                  <button onClick={() => { if(confirm('Erase this event?')) updateItinerary(itinerary.filter(d => d.id !== day.id)) }} className="px-8 py-4 bg-rose-50 text-rose-600 rounded-[20px] font-black text-xs hover:bg-rose-600 hover:text-white transition-all shadow-sm">Erase</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modern CMS Modal */}
      {editDay && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-gray-900/95 backdrop-blur-3xl">
          <div className="bg-white rounded-[72px] max-w-2xl w-full p-16 shadow-2xl animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-12">
              <h3 className="text-4xl font-black tracking-tight">Event Config</h3>
              <button onClick={() => setEditDay(null)} className="text-gray-300 hover:text-gray-900 transition-colors text-5xl font-light leading-none">&times;</button>
            </div>
            <form onSubmit={handleItinerarySave} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Sequence Order</label>
                  <input type="number" required className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 outline-none font-black text-gray-700 focus:ring-4 focus:ring-emerald-100" value={editDay.dayNumber} onChange={e => setEditDay({...editDay, dayNumber: parseInt(e.target.value)})}/>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Visual Asset URL</label>
                  <input type="url" required className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 outline-none font-bold text-gray-500 focus:ring-4 focus:ring-emerald-100" value={editDay.imageUrl} onChange={e => setEditDay({...editDay, imageUrl: e.target.value})}/>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Campaign Headline</label>
                <input type="text" required className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 outline-none font-black text-xl text-gray-900 focus:ring-4 focus:ring-emerald-100" value={editDay.title} onChange={e => setEditDay({...editDay, title: e.target.value})}/>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Copywriting / Logs</label>
                <textarea required rows={5} className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 outline-none font-medium text-gray-600 leading-relaxed focus:ring-4 focus:ring-emerald-100" value={editDay.description} onChange={e => setEditDay({...editDay, description: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="submit" className="grow bg-emerald-600 text-white font-black py-6 rounded-[28px] shadow-[0_25px_50px_-12px_rgba(5,150,105,0.4)] hover:bg-emerald-700 transition-all text-lg">Update Live Site</button>
                <button type="button" onClick={() => setEditDay(null)} className="px-12 bg-gray-100 text-gray-400 font-black py-6 rounded-[28px] hover:bg-gray-200 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
