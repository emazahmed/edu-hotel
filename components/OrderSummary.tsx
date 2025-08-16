import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, Users } from 'lucide-react-native';

interface OrderSummaryProps {
  hotelName: string;
  roomType: string;
  checkIn: string; // expected in DD/MM/YYYY
  checkOut: string; // expected in DD/MM/YYYY
  guests: number;
  pricePerNight: number;
  nights: number;
  taxes: number;
  fees: number;
  total: number;
}

export default function OrderSummary({
  hotelName,
  roomType,
  checkIn,
  checkOut,
  guests,
  pricePerNight,
  nights,
  taxes,
  fees,
  total,
}: OrderSummaryProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    // Expecting DD/MM/YYYY, convert to Date
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const subtotal = pricePerNight * nights;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{hotelName}</Text>
        <Text style={styles.roomType}>{roomType}</Text>
        
        <View style={styles.bookingDetails}>
          <View style={styles.detailItem}>
            <Calendar size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              {formatDate(checkIn)} - {formatDate(checkOut)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Users size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              {guests} {guests === 1 ? 'guest' : 'guests'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.priceBreakdown}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>
            ${pricePerNight} × {nights} {nights === 1 ? 'night' : 'nights'}
          </Text>
          <Text style={styles.priceValue}>${subtotal}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Taxes & fees</Text>
          <Text style={styles.priceValue}>${taxes + fees}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total}</Text>
        </View>
      </View>

      <View style={styles.policies}>
        <Text style={styles.policiesTitle}>Booking Policies</Text>
        <View style={styles.policyItem}>
          <View style={styles.policyDot} />
          <Text style={styles.policyText}>Free cancellation up to 24 hours before check-in</Text>
        </View>
        <View style={styles.policyItem}>
          <View style={styles.policyDot} />
          <Text style={styles.policyText}>No prepayment needed - pay at the property</Text>
        </View>
        <View style={styles.policyItem}>
          <View style={styles.policyDot} />
          <Text style={styles.policyText}>Confirmation is immediate</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  hotelInfo: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  roomType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  bookingDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  priceBreakdown: {
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
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
  policies: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  policiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  policyDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#059669',
    marginTop: 8,
    marginRight: 12,
  },
  policyText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
});