import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Props {
  onFim: () => void;
}

export default function SplashAnimado({ onFim }: Props) {
  const opacidadeLogo = useRef(new Animated.Value(0)).current;
  const escalaLogo = useRef(new Animated.Value(0.5)).current;
  const opacidadeTexto = useRef(new Animated.Value(0)).current;
  const opacidadeTela = useRef(new Animated.Value(1)).current;
  const ondaY = useRef(new Animated.Value(height * 0.6)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(ondaY, {
        toValue: height * 0.3,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(opacidadeLogo, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(escalaLogo, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacidadeTexto, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(900),
      Animated.timing(opacidadeTela, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => onFim());
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: opacidadeTela }]}>
      <View style={styles.fundo} />

      <Animated.View style={[styles.onda, { transform: [{ translateY: ondaY }] }]}>
        <View style={styles.ondaInterna} />
      </Animated.View>

      <View style={styles.centro}>
        <Animated.Text
          style={[
            styles.emoji,
            { opacity: opacidadeLogo, transform: [{ scale: escalaLogo }] },
          ]}
        >
          🏖️
        </Animated.Text>

        <Animated.Text style={[styles.titulo, { opacity: opacidadeTexto }]}>
          Reserva Praia
        </Animated.Text>

        <Animated.Text style={[styles.subtitulo, { opacity: opacidadeTexto }]}>
          Vila Caiçara • Praia Grande
        </Animated.Text>
      </View>

      <View style={styles.ondaBaixo} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fundo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F7E7CE',
  },
  onda: {
    position: 'absolute',
    width: width * 2,
    height: height * 1.5,
    left: -width * 0.5,
    borderRadius: width,
    backgroundColor: '#1a6b9e',
    opacity: 0.85,
  },
  ondaInterna: {
    position: 'absolute',
    width: width * 2,
    height: height * 1.5,
    top: 20,
    left: 30,
    borderRadius: width,
    backgroundColor: '#2196F3',
    opacity: 0.4,
  },
  centro: {
    alignItems: 'center',
    zIndex: 10,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 10,
    letterSpacing: 1,
  },
  subtitulo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: 2,
  },
  ondaBaixo: {
    position: 'absolute',
    bottom: -40,
    width: width * 1.5,
    height: 120,
    borderRadius: 80,
    backgroundColor: '#D2B48C',
    opacity: 0.4,
  },
});