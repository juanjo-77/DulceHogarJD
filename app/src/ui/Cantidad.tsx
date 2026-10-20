import { StyleSheet, View } from 'react-native';

import { color, espacio } from '@/tema/tokens';

import { Icono } from './Icono';
import { Presionable } from './Presionable';
import { Texto } from './Texto';

type Props = {
  valor: number;
  alCambiar: (valor: number) => void;
  minimo?: number;
  maximo?: number;
  pequeno?: boolean;
};

/** Botones − y + grandes para cambiar cantidades sin teclado. */
export function Cantidad({ valor, alCambiar, minimo = 0, maximo = 9999, pequeno }: Props) {
  const tamano = pequeno ? 40 : 52;
  const boton = [s.boton, { width: tamano, height: tamano, borderRadius: tamano / 2 }];

  return (
    <View style={s.fila}>
      <Presionable
        style={boton}
        onPress={() => alCambiar(Math.max(minimo, valor - 1))}
        disabled={valor <= minimo}
        accessibilityLabel="Quitar uno">
        <Icono nombre="minus" color={color.frambuesaHundida} tamano={pequeno ? 22 : 26} />
      </Presionable>
      <Texto tipo={pequeno ? 'fuerte' : 'subtitulo'} centrado style={{ minWidth: pequeno ? 32 : 44 }}>
        {valor}
      </Texto>
      <Presionable
        style={boton}
        onPress={() => alCambiar(Math.min(maximo, valor + 1))}
        disabled={valor >= maximo}
        accessibilityLabel="Agregar uno">
        <Icono nombre="plus" color={color.frambuesaHundida} tamano={pequeno ? 22 : 26} />
      </Presionable>
    </View>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.s },
  boton: { backgroundColor: color.rosaPalo, alignItems: 'center', justifyContent: 'center' },
});
