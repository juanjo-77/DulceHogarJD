import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { useEncargos } from '@/api/consultas/clientes';
import { PedidoFila } from '@/modulos/pedidos/PedidoFila';
import { espacio } from '@/tema/tokens';
import { BotonFlotante } from '@/ui/BotonFlotante';
import { ConDatos } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';
import { Segmento } from '@/ui/Segmento';
import { Tarjeta } from '@/ui/Tarjeta';
import { Vacio } from '@/ui/Vacio';

export default function Pedidos() {
  const [ver, setVer] = useState<'pendientes' | 'todos'>('pendientes');
  const pedidos = useEncargos(ver === 'todos');

  return (
    <View style={{ flex: 1 }}>
      <Pantalla volver titulo="Pedidos" subtitulo="Lo que te encargaron tus clientes" refrescando={pedidos.isRefetching} alRefrescar={pedidos.refetch}>
        <Segmento
          valor={ver}
          alCambiar={setVer}
          opciones={[
            { valor: 'pendientes', titulo: 'Por entregar' },
            { valor: 'todos', titulo: 'Todos' },
          ]}
        />
        <ConDatos consulta={pedidos}>
          {(lista) =>
            lista.length === 0 ? (
              <Vacio
                icono="gift-outline"
                titulo="No hay pedidos por entregar"
                texto="Cuando una clienta te encargue algo, anótalo aquí para no olvidarlo."
                accion={{ titulo: 'Anotar un pedido', onPress: () => router.push('/pedido/editar') }}
              />
            ) : (
              <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
                {lista.map((p, i) => (
                  <PedidoFila key={p.id} pedido={p} ultima={i === lista.length - 1} />
                ))}
              </Tarjeta>
            )
          }
        </ConDatos>
      </Pantalla>
      <BotonFlotante titulo="Anotar pedido" onPress={() => router.push('/pedido/editar')} />
    </View>
  );
}
