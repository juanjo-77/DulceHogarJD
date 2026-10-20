import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { productosApi } from '@/api/consultas/productos';
import type { Producto } from '@/api/tipos/productos';
import { useAccion } from '@/api/useAccion';
import { color, espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { Cantidad } from '@/ui/Cantidad';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

import { InsigniaStock } from './InsigniaStock';

/** Para corregir rápido cuántas unidades hay (por ejemplo, después de contar). */
export function AjusteUnidades({ producto }: { producto: Producto }) {
  const [unidades, setUnidades] = useState(producto.stock);
  const cambio = unidades - producto.stock;
  const guardar = useAccion(productosApi.ajustarStock, { exito: 'Unidades actualizadas' });

  return (
    <Tarjeta>
      <View style={s.fila}>
        <View style={{ flex: 1, gap: 4 }}>
          <Texto tipo="fuerte">Unidades en la tienda</Texto>
          <InsigniaStock producto={producto} />
        </View>
        <Cantidad valor={unidades} alCambiar={setUnidades} />
      </View>
      <Texto tipo="pequeno" color={color.tintaSuave}>
        Te avisamos cuando queden {producto.stockMinimo} o menos.
      </Texto>
      {cambio !== 0 && (
        <Boton
          titulo={`Guardar: ${cambio > 0 ? 'llegaron' : 'salieron'} ${Math.abs(cambio)}`}
          icono="content-save"
          cargando={guardar.isPending}
          onPress={() => guardar.mutate({ id: producto.id, cambio })}
        />
      )}
    </Tarjeta>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
});
