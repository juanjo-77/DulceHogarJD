import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { color, espacio, fuente, radio, TOQUE_MINIMO } from '@/tema/tokens';

import { Texto } from './Texto';

type Props = Omit<TextInputProps, 'style'> & {
  etiqueta: string;
  ayuda?: string;
  opcional?: boolean;
};

export function Campo({ etiqueta, ayuda, opcional, multiline, ...props }: Props) {
  const [enfocado, setEnfocado] = useState(false);

  return (
    <View style={s.grupo}>
      <Texto tipo="fuerte">
        {etiqueta}
        {opcional && <Texto color={color.tintaTenue}> (si quieres)</Texto>}
      </Texto>
      <TextInput
        placeholderTextColor={color.tintaTenue}
        maxFontSizeMultiplier={1.35}
        {...props}
        multiline={multiline}
        accessibilityLabel={etiqueta}
        onFocus={(e) => {
          setEnfocado(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setEnfocado(false);
          props.onBlur?.(e);
        }}
        style={[s.entrada, multiline && s.multilinea, enfocado && s.enfocado]}
      />
      {ayuda && <Texto tipo="pequeno" color={color.tintaSuave}>{ayuda}</Texto>}
    </View>
  );
}

export const estiloEntrada = StyleSheet.create({
  base: {
    minHeight: TOQUE_MINIMO,
    borderRadius: radio.campo,
    borderWidth: 1.5,
    borderColor: color.hilo,
    backgroundColor: color.blanco,
    paddingHorizontal: espacio.l,
    fontFamily: fuente.normal,
    fontSize: 19,
    color: color.tinta,
  },
});

const s = StyleSheet.create({
  grupo: { gap: espacio.s },
  entrada: estiloEntrada.base,
  multilinea: { minHeight: 96, paddingTop: espacio.m, textAlignVertical: 'top' },
  enfocado: { borderColor: color.frambuesa },
});
