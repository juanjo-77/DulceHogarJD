import { useQuery } from '@tanstack/react-query';

import { pedir } from '../pedir';
import type { PorTraer, PorTraerInput, Proveedor, SurtidoDetalle, SurtidoInput, SurtidoResumen } from '../tipos/surtido';

export const surtidoApi = {
  lista: () => pedir<PorTraer[]>('/surtir/lista'),
  anotar: (datos: PorTraerInput) => pedir<PorTraer[]>('/surtir/lista', 'POST', datos),
  editar: ({ id, ...datos }: PorTraerInput & { id: number }) => pedir<PorTraer[]>(`/surtir/lista/${id}`, 'PUT', datos),
  marcar: ({ id, conseguido }: { id: number; conseguido: boolean }) => pedir<PorTraer[]>(`/surtir/lista/${id}/conseguido`, 'POST', { conseguido }),
  quitar: (id: number) => pedir<PorTraer[]>(`/surtir/lista/${id}`, 'DELETE'),
  sugerir: () => pedir<{ agregados: number; lista: PorTraer[] }>('/surtir/lista/sugerir', 'POST'),

  surtidos: () => pedir<SurtidoResumen[]>('/surtidos'),
  surtido: (id: number) => pedir<SurtidoDetalle>(`/surtidos/${id}`),
  registrar: (datos: SurtidoInput) => pedir<SurtidoDetalle>('/surtidos', 'POST', datos),
  borrarSurtido: (id: number) => pedir<void>(`/surtidos/${id}`, 'DELETE'),

  proveedores: () => pedir<Proveedor[]>('/proveedores'),
};

export const useListaSurtir = () => useQuery({ queryKey: ['porTraer'], queryFn: surtidoApi.lista });
export const useSurtidos = () => useQuery({ queryKey: ['surtidos'], queryFn: surtidoApi.surtidos });
export const useSurtido = (id: number) => useQuery({ queryKey: ['surtido', id], queryFn: () => surtidoApi.surtido(id), enabled: id > 0 });
export const useProveedores = () => useQuery({ queryKey: ['proveedores'], queryFn: surtidoApi.proveedores });
