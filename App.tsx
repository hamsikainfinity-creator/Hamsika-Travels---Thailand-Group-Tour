
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import { Booking, ItineraryDay } from './types';
import { INITIAL_ITINERARY } from './constants';

const apiService = {
  fetchBookings: async (): Promise<Booking[]> => {
    await new Promise(r => setTimeout(r, 800));
    const data = localStorage.getItem('hamsika_bookings');
    return data ? JSON.parse(data) : [];
  },
  saveBookings: async (bookings: Booking[]): Promise<void> => {
    await new Promise(r => setTimeout(r, 500));
    localStorage.setItem('hamsika_bookings', JSON.stringify(bookings));
  },
  fetchItinerary: async (): Promise<ItineraryDay[]> => {
    await new Promise(r => setTimeout(r, 600));
    const data = localStorage.getItem('hamsika_itinerary');
    return data ? JSON.parse(data) : INITIAL_ITINERARY;
  },
  saveItinerary: async (itinerary: ItineraryDay[]): Promise<void> => {
    await new Promise(r => setTimeout(r, 500));
    localStorage.setItem('hamsika_itinerary', JSON.stringify(itinerary));
  }
};

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [b, i] = await Promise.all([
          apiService.fetchBookings(),
          apiService.fetchItinerary()
        ]);
        setBookings(b);
        setItinerary(i);
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleUpdateBookings = async (newBookings: Booking[]) => {
    setBookings(newBookings);
    await apiService.saveBookings(newBookings);
  };

  const handleUpdateItinerary = async (newItinerary: ItineraryDay[]) => {
    setItinerary(newItinerary);
    await apiService.saveItinerary(newItinerary);
  };

  const handleBookingSubmit = async (booking: Omit<Booking, 'id' | 'status' | 'timestamp'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pending Verification',
      timestamp: Date.now(),
    };
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    await apiService.saveBookings(updated);
  };

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="bg-emerald-600 text-white w-10 h-10 flex items-center justify-center rounded-xl font-bold shadow-lg transform group-hover:rotate-12 transition-transform">
              HT
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800 tracking-tight">Hamsika Travels</span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Premium Thailand Tours</span>
            </div>
          </div>
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className="px-6 py-2 rounded-full text-sm font-bold border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            {isAdmin ? 'Back to Site' : 'Admin Login'}
          </button>
        </div>
      </nav>

      <main className="pt-20">
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
              <div className="mt-4 text-emerald-600 font-bold animate-pulse">Syncing with Server...</div>
            </div>
          </div>
        ) : isAdmin ? (
          <AdminDashboard 
            bookings={bookings} 
            itinerary={itinerary}
            updateBookings={handleUpdateBookings}
            updateItinerary={handleUpdateItinerary}
          />
        ) : (
          <LandingPage 
            itinerary={itinerary} 
            onBookingSubmit={handleBookingSubmit} 
          />
        )}
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-emerald-600 text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold">HT</div>
            <span className="text-lg font-bold">Hamsika Travels</span>
          </div>
          <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
            Crafting unforgettable group journeys to Thailand. Licensed, insured, and dedicated to your premium travel experience.
          </p>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>&copy; 2026 Hamsika Travels. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
