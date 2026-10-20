import { acceso } from './acceso';
import { SERVIDOR } from './servidor';

export class ErrorApi extends Error {
  constructor(mensaje: string, readonly status: number) {
    super(mensaje);
  }
}

const SIN_CONEXION =
  'No hay conexión con el programa del negocio. Revisa que el computador esté encendido y en el mismo WiFi.';

type Metodo = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** Llama a la API. Los errores llegan con un mensaje listo para mostrarle a la usuaria. */
export async function pedir<T>(ruta: string, metodo: Metodo = 'GET', cuerpo?: unknown): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${SERVIDOR}/api${ruta}`, {
      method: metodo,
      headers: {
        ...(cuerpo instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...acceso.encabezados(),
      },
      body: cuerpo instanceof FormData ? cuerpo : cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    });
  } catch {
    throw new ErrorApi(SIN_CONEXION, 0);
  }

  // PIN que falta o que cambiaron en el negocio: la app lo vuelve a pedir.
  if (respuesta.status === 401) acceso.rechazado();
  if (respuesta.status === 204) return undefined as T;
  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    throw new ErrorApi(datos?.detail ?? datos?.title ?? 'Algo salió mal. Intenta de nuevo.', respuesta.status);
  }
  return datos as T;
}

export function mensajeDeError(error: unknown): string {
  return error instanceof Error ? error.message : 'Algo salió mal. Intenta de nuevo.';
}

/** Arma "?a=1&b=2" ignorando lo vacío. */
export function consulta(parametros: Record<string, string | number | boolean | null | undefined>): string {
  const partes = Object.entries(parametros)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`);
  return partes.length ? `?${partes.join('&')}` : '';
}
