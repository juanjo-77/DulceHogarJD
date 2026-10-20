import { router, useLocalSearchParams } from 'expo-router';

import { clientesApi, useCliente } from '@/api/consultas/clientes';
import { useAccion } from '@/api/useAccion';
import { FormularioCliente } from '@/modulos/clientes/FormularioCliente';
import { Cargando } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';

export default function EditarCliente() {
  const id = Number(useLocalSearchParams<{ id?: string }>().id ?? 0);
  const existente = useCliente(id);

  const crear = useAccion(clientesApi.crear, {
    exito: (c) => `${c.nombre} quedó guardada`,
    alTerminar: (c) => router.replace(`/cliente/${c.id}`),
  });
  const editar = useAccion(clientesApi.editar, { exito: 'Cambios guardados', alTerminar: () => router.back() });

  return (
    <Pantalla volver titulo={id ? 'Editar cliente' : 'Nuevo cliente'}>
      {id && !existente.data ? (
        <Cargando />
      ) : (
        <FormularioCliente
          inicial={existente.data?.cliente}
          guardando={crear.isPending || editar.isPending}
          alGuardar={(datos) => (id ? editar.mutate({ id, ...datos }) : crear.mutate(datos))}
        />
      )}
    </Pantalla>
  );
}
