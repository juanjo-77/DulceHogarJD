import { useEffect, useState } from 'react';

/** Espera a que la persona deje de escribir antes de buscar. */
export function useRetraso<T>(valor: T, ms = 250): T {
  const [retrasado, setRetrasado] = useState(valor);
  useEffect(() => {
    const t = setTimeout(() => setRetrasado(valor), ms);
    return () => clearTimeout(t);
  }, [valor, ms]);
  return retrasado;
}
