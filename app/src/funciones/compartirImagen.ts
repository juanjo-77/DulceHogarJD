import * as Sharing from 'expo-sharing';
import type { RefObject } from 'react';
import type { Vista } from '@/ui/vista';
import { captureRef } from 'react-native-view-shot';

/** Convierte una tarjeta de la pantalla en imagen y abre "Compartir" (WhatsApp, etc.). */
export async function compartirImagen(vista: RefObject<Vista | null>, nombre: string) {
  const uri = await captureRef(vista, { format: 'png', quality: 1, result: 'tmpfile', fileName: nombre });
  await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Enviar imagen', UTI: 'public.png' });
}
