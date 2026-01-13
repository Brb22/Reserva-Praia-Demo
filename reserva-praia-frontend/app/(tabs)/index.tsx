import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ImageBackground, TouchableOpacity, Linking } from "react-native";
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function Home() {
  const router = useRouter();
  const [reservas, setReservas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = "http://192.168.15.5:3333/reservas";

  const carregarDados = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(API_URL);
      if (res.data && Array.isArray(res.data)) setReservas(res.data);
    } catch (err) {
      console.log("Erro:", err.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { carregarDados(); }, []);

  return (
    <View style={styles.container}>
      {/* 🌌 IMAGEM DO CÉU AMPLIADA */}
      <ImageBackground source={require('./ceu.jpg')} style={styles.headerImage}>
        <View style={styles.headerOverlay}>
          <Text style={styles.mainTitle}>Reserva Praia 🌴</Text>
          
          {/* ☁️ CLIMA CENTRALIZADO TRANSPARENTE */}
          <View style={styles.glassWeather}>
            <Text style={styles.weatherTxt}>SÃO PAULO | 31°C ☀️</Text>
          </View>
        </View>
      </ImageBackground>

      {/* 🏖️ CORPO DO APP NA COR AREIA */}
      <View style={styles.body}>
        <View style={styles.barraCurva} />

        {/* ⚡ ATALHOS RÁPIDOS */}
        <View style={styles.rowAtalhos}>
          <TouchableOpacity 
            style={[styles.cardAtalho, { backgroundColor: '#E1F5FE' }]} 
            onPress={() => router.push('/(tabs)/reservas')} 
          >
            <Text style={styles.emojiAtalho}>➕</Text>
            <Text style={styles.labelAtalho}>Nova{"\n"}Reserva</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.cardAtalho, { backgroundColor: '#FDF5E6' }]} 
            onPress={() => router.push('/(tabs)/historico')} 
          >
            <Text style={styles.emojiAtalho}>📖</Text>
            <Text style={styles.labelAtalho}>Histórico{"\n"}Completo</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Check-ins Pendentes</Text>

        <FlatList
          data={reservas}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={carregarDados} />}
          renderItem={({ item, index }) => (
            <View style={[styles.cardLista, index % 2 === 0 ? styles.azul : styles.branco]}>
               <View style={styles.row}>
                <Text style={styles.nomeCli}>{item.nomeCliente || 'Sem Nome'}</Text>
                <TouchableOpacity onPress={() => item.telefone && Linking.openURL(`tel:${item.telefone}`)}>
                  <Text style={styles.btnTel}>📞 CONTATO</Text>
                </TouchableOpacity>
               </View>
               <Text style={styles.dataCli}>Check-in: {item.dataInicio ? new Date(item.dataInicio).toLocaleDateString('pt-BR') : '--'}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5DC' }, // Fundo areia base
  headerImage: { width: '100%', height: 280 },
  headerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.15)', justifyContent: 'center', alignItems: 'center' },
  mainTitle: { fontSize: 34, fontWeight: '900', color: '#FFF', marginBottom: 15, textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 10 },
  
  glassWeather: { 
    backgroundColor: 'rgba(255,255,255,0.25)', 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 25, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.3)',
  },
  weatherTxt: { color: '#FFF', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },

  // 🏖️ CORPO AREIA
  body: { 
    flex: 1, 
    marginTop: -40, 
    backgroundColor: '#f8f6f2ff', // Cor de areia suave
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    paddingHorizontal: 20 
  },
  barraCurva: { width: 40, height: 5, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 10, alignSelf: 'center', marginTop: 15 },
  
  rowAtalhos: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25, marginBottom: 10 },
  cardAtalho: { width: '47%', padding: 20, borderRadius: 25, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  emojiAtalho: { fontSize: 24, marginBottom: 8 },
  labelAtalho: { fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'center' },

  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#5D4037', marginTop: 25, marginBottom: 15 },
  
  cardLista: { padding: 18, borderRadius: 20, marginBottom: 12, borderLeftWidth: 6, elevation: 2 },
  azul: { backgroundColor: '#E3F2FD', borderLeftColor: '#00B0FF' },
  branco: { backgroundColor: '#FFF', borderLeftColor: '#D2B48C' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nomeCli: { fontWeight: 'bold', fontSize: 17, color: '#333' },
  btnTel: { color: '#8B5A2B', fontWeight: '900', fontSize: 11 },
  dataCli: { color: '#666', fontSize: 13, marginTop: 6 }
});