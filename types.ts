
export type BookingStatus = 'Pending Verification' | 'Verified' | 'Rejected';

export interface Booking {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  adults: number;
  children: number;
  totalAmount: number;
  status: BookingStatus;
  timestamp: number;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface AppState {
  bookings: Booking[];
  itinerary: ItineraryDay[];
}
