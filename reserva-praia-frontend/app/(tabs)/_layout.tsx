import { Tabs } from 'expo-router';
import React from 'react';
import { SymbolView } from 'expo-symbols';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#5D4037', // Marrom mais forte pra destacar na areia
        tabBarInactiveTintColor: '#A68B6D',
        headerShown: false,
        // 🏖️ AJUSTE DA BARRA AQUI:
        tabBarStyle: {
          backgroundColor: '#F7E7CE', // Cor de areia sólida
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.05)',
          height: 90, // Aumentei um pouco pra não ficar "esmagado"
          paddingBottom: 10,
          paddingTop: 5,
          position: 'absolute', // Faz ela flutuar se quiser, ou deixa fixo
          elevation: 20, // Sombra no Android
          shadowColor: '#000', // Sombra no iOS
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
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