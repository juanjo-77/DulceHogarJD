import { useSyncExternalStore } from 'react';

import { despertarServidor } from './despertar';
import { guardarPinEnEquipo, leerPinGuardado } from './pinGuardado';
import { SERVIDOR } from './servidor';

export const ENCABEZADO_PIN = 'X-Pin';

type Estado = { fase: 'revisando' | 'abierta' | 'pedirPin'; requierePin: boolean };
export type ResultadoPin = 'ok' | 'incorrecto' | 'bloqueado' | 'sinConexion';

let estado: Estado = { fase: 'revisando', requierePin: false };
let pin: string | null = null;
const oyentes = new Set<() => void>();

function cambiar(nuevo: Partial<Estado>) {
  estado = { ...estado, ...nuevo };
  oyentes.forEach((o) => o());
}

/** El PIN del negocio: se pide una vez, se guarda en el celular y viaja en cada pedido. */
export const acceso = {
  encabezados: (): Record<string, string> => (pin ? { [ENCABEZADO_PIN]: pin } : {}),

  /** Al abrir la app: lee el PIN guardado y pregunta al programa del negocio si hace falta. */
  async iniciar() {
    pin = await leerPinGuardado();
    // Sin respuesta (sin internet): se abre la app y cada pantalla avisa; si luego hace falta el PIN, se pide.
    const requierePin = (await despertarServidor())?.requierePin ?? false;
    cambiar({ requierePin, fase: requierePin && !pin ? 'pedirPin' : 'abierta' });
  },

  /** El servidor no aceptó el PIN (o lo cambiaron): se borra y se vuelve a pedir. */
  rechazado() {
    pin = null;
    guardarPinEnEquipo(null);
    cambiar({ requierePin: true, fase: 'pedirPin' });
  },

  async probar(candidato: string): Promise<ResultadoPin> {
    try {
      const r = await fetch(`${SERVIDOR}/api/ajustes`, { headers: { [ENCABEZADO_PIN]: candidato } });
      if (r.ok) return 'ok';
      return r.status === 429 ? 'bloqueado' : 'incorrecto';
    } catch {
      return 'sinConexion';
    }
  },

  async aceptar(nuevo: string) {
    pin = nuevo;
    await guardarPinEnEquipo(nuevo);
    cambiar({ fase: 'abierta' });
  },
};

export function useAcceso(): Estado {
  return useSyncExternalStore(
    (oyente) => {
      oyentes.add(oyente);
      return () => oyentes.delete(oyente);
    },
    () => estado,
  );
}
