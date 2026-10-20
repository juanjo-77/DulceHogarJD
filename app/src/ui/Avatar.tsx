import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { iniciales } from '@/funciones/formato';
import { color } from '@/tema/tokens';

import { Texto } from './Texto';

/** Círculo con las iniciales de un cliente. */
export function Avatar({ nombre, tamano = 48 }: { nombre: string; tamano?: number }) {
  return (
    <View style={[s.circulo, { width: tamano, height: tamano, borderRadius: tamano / 2 }]}>
      <Texto tipo="fuerte" color={color.frambuesaHundida}>{iniciales(nombre)}</Texto>
    </View>
  );
}

/** Foto del producto o, si no tiene, el ícono de su categoría sobre lino. */
export function Miniatura({ foto, icono, tamano = 56 }: { foto: string | null; icono: string; tamano?: number }) {
  const caja = { width: tamano, height: tamano, borderRadius: tamano * 0.3 };
  if (foto) return <Image source={{ uri: foto }} style={[s.foto, caja]} contentFit="cover" transition={150} />;
  return (
    <View style={[s.icono, caja]}>
      <Texto style={{ fontSize: tamano * 0.45, lineHeight: tamano * 0.6 }}>{icono}</Texto>
    </View>
  );
}

const s = StyleSheet.create({
  circulo: { backgroundColor: color.rosaPalo, alignItems: 'center', justifyContent: 'center' },
  foto: { backgroundColor: color.lino },
  icono: { backgroundColor: color.lino, alignItems: 'center', justifyContent: 'center' },
});
