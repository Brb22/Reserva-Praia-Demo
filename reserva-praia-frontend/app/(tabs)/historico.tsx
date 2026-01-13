import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function Historico() {
  const [historico, setHistorico] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = "http://192.168.15.5:3333/reservas";

  const buscarHistorico = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(API_URL);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas o dia

      // Filtra apenas o que já acabou
      const concluidas = res.data.filter(reserva => {
        const fim = new Date(reserva.dataFim);
        return fim < hoje;
      });

      // Ordena pelas mais recentes no topo
      setHistorico(concluidas.sort((a, b) => new Date(b.dataFim) - new Date(a.dataFim)));
    } catch (e) {
      console.log("Erro ao carregar histórico");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { buscarHistorico(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HISTÓRICO DE ESTADIAS 🏛️</Text>
      
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={buscarHistorico} />}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum check-out realizado ainda.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>CONCLUÍDO</Text>
            </View>
            <Text style={styles.nomeCli}>{item.nomeCliente}</Text>
            <View style={styles.footer}>
              <Ionicons name="calendar-outline" size={14} color="#8B5A2B" />
              <Text style={styles.dataText}>
                {new Date(item.dataInicio).toLocaleDateString('pt-BR')} - {new Date(item.dataFim).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7E7CE', padding: 20 },
  title: { fontSize: 20, fontWeight: '900', color: '#5D4037', marginTop: 40, marginBottom: 20, textAlign: 'center' },
  card: { 
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Branco meio transparente para parecer "antigo"
    borderRadius: 15, 
    padding: 15, 
    marginBottom: 12, 
    borderWidth: 1,
    borderColor: 'rgba(139, 90, 43, 0.2)'
  },
  statusBadge: { 
    backgroundColor: '#4CAF50', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 5,
    marginBottom: 8
  },
  statusText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  nomeCli: { fontSize: 18, fontWeight: '900', color: '#5D4037' },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  dataText: { marginLeft: 5, fontSize: 13, color: '#8B5A2B', fontWeight: '600' },
  vazio: { textAlign: 'center', color: '#8B5A2B', marginTop: 50, fontWeight: 'bold' }
});