import { useState } from 'react';

import { HistorialSurtido } from '@/modulos/surtir/HistorialSurtido';
import { ListaPorTraer } from '@/modulos/surtir/ListaPorTraer';
import { Pantalla } from '@/ui/Pantalla';
import { Segmento } from '@/ui/Segmento';

/** Surtir: la lista de lo que hay que traer y el historial de lo que ha llegado. */
export default function Surtir() {
  const [ver, setVer] = useState<'traer' | 'llego'>('traer');

  return (
    <Pantalla volver titulo="Surtir" subtitulo={ver === 'traer' ? 'Lo que tienes que traer' : 'La mercancía que ha llegado'}>
      <Segmento
        valor={ver}
        alCambiar={setVer}
        opciones={[
          { valor: 'traer', titulo: 'Por traer' },
          { valor: 'llego', titulo: 'Lo que llegó' },
        ]}
      />
      {ver === 'traer' ? <ListaPorTraer /> : <HistorialSurtido />}
    </Pantalla>
  );
}
