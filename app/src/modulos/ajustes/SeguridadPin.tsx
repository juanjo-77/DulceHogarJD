import { acceso, useAcceso } from '@/api/acceso';
import { Boton } from '@/ui/Boton';
import { useConfirmar } from '@/ui/Dialogo';
import { Seccion } from '@/ui/Seccion';

/** Solo aparece si el negocio tiene PIN. Sirve cuando cambiaron el PIN o se lo prestaron a alguien. */
export function SeguridadPin() {
  const { requierePin } = useAcceso();
  const confirmar = useConfirmar();
  if (!requierePin) return null;

  return (
    <Seccion titulo="Seguridad" ayuda="La app pide el PIN del negocio. Este celular lo tiene guardado.">
      <Boton
        titulo="Cambiar el PIN de este celular"
        icono="lock-reset"
        variante="borde"
        onPress={async () => {
          const si = await confirmar({
            titulo: '¿Volver a escribir el PIN?',
            mensaje: 'Se borra el PIN guardado en este celular y te lo pedimos de nuevo.',
            confirmar: 'Sí, escribirlo otra vez',
          });
          if (si) acceso.rechazado();
        }}
      />
    </Seccion>
  );
}
