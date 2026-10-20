import { StyleSheet, View } from 'react-native';

import { color, espacio, radio } from '@/tema/tokens';

import { Texto } from './Texto';

export type Tono = 'menta' | 'miel' | 'coral' | 'rosa' | 'neutro';

const tonos: Record<Tono, { fondo: string; texto: string }> = {
  menta: { fondo: color.mentaFondo, texto: color.menta },
  miel: { fondo: color.mielFondo, texto: color.miel },
  coral: { fondo: color.coralFondo, texto: color.coral },
  rosa: { fondo: color.rosaPalo, texto: color.frambuesaHundida },
  neutro: { fondo: color.lino, texto: color.tintaSuave },
};

/** Pastilla de estado: "Agotado", "Vencida", "Al día"... El color siempre va acompañado de texto. */
export function Insignia({ texto, tono = 'neutro' }: { texto: string; tono?: Tono }) {
  const t = tonos[tono];
  return (
    <View style={[s.pastilla, { backgroundColor: t.fondo }]}>
      <Texto tipo="pequenoFuerte" color={t.texto} numberOfLines={1}>{texto}</Texto>
    </View>
  );
}

const s = StyleSheet.create({
  pastilla: { borderRadius: radio.pastilla, paddingHorizontal: espacio.m, paddingVertical: 4, alignSelf: 'flex-start' },
});
