import { useState } from 'react';

import { useProductos } from '@/api/consultas/productos';
import { urlFoto } from '@/api/servidor';
import { pesos } from '@/funciones/formato';
import { useRetraso } from '@/funciones/useRetraso';
import { color, espacio } from '@/tema/tokens';
import { Miniatura } from '@/ui/Avatar';
import { Buscador } from '@/ui/Buscador';
import { ConDatos } from '@/ui/Estado';
import { Fila } from '@/ui/Fila';
import { Icono } from '@/ui/Icono';
import { Insignia } from '@/ui/Insignia';
import { Tarjeta } from '@/ui/Tarjeta';
import { Vacio } from '@/ui/Vacio';

import { carrito, useCarrito } from './carrito';

export function PasoProductos() {
  const [buscar, setBuscar] = useState('');
  const productos = useProductos({ buscar: useRetraso(buscar) });
  const { lineas } = useCarrito();
  const enCarrito = (id: number) => lineas.find((l) => l.producto.id === id)?.cantidad ?? 0;

  return (
    <>
      <Buscador valor={buscar} alCambiar={setBuscar} placeholder="Buscar producto" />
      <ConDatos consulta={productos}>
        {(lista) => {
          // Lo que hay primero; lo agotado al final.
          const ordenada = [...lista].sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0));
          if (ordenada.length === 0) return <Vacio icono="magnify" titulo="No encontramos ese producto" />;
          return (
            <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
              {ordenada.map((p, i) => {
                const lleva = enCarrito(p.id);
                const agotado = p.stock - lleva <= 0;
                return (
                  <Fila
                    key={p.id}
                    titulo={p.nombre}
                    subtitulo={`${pesos(p.precioVenta)} · ${p.stock <= 0 ? 'agotado' : `quedan ${p.stock}`}`}
                    izquierda={<Miniatura foto={urlFoto(p.foto)} icono={p.icono} />}
                    derecha={
                      lleva > 0 ? (
                        <Insignia texto={`Lleva ${lleva}`} tono="rosa" />
                      ) : (
                        <Icono nombre={agotado ? 'cancel' : 'plus-circle'} tamano={34} color={agotado ? color.tintaTenue : color.frambuesa} />
                      )
                    }
                    ultima={i === ordenada.length - 1}
                    sinFlecha
                    onPress={agotado ? undefined : () => carrito.agregar(p)}
                  />
                );
              })}
            </Tarjeta>
          );
        }}
      </ConDatos>
    </>
  );
}
