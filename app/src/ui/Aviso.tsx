import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, espacio, radio, sombra } from '@/tema/tokens';

import { Icono } from './Icono';
import { Texto } from './Texto';

type Aviso = { id: number; texto: string; tipo: 'exito' | 'error' };
type Contexto = { exito: (texto: string) => void; error: (texto: string) => void };

const AvisoContexto = createContext<Contexto>({ exito: () => {}, error: () => {} });

export const useAviso = () => useContext(AvisoContexto);

/** Mensajes cortos abajo de la pantalla: "Venta registrada", "No hay conexión"... */
export function AvisoProveedor({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { bottom } = useSafeAreaInsets();

  const mostrar = useCallback((texto: string, tipo: Aviso['tipo']) => {
    clearTimeout(temporizador.current);
    setAviso({ id: Date.now(), texto, tipo });
    temporizador.current = setTimeout(() => setAviso(null), tipo === 'error' ? 5000 : 2600);
  }, []);

  const valor = useRef<Contexto>({ exito: (t) => mostrar(t, 'exito'), error: (t) => mostrar(t, 'error') }).current;

  return (
    <AvisoContexto.Provider value={valor}>
      {children}
      <View style={[s.capa, { bottom: bottom + 96 }]} pointerEvents="none">
        {aviso && (
          <Animated.View
            key={aviso.id}
            entering={FadeInDown.springify().damping(18)}
            exiting={FadeOutDown.duration(180)}
            accessibilityLiveRegion="polite"
            style={[s.aviso, aviso.tipo === 'error' ? s.error : s.exito]}>
            <Icono nombre={aviso.tipo === 'error' ? 'alert-circle' : 'check-circle'} color={color.blanco} />
            <Texto tipo="fuerte" color={color.blanco} style={{ flex: 1 }}>{aviso.texto}</Texto>
          </Animated.View>
        )}
      </View>
    </AvisoContexto.Provider>
  );
}

const s = StyleSheet.create({
  capa: { position: 'absolute', left: espacio.l, right: espacio.l, alignItems: 'center' },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.m,
    paddingVertical: espacio.m,
    paddingHorizontal: espacio.l,
    borderRadius: radio.boton,
    maxWidth: 560,
    width: '100%',
    ...sombra.flotante,
  },
  exito: { backgroundColor: color.menta },
  error: { backgroundColor: color.coral },
});
