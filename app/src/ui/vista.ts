import type { ComponentRef } from 'react';
import type { View } from 'react-native';

/** Lo que guarda un `ref` puesto en un <View> (en RN 0.88 es un elemento nativo, no un componente). */
export type Vista = ComponentRef<typeof View>;
