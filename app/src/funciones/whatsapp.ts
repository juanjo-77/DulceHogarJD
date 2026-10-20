import { Linking } from 'react-native';

/** Colombia: si el número no trae indicativo, se le pone el 57. */
export function numeroInternacional(telefono: string): string {
  const digitos = telefono.replace(/\D/g, '');
  return digitos.length === 10 ? `57${digitos}` : digitos;
}

/** Abre WhatsApp con el mensaje ya escrito. Sin teléfono, deja elegir el contacto. */
export function abrirWhatsApp(mensaje: string, telefono?: string | null) {
  const texto = encodeURIComponent(mensaje);
  const url = telefono ? `https://wa.me/${numeroInternacional(telefono)}?text=${texto}` : `https://wa.me/?text=${texto}`;
  return Linking.openURL(url);
}

export function llamar(telefono: string) {
  return Linking.openURL(`tel:${telefono.replace(/\D/g, '')}`);
}
