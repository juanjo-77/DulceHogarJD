import { router, useLocalSearchParams } from 'expo-router';

import { encargosApi, useEncargo } from '@/api/consultas/clientes';
import { useAccion } from '@/api/useAccion';
import { FormularioPedido } from '@/modulos/pedidos/FormularioPedido';
import { Cargando } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';

export default function EditarPedido() {
  const id = Number(useLocalSearchParams<{ id?: string }>().id ?? 0);
  const existente = useEncargo(id);

  const crear = useAccion(encargosApi.crear, { exito: 'Pedido anotado', alTerminar: (p) => router.replace(`/pedido/${p.id}`) });
  const editar = useAccion(encargosApi.editar, { exito: 'Pedido actualizado', alTerminar: () => router.back() });

  return (
    <Pantalla volver titulo={id ? 'Editar pedido' : 'Anotar pedido'}>
      {id && !existente.data ? (
        <Cargando />
      ) : (
        <FormularioPedido
          inicial={existente.data}
          guardando={crear.isPending || editar.isPending}
          alGuardar={(datos) => (id ? editar.mutate({ id, ...datos }) : crear.mutate(datos))}
        />
      )}
    </Pantalla>
  );
}
