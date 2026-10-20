import { View } from 'react-native';

import type { MetodoPago } from '@/api/tipos/ventas';
import { espacio } from '@/tema/tokens';
import { Segmento } from '@/ui/Segmento';
import { Texto } from '@/ui/Texto';

type Props = { valor: MetodoPago; alCambiar: (m: MetodoPago) => void };

export function ElegirMetodo({ valor, alCambiar }: Props) {
  return (
    <View style={{ gap: espacio.s }}>
      <Texto tipo="fuerte">¿Cómo te pagó?</Texto>
      <Segmento
        valor={valor}
        alCambiar={alCambiar}
        opciones={[
          { valor: 'Efectivo', titulo: 'Efectivo' },
          { valor: 'Transferencia', titulo: 'Nequi / transferencia' },
        ]}
      />
    </View>
  );
}
