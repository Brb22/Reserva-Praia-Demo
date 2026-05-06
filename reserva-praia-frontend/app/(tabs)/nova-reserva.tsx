import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  ScrollView, Alert, TouchableOpacity
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useRouter, useFocusEffect } from 'expo-router';
import axios from 'axios';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
};
LocaleConfig.defaultLocale = 'pt-br';

const API_URL = 'https://reserva-praia-demo.onrender.com/reservas';

function calcularDias(inicio: string, fim: string): number {
  const a = new Date(inicio + 'T00:00:00');
  const b = new Date(fim + 'T00:00:00');
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)) + 1);
}

async function getClimaParaData(dataStr: string): Promise<{ temp: string; emoji: string }> {
  try {
    const res = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=-24.0059&longitude=-46.4028&daily=temperature_2m_max,weathercode&timezone=America%2FSao_Paulo&forecast_days=16`
    );
    const datas = res.data.daily.time;
    const temps = res.data.daily.temperature_2m_max;
    const codes = res.data.daily.weathercode;
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

export default function NovaReserva() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [datasOcupadas, setDatasOcupadas] = useState<any>({});
  const [salvando, setSalvando] = useState(false);
  const [clima, setClima] = useState<{ temp: string; emoji: string } | null>(null);
  const [dias, setDias] = useState(0);

  const buscarDatas = async () => {
    try {
      const res = await axios.get(API_URL + '/agenda');
      const marcacoes: any = {};
      res.data.forEach((reserva: any) => {
        let atual = new Date(reserva.dataInicio + 'T00:00:00');
        const fim = new Date(reserva.dataFim + 'T00:00:00');
        while (atual <= fim) {
          const key = atual.toISOString().split('T')[0];
          marcacoes[key] = { disabled: true, disableTouchEvent: true, textColor: '#ccc' };
          atual.setDate(atual.getDate() + 1);
        }
      });
      setDatasOcupadas(marcacoes);
    } catch (e) {
      console.log('Erro ao buscar datas ocupadas');
    }
  };

  // Atualiza datas toda vez que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      buscarDatas();
      limparTudo();
    }, [])
  );

  const limparTudo = () => {
    setNome('');
    setDataInicio('');
    setDataFim('');
    setClima(null);
    setDias(0);
  };

  const temConflitoNoPeriodo = (inicio: string, fim: string): boolean => {
    let atual = new Date(inicio + 'T00:00:00');
    const fimDate = new Date(fim + 'T00:00:00');
    while (atual <= fimDate) {
      const key = atual.toISOString().split('T')[0];
      if (datasOcupadas[key]) return true;
      atual.setDate(atual.getDate() + 1);
    }
    return false;
  };

  const salvar = async () => {
    if (!nome || !dataInicio || !dataFim) {
      return Alert.alert('Ops!', 'Preencha o nome e selecione as datas.');
    }

    if (temConflitoNoPeriodo(dataInicio, dataFim)) {
      return Alert.alert('❌ Data indisponível!', 'O período selecionado contém datas já reservadas. Escolha outro período.');
    }

    try {
      setSalvando(true);
      await axios.post(API_URL, {
        nomeCliente: nome.toUpperCase(),
        dataInicio,
        dataFim,
        emailCliente: '',
        telefoneCliente: '',
      });

      Alert.alert(
        '✅ Reserva confirmada!',
        `${nome.toUpperCase()}\n${calcularDias(dataInicio, dataFim)} dias de estadia`,
        [{
          text: 'OK',
          onPress: () => {
            limparTudo();
            router.push('/(tabs)/reservas-futuras');
          }
        }]
      );
    } catch (e: any) {
      const msg = e?.response?.data?.error || 'Falha ao salvar. Verifique a conexão.';
      Alert.alert('❌ Erro', msg);
    } finally {
      setSalvando(false);
    }
  };

  const onDayPress = (day: any) => {
    if (datasOcupadas[day.dateString]) {
      return Alert.alert('❌ Data indisponível', 'Essa data já está reservada!');
    }

    if (!dataInicio || (dataInicio && dataFim)) {
      setDataInicio(day.dateString);
      setDataFim('');
      setClima(null);
      setDias(0);
    } else {
      if (day.dateString < dataInicio) {
        setDataInicio(day.dateString);
        setDataFim('');
      } else {
        if (temConflitoNoPeriodo(dataInicio, day.dateString)) {
          return Alert.alert('❌ Data indisponível', 'Existe uma reserva dentro do período selecionado!');
        }
        setDataFim(day.dateString);
        setDias(calcularDias(dataInicio, day.dateString));
        getClimaParaData(dataInicio).then(setClima);
      }
    }
  };

  const montarIntervalo = () => {
    const marcadas: any = { ...datasOcupadas };
    if (dataInicio) {
      if (dataFim) {
        let atual = new Date(dataInicio + 'T00:00:00');
        const fim = new Date(dataFim + 'T00:00:00');
        while (atual <= fim) {
          const key = atual.toISOString().split('T')[0];
          if (key === dataInicio) {
            marcadas[key] = { startingDay: true, color: '#5D4037', textColor: '#fff' };
          } else if (key === dataFim) {
            marcadas[key] = { endingDay: true, color: '#5D4037', textColor: '#fff' };
          } else {
            marcadas[key] = { color: '#D2B48C', textColor: '#5D4037' };
          }
          atual.setDate(atual.getDate() + 1);
        }
      } else {
        marcadas[dataInicio] = { selected: true, color: '#5D4037', textColor: '#fff' };
      }
    }
    return marcadas;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <Text style={styles.title}>NOVO LOCADOR 🏖️</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="NOME DO CLIENTE"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={nome}
          onChangeText={(txt) => setNome(txt.toUpperCase())}
        />
      </View>

      <Text style={styles.label}>SELECIONE O PERÍODO:</Text>

      {dataInicio ? (
        <View style={styles.resumoCard}>
          <View style={styles.resumoRow}>
            <Text style={styles.resumoEmoji}>📅</Text>
            <Text style={styles.resumoTxt}>
              {new Date(dataInicio + 'T00:00:00').toLocaleDateString('pt-BR')}
              {dataFim ? ` → ${new Date(dataFim + 'T00:00:00').toLocaleDateString('pt-BR')}` : ' → selecione a saída'}
            </Text>
          </View>
          {dias > 0 && (
            <View style={styles.resumoRow}>
              <Text style={styles.resumoEmoji}>🌙</Text>
              <Text style={styles.resumoTxt}>{dias} dia{dias !== 1 ? 's' : ''} de estadia</Text>
            </View>
          )}
        </View>
      ) : null}

      {clima && dataFim ? (
        <View style={styles.climaCard}>
          <Text style={styles.climaTitulo}>PREVISÃO NO CHECK-IN</Text>
          <View style={styles.resumoRow}>
            <Text style={styles.climaEmoji}>{clima.emoji}</Text>
            <Text style={styles.climaTxt}>{clima.temp} em Praia Grande</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={onDayPress}
          markingType="period"
          markedDates={montarIntervalo()}
          minDate={new Date().toISOString().split('T')[0]}
          theme={{
            todayTextColor: '#D2B48C',
            selectedDayBackgroundColor: '#5D4037',
            arrowColor: '#5D4037',
          }}
        />
      </View>

      <TouchableOpacity
        style={[styles.btnSalvar, salvando && { opacity: 0.6 }]}
        onPress={salvar}
        disabled={salvando}
      >
        <Text style={styles.btnText}>
          {salvando ? 'SALVANDO...' : 'FINALIZAR RESERVA ✅'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7E7CE', padding: 20 },
  title: {
    fontSize: 24, fontWeight: '900', color: '#5D4037',
    textAlign: 'center', marginVertical: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 15, borderRadius: 20, marginBottom: 20,
  },
  label: { fontWeight: 'bold', color: '#5D4037', marginBottom: 10, marginLeft: 5 },
  resumoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16, padding: 15, marginBottom: 10,
    borderLeftWidth: 4, borderLeftColor: '#5D4037', elevation: 2,
  },
  climaCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16, padding: 15, marginBottom: 12,
    borderLeftWidth: 4, borderLeftColor: '#1976D2', elevation: 2,
  },
  climaTitulo: {
    fontSize: 10, fontWeight: 'bold', color: '#1565C0',
    letterSpacing: 1, marginBottom: 6,
  },
  climaEmoji: { fontSize: 22, marginRight: 8 },
  climaTxt: { color: '#1565C0', fontWeight: '700', fontSize: 15 },
  resumoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  resumoEmoji: { fontSize: 16, marginRight: 8 },
  resumoTxt: { color: '#5D4037', fontWeight: '600', fontSize: 14 },
  input: {
    backgroundColor: '#FFF', padding: 15, borderRadius: 12,
    marginBottom: 12, fontSize: 14, fontWeight: 'bold',
    color: '#333', borderWidth: 1, borderColor: '#E0C9A6',
  },
  calendarContainer: {
    backgroundColor: '#FFF', borderRadius: 20,
    overflow: 'hidden', elevation: 4, marginBottom: 20,
  },
  btnSalvar: {
    backgroundColor: '#5D4037', padding: 20,
    borderRadius: 15, alignItems: 'center', elevation: 5,
  },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});