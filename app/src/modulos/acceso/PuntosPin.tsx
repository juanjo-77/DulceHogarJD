import { StyleSheet, View } from 'react-native';

import { color, espacio } from '@/tema/tokens';

/** Un puntito por número escrito, sin mostrar cuáles son. */
export function PuntosPin({ cantidad }: { cantidad: number }) {
  const total = Math.max(4, cantidad);
  return (
    <View style={s.fila} accessibilityLabel={`${cantidad} números escritos`} accessibilityLiveRegion="polite">
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[s.punto, i < cantidad ? s.lleno : s.vacio]} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', justifyContent: 'center', gap: espacio.m, minHeight: 24 },
  punto: { width: 20, height: 20, borderRadius: 10 },
  lleno: { backgroundColor: color.frambuesa },
  vacio: { borderWidth: 2, borderColor: color.linoOscuro },
});
