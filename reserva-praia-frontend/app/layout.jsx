import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashAnimado from '../components/SplashAnimado';

export default function RootLayout() {
  const [splashVisivel, setSplashVisivel] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      {splashVisivel && <SplashAnimado onFim={() => setSplashVisivel(false)} />}
    </View>
  );
}