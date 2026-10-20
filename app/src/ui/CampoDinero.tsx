import { View, StyleSheet } from 'react-native';

import { pesos } from '@/funciones/formato';
import { espacio } from '@/tema/tokens';

import { Campo } from './Campo';
import { Chip } from './Chip';

type Props = {
  etiqueta: string;
  valor: number;
  alCambiar: (valor: number) => void;
  ayuda?: string;
  /** Botones rápidos, p. ej. "Todo" o valores comunes. */
  rapidos?: { titulo: string; valor: number }[];
  autoFocus?: boolean;
};

/** Escribe solo números y los muestra como plata: "45000" se ve "$ 45.000". */
export function CampoDinero({ etiqueta, valor, alCambiar, ayuda, rapidos, autoFocus }: Props) {
  return (
    <View style={s.grupo}>
      <Campo
        etiqueta={etiqueta}
        ayuda={ayuda}
        autoFocus={autoFocus}
        keyboardType="number-pad"
        inputMode="numeric"
        placeholder="$ 0"
        value={valor > 0 ? pesos(valor) : ''}
        onChangeText={(texto) => alCambiar(Number(texto.replace(/\D/g, '')) || 0)}
      />
      {rapidos && rapidos.length > 0 && (
        <View style={s.rapidos}>
          {rapidos.map((r) => (
            <Chip key={r.titulo} titulo={r.titulo} activo={valor === r.valor} onPress={() => alCambiar(r.valor)} />
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  grupo: { gap: espacio.s },
  rapidos: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.s },
});
