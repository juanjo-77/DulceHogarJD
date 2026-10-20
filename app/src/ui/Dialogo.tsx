import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { color, espacio, radio } from '@/tema/tokens';

import { Boton } from './Boton';
import { Texto } from './Texto';

type Pregunta = { titulo: string; mensaje?: string; confirmar: string; peligro?: boolean };
type Confirmar = (pregunta: Pregunta) => Promise<boolean>;

const DialogoContexto = createContext<Confirmar>(async () => false);

/** const confirmar = useConfirmar(); if (await confirmar({...})) { ... } */
export const useConfirmar = () => useContext(DialogoContexto);

export function DialogoProveedor({ children }: { children: ReactNode }) {
  const [pregunta, setPregunta] = useState<Pregunta | null>(null);
  const resolver = useRef<(si: boolean) => void>(() => {});

  const confirmar = useCallback<Confirmar>(
    (p) =>
      new Promise((resolve) => {
        resolver.current = resolve;
        setPregunta(p);
      }),
    [],
  );

  const responder = (si: boolean) => {
    resolver.current(si);
    setPregunta(null);
  };

  return (
    <DialogoContexto.Provider value={confirmar}>
      {children}
      <Modal visible={!!pregunta} transparent animationType="fade" onRequestClose={() => responder(false)}>
        <View style={s.fondo}>
          <View style={s.caja} accessibilityRole="alert">
            <Texto tipo="subtitulo">{pregunta?.titulo}</Texto>
            {pregunta?.mensaje && <Texto color={color.tintaSuave}>{pregunta.mensaje}</Texto>}
            <Boton
              titulo={pregunta?.confirmar ?? 'Sí'}
              variante={pregunta?.peligro ? 'peligro' : 'principal'}
              onPress={() => responder(true)}
            />
            <Boton titulo="No, volver" variante="borde" onPress={() => responder(false)} />
          </View>
        </View>
      </Modal>
    </DialogoContexto.Provider>
  );
}

const s = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: 'rgba(58, 39, 48, 0.45)', justifyContent: 'center', padding: espacio.xl },
  caja: {
    backgroundColor: color.algodon,
    borderRadius: radio.hoja,
    padding: espacio.xxl,
    gap: espacio.m,
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
  },
});
