import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { surtidoApi } from '@/api/consultas/surtido';
import type { Producto } from '@/api/tipos/productos';
import { useAccion } from '@/api/useAccion';
import { espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { Campo } from '@/ui/Campo';
import { Cantidad } from '@/ui/Cantidad';
import { Hoja } from '@/ui/Hoja';
import { Texto } from '@/ui/Texto';

import { ElegirProducto } from '../productos/ElegirProducto';

type Props = { visible: boolean; alCerrar: () => void };

/** Anotar algo en la lista: un producto del inventario o algo nuevo escrito a mano. */
export function AnotarPorTraer({ visible, alCerrar }: Props) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [texto, setTexto] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [eligiendo, setEligiendo] = useState(false);

  const cerrar = () => {
    setProducto(null);
    setTexto('');
    setCantidad(1);
    alCerrar();
  };
  const anotar = useAccion(surtidoApi.anotar, { exito: 'Anotado', alTerminar: cerrar });

  return (
    <Hoja visible={visible} titulo="Anotar para traer" alCerrar={cerrar}>
      <Boton
        titulo={producto ? `${producto.icono} ${producto.nombre}` : 'Elegir del inventario'}
        icono="package-variant"
        variante={producto ? 'suave' : 'borde'}
        onPress={() => setEligiendo(true)}
      />
      {!producto && <Campo etiqueta="O escribe qué vas a traer" placeholder="Ej: Cobijas de Frozen" value={texto} onChangeText={setTexto} />}
      <View style={s.fila}>
        <Texto tipo="fuerte" style={{ flex: 1 }}>¿Cuántas?</Texto>
        <Cantidad valor={cantidad} minimo={1} alCambiar={setCantidad} />
      </View>
      <Boton
        titulo="Anotar en la lista"
        icono="check"
        grande
        cargando={anotar.isPending}
        deshabilitado={!producto && !texto.trim()}
        onPress={() => anotar.mutate({ productoId: producto?.id ?? null, descripcion: producto ? null : texto, cantidad, nota: null })}
      />
      <ElegirProducto visible={eligiendo} alCerrar={() => setEligiendo(false)} alElegir={setProducto} />
    </Hoja>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
});
