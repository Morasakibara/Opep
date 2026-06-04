import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function SearchScreen({ navigation }: any) {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Où allez-vous ?</Text>
        <Text style={styles.heroSubtitle}>Réservez votre voyage interurbain en quelques clics.</Text>
      </View>

      <View style={styles.searchCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Départ</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ville de départ"
            value={departure}
            onChangeText={setDeparture}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Destination</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ville d'arrivée"
            value={arrival}
            onChangeText={setArrival}
          />
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Date</Text>
            <TextInput style={styles.input} placeholder="Aujourd'hui" />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Passagers</Text>
            <TextInput style={styles.input} placeholder="1" keyboardType="numeric" />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => navigation.navigate('Results')}
        >
          <Text style={styles.searchButtonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Agences partenaires</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.agenciesList}>
          {['Finexs', 'Touristique', 'General', 'Buca'].map((agency, i) => (
            <View key={i} style={styles.agencyCard}>
              <View style={styles.agencyIcon} />
              <Text style={styles.agencyName}>{agency}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroSection: {
    padding: 20,
    backgroundColor: '#000',
    paddingBottom: 40,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 10,
  },
  searchCard: {
    margin: 20,
    marginTop: -30,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  searchButton: {
    backgroundColor: '#2563eb',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  recentSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 15,
  },
  agenciesList: {
    flexDirection: 'row',
  },
  agencyCard: {
    marginRight: 15,
    alignItems: 'center',
  },
  agencyIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#f0f4ff',
    borderRadius: 15,
    marginBottom: 8,
  },
  agencyName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
  }
});
