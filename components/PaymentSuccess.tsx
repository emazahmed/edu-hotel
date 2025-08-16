import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import { CircleCheck as CheckCircle, Calendar, Mail, Phone, X } from 'lucide-react-native';
import { router } from 'expo-router';

interface PaymentSuccessProps {
  bookingId: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  onContinue: () => void;
}

export default function PaymentSuccess({
  bookingId,
  hotelName,
  roomType,
  checkIn,
  checkOut,
  totalAmount,
  onContinue,
}: PaymentSuccessProps) {
  const navigation = useNavigation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.push('/(tabs)/bookings')}
      >
        <X size={24} color="#374151" />
      </TouchableOpacity>

      <View style={styles.successIcon}>
        <CheckCircle size={64} color="#059669" />
      </View>
      
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.subtitle}>
        Your booking has been confirmed and you'll receive a confirmation email shortly.
      </Text>

      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <Text style={styles.bookingId}>Booking #{bookingId}</Text>
          <View style={styles.statusBadge}>
            <CheckCircle size={14} color="#059669" />
            <Text style={styles.statusText}>Confirmed</Text>
          </View>
        </View>
        
        <Text style={styles.hotelName}>{hotelName}</Text>
        <Text style={styles.roomType}>{roomType}</Text>
        
        <View style={styles.bookingDetails}>
          <View style={styles.detailItem}>
            <Calendar size={16} color="#6B7280" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Check-in</Text>
              <Text style={styles.detailValue}>{formatDate(checkIn)}</Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <Calendar size={16} color="#6B7280" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Check-out</Text>
              <Text style={styles.detailValue}>{formatDate(checkOut)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Paid</Text>
          <Text style={styles.totalAmount}>${totalAmount}</Text>
        </View>
      </View>

      <View style={styles.nextSteps}>
        <Text style={styles.nextStepsTitle}>What's Next?</Text>
        
        <View style={styles.stepItem}>
          <Mail size={16} color="#2563EB" />
          <Text style={styles.stepText}>
            Check your email for booking confirmation and details
          </Text>
        </View>
        
        <View style={styles.stepItem}>
          <Phone size={16} color="#2563EB" />
          <Text style={styles.stepText}>
            The hotel will contact you 24 hours before check-in
          </Text>
        </View>
        
        <View style={styles.stepItem}>
          <Calendar size={16} color="#2563EB" />
          <Text style={styles.stepText}>
            View your booking anytime in the "My Bookings" tab
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
        <Text style={styles.continueButtonText}>View My Bookings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  successIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  bookingCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  hotelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  roomType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  bookingDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailContent: {
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  nextSteps: {
    width: '100%',
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#00afb9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: { 
    position: 'absolute',
    top: 20,
    right: 20, 
    zIndex: 10 },
});