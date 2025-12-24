
import { ItineraryDay } from './types';

export const INITIAL_ITINERARY: ItineraryDay[] = [
  {
    id: '1',
    dayNumber: 1,
    title: 'Arrival & Tiger Park Adventure',
    description: 'Transfer from Bangkok Airport to Pattaya Hotel. Visit Tiger Park (Medium Tiger). Includes Entry Tickets + Private Transfers. Lunch & Dinner at Nearest Indian Restaurant (Pattaya).',
    imageUrl: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    dayNumber: 2,
    title: 'Coral Island Getaway',
    description: 'Coral Island Tour by Speed Boat. Includes Lunch + Private Land Transfer. Water Sports Excluded. Dinner at Nearest Indian Restaurant (Pattaya).',
    imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    dayNumber: 3,
    title: 'Bangkok City Tour',
    description: 'Transfer to Bangkok Hotel. Enroute City Tour: Golden Buddha, Marble Buddha, and Gems Gallery. Includes Tickets + Private Transfers. Lunch & Dinner at Indian Restaurant (Bangkok).',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579367?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    dayNumber: 4,
    title: 'Safari World & Marine Park',
    description: 'A full day of adventure at Safari World & Marine Park. Includes Tickets + Private Transfers. Lunch Included. Dinner at Indian Restaurant (Bangkok).',
    imageUrl: 'https://images.unsplash.com/photo-1583499871881-49657682245b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    dayNumber: 5,
    title: 'Farewell Bangkok',
    description: 'Enjoy your final breakfast before transferring from Bangkok Hotel to Bangkok Airport for your departure.',
    imageUrl: 'https://images.unsplash.com/photo-1563910627449-33f90a00d0be?auto=format&fit=crop&q=80&w=800'
  }
];

export const PACKAGE_PRICE_PER_ADULT = 22000;
export const PACKAGE_PRICE_PER_CHILD = 15000;
export const UPI_ID = '9493936084@upi';
