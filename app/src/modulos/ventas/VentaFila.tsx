import { router } from 'expo-router';

import type { VentaResumen } from '@/api/tipos/ventas';
import { cuandoFue, pesos } from '@/funciones/formato';
import { Fila } from '@/ui/Fila';
import { Insignia, type Tono } from '@/ui/Insignia';

const TIPOS: Record<VentaResumen['tipo'], { texto: string; tono: Tono }> = {
  Contado: { texto: 'Contado', tono: 'menta' },
  Fiado: { texto: 'Fiado', tono: 'rosa' },
  Separe: { texto: 'Separe', tono: 'miel' },
};

type Props = { venta: VentaResumen; ultima?: boolean; mostrarCliente?: boolean };

export function VentaFila({ venta: v, ultima, mostrarCliente = true }: Props) {
  const quien = mostrarCliente && v.cliente ? `${v.cliente.nombre} · ` : '';
  const tipo = v.estado === 'Anulada' ? { texto: 'Anulada', tono: 'neutro' as Tono } : TIPOS[v.tipo];
  return (
    <Fila
      titulo={v.descripcion}
      subtitulo={`${quien}${cuandoFue(v.fecha)} · ${pesos(v.total)}`}
      derecha={<Insignia texto={tipo.texto} tono={tipo.tono} />}
      ultima={ultima}
      onPress={() => router.push(`/venta/${v.id}`)}
    />
  );
}
