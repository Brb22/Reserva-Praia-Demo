import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { SymbolView } from 'expo-symbols';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const router = useRouter();

  useEffect(() => {
    const verificar = async () => {
      const usuario = await AsyncStorage.getItem('usuario');
      if (!usuario) {
        router.replace('/login');
      }
    };
    verificar();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5D4037',
        tabBarInactiveTintColor: '#A68B6D',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F7E7CE',
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.05)',
          height: 70,
          paddingBottom: 5,
          paddingTop: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '700',
        },
        tabBarIconStyle: {
          marginBottom: -2,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <SymbolView name="house.fill" tintColor={color} />,
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color }) => <SymbolView name="clock.fill" tintColor={color} />,
        }}
      />
      <Tabs.Screen
        name="nova-reserva"
        options={{
          title: 'Nova',
          tabBarIcon: ({ color }) => <SymbolView name="plus.circle.fill" tintColor={color} />,
        }}
      />
      <Tabs.Screen
        name="reservas-futuras"
        options={{
          title: 'Agenda',
          tabBarIcon: ({ color }) => <SymbolView name="calendar" tintColor={color} />,
        }}
      />
    </Tabs>
  );
}