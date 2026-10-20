import { router, useLocalSearchParams } from 'expo-router';

import { surtidoApi, useSurtido } from '@/api/consultas/surtido';
import { useAccion } from '@/api/useAccion';
import { fechaConDia, hora, pesos } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { useConfirmar } from '@/ui/Dialogo';
import { ConDatos } from '@/ui/Estado';
import { Fila } from '@/ui/Fila';
import { Pantalla } from '@/ui/Pantalla';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

export default function DetalleSurtido() {
  const id = Number(useLocalSearchParams<{ id: string }>().id);
  const surtido = useSurtido(id);
  const confirmar = useConfirmar();
  const borrar = useAccion(surtidoApi.borrarSurtido, { exito: 'Compra borrada', alTerminar: () => router.back() });

  return (
    <Pantalla volver titulo="Compra de mercancía" subtitulo={surtido.data?.proveedor ?? undefined}>
      <ConDatos consulta={surtido}>
        {(s) => (
          <>
            <Tarjeta tono="lino" style={{ gap: 2 }}>
              <Texto color={color.tintaSuave}>{fechaConDia(s.fecha)}, {hora(s.fecha)}</Texto>
              <Texto tipo="cifra">{pesos(s.total)}</Texto>
              <Texto color={color.tintaSuave}>Todo esto ya se sumó al inventario.</Texto>
            </Tarjeta>
            <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
              {s.items.map((i, n) => (
                <Fila
                  key={i.id}
                  titulo={`${i.cantidad} × ${i.nombre}`}
                  subtitulo={`${pesos(i.costoUnitario)} cada uno`}
                  derecha={<Texto tipo="fuerte">{pesos(i.subtotal)}</Texto>}
                  ultima={n === s.items.length - 1}
                  onPress={() => router.push(`/producto/${i.productoId}`)}
                />
              ))}
            </Tarjeta>
            <Boton
              titulo="Borrar esta compra"
              icono="trash-can-outline"
              variante="peligro"
              cargando={borrar.isPending}
              onPress={async () => {
                if (await confirmar({ titulo: '¿Borrar esta compra?', mensaje: 'Se restan del inventario las unidades que entraron.', confirmar: 'Sí, borrar', peligro: true }))
                  borrar.mutate(id);
              }}
            />
          </>
        )}
      </ConDatos>
    </Pantalla>
  );
}
