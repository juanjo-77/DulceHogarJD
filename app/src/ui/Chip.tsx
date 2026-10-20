import { StyleSheet } from 'react-native';

import { color, espacio, radio } from '@/tema/tokens';

import { Presionable } from './Presionable';
import { Texto } from './Texto';

type Props = { titulo: string; activo?: boolean; onPress: () => void };

export function Chip({ titulo, activo, onPress }: Props) {
  return (
    <Presionable
      onPress={onPress}
      accessibilityState={{ selected: activo }}
      style={[s.chip, activo ? s.activo : s.inactivo]}>
      <Texto tipo="pequenoFuerte" color={activo ? color.blanco : color.tinta}>{titulo}</Texto>
    </Presionable>
  );
}

const s = StyleSheet.create({
  chip: {
    minHeight: 44,
    paddingHorizontal: espacio.l,
    borderRadius: radio.pastilla,
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  activo: { backgroundColor: color.frambuesa, borderColor: color.frambuesa },
  inactivo: { backgroundColor: color.blanco, borderColor: color.hilo },
});
