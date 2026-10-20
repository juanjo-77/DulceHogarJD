import { StyleSheet, View } from 'react-native';

import { pesos } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

/** Las cuentas claras antes de confirmar: total, lo que paga hoy y lo que queda debiendo. */
export function TotalVenta({ total, pagaHoy }: { total: number; pagaHoy: number }) {
  const queda = Math.max(total - pagaHoy, 0);
  return (
    <Tarjeta tono="lino" style={{ gap: espacio.s }}>
      <Renglon titulo="Total" valor={pesos(total)} fuerte />
      <Renglon titulo="Paga hoy" valor={pesos(pagaHoy)} />
      {queda > 0 && <Renglon titulo="Queda debiendo" valor={pesos(queda)} tono={color.frambuesaHundida} fuerte />}
    </Tarjeta>
  );
}

function Renglon({ titulo, valor, fuerte, tono }: { titulo: string; valor: string; fuerte?: boolean; tono?: string }) {
  return (
    <View style={s.renglon}>
      <Texto color={color.tintaSuave}>{titulo}</Texto>
      <Texto tipo={fuerte ? 'subtitulo' : 'fuerte'} color={tono}>{valor}</Texto>
    </View>
  );
}

const s = StyleSheet.create({
  renglon: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
