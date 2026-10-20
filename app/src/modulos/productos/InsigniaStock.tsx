import type { Producto } from '@/api/tipos/productos';
import { Insignia } from '@/ui/Insignia';

/** "Agotado", "Quedan 2" o "12 und.": siempre en palabras, no solo en color. */
export function InsigniaStock({ producto }: { producto: Pick<Producto, 'stock' | 'estadoStock'> }) {
  if (producto.estadoStock === 'Agotado') return <Insignia texto="Agotado" tono="coral" />;
  if (producto.estadoStock === 'Poco') return <Insignia texto={`Quedan ${producto.stock}`} tono="miel" />;
  return <Insignia texto={`${producto.stock} und.`} tono="neutro" />;
}
