import { useState } from 'react';
import { View } from 'react-native';

import type { Cliente, ClienteInput } from '@/api/tipos/clientes';
import { espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { Campo } from '@/ui/Campo';

type Props = {
  inicial?: Pick<Cliente, 'nombre' | 'telefono' | 'cedula' | 'direccion' | 'notas'>;
  guardando: boolean;
  alGuardar: (datos: ClienteInput) => void;
  /** Versión corta (nombre y teléfono) para crear clientes mientras se vende. */
  corto?: boolean;
};

export function FormularioCliente({ inicial, guardando, alGuardar, corto }: Props) {
  const [nombre, setNombre] = useState(inicial?.nombre ?? '');
  const [telefono, setTelefono] = useState(inicial?.telefono ?? '');
  const [cedula, setCedula] = useState(inicial?.cedula ?? '');
  const [direccion, setDireccion] = useState(inicial?.direccion ?? '');
  const [notas, setNotas] = useState(inicial?.notas ?? '');

  return (
    <View style={{ gap: espacio.xl }}>
      <Campo etiqueta="Nombre" placeholder="Ej: María Gómez" value={nombre} onChangeText={setNombre} autoCapitalize="words" />
      <Campo
        etiqueta="Celular"
        ayuda="Para enviarle recordatorios por WhatsApp."
        placeholder="300 123 4567"
        keyboardType="phone-pad"
        inputMode="tel"
        value={telefono}
        onChangeText={setTelefono}
      />
      {!corto && (
        <>
          <Campo etiqueta="Cédula" opcional keyboardType="number-pad" value={cedula} onChangeText={setCedula} />
          <Campo etiqueta="Dirección" opcional placeholder="Barrio, calle, casa…" value={direccion} onChangeText={setDireccion} />
          <Campo etiqueta="Notas" opcional placeholder="Ej: le gustan los colores claros" value={notas} onChangeText={setNotas} multiline />
        </>
      )}
      <Boton
        titulo="Guardar cliente"
        icono="check"
        grande
        cargando={guardando}
        onPress={() =>
          alGuardar({ nombre, telefono: telefono || null, cedula: cedula || null, direccion: direccion || null, notas: notas || null })
        }
      />
    </View>
  );
}
