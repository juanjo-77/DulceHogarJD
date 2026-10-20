/**
 * Formatos en español de Colombia. Se hacen a mano (sin Intl) para que se vean
 * igual en cualquier celular, por viejo que sea.
 */

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/** 1320000 → "$ 1.320.000" */
export function pesos(valor: number): string {
  const signo = valor < 0 ? '-' : '';
  const miles = Math.round(Math.abs(valor)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  // Espacio que no se parte: el "$" nunca queda solo al final de un renglón.
  return `${signo}$ ${miles}`;
}

/** Lee "2026-10-19" o "2026-10-19T14:30:00" como fecha local, sin corrimientos de zona horaria. */
export function leerFecha(texto: string): Date {
  const [fecha, hora = '00:00:00'] = texto.split('T');
  const [a, m, d] = fecha.split('-').map(Number);
  const [h, mi] = hora.split(':').map(Number);
  return new Date(a, m - 1, d, h || 0, mi || 0);
}

/** Date → "2026-10-19" */
export function aFechaApi(fecha: Date): string {
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}

export function sumarDias(fecha: Date, dias: number): Date {
  const r = new Date(fecha);
  r.setDate(r.getDate() + dias);
  return r;
}

function diasEntre(desde: Date, hasta: Date): number {
  const a = new Date(desde.getFullYear(), desde.getMonth(), desde.getDate()).getTime();
  const b = new Date(hasta.getFullYear(), hasta.getMonth(), hasta.getDate()).getTime();
  return Math.round((b - a) / 86_400_000);
}

/** "19 de octubre" */
export function fechaLarga(texto: string | Date): string {
  const f = typeof texto === 'string' ? leerFecha(texto) : texto;
  return `${f.getDate()} de ${MESES[f.getMonth()]}`;
}

/** "lunes 19 de octubre" */
export function fechaConDia(texto: string | Date): string {
  const f = typeof texto === 'string' ? leerFecha(texto) : texto;
  return `${DIAS[f.getDay()]} ${fechaLarga(f)}`;
}

/** "19 oct" */
export function fechaCorta(texto: string | Date): string {
  const f = typeof texto === 'string' ? leerFecha(texto) : texto;
  return `${f.getDate()} ${MESES[f.getMonth()].slice(0, 3)}`;
}

/** "3:45 p. m." */
export function hora(texto: string): string {
  const f = leerFecha(texto);
  const h = f.getHours() % 12 || 12;
  return `${h}:${String(f.getMinutes()).padStart(2, '0')} ${f.getHours() < 12 ? 'a. m.' : 'p. m.'}`;
}

/** "hoy", "ayer", "hace 5 días", "19 oct" */
export function cuandoFue(texto: string): string {
  const dias = diasEntre(leerFecha(texto), new Date());
  if (dias <= 0) return 'hoy';
  if (dias === 1) return 'ayer';
  if (dias < 7) return `hace ${dias} días`;
  return fechaCorta(texto);
}

/** Para fechas límite: "hoy", "mañana", "en 5 días", "hace 3 días". */
export function cuandoToca(dias: number): string {
  if (dias === 0) return 'hoy';
  if (dias === 1) return 'mañana';
  if (dias === -1) return 'ayer';
  return dias > 0 ? `en ${dias} días` : `hace ${-dias} días`;
}

export function nombreMes(mes: number): string {
  return MESES[mes - 1];
}

export function saludo(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function iniciales(nombre: string): string {
  return nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
}

export function plural(n: number, uno: string, varios: string): string {
  return `${n} ${n === 1 ? uno : varios}`;
}
