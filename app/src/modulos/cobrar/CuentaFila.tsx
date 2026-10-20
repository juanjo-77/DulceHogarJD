import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { Cuenta } from '@/api/tipos/ventas';
import { pesos } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { BarraProgreso } from '@/ui/BarraProgreso';
import { Icono } from '@/ui/Icono';
import { Presionable } from '@/ui/Presionable';
import { Texto } from '@/ui/Texto';

import { EstadoCuentaInsignia } from './EstadoCuentaInsignia';

type Props = { cuenta: Cuenta; ultima?: boolean; mostrarCliente?: boolean };

/** Un fiado o plan separe: cuánto lleva pagado, cuánto falta y si está a tiempo. */
export function CuentaFila({ cuenta: c, ultima, mostrarCliente = true }: Props) {
  const tipo = c.tipo === 'Separe' ? 'Plan separe' : 'Fiado';
  return (
    <Presionable
      onPress={() => router.push(`/venta/${c.ventaId}`)}
      escala={0.985}
      style={[s.fila, !ultima && s.divisor]}
      accessibilityLabel={`${tipo} de ${c.cliente?.nombre}, debe ${pesos(c.saldo)}`}>
      <View style={s.arriba}>
        <View style={{ flex: 1, gap: 2 }}>
          <Texto tipo="fuerte" numberOfLines={1}>{mostrarCliente ? c.cliente?.nombre : tipo}</Texto>
          <Texto tipo="pequeno" color={color.tintaSuave} numberOfLines={1}>
            {mostrarCliente ? `${tipo} · ` : ''}{c.descripcion}
          </Texto>
        </View>
        <Icono nombre="chevron-right" color={color.tintaTenue} />
      </View>
      <BarraProgreso valor={c.pagado} total={c.total} tono={c.estado === 'Vencida' ? color.coral : color.frambuesa} />
      <View style={s.abajo}>
        <Texto tipo="pequeno" color={color.tintaSuave}>
          {c.saldo > 0 ? <>Debe <Texto tipo="pequenoFuerte">{pesos(c.saldo)}</Texto> de {pesos(c.total)}</> : `Pagó ${pesos(c.total)}`}
        </Texto>
        <EstadoCuentaInsignia estado={c.estado} dias={c.diasRestantes} />
      </View>
    </Presionable>
  );
}

const s = StyleSheet.create({
  fila: { paddingVertical: espacio.m, gap: espacio.s },
  divisor: { borderBottomWidth: 1, borderBottomColor: color.hilo },
  arriba: { flexDirection: 'row', alignItems: 'center', gap: espacio.s },
  abajo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: espacio.s, flexWrap: 'wrap' },
});
