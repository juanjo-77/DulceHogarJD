import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

import { color } from '@/tema/tokens';

export type NombreIcono = ComponentProps<typeof MaterialCommunityIcons>['name'];

type Props = { nombre: NombreIcono; tamano?: number; color?: string };

export function Icono({ nombre, tamano = 24, color: tono = color.tinta }: Props) {
  return <MaterialCommunityIcons name={nombre} size={tamano} color={tono} />;
}
