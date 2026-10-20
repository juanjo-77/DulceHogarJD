import { router } from 'expo-router';

import type { Mes } from '@/api/tipos/resumen';
import { pesos, plural } from '@/funciones/formato';
import { espacio } from '@/tema/tokens';
import { Fila } from '@/ui/Fila';
import { Seccion } from '@/ui/Seccion';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

/** Los productos que más salieron este mes: buena pista de qué surtir. */
export function MasVendidos({ productos }: { productos: Mes['topProductos'] }) {
  if (productos.length === 0) return null;
  return (
    <Seccion titulo="Lo que más se vendió">
      <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
        {productos.map((p, i) => (
          <Fila
            key={p.productoId}
            titulo={p.nombre}
            subtitulo={`${plural(p.unidades, 'unidad', 'unidades')} · ${pesos(p.vendido)}`}
            izquierda={<Texto tipo="subtitulo" style={{ width: 28 }}>{i + 1}</Texto>}
            ultima={i === productos.length - 1}
            onPress={() => router.push(`/producto/${p.productoId}`)}
          />
        ))}
      </Tarjeta>
    </Seccion>
  );
}
