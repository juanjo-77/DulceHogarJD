import type { PorTraer, SurtidoItemInput } from '@/api/tipos/surtido';

/** Un renglón de mercancía que llegó, mientras se está llenando el formulario. */
export type RenglonSurtido = {
  clave: string;
  productoId: number | null;
  nombre: string;
  icono: string | null;
  cantidad: number;
  costo: number;
  porTraerId: number | null;
  /** Solo para productos que todavía no existen en el inventario. */
  nuevo: { categoriaId: number; precioVenta: number } | null;
};

let contador = 0;
export const nuevaClave = () => `r${++contador}`;

/** Lo que se marcó como conseguido en la lista se convierte en renglones del formulario. */
export function desdeLista(items: PorTraer[]): RenglonSurtido[] {
  return items
    .filter((i) => i.conseguido)
    .map((i) => ({
      clave: nuevaClave(),
      productoId: i.productoId,
      nombre: i.descripcion,
      icono: i.icono,
      cantidad: i.cantidad,
      costo: i.costoReferencia ?? 0,
      porTraerId: i.id,
      nuevo: i.productoId ? null : { categoriaId: 0, precioVenta: 0 },
    }));
}

export function aEntrada(r: RenglonSurtido): SurtidoItemInput {
  return {
    productoId: r.productoId,
    nuevo: r.nuevo ? { nombre: r.nombre, categoriaId: r.nuevo.categoriaId, precioVenta: r.nuevo.precioVenta, stockMinimo: null } : null,
    cantidad: r.cantidad,
    costoUnitario: r.costo,
    porTraerId: r.porTraerId,
  };
}
