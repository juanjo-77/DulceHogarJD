import { StyleSheet, View } from 'react-native';

import type { Mes, NivelVeredicto } from '@/api/tipos/resumen';
import { pesos } from '@/funciones/formato';
import { color, espacio, radio } from '@/tema/tokens';
import { Icono, type NombreIcono } from '@/ui/Icono';
import { Texto } from '@/ui/Texto';

const ESTILO: Record<NivelVeredicto, { icono: NombreIcono; fondo: string; tono: string }> = {
  excelente: { icono: 'trending-up', fondo: color.mentaFondo, tono: color.menta },
  bien: { icono: 'emoticon-happy-outline', fondo: color.mentaFondo, tono: color.menta },
  regular: { icono: 'trending-neutral', fondo: color.mielFondo, tono: color.miel },
  mal: { icono: 'alert-outline', fondo: color.coralFondo, tono: color.coral },
  sinDatos: { icono: 'calendar-blank-outline', fondo: color.lino, tono: color.tintaSuave },
};

/** La respuesta directa a "¿me está yendo bien?", con la ganancia aproximada bien grande. */
export function VeredictoMes({ mes }: { mes: Mes }) {
  const e = ESTILO[mes.veredicto.nivel];
  return (
    <View style={[s.tarjeta, { backgroundColor: e.fondo }]}>
      <View style={s.fila}>
        <View style={[s.icono, { backgroundColor: color.blanco }]}>
          <Icono nombre={e.icono} tamano={30} color={e.tono} />
        </View>
        <Texto tipo="subtitulo" color={e.tono} style={{ flex: 1 }}>{mes.veredicto.titulo}</Texto>
      </View>
      {mes.veredicto.nivel !== 'sinDatos' && (
        <View>
          <Texto color={color.tintaSuave}>{mes.esMesActual ? 'Vas ganando más o menos' : 'Ganaste más o menos'}</Texto>
          <Texto tipo="cifra" style={{ fontSize: 40, lineHeight: 46 }}>{pesos(mes.ganancia)}</Texto>
        </View>
      )}
      <Texto>{mes.veredicto.mensaje}</Texto>
    </View>
  );
}

const s = StyleSheet.create({
  tarjeta: { borderRadius: radio.tarjeta, padding: espacio.xl, gap: espacio.m },
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
  icono: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
});
