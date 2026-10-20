import { router } from 'expo-router';

import type { ClienteDetalle } from '@/api/tipos/clientes';
import { pesos } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { Seccion } from '@/ui/Seccion';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

import { CuentaFila } from '../cobrar/CuentaFila';

/** Lo que el cliente debe y el botón para mandarle su estado de cuenta. */
export function CuentasCliente({ detalle }: { detalle: ClienteDetalle }) {
  const { cliente, cuentas } = detalle;
  if (cuentas.length === 0) {
    return (
      <Tarjeta tono="lino">
        <Texto tipo="fuerte" color={color.menta}>{cliente.nombre.split(' ')[0]} no te debe nada.</Texto>
      </Tarjeta>
    );
  }

  return (
    <Seccion titulo="Cuentas pendientes">
      <Tarjeta tono="rosa">
        <Texto color={color.tintaSuave}>Te debe en total</Texto>
        <Texto tipo="cifra" color={color.frambuesaHundida}>{pesos(cliente.debe)}</Texto>
        <Boton
          titulo="Enviar estado de cuenta"
          icono="image-text"
          onPress={() => router.push(`/cliente/estado/${cliente.id}`)}
        />
      </Tarjeta>
      <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
        {cuentas.map((c, i) => (
          <CuentaFila key={c.ventaId} cuenta={c} mostrarCliente={false} ultima={i === cuentas.length - 1} />
        ))}
      </Tarjeta>
    </Seccion>
  );
}
