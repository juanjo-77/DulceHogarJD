import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import { urlFoto } from '@/api/servidor';
import { pesos } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { Miniatura } from '@/ui/Avatar';
import { Cantidad } from '@/ui/Cantidad';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

import { carrito, useCarrito } from './carrito';

/** Lo que se lleva el cliente. Cada renglón entra y sale con una animación corta. */
export function ResumenCarrito({ editable }: { editable: boolean }) {
  const { lineas } = useCarrito();
  if (lineas.length === 0) return null;

  return (
    <Tarjeta tono="rosa" style={{ gap: espacio.s }}>
      <Texto tipo="fuerte" color={color.frambuesaHundida}>Se lleva</Texto>
      {lineas.map((l) => (
        <Animated.View key={l.producto.id} entering={FadeIn.duration(180)} exiting={FadeOut.duration(140)} layout={LinearTransition.springify().damping(20)} style={s.linea}>
          <Miniatura foto={urlFoto(l.producto.foto)} icono={l.producto.icono} tamano={44} />
          <View style={{ flex: 1 }}>
            <Texto tipo="fuerte" numberOfLines={1}>{l.producto.nombre}</Texto>
            <Texto tipo="pequeno" color={color.tintaSuave}>{pesos(l.producto.precioVenta * l.cantidad)}</Texto>
          </View>
          {editable ? (
            <Cantidad pequeno valor={l.cantidad} maximo={l.producto.stock} alCambiar={(n) => carrito.poner(l.producto.id, n)} />
          ) : (
            <Texto tipo="fuerte">× {l.cantidad}</Texto>
          )}
        </Animated.View>
      ))}
    </Tarjeta>
  );
}

const s = StyleSheet.create({
  linea: { flexDirection: 'row', alignItems: 'center', gap: espacio.m, minHeight: 56 },
});
