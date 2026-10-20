import { StyleSheet, View } from 'react-native';

import { useProveedores } from '@/api/consultas/surtido';
import { espacio } from '@/tema/tokens';
import { Campo } from '@/ui/Campo';
import { Chip } from '@/ui/Chip';

type Props = { valor: string; alCambiar: (nombre: string) => void };

/** Se escribe el nombre; los proveedores de siempre aparecen como botones. */
export function ElegirProveedor({ valor, alCambiar }: Props) {
  const proveedores = useProveedores();
  const frecuentes = [...(proveedores.data ?? [])].sort((a, b) => b.totalComprado - a.totalComprado).slice(0, 6);

  return (
    <View style={{ gap: espacio.s }}>
      <Campo etiqueta="¿A quién le compraste?" opcional placeholder="Nombre del proveedor" value={valor} onChangeText={alCambiar} />
      {frecuentes.length > 0 && (
        <View style={s.chips}>
          {frecuentes.map((p) => (
            <Chip key={p.id} titulo={p.nombre} activo={valor === p.nombre} onPress={() => alCambiar(p.nombre)} />
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.s },
});
