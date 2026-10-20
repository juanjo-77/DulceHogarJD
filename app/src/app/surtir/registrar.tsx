import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { surtidoApi, useListaSurtir } from '@/api/consultas/surtido';
import { useAccion } from '@/api/useAccion';
import { pesos } from '@/funciones/formato';
import { ElegirProducto } from '@/modulos/productos/ElegirProducto';
import { ElegirProveedor } from '@/modulos/surtir/ElegirProveedor';
import { EditorRenglon } from '@/modulos/surtir/EditorRenglon';
import { aEntrada, desdeLista, nuevaClave, type RenglonSurtido } from '@/modulos/surtir/tipos';
import { espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { Pantalla } from '@/ui/Pantalla';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';

export default function RegistrarSurtido() {
  const { desdeLista: usarLista } = useLocalSearchParams<{ desdeLista?: string }>();
  const lista = useListaSurtir();
  const [proveedor, setProveedor] = useState('');
  const [renglones, setRenglones] = useState<RenglonSurtido[]>([]);
  const [eligiendo, setEligiendo] = useState(false);

  // Si viene de la lista, arranca (una sola vez) con lo que se marcó como conseguido.
  const prellenado = useRef(false);
  useEffect(() => {
    if (!usarLista || !lista.data || prellenado.current) return;
    prellenado.current = true;
    setRenglones(desdeLista(lista.data));
  }, [usarLista, lista.data]);

  const guardar = useAccion(surtidoApi.registrar, {
    exito: 'Mercancía guardada en el inventario',
    alTerminar: (s) => router.replace(`/surtir/${s.id}`),
  });

  const total = renglones.reduce((s, r) => s + r.cantidad * r.costo, 0);
  const cambiar = (r: RenglonSurtido | null, clave: string) =>
    setRenglones((todos) => (r ? todos.map((x) => (x.clave === clave ? r : x)) : todos.filter((x) => x.clave !== clave)));
  const agregarNuevo = () =>
    setRenglones((t) => [...t, { clave: nuevaClave(), productoId: null, nombre: '', icono: null, cantidad: 1, costo: 0, porTraerId: null, nuevo: { categoriaId: 0, precioVenta: 0 } }]);

  return (
    <Pantalla volver titulo="Llegó mercancía" subtitulo="Se suma sola al inventario">
      <ElegirProveedor valor={proveedor} alCambiar={setProveedor} />
      {renglones.map((r) => (
        <EditorRenglon key={r.clave} renglon={r} alCambiar={(nuevo) => cambiar(nuevo, r.clave)} />
      ))}
      <View style={{ gap: espacio.m }}>
        <Boton titulo="Agregar del inventario" icono="package-variant" variante="borde" onPress={() => setEligiendo(true)} />
        <Boton titulo="Es un producto nuevo" icono="new-box" variante="borde" onPress={agregarNuevo} />
      </View>
      <Tarjeta tono="lino" style={{ gap: 2 }}>
        <Texto>Pagaste en total</Texto>
        <Texto tipo="cifra">{pesos(total)}</Texto>
      </Tarjeta>
      <Boton
        titulo="Guardar en el inventario"
        icono="check-bold"
        grande
        deshabilitado={renglones.length === 0}
        cargando={guardar.isPending}
        onPress={() => guardar.mutate({ proveedorId: null, proveedorNombre: proveedor || null, notas: null, items: renglones.map(aEntrada), actualizarCosto: true })}
      />
      <ElegirProducto
        visible={eligiendo}
        alCerrar={() => setEligiendo(false)}
        titulo="¿Qué llegó?"
        alElegir={(p) =>
          setRenglones((t) => [...t, { clave: nuevaClave(), productoId: p.id, nombre: p.nombre, icono: p.icono, cantidad: 1, costo: p.precioCompra, porTraerId: null, nuevo: null }])
        }
      />
    </Pantalla>
  );
}
