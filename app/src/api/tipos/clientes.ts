import type { EncargoItem } from './surtido';
import type { ClienteMini, Cuenta, VentaResumen } from './ventas';

export interface Cliente {
  id: number;
  nombre: string;
  telefono: string | null;
  cedula: string | null;
  direccion: string | null;
  notas: string | null;
  debe: number;
  cuentasAbiertas: number;
  ultimaCompra: string | null;
}

export interface ClienteInput {
  nombre: string;
  telefono: string | null;
  cedula: string | null;
  direccion: string | null;
  notas: string | null;
}

export type EstadoEncargo = 'Pendiente' | 'Listo' | 'Entregado' | 'Cancelado';

export interface Encargo {
  id: number;
  cliente: ClienteMini;
  fechaEntrega: string;
  diasRestantes: number;
  estado: EstadoEncargo;
  notas: string | null;
  items: EncargoItem[];
  creadoEn: string;
  ventaId: number | null;
  enListaSurtir: boolean;
  descripcion: string;
}

export interface EncargoInput {
  clienteId: number;
  fechaEntrega: string;
  notas: string | null;
  items: { productoId: number | null; descripcion: string | null; cantidad: number }[];
}

export interface ClienteDetalle {
  cliente: Cliente;
  totalComprado: number;
  compras: number;
  cuentas: Cuenta[];
  historial: VentaResumen[];
  encargos: Encargo[];
}
