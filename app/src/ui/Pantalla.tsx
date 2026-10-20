import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ANCHO_MAXIMO, color, espacio } from '@/tema/tokens';

import { Icono } from './Icono';
import { Presionable } from './Presionable';
import { Texto } from './Texto';

type Props = {
  titulo?: string;
  subtitulo?: string;
  /** Muestra el botón "Volver" (pantallas que no son pestañas). */
  volver?: boolean;
  derecha?: ReactNode;
  /** Zona fija abajo, para la acción principal de la pantalla. */
  pie?: ReactNode;
  refrescando?: boolean;
  alRefrescar?: () => void;
  children: ReactNode;
};

export function Pantalla({ titulo, subtitulo, volver, derecha, pie, refrescando = false, alRefrescar, children }: Props) {
  const regresar = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <SafeAreaView style={s.fondo} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={s.contenido}
        keyboardShouldPersistTaps="handled"
        refreshControl={alRefrescar ? <RefreshControl refreshing={refrescando} onRefresh={alRefrescar} tintColor={color.frambuesa} /> : undefined}>
        {volver && (
          <Presionable onPress={regresar} style={s.volver} accessibilityLabel="Volver">
            <Icono nombre="arrow-left" tamano={24} color={color.frambuesa} />
            <Texto tipo="fuerte" color={color.frambuesa}>Volver</Texto>
          </Presionable>
        )}
        {titulo && (
          <View style={s.encabezado}>
            <View style={s.titulos}>
              <Texto tipo="titulo" accessibilityRole="header">{titulo}</Texto>
              {subtitulo && <Texto color={color.tintaSuave}>{subtitulo}</Texto>}
            </View>
            {derecha}
          </View>
        )}
        {children}
      </ScrollView>
      {pie && <View style={s.pie}>{pie}</View>}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: color.algodon },
  contenido: {
    padding: espacio.l,
    paddingBottom: espacio.xxxl * 2,
    gap: espacio.l,
    width: '100%',
    maxWidth: ANCHO_MAXIMO,
    alignSelf: 'center',
  },
  volver: { flexDirection: 'row', alignItems: 'center', gap: espacio.xs, alignSelf: 'flex-start', minHeight: 44, paddingRight: espacio.m },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
  titulos: { flex: 1, gap: 2 },
  pie: {
    padding: espacio.l,
    paddingBottom: espacio.l,
    backgroundColor: color.algodon,
    borderTopWidth: 1,
    borderTopColor: color.hilo,
    width: '100%',
    maxWidth: ANCHO_MAXIMO,
    alignSelf: 'center',
  },
});
