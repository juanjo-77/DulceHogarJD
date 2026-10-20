import { router, useLocalSearchParams } from 'expo-router';

import { negocioApi, useMovimiento } from '@/api/consultas/negocio';
import { useAccion } from '@/api/useAccion';
import { FormularioGasto } from '@/modulos/caja/FormularioGasto';
import { Boton } from '@/ui/Boton';
import { useConfirmar } from '@/ui/Dialogo';
import { Cargando } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';

/** Anotar (o corregir) un gasto del negocio u otro ingreso que no es venta. */
export default function Gasto() {
  const id = Number(useLocalSearchParams<{ id?: string }>().id ?? 0);
  const existente = useMovimiento(id);
  const confirmar = useConfirmar();

  const crear = useAccion(negocioApi.crearMovimiento, { exito: 'Anotado en la caja', alTerminar: () => router.back() });
  const editar = useAccion(negocioApi.editarMovimiento, { exito: 'Cambios guardados', alTerminar: () => router.back() });
  const borrar = useAccion(negocioApi.borrarMovimiento, { exito: 'Borrado de la caja', alTerminar: () => router.back() });

  return (
    <Pantalla volver titulo={id ? 'Editar gasto' : 'Anotar un gasto'}>
      {id && !existente.data ? (
        <Cargando />
      ) : (
        <>
          <FormularioGasto
            inicial={existente.data}
            guardando={crear.isPending || editar.isPending}
            alGuardar={(datos) => (id ? editar.mutate({ id, ...datos }) : crear.mutate(datos))}
          />
          {id > 0 && (
            <Boton
              titulo="Borrar"
              icono="trash-can-outline"
              variante="peligro"
              cargando={borrar.isPending}
              onPress={async () => {
                if (await confirmar({ titulo: '¿Borrar este movimiento?', confirmar: 'Sí, borrar', peligro: true })) borrar.mutate(id);
              }}
            />
          )}
        </>
      )}
    </Pantalla>
  );
}
