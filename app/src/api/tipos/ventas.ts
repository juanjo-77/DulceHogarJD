export type TipoVenta = 'Contado' | 'Fiado' | 'Separe';
export type MetodoPago = 'Efectivo' | 'Transferencia';
export type EstadoCuenta = 'Debe' | 'Vencida' | 'ParaEntregar' | 'AlDia' | 'Anulada';

export interface ClienteMini {
  id: number;
  nombre: string;
  telefono: string | null;
}

export interface VentaResumen {
  id: number;
  fecha: string;
  tipo: TipoVenta;
  estado: EstadoCuenta;
  cliente: ClienteMini | null;
  descripcion: string;
  total: number;
  pagado: number;
  saldo: number;
  fechaLimite: string | null;
  entregada: boolean;
}

export interface VentaItem {
  id: number;
  productoId: number;
  nombre: string;
  cantidad: number;
  cantidadDevuelta: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Abono {
  id: number;
  fecha: string;
  monto: number;
  metodo: MetodoPago;
  nota: string | null;
}

export interface Devolucion {
  id: number;
  ventaId: number;
  fecha: string;
  devuelto: string;
  cambio: string | null;
  vuelveAlInventario: boolean;
  montoReembolsado: number;
  motivo: string | null;
  cliente: ClienteMini | null;
}

export interface VentaDetalle extends Omit<VentaResumen, 'descripcion'> {
  items: VentaItem[];
  abonos: Abono[];
  devoluciones: Devolucion[];
  diasRestantes: number | null;
  entregadaEn: string | null;
  anulada: boolean;
  notas: string | null;
  encargoId: number | null;
}

export interface Cuenta {
  ventaId: number;
  tipo: TipoVenta;
  estado: EstadoCuenta;
  cliente: ClienteMini | null;
  descripcion: string;
  fecha: string;
  total: number;
  pagado: number;
  saldo: number;
  fechaLimite: string | null;
  diasRestantes: number | null;
  ultimoAbono: string | null;
}

export interface Recibo {
  numero: number;
  fecha: string;
  monto: number;
  metodo: MetodoPago;
  nota: string | null;
  ventaId: number;
  tipo: TipoVenta;
  cliente: ClienteMini | null;
  descripcion: string;
  total: number;
  pagadoHastaAhora: number;
  saldoDespues: number;
  negocio: { nombre: string; telefono: string | null; mensaje: string | null };
}

export interface VentaItemInput {
  productoId: number;
  cantidad: number;
  precioUnitario?: number | null;
}

export interface VentaInput {
  clienteId: number | null;
  tipo: TipoVenta;
  items: VentaItemInput[];
  abonoInicial: number;
  metodo: MetodoPago;
  fechaLimite: string | null;
  notas: string | null;
  encargoId: number | null;
}
