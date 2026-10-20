import { router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import type { Vista } from '@/ui/vista';

import { useRecibo } from '@/api/consultas/ventas';
import { mensajeRecibo } from '@/funciones/mensajes';
import { BotonesCompartir } from '@/modulos/compartir/BotonesCompartir';
import { TarjetaRecibo } from '@/modulos/compartir/TarjetaRecibo';
import { Boton } from '@/ui/Boton';
import { ConDatos } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';

export default function VerRecibo() {
  const params = useLocalSearchParams<{ id: string; nuevo?: string }>();
  const recibo = useRecibo(Number(params.id));
  const tarjeta = useRef<Vista>(null);

  return (
    <Pantalla volver titulo={params.nuevo ? 'Abono guardado' : 'Recibo'} subtitulo="Envíaselo al cliente por WhatsApp">
      <ConDatos consulta={recibo}>
        {(r) => (
          <>
            <TarjetaRecibo ref={tarjeta} recibo={r} />
            <BotonesCompartir
              tarjeta={tarjeta}
              nombreArchivo={`recibo-${r.numero}`}
              mensaje={mensajeRecibo(r)}
              telefono={r.cliente?.telefono ?? null}
            />
            <Boton titulo="Listo" icono="check" variante="suave" onPress={() => router.replace(`/venta/${r.ventaId}`)} />
          </>
        )}
      </ConDatos>
    </Pantalla>
  );
}
