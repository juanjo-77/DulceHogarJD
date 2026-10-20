export interface EncargoItem {
  id: number;
  productoId: number | null;
  descripcion: string;
  cantidad: number;
  precioVenta: number | null;
  stock: number | null;
}

export interface PorTraer {
  id: number;
  productoId: number | null;
  descripcion: string;
  icono: string | null;
  cantidad: number;
  conseguido: boolean;
  nota: string | null;
  stock: number | null;
  costoReferencia: number | null;
  encargoId: number | null;
  creadoEn: string;
}

export interface PorTraerInput {
  productoId: number | null;
  descripcion: string | null;
  cantidad: number;
  nota: string | null;
}

export interface Proveedor {
  id: number;
  nombre: string;
  telefono: string | null;
  notas: string | null;
  totalComprado: number;
  ultimaCompra: string | null;
}

export interface SurtidoResumen {
  id: number;
  fecha: string;
  proveedor: string | null;
  total: number;
  unidades: number;
  descripcion: string;
}

export interface SurtidoDetalle {
  id: number;
  fecha: string;
  proveedorId: number | null;
  proveedor: string | null;
  notas: string | null;
  total: number;
  items: { id: number; productoId: number; nombre: string; cantidad: number; costoUnitario: number; subtotal: number }[];
}

export interface SurtidoItemInput {
  productoId: number | null;
  nuevo: { nombre: string; categoriaId: number; precioVenta: number; stockMinimo: number | null } | null;
  cantidad: number;
  costoUnitario: number;
  porTraerId: number | null;
}

export interface SurtidoInput {
  proveedorId: number | null;
  proveedorNombre: string | null;
  notas: string | null;
  items: SurtidoItemInput[];
  actualizarCosto: boolean;
}
