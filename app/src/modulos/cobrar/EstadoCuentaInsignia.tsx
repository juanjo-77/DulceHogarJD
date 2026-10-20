import type { EstadoCuenta } from '@/api/tipos/ventas';
import { cuandoToca } from '@/funciones/formato';
import { Insignia } from '@/ui/Insignia';

type Props = { estado: EstadoCuenta; dias: number | null };

/** "Vencida hace 3 días", "Paga en 5 días", "Lista para entregar"... */
export function EstadoCuentaInsignia({ estado, dias }: Props) {
  switch (estado) {
    case 'Vencida':
      return <Insignia texto={`Venció ${dias !== null ? cuandoToca(dias) : ''}`.trim()} tono="coral" />;
    case 'ParaEntregar':
      return <Insignia texto="Pagó todo: entregar" tono="menta" />;
    case 'AlDia':
      return <Insignia texto="Al día" tono="menta" />;
    case 'Anulada':
      return <Insignia texto="Anulada" tono="neutro" />;
    default:
      if (dias === null) return <Insignia texto="Debe" tono="rosa" />;
      return <Insignia texto={`Paga ${cuandoToca(dias)}`} tono={dias <= 3 ? 'miel' : 'neutro'} />;
  }
}
