import { StyleSheet, TextInput, View } from 'react-native';

import { color, espacio } from '@/tema/tokens';

import { estiloEntrada } from './Campo';
import { Icono } from './Icono';
import { Presionable } from './Presionable';

type Props = { valor: string; alCambiar: (texto: string) => void; placeholder: string };

export function Buscador({ valor, alCambiar, placeholder }: Props) {
  return (
    <View style={s.caja}>
      <View style={s.lupa} pointerEvents="none">
        <Icono nombre="magnify" tamano={24} color={color.tintaSuave} />
      </View>
      <TextInput
        value={valor}
        onChangeText={alCambiar}
        placeholder={placeholder}
        placeholderTextColor={color.tintaTenue}
        accessibilityLabel={placeholder}
        returnKeyType="search"
        maxFontSizeMultiplier={1.35}
        style={[estiloEntrada.base, s.entrada]}
      />
      {valor.length > 0 && (
        <Presionable onPress={() => alCambiar('')} style={s.borrar} accessibilityLabel="Borrar búsqueda">
          <Icono nombre="close-circle" tamano={24} color={color.tintaTenue} />
        </Presionable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  caja: { justifyContent: 'center' },
  entrada: { paddingLeft: 48, paddingRight: 48 },
  lupa: { position: 'absolute', left: espacio.l, zIndex: 1 },
  borrar: { position: 'absolute', right: 4, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
});
