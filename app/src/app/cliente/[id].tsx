import { router, useLocalSearchParams } from 'expo-router';

import { clientesApi, useCliente } from '@/api/consultas/clientes';
import { useAccion } from '@/api/useAccion';
import { CabeceraCliente } from '@/modulos/clientes/CabeceraCliente';
import { CuentasCliente } from '@/modulos/clientes/CuentasCliente';
import { DatosCliente } from '@/modulos/clientes/DatosCliente';
import { HistorialCliente } from '@/modulos/clientes/HistorialCliente';
import { Boton } from '@/ui/Boton';
import { useConfirmar } from '@/ui/Dialogo';
import { ConDatos } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';

export default function DetalleCliente() {
  const id = Number(useLocalSearchParams<{ id: string }>().id);
  const consulta = useCliente(id);
  const confirmar = useConfirmar();
  const borrar = useAccion(clientesApi.borrar, { exito: 'Cliente borrado', alTerminar: () => router.back() });

  return (
    <Pantalla volver refrescando={consulta.isRefetching} alRefrescar={consulta.refetch}>
      <ConDatos consulta={consulta}>
        {(d) => (
          <>
            <CabeceraCliente cliente={d.cliente} />
            <CuentasCliente detalle={d} />
            <HistorialCliente detalle={d} />
            <DatosCliente cliente={d.cliente} />
            <Boton titulo="Editar datos" icono="pencil" variante="borde" onPress={() => router.push(`/cliente/editar?id=${id}`)} />
            <Boton
              titulo="Borrar cliente"
              icono="trash-can-outline"
              variante="peligro"
              cargando={borrar.isPending}
              onPress={async () => {
                if (await confirmar({ titulo: `¿Borrar a ${d.cliente.nombre}?`, mensaje: 'Sus compras pasadas se conservan.', confirmar: 'Sí, borrar', peligro: true }))
                  borrar.mutate(id);
              }}
            />
          </>
        )}
      </ConDatos>
    </Pantalla>
  );
}
