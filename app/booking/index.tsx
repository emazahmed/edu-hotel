import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Users, CreditCard, X } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import CheckoutForm, { PaymentData } from '@/components/CheckoutForm';
import OrderSummary from '@/components/OrderSummary';
import PaymentSuccess from '@/components/PaymentSuccess';

// --- Date helpers ---
const formatInputDate = (text: string) => {
  let cleaned = text.replace(/\D/g, '');
  if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

  if (cleaned.length >= 5) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
  } else if (cleaned.length >= 3) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  } else {
    return cleaned;
  }
};

const parseFormattedDate = (formatted: string) => {
  const parts = formatted.split('/');
  if (parts.length !== 3) return '';
  const [day, month, year] = parts;
  if (!day || !month || !year) return '';
  return `${year}-${month}-${day}`; // ISO for Date()
};

const formatDisplayDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getTodayDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dd = String(tomorrow.getDate()).padStart(2, '0');
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const yyyy = tomorrow.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export default function BookingScreen() {
  const { user } = useAuth();
  const { addBooking } = useBooking();
  const params = useLocalSearchParams();

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState('1');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedBookingId, setCompletedBookingId] = useState('');

  const roomPrice = parseFloat((params.price as string) || '0');

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(parseFormattedDate(checkInDate));
    const end = new Date(parseFormattedDate(checkOutDate));
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => calculateNights() * roomPrice;

  const calculateTaxesAndFees = () => {
    const subtotal = calculateTotal();
    const taxes = Math.round(subtotal * 0.12);
    const fees = 25;
    return { taxes, fees, total: subtotal + taxes + fees };
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to make a booking', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/(auth)/login') },
      ]);
      return;
    }

    if (!checkInDate || !checkOutDate || !guests) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (new Date(parseFormattedDate(checkInDate)) >= new Date(parseFormattedDate(checkOutDate))) {
      Alert.alert('Error', 'Check-out date must be after check-in date');
      return;
    }

    setShowCheckout(true);
  };

  const handlePayment = async (paymentData: PaymentData) => {
    setIsProcessing(true);

    if (!user) {
      Alert.alert('Login Required', 'Please log in to make a booking', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => router.push('/(auth)/login') },
      ]);
      setIsProcessing(false);
      return;
    }

    if (new Date(parseFormattedDate(checkInDate)) < new Date()) {
      Alert.alert('Error', 'Check-in date cannot be in the past');
      setIsProcessing(false);
      return;
    }

    try {
      const { total } = calculateTaxesAndFees();
      const newBooking = {
        id: Date.now().toString(),
        userId: user.id,
        hotelId: params.hotelId as string,
        roomId: params.roomId as string,
        hotelName: params.hotelName as string,
        roomType: params.roomType as string,
        checkIn: parseFormattedDate(checkInDate),
        checkOut: parseFormattedDate(checkOutDate),
        guests: parseInt(guests),
        totalPrice: total,
        status: 'pending' as const,
        createdAt: new Date().toISOString().split('T')[0],
        userName: user.name,
        userEmail: user.email,
      };

      addBooking(newBooking);
      setCompletedBookingId(newBooking.id);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowCheckout(false);
      setShowSuccess(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
      setShowCheckout(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccessContinue = () => {
    setShowSuccess(false);
    router.push('/(tabs)/bookings');
  };

  const { taxes, fees, total } = calculateTaxesAndFees();

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

          {/* Check-in */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Check-in Date *</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color="#6B7280" />
              <TextInput
                style={styles.textInput}
                placeholder="DD/MM/YYYY"
                value={checkInDate}
                onChangeText={(text) => setCheckInDate(formatInputDate(text))}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity style={styles.dateHelper} onPress={() => setCheckInDate(getTodayDate())}>
              <Text style={styles.dateHelperText}>Use today ({formatDisplayDate(new Date().toISOString())})</Text>
            </TouchableOpacity>
          </View>

          {/* Check-out */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Check-out Date *</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color="#6B7280" />
              <TextInput
                style={styles.textInput}
                placeholder="DD/MM/YYYY"
                value={checkOutDate}
                onChangeText={(text) => setCheckOutDate(formatInputDate(text))}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity style={styles.dateHelper} onPress={() => setCheckOutDate(getTomorrowDate())}>
              <Text style={styles.dateHelperText}>Use tomorrow ({formatDisplayDate(new Date(Date.now() + 86400000).toISOString())})</Text>
            </TouchableOpacity>
          </View>

          {/* Guests */}
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
            <OrderSummary
              hotelName={params.hotelName as string}
              roomType={params.roomType as string}
              checkIn={checkInDate}
              checkOut={checkOutDate}
              guests={parseInt(guests)}
              pricePerNight={roomPrice}
              nights={calculateNights()}
              taxes={taxes}
              fees={fees}
              total={total}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.checkoutButton, (!checkInDate || !checkOutDate) && styles.checkoutButtonDisabled]}
          onPress={handleProceedToCheckout}
          disabled={!checkInDate || !checkOutDate}
        >
          <CreditCard size={20} color="#FFFFFF" />
          <Text style={styles.checkoutButtonText}>Proceed to Checkout • ${total}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Checkout Modal */}
      <Modal visible={showCheckout} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCheckout(false)} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Secure Checkout</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <CheckoutForm totalAmount={total} onSubmit={handlePayment} isLoading={isProcessing} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccess} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <PaymentSuccess
            bookingId={completedBookingId}
            hotelName={params.hotelName as string}
            roomType={params.roomType as string}
            checkIn={checkInDate}
            checkOut={checkOutDate}
            totalAmount={total}
            onContinue={handleSuccessContinue}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
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
    color: '#F9FAFB',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  roomInfo: {
    backgroundColor: '#1F2937',
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
    color: '#F9FAFB',
    marginBottom: 4,
  },
  roomPrice: {
    fontSize: 16,
    color: '#60A5FA',
    fontWeight: '600',
  },
  formSection: {
    backgroundColor: '#1F2937',
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
    color: '#F9FAFB',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4B5563',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#F9FAFB',
  },
  dateHelper: {
    marginTop: 6,
  },
  dateHelperText: {
    color: '#60A5FA',
    fontWeight: '500',
  },
  summarySection: {
    marginBottom: 24,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#111827',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  placeholder: {
    width: 32,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

});