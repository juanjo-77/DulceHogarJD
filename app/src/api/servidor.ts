import Constants from 'expo-constants';
import { Platform } from 'react-native';

const PUERTO_API = 5080;
const PUERTOS_DE_DESARROLLO = ['8081', '19006'];

/**
 * Dirección del programa del negocio (backend):
 * 1. EXPO_PUBLIC_API_URL si se configuró (por ejemplo, cuando esté en internet).
 * 2. En el navegador: el mismo servidor que sirve la página (monolito) o el PC en el puerto 5080.
 * 3. En el celular durante desarrollo: el mismo computador que corre Expo.
 */
function resolverServidor(): string {
  const configurado = process.env.EXPO_PUBLIC_API_URL;
  if (configurado) return configurado.replace(/\/$/, '');

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const { protocol, hostname, port, origin } = window.location;
    return PUERTOS_DE_DESARROLLO.includes(port) ? `${protocol}//${hostname}:${PUERTO_API}` : origin;
  }

  const host = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
  return `http://${host}:${PUERTO_API}`;
}

export const SERVIDOR = resolverServidor();

/** Las fotos llegan como "/fotos/archivo.jpg": se completan con la dirección del servidor. */
export function urlFoto(ruta: string | null | undefined): string | null {
  return ruta ? `${SERVIDOR}${ruta}` : null;
}
