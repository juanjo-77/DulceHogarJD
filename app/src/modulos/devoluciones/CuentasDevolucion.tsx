import { useEffect } from 'react';

import type { VentaDetalle } from '@/api/tipos/ventas';
import { pesos } from '@/funciones/formato';
import { color } from '@/tema/tokens';
import { CampoDinero } from '@/ui/CampoDinero';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

import type { Linea } from '../vender/carrito';

type Props = {
  venta: VentaDetalle;
  devueltos: Record<number, number>;
  cambio: Linea[];
  reembolso: number;
  alCambiarReembolso: (n: number) => void;
};

/** Hace las cuentas por ella: si queda debiendo, si hay que devolverle plata o si quedan a mano. */
export function CuentasDevolucion({ venta, devueltos, cambio, reembolso, alCambiarReembolso }: Props) {
  const valorDevuelto = venta.items.reduce((s, i) => s + (devueltos[i.id] ?? 0) * i.precioUnitario, 0);
  const valorCambio = cambio.reduce((s, l) => s + l.cantidad * l.producto.precioVenta, 0);
  const nuevoTotal = venta.total - valorDevuelto + valorCambio;
  const aFavor = Math.max(venta.pagado - nuevoTotal, 0);
  const debe = Math.max(nuevoTotal - venta.pagado, 0);

  // Si cambian las cuentas, el reembolso nunca puede pasarse de lo que se le debe.
  useEffect(() => {
    if (reembolso > aFavor) alCambiarReembolso(aFavor);
  }, [aFavor, reembolso, alCambiarReembolso]);

  if (valorDevuelto === 0) return null;

  return (
    <Tarjeta tono="lino">
      <Texto>Devuelve {pesos(valorDevuelto)}{valorCambio > 0 && ` y se lleva ${pesos(valorCambio)}`}.</Texto>
      {aFavor > 0 && (
        <CampoDinero
          etiqueta="¿Cuánta plata le devolviste?"
          valor={reembolso}
          alCambiar={alCambiarReembolso}
          ayuda={`Le corresponden hasta ${pesos(aFavor)}.`}
          rapidos={[
            { titulo: 'Nada', valor: 0 },
            { titulo: `Todo (${pesos(aFavor)})`, valor: aFavor },
          ]}
        />
      )}
      {debe > 0 && (
        <Texto tipo="fuerte" color={color.frambuesaHundida}>Con el cambio queda debiendo {pesos(debe)}.</Texto>
      )}
      {aFavor === 0 && debe === 0 && <Texto tipo="fuerte" color={color.menta}>Quedan a mano.</Texto>}
    </Tarjeta>
  );
}
