export interface Property {
  id: string;
  name: string;
  category: 'farmhouse' | 'hotel' | 'apartment' | 'villa' | 'resort';
  price: number;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  amenities: string[];
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Offer {
  id: string;
  title: string;
  discount: string;
  image: string;
  validUntil: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
}

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Luxury Mountain Villa',
    category: 'villa',
    price: 299,
    image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800',
    location: 'Aspen, Colorado',
    rating: 4.9,
    reviews: 127,
    amenities: ['WiFi', 'Pool', 'Parking', 'Hot Tub', 'Mountain View'],
    description: 'Stunning luxury villa with breathtaking mountain views and premium amenities.',
    coordinates: { lat: 39.1911, lng: -106.8175 }
  },
  {
    id: '2',
    name: 'Cozy Farmhouse Retreat',
    category: 'farmhouse',
    price: 189,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    location: 'Tuscany, Italy',
    rating: 4.8,
    reviews: 89,
    amenities: ['WiFi', 'Garden', 'Parking', 'Pet-friendly', 'Kitchen'],
    description: 'Authentic farmhouse experience in the heart of Tuscany with organic gardens.',
    coordinates: { lat: 43.3439, lng: 11.3161 }
  },
  {
    id: '3',
    name: 'Modern City Apartment',
    category: 'apartment',
    price: 129,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    location: 'New York, NY',
    rating: 4.7,
    reviews: 203,
    amenities: ['WiFi', 'Gym', 'Parking', 'City View', 'Kitchen'],
    description: 'Stylish apartment in the heart of Manhattan with stunning city views.',
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: '4',
    name: 'Beachfront Resort Suite',
    category: 'resort',
    price: 459,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    location: 'Maldives',
    rating: 4.9,
    reviews: 156,
    amenities: ['WiFi', 'Beach Access', 'Spa', 'Pool', 'Restaurant'],
    description: 'Ultimate luxury beachfront suite with pristine ocean views and world-class amenities.',
    coordinates: { lat: 3.2028, lng: 73.2207 }
  },
  {
    id: '5',
    name: 'Boutique Hotel Room',
    category: 'hotel',
    price: 199,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
    location: 'Paris, France',
    rating: 4.6,
    reviews: 94,
    amenities: ['WiFi', 'Concierge', 'Restaurant', 'Bar', 'Room Service'],
    description: 'Elegant boutique hotel in the heart of Paris with classic French charm.',
    coordinates: { lat: 48.8566, lng: 2.3522 }
  },
  {
    id: '6',
    name: 'Lakeside Cabin',
    category: 'farmhouse',
    price: 149,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
    location: 'Lake Tahoe, CA',
    rating: 4.8,
    reviews: 76,
    amenities: ['WiFi', 'Fireplace', 'Lake Access', 'Parking', 'Pet-friendly'],
    description: 'Peaceful lakeside cabin perfect for a relaxing getaway in nature.',
    coordinates: { lat: 39.0968, lng: -120.0324 }
  }
];

export const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Early Bird Special',
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
    validUntil: '2024-12-31'
  },
  {
    id: '2',
    title: 'Weekend Getaway',
    discount: '30% OFF',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    validUntil: '2024-11-30'
  },
  {
    id: '3',
    title: 'Summer Special',
    discount: '20% OFF',
    image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=400',
    validUntil: '2024-09-30'
  }
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Farmhouses',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    count: 150
  },
  {
    id: '2',
    name: 'Hotels',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400',
    count: 320
  },
  {
    id: '3',
    name: 'Apartments',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    count: 89
  },
  {
    id: '4',
    name: 'Villas',
    image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=400',
    count: 67
  },
  {
    id: '5',
    name: 'Resorts',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
    count: 43
  }
];