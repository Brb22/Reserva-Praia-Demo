import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const USUARIOS = [
  {
    id: '1',
    nome: 'Bruno Rocha Brito',
    email: 'brunorochabritto94@gmail.com',
    telefone: '11979569353',
  },
];

export default function Login() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  const entrar = async () => {
    const usuario = USUARIOS.find(
      (u) =>
        u.nome.toLowerCase().includes(nome.toLowerCase().trim()) &&
        u.telefone.includes(telefone.replace(/\D/g, ''))
    );

    if (!usuario) {
      return Alert.alert('Ops!', 'Nome ou telefone incorretos.');
    }

    await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>🏖️</Text>
        <Text style={styles.titulo}>Reserva Praia</Text>
        <Text style={styles.subtitulo}>Vila Caiçara • Praia Grande</Text>

        <TextInput
          placeholder="Nome"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />
        <TextInput
          placeholder="979569353"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.btn} onPress={entrar}>
          <Text style={styles.btnTxt}>ENTRAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7E7CE',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  emoji: { fontSize: 60, marginBottom: 10 },
  titulo: {
    fontSize: 26,
    fontWeight: '900',
    color: '#5D4037',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 13,
    color: '#8B5A2B',
    marginBottom: 30,
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    backgroundColor: '#FDF5E6',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0C9A6',
  },
  btn: {
    backgroundColor: '#5D4037',
    width: '100%',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
  },
  btnTxt: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});