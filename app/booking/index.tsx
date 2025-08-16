import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Users, CreditCard, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';

export default function BookingScreen() {
  const { user } = useAuth();
  const { addBooking } = useBooking();
  const params = useLocalSearchParams();
  
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const roomPrice = parseFloat(params.price as string || '0');
  
  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate) return 0;
    
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return nights * roomPrice;
  };

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleBooking = async () => {
    if (!user) {
      Alert.alert(
        'Login Required', 
        'Please log in to make a booking',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/(auth)/login') }
        ]
      );
      return;
    }

    if (!checkInDate || !checkOutDate || !guests) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      Alert.alert('Error', 'Check-out date must be after check-in date');
      return;
    }

    if (new Date(checkInDate) < new Date()) {
      Alert.alert('Error', 'Check-in date cannot be in the past');
      return;
    }

    setIsLoading(true);

    try {
      const newBooking = {
        userId: user.id,
        hotelId: params.hotelId as string,
        roomId: params.roomId as string,
        hotelName: params.hotelName as string,
        roomType: params.roomType as string,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: parseInt(guests),
        totalPrice: calculateTotal(),
        status: 'pending' as const,
        userName: user.name,
        userEmail: user.email,
      };

      addBooking(newBooking);

      Alert.alert(
        'Booking Successful!',
        'Your booking has been submitted and is pending confirmation.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)/bookings')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#2563EB" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Book Room</Text>
          <Text style={styles.headerSubtitle}>{params.hotelName}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.roomInfo}>
          <Text style={styles.roomTitle}>{params.roomType}</Text>
          <Text style={styles.roomPrice}>${params.price} per night</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Check-in Date *</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color="#6B7280" />
              <TextInput
                style={styles.textInput}
                placeholder="YYYY-MM-DD"
                value={checkInDate}
                onChangeText={setCheckInDate}
              />
            </View>
            <TouchableOpacity 
              style={styles.dateHelper}
              onPress={() => setCheckInDate(getTodayDate())}
            >
              <Text style={styles.dateHelperText}>Use today ({formatDate(getTodayDate())})</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Check-out Date *</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color="#6B7280" />
              <TextInput
                style={styles.textInput}
                placeholder="YYYY-MM-DD"
                value={checkOutDate}
                onChangeText={setCheckOutDate}
              />
            </View>
            <TouchableOpacity 
              style={styles.dateHelper}
              onPress={() => setCheckOutDate(getTomorrowDate())}
            >
              <Text style={styles.dateHelperText}>Use tomorrow ({formatDate(getTomorrowDate())})</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Number of Guests *</Text>
            <View style={styles.inputContainer}>
              <Users size={20} color="#6B7280" />
              <TextInput
                style={styles.textInput}
                placeholder="1"
                value={guests}
                onChangeText={setGuests}
                keyboardType="numeric"
                maxLength={1}
              />
            </View>
          </View>
        </View>

        {checkInDate && checkOutDate && (
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Booking Summary</Text>
            
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Check-in</Text>
                <Text style={styles.summaryValue}>{formatDate(checkInDate)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Check-out</Text>
                <Text style={styles.summaryValue}>{formatDate(checkOutDate)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Nights</Text>
                <Text style={styles.summaryValue}>{calculateNights()}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Guests</Text>
                <Text style={styles.summaryValue}>{guests}</Text>
              </View>
              
              <View style={styles.summaryDivider} />
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Room rate</Text>
                <Text style={styles.summaryValue}>${roomPrice} × {calculateNights()} nights</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${calculateTotal()}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          
          <View style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <CreditCard size={20} color="#6B7280" />
              <Text style={styles.paymentTitle}>Mock Payment</Text>
            </View>
            <Text style={styles.paymentDescription}>
              This is a demo app. No actual payment will be processed.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bookButton, isLoading && styles.bookButtonDisabled]}
          onPress={handleBooking}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.bookButtonText}>Processing...</Text>
          ) : (
            <>
              <CheckCircle size={20} color="#FFFFFF" />
              <Text style={styles.bookButtonText}>
                Confirm Booking • ${calculateTotal()}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  roomInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  roomPrice: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  dateHelper: {
    marginTop: 6,
  },
  dateHelperText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
  summarySection: {
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  paymentSection: {
    marginBottom: 24,
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentTitle: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  paymentDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  bookButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});