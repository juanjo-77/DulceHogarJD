import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { productosApi } from '@/api/consultas/productos';
import type { Categoria } from '@/api/tipos/productos';
import { useAccion } from '@/api/useAccion';
import { espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { Campo } from '@/ui/Campo';
import { Chip } from '@/ui/Chip';
import { Hoja } from '@/ui/Hoja';
import { Texto } from '@/ui/Texto';

const ICONOS = ['☁️', '🧶', '🛏️', '🛁', '🪟', '🌸', '🍽️', '🎁', '🧸', '👶', '🧺', '🪡', '🛋️', '⭐'];

type Props = { categoria: Categoria | null; alCerrar: () => void };

export function EditarCategoria({ categoria, alCerrar }: Props) {
  const [nombre, setNombre] = useState(categoria?.nombre ?? '');
  const [icono, setIcono] = useState(categoria?.icono ?? '🎁');
  const crear = useAccion(productosApi.crearCategoria, { exito: 'Categoría creada', alTerminar: alCerrar });
  const editar = useAccion(productosApi.editarCategoria, { exito: 'Categoría guardada', alTerminar: alCerrar });
  const borrar = useAccion(productosApi.borrarCategoria, { exito: 'Categoría borrada', alTerminar: alCerrar });

  return (
    <Hoja visible titulo={categoria ? 'Editar categoría' : 'Nueva categoría'} alCerrar={alCerrar}>
      <Campo etiqueta="Nombre" placeholder="Ej: Manteles" value={nombre} onChangeText={setNombre} />
      <Texto tipo="fuerte">Dibujito</Texto>
      <View style={s.iconos}>
        {ICONOS.map((i) => (
          <Chip key={i} titulo={i} activo={icono === i} onPress={() => setIcono(i)} />
        ))}
      </View>
      <Boton
        titulo="Guardar"
        icono="check"
        cargando={crear.isPending || editar.isPending}
        onPress={() => (categoria ? editar.mutate({ id: categoria.id, nombre, icono }) : crear.mutate({ nombre, icono }))}
      />
      {categoria && (
        <Boton titulo="Borrar categoría" icono="trash-can-outline" variante="peligro" cargando={borrar.isPending} onPress={() => borrar.mutate(categoria.id)} />
      )}
    </Hoja>
  );
}

const s = StyleSheet.create({
  iconos: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.s },
});
