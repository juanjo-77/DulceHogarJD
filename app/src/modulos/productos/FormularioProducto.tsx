import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Producto, ProductoInput } from '@/api/tipos/productos';
import { espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { Campo } from '@/ui/Campo';
import { CampoDinero } from '@/ui/CampoDinero';
import { Cantidad } from '@/ui/Cantidad';
import { Texto } from '@/ui/Texto';

import { ElegirCategoria } from './ElegirCategoria';

type Props = { inicial?: Producto; guardando: boolean; alGuardar: (datos: ProductoInput) => void };

export function FormularioProducto({ inicial, guardando, alGuardar }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre ?? '');
  const [categoriaId, setCategoriaId] = useState(inicial?.categoriaId ?? 0);
  const [precioVenta, setPrecioVenta] = useState(inicial?.precioVenta ?? 0);
  const [precioCompra, setPrecioCompra] = useState(inicial?.precioCompra ?? 0);
  const [stock, setStock] = useState(inicial?.stock ?? 1);
  const [stockMinimo, setStockMinimo] = useState(inicial?.stockMinimo ?? 2);
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? '');

  return (
    <View style={s.formulario}>
      <Campo etiqueta="¿Qué producto es?" placeholder="Ej: Cobija ovejera doble" value={nombre} onChangeText={setNombre} autoCapitalize="sentences" />
      <ElegirCategoria valor={categoriaId} alCambiar={setCategoriaId} />
      <CampoDinero etiqueta="¿A cuánto lo vendes?" valor={precioVenta} alCambiar={setPrecioVenta} />
      <CampoDinero
        etiqueta="¿Cuánto te costó a ti?"
        valor={precioCompra}
        alCambiar={setPrecioCompra}
        ayuda="Con esto calculamos cuánto estás ganando."
      />
      <View style={s.fila}>
        <Texto tipo="fuerte" style={{ flex: 1 }}>¿Cuántos tienes?</Texto>
        <Cantidad valor={stock} alCambiar={setStock} />
      </View>
      <View style={s.fila}>
        <View style={{ flex: 1 }}>
          <Texto tipo="fuerte">Avisarme cuando queden</Texto>
          <Texto tipo="pequeno">o menos unidades</Texto>
        </View>
        <Cantidad valor={stockMinimo} alCambiar={setStockMinimo} />
      </View>
      <Campo etiqueta="Detalles" opcional placeholder="Color, tamaño, material…" value={descripcion} onChangeText={setDescripcion} multiline />
      <Boton
        titulo="Guardar producto"
        icono="check"
        grande
        cargando={guardando}
        onPress={() =>
          alGuardar({ nombre, categoriaId, precioVenta, precioCompra, stock, stockMinimo, descripcion: descripcion || null })
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  formulario: { gap: espacio.xl },
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
});
