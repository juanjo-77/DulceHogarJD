import { router } from 'expo-router';
import { View } from 'react-native';

import { ventasApi } from '@/api/consultas/ventas';
import type { VentaDetalle } from '@/api/tipos/ventas';
import { useAccion } from '@/api/useAccion';
import { espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';

/** Lo siguiente que se puede hacer con esta venta, en orden de importancia. */
export function AccionesVenta({ venta: v }: { venta: VentaDetalle }) {
  const entregar = useAccion(ventasApi.entregar, { exito: '¡Entregado! Plan separe cerrado' });
  if (v.anulada) return null;

  const ultimoAbono = v.abonos.at(-1);
  const puedeEntregar = v.tipo === 'Separe' && !v.entregada && v.saldo <= 0;

  return (
    <View style={{ gap: espacio.m }}>
      {v.saldo > 0 && (
        <Boton titulo="Recibir un abono" icono="hand-coin" grande onPress={() => router.push(`/venta/abonar/${v.id}`)} />
      )}
      {puedeEntregar && (
        <Boton titulo="Ya se lo entregué" icono="package-variant-closed-check" grande cargando={entregar.isPending} onPress={() => entregar.mutate(v.id)} />
      )}
      {v.cliente && v.saldo > 0 && (
        <Boton titulo="Enviar estado de cuenta" icono="whatsapp" variante="whatsapp" onPress={() => router.push(`/cliente/estado/${v.cliente!.id}`)} />
      )}
      {ultimoAbono && (
        <Boton titulo="Ver último recibo" icono="receipt-text-outline" variante="borde" onPress={() => router.push(`/recibo/${ultimoAbono.id}`)} />
      )}
    </View>
  );
}
