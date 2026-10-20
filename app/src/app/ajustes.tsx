import { router } from 'expo-router';
import { useState } from 'react';

import { mensajeDeError } from '@/api/pedir';
import { SERVIDOR } from '@/api/servidor';
import { descargarYCompartir } from '@/funciones/descargar';
import { DatosNegocio } from '@/modulos/ajustes/DatosNegocio';
import { SeguridadPin } from '@/modulos/ajustes/SeguridadPin';
import { color, espacio } from '@/tema/tokens';
import { useAviso } from '@/ui/Aviso';
import { Boton } from '@/ui/Boton';
import { Pantalla } from '@/ui/Pantalla';
import { Seccion } from '@/ui/Seccion';
import { Texto } from '@/ui/Texto';

export default function Ajustes() {
  const aviso = useAviso();
  const [descargando, setDescargando] = useState(false);

  const exportarExcel = async () => {
    setDescargando(true);
    try {
      await descargarYCompartir(`${SERVIDOR}/api/exportar/excel`, 'dulce-hogar.xlsx');
    } catch (e) {
      aviso.error(`No se pudo descargar. ${mensajeDeError(e)}`);
    } finally {
      setDescargando(false);
    }
  };

  return (
    <Pantalla volver titulo="Ajustes">
      <DatosNegocio />

      <Seccion titulo="Organizar">
        <Boton titulo="Categorías de productos" icono="shape-outline" variante="borde" onPress={() => router.push('/categorias')} />
      </Seccion>

      <Seccion titulo="Guardar tu información" ayuda="Tus datos viven en internet y se guardan solos. Si quieres, puedes bajar todo a Excel.">
        <Boton titulo="Exportar todo a Excel" icono="microsoft-excel" variante="borde" cargando={descargando} onPress={exportarExcel} />
      </Seccion>

      <SeguridadPin />

      <Texto tipo="pequeno" color={color.tintaTenue} centrado style={{ marginTop: espacio.l }}>
        Conectada a {SERVIDOR}
      </Texto>
    </Pantalla>
  );
}
