import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { color, espacio } from '@/tema/tokens';

import { Texto } from './Texto';

type Props = { titulo: string; derecha?: ReactNode; ayuda?: string; children: ReactNode };

export function Seccion({ titulo, derecha, ayuda, children }: Props) {
  return (
    <View style={s.seccion}>
      <View style={s.encabezado}>
        <Texto tipo="subtitulo" style={{ flex: 1 }} accessibilityRole="header">{titulo}</Texto>
        {derecha}
      </View>
      {ayuda && <Texto tipo="pequeno" color={color.tintaSuave}>{ayuda}</Texto>}
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  seccion: { gap: espacio.m, marginTop: espacio.s },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
});
