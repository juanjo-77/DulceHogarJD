import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { color, espacio } from '@/tema/tokens';

import { Icono } from './Icono';
import { Presionable } from './Presionable';
import { Texto } from './Texto';

type Props = {
  titulo: string;
  subtitulo?: string;
  izquierda?: ReactNode;
  derecha?: ReactNode;
  onPress?: () => void;
  /** Sin línea divisoria (la última de una lista). */
  ultima?: boolean;
  /** Para renglones que hacen algo ahí mismo (como agregar al carrito) en vez de abrir otra pantalla. */
  sinFlecha?: boolean;
};

/** Renglón de lista: grande, con todo el ancho tocable y una flecha si lleva a otra pantalla. */
export function Fila({ titulo, subtitulo, izquierda, derecha, onPress, ultima, sinFlecha }: Props) {
  const contenido = (
    <>
      {izquierda}
      <View style={s.textos}>
        <Texto tipo="fuerte" numberOfLines={2}>{titulo}</Texto>
        {subtitulo && <Texto tipo="pequeno" color={color.tintaSuave} numberOfLines={2}>{subtitulo}</Texto>}
      </View>
      {derecha}
      {onPress && !sinFlecha && <Icono nombre="chevron-right" tamano={24} color={color.tintaTenue} />}
    </>
  );

  const estilo = [s.fila, !ultima && s.divisor];
  if (!onPress) return <View style={estilo}>{contenido}</View>;
  return (
    <Presionable onPress={onPress} escala={0.985} style={estilo} accessibilityLabel={titulo}>
      {contenido}
    </Presionable>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.m, minHeight: 68, paddingVertical: espacio.s },
  divisor: { borderBottomWidth: 1, borderBottomColor: color.hilo },
  textos: { flex: 1, gap: 2 },
});
