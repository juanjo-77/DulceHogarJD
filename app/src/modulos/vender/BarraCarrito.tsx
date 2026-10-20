import { StyleSheet, View } from 'react-native';

import { pesos, plural } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { Texto } from '@/ui/Texto';

type Props = { unidades: number; total: number; alContinuar: () => void };

export function BarraCarrito({ unidades, total, alContinuar }: Props) {
  return (
    <View style={s.barra}>
      <View style={{ flex: 1 }}>
        <Texto tipo="pequeno" color={color.tintaSuave}>
          {unidades === 0 ? 'Nada todavía' : plural(unidades, 'producto', 'productos')}
        </Texto>
        <Texto tipo="subtitulo">{pesos(total)}</Texto>
      </View>
      <Boton titulo="Continuar" icono="arrow-right" deshabilitado={unidades === 0} onPress={alContinuar} />
    </View>
  );
}

const s = StyleSheet.create({
  barra: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
});
