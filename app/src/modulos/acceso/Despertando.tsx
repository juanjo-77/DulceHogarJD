import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { color, espacio } from '@/tema/tokens';
import { Etiqueta } from '@/ui/Etiqueta';
import { Texto } from '@/ui/Texto';

/**
 * Mientras se despierta el programa del negocio. Solo aparece si tarda más de un
 * segundo y medio, para que en un arranque normal no se vea un parpadeo.
 */
export function Despertando() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={s.fondo}>
      {visible && (
        <View style={s.contenido} accessibilityLiveRegion="polite">
          <Etiqueta>
            <Texto tipo="marca" color={color.frambuesaHundida}>Dulce Hogar JD</Texto>
          </Etiqueta>
          <ActivityIndicator size="large" color={color.frambuesa} />
          <Texto tipo="subtitulo" centrado>Abriendo tu negocio…</Texto>
          <Texto color={color.tintaSuave} centrado>
            La primera vez del día puede tardar hasta un minuto. Si tarda mucho, revisa que el celular tenga internet.
          </Texto>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: color.algodon, justifyContent: 'center' },
  contenido: { alignItems: 'center', gap: espacio.l, padding: espacio.xxl, maxWidth: 420, alignSelf: 'center' },
});
