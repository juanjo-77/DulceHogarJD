import type { Cliente } from '@/api/tipos/clientes';
import { espacio } from '@/tema/tokens';
import { Fila } from '@/ui/Fila';
import { Icono } from '@/ui/Icono';
import { Seccion } from '@/ui/Seccion';
import { Tarjeta } from '@/ui/Tarjeta';

/** Cédula, dirección y notas: solo se muestra lo que se guardó. */
export function DatosCliente({ cliente }: { cliente: Cliente }) {
  const datos = [
    { icono: 'card-account-details-outline' as const, titulo: 'Cédula', valor: cliente.cedula },
    { icono: 'map-marker-outline' as const, titulo: 'Dirección', valor: cliente.direccion },
    { icono: 'note-text-outline' as const, titulo: 'Notas', valor: cliente.notas },
  ].filter((d) => d.valor);

  if (datos.length === 0) return null;

  return (
    <Seccion titulo="Datos">
      <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
        {datos.map((d, i) => (
          <Fila key={d.titulo} titulo={d.valor!} subtitulo={d.titulo} izquierda={<Icono nombre={d.icono} />} ultima={i === datos.length - 1} />
        ))}
      </Tarjeta>
    </Seccion>
  );
}
