import { useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import type { Vista } from '@/ui/vista';

import { useCliente } from '@/api/consultas/clientes';
import { useAjustes } from '@/api/consultas/negocio';
import { mensajeEstadoCuenta } from '@/funciones/mensajes';
import { BotonesCompartir } from '@/modulos/compartir/BotonesCompartir';
import { TarjetaEstadoCuenta } from '@/modulos/compartir/TarjetaEstadoCuenta';
import { ConDatos } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';
import { Vacio } from '@/ui/Vacio';

export default function EstadoDeCuenta() {
  const id = Number(useLocalSearchParams<{ id: string }>().id);
  const consulta = useCliente(id);
  const ajustes = useAjustes();
  const tarjeta = useRef<Vista>(null);

  return (
    <Pantalla volver titulo="Estado de cuenta" subtitulo="Se arma con lo que debe hoy">
      <ConDatos consulta={consulta}>
        {({ cliente, cuentas }) => {
          const deudas = cuentas.filter((c) => c.saldo > 0);
          if (deudas.length === 0) return <Vacio icono="check-decagram" titulo={`${cliente.nombre} no te debe nada`} />;
          return (
            <>
              <TarjetaEstadoCuenta ref={tarjeta} cliente={cliente} cuentas={deudas} negocio={ajustes.data} />
              <BotonesCompartir
                tarjeta={tarjeta}
                nombreArchivo={`estado-de-cuenta-${cliente.nombre.replace(/\s+/g, '-').toLowerCase()}`}
                mensaje={mensajeEstadoCuenta(cliente.nombre, deudas, ajustes.data?.nombreNegocio)}
                telefono={cliente.telefono}
              />
            </>
          );
        }}
      </ConDatos>
    </Pantalla>
  );
}
