import * as SecureStore from 'expo-secure-store';

const CLAVE = 'dulcehogar.pin';

/** En el celular el PIN se guarda cifrado por el sistema (Keychain / Keystore). */
export async function leerPinGuardado(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(CLAVE);
  } catch {
    return null;
  }
}

export async function guardarPinEnEquipo(pin: string | null): Promise<void> {
  try {
    if (pin) await SecureStore.setItemAsync(CLAVE, pin);
    else await SecureStore.deleteItemAsync(CLAVE);
  } catch {
    // Si el celular no deja guardarlo, se volverá a pedir al abrir la app.
  }
}
