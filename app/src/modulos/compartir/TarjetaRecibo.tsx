import { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Recibo } from '@/api/tipos/ventas';
import { fechaLarga, hora, pesos } from '@/funciones/formato';
import { color, espacio, radio } from '@/tema/tokens';
import { BarraProgreso } from '@/ui/BarraProgreso';
import { Texto } from '@/ui/Texto';
import type { Vista } from '@/ui/vista';

import { Membrete, PieNegocio } from './Membrete';

const TIPO = { Contado: 'Compra de contado', Fiado: 'Fiado', Separe: 'Plan separe' } as const;

/** El recibo que se le manda al cliente. Se convierte en imagen tal como se ve. */
export const TarjetaRecibo = forwardRef<Vista, { recibo: Recibo }>(function TarjetaRecibo({ recibo: r }, ref) {
  const pago = r.saldoDespues <= 0;
  return (
    <View ref={ref} collapsable={false} style={s.tarjeta}>
      <Membrete negocio={r.negocio.nombre} titulo="Recibo de abono" detalle={`N.º ${r.numero} · ${fechaLarga(r.fecha)}, ${hora(r.fecha)}`} />

      <View style={s.centro}>
        {r.cliente && <Texto color={color.tintaSuave}>Recibimos de {r.cliente.nombre}</Texto>}
        <Texto tipo="cifra" style={{ fontSize: 44, lineHeight: 52 }}>{pesos(r.monto)}</Texto>
        <Texto tipo="pequeno" color={color.tintaSuave}>{r.metodo === 'Efectivo' ? 'En efectivo' : 'Por transferencia'}</Texto>
      </View>

      <View style={s.detalle}>
        <Texto tipo="pequenoFuerte" color={color.tintaSuave}>{TIPO[r.tipo]}</Texto>
        <Texto>{r.descripcion}</Texto>
        {r.tipo !== 'Contado' && (
          <>
            <BarraProgreso valor={r.pagadoHastaAhora} total={r.total} tono={pago ? color.menta : color.frambuesa} />
            <Texto tipo="pequeno" color={color.tintaSuave}>Lleva {pesos(r.pagadoHastaAhora)} de {pesos(r.total)}</Texto>
            <Texto tipo="subtitulo" color={pago ? color.menta : color.frambuesaHundida}>
              {pago ? '¡Quedó todo pago!' : `Le falta ${pesos(r.saldoDespues)}`}
            </Texto>
          </>
        )}
      </View>

      <PieNegocio mensaje={r.negocio.mensaje} telefono={r.negocio.telefono} />
    </View>
  );
});

const s = StyleSheet.create({
  tarjeta: {
    backgroundColor: color.blanco,
    borderRadius: radio.tarjeta,
    borderWidth: 1,
    borderColor: color.hilo,
    padding: espacio.xxl,
    gap: espacio.xl,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  centro: { alignItems: 'center', gap: 2 },
  detalle: { backgroundColor: color.algodon, borderRadius: 16, padding: espacio.l, gap: espacio.s },
});
