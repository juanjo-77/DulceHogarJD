import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { productosApi, useProducto } from '@/api/consultas/productos';
import { surtidoApi } from '@/api/consultas/surtido';
import { useAccion } from '@/api/useAccion';
import { pesos } from '@/funciones/formato';
import { AjusteUnidades } from '@/modulos/productos/AjusteUnidades';
import { FotoProducto } from '@/modulos/productos/FotoProducto';
import { color, espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { useConfirmar } from '@/ui/Dialogo';
import { ConDatos } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

export default function DetalleProducto() {
  const id = Number(useLocalSearchParams<{ id: string }>().id);
  const consulta = useProducto(id);
  const confirmar = useConfirmar();

  const anotar = useAccion(surtidoApi.anotar, { exito: 'Anotado en la lista para surtir' });
  const borrar = useAccion(productosApi.borrar, { exito: 'Producto borrado', alTerminar: () => router.back() });

  return (
    <Pantalla volver>
      <ConDatos consulta={consulta}>
        {({ producto: p, unidadesVendidas, enListaSurtir }) => (
          <>
            <FotoProducto producto={p} />
            <View style={{ gap: 2 }}>
              <Texto color={color.tintaSuave}>{p.icono} {p.categoria}</Texto>
              <Texto tipo="titulo">{p.nombre}</Texto>
              {p.descripcion && <Texto color={color.tintaSuave}>{p.descripcion}</Texto>}
            </View>

            <Tarjeta>
              <Texto color={color.tintaSuave}>Lo vendes a</Texto>
              <Texto tipo="cifra">{pesos(p.precioVenta)}</Texto>
              {p.precioCompra > 0 && (
                <Texto color={color.tintaSuave}>
                  Te costó {pesos(p.precioCompra)}. Ganas{' '}
                  <Texto tipo="fuerte" color={color.menta}>{pesos(p.precioVenta - p.precioCompra)}</Texto> por cada uno.
                </Texto>
              )}
              <Texto tipo="pequeno" color={color.tintaSuave}>Llevas {unidadesVendidas} vendidos.</Texto>
            </Tarjeta>

            <AjusteUnidades producto={p} />

            <View style={s.acciones}>
              <Boton titulo="Editar producto" icono="pencil" variante="borde" onPress={() => router.push(`/producto/editar?id=${p.id}`)} />
              <Boton
                titulo={enListaSurtir ? 'Ya está en la lista para surtir' : 'Anotar para surtir'}
                icono="truck-delivery-outline"
                variante="suave"
                deshabilitado={enListaSurtir}
                cargando={anotar.isPending}
                onPress={() => anotar.mutate({ productoId: p.id, descripcion: null, cantidad: Math.max(p.stockMinimo * 2 - p.stock, 1), nota: null })}
              />
              <Boton
                titulo="Borrar producto"
                icono="trash-can-outline"
                variante="peligro"
                cargando={borrar.isPending}
                onPress={async () => {
                  const si = await confirmar({
                    titulo: `¿Borrar ${p.nombre}?`,
                    mensaje: 'Las ventas que ya hiciste de este producto se conservan.',
                    confirmar: 'Sí, borrar',
                    peligro: true,
                  });
                  if (si) borrar.mutate(p.id);
                }}
              />
            </View>
          </>
        )}
      </ConDatos>
    </Pantalla>
  );
}

const s = StyleSheet.create({
  acciones: { gap: espacio.m },
});
