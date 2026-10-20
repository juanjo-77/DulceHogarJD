import { useLocalSearchParams } from 'expo-router';

import { useVenta } from '@/api/consultas/ventas';
import { AccionesVenta } from '@/modulos/ventas/AccionesVenta';
import { EstadoVenta } from '@/modulos/ventas/EstadoVenta';
import { HistorialVenta } from '@/modulos/ventas/HistorialVenta';
import { NuevaVenta } from '@/modulos/ventas/NuevaVenta';
import { ConDatos } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';

const TITULOS = { Contado: 'Venta de contado', Fiado: 'Fiado', Separe: 'Plan separe' } as const;

export default function DetalleVenta() {
  const params = useLocalSearchParams<{ id: string; nueva?: string }>();
  const consulta = useVenta(Number(params.id));

  return (
    <Pantalla
      volver
      titulo={consulta.data ? TITULOS[consulta.data.tipo] : undefined}
      subtitulo={consulta.data?.cliente?.nombre}
      refrescando={consulta.isRefetching}
      alRefrescar={consulta.refetch}>
      <ConDatos consulta={consulta}>
        {(v) => (
          <>
            {params.nueva && <NuevaVenta venta={v} />}
            <EstadoVenta venta={v} />
            <AccionesVenta venta={v} />
            <HistorialVenta venta={v} />
          </>
        )}
      </ConDatos>
    </Pantalla>
  );
}
