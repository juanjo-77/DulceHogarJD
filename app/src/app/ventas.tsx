import { useState } from 'react';

import { useVentas } from '@/api/consultas/ventas';
import { aFechaApi, pesos, plural, sumarDias } from '@/funciones/formato';
import { VentaFila } from '@/modulos/ventas/VentaFila';
import { color, espacio } from '@/tema/tokens';
import { ConDatos } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';
import { Segmento } from '@/ui/Segmento';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';
import { Vacio } from '@/ui/Vacio';

const PERIODOS = { hoy: 0, semana: 6, mes: 29 } as const;
type Periodo = keyof typeof PERIODOS;

/** Historial de ventas de hoy, la semana o el mes. */
export default function Ventas() {
  const [periodo, setPeriodo] = useState<Periodo>('semana');
  const hoy = new Date();
  const ventas = useVentas({ desde: aFechaApi(sumarDias(hoy, -PERIODOS[periodo])), hasta: aFechaApi(hoy) });

  return (
    <Pantalla volver titulo="Ventas" refrescando={ventas.isRefetching} alRefrescar={ventas.refetch}>
      <Segmento
        valor={periodo}
        alCambiar={setPeriodo}
        opciones={[
          { valor: 'hoy', titulo: 'Hoy' },
          { valor: 'semana', titulo: '7 días' },
          { valor: 'mes', titulo: '30 días' },
        ]}
      />
      <ConDatos consulta={ventas}>
        {(lista) => {
          const validas = lista.filter((v) => v.estado !== 'Anulada');
          if (lista.length === 0) return <Vacio icono="receipt-text-outline" titulo="No hay ventas en estos días" />;
          return (
            <>
              <Texto color={color.tintaSuave}>
                {plural(validas.length, 'venta', 'ventas')} por {pesos(validas.reduce((s, v) => s + v.total, 0))}
              </Texto>
              <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
                {lista.map((v, i) => (
                  <VentaFila key={v.id} venta={v} ultima={i === lista.length - 1} />
                ))}
              </Tarjeta>
            </>
          );
        }}
      </ConDatos>
    </Pantalla>
  );
}
