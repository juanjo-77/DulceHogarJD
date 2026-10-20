import { StyleSheet, View } from 'react-native';

import { nombreMes } from '@/funciones/formato';
import { color, espacio, radio } from '@/tema/tokens';
import { Icono } from '@/ui/Icono';
import { Presionable } from '@/ui/Presionable';
import { Texto } from '@/ui/Texto';

type Periodo = { anio: number; mes: number };
type Props = { valor: Periodo; alCambiar: (p: Periodo) => void };

export function CambiarMes({ valor, alCambiar }: Props) {
  const hoy = new Date();
  const esActual = valor.anio === hoy.getFullYear() && valor.mes === hoy.getMonth() + 1;
  const mover = (n: number) => {
    const fecha = new Date(valor.anio, valor.mes - 1 + n, 1);
    alCambiar({ anio: fecha.getFullYear(), mes: fecha.getMonth() + 1 });
  };
  const nombre = nombreMes(valor.mes);

  return (
    <View style={s.barra}>
      <Presionable onPress={() => mover(-1)} style={s.flecha} accessibilityLabel="Mes anterior">
        <Icono nombre="chevron-left" tamano={30} />
      </Presionable>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Texto tipo="fuerte">{nombre[0].toUpperCase() + nombre.slice(1)} {valor.anio}</Texto>
        {esActual && <Texto tipo="pequeno" color={color.tintaSuave}>Este mes, hasta hoy</Texto>}
      </View>
      <Presionable onPress={() => mover(1)} disabled={esActual} style={s.flecha} accessibilityLabel="Mes siguiente">
        <Icono nombre="chevron-right" tamano={30} />
      </Presionable>
    </View>
  );
}

const s = StyleSheet.create({
  barra: { flexDirection: 'row', alignItems: 'center', gap: espacio.s, backgroundColor: color.lino, borderRadius: radio.boton, padding: 4 },
  flecha: { width: 56, height: 56, borderRadius: 14, backgroundColor: color.blanco, alignItems: 'center', justifyContent: 'center' },
});
