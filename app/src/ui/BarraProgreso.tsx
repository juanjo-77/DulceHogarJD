import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';

import { color, radio } from '@/tema/tokens';

type Props = { valor: number; total: number; tono?: string; alto?: number };

/** Cuánto lleva pagado de lo que debe. Se llena con una animación corta al aparecer. */
export function BarraProgreso({ valor, total, tono = color.frambuesa, alto = 12 }: Props) {
  const proporcion = total > 0 ? Math.min(Math.max(valor / total, 0), 1) : 0;
  const ancho = useSharedValue(0);

  useEffect(() => {
    ancho.value = withTiming(proporcion, { duration: 520, easing: Easing.out(Easing.cubic) });
  }, [proporcion, ancho]);

  const relleno = useAnimatedStyle(() => ({ width: `${ancho.value * 100}%` }));

  return (
    <View
      style={[s.fondo, { height: alto }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(proporcion * 100) }}>
      <Animated.View style={[s.relleno, { backgroundColor: tono }, relleno]} />
    </View>
  );
}

const s = StyleSheet.create({
  fondo: { backgroundColor: color.lino, borderRadius: radio.pastilla, overflow: 'hidden' },
  relleno: { height: '100%', borderRadius: radio.pastilla },
});
