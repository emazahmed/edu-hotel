import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CreditCard, User, Mail, MapPin, Lock, Calendar, CircleCheck as CheckCircle } from 'lucide-react-native';

interface CheckoutFormProps {
  totalAmount: number;
  onSubmit: (paymentData: PaymentData) => void;
  isLoading: boolean;
}

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function CheckoutForm({ totalAmount, onSubmit, isLoading }: CheckoutFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [formData, setFormData] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('billingAddress.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      handleInputChange('cardNumber', formatted);
    }
  };

  const handleExpiryChange = (value: string) => {
    const formatted = formatExpiryDate(value);
    if (formatted.length <= 5) {
      handleInputChange('expiryDate', formatted);
    }
  };

  const validateForm = () => {
    if (paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
        Alert.alert('Error', 'Please fill in all payment details');
        return false;
      }

      if (formData.cardNumber.replace(/\s/g, '').length < 13) {
        Alert.alert('Error', 'Please enter a valid card number');
        return false;
      }

      if (formData.cvv.length < 3) {
        Alert.alert('Error', 'Please enter a valid CVV');
        return false;
      }
    }

    const { street, city, state, zipCode } = formData.billingAddress;
    if (!street || !city || !state || !zipCode) {
      Alert.alert('Error', 'Please fill in all billing address fields');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const fillDemoData = () => {
    setFormData({
      cardNumber: '4532 1234 5678 9012',
      expiryDate: '12/28',
      cvv: '123',
      cardholderName: 'John Doe',
      billingAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        
        <View style={styles.paymentMethods}>
          <TouchableOpacity
            style={[
              styles.paymentMethodButton,
              paymentMethod === 'card' && styles.activePaymentMethod
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <CreditCard size={20} color={paymentMethod === 'card' ? '#2563EB' : '#6B7280'} />
            <Text style={[
              styles.paymentMethodText,
              paymentMethod === 'card' && styles.activePaymentMethodText
            ]}>
              Credit Card
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.paymentMethodButton,
              paymentMethod === 'paypal' && styles.activePaymentMethod
            ]}
            onPress={() => setPaymentMethod('paypal')}
          >
            <View style={styles.paypalIcon}>
              <Text style={styles.paypalText}>PP</Text>
            </View>
            <Text style={[
              styles.paymentMethodText,
              paymentMethod === 'paypal' && styles.activePaymentMethodText
            ]}>
              PayPal
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {paymentMethod === 'card' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Card Information</Text>
            <TouchableOpacity onPress={fillDemoData} style={styles.demoButton}>
              <Text style={styles.demoButtonText}>Fill Demo Data</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <View style={styles.inputContainer}>
              <User size={20} color="#6B7280" />
              <TextInput
                style={styles.textInput}
                placeholder="John Doe"
                value={formData.cardholderName}
                onChangeText={(value) => handleInputChange('cardholderName', value)}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <View style={styles.inputContainer}>
              <CreditCard size={20} color="#6B7280" />
              <TextInput
                style={styles.textInput}
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>
          </View>

          <View style={styles.cardDetailsRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChangeText={handleExpiryChange}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="123"
                  value={formData.cvv}
                  onChangeText={(value) => handleInputChange('cvv', value.replace(/[^0-9]/g, ''))}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Billing Address</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Street Address</Text>
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#6B7280" />
            <TextInput
              style={styles.textInput}
              placeholder="123 Main Street"
              value={formData.billingAddress.street}
              onChangeText={(value) => handleInputChange('billingAddress.street', value)}
            />
          </View>
        </View>

        <View style={styles.addressRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>City</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="New York"
                value={formData.billingAddress.city}
                onChangeText={(value) => handleInputChange('billingAddress.city', value)}
              />
            </View>
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>State</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="NY"
                value={formData.billingAddress.state}
                onChangeText={(value) => handleInputChange('billingAddress.state', value)}
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>

        <View style={styles.addressRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>ZIP Code</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="10001"
                value={formData.billingAddress.zipCode}
                onChangeText={(value) => handleInputChange('billingAddress.zipCode', value)}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>Country</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="United States"
                value={formData.billingAddress.country}
                onChangeText={(value) => handleInputChange('billingAddress.country', value)}
              />
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <Text style={styles.submitButtonText}>Processing Payment...</Text>
        ) : (
          <>
            <CheckCircle size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>
              Complete Payment • ${totalAmount}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  demoButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  demoButtonText: {
    color: '#DBEAFE',
    fontSize: 12,
    fontWeight: '600',
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentMethodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#374151',
    backgroundColor: '#374151',
  },
  activePaymentMethod: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E40AF',
  },
  paymentMethodText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  activePaymentMethodText: {
    color: '#DBEAFE',
  },
  paypalIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#0070BA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paypalText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
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
  cardDetailsRow: {
    flexDirection: 'row',
  },
  addressRow: {
    flexDirection: 'row',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});