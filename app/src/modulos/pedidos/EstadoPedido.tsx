import type { Encargo } from '@/api/tipos/clientes';
import { Insignia } from '@/ui/Insignia';

/** Estado del pedido en palabras; si ya se pasó la fecha, lo dice en rojo. */
export function EstadoPedido({ pedido: p }: { pedido: Pick<Encargo, 'estado' | 'diasRestantes'> }) {
  if (p.estado === 'Entregado') return <Insignia texto="Entregado" tono="menta" />;
  if (p.estado === 'Cancelado') return <Insignia texto="Cancelado" tono="neutro" />;
  if (p.diasRestantes < 0) return <Insignia texto="Atrasado" tono="coral" />;
  if (p.estado === 'Listo') return <Insignia texto="Listo" tono="menta" />;
  return <Insignia texto={p.diasRestantes <= 1 ? 'Pronto' : 'Pendiente'} tono={p.diasRestantes <= 1 ? 'miel' : 'rosa'} />;
}
