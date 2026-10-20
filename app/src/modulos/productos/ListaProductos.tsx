import { router } from 'expo-router';

import { urlFoto } from '@/api/servidor';
import type { Producto } from '@/api/tipos/productos';
import { pesos } from '@/funciones/formato';
import { espacio } from '@/tema/tokens';
import { Miniatura } from '@/ui/Avatar';
import { Fila } from '@/ui/Fila';
import { Tarjeta } from '@/ui/Tarjeta';
import { Vacio } from '@/ui/Vacio';

import { InsigniaStock } from './InsigniaStock';

type Props = { productos: Producto[]; filtrando: boolean };

export function ListaProductos({ productos, filtrando }: Props) {
  if (productos.length === 0) {
    return filtrando ? (
      <Vacio icono="magnify" titulo="No encontramos productos" texto="Prueba con otra palabra o quita los filtros." />
    ) : (
      <Vacio
        icono="package-variant"
        titulo="Todavía no hay productos"
        texto="Agrega tus almohadas, cobijas, toallas y todo lo que vendes."
        accion={{ titulo: 'Agregar producto', onPress: () => router.push('/producto/editar') }}
      />
    );
  }

  return (
    <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
      {productos.map((p, i) => (
        <Fila
          key={p.id}
          titulo={p.nombre}
          subtitulo={`${pesos(p.precioVenta)} · ${p.categoria}`}
          izquierda={<Miniatura foto={urlFoto(p.foto)} icono={p.icono} />}
          derecha={<InsigniaStock producto={p} />}
          ultima={i === productos.length - 1}
          onPress={() => router.push(`/producto/${p.id}`)}
        />
      ))}
    </Tarjeta>
  );
}
