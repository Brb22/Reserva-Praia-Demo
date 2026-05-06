import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  RefreshControl, ImageBackground, TouchableOpacity, Linking
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import axios from 'axios';

const API_URL = 'https://reserva-praia-demo.onrender.com/reservas';
const CLIMA_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=-24.0059&longitude=-46.4028&current=temperature_2m,weathercode&timezone=America%2FSao_Paulo';

function getClimaEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '🌨️';
  if (code <= 82) return '🌦️';
  return '⛈️';
}

export default function Home() {
  const router = useRouter();
  const [reservas, setReservas] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [temperatura, setTemperatura] = useState<string>('...');
  const [climaEmoji, setClimaEmoji] = useState<string>('🌡️');

  const carregarClima = async () => {
    try {
      const res = await axios.get(CLIMA_URL);
      const temp = res.data.current.temperature_2m;
      const code = res.data.current.weathercode;
      setTemperatura(`${Math.round(temp)}°C`);
      setClimaEmoji(getClimaEmoji(code));
    } catch (e) {
      setTemperatura('--°C');
    }
  };

  const carregarDados = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(API_URL + '/agenda');
      if (res.data && Array.isArray(res.data)) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const limite = new Date(hoje);
        limite.setDate(limite.getDate() + 3);

        // Mostra reservas cujo CHECK-IN está nos próximos 3 dias
        // OU que já começaram e ainda não terminaram (hóspede dentro)
        const proximas = res.data.filter((r: any) => {
          const inicio = new Date(r.dataInicio + 'T00:00:00');
          const fim = new Date(r.dataFim + 'T00:00:00');
          return (inicio >= hoje && inicio <= limite) || (inicio <= hoje && fim >= hoje);
        });
        setReservas(proximas);
      }
    } catch (err) {
      console.log('Erro:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Atualiza toda vez que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      carregarDados();
      carregarClima();

      // Atualização automática a cada 30 segundos
      const intervalo = setInterval(() => {
        carregarDados();
        carregarClima();
      }, 30000);

      return () => clearInterval(intervalo);
    }, [])
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={require('./ceu.jpg')} style={styles.headerImage}>
        <View style={styles.headerOverlay}>
          <Text style={styles.mainTitle}>Reserva Praia 🌴</Text>
          <View style={styles.glassWeather}>
            <Text style={styles.weatherTxt}>
              PRAIA GRANDE {climaEmoji} {temperatura}
            </Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.body}>
        <View style={styles.barraCurva} />

        <View style={styles.rowAtalhos}>
          <TouchableOpacity
            style={[styles.cardAtalho, { backgroundColor: '#E1F5FE' }]}
            onPress={() => router.push('/(tabs)/nova-reserva')}
          >
            <Text style={styles.emojiAtalho}>➕</Text>
            <Text style={styles.labelAtalho}>Nova{'\n'}Reserva</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cardAtalho, { backgroundColor: '#FDF5E6' }]}
            onPress={() => router.push('/(tabs)/historico')}
          >
            <Text style={styles.emojiAtalho}>📖</Text>
            <Text style={styles.labelAtalho}>Histórico{'\n'}Completo</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Check-ins Próximos</Text>

        <FlatList
          data={reservas}
          keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarDados} />}
          ListEmptyComponent={
            <View style={styles.vazioContainer}>
              <Text style={styles.vazioEmoji}>🍺</Text>
              <Text style={styles.vazioTitulo}>Tá tranquilo por aqui!</Text>
              <Text style={styles.vazioSub}>
                Nenhuma reserva nos próximos 3 dias.{'\n'}Abre uma gelada e aproveita o sossego! 🏖️
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <View style={[styles.cardLista, index % 2 === 0 ? styles.azul : styles.branco]}>
              <View style={styles.row}>
                <Text style={styles.nomeCli}>{item.nomeCliente || 'Sem Nome'}</Text>
                <TouchableOpacity
                  onPress={() =>
                    item.telefoneCliente &&
                    Linking.openURL(`tel:${item.telefoneCliente}`)
                  }
                >
                  <Text style={styles.btnTel}>📞 CONTATO</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.dataCli}>
                Check-in: {item.dataInicio ? new Date(item.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR') : '--'}
              </Text>
              <Text style={styles.dataCli}>
                Check-out: {item.dataFim ? new Date(item.dataFim + 'T00:00:00').toLocaleDateString('pt-BR') : '--'}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5DC' },
  headerImage: { width: '100%', height: 280 },
  headerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 34, fontWeight: '900', color: '#FFF',
    marginBottom: 15, textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 10,
  },
  glassWeather: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  weatherTxt: { color: '#FFF', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  body: {
    flex: 1, marginTop: -40, backgroundColor: '#f8f6f2ff',
    borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 20,
  },
  barraCurva: {
    width: 40, height: 5, backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10, alignSelf: 'center', marginTop: 15,
  },
  rowAtalhos: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: 25, marginBottom: 10,
  },
  cardAtalho: {
    width: '47%', padding: 20, borderRadius: 25, alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5,
  },
  emojiAtalho: { fontSize: 24, marginBottom: 8 },
  labelAtalho: { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  sectionTitle: {
    fontSize: 20, fontWeight: 'bold', color: '#5D4037', marginTop: 25, marginBottom: 15,
  },
  cardLista: {
    padding: 18, borderRadius: 20, marginBottom: 12, borderLeftWidth: 6, elevation: 2,
  },
  azul: { backgroundColor: '#E3F2FD', borderLeftColor: '#00B0FF' },
  branco: { backgroundColor: '#FFF', borderLeftColor: '#D2B48C' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nomeCli: { fontWeight: 'bold', fontSize: 17, color: '#333' },
  btnTel: { color: '#8B5A2B', fontWeight: '900', fontSize: 11 },
  dataCli: { color: '#666', fontSize: 13, marginTop: 4 },
  vazioContainer: { alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
  vazioEmoji: { fontSize: 60, marginBottom: 12 },
  vazioTitulo: { fontSize: 20, fontWeight: '900', color: '#5D4037', marginBottom: 8 },
  vazioSub: { fontSize: 14, color: '#8B5A2B', textAlign: 'center', lineHeight: 22 },
});