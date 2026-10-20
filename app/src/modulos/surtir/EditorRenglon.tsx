import { StyleSheet, View } from 'react-native';

import { pesos } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { Campo } from '@/ui/Campo';
import { CampoDinero } from '@/ui/CampoDinero';
import { Cantidad } from '@/ui/Cantidad';
import { Icono } from '@/ui/Icono';
import { Presionable } from '@/ui/Presionable';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

import { ElegirCategoria } from '../productos/ElegirCategoria';
import type { RenglonSurtido } from './tipos';

type Props = { renglon: RenglonSurtido; alCambiar: (r: RenglonSurtido | null) => void };

/** Un producto que llegó: cuántos y a cuánto. Si es nuevo, también su categoría y precio de venta. */
export function EditorRenglon({ renglon: r, alCambiar }: Props) {
  const poner = (cambios: Partial<RenglonSurtido>) => alCambiar({ ...r, ...cambios });

  return (
    <Tarjeta>
      <View style={s.fila}>
        {r.nuevo ? (
          <View style={{ flex: 1 }}>
            <Campo etiqueta="Producto nuevo" placeholder="Ej: Cobija de Frozen" value={r.nombre} onChangeText={(nombre) => poner({ nombre })} />
          </View>
        ) : (
          <Texto tipo="subtitulo" style={{ flex: 1 }}>{r.icono} {r.nombre}</Texto>
        )}
        <Presionable onPress={() => alCambiar(null)} style={s.quitar} accessibilityLabel={`Quitar ${r.nombre}`}>
          <Icono nombre="close" tamano={22} color={color.tintaSuave} />
        </Presionable>
      </View>
      <View style={s.fila}>
        <Texto tipo="fuerte" style={{ flex: 1 }}>¿Cuántos llegaron?</Texto>
        <Cantidad valor={r.cantidad} minimo={1} alCambiar={(cantidad) => poner({ cantidad })} />
      </View>
      <CampoDinero etiqueta="¿Cuánto te costó cada uno?" valor={r.costo} alCambiar={(costo) => poner({ costo })} />
      {r.nuevo && (
        <>
          <ElegirCategoria valor={r.nuevo.categoriaId} alCambiar={(categoriaId) => poner({ nuevo: { ...r.nuevo!, categoriaId } })} />
          <CampoDinero etiqueta="¿A cuánto lo vas a vender?" valor={r.nuevo.precioVenta} alCambiar={(precioVenta) => poner({ nuevo: { ...r.nuevo!, precioVenta } })} />
        </>
      )}
      {r.costo > 0 && (
        <Texto tipo="pequeno" color={color.tintaSuave}>Subtotal: {pesos(r.costo * r.cantidad)}</Texto>
      )}
    </Tarjeta>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
  quitar: { width: 44, height: 44, borderRadius: 22, backgroundColor: color.lino, alignItems: 'center', justifyContent: 'center' },
});
