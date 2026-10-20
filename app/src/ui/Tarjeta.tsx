import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { color, espacio, radio, sombra } from '@/tema/tokens';

import { Presionable } from './Presionable';

type Props = {
  children: ReactNode;
  /** "lino" para bloques secundarios sobre el fondo. */
  tono?: 'blanco' | 'lino' | 'rosa';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

const fondos = { blanco: color.blanco, lino: color.lino, rosa: color.rosaNube };

export function Tarjeta({ children, tono = 'blanco', onPress, style, accessibilityLabel }: Props) {
  const estilo = [s.tarjeta, { backgroundColor: fondos[tono] }, tono === 'blanco' && s.conBorde, style];
  if (!onPress) return <View style={estilo}>{children}</View>;
  return (
    <Presionable onPress={onPress} escala={0.985} style={estilo} accessibilityLabel={accessibilityLabel}>
      {children}
    </Presionable>
  );
}

const s = StyleSheet.create({
  tarjeta: { borderRadius: radio.tarjeta, padding: espacio.l, gap: espacio.m },
  conBorde: { borderWidth: 1, borderColor: color.hilo, ...sombra.suave },
});
