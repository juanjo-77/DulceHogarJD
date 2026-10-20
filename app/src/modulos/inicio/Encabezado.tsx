import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { fechaConDia, saludo } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { Etiqueta } from '@/ui/Etiqueta';
import { Icono } from '@/ui/Icono';
import { Presionable } from '@/ui/Presionable';
import { Texto } from '@/ui/Texto';

export function Encabezado() {
  return (
    <View style={s.contenedor}>
      <View style={s.fila}>
        <Etiqueta>
          <Texto tipo="marca" color={color.frambuesaHundida}>Dulce Hogar JD</Texto>
        </Etiqueta>
        <Presionable onPress={() => router.push('/ajustes')} style={s.ajustes} accessibilityLabel="Ajustes">
          <Icono nombre="cog-outline" tamano={26} color={color.tintaSuave} />
        </Presionable>
      </View>
      <View>
        <Texto tipo="titulo">{saludo()}</Texto>
        <Texto color={color.tintaSuave}>Hoy es {fechaConDia(new Date())}</Texto>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  contenedor: { gap: espacio.l },
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ajustes: { width: 52, height: 52, borderRadius: 26, backgroundColor: color.lino, alignItems: 'center', justifyContent: 'center' },
});
