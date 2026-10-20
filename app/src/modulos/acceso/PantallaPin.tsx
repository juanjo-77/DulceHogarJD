import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { acceso, type ResultadoPin } from '@/api/acceso';
import { color, espacio } from '@/tema/tokens';
import { Etiqueta } from '@/ui/Etiqueta';
import { Texto } from '@/ui/Texto';

import { PuntosPin } from './PuntosPin';
import { TecladoPin } from './TecladoPin';

const MENSAJES: Record<Exclude<ResultadoPin, 'ok'>, string> = {
  incorrecto: 'Ese no es el PIN. Intenta otra vez.',
  bloqueado: 'Te equivocaste varias veces. Espera un minuto y vuelve a intentar.',
  sinConexion: 'No hay conexión con el programa del negocio. Revisa que el computador esté encendido.',
};

/** Se pide una sola vez por celular. Si el PIN no es, la fila de puntos tiembla y se borra. */
export function PantallaPin({ alEntrar }: { alEntrar: () => void }) {
  const [digitos, setDigitos] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [revisando, setRevisando] = useState(false);
  const temblor = useSharedValue(0);
  const animado = useAnimatedStyle(() => ({ transform: [{ translateX: temblor.value }] }));

  const entrar = async () => {
    setRevisando(true);
    const resultado = await acceso.probar(digitos);
    setRevisando(false);
    if (resultado === 'ok') {
      await acceso.aceptar(digitos);
      alEntrar();
      return;
    }
    setMensaje(MENSAJES[resultado]);
    setDigitos('');
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    const paso = (x: number) => withTiming(x, { duration: 55 });
    temblor.value = withSequence(paso(-14), paso(14), paso(-9), paso(9), paso(0));
  };

  return (
    <SafeAreaView style={s.fondo}>
      <View style={s.contenido}>
        <Etiqueta>
          <Texto tipo="marca" color={color.frambuesaHundida}>Dulce Hogar JD</Texto>
        </Etiqueta>
        <View style={s.textos}>
          <Texto tipo="titulo" centrado accessibilityRole="header">Escribe el PIN</Texto>
          <Texto color={color.tintaSuave} centrado>Es el número secreto del negocio. Este celular lo recuerda después.</Texto>
        </View>
        <Animated.View style={animado}>
          <PuntosPin cantidad={digitos.length} />
        </Animated.View>
        <Texto color={color.coral} centrado style={s.mensaje} accessibilityLiveRegion="assertive">{mensaje ?? ' '}</Texto>
        <TecladoPin
          alTocar={(d) => {
            setMensaje(null);
            setDigitos((x) => (x.length < 8 ? x + d : x));
          }}
          alBorrar={() => setDigitos((x) => x.slice(0, -1))}
          alEntrar={entrar}
          puedeEntrar={digitos.length >= 4 && !revisando}
          revisando={revisando}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: color.algodon },
  contenido: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: espacio.xl, gap: espacio.xl },
  textos: { gap: espacio.s, maxWidth: 360 },
  mensaje: { minHeight: 52, maxWidth: 340 },
});
