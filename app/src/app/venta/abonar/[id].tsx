import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { useVenta, ventasApi } from '@/api/consultas/ventas';
import type { MetodoPago } from '@/api/tipos/ventas';
import { useAccion } from '@/api/useAccion';
import { pesos } from '@/funciones/formato';
import { ElegirMetodo } from '@/modulos/vender/ElegirMetodo';
import { color } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { Campo } from '@/ui/Campo';
import { CampoDinero } from '@/ui/CampoDinero';
import { ConDatos } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

const COMUNES = [10_000, 20_000, 50_000, 100_000];

export default function Abonar() {
  const id = Number(useLocalSearchParams<{ id: string }>().id);
  const venta = useVenta(id);
  const [monto, setMonto] = useState(0);
  const [metodo, setMetodo] = useState<MetodoPago>('Efectivo');
  const [nota, setNota] = useState('');

  const abonar = useAccion(ventasApi.abonar, {
    exito: (r) => `Abono de ${pesos(r.monto)} guardado`,
    alTerminar: (r) => router.replace(`/recibo/${r.numero}?nuevo=1`),
  });

  return (
    <Pantalla volver titulo="Recibir un abono" subtitulo={venta.data?.cliente?.nombre}>
      <ConDatos consulta={venta}>
        {(v) => (
          <>
            <Tarjeta tono="rosa" style={{ gap: 2 }}>
              <Texto color={color.tintaSuave}>Debe</Texto>
              <Texto tipo="cifra" color={color.frambuesaHundida}>{pesos(v.saldo)}</Texto>
              <Texto tipo="pequeno" color={color.tintaSuave}>{v.items.map((i) => i.nombre).join(', ')}</Texto>
            </Tarjeta>
            <CampoDinero
              etiqueta="¿Cuánto te abonó?"
              valor={monto}
              alCambiar={setMonto}
              autoFocus
              rapidos={[
                { titulo: `Todo (${pesos(v.saldo)})`, valor: v.saldo },
                ...COMUNES.filter((c) => c < v.saldo).map((c) => ({ titulo: pesos(c), valor: c })),
              ]}
            />
            <ElegirMetodo valor={metodo} alCambiar={setMetodo} />
            <Campo etiqueta="Nota" opcional placeholder="Ej: le trajo la hija" value={nota} onChangeText={setNota} />
            {monto > 0 && monto <= v.saldo && (
              <Texto color={color.tintaSuave}>
                {monto === v.saldo ? '¡Con esto queda todo pago!' : `Después de este abono le faltarán ${pesos(v.saldo - monto)}.`}
              </Texto>
            )}
            <Boton
              titulo={monto > 0 ? `Guardar abono de ${pesos(monto)}` : 'Guardar abono'}
              icono="check-bold"
              grande
              deshabilitado={monto <= 0}
              cargando={abonar.isPending}
              onPress={() => abonar.mutate({ id, monto, metodo, nota: nota || null })}
            />
          </>
        )}
      </ConDatos>
    </Pantalla>
  );
}
