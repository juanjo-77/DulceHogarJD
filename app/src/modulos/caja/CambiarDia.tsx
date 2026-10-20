import { StyleSheet, View } from 'react-native';

import { aFechaApi, fechaConDia, leerFecha, sumarDias } from '@/funciones/formato';
import { color, espacio, radio } from '@/tema/tokens';
import { Icono } from '@/ui/Icono';
import { Presionable } from '@/ui/Presionable';
import { Texto } from '@/ui/Texto';

type Props = { valor: string; alCambiar: (dia: string) => void };

/** ◀ lunes 19 de octubre ▶ — para mirar la caja de otros días. */
export function CambiarDia({ valor, alCambiar }: Props) {
  const hoy = aFechaApi(new Date());
  const mover = (n: number) => alCambiar(aFechaApi(sumarDias(leerFecha(valor), n)));

  return (
    <View style={s.barra}>
      <Presionable onPress={() => mover(-1)} style={s.flecha} accessibilityLabel="Día anterior">
        <Icono nombre="chevron-left" tamano={30} />
      </Presionable>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Texto tipo="fuerte" centrado>{valor === hoy ? 'Hoy' : fechaConDia(valor)}</Texto>
        {valor === hoy && <Texto tipo="pequeno" color={color.tintaSuave}>{fechaConDia(valor)}</Texto>}
      </View>
      <Presionable onPress={() => mover(1)} disabled={valor >= hoy} style={s.flecha} accessibilityLabel="Día siguiente">
        <Icono nombre="chevron-right" tamano={30} />
      </Presionable>
    </View>
  );
}

const s = StyleSheet.create({
  barra: { flexDirection: 'row', alignItems: 'center', gap: espacio.s, backgroundColor: color.lino, borderRadius: radio.boton, padding: 4 },
  flecha: { width: 56, height: 56, borderRadius: 14, backgroundColor: color.blanco, alignItems: 'center', justifyContent: 'center' },
});
