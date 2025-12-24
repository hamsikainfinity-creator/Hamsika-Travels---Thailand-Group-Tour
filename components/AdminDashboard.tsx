
import React, { useState, useMemo } from 'react';
import { Booking, ItineraryPackage, ItineraryDay, BookingStatus } from '../types';

interface AdminDashboardProps {
  bookings: Booking[];
  packages: ItineraryPackage[];
  updateBookings: (bookings: Booking[]) => void;
  updatePackages: (packages: ItineraryPackage[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  bookings, 
  packages, 
  updateBookings, 
  updatePackages 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'itineraries'>('itineraries');
  const [selectedPkg, setSelectedPkg] = useState<ItineraryPackage | null>(null);
  const [editDay, setEditDay] = useState<{pkgId: string, day: ItineraryDay} | null>(null);
  const [showDateModal, setShowDateModal] = useState<ItineraryPackage | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Basam@2212') setIsAuthenticated(true);
    else alert('Access Denied');
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    updateBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleDuplicate = (pkg: ItineraryPackage) => {
    const newDate = prompt("Enter new Start Date (YYYY-MM-DD)", pkg.startDate);
    if (!newDate) return;
    
    // Simple 4-day offset logic for end date placeholder
    const end = new Date(newDate);
    end.setDate(end.getDate() + 4);
    const newEndDate = end.toISOString().split('T')[0];

    const newPkg: ItineraryPackage = {
      ...pkg,
      id: Math.random().toString(36).substr(2, 9),
      startDate: newDate,
      endDate: newEndDate,
      isActive: false,
      days: pkg.days.map(d => ({ ...d, id: Math.random().toString(36).substr(2, 5) }))
    };

    updatePackages([...packages, newPkg]);
    alert('Itinerary Duplicated Successfully!');
  };

  const handleDelete = (pkgId: string) => {
    if (packages.length <= 1) return alert("Must have at least one itinerary.");
    if (confirm("Permanently delete this itinerary? This action cannot be undone.")) {
      updatePackages(packages.filter(p => p.id !== pkgId));
    }
  };

  const handleChangeDate = (pkgId: string, start: string, end: string) => {
    updatePackages(packages.map(p => p.id === pkgId ? { ...p, startDate: start, endDate: end } : p));
    setShowDateModal(null);
  };

  const setActive = (pkgId: string) => {
    updatePackages(packages.map(p => ({ ...p, isActive: p.id === pkgId })));
  };

  const handleDaySave = (pkgId: string, day: ItineraryDay) => {
    updatePackages(packages.map(p => {
      if (p.id !== pkgId) return p;
      const exists = p.days.find(d => d.id === day.id);
      return {
        ...p,
        days: exists 
          ? p.days.map(d => d.id === day.id ? day : d)
          : [...p.days, day].sort((a,b) => a.dayNumber - b.dayNumber)
      };
    }));
    setEditDay(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-14 rounded-[56px] shadow-2xl animate-fade-in-up border border-gray-100">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-emerald-600 text-white flex items-center justify-center rounded-[32px] text-4xl font-black mx-auto mb-8 shadow-xl">HT</div>
            <h2 className="text-3xl font-black text-gray-900">Admin Control</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-8">
            <input 
              type="password" 
              className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 outline-none font-black text-center" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            <button className="w-full bg-gray-900 text-white font-black py-6 rounded-3xl hover:bg-emerald-600 transition-all text-lg shadow-xl">Unlock</button>
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
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Production Dashboard v2.0</p>
        </div>
        <div className="flex space-x-3 bg-gray-100/50 p-2.5 rounded-[32px]">
          <button onClick={() => setActiveTab('itineraries')} className={`px-10 py-4 rounded-[24px] text-xs font-black uppercase transition-all ${activeTab === 'itineraries' ? 'bg-white shadow-xl text-emerald-600' : 'text-gray-400'}`}>Packages</button>
          <button onClick={() => setActiveTab('leads')} className={`px-10 py-4 rounded-[24px] text-xs font-black uppercase transition-all ${activeTab === 'leads' ? 'bg-white shadow-xl text-emerald-600' : 'text-gray-400'}`}>Leads</button>
        </div>
      </div>

      {activeTab === 'itineraries' ? (
        <div className="space-y-10">
          <div className="grid gap-8">
            {packages.map(pkg => (
              <div key={pkg.id} className={`bg-white p-10 rounded-[56px] shadow-sm border-2 transition-all ${pkg.isActive ? 'border-emerald-500 shadow-emerald-100' : 'border-gray-50'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-black text-gray-900">{pkg.startDate} to {pkg.endDate}</span>
                      {pkg.isActive && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active Live</span>}
                    </div>
                    <p className="text-gray-400 text-sm font-medium">{pkg.days.length} Activity Days Planned</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {!pkg.isActive && <button onClick={() => setActive(pkg.id)} className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl font-black text-xs hover:bg-emerald-600 hover:text-white transition-all">Make Active</button>}
                    <button onClick={() => setShowDateModal(pkg)} className="bg-amber-50 text-amber-600 px-6 py-3 rounded-2xl font-black text-xs hover:bg-amber-600 hover:text-white transition-all">Change Date</button>
                    <button onClick={() => handleDuplicate(pkg)} className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-black text-xs hover:bg-blue-600 hover:text-white transition-all">Duplicate</button>
                    <button onClick={() => handleDelete(pkg.id)} className="bg-rose-50 text-rose-600 px-6 py-3 rounded-2xl font-black text-xs hover:bg-rose-600 hover:text-white transition-all">Delete</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pkg.days.map(day => (
                    <div key={day.id} className="bg-gray-50 p-6 rounded-[32px] group relative overflow-hidden">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-emerald-600 shadow-sm">{day.dayNumber}</span>
                        <h4 className="font-bold text-gray-800 line-clamp-1">{day.title}</h4>
                      </div>
                      <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-4">{day.description}</p>
                      <button onClick={() => setEditDay({pkgId: pkg.id, day})} className="w-full bg-white border border-gray-200 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-emerald-600 hover:text-emerald-600 transition-all">Edit Content</button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setEditDay({ pkgId: pkg.id, day: { id: Math.random().toString(36).substr(2, 5), dayNumber: pkg.days.length + 1, title: '', description: '', imageUrl: '' } })}
                    className="border-4 border-dashed border-gray-100 rounded-[32px] flex flex-col items-center justify-center p-8 text-gray-300 hover:text-emerald-400 hover:border-emerald-100 transition-all group"
                  >
                    <span className="text-4xl mb-2 group-hover:scale-125 transition-transform">+</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Add Day</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[56px] shadow-xl overflow-hidden border border-gray-50">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-12 py-8 text-[10px] font-black uppercase text-gray-400">Guest</th>
                  <th className="px-12 py-8 text-[10px] font-black uppercase text-gray-400">Date/ID</th>
                  <th className="px-12 py-8 text-[10px] font-black uppercase text-gray-400">Amount</th>
                  <th className="px-12 py-8 text-[10px] font-black uppercase text-gray-400">Status</th>
                  <th className="px-12 py-8 text-[10px] font-black uppercase text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-12 py-8 font-black text-gray-900">{b.fullName}</td>
                    <td className="px-12 py-8 text-xs text-gray-400">{b.itineraryId}</td>
                    <td className="px-12 py-8 font-black text-emerald-600">₹{b.totalAmount.toLocaleString()}</td>
                    <td className="px-12 py-8">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        b.status === 'Verified' ? 'bg-green-100 text-green-700' : b.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>{b.status}</span>
                    </td>
                    <td className="px-12 py-8 text-right space-x-2">
                      <button onClick={() => updateBookingStatus(b.id, 'Verified')} className="text-emerald-500 font-black text-[10px] uppercase hover:underline">Verify</button>
                      <button onClick={() => updateBookingStatus(b.id, 'Rejected')} className="text-rose-500 font-black text-[10px] uppercase hover:underline">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Date Change Modal */}
      {showDateModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-gray-900/90 backdrop-blur-xl">
          <div className="bg-white rounded-[64px] max-w-lg w-full p-16 shadow-2xl animate-fade-in-up">
            <h3 className="text-3xl font-black mb-8">Update Schedule</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Start Date</label>
                <input id="new-start" type="date" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold" defaultValue={showDateModal.startDate}/>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">End Date</label>
                <input id="new-end" type="date" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold" defaultValue={showDateModal.endDate}/>
              </div>
              <div className="flex gap-4 pt-6">
                <button 
                  onClick={() => handleChangeDate(showDateModal.id, (document.getElementById('new-start') as HTMLInputElement).value, (document.getElementById('new-end') as HTMLInputElement).value)} 
                  className="grow bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-emerald-700 transition-all"
                >Save Dates</button>
                <button onClick={() => setShowDateModal(null)} className="px-10 bg-gray-100 text-gray-400 font-black py-5 rounded-2xl">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Day Edit Modal */}
      {editDay && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-gray-900/90 backdrop-blur-xl">
          <div className="bg-white rounded-[64px] max-w-2xl w-full p-16 shadow-2xl animate-fade-in-up">
            <h3 className="text-3xl font-black mb-10">Day {editDay.day.dayNumber} Details</h3>
            <div className="space-y-8">
              <input type="text" className="w-full px-8 py-5 rounded-3xl bg-gray-50 outline-none font-black text-xl" placeholder="Headline" defaultValue={editDay.day.title} id="edit-title"/>
              <textarea rows={4} className="w-full px-8 py-5 rounded-3xl bg-gray-50 outline-none font-medium leading-relaxed" placeholder="Activities Description" defaultValue={editDay.day.description} id="edit-desc" />
              <input type="url" className="w-full px-8 py-5 rounded-3xl bg-gray-50 outline-none font-bold text-gray-500" placeholder="Image URL" defaultValue={editDay.day.imageUrl} id="edit-img"/>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleDaySave(editDay.pkgId, { ...editDay.day, title: (document.getElementById('edit-title') as HTMLInputElement).value, description: (document.getElementById('edit-desc') as HTMLTextAreaElement).value, imageUrl: (document.getElementById('edit-img') as HTMLInputElement).value })}
                  className="grow bg-emerald-600 text-white font-black py-5 rounded-3xl shadow-xl"
                >Save Day Content</button>
                <button onClick={() => setEditDay(null)} className="px-12 bg-gray-100 text-gray-500 font-black py-5 rounded-3xl">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
