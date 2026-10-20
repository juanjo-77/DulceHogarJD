import { useState } from 'react';
import { View } from 'react-native';

import type { Encargo, EncargoInput } from '@/api/tipos/clientes';
import type { ClienteMini } from '@/api/tipos/ventas';
import { aFechaApi, sumarDias } from '@/funciones/formato';
import { espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { Campo } from '@/ui/Campo';
import { SelectorFecha } from '@/ui/SelectorFecha';

import { SelectorCliente } from '../clientes/SelectorCliente';
import { ItemsPedido, type ItemPedido } from './ItemsPedido';

type Props = { inicial?: Encargo; guardando: boolean; alGuardar: (datos: EncargoInput) => void };

export function FormularioPedido({ inicial, guardando, alGuardar }: Props) {
  const [cliente, setCliente] = useState<ClienteMini | null>(inicial?.cliente ?? null);
  const [items, setItems] = useState<ItemPedido[]>(
    inicial?.items.map((i) => ({ productoId: i.productoId, descripcion: i.descripcion, cantidad: i.cantidad })) ?? [],
  );
  const [fecha, setFecha] = useState(inicial?.fechaEntrega ?? aFechaApi(sumarDias(new Date(), 7)));
  const [notas, setNotas] = useState(inicial?.notas ?? '');

  return (
    <View style={{ gap: espacio.xl }}>
      <SelectorCliente valor={cliente} alCambiar={setCliente} etiqueta="¿Quién lo pidió?" />
      <ItemsPedido items={items} alCambiar={setItems} />
      <SelectorFecha
        etiqueta="¿Para cuándo lo necesita?"
        valor={fecha}
        alCambiar={setFecha}
        opciones={[
          { titulo: 'Mañana', dias: 1 },
          { titulo: 'En 3 días', dias: 3 },
          { titulo: 'En 1 semana', dias: 7 },
          { titulo: 'En 15 días', dias: 15 },
        ]}
      />
      <Campo etiqueta="Notas" opcional placeholder="Color, tamaño, para quién es…" value={notas} onChangeText={setNotas} multiline />
      <Boton
        titulo="Guardar pedido"
        icono="check"
        grande
        cargando={guardando}
        onPress={() =>
          alGuardar({
            clienteId: cliente?.id ?? 0,
            fechaEntrega: fecha,
            notas: notas || null,
            items: items.map((i) => ({ productoId: i.productoId, descripcion: i.descripcion, cantidad: i.cantidad })),
          })
        }
      />
    </View>
  );
}
