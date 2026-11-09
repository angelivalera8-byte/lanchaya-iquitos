import { useEffect } from 'react';

// Escribe --mx/--my (puntero suavizado, -1 a 1), --ix/--iy (respiración lenta de la "cámara") y --sy (scroll)
// en el contenedor. Las capas de la escena leen esas variables en CSS y se mueven a distinta velocidad => 3D.
export default function useParalaje(ref) {
  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!host) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, visible = true;

    const bucle = (t) => {
      if (!visible || document.hidden) { raf = 0; return; }
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      host.style.setProperty('--mx', x.toFixed(3));
      host.style.setProperty('--my', y.toFixed(3));
      // Respiración: la cámara flota apenas, como si estuviéramos en una embarcación.
      host.style.setProperty('--ix', (Math.sin(t / 5200) * 0.34 + Math.sin(t / 2300) * 0.08).toFixed(3));
      host.style.setProperty('--iy', (Math.cos(t / 6800) * 0.22 + Math.sin(t / 1900) * 0.06).toFixed(3));
      raf = requestAnimationFrame(bucle);
    };
    const arrancar = () => { if (!raf) raf = requestAnimationFrame(bucle); };

    const mover = (e) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const salir = () => { tx = 0; ty = 0; };
    const desplazar = () => host.style.setProperty('--sy', Math.min(window.scrollY, 900).toFixed(0));
    const alCambiarVisibilidad = () => { if (!document.hidden) arrancar(); };

    // Si la escena no se ve (se hizo scroll hacia abajo), se detiene el bucle para ahorrar batería.
    const observador = new IntersectionObserver(([entrada]) => {
      visible = entrada.isIntersecting;
      if (visible) arrancar();
    });
    observador.observe(host);

    window.addEventListener('pointermove', mover, { passive: true });
    document.addEventListener('pointerleave', salir);
    document.addEventListener('visibilitychange', alCambiarVisibilidad);
    window.addEventListener('scroll', desplazar, { passive: true });
    desplazar();
    arrancar();
    return () => {
      window.removeEventListener('pointermove', mover);
      document.removeEventListener('pointerleave', salir);
      document.removeEventListener('visibilitychange', alCambiarVisibilidad);
      window.removeEventListener('scroll', desplazar);
      observador.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}
