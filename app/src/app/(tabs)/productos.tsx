import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { useProductos } from '@/api/consultas/productos';
import { plural } from '@/funciones/formato';
import { useRetraso } from '@/funciones/useRetraso';
import { FiltroCategorias } from '@/modulos/productos/FiltroCategorias';
import { ListaProductos } from '@/modulos/productos/ListaProductos';
import { BotonFlotante } from '@/ui/BotonFlotante';
import { Buscador } from '@/ui/Buscador';
import { ConDatos } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';
import { Segmento } from '@/ui/Segmento';

type Estado = 'todos' | 'pocos' | 'agotados';

export default function Productos() {
  const params = useLocalSearchParams<{ estado?: Estado }>();
  const [buscar, setBuscar] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [estado, setEstado] = useState<Estado>(params.estado ?? 'todos');

  // Desde los avisos del inicio se llega con ?estado=agotados o ?estado=pocos.
  useEffect(() => {
    if (params.estado) setEstado(params.estado);
  }, [params.estado]);

  const productos = useProductos({
    buscar: useRetraso(buscar),
    categoriaId,
    estado: estado === 'todos' ? null : estado,
  });

  return (
    <View style={{ flex: 1 }}>
      <Pantalla
        titulo="Productos"
        subtitulo={productos.data ? plural(productos.data.length, 'producto', 'productos') : undefined}
        refrescando={productos.isRefetching}
        alRefrescar={productos.refetch}>
        <Buscador valor={buscar} alCambiar={setBuscar} placeholder="Buscar producto" />
        <FiltroCategorias valor={categoriaId} alCambiar={setCategoriaId} />
        <Segmento
          valor={estado}
          alCambiar={setEstado}
          opciones={[
            { valor: 'todos', titulo: 'Todos' },
            { valor: 'pocos', titulo: 'Se acaban' },
            { valor: 'agotados', titulo: 'Agotados' },
          ]}
        />
        <ConDatos consulta={productos}>
          {(lista) => <ListaProductos productos={lista} filtrando={!!buscar || !!categoriaId || estado !== 'todos'} />}
        </ConDatos>
      </Pantalla>
      <BotonFlotante titulo="Agregar producto" onPress={() => router.push('/producto/editar')} />
    </View>
  );
}
