import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

// ⚠️ TROQUE PELA URL DO SEU BACKEND EM PRODUÇÃO
const API_URL = 'https://reserva-praia-demo.onrender.com/reservas';

function calcularDias(inicio: string, fim: string): number {
  const a = new Date(inicio + 'T00:00:00');
  const b = new Date(fim + 'T00:00:00');
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)) + 1);
}

function fraseAleatoria(nome: string, dias: number): string {
  const frases = [
    `${nome} curtiu ${dias} dia${dias > 1 ? 's' : ''} de sol e areia! ☀️`,
    `Mais ${dias} dia${dias > 1 ? 's' : ''} de memórias na praia com ${nome}! 🌊`,
    `${nome} foi embora, mas a areia ficou! 🏖️`,
    `${dias} dia${dias > 1 ? 's' : ''} de brisa do mar com ${nome}! 🌴`,
    `Uma estadia inesquecível de ${dias} dia${dias > 1 ? 's' : ''}! 🦀`,
  ];
  return frases[Math.floor(Math.random() * frases.length)];
}

export default function Historico() {
  const [historico, setHistorico] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const buscarHistorico = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(API_URL);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const concluidas = res.data.filter((reserva: any) => {
        const fim = new Date(reserva.dataFim + 'T00:00:00');
        return fim < hoje;
      });

      setHistorico(concluidas.sort((a: any, b: any) =>
        new Date(b.dataFim).getTime() - new Date(a.dataFim).getTime()
      ));
    } catch (e) {
      console.log('Erro ao carregar histórico');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { buscarHistorico(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HISTÓRICO DE ESTADIAS 🏛️</Text>
      <Text style={styles.subtitulo}>{historico.length} estadia{historico.length !== 1 ? 's' : ''} realizada{historico.length !== 1 ? 's' : ''}</Text>

      <FlatList
        data={historico}
        keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={buscarHistorico} />}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Text style={styles.vazioEmoji}>📭</Text>
            <Text style={styles.vazioTxt}>Nenhuma estadia concluída ainda.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const dias = calcularDias(item.dataInicio, item.dataFim);
          const frase = fraseAleatoria(item.nomeCliente?.split(' ')[0] || 'O hóspede', dias);

          return (
            <View style={styles.card}>
              <View style={styles.badgeRow}>
                <View style={styles.badgeConcluido}>
                  <Text style={styles.badgeTxt}>✅ CONCLUÍDO</Text>
                </View>
                <View style={styles.badgePago}>
                  <Ionicons name="cash-outline" size={12} color="#1565C0" />
                  <Text style={styles.badgePagoTxt}>PAGO</Text>
                </View>
              </View>

              <Text style={styles.nomeCli}>{item.nomeCliente}</Text>

              <View style={styles.periodoRow}>
                <Ionicons name="calendar-outline" size={14} color="#8B5A2B" />
                <Text style={styles.dataText}>
                  {new Date(item.dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')}
                  {' → '}
                  {new Date(item.dataFim + 'T00:00:00').toLocaleDateString('pt-BR')}
                </Text>
              </View>

              <View style={styles.diasRow}>
                <Ionicons name="moon-outline" size={13} color="#8B5A2B" />
                <Text style={styles.diasTxt}>{dias} dia{dias !== 1 ? 's' : ''} de estadia</Text>
              </View>

              <View style={styles.fraseBox}>
                <Text style={styles.fraseTxt}>{frase}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7E7CE', padding: 20 },
  title: {
    fontSize: 20, fontWeight: '900', color: '#5D4037',
    marginTop: 40, marginBottom: 4, textAlign: 'center',
  },
  subtitulo: { textAlign: 'center', color: '#8B5A2B', marginBottom: 20, fontWeight: '600' },
  card: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(139,90,43,0.15)',
    elevation: 2,
  },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  badgeConcluido: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeTxt: { color: '#2e7d32', fontSize: 10, fontWeight: 'bold' },
  badgePago: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  badgePagoTxt: { color: '#1565C0', fontSize: 10, fontWeight: 'bold' },
  nomeCli: { fontSize: 18, fontWeight: '900', color: '#5D4037', marginBottom: 8 },
  periodoRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  dataText: { color: '#8B5A2B', fontWeight: '600', fontSize: 13 },
  diasRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10 },
  diasTxt: { color: '#8B5A2B', fontSize: 12 },
  fraseBox: {
    backgroundColor: 'rgba(210,180,140,0.2)',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#D2B48C',
  },
  fraseTxt: { color: '#5D4037', fontSize: 13, fontStyle: 'italic' },
  vazioContainer: { alignItems: 'center', marginTop: 60 },
  vazioEmoji: { fontSize: 50, marginBottom: 12 },
  vazioTxt: { color: '#8B5A2B', fontWeight: 'bold', fontSize: 15 },
});