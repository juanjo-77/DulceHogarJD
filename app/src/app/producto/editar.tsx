import { router, useLocalSearchParams } from 'expo-router';

import { productosApi, useProducto } from '@/api/consultas/productos';
import { useAccion } from '@/api/useAccion';
import { FormularioProducto } from '@/modulos/productos/FormularioProducto';
import { Cargando } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';

/** Sirve para crear (sin ?id) y para editar (con ?id=5). */
export default function EditarProducto() {
  const id = Number(useLocalSearchParams<{ id?: string }>().id ?? 0);
  const existente = useProducto(id);

  const crear = useAccion(productosApi.crear, {
    exito: (p) => `${p.nombre} quedó guardado`,
    alTerminar: (p) => router.replace(`/producto/${p.id}`),
  });
  const editar = useAccion(productosApi.editar, { exito: 'Cambios guardados', alTerminar: () => router.back() });

  return (
    <Pantalla volver titulo={id ? 'Editar producto' : 'Nuevo producto'}>
      {id && !existente.data ? (
        <Cargando />
      ) : (
        <FormularioProducto
          inicial={existente.data?.producto}
          guardando={crear.isPending || editar.isPending}
          alGuardar={(datos) => (id ? editar.mutate({ id, ...datos }) : crear.mutate(datos))}
        />
      )}
    </Pantalla>
  );
}
