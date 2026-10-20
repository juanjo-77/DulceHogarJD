import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { pesos } from '@/funciones/formato';
import { espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { Cantidad } from '@/ui/Cantidad';
import { Seccion } from '@/ui/Seccion';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

import { ElegirProducto } from '../productos/ElegirProducto';
import type { Linea } from '../vender/carrito';

type Props = { lineas: Linea[]; alCambiar: (l: Linea[]) => void };

/** Si es un cambio: qué producto se lleva en lugar del que devolvió. */
export function CambioPor({ lineas, alCambiar }: Props) {
  const [eligiendo, setEligiendo] = useState(false);

  return (
    <Seccion titulo="¿Se lleva otro a cambio?" ayuda="Si solo devolvió, deja esto vacío.">
      {lineas.length > 0 && (
        <Tarjeta>
          {lineas.map((l) => (
            <View key={l.producto.id} style={s.fila}>
              <View style={{ flex: 1 }}>
                <Texto tipo="fuerte">{l.producto.nombre}</Texto>
                <Texto tipo="pequeno">{pesos(l.producto.precioVenta)} c/u</Texto>
              </View>
              <Cantidad
                pequeno
                valor={l.cantidad}
                maximo={l.producto.stock}
                alCambiar={(n) =>
                  alCambiar(n === 0 ? lineas.filter((x) => x !== l) : lineas.map((x) => (x === l ? { ...x, cantidad: n } : x)))
                }
              />
            </View>
          ))}
        </Tarjeta>
      )}
      <Boton titulo="Elegir producto de cambio" icono="swap-horizontal" variante="borde" onPress={() => setEligiendo(true)} />
      <ElegirProducto
        visible={eligiendo}
        soloDisponibles
        titulo="Se lleva a cambio"
        alCerrar={() => setEligiendo(false)}
        alElegir={(p) => !lineas.some((l) => l.producto.id === p.id) && alCambiar([...lineas, { producto: p, cantidad: 1 }])}
      />
    </Seccion>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
});
