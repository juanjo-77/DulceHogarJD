import { StyleSheet, View } from 'react-native';

import type { VentaDetalle } from '@/api/tipos/ventas';
import { pesos } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { Cantidad } from '@/ui/Cantidad';
import { Seccion } from '@/ui/Seccion';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

type Props = { venta: VentaDetalle; valor: Record<number, number>; alCambiar: (v: Record<number, number>) => void };

/** Cuántas unidades devuelve de cada producto de la venta. */
export function ElegirDevueltos({ venta, valor, alCambiar }: Props) {
  const items = venta.items.filter((i) => i.cantidad > i.cantidadDevuelta);

  return (
    <Seccion titulo="¿Qué te devolvió?">
      <Tarjeta style={{ gap: 0, paddingVertical: espacio.xs }}>
        {items.map((i, n) => (
          <View key={i.id} style={[s.fila, n < items.length - 1 && s.divisor]}>
            <View style={{ flex: 1 }}>
              <Texto tipo="fuerte">{i.nombre}</Texto>
              <Texto tipo="pequeno" color={color.tintaSuave}>
                Se llevó {i.cantidad - i.cantidadDevuelta} · {pesos(i.precioUnitario)} c/u
              </Texto>
            </View>
            <Cantidad
              pequeno
              valor={valor[i.id] ?? 0}
              maximo={i.cantidad - i.cantidadDevuelta}
              alCambiar={(n) => alCambiar({ ...valor, [i.id]: n })}
            />
          </View>
        ))}
      </Tarjeta>
    </Seccion>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.m, paddingVertical: espacio.m },
  divisor: { borderBottomWidth: 1, borderBottomColor: color.hilo },
});
