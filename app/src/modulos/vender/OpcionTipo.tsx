import { StyleSheet, View } from 'react-native';

import type { TipoVenta } from '@/api/tipos/ventas';
import { color, espacio, radio } from '@/tema/tokens';
import { Icono, type NombreIcono } from '@/ui/Icono';
import { Presionable } from '@/ui/Presionable';
import { Texto } from '@/ui/Texto';

export const TIPOS_VENTA: { tipo: TipoVenta; titulo: string; texto: string; icono: NombreIcono }[] = [
  { tipo: 'Contado', titulo: 'Paga todo ahora', texto: 'De contado, en efectivo o transferencia.', icono: 'cash' },
  { tipo: 'Fiado', titulo: 'Fiado', texto: 'Se lo lleva hoy y paga después.', icono: 'handshake-outline' },
  { tipo: 'Separe', titulo: 'Plan separe', texto: 'Abona por cuotas y se lo lleva cuando termine de pagar.', icono: 'calendar-heart' },
];

type Props = { opcion: (typeof TIPOS_VENTA)[number]; activa: boolean; onPress: () => void };

export function OpcionTipo({ opcion, activa, onPress }: Props) {
  return (
    <Presionable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: activa }}
      accessibilityLabel={opcion.titulo}
      style={[s.opcion, activa ? s.activa : s.inactiva]}>
      <View style={[s.icono, activa && { backgroundColor: color.frambuesa }]}>
        <Icono nombre={opcion.icono} tamano={28} color={activa ? color.blanco : color.frambuesa} />
      </View>
      <View style={{ flex: 1 }}>
        <Texto tipo="fuerte">{opcion.titulo}</Texto>
        <Texto tipo="pequeno" color={color.tintaSuave}>{opcion.texto}</Texto>
      </View>
      <Icono nombre={activa ? 'radiobox-marked' : 'radiobox-blank'} tamano={28} color={activa ? color.frambuesa : color.tintaTenue} />
    </Presionable>
  );
}

const s = StyleSheet.create({
  opcion: { flexDirection: 'row', alignItems: 'center', gap: espacio.m, padding: espacio.l, borderRadius: radio.tarjeta, borderWidth: 2 },
  activa: { borderColor: color.frambuesa, backgroundColor: color.rosaNube },
  inactiva: { borderColor: color.hilo, backgroundColor: color.blanco },
  icono: { width: 52, height: 52, borderRadius: 16, backgroundColor: color.rosaNube, alignItems: 'center', justifyContent: 'center' },
});
