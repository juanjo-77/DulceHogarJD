import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, espacio, radio } from '@/tema/tokens';

import { Icono } from './Icono';
import { Presionable } from './Presionable';
import { Texto } from './Texto';

type Props = { visible: boolean; titulo: string; alCerrar: () => void; children: ReactNode; pie?: ReactNode };

/** Ventana que sube desde abajo para elegir algo sin salir de la pantalla. */
export function Hoja({ visible, titulo, alCerrar, children, pie }: Props) {
  const { bottom } = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={alCerrar} statusBarTranslucent>
      <Pressable style={s.fondo} onPress={alCerrar} accessibilityLabel="Cerrar" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.contenedor} pointerEvents="box-none">
        <View style={[s.hoja, { paddingBottom: bottom + espacio.l }]}>
          <View style={s.encabezado}>
            <Texto tipo="subtitulo" style={{ flex: 1 }}>{titulo}</Texto>
            <Presionable onPress={alCerrar} style={s.cerrar} accessibilityLabel="Cerrar">
              <Icono nombre="close" tamano={26} />
            </Presionable>
          </View>
          <ScrollView contentContainerStyle={s.cuerpo} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
          {pie && <View style={s.pie}>{pie}</View>}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  fondo: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(58, 39, 48, 0.4)' },
  contenedor: { flex: 1, justifyContent: 'flex-end' },
  hoja: {
    backgroundColor: color.algodon,
    borderTopLeftRadius: radio.hoja,
    borderTopRightRadius: radio.hoja,
    maxHeight: '88%',
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  encabezado: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: espacio.l, paddingTop: espacio.l, gap: espacio.m },
  cerrar: { width: 48, height: 48, borderRadius: 24, backgroundColor: color.lino, alignItems: 'center', justifyContent: 'center' },
  cuerpo: { padding: espacio.l, gap: espacio.m },
  pie: { paddingHorizontal: espacio.l, paddingTop: espacio.s },
});
