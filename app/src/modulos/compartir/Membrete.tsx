import { StyleSheet, View } from 'react-native';

import { color, espacio } from '@/tema/tokens';
import { Etiqueta } from '@/ui/Etiqueta';
import { Texto } from '@/ui/Texto';

type Props = { negocio: string; titulo: string; detalle: string };

/** Encabezado de las imágenes que se comparten: la etiqueta cosida con el nombre del negocio. */
export function Membrete({ negocio, titulo, detalle }: Props) {
  return (
    <View style={s.membrete}>
      <Etiqueta>
        <Texto tipo="marca" color={color.frambuesaHundida} centrado>{negocio}</Texto>
      </Etiqueta>
      <View style={{ alignItems: 'center' }}>
        <Texto tipo="subtitulo" centrado>{titulo}</Texto>
        <Texto tipo="pequeno" color={color.tintaSuave} centrado>{detalle}</Texto>
      </View>
    </View>
  );
}

/** Pie con el mensaje y el teléfono del negocio. */
export function PieNegocio({ mensaje, telefono }: { mensaje: string | null; telefono: string | null }) {
  return (
    <View style={s.pie}>
      {mensaje && <Texto tipo="fuerte" color={color.frambuesaHundida} centrado>{mensaje}</Texto>}
      {telefono && <Texto tipo="pequeno" color={color.tintaSuave} centrado>WhatsApp {telefono}</Texto>}
    </View>
  );
}

const s = StyleSheet.create({
  membrete: { alignItems: 'center', gap: espacio.m },
  pie: { alignItems: 'center', gap: 2, borderTopWidth: 1.5, borderStyle: 'dashed', borderTopColor: color.hilo, paddingTop: espacio.m },
});
