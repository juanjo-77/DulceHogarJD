import { router, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { Alerta } from '@/api/tipos/resumen';
import { color, espacio } from '@/tema/tokens';
import { Icono, type NombreIcono } from '@/ui/Icono';
import { Seccion } from '@/ui/Seccion';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';
import { Fila } from '@/ui/Fila';

const ICONOS: Record<Alerta['tipo'], NombreIcono> = {
  vencida: 'alarm',
  pedido: 'gift-outline',
  entregar: 'package-variant-closed-check',
  agotado: 'package-variant-remove',
  poco: 'package-down',
  proxima: 'calendar-clock',
};

const NIVELES = [
  { fondo: color.lino, tono: color.tintaSuave },
  { fondo: color.mielFondo, tono: color.miel },
  { fondo: color.coralFondo, tono: color.coral },
];

/** Lo que necesita atención hoy, lo más urgente primero. */
export function Pendientes({ alertas }: { alertas: Alerta[] }) {
  if (alertas.length === 0) {
    return (
      <Tarjeta tono="lino" style={s.alDia}>
        <Icono nombre="check-decagram" tamano={30} color={color.menta} />
        <Texto tipo="fuerte" style={{ flex: 1 }}>Todo está al día. No hay nada pendiente.</Texto>
      </Tarjeta>
    );
  }

  return (
    <Seccion titulo="Para tener en cuenta">
      <Tarjeta style={s.lista}>
        {alertas.map((a, i) => {
          const nivel = NIVELES[a.nivel];
          return (
            <Fila
              key={a.clave}
              titulo={a.titulo}
              subtitulo={a.detalle}
              ultima={i === alertas.length - 1}
              onPress={() => router.push(a.ruta as Href)}
              izquierda={
                <View style={[s.icono, { backgroundColor: nivel.fondo }]}>
                  <Icono nombre={ICONOS[a.tipo]} tamano={24} color={nivel.tono} />
                </View>
              }
            />
          );
        })}
      </Tarjeta>
    </Seccion>
  );
}

const s = StyleSheet.create({
  alDia: { flexDirection: 'row', alignItems: 'center' },
  lista: { paddingVertical: espacio.xs, gap: 0 },
  icono: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
