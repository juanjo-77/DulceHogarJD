import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { consulta, pedir } from '../pedir';
import type { Ajustes, Caja, Inicio, Mes, MovimientoManual, TipoMovimiento } from '../tipos/resumen';

export type MovimientoInput = { tipo: TipoMovimiento; concepto: string; monto: number; nota: string | null; fecha: string | null };

export const negocioApi = {
  inicio: () => pedir<Inicio>('/resumen/hoy'),
  mes: (anio: number, mes: number) => pedir<Mes>(`/resumen/mes${consulta({ anio, mes })}`),
  caja: (fecha: string) => pedir<Caja>(`/caja${consulta({ fecha })}`),

  movimiento: (id: number) => pedir<MovimientoManual>(`/movimientos/${id}`),
  crearMovimiento: (datos: MovimientoInput) => pedir<MovimientoManual>('/movimientos', 'POST', datos),
  editarMovimiento: ({ id, ...datos }: MovimientoInput & { id: number }) => pedir<MovimientoManual>(`/movimientos/${id}`, 'PUT', datos),
  borrarMovimiento: (id: number) => pedir<void>(`/movimientos/${id}`, 'DELETE'),

  ajustes: () => pedir<Ajustes>('/ajustes'),
  guardarAjustes: (datos: Omit<Ajustes, 'id'>) => pedir<Ajustes>('/ajustes', 'PUT', datos),
};

export const useInicio = () => useQuery({ queryKey: ['inicio'], queryFn: negocioApi.inicio });

export const useMes = (anio: number, mes: number) =>
  useQuery({ queryKey: ['mes', anio, mes], queryFn: () => negocioApi.mes(anio, mes), placeholderData: keepPreviousData });

export const useCaja = (fecha: string) =>
  useQuery({ queryKey: ['caja', fecha], queryFn: () => negocioApi.caja(fecha), placeholderData: keepPreviousData });

export const useMovimiento = (id: number) =>
  useQuery({ queryKey: ['movimiento', id], queryFn: () => negocioApi.movimiento(id), enabled: id > 0 });

export const useAjustes = () => useQuery({ queryKey: ['ajustes'], queryFn: negocioApi.ajustes });
