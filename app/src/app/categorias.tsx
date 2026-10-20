import { useState } from 'react';

import { useCategorias } from '@/api/consultas/productos';
import type { Categoria } from '@/api/tipos/productos';
import { EditarCategoria } from '@/modulos/ajustes/EditarCategoria';
import { espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { ConDatos } from '@/ui/Estado';
import { Fila } from '@/ui/Fila';
import { Pantalla } from '@/ui/Pantalla';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';
import { plural } from '@/funciones/formato';

export default function Categorias() {
  const categorias = useCategorias();
  // undefined = cerrado, null = nueva, Categoria = editar.
  const [editando, setEditando] = useState<Categoria | null | undefined>(undefined);

  return (
    <Pantalla volver titulo="Categorías" subtitulo="Cómo se agrupan tus productos">
      <ConDatos consulta={categorias}>
        {(lista) => (
          <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
            {lista.map((c, i) => (
              <Fila
                key={c.id}
                titulo={c.nombre}
                subtitulo={plural(c.productos, 'producto', 'productos')}
                izquierda={<Texto style={{ fontSize: 28, lineHeight: 36, width: 40 }} centrado>{c.icono}</Texto>}
                ultima={i === lista.length - 1}
                onPress={() => setEditando(c)}
              />
            ))}
          </Tarjeta>
        )}
      </ConDatos>
      <Boton titulo="Nueva categoría" icono="plus" variante="suave" onPress={() => setEditando(null)} />
      {editando !== undefined && <EditarCategoria categoria={editando} alCerrar={() => setEditando(undefined)} />}
    </Pantalla>
  );
}
