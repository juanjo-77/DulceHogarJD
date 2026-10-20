import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { useClientes } from '@/api/consultas/clientes';
import { plural } from '@/funciones/formato';
import { useRetraso } from '@/funciones/useRetraso';
import { ListaClientes } from '@/modulos/clientes/ListaClientes';
import { BotonFlotante } from '@/ui/BotonFlotante';
import { Buscador } from '@/ui/Buscador';
import { ConDatos } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';
import { Segmento } from '@/ui/Segmento';

export default function Clientes() {
  const [buscar, setBuscar] = useState('');
  const [filtro, setFiltro] = useState<'todos' | 'deben'>('todos');
  const clientes = useClientes(useRetraso(buscar), filtro === 'deben');

  return (
    <View style={{ flex: 1 }}>
      <Pantalla
        titulo="Clientes"
        subtitulo={clientes.data ? plural(clientes.data.length, 'cliente', 'clientes') : undefined}
        refrescando={clientes.isRefetching}
        alRefrescar={clientes.refetch}>
        <Buscador valor={buscar} alCambiar={setBuscar} placeholder="Buscar por nombre o teléfono" />
        <Segmento
          valor={filtro}
          alCambiar={setFiltro}
          opciones={[
            { valor: 'todos', titulo: 'Todos' },
            { valor: 'deben', titulo: 'Me deben' },
          ]}
        />
        <ConDatos consulta={clientes}>{(lista) => <ListaClientes clientes={lista} filtrando={!!buscar || filtro === 'deben'} />}</ConDatos>
      </Pantalla>
      <BotonFlotante titulo="Agregar cliente" icono="account-plus" onPress={() => router.push('/cliente/editar')} />
    </View>
  );
}
