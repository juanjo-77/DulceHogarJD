import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { surtidoApi, useListaSurtir } from '@/api/consultas/surtido';
import { useAccion } from '@/api/useAccion';
import { espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { ConDatos } from '@/ui/Estado';
import { Tarjeta } from '@/ui/Tarjeta';
import { Vacio } from '@/ui/Vacio';

import { AnotarPorTraer } from './AnotarPorTraer';
import { RenglonPorTraer } from './RenglonPorTraer';

/** Lista de compras: se marca lo que ya consiguió y luego se guarda en el inventario. */
export function ListaPorTraer() {
  const lista = useListaSurtir();
  const [anotando, setAnotando] = useState(false);
  const sugerir = useAccion(surtidoApi.sugerir, {
    exito: (r) => (r.agregados > 0 ? `Se anotaron ${r.agregados} productos que se están acabando` : 'No hay nada más que se esté acabando'),
  });

  return (
    <ConDatos consulta={lista}>
      {(items) => {
        const conseguidos = items.filter((i) => i.conseguido).length;
        return (
          <View style={{ gap: espacio.m }}>
            <Boton titulo="Anotar lo que se está acabando" icono="auto-fix" variante="suave" cargando={sugerir.isPending} onPress={() => sugerir.mutate()} />
            {items.length === 0 ? (
              <Vacio icono="clipboard-check-outline" titulo="La lista está vacía" texto="Anota lo que necesitas comprar cuando vayas a surtir." />
            ) : (
              <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
                {items.map((i, n) => (
                  <RenglonPorTraer key={i.id} item={i} ultimo={n === items.length - 1} />
                ))}
              </Tarjeta>
            )}
            <Boton titulo="Anotar algo más" icono="plus" variante="borde" onPress={() => setAnotando(true)} />
            {conseguidos > 0 && (
              <Boton
                titulo={`Ya llegó lo marcado (${conseguidos}): guardarlo`}
                icono="package-variant-closed-plus"
                grande
                onPress={() => router.push('/surtir/registrar?desdeLista=1')}
              />
            )}
            <Boton titulo="Registrar otra mercancía que llegó" icono="truck-check-outline" variante="borde" onPress={() => router.push('/surtir/registrar')} />
            <AnotarPorTraer visible={anotando} alCerrar={() => setAnotando(false)} />
          </View>
        );
      }}
    </ConDatos>
  );
}
