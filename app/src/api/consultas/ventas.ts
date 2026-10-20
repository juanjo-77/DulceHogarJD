import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { consulta, pedir } from '../pedir';
import type { Cuenta, Devolucion, MetodoPago, Recibo, TipoVenta, VentaDetalle, VentaInput, VentaItemInput, VentaResumen } from '../tipos/ventas';

export type DevolucionInput = {
  items: { ventaItemId: number; cantidad: number }[];
  vuelveAlInventario: boolean;
  cambio: VentaItemInput[] | null;
  montoReembolsado: number;
  motivo: string | null;
};

export const ventasApi = {
  lista: (f: { desde?: string; hasta?: string; tipo?: TipoVenta }) => pedir<VentaResumen[]>(`/ventas${consulta(f)}`),
  detalle: (id: number) => pedir<VentaDetalle>(`/ventas/${id}`),
  crear: (datos: VentaInput) => pedir<VentaDetalle>('/ventas', 'POST', datos),
  abonar: ({ id, ...datos }: { id: number; monto: number; metodo: MetodoPago; nota: string | null }) =>
    pedir<Recibo>(`/ventas/${id}/abonos`, 'POST', datos),
  entregar: (id: number) => pedir<VentaDetalle>(`/ventas/${id}/entregar`, 'POST'),
  anular: ({ id, ...datos }: { id: number; montoReembolsado: number; motivo: string | null }) =>
    pedir<VentaDetalle>(`/ventas/${id}/anular`, 'POST', datos),
  devolver: ({ id, ...datos }: DevolucionInput & { id: number }) => pedir<VentaDetalle>(`/ventas/${id}/devoluciones`, 'POST', datos),
  cuentas: (tipo: TipoVenta | null) => pedir<Cuenta[]>(`/cuentas${consulta({ tipo })}`),
  recibo: (id: number) => pedir<Recibo>(`/abonos/${id}/recibo`),
  borrarAbono: (id: number) => pedir<void>(`/abonos/${id}`, 'DELETE'),
  devoluciones: () => pedir<Devolucion[]>('/devoluciones'),
};

export const useVenta = (id: number) =>
  useQuery({ queryKey: ['venta', id], queryFn: () => ventasApi.detalle(id), enabled: id > 0 });

export const useVentas = (f: { desde?: string; hasta?: string }) =>
  useQuery({ queryKey: ['ventas', f], queryFn: () => ventasApi.lista(f) });

export const useCuentas = (tipo: TipoVenta | null) =>
  useQuery({ queryKey: ['cuentas', tipo], queryFn: () => ventasApi.cuentas(tipo), placeholderData: keepPreviousData });

export const useRecibo = (id: number) =>
  useQuery({ queryKey: ['recibo', id], queryFn: () => ventasApi.recibo(id), enabled: id > 0 });

export const useDevoluciones = () => useQuery({ queryKey: ['devoluciones'], queryFn: ventasApi.devoluciones });
