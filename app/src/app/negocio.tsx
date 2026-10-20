import { useState } from 'react';

import { useMes } from '@/api/consultas/negocio';
import { CambiarMes } from '@/modulos/negocio/CambiarMes';
import { ComoSeCalcula } from '@/modulos/negocio/ComoSeCalcula';
import { GraficaMeses } from '@/modulos/negocio/GraficaMeses';
import { MasVendidos } from '@/modulos/negocio/MasVendidos';
import { OtrosDatos } from '@/modulos/negocio/OtrosDatos';
import { VeredictoMes } from '@/modulos/negocio/VeredictoMes';
import { ConDatos } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';

/** "¿Cómo va el negocio?": la ganancia aproximada del mes, explicada sin palabras de contador. */
export default function Negocio() {
  const hoy = new Date();
  const [periodo, setPeriodo] = useState({ anio: hoy.getFullYear(), mes: hoy.getMonth() + 1 });
  const mes = useMes(periodo.anio, periodo.mes);

  return (
    <Pantalla volver titulo="¿Cómo va el negocio?" refrescando={mes.isRefetching} alRefrescar={mes.refetch}>
      <CambiarMes valor={periodo} alCambiar={setPeriodo} />
      <ConDatos consulta={mes}>
        {(m) => (
          <>
            <VeredictoMes mes={m} />
            <ComoSeCalcula mes={m} />
            <GraficaMeses puntos={m.tendencia} />
            <MasVendidos productos={m.topProductos} />
            <OtrosDatos mes={m} />
          </>
        )}
      </ConDatos>
    </Pantalla>
  );
}
