
import React, { useState, useEffect } from 'react';
import { ItineraryDay, Booking } from '../types';
import { PACKAGE_PRICE_PER_ADULT, PACKAGE_PRICE_PER_CHILD, UPI_ID } from '../constants';

interface LandingPageProps {
  itinerary: ItineraryDay[];
  onBookingSubmit: (booking: Omit<Booking, 'id' | 'status' | 'timestamp'>) => void;
}

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

const LandingPage: React.FC<LandingPageProps> = ({ itinerary, onBookingSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    adults: 1,
    children: 0
  });
  const [showPayment, setShowPayment] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  // Explicitly updated to Jan 18 - Jan 22, 2026
  // Google Calendar format YYYYMMDDTHHMMSSZ. End date is exclusive.
  const calendarUrl = "https://www.google.com/calendar/render?action=TEMPLATE&text=Thailand+Group+Tour+with+Hamsika+Travels&dates=20260118T033000Z/20260123T153000Z&details=Premium+Group+Tour+Package+to+Thailand+2026.+Visit+Pattaya+and+Bangkok.+50+Adults+Group+Package.&location=Thailand";

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
            <span className="text-sm font-black tracking-widest uppercase text-white">Thailand Group Tour – January 2026</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-8 text-white drop-shadow-2xl leading-tight">
            The Ultimate <br/> <span className="text-amber-400 italic">Thai Experience</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 font-medium text-white/90 max-w-3xl mx-auto leading-relaxed">
            50 Adults | 4-Star Premium Accommodation | Private AC Coach<br/>
            <span className="text-emerald-300 font-bold">18th Jan 2026 - Departure</span>
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
                📅 Add to Calendar (Jan 18 - 22, 2026)
              </a>
            </div>
          </div>
          
          <p className="mt-12 text-sm text-white/50 italic font-medium">* Price per person. International flights not included.</p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 max-w-7xl mx-auto px-4">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Tour Highlights</h2>
          <div className="w-24 h-2 bg-emerald-600 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { icon: "🏨", title: "Luxury Stays", desc: "Mind Resort Pattaya & Season Siam Bangkok. Handpicked 4-star hotels with breakfast included.", color: "emerald" },
            { icon: "🚌", title: "Private Transfers", desc: "Premium 50-seater AC coach for the entire journey with a professional Thai guide.", color: "amber" },
            { icon: "🍛", title: "Indian Dining", desc: "Daily Indian buffet meals (Lunch & Dinner) at the finest local Indian restaurants.", color: "rose" }
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-12 rounded-[48px] hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform"></div>
              <div className="text-7xl mb-8 group-hover:scale-110 transition-transform inline-block drop-shadow-lg">{item.icon}</div>
              <h3 className="text-2xl font-black mb-4 group-hover:text-emerald-600 transition-colors">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm font-medium">{item.desc}</p>
            </div>
          ))}
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
              18 Jan 2026 - 22 Jan 2026
            </div>
          </div>
          
          <div className="space-y-32">
            {itinerary.map((day, idx) => (
              <div key={day.id} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-20 group`}>
                <div className="md:w-1/2 relative">
                  <div className="overflow-hidden rounded-[64px] shadow-2xl aspect-video border-8 border-white group-hover:border-emerald-50 transition-colors duration-500">
                    <img 
                      src={day.imageUrl} 
                      alt={day.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                    />
                  </div>
                  <div className="absolute -top-6 -left-6 md:-left-10 w-24 h-24 bg-amber-400 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-xl rotate-[-12deg] group-hover:rotate-0 transition-transform">
                    {day.dayNumber}
                  </div>
                </div>
                <div className="md:w-1/2">
                  <span className="text-emerald-600 font-black uppercase tracking-widest text-xs mb-4 block">Adventure Phase</span>
                  <h3 className="text-3xl md:text-4xl font-black mb-8 group-hover:text-emerald-600 transition-colors">{day.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-10 font-medium">{day.description}</p>
                  <div className="flex flex-wrap gap-4">
                    <span className="bg-emerald-50 text-emerald-700 px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider">Tickets Incl.</span>
                    <span className="bg-amber-50 text-amber-700 px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider">Private AC Bus</span>
                    <span className="bg-rose-50 text-rose-700 px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider">Indian Food</span>
                  </div>
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
            <div className="bg-white p-24 rounded-[72px] shadow-2xl text-center animate-fade-in-up border border-emerald-100 relative overflow-hidden">
              <ConfettiBurst />
              <div className="w-32 h-32 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full mx-auto mb-10 text-5xl animate-checkmark shadow-inner">✓</div>
              <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Booking Request Sent!</h2>
              <p className="text-gray-500 mb-12 max-w-lg mx-auto leading-relaxed text-lg font-medium relative z-10">Excellent choice! We've received the request for <strong>{formData.fullName}</strong>. Our travel concierge will verify the payment and contact you shortly.</p>
              <button onClick={() => setIsSuccess(false)} className="bg-emerald-600 text-white px-10 py-5 rounded-3xl font-black hover:bg-emerald-700 transition-all shadow-xl relative z-10 active:scale-95">Book Another Person</button>
            </div>
          ) : (
            <div className="bg-white shadow-[0_60px_120px_-20px_rgba(0,0,0,0.15)] rounded-[72px] overflow-hidden flex flex-col md:flex-row border border-gray-100">
              <div className="md:w-2/5 bg-emerald-600 p-20 text-white relative">
                <div className="absolute top-0 right-0 p-8 opacity-20 text-8xl font-black select-none">TH</div>
                <h2 className="text-4xl font-black mb-10 leading-tight">Join the 2026 Group Tour</h2>
                <div className="space-y-10 mb-16">
                  <div className="flex items-start space-x-5">
                    <div className="w-14 h-14 bg-white/20 rounded-3xl flex items-center justify-center text-2xl shrink-0">🛡️</div>
                    <div>
                      <h4 className="font-black text-lg">Fully Insured</h4>
                      <p className="text-sm opacity-80">1 Million Thai Baht coverage included for every guest.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-5">
                    <div className="w-14 h-14 bg-white/20 rounded-3xl flex items-center justify-center text-2xl shrink-0">💧</div>
                    <div>
                      <h4 className="font-black text-lg">Daily Refreshments</h4>
                      <p className="text-sm opacity-80">Fresh water bottles and local Thai snacks on board.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-20 pt-12 border-t border-white/20">
                  <p className="text-[10px] uppercase tracking-[0.3em] opacity-70 mb-4 font-black">Estimated Payment</p>
                  <p className="text-6xl font-black tracking-tighter text-amber-400">₹{totalAmount.toLocaleString()}</p>
                  <p className="text-xs mt-2 opacity-60">* Starting From ₹22,000 Per Adult</p>
                </div>
              </div>
              
              <div className="md:w-3/5 p-20 bg-white">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Full Name</label>
                      <input required type="text" className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-bold text-gray-800" placeholder="Your Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Contact Number</label>
                      <input required type="tel" className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-bold text-gray-800" placeholder="+91" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Email Address</label>
                    <input required type="email" className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-bold text-gray-800" placeholder="you@travel.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Adults (12+ Yrs)</label>
                      <select className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-emerald-100 outline-none font-black text-gray-700 cursor-pointer" value={formData.adults} onChange={e => setFormData({...formData, adults: parseInt(e.target.value)})}>
                        {[...Array(50)].map((_, i) => <option key={i+1} value={i+1}>{i+1} Adult{i > 0 ? 's' : ''}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Children (2-12 Yrs)</label>
                      <select className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-emerald-100 outline-none font-black text-gray-700 cursor-pointer" value={formData.children} onChange={e => setFormData({...formData, children: parseInt(e.target.value)})}>
                        {[...Array(21)].map((_, i) => <option key={i} value={i}>{i} Child{i !== 1 ? 'ren' : ''}</option>)}
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-7 rounded-[32px] transition-all transform hover:scale-[1.02] shadow-[0_25px_50px_-12px_rgba(5,150,105,0.4)] mt-10 text-xl tracking-tight">
                    Confirm & Proceed to Payment
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
              <div className="text-6xl font-black text-emerald-600 tracking-tighter">₹{totalAmount.toLocaleString()}</div>
            </div>
            
            <div className="bg-gray-50 p-12 rounded-[56px] mb-12 flex flex-col items-center justify-center border-4 border-dashed border-gray-100 relative group">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${UPI_ID}&pn=HamsikaTravels&am=${totalAmount}`} alt="QR" className="w-56 h-56 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
              <p className="mt-6 text-[10px] font-black text-emerald-500 uppercase tracking-widest">Scan with any UPI App</p>
            </div>
            
            <div className="bg-emerald-50 p-7 rounded-[32px] mb-12 group cursor-pointer active:scale-95 transition-all border border-emerald-100" onClick={() => {navigator.clipboard.writeText(UPI_ID); alert('UPI ID Copied!')}}>
              <p className="text-[10px] text-emerald-600 uppercase font-black mb-2 tracking-widest">Click to Copy UPI ID</p>
              <p className="text-emerald-900 font-mono font-bold text-xl">{UPI_ID}</p>
            </div>
            
            <button onClick={handlePaymentConfirm} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-7 rounded-[32px] shadow-2xl transition-all active:scale-95 text-xl">
              I Have Made the Payment
            </button>
            <p className="text-xs text-gray-400 mt-8 italic font-medium">Payment verification usually takes 2-4 hours</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
