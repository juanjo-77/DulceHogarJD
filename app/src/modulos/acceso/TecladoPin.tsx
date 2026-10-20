import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

import { color, espacio } from '@/tema/tokens';
import { Icono } from '@/ui/Icono';
import { Presionable } from '@/ui/Presionable';
import { Texto } from '@/ui/Texto';

const FILAS = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']];

type Props = {
  alTocar: (digito: string) => void;
  alBorrar: () => void;
  alEntrar: () => void;
  puedeEntrar: boolean;
  revisando: boolean;
};

const vibrar = () => {
  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

/** Teclado de números grande, como el de un cajero: no depende del teclado del celular. */
export function TecladoPin({ alTocar, alBorrar, alEntrar, puedeEntrar, revisando }: Props) {
  const tecla = (digito: string) => (
    <Presionable key={digito} style={s.tecla} escala={0.92} accessibilityLabel={digito} onPress={() => { vibrar(); alTocar(digito); }}>
      <Texto tipo="titulo">{digito}</Texto>
    </Presionable>
  );

  return (
    <View style={s.teclado}>
      {FILAS.map((fila) => (
        <View key={fila.join('')} style={s.fila}>{fila.map(tecla)}</View>
      ))}
      <View style={s.fila}>
        <Presionable style={[s.tecla, s.secundaria]} escala={0.92} accessibilityLabel="Borrar" onPress={() => { vibrar(); alBorrar(); }}>
          <Icono nombre="backspace-outline" tamano={30} color={color.tintaSuave} />
        </Presionable>
        {tecla('0')}
        <Presionable
          style={[s.tecla, s.entrar, !puedeEntrar && s.apagada]}
          escala={0.92}
          disabled={!puedeEntrar}
          accessibilityLabel="Entrar"
          onPress={alEntrar}>
          {revisando ? <ActivityIndicator color={color.blanco} /> : <Icono nombre="check-bold" tamano={32} color={color.blanco} />}
        </Presionable>
      </View>
    </View>
  );
}

const TAMANO = 78;

const s = StyleSheet.create({
  teclado: { gap: espacio.m, alignItems: 'center' },
  fila: { flexDirection: 'row', gap: espacio.xl },
  tecla: {
    width: TAMANO,
    height: TAMANO,
    borderRadius: TAMANO / 2,
    backgroundColor: color.blanco,
    borderWidth: 1.5,
    borderColor: color.hilo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secundaria: { backgroundColor: color.lino, borderColor: color.lino },
  entrar: { backgroundColor: color.frambuesa, borderColor: color.frambuesa },
  apagada: { backgroundColor: color.tintaTenue, borderColor: color.tintaTenue },
});
