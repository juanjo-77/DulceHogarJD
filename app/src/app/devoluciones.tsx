import { router } from 'expo-router';

import { useDevoluciones } from '@/api/consultas/ventas';
import { cuandoFue, pesos } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { ConDatos } from '@/ui/Estado';
import { Fila } from '@/ui/Fila';
import { Pantalla } from '@/ui/Pantalla';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';
import { Vacio } from '@/ui/Vacio';

/** Historial de devoluciones y cambios. Para registrar una, se entra a la venta. */
export default function Devoluciones() {
  const devoluciones = useDevoluciones();

  return (
    <Pantalla volver titulo="Devoluciones y cambios">
      <Texto color={color.tintaSuave}>
        Para registrar una devolución, busca la venta (en el cliente o en Ventas) y toca "Devolución o cambio".
      </Texto>
      <ConDatos consulta={devoluciones}>
        {(lista) =>
          lista.length === 0 ? (
            <Vacio icono="swap-horizontal" titulo="No hay devoluciones" texto="¡Muy bien! Nadie ha devuelto nada." />
          ) : (
            <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
              {lista.map((d, i) => (
                <Fila
                  key={d.id}
                  titulo={`${d.cliente?.nombre ?? 'Cliente'} devolvió ${d.devuelto}`}
                  subtitulo={[cuandoFue(d.fecha), d.cambio && `se llevó ${d.cambio}`, d.montoReembolsado > 0 && `le devolviste ${pesos(d.montoReembolsado)}`]
                    .filter(Boolean)
                    .join(' · ')}
                  ultima={i === lista.length - 1}
                  onPress={() => router.push(`/venta/${d.ventaId}`)}
                />
              ))}
            </Tarjeta>
          )
        }
      </ConDatos>
    </Pantalla>
  );
}
