import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { aFechaApi, fechaConDia, leerFecha, sumarDias } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';

import { Calendario } from './Calendario';
import { Chip } from './Chip';
import { Hoja } from './Hoja';
import { Texto } from './Texto';

type Props = {
  etiqueta: string;
  /** "2026-10-19" */
  valor: string;
  alCambiar: (valor: string) => void;
  opciones: { titulo: string; dias: number }[];
};

/** Fechas con botones rápidos ("En 1 mes") y un calendario sencillo para "Otra fecha". */
export function SelectorFecha({ etiqueta, valor, alCambiar, opciones }: Props) {
  const [calendario, setCalendario] = useState(false);
  const hoy = new Date();
  const rapidas = opciones.map((o) => ({ ...o, fecha: aFechaApi(sumarDias(hoy, o.dias)) }));
  const esRapida = rapidas.some((o) => o.fecha === valor);

  return (
    <View style={s.grupo}>
      <Texto tipo="fuerte">{etiqueta}</Texto>
      <View style={s.opciones}>
        {rapidas.map((o) => (
          <Chip key={o.titulo} titulo={o.titulo} activo={o.fecha === valor} onPress={() => alCambiar(o.fecha)} />
        ))}
        <Chip titulo="Otra fecha" activo={!esRapida} onPress={() => setCalendario(true)} />
      </View>
      <Texto color={color.frambuesaHundida}>{fechaConDia(valor)}</Texto>

      <Hoja visible={calendario} titulo={etiqueta} alCerrar={() => setCalendario(false)}>
        <Calendario
          valor={leerFecha(valor)}
          alElegir={(fecha) => {
            alCambiar(aFechaApi(fecha));
            setCalendario(false);
          }}
        />
      </Hoja>
    </View>
  );
}

const s = StyleSheet.create({
  grupo: { gap: espacio.s },
  opciones: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.s },
});
