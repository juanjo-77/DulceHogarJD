import type { MetodoPago } from './ventas';

export interface Alerta {
  clave: string;
  tipo: 'vencida' | 'pedido' | 'entregar' | 'agotado' | 'poco' | 'proxima';
  nivel: 0 | 1 | 2;
  titulo: string;
  detalle: string;
  ruta: string;
}

export interface Inicio {
  vendidoHoy: number;
  ventasHoy: number;
  entroHoy: number;
  salioHoy: number;
  porCobrar: number;
  personasQueDeben: number;
  agotados: number;
  pocos: number;
  pedidosPendientes: number;
  porTraer: number;
  alertas: Alerta[];
}

export interface Movimiento {
  clave: string;
  fecha: string;
  entrada: boolean;
  categoria: 'Venta' | 'Abono' | 'Surtido' | 'Gasto' | 'Otro ingreso' | 'Devolución';
  concepto: string;
  monto: number;
  metodo: MetodoPago | null;
  ventaId: number | null;
  surtidoId: number | null;
  movimientoId: number | null;
}

export interface Caja {
  fecha: string;
  entradas: number;
  salidas: number;
  neto: number;
  enEfectivo: number;
  porTransferencia: number;
  movimientos: Movimiento[];
}

export type TipoMovimiento = 'Gasto' | 'Ingreso';

export interface MovimientoManual {
  id: number;
  fecha: string;
  tipo: TipoMovimiento;
  concepto: string;
  monto: number;
  nota: string | null;
}

export type NivelVeredicto = 'excelente' | 'bien' | 'regular' | 'mal' | 'sinDatos';

export interface Mes {
  anio: number;
  mes: number;
  nombreMes: string;
  esMesActual: boolean;
  vendido: number;
  numeroVentas: number;
  costoMercancia: number;
  gananciaBruta: number;
  gastos: number;
  otrosIngresos: number;
  ganancia: number;
  margen: number;
  dineroQueEntro: number;
  comprasSurtido: number;
  porCobrar: number;
  vendidoContado: number;
  vendidoFiado: number;
  vendidoSepare: number;
  gananciaMesAnterior: number;
  vendidoMesAnterior: number;
  nombreMesAnterior: string;
  veredicto: { nivel: NivelVeredicto; titulo: string; mensaje: string };
  tendencia: { anio: number; mes: number; etiqueta: string; vendido: number; ganancia: number }[];
  topProductos: { productoId: number; nombre: string; unidades: number; vendido: number }[];
  gastosDelMes: Movimiento[];
}

export interface Ajustes {
  id: number;
  nombreNegocio: string;
  telefono: string | null;
  mensajeRecibo: string | null;
}
