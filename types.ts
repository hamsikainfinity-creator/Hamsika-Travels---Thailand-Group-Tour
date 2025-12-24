
export type BookingStatus = 'Pending Verification' | 'Verified' | 'Rejected';

export interface Booking {
  id: string;
  itineraryId: string; // Linked to a specific package
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

export interface ItineraryPackage {
  id: string;
  startDate: string; // e.g., "2026-01-18"
  endDate: string;   // e.g., "2026-01-22"
  days: ItineraryDay[];
  isActive: boolean;
}

export interface AppState {
  bookings: Booking[];
  packages: ItineraryPackage[];
}
