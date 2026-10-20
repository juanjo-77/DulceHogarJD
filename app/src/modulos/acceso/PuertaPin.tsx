import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { Modal, View } from 'react-native';

import { acceso, useAcceso } from '@/api/acceso';
import { color } from '@/tema/tokens';

import { PantallaPin } from './PantallaPin';

/**
 * Antes de mostrar la app revisa si el negocio tiene PIN. La primera vez la app no se ve
 * hasta escribirlo; si después lo piden de nuevo, la pantalla del PIN se pone encima
 * sin perder la pantalla en la que estaba.
 */
export function PuertaPin({ children }: { children: ReactNode }) {
  const { fase } = useAcceso();
  const consultas = useQueryClient();
  const [yaAbrio, setYaAbrio] = useState(false);

  useEffect(() => {
    acceso.iniciar();
  }, []);

  useEffect(() => {
    if (fase === 'abierta') setYaAbrio(true);
  }, [fase]);

  const alEntrar = () => consultas.invalidateQueries();

  if (fase === 'revisando') return <View style={{ flex: 1, backgroundColor: color.algodon }} />;
  if (!yaAbrio && fase === 'pedirPin') return <PantallaPin alEntrar={alEntrar} />;

  return (
    <>
      {children}
      {/* onRequestClose vacío: el botón "atrás" de Android no deja saltarse el PIN. */}
      <Modal visible={fase === 'pedirPin'} animationType="fade" onRequestClose={() => {}} statusBarTranslucent>
        <PantallaPin alEntrar={alEntrar} />
      </Modal>
    </>
  );
}
