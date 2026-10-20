import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useInicio } from '@/api/consultas/negocio';
import { Atajos } from '@/modulos/inicio/Atajos';
import { Encabezado } from '@/modulos/inicio/Encabezado';
import { Pendientes } from '@/modulos/inicio/Pendientes';
import { ResumenHoy } from '@/modulos/inicio/ResumenHoy';
import { espacio } from '@/tema/tokens';
import { Boton } from '@/ui/Boton';
import { ConDatos } from '@/ui/Estado';
import { Pantalla } from '@/ui/Pantalla';

export default function Inicio() {
  const inicio = useInicio();

  return (
    <Pantalla refrescando={inicio.isRefetching} alRefrescar={inicio.refetch}>
      <Encabezado />
      <ConDatos consulta={inicio}>
        {(datos) => (
          <>
            <ResumenHoy datos={datos} />
            <View style={s.acciones}>
              <Boton titulo="Vender" icono="cart-heart" grande onPress={() => router.navigate('/vender')} />
              <Boton titulo="Recibir un abono" icono="hand-coin" grande variante="suave" onPress={() => router.navigate('/cobrar')} />
            </View>
            <Pendientes alertas={datos.alertas} />
            <Atajos datos={datos} />
          </>
        )}
      </ConDatos>
    </Pantalla>
  );
}

const s = StyleSheet.create({
  acciones: { gap: espacio.m },
});
