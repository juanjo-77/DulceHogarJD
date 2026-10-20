import { router } from 'expo-router';
import { useState } from 'react';

import { useCaja } from '@/api/consultas/negocio';
import { aFechaApi } from '@/funciones/formato';
import { CambiarDia } from '@/modulos/caja/CambiarDia';
import { MovimientosCaja } from '@/modulos/caja/MovimientosCaja';
import { ResumenCaja } from '@/modulos/caja/ResumenCaja';
import { Boton } from '@/ui/Boton';
import { ConDatos } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';

/** Cuánta plata entró y salió en un día. */
export default function Caja() {
  const [dia, setDia] = useState(aFechaApi(new Date()));
  const caja = useCaja(dia);

  return (
    <Pantalla volver titulo="Caja del día" refrescando={caja.isRefetching} alRefrescar={caja.refetch}>
      <CambiarDia valor={dia} alCambiar={setDia} />
      <ConDatos consulta={caja}>
        {(c) => (
          <>
            <ResumenCaja caja={c} />
            <Boton titulo="Anotar un gasto" icono="cash-minus" variante="suave" onPress={() => router.push('/gasto')} />
            <MovimientosCaja movimientos={c.movimientos} />
          </>
        )}
      </ConDatos>
    </Pantalla>
  );
}
