import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { mensajeDeError } from '@/api/pedir';
import { color, espacio, radio } from '@/tema/tokens';

import { Boton } from './Boton';
import { Icono } from './Icono';
import { Texto } from './Texto';

export function Cargando({ texto = 'Cargando…' }: { texto?: string }) {
  return (
    <View style={s.centro}>
      <ActivityIndicator size="large" color={color.frambuesa} />
      <Texto color={color.tintaSuave}>{texto}</Texto>
    </View>
  );
}

export function ErrorVista({ mensaje, reintentar }: { mensaje: string; reintentar?: () => void }) {
  return (
    <View style={s.error}>
      <Icono nombre="wifi-alert" tamano={32} color={color.coral} />
      <Texto centrado>{mensaje}</Texto>
      {reintentar && <Boton titulo="Intentar de nuevo" icono="refresh" variante="borde" onPress={reintentar} />}
    </View>
  );
}

/** Muestra "Cargando", el error o el contenido según cómo vaya la consulta. */
export function ConDatos<T>({ consulta, children }: { consulta: UseQueryResult<T>; children: (datos: T) => ReactNode }) {
  if (consulta.data !== undefined) return <>{children(consulta.data)}</>;
  if (consulta.isError) return <ErrorVista mensaje={mensajeDeError(consulta.error)} reintentar={() => consulta.refetch()} />;
  return <Cargando />;
}

const s = StyleSheet.create({
  centro: { alignItems: 'center', gap: espacio.m, paddingVertical: espacio.xxxl },
  error: {
    alignItems: 'center',
    gap: espacio.m,
    padding: espacio.xxl,
    borderRadius: radio.tarjeta,
    backgroundColor: color.coralFondo,
  },
});
