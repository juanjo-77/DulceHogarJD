import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Mes } from '@/api/tipos/resumen';
import { nombreMes, pesos } from '@/funciones/formato';
import { color, espacio } from '@/tema/tokens';
import { Presionable } from '@/ui/Presionable';
import { Seccion } from '@/ui/Seccion';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

const ALTO = 150;
const ANCHO_BARRA = 24;

type Punto = Mes['tendencia'][number];

/**
 * Ganancia de los últimos 6 meses en columnas. Un solo dato, así que no lleva leyenda:
 * frambuesa si hubo ganancia, ocre si hubo pérdida. Al tocar una columna se ve su valor.
 */
export function GraficaMeses({ puntos }: { puntos: Punto[] }) {
  const [elegido, setElegido] = useState(puntos.length - 1);
  const maxArriba = Math.max(0, ...puntos.map((p) => p.ganancia));
  const maxAbajo = Math.max(0, ...puntos.map((p) => -p.ganancia));
  const rango = maxArriba + maxAbajo || 1;
  const base = (ALTO * maxArriba) / rango;
  const p = puntos[elegido];

  return (
    <Seccion titulo="Ganancia de los últimos 6 meses" ayuda="Toca una columna para ver su valor.">
      <Tarjeta>
        <Texto accessibilityLiveRegion="polite">
          En {nombreMes(p.mes)} {p.ganancia >= 0 ? 'ganaste' : 'perdiste'}{' '}
          <Texto tipo="fuerte">{pesos(Math.abs(p.ganancia))}</Texto> (vendiste {pesos(p.vendido)}).
        </Texto>
        <View style={[s.lienzo, { height: ALTO }]}>
          <View style={[s.base, { top: base }]} />
          {puntos.map((punto, i) => {
            const alto = Math.max((Math.abs(punto.ganancia) * ALTO) / rango, punto.ganancia === 0 ? 0 : 3);
            const positivo = punto.ganancia >= 0;
            return (
              <Presionable
                key={`${punto.anio}-${punto.mes}`}
                onPress={() => setElegido(i)}
                escala={0.94}
                accessibilityLabel={`${nombreMes(punto.mes)}: ${pesos(punto.ganancia)}`}
                accessibilityState={{ selected: i === elegido }}
                style={[s.columna, i === elegido && s.elegida]}>
                <View
                  style={[
                    s.barra,
                    positivo ? { top: base - alto, borderTopLeftRadius: 4, borderTopRightRadius: 4 } : { top: base, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
                    { height: alto, backgroundColor: positivo ? color.frambuesa : color.ocre },
                  ]}
                />
              </Presionable>
            );
          })}
        </View>
        <View style={s.etiquetas}>
          {puntos.map((punto, i) => (
            <Texto key={punto.mes} tipo={i === elegido ? 'pequenoFuerte' : 'pequeno'} color={i === elegido ? color.tinta : color.tintaSuave} centrado style={{ flex: 1 }}>
              {punto.etiqueta}
            </Texto>
          ))}
        </View>
      </Tarjeta>
    </Seccion>
  );
}

const s = StyleSheet.create({
  lienzo: { flexDirection: 'row', marginTop: espacio.s },
  base: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: color.linoOscuro },
  columna: { flex: 1, alignItems: 'center', borderRadius: 10 },
  elegida: { backgroundColor: color.rosaNube },
  barra: { position: 'absolute', width: ANCHO_BARRA },
  etiquetas: { flexDirection: 'row' },
});
