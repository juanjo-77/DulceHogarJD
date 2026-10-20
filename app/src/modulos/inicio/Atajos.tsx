import { router, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { Inicio } from '@/api/tipos/resumen';
import { color, espacio, radio } from '@/tema/tokens';
import { Icono, type NombreIcono } from '@/ui/Icono';
import { Presionable } from '@/ui/Presionable';
import { Seccion } from '@/ui/Seccion';
import { Texto } from '@/ui/Texto';

type Atajo = { titulo: string; icono: NombreIcono; ruta: Href; cuenta?: number };

/** Cuadros grandes para llegar a todo lo demás del negocio. */
export function Atajos({ datos }: { datos: Inicio }) {
  const atajos: Atajo[] = [
    { titulo: 'Surtir', icono: 'truck-delivery-outline', ruta: '/surtir', cuenta: datos.porTraer },
    { titulo: 'Pedidos', icono: 'gift-outline', ruta: '/pedidos', cuenta: datos.pedidosPendientes },
    { titulo: 'Caja del día', icono: 'cash-register', ruta: '/caja' },
    { titulo: '¿Cómo va el negocio?', icono: 'chart-line', ruta: '/negocio' },
    { titulo: 'Devoluciones', icono: 'swap-horizontal', ruta: '/devoluciones' },
    { titulo: 'Ventas', icono: 'receipt-text-outline', ruta: '/ventas' },
  ];

  return (
    <Seccion titulo="Más cosas">
      <View style={s.rejilla}>
        {atajos.map((a) => (
          <Presionable key={a.titulo} onPress={() => router.push(a.ruta)} style={s.cuadro} accessibilityLabel={a.titulo}>
            <View style={s.arriba}>
              <View style={s.icono}>
                <Icono nombre={a.icono} tamano={28} color={color.frambuesa} />
              </View>
              {!!a.cuenta && (
                <View style={s.cuenta}>
                  <Texto tipo="pequenoFuerte" color={color.blanco}>{a.cuenta}</Texto>
                </View>
              )}
            </View>
            <Texto tipo="fuerte">{a.titulo}</Texto>
          </Presionable>
        ))}
      </View>
    </Seccion>
  );
}

const s = StyleSheet.create({
  rejilla: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.m },
  cuadro: {
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 112,
    backgroundColor: color.blanco,
    borderRadius: radio.tarjeta,
    borderWidth: 1,
    borderColor: color.hilo,
    padding: espacio.l,
    gap: espacio.s,
    justifyContent: 'space-between',
  },
  arriba: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  icono: { width: 48, height: 48, borderRadius: 14, backgroundColor: color.rosaNube, alignItems: 'center', justifyContent: 'center' },
  cuenta: { minWidth: 28, height: 28, borderRadius: 14, paddingHorizontal: 8, backgroundColor: color.frambuesa, alignItems: 'center', justifyContent: 'center' },
});
