import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { color, espacio } from '@/tema/tokens';

type Props = { children: ReactNode; style?: StyleProp<ViewStyle>; tono?: 'rosa' | 'blanco' };

/**
 * La marca de la casa: una etiqueta de tela con costura punteada, como las que
 * van cosidas en una cobija. Se usa en el logo y en los recibos que se comparten.
 */
export function Etiqueta({ children, style, tono = 'rosa' }: Props) {
  return (
    <View style={[s.tela, { backgroundColor: tono === 'rosa' ? color.rosaPalo : color.blanco }, style]}>
      <View style={s.costura}>{children}</View>
    </View>
  );
}

const s = StyleSheet.create({
  tela: { borderRadius: 14, padding: 5 },
  costura: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(176, 58, 98, 0.45)',
    paddingVertical: espacio.s,
    paddingHorizontal: espacio.l,
  },
});
