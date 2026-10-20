import { useEffect, useState } from 'react';

import { negocioApi, useAjustes } from '@/api/consultas/negocio';
import { useAccion } from '@/api/useAccion';
import { Boton } from '@/ui/Boton';
import { Campo } from '@/ui/Campo';
import { Seccion } from '@/ui/Seccion';

/** Lo que sale en los recibos y en los mensajes de WhatsApp. */
export function DatosNegocio() {
  const ajustes = useAjustes();
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');
  const guardar = useAccion(negocioApi.guardarAjustes, { exito: 'Datos guardados' });

  useEffect(() => {
    if (!ajustes.data) return;
    setNombre(ajustes.data.nombreNegocio);
    setTelefono(ajustes.data.telefono ?? '');
    setMensaje(ajustes.data.mensajeRecibo ?? '');
  }, [ajustes.data]);

  return (
    <Seccion titulo="Tu negocio" ayuda="Así aparece en los recibos que envías.">
      <Campo etiqueta="Nombre del negocio" value={nombre} onChangeText={setNombre} />
      <Campo etiqueta="WhatsApp del negocio" keyboardType="phone-pad" inputMode="tel" value={telefono} onChangeText={setTelefono} />
      <Campo etiqueta="Mensaje al final del recibo" placeholder="¡Gracias por su compra!" value={mensaje} onChangeText={setMensaje} />
      <Boton
        titulo="Guardar datos"
        icono="check"
        cargando={guardar.isPending}
        onPress={() => guardar.mutate({ nombreNegocio: nombre, telefono: telefono || null, mensajeRecibo: mensaje || null })}
      />
    </Seccion>
  );
}
