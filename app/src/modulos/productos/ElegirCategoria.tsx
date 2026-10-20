import { StyleSheet, View } from 'react-native';

import { useCategorias } from '@/api/consultas/productos';
import { espacio } from '@/tema/tokens';
import { Chip } from '@/ui/Chip';
import { Texto } from '@/ui/Texto';

type Props = { valor: number; alCambiar: (id: number) => void };

export function ElegirCategoria({ valor, alCambiar }: Props) {
  const categorias = useCategorias();

  return (
    <View style={s.grupo}>
      <Texto tipo="fuerte">¿De qué tipo es?</Texto>
      <View style={s.opciones}>
        {categorias.data?.map((c) => (
          <Chip key={c.id} titulo={`${c.icono} ${c.nombre}`} activo={valor === c.id} onPress={() => alCambiar(c.id)} />
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  grupo: { gap: espacio.s },
  opciones: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.s },
});
