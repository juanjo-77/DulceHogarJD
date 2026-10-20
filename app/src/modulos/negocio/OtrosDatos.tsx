import { StyleSheet, View } from 'react-native';

import type { Mes } from '@/api/tipos/resumen';
import { pesos } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { Seccion } from '@/ui/Seccion';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

/** Más números del mes, cada uno con una frase que dice qué significa. */
export function OtrosDatos({ mes: m }: { mes: Mes }) {
  const datos = [
    { titulo: 'Plata que te entró', valor: m.dineroQueEntro, ayuda: 'Ventas de contado y abonos que recibiste.' },
    { titulo: 'Compraste mercancía por', valor: m.comprasSurtido, ayuda: 'Lo que pagaste al surtir este mes.' },
    { titulo: 'Te deben hoy', valor: m.porCobrar, ayuda: 'Fiados y planes separe sin terminar de pagar.' },
    { titulo: `Vendiste en ${m.nombreMesAnterior}`, valor: m.vendidoMesAnterior, ayuda: 'Para comparar con el mes pasado.' },
  ];

  return (
    <Seccion titulo="Otros datos del mes">
      <Tarjeta style={{ gap: 0, paddingVertical: espacio.xs }}>
        {datos.map((d, i) => (
          <View key={d.titulo} style={[s.fila, i < datos.length - 1 && s.divisor]}>
            <View style={{ flex: 1 }}>
              <Texto tipo="fuerte">{d.titulo}</Texto>
              <Texto tipo="pequeno" color={color.tintaSuave}>{d.ayuda}</Texto>
            </View>
            <Texto tipo="fuerte">{pesos(d.valor)}</Texto>
          </View>
        ))}
      </Tarjeta>
      <Texto tipo="pequeno" color={color.tintaSuave}>
        Contado {pesos(m.vendidoContado)} · Fiado {pesos(m.vendidoFiado)} · Plan separe {pesos(m.vendidoSepare)}
      </Texto>
    </Seccion>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.m, paddingVertical: espacio.m },
  divisor: { borderBottomWidth: 1, borderBottomColor: color.hilo },
});
