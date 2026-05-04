import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, RefreshControl, ActivityIndicator, Platform
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

const API_URL = 'https://reserva-praia-backend.onrender.com/reservas';

async function getClimaParaData(dataStr: string): Promise<{ temp: string; emoji: string }> {
  try {
    const hoje = new Date();
    const data = new Date(dataStr + 'T00:00:00');
    const diffDias = Math.floor((data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDias < 0 || diffDias > 15) return { temp: '--', emoji: '📅' };
    const res = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=-24.0059&longitude=-46.4028&daily=temperature_2m_max,weathercode&timezone=America%2FSao_Paulo&forecast_days=16`
    );
    const temps = res.data.daily.temperature_2m_max;
    const codes = res.data.daily.weathercode;
    const datas = res.data.daily.time;
    const idx = datas.indexOf(dataStr);
    if (idx === -1) return { temp: '--', emoji: '📅' };
    const code = codes[idx];
    let emoji = '☀️';
    if (code <= 3) emoji = '⛅';
    else if (code <= 48) emoji = '🌫️';
    else if (code <= 67) emoji = '🌧️';
    else if (code <= 82) emoji = '🌦️';
    else emoji = '⛈️';
    return { temp: `${Math.round(temps[idx])}°C`, emoji };
  } catch {
    return { temp: '--', emoji: '🌡️' };
  }
}

function calcularDias(inicio: string, fim: string): number {
  const a = new Date(inicio + 'T00:00:00');
  const b = new Date(fim + 'T00:00:00');
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)) + 1);
}

export default function Agenda() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [climas, setClimas] = useState<Record<string, { temp: string; emoji: string }>>({});

  const carregarReservas = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(API_URL + '/agenda');
      const dados = Array.isArray(res.data) ? res.data : [];
      setReservas(dados);
      const climasTemp: Record<string, { temp: string; emoji: string }> = {};
      await Promise.all(
        dados.map(async (r: any) => {
          const c = await getClimaParaData(r.dataInicio);
          climasTemp[r._id] = c;
        })
      );
      setClimas(climasTemp);
    } catch (err) {
      console.log('Erro ao carregar agenda:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarReservas();
      const intervalo = setInterval(() => { carregarReservas(); }, 30000);
      return () => clearInterval(intervalo);
    }, [])
  );

  const excluirReserva = async (id: string, nome: string) => {
    // No web usa confirm() nativo do browser
    if (Platform.OS === 'web') {
      const confirmado = window.confirm(`Deseja cancelar a reserva de ${nome}?`);
      if (!confirmado) return;
      try {
        await axios.delete(`${API_URL}/${id}`);
        setReservas((prev) => prev.filter((r) => r._id !== id));
        window.alert('✅ Reserva cancelada!');
      } catch {
        window.alert('Erro: Não foi possível cancelar.');
      }
      return;
    }

    // No celular usa Alert nativo
    Alert.alert(
      '❌ Cancelar Reserva',
      `Deseja cancelar a reserva de ${nome}?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/${id}`);
              setReservas((prev) => prev.filter((r) => r._id !== id));
              Alert.alert('✅', 'Reserva cancelada!');
            } catch {
              Alert.alert('Erro', 'Não foi possível cancelar.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5D4037" />
        <Text style={styles.loadingTxt}>Carregando agenda...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AGENDA DE RESERVAS 📅</Text>
      <Text style={styles.subtitulo}>{reservas.length} reserva{reservas.length !== 1 ? 's' : ''} ativa{reservas.length !== 1 ? 's' : ''}</Text>

      <FlatList
        data={reservas}
        keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarReservas} />}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Text style={styles.vazioEmoji}>🏖️</Text>
            <Text style={styles.vazioTxt}>Nenhuma reserva ativa no momento.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const clima = climas[item._id] || { temp: '...', emoji: '🌡️' };
          const dias = calcularDias(item.dataInicio, item.dataFim);
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.badgeAtiva}>
                  <Text style={styles.badgeTxt}>✅ ATIVA</Text>
                </View>
                <TouchableOpacity
                  style={styles.btnExcluir}
                  onPress={() => excluirReserva(item._id, item.nomeCliente)}
                >
                  <Ionicons name="trash-outline" size={18} color="#c0392b" />
                  <Text style={styles.btnExcluirTxt}>Cancelar</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.nomeCliente}>{item.nomeCliente}</Text>
              <View style={styles.periodoRow}>
                <Ionicons name="calendar-outline" size={16} color="#5D4037" />
                <Text style={styles.periodoTxt}>
                  {new Date(item.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')}
                  {' → '}
                  {new Date(item.dataFim + 'T00:00:00').toLocaleDateString('pt-BR')}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoBadge}>
                  <Ionicons name="moon-outline" size={14} color="#5D4037" />
                  <Text style={styles.infoBadgeTxt}>{dias} dia{dias !== 1 ? 's' : ''}</Text>
                </View>
                <View style={styles.infoBadge}>
                  <Text>{clima.emoji}</Text>
                  <Text style={styles.infoBadgeTxt}>{clima.temp} no check-in</Text>
                </View>
              </View>
              {item.telefoneCliente ? (
                <View style={styles.contatoRow}>
                  <Ionicons name="call-outline" size={14} color="#8B5A2B" />
                  <Text style={styles.contatoTxt}>{item.telefoneCliente}</Text>
                </View>
              ) : null}
              {item.emailCliente ? (
                <View style={styles.contatoRow}>
                  <Ionicons name="mail-outline" size={14} color="#8B5A2B" />
                  <Text style={styles.contatoTxt}>{item.emailCliente}</Text>
                </View>
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7E7CE', padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7E7CE' },
  loadingTxt: { marginTop: 12, color: '#5D4037', fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: '900', color: '#5D4037', marginTop: 40, marginBottom: 4, textAlign: 'center' },
  subtitulo: { textAlign: 'center', color: '#8B5A2B', marginBottom: 20, fontWeight: '600' },
  card: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 18, marginBottom: 16,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
    borderLeftWidth: 5, borderLeftColor: '#5D4037',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badgeAtiva: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeTxt: { color: '#2e7d32', fontWeight: 'bold', fontSize: 11 },
  btnExcluir: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  btnExcluirTxt: { color: '#c0392b', fontWeight: 'bold', fontSize: 13 },
  nomeCliente: { fontSize: 20, fontWeight: '900', color: '#3E2723', marginBottom: 10 },
  periodoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  periodoTxt: { color: '#5D4037', fontWeight: '700', fontSize: 14 },
  infoRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  infoBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FDF5E6', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  infoBadgeTxt: { color: '#5D4037', fontSize: 12, fontWeight: '600' },
  contatoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  contatoTxt: { color: '#8B5A2B', fontSize: 13 },
  vazioContainer: { alignItems: 'center', marginTop: 60 },
  vazioEmoji: { fontSize: 60, marginBottom: 12 },
  vazioTxt: { color: '#8B5A2B', fontWeight: 'bold', fontSize: 16 },
});