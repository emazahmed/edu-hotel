import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking } from '@/types';
import { mockBookings } from '@/data/mockData';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  getUserBookings: (userId: string) => Booking[];
  getAllBookings: () => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
  const newBooking: Booking = {
    ...bookingData,
    id: Date.now().toString(), // or uuid()
    createdAt: new Date().toISOString(),
  };
  setBookings(prev => [...prev, newBooking]);
};


  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      )
    );
  };

  const getUserBookings = (userId: string) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  const getAllBookings = () => {
    return bookings;
  };

  return (
    <BookingContext.Provider value={{ 
      bookings, 
      addBooking, 
      updateBookingStatus, 
      getUserBookings, 
      getAllBookings 
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};