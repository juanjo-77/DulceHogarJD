import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { MovimientoInput } from '@/api/consultas/negocio';
import type { MovimientoManual, TipoMovimiento } from '@/api/tipos/resumen';
import { aFechaApi } from '@/funciones/formato';
import { espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { Campo } from '@/ui/Campo';
import { CampoDinero } from '@/ui/CampoDinero';
import { Chip } from '@/ui/Chip';
import { Segmento } from '@/ui/Segmento';
import { SelectorFecha } from '@/ui/SelectorFecha';

const CONCEPTOS: Record<TipoMovimiento, string[]> = {
  Gasto: ['Arriendo del local', 'Servicios (luz y agua)', 'Transporte', 'Bolsas y empaques', 'Comida', 'Arreglos'],
  Ingreso: ['Préstamo', 'Plata de la casa', 'Otro'],
};

type Props = { inicial?: MovimientoManual; guardando: boolean; alGuardar: (d: MovimientoInput) => void };

export function FormularioGasto({ inicial, guardando, alGuardar }: Props) {
  const [tipo, setTipo] = useState<TipoMovimiento>(inicial?.tipo ?? 'Gasto');
  const [concepto, setConcepto] = useState(inicial?.concepto ?? '');
  const [monto, setMonto] = useState(inicial?.monto ?? 0);
  const [fecha, setFecha] = useState(inicial ? inicial.fecha.slice(0, 10) : aFechaApi(new Date()));
  const [nota, setNota] = useState(inicial?.nota ?? '');

  return (
    <View style={{ gap: espacio.xl }}>
      <Segmento
        valor={tipo}
        alCambiar={setTipo}
        opciones={[
          { valor: 'Gasto', titulo: 'Salió plata (gasto)' },
          { valor: 'Ingreso', titulo: 'Entró plata' },
        ]}
      />
      <View style={{ gap: espacio.s }}>
        <Campo etiqueta={tipo === 'Gasto' ? '¿En qué se gastó?' : '¿De dónde entró?'} value={concepto} onChangeText={setConcepto} />
        <View style={s.chips}>
          {CONCEPTOS[tipo].map((c) => (
            <Chip key={c} titulo={c} activo={concepto === c} onPress={() => setConcepto(c)} />
          ))}
        </View>
      </View>
      <CampoDinero etiqueta="¿Cuánto fue?" valor={monto} alCambiar={setMonto} />
      <SelectorFecha etiqueta="¿Cuándo?" valor={fecha} alCambiar={setFecha} opciones={[{ titulo: 'Hoy', dias: 0 }, { titulo: 'Ayer', dias: -1 }]} />
      <Campo etiqueta="Nota" opcional value={nota} onChangeText={setNota} />
      <Boton
        titulo="Guardar"
        icono="check"
        grande
        cargando={guardando}
        onPress={() => alGuardar({ tipo, concepto, monto, fecha, nota: nota || null })}
      />
    </View>
  );
}

const s = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.s },
});
