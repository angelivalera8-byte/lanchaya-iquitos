import { useEffect, useState } from 'react';

// Cuenta de 0 al número indicado (para los contadores de la cabecera).
export default function useContador(meta, duracion = 900) {
  const [valor, setValor] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setValor(meta); return undefined; }
    let raf;
    const inicio = performance.now();
    const paso = (ahora) => {
      const t = Math.min((ahora - inicio) / duracion, 1);
      setValor(Math.round(meta * (1 - (1 - t) ** 3)));
      if (t < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [meta, duracion]);
  return valor;
}
