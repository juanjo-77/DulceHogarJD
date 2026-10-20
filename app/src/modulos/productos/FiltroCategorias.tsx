import { ScrollView, StyleSheet } from 'react-native';

import { useCategorias } from '@/api/consultas/productos';
import { espacio } from '@/tema/tokens';
import { Chip } from '@/ui/Chip';

type Props = { valor: number | null; alCambiar: (id: number | null) => void };

export function FiltroCategorias({ valor, alCambiar }: Props) {
  const categorias = useCategorias();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.fila}>
      <Chip titulo="Todas" activo={valor === null} onPress={() => alCambiar(null)} />
      {categorias.data?.map((c) => (
        <Chip key={c.id} titulo={`${c.icono} ${c.nombre}`} activo={valor === c.id} onPress={() => alCambiar(c.id)} />
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  fila: { gap: espacio.s, paddingRight: espacio.l },
});
