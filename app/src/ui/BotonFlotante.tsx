import { StyleSheet } from 'react-native';

import { color, espacio, radio, sombra } from '@/tema/tokens';

import { Icono, type NombreIcono } from './Icono';
import { Presionable } from './Presionable';
import { Texto } from './Texto';

type Props = { titulo: string; onPress: () => void; icono?: NombreIcono };

/** Botón para "Agregar…", siempre visible abajo a la derecha y con texto (no solo un "+"). */
export function BotonFlotante({ titulo, onPress, icono = 'plus' }: Props) {
  return (
    <Presionable onPress={onPress} style={s.boton} accessibilityLabel={titulo}>
      <Icono nombre={icono} color={color.blanco} tamano={26} />
      <Texto tipo="fuerte" color={color.blanco}>{titulo}</Texto>
    </Presionable>
  );
}

const s = StyleSheet.create({
  boton: {
    position: 'absolute',
    right: espacio.l,
    bottom: espacio.l,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.s,
    minHeight: 60,
    paddingHorizontal: espacio.xl,
    borderRadius: radio.pastilla,
    backgroundColor: color.frambuesa,
    ...sombra.flotante,
  },
});
