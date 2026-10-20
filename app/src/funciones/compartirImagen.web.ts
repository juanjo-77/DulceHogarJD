import type { RefObject } from 'react';
import type { Vista } from '@/ui/vista';
import { captureRef } from 'react-native-view-shot';

/**
 * En el navegador: si el celular permite compartir archivos, abre "Compartir";
 * si no (computador), descarga la imagen.
 */
export async function compartirImagen(vista: RefObject<Vista | null>, nombre: string) {
  const datos = await captureRef(vista, { format: 'png', result: 'data-uri' });
  const archivo = new File([await (await fetch(datos)).blob()], `${nombre}.png`, { type: 'image/png' });

  if (navigator.canShare?.({ files: [archivo] })) {
    await navigator.share({ files: [archivo] });
    return;
  }
  const enlace = document.createElement('a');
  enlace.href = datos;
  enlace.download = `${nombre}.png`;
  enlace.click();
}
