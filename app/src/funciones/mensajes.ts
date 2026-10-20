import type { Cuenta, Recibo } from '@/api/tipos/ventas';

import { fechaLarga, pesos } from './formato';

const TIPO = { Contado: 'compra', Fiado: 'fiado', Separe: 'plan separe' } as const;

function primerNombre(nombre: string) {
  return nombre.split(' ')[0];
}

/** Mensaje de WhatsApp con el estado de cuenta de un cliente. */
export function mensajeEstadoCuenta(nombre: string, cuentas: Cuenta[], negocio = 'Dulce Hogar JD'): string {
  const total = cuentas.reduce((s, c) => s + Math.max(c.saldo, 0), 0);
  const lineas = cuentas.map((c) => {
    const fecha = c.fechaLimite ? `, para el ${fechaLarga(c.fechaLimite)}` : '';
    return `• ${c.descripcion} (${TIPO[c.tipo]}): has abonado ${pesos(c.pagado)} de ${pesos(c.total)}. Falta ${pesos(c.saldo)}${fecha}.`;
  });
  return [
    `Hola ${primerNombre(nombre)} 🌸, te saluda ${negocio}.`,
    'Este es el resumen de tu cuenta:',
    ...lineas,
    `Total pendiente: *${pesos(total)}*`,
    '¡Muchas gracias!',
  ].join('\n');
}

/** Mensaje de WhatsApp con un recibo de abono. */
export function mensajeRecibo(r: Recibo): string {
  const nombre = r.cliente ? primerNombre(r.cliente.nombre) : '';
  const saldo = r.saldoDespues > 0 ? `Te falta ${pesos(r.saldoDespues)}.` : '¡Ya quedó todo pago! 🎉';
  return [
    `Hola ${nombre} 🌸, te saluda ${r.negocio.nombre}.`,
    `Recibimos tu abono de *${pesos(r.monto)}* el ${fechaLarga(r.fecha)}.`,
    `Por: ${r.descripcion} (${TIPO[r.tipo]}).`,
    `Llevas ${pesos(r.pagadoHastaAhora)} de ${pesos(r.total)}. ${saldo}`,
    r.negocio.mensaje ?? '',
  ]
    .filter(Boolean)
    .join('\n');
}
