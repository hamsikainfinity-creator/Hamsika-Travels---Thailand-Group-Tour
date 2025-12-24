
import React, { useState, useEffect } from 'react';
import { Booking, ItineraryPackage } from '../types';
import { PACKAGE_PRICE_PER_ADULT, PACKAGE_PRICE_PER_CHILD, UPI_ID } from '../constants';

interface LandingPageProps {
  itineraryPackage: ItineraryPackage;
  onBookingSubmit: (booking: Omit<Booking, 'id' | 'status' | 'timestamp' | 'itineraryId'>) => void;
}

const formatDateShort = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const formatDateLong = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const ConfettiBurst = () => {
  const [pieces, setPieces] = useState<any[]>([]);
  
  useEffect(() => {
    const colors = ['#059669', '#10b981', '#f59e0b', '#d97706', '#8b5cf6'];
    const newPieces = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2 + 's',
      duration: 2 + Math.random() * 2 + 's'
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[60px]">
      {pieces.map(p => (
        <div 
          key={p.id} 
          className="confetti" 
          style={{ 
            left: p.left, 
            backgroundColor: p.color, 
            animationDelay: p.delay,
            animationDuration: p.duration
          }}
        />
      ))}
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ itineraryPackage, onBookingSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    adults: 1,
    children: 0
  });
  const [showPayment, setShowPayment] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { startDate, endDate, days } = itineraryPackage;
  const totalAmount = (formData.adults * PACKAGE_PRICE_PER_ADULT) + (formData.children * PACKAGE_PRICE_PER_CHILD);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePaymentConfirm = () => {
    onBookingSubmit({ ...formData, totalAmount });
    setIsSuccess(true);
    setShowPayment(false);
  };

  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=Thailand+Group+Tour+with+Hamsika+Travels&dates=${startDate.replace(/-/g, '')}T090000Z/${endDate.replace(/-/g, '')}T210000Z&details=Premium+Group+Tour+Package+to+Thailand.+Visit+Pattaya+and+Bangkok.&location=Thailand`;

  const scrollToBooking = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('booking');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="overflow-hidden bg-gray-50">
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="hero-image-container">
          <div className="hero-image hero-zoom"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in-up">
          <div className="mb-8 inline-flex items-center space-x-2 bg-emerald-600/30 backdrop-blur-md px-6 py-2 rounded-full border border-emerald-400/40">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
            <span className="text-sm font-black tracking-widest uppercase text-white">Thailand Group Tour – {new Date(startDate).getFullYear()}</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-8 text-white drop-shadow-2xl leading-tight">
            The Ultimate <br/> <span className="text-amber-400 italic">Thai Experience</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 font-medium text-white/90 max-w-3xl mx-auto leading-relaxed">
            50 Adults | 4-Star Premium Accommodation | Private AC Coach<br/>
            <span className="text-emerald-300 font-bold">{formatDateLong(startDate)} - Departure</span>
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="bg-white/10 backdrop-blur-xl px-12 py-6 rounded-[32px] border border-white/20 shadow-2xl transform hover:scale-105 transition-all">
              <span className="block text-xs uppercase tracking-[0.2em] text-white/70 mb-2 font-black">Starting From</span>
              <span className="text-5xl font-black text-amber-400 tracking-tighter">₹22,000</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <a 
                href="#booking" 
                onClick={scrollToBooking}
                className="bg-emerald-600 text-white hover:bg-emerald-500 px-14 py-6 rounded-[32px] font-black text-xl transition-all shadow-[0_20px_50px_rgba(5,150,105,0.3)] active:scale-95"
              >
                Book My Spot
              </a>
              <a 
                href={calendarUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors font-bold text-sm flex items-center justify-center gap-2"
              >
                📅 Add to Calendar ({formatDateShort(startDate)} - {formatDateShort(endDate)})
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section className="bg-white py-32 px-4" id="itinerary">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 px-4 gap-6">
            <div className="animate-fade-in-up">
              <span className="text-emerald-600 font-black uppercase tracking-widest text-sm mb-4 block">The Plan</span>
              <h2 className="text-5xl font-black mb-4">Detailed Itinerary</h2>
              <p className="text-gray-500 font-medium">Your 5-day escape roadmap to the Land of Smiles</p>
            </div>
            <div className="bg-amber-50 text-amber-600 px-8 py-4 rounded-3xl font-black text-sm tracking-widest uppercase border border-amber-100">
              {formatDateShort(startDate)} - {formatDateShort(endDate)}
            </div>
          </div>
          
          <div className="space-y-32">
            {days.map((day, idx) => (
              <div key={day.id} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-20 group`}>
                <div className="md:w-1/2 relative">
                  <div className="overflow-hidden rounded-[64px] shadow-2xl aspect-video border-8 border-white group-hover:border-emerald-50 transition-colors duration-500">
                    <img src={day.imageUrl} alt={day.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"/>
                  </div>
                  <div className="absolute -top-6 -left-6 md:-left-10 w-24 h-24 bg-amber-400 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-xl rotate-[-12deg] group-hover:rotate-0 transition-transform">
                    {day.dayNumber}
                  </div>
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-3xl md:text-4xl font-black mb-8 group-hover:text-emerald-600 transition-colors">{day.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-10 font-medium">{day.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-32 px-4 relative overflow-hidden bg-gray-50" id="booking">
        <div className="max-w-6xl mx-auto relative z-10">
          {isSuccess ? (
            <div className="bg-white p-24 rounded-[72px] shadow-2xl text-center border border-emerald-100 relative overflow-hidden">
              <ConfettiBurst />
              <div className="w-32 h-32 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full mx-auto mb-10 text-5xl animate-checkmark shadow-inner">✓</div>
              <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight text-center">Booking Received!</h2>
              <button onClick={() => setIsSuccess(false)} className="bg-emerald-600 text-white px-10 py-5 rounded-3xl font-black hover:bg-emerald-700 transition-all shadow-xl relative z-10">Back to Top</button>
            </div>
          ) : (
            <div className="bg-white shadow-2xl rounded-[72px] overflow-hidden flex flex-col md:flex-row border border-gray-100">
              <div className="md:w-2/5 bg-emerald-600 p-20 text-white relative">
                <h2 className="text-4xl font-black mb-10 leading-tight">Join the {new Date(startDate).getFullYear()} Group Tour</h2>
                <p className="opacity-80 mb-10">Confirm your spot for the {formatDateLong(startDate)} departure. 50 Adults maximum capacity.</p>
                <div className="mt-20 pt-12 border-t border-white/20">
                  <p className="text-[10px] uppercase tracking-[0.3em] opacity-70 mb-4 font-black">Estimated Payment</p>
                  <p className="text-6xl font-black tracking-tighter text-amber-400">₹{totalAmount.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="md:w-3/5 p-20 bg-white">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Full Name</label>
                      <input required type="text" className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-bold" placeholder="Your Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Contact</label>
                      <input required type="tel" className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-bold" placeholder="+91" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Email Address</label>
                    <input required type="email" className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-bold" placeholder="you@travel.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Adults</label>
                      <select className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-emerald-100 outline-none font-black text-gray-700" value={formData.adults} onChange={e => setFormData({...formData, adults: parseInt(e.target.value)})}>
                        {[...Array(50)].map((_, i) => <option key={i+1} value={i+1}>{i+1} Adult{i > 0 ? 's' : ''}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Children</label>
                      <select className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-emerald-100 outline-none font-black text-gray-700" value={formData.children} onChange={e => setFormData({...formData, children: parseInt(e.target.value)})}>
                        {[...Array(21)].map((_, i) => <option key={i} value={i}>{i} Child{i !== 1 ? 'ren' : ''}</option>)}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-7 rounded-[32px] transition-all transform hover:scale-[1.02] shadow-xl mt-10 text-xl">
                    Proceed to Payment
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/90 backdrop-blur-2xl">
          <div className="bg-white rounded-[64px] max-w-lg w-full p-16 text-center animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-black text-emerald-900">Secure Checkout</span>
              <button onClick={() => setShowPayment(false)} className="text-gray-300 hover:text-gray-600 transition-colors text-4xl font-light">&times;</button>
            </div>
            <div className="mb-12">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Amount to Pay</p>
              <div className="text-6xl font-black text-emerald-600">₹{totalAmount.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 p-12 rounded-[56px] mb-12 flex flex-col items-center justify-center border-4 border-dashed border-gray-100">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${UPI_ID}&pn=HamsikaTravels&am=${totalAmount}`} alt="QR" className="w-56 h-56 mix-blend-multiply" />
            </div>
            <button onClick={handlePaymentConfirm} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-7 rounded-[32px] shadow-2xl active:scale-95 text-xl transition-all">
              I Have Made the Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
