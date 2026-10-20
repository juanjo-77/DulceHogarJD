import { acceso } from '@/api/acceso';

/**
 * En el navegador se pide el archivo con el PIN (un enlace normal no puede llevarlo)
 * y luego se descarga con el nombre que manda el servidor.
 */
export async function descargarYCompartir(url: string, nombre: string) {
  const respuesta = await fetch(url, { headers: acceso.encabezados() });
  if (respuesta.status === 401) acceso.rechazado();
  if (!respuesta.ok) throw new Error('El programa del negocio no entregó el archivo.');

  const disposicion = respuesta.headers.get('Content-Disposition') ?? '';
  const delServidor = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposicion)?.[1];
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(await respuesta.blob());
  enlace.download = delServidor ? decodeURIComponent(delServidor) : nombre;
  enlace.click();
  setTimeout(() => URL.revokeObjectURL(enlace.href), 10_000);
}
