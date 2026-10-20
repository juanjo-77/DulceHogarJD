import { Text, type TextProps } from 'react-native';

import { color, tipo as escala, type Tipo } from '@/tema/tokens';

type Props = TextProps & {
  tipo?: Tipo;
  color?: string;
  centrado?: boolean;
};

/** Todo el texto de la app pasa por aquí: misma fuente, misma escala. */
export function Texto({ tipo = 'cuerpo', color: tono = color.tinta, centrado, style, ...props }: Props) {
  return (
    <Text
      maxFontSizeMultiplier={1.35}
      {...props}
      style={[escala[tipo], { color: tono }, centrado && { textAlign: 'center' }, style]}
    />
  );
}
