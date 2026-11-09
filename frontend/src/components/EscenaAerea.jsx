import { useRef } from 'react';
import useParalaje from '../hooks/useParalaje.js';

// Escena realista: vista aérea del río Amazonas (foto) en capas con paralaje 3D.
// - Capa 1: selva y río. La cámara "vuela" despacio hacia adelante; el sol brilla solo sobre el agua.
// - Capa 2-3: guacamayos recortados de la foto, a distinta profundidad, que planean y aletean.
// - Capa 4: guacamayos lejanos cruzando el cielo.
export default function EscenaAerea({ sinPareja = false }) {
  const ref = useRef(null);
  useParalaje(ref);

  return (
    <div className="escena escena-aerea" ref={ref} aria-hidden="true">
      {/* 1. SELVA Y RÍO */}
      <div className="capa" style={{ '--p': 16, '--s': 0.24 }}>
        <div className="lienzo">
          <div className="camara">
            <img className="lienzo-fondo" src="/amazonia-fondo.jpg" alt="" decoding="async" />
            <div className="destello-rio destello-a" />
            <div className="destello-rio destello-b" />
            <div className="bruma bruma-a" />
            <div className="bruma bruma-b" />
          </div>
        </div>
        <div className="luz-sol" />
      </div>

      {/* 2. GUACAMAYOS LEJANOS */}
      <div className="capa" style={{ '--p': 30, '--s': 0.4 }}>
        {[
          { top: '17%', ancho: 92, dur: 46, ret: -8, inv: false },
          { top: '30%', ancho: 70, dur: 58, ret: -31, inv: true },
          { top: '12%', ancho: 56, dur: 70, ret: -52, inv: false },
        ].map((a, i) => (
          <div key={i} className={`lejano ${a.inv ? 'lejano-inv' : ''}`} style={{ top: a.top, width: a.ancho, '--dur': `${a.dur}s`, '--ret': `${a.ret}s` }}>
            <img src="/guacamayo-atras.webp" alt="" decoding="async" style={{ animationDelay: `${i * -0.21}s` }} />
          </div>
        ))}
      </div>

      {!sinPareja && (
        <>
          {/* 3. GUACAMAYO DE ATRÁS */}
          <div className="capa" style={{ '--p': 52, '--s': 0.62 }}>
            <div className="pareja">
              <div className="guac guac-atras">
                <img src="/guacamayo-atras.webp" alt="" decoding="async" />
              </div>
            </div>
          </div>

          {/* 4. GUACAMAYO DE ADELANTE (el más cercano a la cámara) */}
          <div className="capa" style={{ '--p': 88, '--s': 0.95 }}>
            <div className="pareja">
              <div className="guac guac-frente">
                <img src="/guacamayo-frente.webp" alt="" decoding="async" />
              </div>
            </div>
          </div>
        </>
      )}

      <div className="luciernagas luciernagas-polvo" />
    </div>
  );
}
