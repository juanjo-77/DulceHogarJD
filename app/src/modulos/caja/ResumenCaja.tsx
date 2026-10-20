import { StyleSheet, View } from 'react-native';

import type { Caja } from '@/api/tipos/resumen';
import { pesos } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

export function ResumenCaja({ caja }: { caja: Caja }) {
  return (
    <Tarjeta>
      <View style={s.fila}>
        <Dato titulo="Entró" valor={caja.entradas} tono={color.menta} />
        <Dato titulo="Salió" valor={caja.salidas} tono={color.coral} />
      </View>
      <View style={s.neto}>
        <Texto color={color.tintaSuave}>{caja.neto >= 0 ? 'Quedó' : 'Salió más de lo que entró'}</Texto>
        <Texto tipo="cifra" color={caja.neto >= 0 ? color.tinta : color.coral}>{pesos(caja.neto)}</Texto>
      </View>
      {caja.entradas > 0 && (
        <Texto tipo="pequeno" color={color.tintaSuave}>
          En efectivo {pesos(caja.enEfectivo)} · Por transferencia {pesos(caja.porTransferencia)}
        </Texto>
      )}
    </Tarjeta>
  );
}

function Dato({ titulo, valor, tono }: { titulo: string; valor: number; tono: string }) {
  return (
    <View style={s.dato}>
      <Texto tipo="pequeno" color={color.tintaSuave}>{titulo}</Texto>
      <Texto tipo="subtitulo" color={tono}>{pesos(valor)}</Texto>
    </View>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', gap: espacio.m },
  dato: { flex: 1, backgroundColor: color.lino, borderRadius: 16, padding: espacio.m },
  neto: { gap: 2 },
});
