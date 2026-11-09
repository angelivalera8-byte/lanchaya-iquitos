// Iconos de línea (24x24) para los tres tipos de embarcación y detalles de interfaz.
const base = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const IconoLancha = (p) => (
  <svg {...base} {...p}><path d="M2.5 15h19l-3 5h-13z" /><path d="M6 15v-4.5h9V15" /><path d="M9 10.5V6.5h3.5v4" /><path d="M17 11.5l2 3.5" /></svg>
);
export const IconoRapido = (p) => (
  <svg {...base} {...p}><path d="M5 17c3 0 4-2 7-2h9l-3 5H8z" transform="translate(-1 -1)" /><path d="M11 13l2.2-4H18l2 4" /><path d="M2 9h4M3.5 12H7" /></svg>
);
export const IconoDeslizador = (p) => (
  <svg {...base} {...p}><path d="M3 15h18l-2.5 4h-13z" /><path d="M12 15v-4.5" /><circle cx="12" cy="8.5" r="1.7" /><path d="M2 21c2-1.4 3 1 5 0s3-1.4 5 0 3 1 5 0 3-1.4 5 0" /></svg>
);
export const IconoOjo = ({ tachado, ...p }) => (
  <svg {...base} {...p}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />{tachado && <path d="M4 4l16 16" />}</svg>
);
export const IconoBuscar = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
);
export const IconoUsuario = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20c.8-3.8 3.8-5.6 7.5-5.6s6.7 1.8 7.5 5.6" /></svg>
);
export const IconoSalir = (p) => (
  <svg {...base} {...p}><path d="M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4" /><path d="M10 8l-4 4 4 4M6 12h10" /></svg>
);
export const IconoOla = (p) => (
  <svg {...base} {...p}><path d="M2 9c2-1.6 3.4 1.2 5.5 0s3.4-1.6 5.5 0 3.4 1.2 5.5 0 3-1.6 3.5-1.2" /><path d="M2 15c2-1.6 3.4 1.2 5.5 0s3.4-1.6 5.5 0 3.4 1.2 5.5 0 3-1.6 3.5-1.2" /></svg>
);

export const ICONO_TIPO = { lancha: IconoLancha, rapido: IconoRapido, deslizador: IconoDeslizador };
