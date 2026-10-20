import { router } from 'expo-router';

import { encargosApi } from '@/api/consultas/clientes';
import { productosApi } from '@/api/consultas/productos';
import type { Encargo } from '@/api/tipos/clientes';
import { useAccion } from '@/api/useAccion';
import { useAviso } from '@/ui/Aviso';
import { Boton } from '@/ui/Boton';
import { useConfirmar } from '@/ui/Dialogo';

import { carrito } from '../vender/carrito';

/** Marcar listo, mandar a surtir lo que falta, entregar y cobrar, o cancelar. */
export function AccionesPedido({ pedido: p }: { pedido: Encargo }) {
  const aviso = useAviso();
  const confirmar = useConfirmar();
  const estado = useAccion(encargosApi.cambiarEstado, { exito: 'Pedido actualizado' });
  const aSurtir = useAccion(encargosApi.aSurtir, {
    exito: (r) => (r.agregados > 0 ? 'Anotado en la lista para surtir' : 'Ya estaba en la lista para surtir'),
  });

  if (p.estado === 'Entregado' || p.estado === 'Cancelado') {
    return p.ventaId ? <Boton titulo="Ver la venta" icono="receipt-text-outline" variante="borde" onPress={() => router.push(`/venta/${p.ventaId}`)} /> : null;
  }

  const entregar = async () => {
    const productos = await productosApi.lista({});
    const lineas = p.items
      .filter((i) => i.productoId)
      .map((i) => ({ producto: productos.find((x) => x.id === i.productoId)!, cantidad: i.cantidad }))
      .filter((l) => l.producto && l.producto.stock > 0)
      .map((l) => ({ ...l, cantidad: Math.min(l.cantidad, l.producto.stock) }));
    if (lineas.length === 0) return aviso.error('Todavía no tienes en inventario lo de este pedido.');
    carrito.desdePedido(lineas, p.cliente, p.id);
    router.navigate('/vender');
  };

  return (
    <>
      <Boton titulo="Entregar y cobrar" icono="cart-heart" grande onPress={entregar} />
      {p.estado === 'Pendiente' && (
        <Boton titulo="Ya lo tengo listo" icono="check" variante="suave" cargando={estado.isPending} onPress={() => estado.mutate({ id: p.id, estado: 'Listo' })} />
      )}
      {!p.enListaSurtir && (
        <Boton titulo="Anotar lo que falta para surtir" icono="truck-delivery-outline" variante="borde" cargando={aSurtir.isPending} onPress={() => aSurtir.mutate(p.id)} />
      )}
      <Boton titulo="Editar pedido" icono="pencil" variante="borde" onPress={() => router.push(`/pedido/editar?id=${p.id}`)} />
      <Boton
        titulo="Cancelar pedido"
        icono="close-circle-outline"
        variante="peligro"
        onPress={async () => {
          if (await confirmar({ titulo: '¿Cancelar este pedido?', confirmar: 'Sí, cancelar', peligro: true }))
            estado.mutate({ id: p.id, estado: 'Cancelado' });
        }}
      />
    </>
  );
}
