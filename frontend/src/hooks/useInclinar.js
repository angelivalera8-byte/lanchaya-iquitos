import { useCallback, useRef } from 'react';

// Inclinación 3D de una tarjeta siguiendo el mouse, con un brillo que persigue el cursor.
export default function useInclinar(maximo = 9) {
  const ref = useRef(null);

  const alMover = useCallback((e) => {
    if (e.pointerType !== 'mouse') return; // en pantallas táctiles no se inclina
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${((0.5 - py) * maximo * 1.3).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((px - 0.5) * maximo * 1.6).toFixed(2)}deg`);
    el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
    el.classList.add('inclinando');
  }, [maximo]);

  const alSalir = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.classList.remove('inclinando');
  }, []);

  return { ref, onPointerMove: alMover, onPointerLeave: alSalir };
}
