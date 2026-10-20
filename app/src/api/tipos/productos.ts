export type EstadoStock = 'Agotado' | 'Poco' | 'Bien';

export interface Categoria {
  id: number;
  nombre: string;
  icono: string;
  orden: number;
  productos: number;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  categoriaId: number;
  categoria: string;
  icono: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  foto: string | null;
  estadoStock: EstadoStock;
}

export interface ProductoDetalle {
  producto: Producto;
  unidadesVendidas: number;
  enListaSurtir: boolean;
  ultimoSurtido: string | null;
}

export interface ProductoInput {
  nombre: string;
  descripcion: string | null;
  categoriaId: number;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
}
