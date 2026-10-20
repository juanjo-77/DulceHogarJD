import { useState } from 'react';

import { BarraCarrito } from '@/modulos/vender/BarraCarrito';
import { useCarrito } from '@/modulos/vender/carrito';
import { PasoPago } from '@/modulos/vender/PasoPago';
import { PasoProductos } from '@/modulos/vender/PasoProductos';
import { ResumenCarrito } from '@/modulos/vender/ResumenCarrito';
import { Pantalla } from '@/ui/Pantalla';

/** Vender en dos pasos: qué se lleva y cómo paga. */
export default function Vender() {
  const [paso, setPaso] = useState<'productos' | 'pago'>('productos');
  const { lineas, total, unidades } = useCarrito();
  const enPago = paso === 'pago' && lineas.length > 0;

  return (
    <Pantalla
      titulo={enPago ? '¿Cómo te paga?' : '¿Qué vas a vender?'}
      subtitulo={enPago ? 'Paso 2 de 2' : 'Paso 1 de 2 · Toca los productos'}
      pie={enPago ? undefined : <BarraCarrito unidades={unidades} total={total} alContinuar={() => setPaso('pago')} />}>
      <ResumenCarrito editable={!enPago} />
      {enPago ? <PasoPago alVolver={() => setPaso('productos')} alTerminar={() => setPaso('productos')} /> : <PasoProductos />}
    </Pantalla>
  );
}
