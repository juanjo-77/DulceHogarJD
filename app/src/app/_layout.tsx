import { AtkinsonHyperlegible_400Regular, AtkinsonHyperlegible_700Bold } from '@expo-google-fonts/atkinson-hyperlegible';
import { Fraunces_600SemiBold_Italic } from '@expo-google-fonts/fraunces';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PuertaPin } from '@/modulos/acceso/PuertaPin';
import { color } from '@/tema/tokens';
import { AvisoProveedor } from '@/ui/Aviso';
import { DialogoProveedor } from '@/ui/Dialogo';

SplashScreen.preventAutoHideAsync();

const consultas = new QueryClient({
  defaultOptions: {
    // Los datos se muestran al instante desde la memoria y se refrescan por detrás.
    queries: { staleTime: 20_000, retry: 1 },
  },
});

export default function Raiz() {
  const [fuentesListas, errorFuentes] = useFonts({
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
    Fraunces_600SemiBold_Italic,
  });

  useEffect(() => {
    if (fuentesListas || errorFuentes) SplashScreen.hideAsync();
  }, [fuentesListas, errorFuentes]);

  if (!fuentesListas && !errorFuentes) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={consultas}>
        <AvisoProveedor>
          <DialogoProveedor>
            <StatusBar style="dark" />
            <PuertaPin>
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.algodon } }} />
            </PuertaPin>
          </DialogoProveedor>
        </AvisoProveedor>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
