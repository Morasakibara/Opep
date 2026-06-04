import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const MOCK_TRIPS = [
  { id: '1', agency: 'Finexs Voyages', departure: '09:00', arrival: '13:00', price: '3,000', class: 'VIP', available: 12 },
  { id: '2', agency: 'Touristique Express', departure: '10:30', arrival: '15:30', price: '4,000', class: 'VIP', available: 5 },
  { id: '3', agency: 'Finexs Voyages', departure: '11:00', arrival: '15:00', price: '2,500', class: 'CLASSIQUE', available: 24 },
  { id: '4', agency: 'General Express', departure: '12:00', arrival: '16:00', price: '3,500', class: 'PREMIUM', available: 8 },
];

export default function ResultsScreen({ navigation }: any) {
  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Booking', { tripId: item.id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.agencyInfo}>
          <View style={styles.agencyDot} />
          <Text style={styles.agencyName}>{item.agency}</Text>
        </View>
        <Text style={styles.price}>{item.price} FCFA</Text>
      </View>

      <View style={styles.tripDetails}>
        <View style={styles.timeBlock}>
          <Text style={styles.time}>{item.departure}</Text>
          <Text style={styles.city}>Yaoundé</Text>
        </View>
        
        <View style={styles.durationLine}>
          <View style={styles.dot} />
          <View style={styles.line} />
          <View style={[styles.dot, { backgroundColor: '#2563eb' }]} />
        </View>

        <View style={styles.timeBlock}>
          <Text style={styles.time}>{item.arrival}</Text>
          <Text style={styles.city}>Douala</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.class}</Text>
        </View>
        <Text style={styles.available}>{item.available} sièges restants</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_TRIPS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  agencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
    marginRight: 8,
  },
  agencyName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111',
  },
  price: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2563eb',
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeBlock: {
    alignItems: 'center',
    flex: 1,
  },
  time: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111',
  },
  city: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    marginTop: 2,
  },
  durationLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  badge: {
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#2563eb',
    textTransform: 'uppercase',
  },
  available: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ef4444',
  }
});
