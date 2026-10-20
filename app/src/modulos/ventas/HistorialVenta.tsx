import { router } from 'expo-router';

import { ventasApi } from '@/api/consultas/ventas';
import type { VentaDetalle } from '@/api/tipos/ventas';
import { useAccion } from '@/api/useAccion';
import { fechaCorta, hora, pesos } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { useConfirmar } from '@/ui/Dialogo';
import { Fila } from '@/ui/Fila';
import { Seccion } from '@/ui/Seccion';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

/** Qué se llevó, los abonos (cada uno con su recibo) y las devoluciones. */
export function HistorialVenta({ venta: v }: { venta: VentaDetalle }) {
  const confirmar = useConfirmar();
  const anular = useAccion(ventasApi.anular, { exito: 'Venta anulada. Los productos volvieron al inventario' });

  return (
    <>
      <Seccion titulo="Productos">
        <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
          {v.items.map((i, n) => (
            <Fila
              key={i.id}
              titulo={`${i.cantidad - i.cantidadDevuelta} × ${i.nombre}`}
              subtitulo={i.cantidadDevuelta > 0 ? `Devolvió ${i.cantidadDevuelta}` : `${pesos(i.precioUnitario)} cada uno`}
              derecha={<Texto tipo="fuerte">{pesos(i.subtotal)}</Texto>}
              ultima={n === v.items.length - 1}
            />
          ))}
        </Tarjeta>
      </Seccion>

      {v.abonos.length > 0 && (
        <Seccion titulo={v.tipo === 'Contado' ? 'Pago' : 'Abonos'} ayuda="Toca un abono para ver o enviar su recibo.">
          <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
            {v.abonos.map((a, n) => (
              <Fila
                key={a.id}
                titulo={pesos(a.monto)}
                subtitulo={`${fechaCorta(a.fecha)}, ${hora(a.fecha)} · ${a.metodo === 'Efectivo' ? 'Efectivo' : 'Transferencia'}${a.nota ? ` · ${a.nota}` : ''}`}
                ultima={n === v.abonos.length - 1}
                onPress={() => router.push(`/recibo/${a.id}`)}
              />
            ))}
          </Tarjeta>
        </Seccion>
      )}

      {v.devoluciones.length > 0 && (
        <Seccion titulo="Devoluciones y cambios">
          <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
            {v.devoluciones.map((d, n) => (
              <Fila
                key={d.id}
                titulo={`Devolvió: ${d.devuelto}`}
                subtitulo={[d.cambio && `Se llevó: ${d.cambio}`, d.montoReembolsado > 0 && `Le devolviste ${pesos(d.montoReembolsado)}`, d.motivo]
                  .filter(Boolean)
                  .join(' · ')}
                ultima={n === v.devoluciones.length - 1}
              />
            ))}
          </Tarjeta>
        </Seccion>
      )}

      {!v.anulada && (
        <Seccion titulo="¿Algo salió mal?">
          <Boton titulo="Devolución o cambio" icono="swap-horizontal" variante="borde" onPress={() => router.push(`/venta/devolver/${v.id}`)} />
          <Boton
            titulo="Anular venta"
            icono="close-circle-outline"
            variante="peligro"
            cargando={anular.isPending}
            onPress={async () => {
              const si = await confirmar({
                titulo: '¿Anular esta venta?',
                mensaje: 'Los productos vuelven al inventario. Si le devolviste plata, regístralo como devolución.',
                confirmar: 'Sí, anular',
                peligro: true,
              });
              if (si) anular.mutate({ id: v.id, montoReembolsado: 0, motivo: null });
            }}
          />
        </Seccion>
      )}
      {v.anulada && <Texto color={color.coral} centrado>Esta venta fue anulada.</Texto>}
    </>
  );
}
