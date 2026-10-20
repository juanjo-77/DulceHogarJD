import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import type { VentaDetalle } from '@/api/tipos/ventas';
import { color, espacio, radio } from '@/tema/tokens';
import { Icono } from '@/ui/Icono';
import { Texto } from '@/ui/Texto';

const MENSAJES = {
  Contado: 'Ya quedó en la caja de hoy.',
  Fiado: 'Quedó anotado lo que te debe.',
  Separe: 'Quedó separado. Se lo entregas cuando termine de pagar.',
} as const;

/** El único momento "de celebración" de la app: confirmar que la venta quedó guardada. */
export function NuevaVenta({ venta }: { venta: VentaDetalle }) {
  return (
    <View style={s.banda} accessibilityLiveRegion="polite">
      <Animated.View entering={ZoomIn.springify().damping(12).stiffness(180)} style={s.check}>
        <Icono nombre="check-bold" tamano={30} color={color.blanco} />
      </Animated.View>
      <View style={{ flex: 1 }}>
        <Texto tipo="subtitulo" color={color.menta}>¡Venta registrada!</Texto>
        <Texto color={color.menta}>{MENSAJES[venta.tipo]}</Texto>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  banda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.l,
    padding: espacio.l,
    borderRadius: radio.tarjeta,
    backgroundColor: color.mentaFondo,
  },
  check: { width: 56, height: 56, borderRadius: 28, backgroundColor: color.menta, alignItems: 'center', justifyContent: 'center' },
});
