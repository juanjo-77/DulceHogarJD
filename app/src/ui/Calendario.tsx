import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { nombreMes } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';

import { Icono } from './Icono';
import { Presionable } from './Presionable';
import { Texto } from './Texto';

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

type Props = { valor: Date; alElegir: (fecha: Date) => void };

export function Calendario({ valor, alElegir }: Props) {
  const [mes, setMes] = useState(new Date(valor.getFullYear(), valor.getMonth(), 1));
  // La semana empieza el lunes.
  const vacios = (mes.getDay() + 6) % 7;
  const diasDelMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  const celdas = [...Array(vacios).fill(null), ...Array.from({ length: diasDelMes }, (_, i) => i + 1)];
  const mover = (n: number) => setMes(new Date(mes.getFullYear(), mes.getMonth() + n, 1));
  const esElegido = (d: number) =>
    valor.getDate() === d && valor.getMonth() === mes.getMonth() && valor.getFullYear() === mes.getFullYear();

  return (
    <View style={s.calendario}>
      <View style={s.mes}>
        <Presionable onPress={() => mover(-1)} style={s.flecha} accessibilityLabel="Mes anterior">
          <Icono nombre="chevron-left" tamano={28} />
        </Presionable>
        <Texto tipo="subtitulo" centrado style={{ flex: 1 }}>
          {nombreMes(mes.getMonth() + 1)} {mes.getFullYear()}
        </Texto>
        <Presionable onPress={() => mover(1)} style={s.flecha} accessibilityLabel="Mes siguiente">
          <Icono nombre="chevron-right" tamano={28} />
        </Presionable>
      </View>
      <View style={s.rejilla}>
        {DIAS.map((d, i) => (
          <Texto key={`${d}${i}`} tipo="pequenoFuerte" color={color.tintaSuave} centrado style={s.celda}>{d}</Texto>
        ))}
        {celdas.map((d, i) =>
          d === null ? (
            <View key={`v${i}`} style={s.celda} />
          ) : (
            <Presionable
              key={d}
              onPress={() => alElegir(new Date(mes.getFullYear(), mes.getMonth(), d))}
              style={[s.celda, s.dia, esElegido(d) && s.elegido]}
              accessibilityLabel={`${d} de ${nombreMes(mes.getMonth() + 1)}`}>
              <Texto tipo="fuerte" color={esElegido(d) ? color.blanco : color.tinta}>{d}</Texto>
            </Presionable>
          ),
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  calendario: { gap: espacio.m },
  mes: { flexDirection: 'row', alignItems: 'center' },
  flecha: { width: 52, height: 52, borderRadius: 26, backgroundColor: color.lino, alignItems: 'center', justifyContent: 'center' },
  rejilla: { flexDirection: 'row', flexWrap: 'wrap' },
  celda: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  dia: { borderRadius: 999 },
  elegido: { backgroundColor: color.frambuesa },
});
