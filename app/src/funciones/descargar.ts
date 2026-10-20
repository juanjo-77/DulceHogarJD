import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { acceso } from '@/api/acceso';

/** Descarga un archivo del programa del negocio y abre "Compartir" para guardarlo (Drive, WhatsApp, correo…). */
export async function descargarYCompartir(url: string, _nombre: string) {
  const carpeta = new Directory(Paths.cache, `exportes-${Date.now()}`);
  carpeta.create();
  const archivo = await File.downloadFileAsync(url, carpeta, { headers: acceso.encabezados() });
  await Sharing.shareAsync(archivo.uri, { dialogTitle: 'Guardar o enviar' });
}
