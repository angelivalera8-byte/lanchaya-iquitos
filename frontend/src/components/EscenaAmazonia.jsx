import { useMemo, useRef } from 'react';
import useParalaje from '../hooks/useParalaje.js';
import { HOJA_GRANDE, HOJA_PALMA, copas, ola, particulas } from '../utils/escena.js';

const VB = '0 0 1600 800';
const AJUSTE = 'xMidYMax slice';

// Palmera de silueta: tronco curvo + abanico de hojas que se mecen con el viento.
function Palma({ x, y, escala = 1, inclina = 1, color = '#06261f', hoja = '#0a3a30' }) {
  const topeX = 34 * inclina;
  const angulos = [-172, -148, -122, -96, -70, -44, -18, 8];
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <g className="palma-mece" style={{ '--d': `${-(x % 9) * 0.7}s` }}>
        <path d={`M0 0 C${10 * inclina} -90 ${-8 * inclina} -170 ${topeX} -250`} stroke={color} strokeWidth="9" fill="none" strokeLinecap="round" />
        <g transform={`translate(${topeX} -250)`}>
          {angulos.map((a, i) => (
            <g key={a} transform={`rotate(${a}) scale(${0.95 + (i % 3) * 0.1})`}>
              <path className="fronda" style={{ '--d': `${-i * 0.43}s` }} d={HOJA_PALMA} fill={i % 2 ? hoja : color} />
            </g>
          ))}
        </g>
      </g>
    </g>
  );
}

// Hoja grande con nervadura.
function Hoja({ x, y, giro = 0, escala = 1, color = '#041f1a', vena = '#0d4a3d' }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${giro}) scale(${escala})`}>
      <g className="hoja-mece" style={{ '--d': `${-(x % 5)}s` }}>
        <path d={HOJA_GRANDE} fill={color} />
        <path d="M0 0 C110 -60 220 -110 330 -190" stroke={vena} strokeWidth="3" fill="none" opacity="0.7" />
      </g>
    </g>
  );
}

// Ceiba: el árbol gigante de la Amazonía, con copa en forma de paraguas.
function Ceiba({ x, y, alto = 230, escala = 1, color }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`} fill={color}>
      <path d={`M-9 0 C-6 ${-alto * 0.4} -5 ${-alto * 0.7} -3 ${-alto} L5 ${-alto} C6 ${-alto * 0.7} 8 ${-alto * 0.4} 12 0 Z`} />
      <ellipse cx="0" cy={-alto - 4} rx="120" ry="30" />
      <ellipse cx="-60" cy={-alto + 10} rx="70" ry="24" />
      <ellipse cx="66" cy={-alto + 12} rx="76" ry="26" />
      <ellipse cx="6" cy={-alto - 30} rx="70" ry="22" />
    </g>
  );
}

function Lancha({ reflejo = false }) {
  return (
    <g>
      {/* estela de espuma detrás de la popa */}
      <g className="estela">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <ellipse key={i} className="espuma" style={{ '--i': i }} cx={-160 - i * 62} cy={2} rx={46 + i * 15} ry={Math.max(2, 5.5 - i * 0.55)} fill="#ffffff" opacity={0.62 - i * 0.075} />
        ))}
      </g>
      {/* ola de proa */}
      <g className="proa">
        <path d="M146 1 q18 -9 44 -4 q-20 3 -30 9 z" fill="#ffffff" opacity="0.8" />
        <path d="M150 3 q26 -3 52 3 q-26 1 -44 6 z" fill="#ffffff" opacity="0.5" />
      </g>
      {/* casco */}
      <path d="M-122 0 L124 0 L152 -30 L-152 -30 Z" fill="#efe9d8" />
      <path d="M-146 -21 L148 -21 L152 -30 L-152 -30 Z" fill="#0f766e" />
      {/* camarote inferior */}
      <rect x="-112" y="-60" width="214" height="30" rx="3" fill="#faf6ea" />
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-100 + i * 29} y="-53" width="17" height="13" rx="2" fill="#ffd98a" />)}
      {/* camarote superior */}
      <rect x="-72" y="-88" width="134" height="28" rx="3" fill="#f1ebda" />
      {Array.from({ length: 4 }, (_, i) => <rect key={i} x={-60 + i * 30} y="-81" width="18" height="13" rx="2" fill="#ffd98a" />)}
      {/* techo */}
      <path d="M-86 -90 H78 L70 -97 H-78 Z" fill="#c2410c" />
      {/* chimenea y humo del motor */}
      <rect x="-46" y="-118" width="13" height="22" rx="2" fill="#3b3b3b" />
      {!reflejo && [0, 1, 2, 3].map((i) => (
        <circle key={i} className="humo" style={{ '--i': i }} cx="-40" cy="-120" r="8" fill="#e9e5da" />
      ))}
      {/* mástil con bandera del Perú */}
      <path d="M12 -97 V-134" stroke="#2b2b2b" strokeWidth="2.5" />
      <rect x="12" y="-134" width="8" height="13" fill="#d91023" />
      <rect x="20" y="-134" width="8" height="13" fill="#ffffff" />
      <rect x="28" y="-134" width="8" height="13" fill="#d91023" />
      {/* luces */}
      <circle cx="140" cy="-34" r="5" fill="#fff3b0" /><circle cx="140" cy="-34" r="14" fill="#ffd98a" opacity="0.35" />
    </g>
  );
}

function Bufeo() {
  return (
    <g>
      <path d="M-38 6 C-34 -10 -8 -26 22 -24 C38 -23 46 -14 60 -17 L56 -8 C48 -3 40 -6 32 2 C16 12 -16 14 -38 6 Z" fill="#f4a3b8" />
      <path d="M-8 -21 L-14 -37 L8 -23 Z" fill="#e888a1" />
      <path d="M-38 6 L-58 -6 L-52 12 Z" fill="#e888a1" />
      <circle cx="46" cy="-14" r="1.8" fill="#4a1d2b" />
    </g>
  );
}

function Ave({ color = '#e11d48', secundario = '#1d4ed8', fase = 0 }) {
  return (
    <g className="ondula" style={{ '--f': `${fase}s` }}>
      <path className="ala" d="M0 0 Q-12 -17 -30 -12 Q-14 -4 0 0 Z" fill={color} />
      <path className="ala ala-b" d="M0 0 Q12 -17 30 -12 Q14 -4 0 0 Z" fill={color} />
      <ellipse cx="0" cy="1" rx="7" ry="3" fill={secundario} />
      <path d="M-6 2 L-24 9 L-3 5 Z" fill={secundario} />
    </g>
  );
}

export default function EscenaAmazonia() {
  const ref = useRef(null);
  useParalaje(ref);
  // El agua ondulante cuesta más: se apaga en celulares y si la persona pidió menos movimiento.
  const animarAgua = useMemo(() => typeof window !== 'undefined'
    && window.innerWidth > 700 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  const formas = useMemo(() => ({
    lejos: copas({ base: 548, alto: 78, paso: 74, semilla: 3 }),
    medio1: copas({ base: 566, alto: 98, paso: 56, semilla: 7 }),
    medio2: copas({ base: 580, alto: 70, paso: 48, semilla: 11 }),
    bancoIzq: copas({ x0: -140, x1: 560, base: 655, alto: 120, paso: 95, semilla: 21, relleno: 300 }),
    bancoDer: copas({ x0: 1120, x1: 1740, base: 665, alto: 110, paso: 100, semilla: 33, relleno: 300 }),
    olas: [
      { y: 610, p: 140, a: 3, op: 0.16, dur: 26 },
      { y: 640, p: 170, a: 4, op: 0.18, dur: 21 },
      { y: 676, p: 200, a: 5, op: 0.2, dur: 17 },
      { y: 718, p: 240, a: 6, op: 0.22, dur: 14 },
      { y: 764, p: 280, a: 7, op: 0.24, dur: 11 },
    ].map((o) => ({ ...o, d: ola(o.y, o.p, o.a) })),
    luciernagas: particulas(26),
  }), []);

  return (
    <div className="escena" ref={ref} aria-hidden="true">
      {/* 1. CIELO + SOL */}
      <div className="capa" style={{ '--p': 4, '--s': 0.04 }}>
        <svg viewBox={VB} preserveAspectRatio={AJUSTE}>
          <defs>
            <linearGradient id="g-cielo" gradientUnits="userSpaceOnUse" x1="0" y1="60" x2="0" y2="580">
              <stop offset="0" stopColor="#05303a" />
              <stop offset="0.3" stopColor="#0f6e75" />
              <stop offset="0.55" stopColor="#47b0a2" />
              <stop offset="0.78" stopColor="#f6c97f" />
              <stop offset="1" stopColor="#ffe3a8" />
            </linearGradient>
            <radialGradient id="g-sol">
              <stop offset="0" stopColor="#fffdf0" />
              <stop offset="0.7" stopColor="#ffe8a3" />
              <stop offset="1" stopColor="#ffc861" />
            </radialGradient>
            <radialGradient id="g-halo">
              <stop offset="0" stopColor="#fff1c4" stopOpacity="0.95" />
              <stop offset="0.3" stopColor="#ffd98a" stopOpacity="0.45" />
              <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="g-rayo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff3c9" stopOpacity="0.28" />
              <stop offset="1" stopColor="#fff3c9" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x="-200" y="-200" width="2000" height="1200" fill="url(#g-cielo)" />
          <circle cx="1120" cy="450" r="380" fill="url(#g-halo)" />
          <g className="rayos">
            {[-62, -38, -14, 10, 34, 58].map((a) => (
              <polygon key={a} points="1120,450 1070,-300 1170,-300" fill="url(#g-rayo)" transform={`rotate(${a} 1120 450)`} />
            ))}
          </g>
          <circle cx="1120" cy="450" r="62" fill="url(#g-sol)" />
          <g className="nubes" fill="#ffe7bd" opacity="0.4">
            <ellipse cx="300" cy="300" rx="130" ry="16" /><ellipse cx="370" cy="288" rx="80" ry="14" />
            <ellipse cx="760" cy="230" rx="160" ry="14" /><ellipse cx="830" cy="220" rx="90" ry="10" />
            <ellipse cx="1380" cy="320" rx="120" ry="14" />
          </g>
        </svg>
      </div>

      {/* 2. GUACAMAYOS */}
      <div className="capa" style={{ '--p': 14, '--s': 0.1 }}>
        <svg viewBox={VB} preserveAspectRatio={AJUSTE}>
          <g transform="translate(0 330) scale(1.4)"><g className="vuelo" style={{ '--dur': '34s', '--ret': '-14s' }}><Ave fase={0} /></g></g>
          <g transform="translate(60 372) scale(1.1)"><g className="vuelo" style={{ '--dur': '34s', '--ret': '-15.5s' }}><Ave color="#f59e0b" secundario="#2563eb" fase={-1.7} /></g></g>
          <g transform="translate(0 280) scale(.9)"><g className="vuelo" style={{ '--dur': '46s', '--ret': '-30s' }}><Ave fase={-3.1} /></g></g>
        </svg>
      </div>

      {/* 3. SELVA LEJANA (con bruma) */}
      <div className="capa" style={{ '--p': 12, '--s': 0.16 }}>
        <svg viewBox={VB} preserveAspectRatio={AJUSTE}>
          <defs>
            <linearGradient id="g-bruma" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffe9b8" stopOpacity="0" />
              <stop offset="1" stopColor="#ffe9b8" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <path d={formas.lejos} fill="#4aa294" opacity="0.85" />
          <rect x="-200" y="470" width="2000" height="100" fill="url(#g-bruma)" />
        </svg>
      </div>

      {/* 4. SELVA MEDIA + CEIBAS */}
      <div className="capa" style={{ '--p': 26, '--s': 0.3 }}>
        <svg viewBox={VB} preserveAspectRatio={AJUSTE}>
          <Ceiba x={250} y={575} alto={260} color="#1e7468" escala={1.05} />
          <Ceiba x={1390} y={578} alto={210} color="#1e7468" escala={0.9} />
          <path d={formas.medio1} fill="#237d6f" />
          <path d={formas.medio2} fill="#175f55" />
          <ellipse className="bruma-media" cx="800" cy="585" rx="900" ry="26" fill="#fde7b5" opacity="0.28" />
        </svg>
      </div>

      {/* 5. RÍO: agua, reflejos, lancha, bufeo */}
      <div className="capa" style={{ '--p': 34, '--s': 0.42 }}>
        <svg viewBox={VB} preserveAspectRatio={AJUSTE}>
          <defs>
            <linearGradient id="g-agua" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6cc8c" />
              <stop offset="0.12" stopColor="#92cdb6" />
              <stop offset="0.45" stopColor="#2aa3a0" />
              <stop offset="1" stopColor="#0a5560" />
            </linearGradient>
            <filter id="f-ondas" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.004 0.09" numOctaves="2" seed="4" result="r">
                {animarAgua && <animate attributeName="baseFrequency" dur="16s" repeatCount="indefinite" values="0.004 0.09;0.0065 0.125;0.0035 0.1;0.004 0.09" />}
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="r" scale="16" />
            </filter>
            <filter id="f-suave"><feGaussianBlur stdDeviation="2.2" /></filter>
          </defs>
          <rect x="-200" y="578" width="2000" height="400" fill="url(#g-agua)" />
          {/* reflejo de la selva */}
          <g transform="translate(0 1156) scale(1 -1)" opacity="0.32" filter="url(#f-ondas)">
            <path d={formas.medio1} fill="#237d6f" />
            <path d={formas.medio2} fill="#175f55" />
          </g>
          <rect x="-200" y="578" width="2000" height="14" fill="#fde7b5" opacity="0.35" />
          {/* destellos del sol en el agua */}
          <g className="destellos" fill="#fff4cf">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <ellipse key={i} cx={1120 + ((i * 37) % 50) - 25} cy={604 + i * 22} rx={70 - i * 6} ry="2.2" style={{ '--i': i }} />
            ))}
          </g>
          {formas.olas.map((o) => (
            <g key={o.y} className="ola" style={{ '--d': `${o.p}px`, '--t': `${o.dur}s` }}>
              <path d={o.d} stroke="#ffffff" strokeOpacity={o.op} strokeWidth="2" fill="none" />
            </g>
          ))}

          {/* ondas de peces que suben a la superficie */}
          {[[420, 650, 0], [930, 700, -2.6], [1030, 752, -5.2], [270, 735, -1.3]].map(([cx, cy, d], i) => (
            <g key={i} className="anillos" style={{ '--d': `${d}s` }}>
              <ellipse cx={cx} cy={cy} rx="34" ry="5" fill="none" stroke="#fff" strokeWidth="1.6" />
              <ellipse cx={cx} cy={cy} rx="19" ry="2.8" fill="none" stroke="#fff" strokeWidth="1.2" />
            </g>
          ))}

          {/* lancha navegando */}
          <g transform="translate(0 722) scale(0.78)">
            <g className="navega">
              <g className="mece">
                <Lancha />
                <g transform="scale(1 -.5)" opacity="0.22" filter="url(#f-ondas)"><Lancha reflejo /></g>
              </g>
            </g>
          </g>

          {/* bufeo saltando, con anillos y gotas al salir y al caer */}
          <g transform="translate(640 692) scale(0.88)">
            {[['sale', 0], ['cae', 170]].map(([cual, dx]) => (
              <g key={cual} transform={`translate(${dx} 8)`}>
                <g className={`chapoteo chapoteo-${cual}`}>
                  <ellipse rx="34" ry="6" fill="none" stroke="#fff" strokeWidth="2" />
                  <ellipse rx="18" ry="3" fill="none" stroke="#fff" strokeWidth="1.5" />
                </g>
                {[-16, -7, 5, 15].map((gx, i) => (
                  <circle key={gx} className={`gota gota-${cual}`} style={{ '--dx': `${gx}px`, '--h': `${-30 - (i % 2) * 16}px` }} r="2.4" fill="#fff" />
                ))}
              </g>
            ))}
            <g className="bufeo-x"><g className="bufeo-y"><Bufeo /></g></g>
          </g>
        </svg>
      </div>

      {/* 6. ORILLAS Y PALMERAS (primer plano cercano) */}
      <div className="capa" style={{ '--p': 62, '--s': 0.7 }}>
        <svg viewBox={VB} preserveAspectRatio={AJUSTE}>
          {/* orilla izquierda: talud inclinado + matas redondeadas */}
          <g fill="#0b3d34">
            <path d="M-140 840 L-140 590 C40 570 170 610 270 660 C350 700 440 740 520 790 L600 840Z" />
            <ellipse cx="-10" cy="590" rx="150" ry="85" /><ellipse cx="140" cy="602" rx="120" ry="62" />
            <ellipse cx="250" cy="650" rx="80" ry="38" /><ellipse cx="60" cy="560" rx="90" ry="55" />
          </g>
          {/* orilla derecha */}
          <g fill="#0a3830">
            <path d="M1740 840 L1740 600 C1580 590 1460 630 1370 680 C1290 722 1210 760 1150 806 L1100 840Z" />
            <ellipse cx="1650" cy="600" rx="160" ry="90" /><ellipse cx="1500" cy="622" rx="120" ry="60" />
            <ellipse cx="1390" cy="672" rx="85" ry="38" /><ellipse cx="1570" cy="570" rx="90" ry="52" />
          </g>
          <Palma x={150} y={700} escala={1.25} inclina={1} color="#06261f" hoja="#0a3a30" />
          <Palma x={330} y={716} escala={0.9} inclina={-1} color="#06261f" hoja="#0a3a30" />
          <Palma x={1420} y={706} escala={1.15} inclina={-1} color="#06261f" hoja="#0a3a30" />
          <Palma x={1230} y={716} escala={0.75} inclina={1} color="#06261f" hoja="#0a3a30" />
          <path d="M-140 840 L-140 730 C80 712 240 760 400 820 L480 840Z" fill="#06261f" />
          <path d="M1740 840 L1740 740 C1560 722 1400 770 1260 826 L1200 840Z" fill="#06261f" />
        </svg>
      </div>

      {/* 7. HOJAS GIGANTES DE PRIMER PLANO (desenfocadas) */}
      <div className="capa capa-frente" style={{ '--p': 120, '--s': 1 }}>
        <svg viewBox={VB} preserveAspectRatio={AJUSTE}>
          <defs><filter id="f-profundidad"><feGaussianBlur stdDeviation="1.6" /></filter></defs>
          <g filter="url(#f-profundidad)">
            <Hoja x={-60} y={860} giro={-18} escala={1.25} />
            <Hoja x={-30} y={880} giro={-52} escala={1.05} color="#052a23" vena="#0f5444" />
            <Hoja x={1660} y={870} giro={198} escala={1.2} color="#052a23" vena="#0f5444" />
            <Hoja x={1640} y={890} giro={232} escala={1} />
          </g>
        </svg>
      </div>

      {/* LUCIÉRNAGAS / POLEN */}
      <div className="luciernagas">
        {formas.luciernagas.map((l) => (
          <span key={l.id} style={{ left: `${l.x}%`, top: `${l.y}%`, '--t': `${l.t}s`, '--d': `${l.d}s`, '--dur': `${l.dur}s`, '--op': l.op }} />
        ))}
      </div>
    </div>
  );
}
