import { Hotel, Room, Booking, User } from '@/types';

export const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Grand Palace Hotel',
    location: 'New York City',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
    description: 'Luxurious hotel in the heart of Manhattan with world-class amenities.',
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar'],
    pricePerNight: 299,
  },
  {
    id: '2',
    name: 'Ocean View Resort',
    location: 'Miami Beach',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg',
    description: 'Beachfront resort with stunning ocean views and tropical atmosphere.',
    amenities: ['WiFi', 'Beach Access', 'Pool', 'Restaurant', 'Water Sports'],
    pricePerNight: 199,
  },
  {
    id: '3',
    name: 'Mountain Lodge',
    location: 'Colorado',
    rating: 4.4,
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
    description: 'Cozy mountain retreat perfect for outdoor enthusiasts.',
    amenities: ['WiFi', 'Fireplace', 'Hiking Trails', 'Restaurant', 'Ski Access'],
    pricePerNight: 159,
  },
];

export const mockRooms: Room[] = [
  {
    id: '1',
    hotelId: '1',
    type: 'Deluxe Suite',
    capacity: 2,
    price: 399,
    amenities: ['King Bed', 'City View', 'Minibar', 'Bathtub', 'Work Desk'],
    images: [
      'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
      'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg',
    ],
    available: true,
    description: 'Spacious suite with panoramic city views and premium amenities.',
  },
  {
    id: '2',
    hotelId: '1',
    type: 'Standard Room',
    capacity: 2,
    price: 299,
    amenities: ['Queen Bed', 'WiFi', 'TV', 'Air Conditioning', 'Coffee Maker'],
    images: [
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
    ],
    available: true,
    description: 'Comfortable standard room with modern amenities.',
  },
  {
    id: '3',
    hotelId: '2',
    type: 'Ocean View Suite',
    capacity: 4,
    price: 299,
    amenities: ['Ocean View', 'Balcony', 'Two Beds', 'Kitchenette', 'Living Area'],
    images: [
      'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg',
    ],
    available: true,
    description: 'Beautiful suite with direct ocean views and spacious balcony.',
  },
];

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  isAdmin: false,
};

export const mockAdmin: User = {
  id: 'admin',
  name: 'Admin User',
  email: 'admin@hotel.com',
  phone: '+1 (555) 000-0000',
  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
  isAdmin: true,
};

export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    hotelId: '1',
    roomId: '1',
    checkIn: '2024-01-15',
    checkOut: '2024-01-18',
    guests: 2,
    totalPrice: 1197,
    status: 'confirmed',
    createdAt: '2024-01-10',
    hotelName: 'Grand Palace Hotel',
    roomType: 'Deluxe Suite',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
  },
  {
    id: '2',
    userId: '1',
    hotelId: '2',
    roomId: '3',
    checkIn: '2024-02-20',
    checkOut: '2024-02-25',
    guests: 3,
    totalPrice: 1495,
    status: 'pending',
    createdAt: '2024-01-12',
    hotelName: 'Ocean View Resort',
    roomType: 'Ocean View Suite',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
  },
];