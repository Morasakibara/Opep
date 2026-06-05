import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from './src/screens/SearchScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import BookingScreen from './src/screens/BookingScreen';
import TicketScreen from './src/screens/TicketScreen';
import LoginScreen from './src/screens/auth/LoginScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ height: 100, justifyContent: 'center' }}>
         <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>DEBUG: APP IS RENDERING</Text>
      </View>
      <View style={{ flex: 1, width: '100%' }}>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Search"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerShadowVisible: false,
              headerTitleStyle: {
                fontWeight: '900',
              },
            }}
          >
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Search" 
              component={SearchScreen} 
              options={{ title: 'OPEP Transport' }}
            />
            <Stack.Screen 
              name="Results" 
              component={ResultsScreen} 
              options={{ title: 'Trajets Disponibles' }}
            />
            <Stack.Screen 
              name="Booking" 
              component={BookingScreen} 
              options={{ title: 'Réservation' }}
            />
            <Stack.Screen 
              name="Ticket" 
              component={TicketScreen} 
              options={{ title: 'Mon Ticket' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </View>
  );
}
