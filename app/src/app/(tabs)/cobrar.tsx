import { useState } from 'react';

import { useCuentas } from '@/api/consultas/ventas';
import type { TipoVenta } from '@/api/tipos/ventas';
import { pesos, plural } from '@/funciones/formato';
import { CuentaFila } from '@/modulos/cobrar/CuentaFila';
import { color, espacio } from '@/tema/tokens';
import { ConDatos } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';
import { Segmento } from '@/ui/Segmento';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';
import { Vacio } from '@/ui/Vacio';

type Filtro = 'todos' | TipoVenta;

export default function Cobrar() {
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const cuentas = useCuentas(filtro === 'todos' ? null : filtro);

  return (
    <Pantalla titulo="Me deben" subtitulo="Toca una cuenta para recibir un abono" refrescando={cuentas.isRefetching} alRefrescar={cuentas.refetch}>
      <Segmento
        valor={filtro}
        alCambiar={setFiltro}
        opciones={[
          { valor: 'todos', titulo: 'Todos' },
          { valor: 'Fiado', titulo: 'Fiados' },
          { valor: 'Separe', titulo: 'Plan separe' },
        ]}
      />
      <ConDatos consulta={cuentas}>
        {(lista) => {
          if (lista.length === 0)
            return <Vacio icono="emoticon-happy-outline" titulo="Nadie te debe" texto="Cuando fíes o separes un producto, aparecerá aquí." />;
          const total = lista.reduce((s, c) => s + Math.max(c.saldo, 0), 0);
          return (
            <>
              <Tarjeta tono="rosa" style={{ gap: 2 }}>
                <Texto color={color.tintaSuave}>Te deben en total</Texto>
                <Texto tipo="cifra" color={color.frambuesaHundida}>{pesos(total)}</Texto>
                <Texto tipo="pequeno" color={color.tintaSuave}>{plural(lista.length, 'cuenta abierta', 'cuentas abiertas')}</Texto>
              </Tarjeta>
              <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
                {lista.map((c, i) => (
                  <CuentaFila key={c.ventaId} cuenta={c} ultima={i === lista.length - 1} />
                ))}
              </Tarjeta>
            </>
          );
        }}
      </ConDatos>
    </Pantalla>
  );
}
