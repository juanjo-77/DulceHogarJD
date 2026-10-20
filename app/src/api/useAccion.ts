import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { useAviso } from '@/ui/Aviso';

import { mensajeDeError } from './pedir';

type Opciones<R> = {
  /** Mensaje corto al terminar bien: "Venta registrada". */
  exito?: string | ((resultado: R) => string);
  alTerminar?: (resultado: R) => void;
};

const vibrar = (tipo: Haptics.NotificationFeedbackType) => {
  if (Platform.OS !== 'web') Haptics.notificationAsync(tipo);
};

/**
 * Para todo lo que cambia datos (guardar, borrar, abonar...).
 * Al terminar refresca toda la app, así el inicio, la caja y las listas quedan al día solas.
 */
export function useAccion<V, R>(accion: (variables: V) => Promise<R>, opciones: Opciones<R> = {}) {
  const cliente = useQueryClient();
  const aviso = useAviso();

  return useMutation({
    mutationFn: accion,
    onSuccess: async (resultado) => {
      await cliente.invalidateQueries();
      vibrar(Haptics.NotificationFeedbackType.Success);
      const { exito } = opciones;
      if (exito) aviso.exito(typeof exito === 'function' ? exito(resultado) : exito);
      opciones.alTerminar?.(resultado);
    },
    onError: (error) => {
      vibrar(Haptics.NotificationFeedbackType.Error);
      aviso.error(mensajeDeError(error));
    },
  });
}
