import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';

export default function BookingScreen({ navigation }: any) {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const seats = Array.from({ length: 40 }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Choisissez votre siège</Text>
        
        <View style={styles.busLayout}>
          <View style={styles.steeringWheel} />
          <View style={styles.seatsGrid}>
            {seats.map((seat) => (
              <TouchableOpacity 
                key={seat}
                style={[
                  styles.seat,
                  selectedSeat === seat && styles.selectedSeat,
                  [5, 12, 18].includes(seat) && styles.occupiedSeat
                ]}
                disabled={[5, 12, 18].includes(seat)}
                onPress={() => setSelectedSeat(seat)}
              >
                <Text style={[
                  styles.seatText,
                  selectedSeat === seat && styles.selectedSeatText
                ]}>{seat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}><View style={styles.seat} /><Text style={styles.legendLabel}>Libre</Text></View>
          <View style={styles.legendItem}><View style={[styles.seat, styles.selectedSeat]} /><Text style={styles.legendLabel}>Choisi</Text></View>
          <View style={styles.legendItem}><View style={[styles.seat, styles.occupiedSeat]} /><Text style={styles.legendLabel}>Occupé</Text></View>
        </View>

        <View style={styles.passengerForm}>
          <Text style={styles.sectionTitle}>Informations Passager</Text>
          <TextInput style={styles.input} placeholder="Nom complet" />
          <TextInput style={styles.input} placeholder="Numéro de téléphone" keyboardType="phone-pad" />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total à payer</Text>
          <Text style={styles.totalAmount}>3,000 FCFA</Text>
        </View>
        <TouchableOpacity 
          style={styles.payButton}
          onPress={() => navigation.navigate('Ticket')}
        >
          <Text style={styles.payButtonText}>Confirmer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    padding: 20,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 20,
    color: '#111',
  },
  busLayout: {
    backgroundColor: '#f8f9fa',
    borderRadius: 30,
    padding: 20,
    paddingTop: 60,
    borderWidth: 2,
    borderColor: '#eee',
    position: 'relative',
  },
  steeringWheel: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 4,
    borderColor: '#ddd',
  },
  seatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  seat: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedSeat: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  occupiedSeat: {
    backgroundColor: '#eee',
    borderColor: '#eee',
  },
  seatText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
  },
  selectedSeatText: {
    color: '#fff',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendLabel: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
    fontWeight: '600',
  },
  passengerForm: {
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 15,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111',
  },
  payButton: {
    backgroundColor: '#000',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  }
});
