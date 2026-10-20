import { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Cliente } from '@/api/tipos/clientes';
import type { Ajustes } from '@/api/tipos/resumen';
import type { Cuenta } from '@/api/tipos/ventas';
import { fechaLarga, pesos } from '@/funciones/formato';
import { color, espacio, radio } from '@/tema/tokens';
import { BarraProgreso } from '@/ui/BarraProgreso';
import { Texto } from '@/ui/Texto';
import type { Vista } from '@/ui/vista';

import { Membrete, PieNegocio } from './Membrete';

type Props = { cliente: Cliente; cuentas: Cuenta[]; negocio: Ajustes | undefined };

/** Estado de cuenta personal: se arma con lo que debe cada persona en este momento. */
export const TarjetaEstadoCuenta = forwardRef<Vista, Props>(function TarjetaEstadoCuenta({ cliente, cuentas, negocio }, ref) {
  const total = cuentas.reduce((s, c) => s + Math.max(c.saldo, 0), 0);

  return (
    <View ref={ref} collapsable={false} style={s.tarjeta}>
      <Membrete negocio={negocio?.nombreNegocio ?? 'Dulce Hogar JD'} titulo="Estado de cuenta" detalle={`${cliente.nombre} · ${fechaLarga(new Date())}`} />

      {cuentas.map((c) => (
        <View key={c.ventaId} style={s.cuenta}>
          <Texto tipo="pequenoFuerte" color={color.tintaSuave}>{c.tipo === 'Separe' ? 'Plan separe' : 'Fiado'} del {fechaLarga(c.fecha)}</Texto>
          <Texto tipo="fuerte">{c.descripcion}</Texto>
          <BarraProgreso valor={c.pagado} total={c.total} tono={c.estado === 'Vencida' ? color.coral : color.frambuesa} />
          <View style={s.fila}>
            <Texto tipo="pequeno" color={color.tintaSuave}>Abonado {pesos(Math.max(c.pagado, 0))} de {pesos(c.total)}</Texto>
            <Texto tipo="fuerte" color={color.frambuesaHundida}>Falta {pesos(c.saldo)}</Texto>
          </View>
          {c.fechaLimite && (
            <Texto tipo="pequeno" color={c.estado === 'Vencida' ? color.coral : color.tintaSuave}>
              {c.estado === 'Vencida' ? 'Venció' : 'Fecha de pago'}: {fechaLarga(c.fechaLimite)}
            </Texto>
          )}
        </View>
      ))}

      <View style={s.total}>
        <Texto color={color.tintaSuave}>Total pendiente</Texto>
        <Texto tipo="cifra" color={color.frambuesaHundida}>{pesos(total)}</Texto>
      </View>

      <PieNegocio mensaje="¡Gracias por tu confianza!" telefono={negocio?.telefono ?? null} />
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
    gap: espacio.l,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  cuenta: { backgroundColor: color.algodon, borderRadius: 16, padding: espacio.l, gap: espacio.s },
  fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: espacio.s },
  total: { alignItems: 'center', backgroundColor: color.rosaNube, borderRadius: 16, padding: espacio.l },
});
