import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function TicketScreen({ navigation }: any) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.ticketCard}>
        <View style={styles.header}>
          <Text style={styles.agencyName}>Finexs Voyages</Text>
          <Text style={styles.ticketId}>#OP-X8Y2</Text>
        </View>

        <View style={styles.tripSection}>
          <View>
            <Text style={styles.label}>Départ</Text>
            <Text style={styles.time}>09:00</Text>
            <Text style={styles.city}>Yaoundé</Text>
          </View>
          <View style={styles.arrowContainer}>
             <View style={styles.line} />
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.label}>Arrivée</Text>
            <Text style={styles.time}>13:00</Text>
            <Text style={styles.city}>Douala</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>24 Juin 2024</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Siège</Text>
            <Text style={styles.value}>VIP - 24</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Passager</Text>
            <Text style={styles.value}>Adrian Doe</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Classe</Text>
            <Text style={styles.value}>VIP</Text>
          </View>
        </View>

        <View style={styles.qrSection}>
          <View style={styles.qrPlaceholder}>
            <View style={styles.qrInner} />
          </View>
          <Text style={styles.qrHint}>Présentez ce QR Code à l'embarquement</Text>
        </View>

        <View style={styles.perforatedLine}>
           {Array.from({ length: 20 }).map((_, i) => (
             <View key={i} style={styles.perforation} />
           ))}
        </View>

        <View style={styles.footer}>
           <Text style={styles.footerPrice}>3,000 FCFA</Text>
           <Text style={styles.statusBadge}>PAYÉ</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.homeButton}
        onPress={() => navigation.navigate('Search')}
      >
        <Text style={styles.homeButtonText}>Retour à l'accueil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#2563eb',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  ticketCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  header: {
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  agencyName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111',
  },
  ticketId: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  tripSection: {
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#aaa',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  time: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111',
  },
  city: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
  },
  arrowContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  line: {
    height: 1,
    backgroundColor: '#eee',
  },
  infoGrid: {
    padding: 25,
    paddingTop: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 20,
  },
  value: {
    fontSize: 14,
    fontWeight: '800',
    color: '#333',
  },
  qrSection: {
    padding: 25,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  qrPlaceholder: {
    width: 180,
    height: 180,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
  },
  qrInner: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#eee',
    borderRadius: 10,
    borderStyle: 'dashed',
  },
  qrHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    textAlign: 'center',
  },
  perforatedLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  perforation: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563eb',
  },
  footer: {
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111',
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    fontSize: 10,
    fontWeight: '900',
  },
  homeButton: {
    marginTop: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  }
});
