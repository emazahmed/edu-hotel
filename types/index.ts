export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  image: string;
  description: string;
  amenities: string[];
  pricePerNight: number;
}

export interface Room {
  id: string;
  hotelId: string;
  type: string;
  capacity: number;
  price: number;
  amenities: string[];
  images: string[];
  available: boolean;
  description: string;
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  hotelName: string;
  roomType: string;
  userName: string;
  userEmail: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isAdmin: boolean;
}