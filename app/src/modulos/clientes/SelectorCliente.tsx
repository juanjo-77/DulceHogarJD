import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { clientesApi, useClientes } from '@/api/consultas/clientes';
import type { ClienteMini } from '@/api/tipos/ventas';
import { useAccion } from '@/api/useAccion';
import { useRetraso } from '@/funciones/useRetraso';
import { color, espacio, radio } from '@/tema/tokens';
import { Avatar } from '@/ui/Avatar';
import { Boton } from '@/ui/Boton';
import { Buscador } from '@/ui/Buscador';
import { Fila } from '@/ui/Fila';
import { Hoja } from '@/ui/Hoja';
import { Icono } from '@/ui/Icono';
import { Presionable } from '@/ui/Presionable';
import { Texto } from '@/ui/Texto';

import { FormularioCliente } from './FormularioCliente';

type Props = { valor: ClienteMini | null; alCambiar: (c: ClienteMini | null) => void; etiqueta?: string };

/** Elegir un cliente (o crearlo ahí mismo) sin salir de la venta. */
export function SelectorCliente({ valor, alCambiar, etiqueta = '¿A quién le vendes?' }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [nuevo, setNuevo] = useState(false);
  const [buscar, setBuscar] = useState('');
  const clientes = useClientes(useRetraso(buscar));
  const crear = useAccion(clientesApi.crear, { exito: 'Cliente guardado', alTerminar: (c) => elegir(c) });

  const elegir = (c: ClienteMini) => {
    alCambiar({ id: c.id, nombre: c.nombre, telefono: c.telefono });
    setAbierto(false);
    setNuevo(false);
  };

  return (
    <View style={{ gap: espacio.s }}>
      <Texto tipo="fuerte">{etiqueta}</Texto>
      <Presionable onPress={() => setAbierto(true)} style={s.campo} accessibilityLabel={etiqueta}>
        {valor ? <Avatar nombre={valor.nombre} tamano={40} /> : <Icono nombre="account-search" tamano={28} color={color.tintaSuave} />}
        <Texto style={{ flex: 1 }} color={valor ? color.tinta : color.tintaTenue}>{valor?.nombre ?? 'Elegir cliente'}</Texto>
        <Icono nombre="chevron-down" color={color.tintaSuave} />
      </Presionable>

      <Hoja visible={abierto} titulo={nuevo ? 'Nuevo cliente' : 'Elegir cliente'} alCerrar={() => setAbierto(false)}>
        {nuevo ? (
          <FormularioCliente corto guardando={crear.isPending} alGuardar={(d) => crear.mutate(d)} />
        ) : (
          <>
            <Boton titulo="Cliente nuevo" icono="account-plus" variante="suave" onPress={() => setNuevo(true)} />
            <Buscador valor={buscar} alCambiar={setBuscar} placeholder="Buscar cliente" />
            {clientes.data?.slice(0, 30).map((c, i, lista) => (
              <Fila
                key={c.id}
                titulo={c.nombre}
                subtitulo={c.telefono ?? undefined}
                izquierda={<Avatar nombre={c.nombre} tamano={40} />}
                ultima={i === lista.length - 1}
                onPress={() => elegir(c)}
              />
            ))}
          </>
        )}
      </Hoja>
    </View>
  );
}

const s = StyleSheet.create({
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.m,
    minHeight: 60,
    paddingHorizontal: espacio.l,
    borderRadius: radio.campo,
    borderWidth: 1.5,
    borderColor: color.hilo,
    backgroundColor: color.blanco,
  },
});
