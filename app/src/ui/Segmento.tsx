import { StyleSheet, View } from 'react-native';

import { color, espacio, radio } from '@/tema/tokens';

import { Presionable } from './Presionable';
import { Texto } from './Texto';

type Props<T extends string> = {
  opciones: { valor: T; titulo: string }[];
  valor: T;
  alCambiar: (valor: T) => void;
};

/** Pestañas pequeñas dentro de una pantalla, p. ej. "Por traer | Lo que llegó". */
export function Segmento<T extends string>({ opciones, valor, alCambiar }: Props<T>) {
  return (
    <View style={s.contenedor} accessibilityRole="tablist">
      {opciones.map((o) => {
        const activo = o.valor === valor;
        return (
          <Presionable
            key={o.valor}
            onPress={() => alCambiar(o.valor)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activo }}
            style={[s.opcion, activo && s.activa]}>
            <Texto tipo="pequenoFuerte" color={activo ? color.frambuesaHundida : color.tintaSuave} centrado>
              {o.titulo}
            </Texto>
          </Presionable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    backgroundColor: color.lino,
    borderRadius: radio.boton,
    padding: 4,
    gap: 4,
  },
  opcion: { flex: 1, minHeight: 48, borderRadius: 12, justifyContent: 'center', paddingHorizontal: espacio.s },
  activa: { backgroundColor: color.blanco, borderWidth: 1, borderColor: color.hilo },
});
