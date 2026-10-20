import { View } from 'react-native';

import type { VentaDetalle } from '@/api/tipos/ventas';
import { cuandoToca, fechaConDia, fechaLarga, pesos } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { BarraProgreso } from '@/ui/BarraProgreso';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

import { EstadoCuentaInsignia } from '../cobrar/EstadoCuentaInsignia';

/** La cifra que importa: cuánto debe (o que ya está todo pago) y hasta cuándo tiene. */
export function EstadoVenta({ venta: v }: { venta: VentaDetalle }) {
  const debe = v.saldo > 0;
  const tono = v.estado === 'Vencida' ? color.coral : color.frambuesaHundida;

  return (
    <Tarjeta tono={debe ? 'rosa' : 'blanco'}>
      <View style={{ gap: 2 }}>
        <Texto color={color.tintaSuave}>{debe ? 'Le falta pagar' : 'Total de la venta'}</Texto>
        <Texto tipo="cifra" color={debe ? tono : color.tinta}>{pesos(debe ? v.saldo : v.total)}</Texto>
      </View>
      {v.tipo !== 'Contado' && (
        <View style={{ gap: espacio.s }}>
          <BarraProgreso valor={v.pagado} total={v.total} tono={debe ? tono : color.menta} alto={14} />
          <Texto tipo="pequeno" color={color.tintaSuave}>
            Ha pagado {pesos(Math.max(v.pagado, 0))} de {pesos(v.total)}
          </Texto>
        </View>
      )}
      <EstadoCuentaInsignia estado={v.estado} dias={v.diasRestantes} />
      {debe && v.fechaLimite && (
        <Texto color={color.tintaSuave}>
          {v.tipo === 'Fiado' ? 'Quedó de pagar' : 'Tiene plazo hasta'} el {fechaConDia(v.fechaLimite)}
          {v.diasRestantes !== null && ` (${cuandoToca(v.diasRestantes)})`}.
        </Texto>
      )}
      {v.tipo === 'Separe' && v.entregada && v.entregadaEn && (
        <Texto color={color.menta}>Se entregó el {fechaLarga(v.entregadaEn)}.</Texto>
      )}
      <Texto tipo="pequeno" color={color.tintaTenue}>Venta del {fechaLarga(v.fecha)} · N.º {v.id}</Texto>
    </Tarjeta>
  );
}
