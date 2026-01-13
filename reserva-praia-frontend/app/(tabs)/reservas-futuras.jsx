import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';

export default function Agenda() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  // Use o IP que você pegou no ipconfig aqui
  fetch('http://192.168.15.5:3333/reservas') 
    .then(res => {
      if (!res.ok) throw new Error('Erro na rede');
      return res.json();
    })
    .then(dados => setReservas(Array.isArray(dados) ? dados : []))
    .catch(err => {
      console.log("Aguardando conexão com o servidor...");
      setReservas([]); // Limpa o erro para o app não travar
    });
}, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#F7E7CE' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Agenda de Reservas</Text>
      
      <FlatList
        data={reservas}
        keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
        ListEmptyComponent={<Text>Nenhuma reserva encontrada.</Text>}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.nomeCliente || 'Sem nome'}</Text>
            <Text>📅 {item.dataInicio} até {item.dataFim}</Text>
          </View>
        )}
      />
    </View>
  );
}