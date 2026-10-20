import { useSyncExternalStore } from 'react';

import type { Producto } from '@/api/tipos/productos';
import type { ClienteMini } from '@/api/tipos/ventas';

export type Linea = { producto: Producto; cantidad: number };

type Estado = {
  lineas: Linea[];
  cliente: ClienteMini | null;
  /** Si la venta sale de un pedido, al registrarla el pedido queda entregado. */
  encargoId: number | null;
};

const VACIO: Estado = { lineas: [], cliente: null, encargoId: null };

let estado: Estado = VACIO;
const oyentes = new Set<() => void>();

function cambiar(nuevo: Estado) {
  estado = nuevo;
  oyentes.forEach((o) => o());
}

/** Carrito de la venta en curso. Vive fuera de las pantallas para no perderse al navegar. */
export const carrito = {
  agregar(producto: Producto) {
    const existe = estado.lineas.find((l) => l.producto.id === producto.id);
    if (existe && existe.cantidad >= producto.stock) return;
    cambiar({
      ...estado,
      lineas: existe
        ? estado.lineas.map((l) => (l === existe ? { ...l, cantidad: l.cantidad + 1 } : l))
        : [...estado.lineas, { producto, cantidad: 1 }],
    });
  },
  poner(productoId: number, cantidad: number) {
    cambiar({
      ...estado,
      lineas: cantidad <= 0
        ? estado.lineas.filter((l) => l.producto.id !== productoId)
        : estado.lineas.map((l) => (l.producto.id === productoId ? { ...l, cantidad } : l)),
    });
  },
  elegirCliente(cliente: ClienteMini | null) {
    cambiar({ ...estado, cliente });
  },
  desdePedido(lineas: Linea[], cliente: ClienteMini, encargoId: number) {
    cambiar({ lineas, cliente, encargoId });
  },
  vaciar() {
    cambiar(VACIO);
  },
};

export function useCarrito() {
  const actual = useSyncExternalStore(
    (oyente) => {
      oyentes.add(oyente);
      return () => oyentes.delete(oyente);
    },
    () => estado,
  );
  const total = actual.lineas.reduce((s, l) => s + l.cantidad * l.producto.precioVenta, 0);
  const unidades = actual.lineas.reduce((s, l) => s + l.cantidad, 0);
  return { ...actual, total, unidades };
}
