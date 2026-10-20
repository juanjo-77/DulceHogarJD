const CLAVE = 'dulcehogar.pin';

/** En el navegador se guarda en este equipo; si el navegador no lo permite, se vuelve a pedir. */
export async function leerPinGuardado(): Promise<string | null> {
  try {
    return window.localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

export async function guardarPinEnEquipo(pin: string | null): Promise<void> {
  try {
    if (pin) window.localStorage.setItem(CLAVE, pin);
    else window.localStorage.removeItem(CLAVE);
  } catch {
    // Navegador en modo privado o sin permiso: no pasa nada.
  }
}
