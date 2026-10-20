import { router } from 'expo-router';
import { View } from 'react-native';

import { useSurtidos } from '@/api/consultas/surtido';
import { fechaCorta, pesos, plural } from '@/funciones/formato';
import { espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { ConDatos } from '@/ui/Estado';
import { Fila } from '@/ui/Fila';
import { Tarjeta } from '@/ui/Tarjeta';
import { Texto } from '@/ui/Texto';
import { Vacio } from '@/ui/Vacio';

/** Cuándo compró mercancía, a quién y cuánto pagó. */
export function HistorialSurtido() {
  const surtidos = useSurtidos();

  return (
    <View style={{ gap: espacio.m }}>
      <Boton titulo="Registrar mercancía que llegó" icono="truck-check-outline" grande onPress={() => router.push('/surtir/registrar')} />
      <ConDatos consulta={surtidos}>
        {(lista) =>
          lista.length === 0 ? (
            <Vacio icono="truck-outline" titulo="Todavía no has registrado compras" texto="Cuando llegue mercancía, regístrala y se suma sola al inventario." />
          ) : (
            <Tarjeta style={{ paddingVertical: espacio.xs, gap: 0 }}>
              {lista.map((s, i) => (
                <Fila
                  key={s.id}
                  titulo={`${fechaCorta(s.fecha)} · ${s.proveedor ?? 'Sin proveedor'}`}
                  subtitulo={`${plural(s.unidades, 'unidad', 'unidades')}: ${s.descripcion}`}
                  derecha={<Texto tipo="fuerte">{pesos(s.total)}</Texto>}
                  ultima={i === lista.length - 1}
                  onPress={() => router.push(`/surtir/${s.id}`)}
                />
              ))}
            </Tarjeta>
          )
        }
      </ConDatos>
    </View>
  );
}
