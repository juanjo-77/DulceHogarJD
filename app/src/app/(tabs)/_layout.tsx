import { Tabs } from 'expo-router/js-tabs';

import { color } from '@/tema/tokens';
import { BarraPestanas } from '@/modulos/navegacion/BarraPestanas';

export default function Pestanas() {
  return (
    <Tabs
      tabBar={(props) => <BarraPestanas {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: color.algodon } }}>
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="productos" options={{ title: 'Productos' }} />
      <Tabs.Screen name="vender" options={{ title: 'Vender' }} />
      <Tabs.Screen name="cobrar" options={{ title: 'Me deben' }} />
      <Tabs.Screen name="clientes" options={{ title: 'Clientes' }} />
    </Tabs>
  );
}
