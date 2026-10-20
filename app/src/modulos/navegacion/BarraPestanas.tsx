import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, espacio } from '@/tema/tokens';
import { Icono, type NombreIcono } from '@/ui/Icono';
import { Presionable } from '@/ui/Presionable';
import { Texto } from '@/ui/Texto';

const ICONOS: Record<string, NombreIcono> = {
  index: 'home-heart',
  productos: 'package-variant',
  vender: 'cart-heart',
  cobrar: 'hand-coin',
  clientes: 'account-group',
};

/** Barra de abajo: íconos grandes, siempre con su nombre, y "Vender" resaltado al centro. */
export function BarraPestanas({ state, descriptors, navigateToTab }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[s.barra, { paddingBottom: Math.max(bottom, espacio.s) }]}>
      {state.routes.map((ruta, i) => {
        const activa = state.index === i;
        const titulo = descriptors[ruta.key].options.title ?? ruta.name;
        const esVender = ruta.name === 'vender';
        const tono = esVender ? color.blanco : activa ? color.frambuesaHundida : color.tintaSuave;

        const ir = () => {
          if (!activa) navigateToTab(ruta.key);
        };

        return (
          <Presionable
            key={ruta.key}
            onPress={ir}
            accessibilityRole="tab"
            accessibilityState={{ selected: activa }}
            accessibilityLabel={titulo}
            style={s.pestana}>
            <View style={[s.icono, activa && s.iconoActivo, esVender && s.vender]}>
              <Icono nombre={ICONOS[ruta.name] ?? 'circle'} tamano={esVender ? 30 : 27} color={tono} />
            </View>
            <Texto
              tipo="pequenoFuerte"
              color={activa || esVender ? color.frambuesaHundida : color.tintaSuave}
              numberOfLines={1}
              maxFontSizeMultiplier={1.1}
              style={s.etiqueta}>
              {titulo}
            </Texto>
          </Presionable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    backgroundColor: color.blanco,
    borderTopWidth: 1,
    borderTopColor: color.hilo,
    paddingTop: espacio.s,
    paddingHorizontal: espacio.xs,
  },
  pestana: { flex: 1, alignItems: 'center', gap: 2, minHeight: 64 },
  etiqueta: { fontSize: 13, letterSpacing: -0.2 },
  icono: { width: 60, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  iconoActivo: { backgroundColor: color.rosaPalo },
  vender: { backgroundColor: color.frambuesa, height: 40, width: 64, borderRadius: 20 },
});
