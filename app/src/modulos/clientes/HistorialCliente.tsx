import { router } from 'expo-router';
import { View } from 'react-native';

import type { ClienteDetalle } from '@/api/tipos/clientes';
import { cuandoToca, pesos, plural } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { Fila } from '@/ui/Fila';
import { Seccion } from '@/ui/Seccion';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

import { VentaFila } from '../ventas/VentaFila';

/** Pedidos pendientes y todo lo que ha comprado. */
export function HistorialCliente({ detalle }: { detalle: ClienteDetalle }) {
  const { encargos, historial, totalComprado, compras } = detalle;

  return (
    <View style={{ gap: espacio.l }}>
      {encargos.length > 0 && (
        <Seccion titulo="Pedidos por entregar">
          <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
            {encargos.map((e, i) => (
              <Fila
                key={e.id}
                titulo={e.descripcion}
                subtitulo={`Entregar ${cuandoToca(e.diasRestantes)}`}
                ultima={i === encargos.length - 1}
                onPress={() => router.push(`/pedido/${e.id}`)}
              />
            ))}
          </Tarjeta>
        </Seccion>
      )}

      <Seccion titulo="Compras">
        {historial.length === 0 ? (
          <Texto color={color.tintaSuave}>Todavía no le has vendido nada.</Texto>
        ) : (
          <>
            <Texto color={color.tintaSuave}>
              {plural(compras, 'compra', 'compras')} por {pesos(totalComprado)} en total.
            </Texto>
            <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
              {historial.slice(0, 15).map((v, i, lista) => (
                <VentaFila key={v.id} venta={v} mostrarCliente={false} ultima={i === lista.length - 1} />
              ))}
            </Tarjeta>
          </>
        )}
      </Seccion>
    </View>
  );
}
