import { StyleSheet, View } from 'react-native';

import { surtidoApi } from '@/api/consultas/surtido';
import type { PorTraer } from '@/api/tipos/surtido';
import { useAccion } from '@/api/useAccion';
import { color, espacio } from '@/tema/tokens';
import { Icono } from '@/ui/Icono';
import { Presionable } from '@/ui/Presionable';
import { Texto } from '@/ui/Texto';

/** Un renglón con casilla grande: se toca para marcar "ya lo conseguí". */
export function RenglonPorTraer({ item, ultimo }: { item: PorTraer; ultimo: boolean }) {
  const marcar = useAccion(surtidoApi.marcar);
  const quitar = useAccion(surtidoApi.quitar, { exito: 'Quitado de la lista' });
  const detalle = [item.nota, item.stock !== null && `hay ${item.stock}`].filter(Boolean).join(' · ');

  return (
    <View style={[s.fila, !ultimo && s.divisor]}>
      <Presionable
        onPress={() => marcar.mutate({ id: item.id, conseguido: !item.conseguido })}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.conseguido }}
        accessibilityLabel={`${item.descripcion}: ${item.conseguido ? 'conseguido' : 'pendiente'}`}
        style={s.marca}>
        <Icono nombre={item.conseguido ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'} tamano={36} color={item.conseguido ? color.menta : color.tintaTenue} />
        <View style={{ flex: 1 }}>
          <Texto tipo="fuerte" style={item.conseguido && s.tachado}>
            {item.cantidad} × {item.icono ? `${item.icono} ` : ''}{item.descripcion}
          </Texto>
          {detalle.length > 0 && <Texto tipo="pequeno" color={color.tintaSuave}>{detalle}</Texto>}
        </View>
      </Presionable>
      <Presionable onPress={() => quitar.mutate(item.id)} style={s.quitar} accessibilityLabel={`Quitar ${item.descripcion} de la lista`}>
        <Icono nombre="close" tamano={22} color={color.tintaSuave} />
      </Presionable>
    </View>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.s, minHeight: 68 },
  divisor: { borderBottomWidth: 1, borderBottomColor: color.hilo },
  marca: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: espacio.m, paddingVertical: espacio.s },
  tachado: { textDecorationLine: 'line-through', color: color.tintaSuave },
  quitar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: color.lino },
});
