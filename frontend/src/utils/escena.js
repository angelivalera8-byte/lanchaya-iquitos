// Generadores de formas para la escena de la Amazonía (todo vectorial: nunca se pixelea).

// Números pseudo-aleatorios con semilla: la selva siempre se dibuja igual.
function azar(semilla) {
  let s = semilla >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Silueta de copas de árboles: una fila de "domos" de distinta altura.
export function copas({ x0 = -120, x1 = 1720, base, alto, paso = 60, semilla = 1, relleno = 400 }) {
  const r = azar(semilla);
  let x = x0;
  let y = base - alto * r() * 0.3;
  let d = `M${x0} ${base + relleno} L${x0} ${y.toFixed(1)}`;
  while (x < x1) {
    const w = paso * (0.7 + r() * 0.9);
    const tope = base - alto * (0.55 + r() * 0.75);
    const nx = x + w;
    const ny = base - alto * r() * 0.3;
    d += ` C${x.toFixed(1)} ${tope.toFixed(1)} ${nx.toFixed(1)} ${tope.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`;
    x = nx;
    y = ny;
  }
  return `${d} L${x.toFixed(1)} ${base + relleno} Z`;
}

// Líneas de olas que se repiten (se animan desplazándolas un periodo completo).
export function ola(y, periodo = 160, amplitud = 6, desde = -320, hasta = 1920) {
  const medio = periodo / 2;
  let d = `M${desde} ${y} q${medio / 2} ${-amplitud} ${medio} 0`;
  for (let x = desde + medio; x < hasta; x += medio) d += ` t${medio} 0`;
  return d;
}

// Hoja de palmera (pluma) con su inclinación.
export const HOJA_PALMA = 'M0 0 C28 -34 78 -44 128 -8 C84 -24 40 -18 0 0 Z';
// Hoja grande de plátano / heliconia.
export const HOJA_GRANDE = 'M0 0 C30 -130 170 -215 340 -196 C318 -92 186 -14 0 0 Z';

// Puntos de luciérnagas / polen, repartidos con semilla.
export function particulas(n, semilla = 5) {
  const r = azar(semilla);
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: r() * 100,
    y: 35 + r() * 60,
    t: 2 + r() * 3.2,
    d: r() * -9,
    dur: 7 + r() * 9,
    op: 0.35 + r() * 0.6,
  }));
}
