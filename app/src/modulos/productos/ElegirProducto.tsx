import { useState, type ReactNode } from 'react';

import { useProductos } from '@/api/consultas/productos';
import { urlFoto } from '@/api/servidor';
import type { Producto } from '@/api/tipos/productos';
import { pesos } from '@/funciones/formato';
import { useRetraso } from '@/funciones/useRetraso';
import { Miniatura } from '@/ui/Avatar';
import { Buscador } from '@/ui/Buscador';
import { Fila } from '@/ui/Fila';
import { Hoja } from '@/ui/Hoja';

import { InsigniaStock } from './InsigniaStock';

type Props = {
  visible: boolean;
  alCerrar: () => void;
  alElegir: (p: Producto) => void;
  titulo?: string;
  /** Para vender o cambiar no sirven los agotados; para surtir o pedir sí. */
  soloDisponibles?: boolean;
  /** Algo más arriba de la lista, p. ej. "Es un producto nuevo". */
  extra?: ReactNode;
};

export function ElegirProducto({ visible, alCerrar, alElegir, titulo = 'Elegir producto', soloDisponibles, extra }: Props) {
  const [buscar, setBuscar] = useState('');
  const productos = useProductos({ buscar: useRetraso(buscar) });
  const lista = (productos.data ?? []).filter((p) => !soloDisponibles || p.stock > 0);

  return (
    <Hoja visible={visible} titulo={titulo} alCerrar={alCerrar}>
      {extra}
      <Buscador valor={buscar} alCambiar={setBuscar} placeholder="Buscar producto" />
      {lista.slice(0, 40).map((p, i) => (
        <Fila
          key={p.id}
          titulo={p.nombre}
          subtitulo={pesos(p.precioVenta)}
          izquierda={<Miniatura foto={urlFoto(p.foto)} icono={p.icono} tamano={44} />}
          derecha={<InsigniaStock producto={p} />}
          ultima={i === lista.length - 1}
          onPress={() => {
            alElegir(p);
            alCerrar();
          }}
        />
      ))}
    </Hoja>
  );
}
