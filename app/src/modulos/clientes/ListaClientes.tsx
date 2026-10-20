import { router } from 'expo-router';

import type { Cliente } from '@/api/tipos/clientes';
import { pesos } from '@/funciones/formato';
import { espacio } from '@/tema/tokens';
import { Avatar } from '@/ui/Avatar';
import { Fila } from '@/ui/Fila';
import { Insignia } from '@/ui/Insignia';
import { Tarjeta } from '@/ui/Tarjeta';
import { Vacio } from '@/ui/Vacio';

type Props = { clientes: Cliente[]; filtrando: boolean };

export function ListaClientes({ clientes, filtrando }: Props) {
  if (clientes.length === 0) {
    return filtrando ? (
      <Vacio icono="account-search" titulo="No encontramos a nadie" texto="Prueba con otro nombre o número." />
    ) : (
      <Vacio
        icono="account-heart"
        titulo="Todavía no hay clientes"
        texto="Guarda a tus clientes para fiarles, separarles productos y ver lo que han comprado."
        accion={{ titulo: 'Agregar cliente', onPress: () => router.push('/cliente/editar') }}
      />
    );
  }

  return (
    <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
      {clientes.map((c, i) => (
        <Fila
          key={c.id}
          titulo={c.nombre}
          subtitulo={c.telefono ?? 'Sin teléfono'}
          izquierda={<Avatar nombre={c.nombre} />}
          derecha={c.debe > 0 ? <Insignia texto={`Debe ${pesos(c.debe)}`} tono="rosa" /> : undefined}
          ultima={i === clientes.length - 1}
          onPress={() => router.push(`/cliente/${c.id}`)}
        />
      ))}
    </Tarjeta>
  );
}
