import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { useEncargo } from '@/api/consultas/clientes';
import { cuandoToca, fechaConDia } from '@/funciones/formato';
import { AccionesPedido } from '@/modulos/pedidos/AccionesPedido';
import { EstadoPedido } from '@/modulos/pedidos/EstadoPedido';
import { color, espacio } from '@/tema/tokens';
import { ConDatos } from '@/ui/Estado';
import { Fila } from '@/ui/Fila';
import { Insignia } from '@/ui/Insignia';
import { Pantalla } from '@/ui/Pantalla';
import { Seccion } from '@/ui/Seccion';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

export default function DetallePedido() {
  const id = Number(useLocalSearchParams<{ id: string }>().id);
  const pedido = useEncargo(id);

  return (
    <Pantalla volver titulo="Pedido" subtitulo={pedido.data?.cliente.nombre}>
      <ConDatos consulta={pedido}>
        {(p) => (
          <>
            <Tarjeta tono="rosa">
              <EstadoPedido pedido={p} />
              <Texto tipo="subtitulo">Entregar el {fechaConDia(p.fechaEntrega)}</Texto>
              {(p.estado === 'Pendiente' || p.estado === 'Listo') && <Texto color={color.tintaSuave}>Es {cuandoToca(p.diasRestantes)}.</Texto>}
              {p.notas && <Texto color={color.tintaSuave}>Nota: {p.notas}</Texto>}
            </Tarjeta>

            <Seccion titulo="Lo que pidió">
              <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
                {p.items.map((i, n) => (
                  <Fila
                    key={i.id}
                    titulo={`${i.cantidad} × ${i.descripcion}`}
                    subtitulo={i.productoId ? undefined : 'No está en el inventario'}
                    derecha={<DisponibleInsignia stock={i.stock} cantidad={i.cantidad} />}
                    ultima={n === p.items.length - 1}
                  />
                ))}
              </Tarjeta>
            </Seccion>

            <View style={{ gap: espacio.m }}>
              <AccionesPedido pedido={p} />
            </View>
            <Fila titulo={`Ver a ${p.cliente.nombre}`} onPress={() => router.push(`/cliente/${p.cliente.id}`)} ultima />
          </>
        )}
      </ConDatos>
    </Pantalla>
  );
}

function DisponibleInsignia({ stock, cantidad }: { stock: number | null; cantidad: number }) {
  if (stock === null) return <Insignia texto="Hay que traerlo" tono="miel" />;
  if (stock >= cantidad) return <Insignia texto={`Hay ${stock}`} tono="menta" />;
  return <Insignia texto={stock <= 0 ? 'No hay' : `Solo hay ${stock}`} tono="coral" />;
}
