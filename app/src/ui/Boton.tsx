import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { color, espacio, radio, TOQUE_MINIMO } from '@/tema/tokens';

import { Icono, type NombreIcono } from './Icono';
import { Presionable } from './Presionable';
import { Texto } from './Texto';

type Variante = 'principal' | 'suave' | 'borde' | 'whatsapp' | 'peligro';

const estilos: Record<Variante, { fondo: string; texto: string; borde?: string }> = {
  principal: { fondo: color.frambuesa, texto: color.blanco },
  suave: { fondo: color.rosaPalo, texto: color.frambuesaHundida },
  borde: { fondo: color.blanco, texto: color.tinta, borde: color.hilo },
  whatsapp: { fondo: color.whatsapp, texto: color.blanco },
  peligro: { fondo: color.coralFondo, texto: color.coral },
};

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  icono?: NombreIcono;
  cargando?: boolean;
  deshabilitado?: boolean;
  grande?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Boton({ titulo, onPress, variante = 'principal', icono, cargando, deshabilitado, grande, style }: Props) {
  const tono = estilos[variante];
  const presionar = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Presionable
      onPress={presionar}
      disabled={deshabilitado || cargando}
      accessibilityLabel={titulo}
      style={[
        s.boton,
        { backgroundColor: tono.fondo, minHeight: grande ? 64 : TOQUE_MINIMO },
        tono.borde && { borderWidth: 1.5, borderColor: tono.borde },
        style,
      ]}>
      <View style={s.contenido}>
        {cargando ? (
          <ActivityIndicator color={tono.texto} />
        ) : (
          icono && <Icono nombre={icono} tamano={grande ? 26 : 22} color={tono.texto} />
        )}
        <Texto tipo={grande ? 'subtitulo' : 'fuerte'} color={tono.texto} numberOfLines={1}>
          {titulo}
        </Texto>
      </View>
    </Presionable>
  );
}

const s = StyleSheet.create({
  boton: {
    borderRadius: radio.boton,
    paddingHorizontal: espacio.xl,
    justifyContent: 'center',
  },
  contenido: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacio.s,
  },
});
