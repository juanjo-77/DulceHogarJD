import { StyleSheet, View } from 'react-native';

import { color, espacio, radio } from '@/tema/tokens';

import { Boton } from './Boton';
import { Icono, type NombreIcono } from './Icono';
import { Texto } from './Texto';

type Props = {
  icono: NombreIcono;
  titulo: string;
  texto?: string;
  accion?: { titulo: string; onPress: () => void };
};

/** Una lista vacía es una invitación a empezar, no un error. */
export function Vacio({ icono, titulo, texto, accion }: Props) {
  return (
    <View style={s.caja}>
      <View style={s.circulo}>
        <Icono nombre={icono} tamano={34} color={color.frambuesa} />
      </View>
      <Texto tipo="subtitulo" centrado>{titulo}</Texto>
      {texto && <Texto color={color.tintaSuave} centrado>{texto}</Texto>}
      {accion && <Boton titulo={accion.titulo} onPress={accion.onPress} icono="plus" style={{ alignSelf: 'stretch' }} />}
    </View>
  );
}

const s = StyleSheet.create({
  caja: {
    alignItems: 'center',
    gap: espacio.m,
    padding: espacio.xxl,
    borderRadius: radio.tarjeta,
    backgroundColor: color.lino,
  },
  circulo: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: color.blanco,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
