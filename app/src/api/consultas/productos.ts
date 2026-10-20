import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Platform } from 'react-native';

import { consulta, pedir } from '../pedir';
import type { Categoria, Producto, ProductoDetalle, ProductoInput } from '../tipos/productos';

export type FiltroProductos = { buscar?: string; categoriaId?: number | null; estado?: 'agotados' | 'pocos' | null };

export const productosApi = {
  lista: (f: FiltroProductos) => pedir<Producto[]>(`/productos${consulta(f)}`),
  detalle: (id: number) => pedir<ProductoDetalle>(`/productos/${id}`),
  crear: (datos: ProductoInput) => pedir<Producto>('/productos', 'POST', datos),
  editar: ({ id, ...datos }: ProductoInput & { id: number }) => pedir<Producto>(`/productos/${id}`, 'PUT', datos),
  borrar: (id: number) => pedir<void>(`/productos/${id}`, 'DELETE'),
  ajustarStock: ({ id, cambio }: { id: number; cambio: number }) => pedir<Producto>(`/productos/${id}/stock`, 'POST', { cambio }),
  borrarFoto: (id: number) => pedir<Producto>(`/productos/${id}/foto`, 'DELETE'),

  subirFoto: async ({ id, uri }: { id: number; uri: string }) => {
    const formulario = new FormData();
    if (Platform.OS === 'web') {
      formulario.append('foto', await (await fetch(uri)).blob(), 'foto.jpg');
    } else {
      // React Native acepta { uri, name, type } como archivo.
      formulario.append('foto', { uri, name: 'foto.jpg', type: 'image/jpeg' } as unknown as Blob);
    }
    return pedir<Producto>(`/productos/${id}/foto`, 'POST', formulario);
  },

  categorias: () => pedir<Categoria[]>('/categorias'),
  crearCategoria: (datos: { nombre: string; icono: string }) => pedir<Categoria>('/categorias', 'POST', datos),
  editarCategoria: ({ id, ...datos }: { id: number; nombre: string; icono: string }) => pedir<Categoria>(`/categorias/${id}`, 'PUT', datos),
  borrarCategoria: (id: number) => pedir<void>(`/categorias/${id}`, 'DELETE'),
};

export const useProductos = (filtro: FiltroProductos) =>
  useQuery({ queryKey: ['productos', filtro], queryFn: () => productosApi.lista(filtro), placeholderData: keepPreviousData });

export const useProducto = (id: number) =>
  useQuery({ queryKey: ['producto', id], queryFn: () => productosApi.detalle(id), enabled: id > 0 });

export const useCategorias = () =>
  useQuery({ queryKey: ['categorias'], queryFn: productosApi.categorias, staleTime: 5 * 60_000 });
