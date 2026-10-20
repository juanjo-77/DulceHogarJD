import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { useVenta, ventasApi } from '@/api/consultas/ventas';
import { useAccion } from '@/api/useAccion';
import { CambioPor } from '@/modulos/devoluciones/CambioPor';
import { CuentasDevolucion } from '@/modulos/devoluciones/CuentasDevolucion';
import { ElegirDevueltos } from '@/modulos/devoluciones/ElegirDevueltos';
import type { Linea } from '@/modulos/vender/carrito';
import { Boton } from '@/ui/Boton';
import { Campo } from '@/ui/Campo';
import { ConDatos } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';
import { Segmento } from '@/ui/Segmento';
import { Texto } from '@/ui/Texto';

export default function Devolver() {
  const id = Number(useLocalSearchParams<{ id: string }>().id);
  const venta = useVenta(id);
  const [devueltos, setDevueltos] = useState<Record<number, number>>({});
  const [buenEstado, setBuenEstado] = useState<'si' | 'no'>('si');
  const [cambio, setCambio] = useState<Linea[]>([]);
  const [reembolso, setReembolso] = useState(0);
  const [motivo, setMotivo] = useState('');

  const guardar = useAccion(ventasApi.devolver, { exito: 'Devolución registrada', alTerminar: () => router.back() });

  return (
    <Pantalla volver titulo="Devolución o cambio" subtitulo={venta.data?.cliente?.nombre}>
      <ConDatos consulta={venta}>
        {(v) => (
          <>
            <ElegirDevueltos venta={v} valor={devueltos} alCambiar={setDevueltos} />
            <Texto tipo="fuerte">¿Lo que devolvió está en buen estado?</Texto>
            <Segmento
              valor={buenEstado}
              alCambiar={setBuenEstado}
              opciones={[
                { valor: 'si', titulo: 'Sí, vuelve a la venta' },
                { valor: 'no', titulo: 'No, está dañado' },
              ]}
            />
            <CambioPor lineas={cambio} alCambiar={setCambio} />
            <CuentasDevolucion venta={v} devueltos={devueltos} cambio={cambio} reembolso={reembolso} alCambiarReembolso={setReembolso} />
            <Campo etiqueta="¿Por qué lo devolvió?" opcional placeholder="Ej: no le gustó el color" value={motivo} onChangeText={setMotivo} />
            <Boton
              titulo="Guardar devolución"
              icono="check-bold"
              grande
              cargando={guardar.isPending}
              deshabilitado={!Object.values(devueltos).some((n) => n > 0)}
              onPress={() =>
                guardar.mutate({
                  id,
                  items: Object.entries(devueltos).filter(([, n]) => n > 0).map(([itemId, n]) => ({ ventaItemId: Number(itemId), cantidad: n })),
                  vuelveAlInventario: buenEstado === 'si',
                  cambio: cambio.length ? cambio.map((l) => ({ productoId: l.producto.id, cantidad: l.cantidad })) : null,
                  montoReembolsado: reembolso,
                  motivo: motivo || null,
                })
              }
            />
          </>
        )}
      </ConDatos>
    </Pantalla>
  );
}
