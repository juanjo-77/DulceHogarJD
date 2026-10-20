import { useState, type RefObject } from 'react';
import { View } from 'react-native';

import { mensajeDeError } from '@/api/pedir';
import { compartirImagen } from '@/funciones/compartirImagen';
import { abrirWhatsApp } from '@/funciones/whatsapp';
import { espacio } from '@/tema/tokens';
import type { Vista } from '@/ui/vista';
import { useAviso } from '@/ui/Aviso';
import { Boton } from '@/ui/Boton';

type Props = { tarjeta: RefObject<Vista | null>; nombreArchivo: string; mensaje: string; telefono: string | null };

/** Enviar como imagen (se ve bonito) o como mensaje de texto directo al chat del cliente. */
export function BotonesCompartir({ tarjeta, nombreArchivo, mensaje, telefono }: Props) {
  const [enviando, setEnviando] = useState(false);
  const aviso = useAviso();

  const enviarImagen = async () => {
    setEnviando(true);
    try {
      await compartirImagen(tarjeta, nombreArchivo);
    } catch (e) {
      aviso.error(`No se pudo crear la imagen. ${mensajeDeError(e)}`);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={{ gap: espacio.m }}>
      <Boton titulo="Enviar imagen" icono="image-move" variante="whatsapp" grande cargando={enviando} onPress={enviarImagen} />
      <Boton
        titulo={telefono ? 'Enviar mensaje por WhatsApp' : 'Enviar mensaje (elegir contacto)'}
        icono="whatsapp"
        variante="borde"
        onPress={() => abrirWhatsApp(mensaje, telefono)}
      />
    </View>
  );
}
