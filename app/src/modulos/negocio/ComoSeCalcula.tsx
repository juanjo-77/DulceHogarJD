import { StyleSheet, View } from 'react-native';

import type { Mes } from '@/api/tipos/resumen';
import { pesos, plural } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { Seccion } from '@/ui/Seccion';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

/** La cuenta paso a paso, para que la ganancia no sea un número mágico. */
export function ComoSeCalcula({ mes: m }: { mes: Mes }) {
  if (m.numeroVentas === 0) return null;
  return (
    <Seccion titulo="Cómo se calcula">
      <Tarjeta>
        <Renglon signo="" titulo={`Vendiste (${plural(m.numeroVentas, 'venta', 'ventas')})`} valor={m.vendido} />
        <Renglon signo="−" titulo="Lo que te costó esa mercancía" valor={m.costoMercancia} />
        <Renglon signo="−" titulo="Gastos del negocio" valor={m.gastos} />
        {m.otrosIngresos > 0 && <Renglon signo="+" titulo="Otros ingresos" valor={m.otrosIngresos} />}
        <View style={s.total}>
          <Texto tipo="fuerte" style={{ flex: 1 }}>Ganancia aproximada</Texto>
          <Texto tipo="subtitulo" color={m.ganancia >= 0 ? color.menta : color.coral}>{pesos(m.ganancia)}</Texto>
        </View>
        <Texto tipo="pequeno" color={color.tintaSuave}>
          De cada {pesos(100_000)} que vendes, te quedan unos {pesos(Math.max(m.margen, 0) * 1000)}.
        </Texto>
      </Tarjeta>
    </Seccion>
  );
}

function Renglon({ signo, titulo, valor }: { signo: string; titulo: string; valor: number }) {
  return (
    <View style={s.renglon}>
      <Texto color={color.tintaSuave} style={{ flex: 1 }}>{signo ? `${signo} ` : ''}{titulo}</Texto>
      <Texto tipo="fuerte">{pesos(valor)}</Texto>
    </View>
  );
}

const s = StyleSheet.create({
  renglon: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
  total: { flexDirection: 'row', alignItems: 'center', gap: espacio.m, borderTopWidth: 1.5, borderTopColor: color.hilo, paddingTop: espacio.m },
});
