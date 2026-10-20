import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { Campo } from '@/ui/Campo';
import { Cantidad } from '@/ui/Cantidad';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

import { ElegirProducto } from '../productos/ElegirProducto';

export type ItemPedido = { productoId: number | null; descripcion: string; cantidad: number };

type Props = { items: ItemPedido[]; alCambiar: (items: ItemPedido[]) => void };

/** Productos del pedido: del inventario, o escritos a mano si todavía no los tiene. */
export function ItemsPedido({ items, alCambiar }: Props) {
  const [eligiendo, setEligiendo] = useState(false);
  const [escribiendo, setEscribiendo] = useState('');

  const agregar = (item: ItemPedido) => alCambiar([...items, item]);
  const cambiar = (indice: number, cantidad: number) =>
    alCambiar(cantidad === 0 ? items.filter((_, i) => i !== indice) : items.map((x, i) => (i === indice ? { ...x, cantidad } : x)));

  return (
    <View style={{ gap: espacio.s }}>
      <Texto tipo="fuerte">¿Qué pidió?</Texto>
      {items.length > 0 && (
        <Tarjeta>
          {items.map((item, i) => (
            <View key={`${item.descripcion}${i}`} style={s.fila}>
              <Texto style={{ flex: 1 }}>{item.descripcion}</Texto>
              <Cantidad pequeno valor={item.cantidad} alCambiar={(n) => cambiar(i, n)} />
            </View>
          ))}
        </Tarjeta>
      )}
      <Boton titulo="Agregar del inventario" icono="package-variant" variante="borde" onPress={() => setEligiendo(true)} />
      <View style={s.fila}>
        <View style={{ flex: 1 }}>
          <Campo etiqueta="O escríbelo si no lo tienes" placeholder="Ej: Cobija de Spiderman" value={escribiendo} onChangeText={setEscribiendo} />
        </View>
      </View>
      {escribiendo.trim().length > 0 && (
        <Boton
          titulo={`Agregar "${escribiendo.trim()}"`}
          icono="plus"
          variante="suave"
          onPress={() => {
            agregar({ productoId: null, descripcion: escribiendo.trim(), cantidad: 1 });
            setEscribiendo('');
          }}
        />
      )}
      <ElegirProducto
        visible={eligiendo}
        alCerrar={() => setEligiendo(false)}
        alElegir={(p) => agregar({ productoId: p.id, descripcion: p.nombre, cantidad: 1 })}
      />
    </View>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
});
