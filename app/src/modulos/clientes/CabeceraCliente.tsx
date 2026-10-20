import { StyleSheet, View } from 'react-native';

import type { Cliente } from '@/api/tipos/clientes';
import { abrirWhatsApp, llamar } from '@/funciones/whatsapp';
import { color, espacio } from '@/tema/tokens';
import { Avatar } from '@/ui/Avatar';
import { Boton } from '@/ui/Boton';
import { Texto } from '@/ui/Texto';

export function CabeceraCliente({ cliente }: { cliente: Cliente }) {
  return (
    <View style={s.contenedor}>
      <View style={s.fila}>
        <Avatar nombre={cliente.nombre} tamano={72} />
        <View style={{ flex: 1 }}>
          <Texto tipo="titulo">{cliente.nombre}</Texto>
          <Texto color={color.tintaSuave}>{cliente.telefono ?? 'Sin teléfono guardado'}</Texto>
        </View>
      </View>
      {cliente.telefono && (
        <View style={s.fila}>
          <Boton titulo="Llamar" icono="phone" variante="borde" onPress={() => llamar(cliente.telefono!)} style={{ flex: 1 }} />
          <Boton
            titulo="WhatsApp"
            icono="whatsapp"
            variante="whatsapp"
            onPress={() => abrirWhatsApp(`Hola ${cliente.nombre.split(' ')[0]} 🌸`, cliente.telefono)}
            style={{ flex: 1 }}
          />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  contenedor: { gap: espacio.l },
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
});
