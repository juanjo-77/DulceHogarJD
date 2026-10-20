import { router, type Href } from 'expo-router';
import { View } from 'react-native';

import type { Movimiento } from '@/api/tipos/resumen';
import { hora, pesos } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { Fila } from '@/ui/Fila';
import { Icono, type NombreIcono } from '@/ui/Icono';
import { Seccion } from '@/ui/Seccion';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

const ICONOS: Record<Movimiento['categoria'], NombreIcono> = {
  Venta: 'cart-heart',
  Abono: 'hand-coin',
  Surtido: 'truck-delivery-outline',
  Gasto: 'cash-minus',
  'Otro ingreso': 'cash-plus',
  Devolución: 'swap-horizontal',
};

function destino(m: Movimiento): Href | null {
  if (m.ventaId) return `/venta/${m.ventaId}`;
  if (m.surtidoId) return `/surtir/${m.surtidoId}`;
  if (m.movimientoId) return `/gasto?id=${m.movimientoId}`;
  return null;
}

export function MovimientosCaja({ movimientos }: { movimientos: Movimiento[] }) {
  if (movimientos.length === 0) return <Texto color={color.tintaSuave} centrado>Este día no hubo movimientos.</Texto>;

  return (
    <Seccion titulo="Movimientos">
      <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
        {movimientos.map((m, i) => {
          const ruta = destino(m);
          return (
            <Fila
              key={m.clave}
              titulo={m.concepto}
              subtitulo={`${hora(m.fecha)} · ${m.categoria}`}
              izquierda={
                <View style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: m.entrada ? color.mentaFondo : color.coralFondo }}>
                  <Icono nombre={ICONOS[m.categoria]} tamano={22} color={m.entrada ? color.menta : color.coral} />
                </View>
              }
              derecha={<Texto tipo="fuerte" color={m.entrada ? color.menta : color.coral}>{m.entrada ? '+' : '−'}{pesos(m.monto)}</Texto>}
              ultima={i === movimientos.length - 1}
              onPress={ruta ? () => router.push(ruta) : undefined}
            />
          );
        })}
      </Tarjeta>
    </Seccion>
  );
}
