import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ventasApi } from '@/api/consultas/ventas';
import type { MetodoPago, TipoVenta } from '@/api/tipos/ventas';
import { useAccion } from '@/api/useAccion';
import { aFechaApi, pesos, sumarDias } from '@/funciones/formato';
import { espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { CampoDinero } from '@/ui/CampoDinero';
import { SelectorFecha } from '@/ui/SelectorFecha';

import { SelectorCliente } from '../clientes/SelectorCliente';
import { carrito, useCarrito } from './carrito';
import { ElegirMetodo } from './ElegirMetodo';
import { OpcionTipo, TIPOS_VENTA } from './OpcionTipo';
import { TotalVenta } from './TotalVenta';

const PLAZO_DIAS: Record<TipoVenta, number> = { Contado: 0, Fiado: 30, Separe: 60 };

type Props = { alVolver: () => void; alTerminar: () => void };

export function PasoPago({ alVolver, alTerminar }: Props) {
  const { lineas, total, cliente, encargoId } = useCarrito();
  const [tipo, setTipo] = useState<TipoVenta>('Contado');
  const [abono, setAbono] = useState(0);
  const [metodo, setMetodo] = useState<MetodoPago>('Efectivo');
  const [fecha, setFecha] = useState(aFechaApi(sumarDias(new Date(), 30)));

  const vender = useAccion(ventasApi.crear, {
    exito: 'Venta registrada',
    alTerminar: (venta) => {
      carrito.vaciar();
      alTerminar();
      router.push(`/venta/${venta.id}?nueva=1`);
    },
  });

  const elegirTipo = (nuevo: TipoVenta) => {
    setTipo(nuevo);
    setAbono(0);
    if (nuevo !== 'Contado') setFecha(aFechaApi(sumarDias(new Date(), PLAZO_DIAS[nuevo])));
  };

  const aCredito = tipo !== 'Contado';
  const registrar = () =>
    vender.mutate({
      clienteId: cliente?.id ?? null,
      tipo,
      items: lineas.map((l) => ({ productoId: l.producto.id, cantidad: l.cantidad })),
      abonoInicial: aCredito ? abono : total,
      metodo,
      fechaLimite: aCredito ? fecha : null,
      notas: null,
      encargoId,
    });

  return (
    <View style={{ gap: espacio.xl }}>
      <View style={{ gap: espacio.m }} accessibilityRole="radiogroup">
        {TIPOS_VENTA.map((o) => (
          <OpcionTipo key={o.tipo} opcion={o} activa={tipo === o.tipo} onPress={() => elegirTipo(o.tipo)} />
        ))}
      </View>

      <SelectorCliente valor={cliente} alCambiar={carrito.elegirCliente} etiqueta={aCredito ? '¿A quién le vendes?' : '¿A quién le vendes? (si quieres)'} />

      {aCredito && (
        <>
          <CampoDinero
            etiqueta={tipo === 'Separe' ? '¿Cuánto abona hoy?' : '¿Abona algo hoy?'}
            valor={abono}
            alCambiar={setAbono}
            rapidos={[
              { titulo: 'Nada', valor: 0 },
              { titulo: 'La mitad', valor: Math.round(total / 2 / 1000) * 1000 },
            ]}
          />
          <SelectorFecha
            etiqueta={tipo === 'Fiado' ? '¿Cuándo te paga?' : '¿Hasta cuándo tiene para pagar?'}
            valor={fecha}
            alCambiar={setFecha}
            opciones={[
              { titulo: 'En 15 días', dias: 15 },
              { titulo: 'En 1 mes', dias: 30 },
              { titulo: 'En 2 meses', dias: 60 },
            ]}
          />
        </>
      )}

      {(!aCredito || abono > 0) && <ElegirMetodo valor={metodo} alCambiar={setMetodo} />}

      <TotalVenta total={total} pagaHoy={aCredito ? abono : total} />

      <Boton titulo="Registrar venta" icono="check-bold" grande cargando={vender.isPending} onPress={registrar} />
      <Boton titulo="Cambiar productos" icono="arrow-left" variante="borde" onPress={alVolver} />
    </View>
  );
}
