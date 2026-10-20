import { SERVIDOR } from './servidor';

const ESPERA_MAXIMA = 75_000;
const ESPERA_POR_INTENTO = 25_000;

/**
 * En el plan gratis de Render el programa del negocio "se duerme" si nadie lo usa,
 * y la primera llamada del día puede tardar hasta un minuto. Por eso se insiste un rato
 * antes de rendirse. En la casa (http://…) basta con un intento.
 */
export async function despertarServidor(): Promise<{ requierePin: boolean } | null> {
  const enInternet = SERVIDOR.startsWith('https');
  const limite = Date.now() + (enInternet ? ESPERA_MAXIMA : 0);

  do {
    try {
      const r = await pedirConEspera(`${SERVIDOR}/api/salud`, ESPERA_POR_INTENTO);
      if (r.ok) return { requierePin: Boolean((await r.json())?.requierePin) };
    } catch {
      // Todavía se está despertando o no hay señal: se vuelve a intentar.
    }
    if (enInternet) await new Promise((listo) => setTimeout(listo, 3000));
  } while (Date.now() < limite);

  return null;
}

function pedirConEspera(url: string, ms: number): Promise<Response> {
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), ms);
  return fetch(url, { signal: control.signal }).finally(() => clearTimeout(reloj));
}
