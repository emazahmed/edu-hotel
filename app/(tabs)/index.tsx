import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, MapPin, Star, Wifi, Car, Coffee } from 'lucide-react-native';
import { mockHotels, mockRooms } from '@/data/mockData';
import { Hotel, Room } from '@/types';

export default function RoomsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const filteredHotels = mockHotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hotelRooms = selectedHotel 
    ? mockRooms.filter(room => room.hotelId === selectedHotel.id)
    : [];

  const handleBookRoom = (room: Room) => {
    router.push({
      pathname: '/booking',
      params: {
        roomId: room.id,
        hotelId: room.hotelId,
        hotelName: selectedHotel?.name || '',
        roomType: room.type,
        price: room.price.toString(),
      },
    });
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi size={16} color="#059669" />;
      case 'parking':
        return <Car size={16} color="#059669" />;
      default:
        return <Coffee size={16} color="#059669" />;
    }
  };

  if (selectedHotel) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setSelectedHotel(null)}
          >
            <Text style={styles.backButtonText}>← Back to Hotels</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedHotel.name}</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Image source={{ uri: selectedHotel.image }} style={styles.hotelImage} />
          
          <View style={styles.hotelInfo}>
            <View style={styles.hotelHeader}>
              <Text style={styles.hotelName}>{selectedHotel.name}</Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.rating}>{selectedHotel.rating}</Text>
              </View>
            </View>
            <View style={styles.locationContainer}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.location}>{selectedHotel.location}</Text>
            </View>
            <Text style={styles.description}>{selectedHotel.description}</Text>
            
            <View style={styles.amenitiesContainer}>
              <Text style={styles.amenitiesTitle}>Amenities</Text>
              <View style={styles.amenitiesList}>
                {selectedHotel.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityItem}>
                    {getAmenityIcon(amenity)}
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.roomsSection}>
            <Text style={styles.sectionTitle}>Available Rooms</Text>
            {hotelRooms.map(room => (
              <View key={room.id} style={styles.roomCard}>
                <Image source={{ uri: room.images[0] }} style={styles.roomImage} />
                <View style={styles.roomInfo}>
                  <Text style={styles.roomType}>{room.type}</Text>
                  <Text style={styles.roomCapacity}>Up to {room.capacity} guests</Text>
                  <Text style={styles.roomDescription}>{room.description}</Text>
                  
                  <View style={styles.roomAmenities}>
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <View key={index} style={styles.roomAmenityItem}>
                        <Text style={styles.roomAmenityText}>{amenity}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <View style={styles.roomFooter}>
                    <View>
                      <Text style={styles.roomPrice}>${room.price}</Text>
                      <Text style={styles.roomPriceLabel}>per night</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.bookButton}
                      onPress={() => handleBookRoom(room)}
                    >
                      <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Your Perfect Room</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#ffffff" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search hotels or locations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Hotels</Text>
        
        {filteredHotels.map(hotel => (
          <TouchableOpacity
            key={hotel.id}
            style={styles.hotelCard}
            onPress={() => setSelectedHotel(hotel)}
          >
            <Image source={{ uri: hotel.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{hotel.name}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.rating}>{hotel.rating}</Text>
                </View>
              </View>
              <View style={styles.locationContainer}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.cardLocation}>{hotel.location}</Text>
              </View>
              <Text style={styles.cardDescription} numberOfLines={2}>
                {hotel.description}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.priceText}>From ${hotel.pricePerNight}/night</Text>
                <Text style={styles.viewRoomsText}>View Rooms →</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    color: '#60A5FA',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginVertical: 20,
  },
  hotelCard: {
    backgroundColor: '#1F2937',
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
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F9FAFB',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E40AF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#DBEAFE',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLocation: {
    marginLeft: 4,
    fontSize: 14,
    color: '#D1D5DB',
  },
  location: {
    marginLeft: 4,
    fontSize: 16,
    color: '#D1D5DB',
  },
  cardDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 24,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#60A5FA',
  },
  viewRoomsText: {
    fontSize: 14,
    color: '#60A5FA',
    fontWeight: '500',
  },
  hotelImage: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginBottom: 16,
  },
  hotelInfo: {
    backgroundColor: '#1F2937',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9FAFB',
    flex: 1,
  },
  amenitiesContainer: {
    marginTop: 16,
  },
  amenitiesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 12,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E40AF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  amenityText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#DBEAFE',
    fontWeight: '500',
  },
  roomsSection: {
    marginBottom: 20,
  },
  roomCard: {
    backgroundColor: '#1F2937',
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
  roomImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  roomInfo: {
    padding: 16,
  },
  roomType: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  roomCapacity: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 8,
  },
  roomDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    marginBottom: 12,
  },
  roomAmenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  roomAmenityItem: {
    backgroundColor: '#374151',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roomAmenityText: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#60A5FA',
  },
  roomPriceLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  bookButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});