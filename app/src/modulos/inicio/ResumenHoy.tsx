import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { Inicio } from '@/api/tipos/resumen';
import { pesos, plural } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { Icono } from '@/ui/Icono';
import { Presionable } from '@/ui/Presionable';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

/** Las tres cifras del día: lo vendido, la plata que entró y lo que le deben. */
export function ResumenHoy({ datos }: { datos: Inicio }) {
  return (
    <Tarjeta>
      <View style={s.principal}>
        <Texto color={color.tintaSuave}>Hoy vendiste</Texto>
        <Texto tipo="cifra">{pesos(datos.vendidoHoy)}</Texto>
        <Texto tipo="pequeno" color={color.tintaSuave}>
          {datos.ventasHoy === 0 ? 'Todavía no hay ventas hoy' : plural(datos.ventasHoy, 'venta', 'ventas')}
        </Texto>
      </View>
      <View style={s.fila}>
        <Presionable style={s.dato} onPress={() => router.push('/caja')} accessibilityLabel="Ver la caja de hoy">
          <Texto tipo="pequeno" color={color.tintaSuave}>Te entró</Texto>
          <Texto tipo="subtitulo" color={color.menta}>{pesos(datos.entroHoy)}</Texto>
        </Presionable>
        <Presionable style={s.dato} onPress={() => router.navigate('/cobrar')} accessibilityLabel="Ver quién me debe">
          <View style={s.etiquetaDato}>
            <Texto tipo="pequeno" color={color.tintaSuave}>Te deben</Texto>
            <Icono nombre="chevron-right" tamano={18} color={color.tintaTenue} />
          </View>
          <Texto tipo="subtitulo" color={color.frambuesaHundida}>{pesos(datos.porCobrar)}</Texto>
          <Texto tipo="pequeno" color={color.tintaSuave}>{plural(datos.personasQueDeben, 'persona', 'personas')}</Texto>
        </Presionable>
      </View>
    </Tarjeta>
  );
}

const s = StyleSheet.create({
  principal: { gap: 2 },
  fila: { flexDirection: 'row', gap: espacio.m },
  dato: { flex: 1, backgroundColor: color.lino, borderRadius: 16, padding: espacio.m, gap: 2 },
  etiquetaDato: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
