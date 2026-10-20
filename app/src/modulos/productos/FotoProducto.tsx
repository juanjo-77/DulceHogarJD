import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, View } from 'react-native';

import { productosApi } from '@/api/consultas/productos';
import { urlFoto } from '@/api/servidor';
import type { Producto } from '@/api/tipos/productos';
import { useAccion } from '@/api/useAccion';
import { color, espacio, radio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { Texto } from '@/ui/Texto';

const OPCIONES: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 0.6 };

/** Foto grande del producto, con botones para tomarla o elegirla de la galería. */
export function FotoProducto({ producto }: { producto: Producto }) {
  const subir = useAccion(productosApi.subirFoto, { exito: 'Foto guardada' });
  const foto = urlFoto(producto.foto);

  const elegir = async (camara: boolean) => {
    const resultado = camara ? await ImagePicker.launchCameraAsync(OPCIONES) : await ImagePicker.launchImageLibraryAsync(OPCIONES);
    if (!resultado.canceled) subir.mutate({ id: producto.id, uri: resultado.assets[0].uri });
  };

  return (
    <View style={s.contenedor}>
      {foto ? (
        <Image source={{ uri: foto }} style={s.foto} contentFit="cover" transition={200} accessibilityLabel={`Foto de ${producto.nombre}`} />
      ) : (
        <View style={[s.foto, s.sinFoto]}>
          <Texto style={{ fontSize: 64, lineHeight: 80 }}>{producto.icono}</Texto>
          <Texto color={color.tintaSuave}>Sin foto todavía</Texto>
        </View>
      )}
      <View style={s.botones}>
        <Boton titulo="Tomar foto" icono="camera" variante="borde" cargando={subir.isPending} onPress={() => elegir(true)} style={{ flex: 1 }} />
        <Boton titulo="Galería" icono="image" variante="borde" deshabilitado={subir.isPending} onPress={() => elegir(false)} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  contenedor: { gap: espacio.m },
  foto: { width: '100%', aspectRatio: 4 / 3, borderRadius: radio.tarjeta, backgroundColor: color.lino },
  sinFoto: { alignItems: 'center', justifyContent: 'center', gap: espacio.s },
  botones: { flexDirection: 'row', gap: espacio.m },
});
