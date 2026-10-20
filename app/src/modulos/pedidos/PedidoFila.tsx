import { router } from 'expo-router';

import type { Encargo } from '@/api/tipos/clientes';
import { cuandoToca } from '@/funciones/formato';
import { Fila } from '@/ui/Fila';

import { EstadoPedido } from './EstadoPedido';

export function PedidoFila({ pedido: p, ultima }: { pedido: Encargo; ultima?: boolean }) {
  const cerrado = p.estado === 'Entregado' || p.estado === 'Cancelado';
  return (
    <Fila
      titulo={p.cliente.nombre}
      subtitulo={`${p.descripcion}${cerrado ? '' : ` · entregar ${cuandoToca(p.diasRestantes)}`}`}
      derecha={<EstadoPedido pedido={p} />}
      ultima={ultima}
      onPress={() => router.push(`/pedido/${p.id}`)}
    />
  );
}
