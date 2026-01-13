import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import axios from 'axios';

// Configuração do calendário em PT-BR
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
};
LocaleConfig.defaultLocale = 'pt-br';

const API_URL = 'http://192.168.15.5:3333/reservas'; // COLOQUE SEU IP AQUI

export default function NovaReserva() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [datasOcupadas, setDatasOcupadas] = useState({});

  // Busca datas já reservadas para bloquear no calendário
  useEffect(() => {
    const buscarDatas = async () => {
      try {
        const res = await axios.get(API_URL);
        const marcacoes = {};
        res.data.forEach((reserva: any) => {
          // Lógica simples para marcar as datas (pode precisar de ajuste dependendo do seu back)
          marcacoes[reserva.dataInicio] = { disabled: true, disableTouchEvent: true, textColor: 'gray' };
          marcacoes[reserva.dataFim] = { disabled: true, disableTouchEvent: true, textColor: 'gray' };
        });
        setDatasOcupadas(marcacoes);
      } catch (e) {
        console.log("Erro ao buscar datas ocupadas");
      }
    };
    buscarDatas();
  }, []);

  const salvar = async () => {
    if (!nome || !dataInicio || !dataFim || !email || !telefone) {
      return Alert.alert("Ops!", "Preencha todos os campos e selecione as datas.");
    }

    try {
      await axios.post(API_URL, {
        nomeCliente: nome.toUpperCase(),
        dataInicio,
        dataFim,
        emailCliente: email.toLowerCase(),
        telefoneCliente: telefone
      });

      Alert.alert("Sucesso!", "Reserva salva!");
      router.push('/(tabs)/reservas-futuras');
    } catch (e) {
      Alert.alert("Erro", "Falha ao salvar no banco. Verifique a conexão.");
    }
  };

  const onDayPress = (day: any) => {
    if (!dataInicio || (dataInicio && dataFim)) {
      setDataInicio(day.dateString);
      setDataFim('');
    } else {
      setDataFim(day.dateString);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.title}>NOVO LOCADOR 🏖️</Text>

      <View style={styles.card}>

        <TextInput
          placeholder="NOME DO CLIENTE"
          style={styles.input}
          value={nome}
          onChangeText={(txt) => setNome(txt.toUpperCase())}

        />
      </View>

      <Text style={styles.label}>SELECIONE O PERÍODO:</Text>
      
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={{
            ...datasOcupadas,
            [dataInicio]: { selected: true, startingDay: true, color: '#5D4037' },
            [dataFim]: { selected: true, endingDay: true, color: '#5D4037' },
          }}
          theme={{
            todayTextColor: '#D2B48C',
            selectedDayBackgroundColor: '#5D4037',
            arrowColor: '#5D4037',
          }}
        />
      </View>

      <TouchableOpacity style={styles.btnSalvar} onPress={salvar}>
        <Text style={styles.btnText}>FINALIZAR RESERVA</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7E7CE', // Cor de areia
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#5D4037',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 10,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0C9A6',
  },
  calendarContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    marginBottom: 20,
  },
  btnSalvar: {
    backgroundColor: '#5D4037',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});