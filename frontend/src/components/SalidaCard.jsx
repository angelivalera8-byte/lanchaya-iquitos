import { TIPOS } from './Filtros.jsx';
import useInclinar from '../hooks/useInclinar.js';
import { ICONO_TIPO } from './Iconos.jsx';

// Cupos: verde (varios), amarillo (pocos), rojo (casi lleno o agotado)
function nivelCupos(cupos) {
  if (cupos <= 5) return 'rojo';
  if (cupos <= 20) return 'amarillo';
  return 'verde';
}

function formatear(fechaHora) {
  const f = new Date(fechaHora);
  return {
    dia: f.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' }),
    hora: f.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false }),
  };
}

function duracion(horas) {
  const h = Number(horas) || 0;
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  const r = h % 24;
  return r ? `${d} d ${r} h` : `${d} ${d === 1 ? 'día' : 'días'}`;
}

export default function SalidaCard({ salida, indice = 0, puedeEditar, onEditar, onEliminar }) {
  const inclinar = useInclinar();
  const { dia, hora } = formatear(salida.fechaHora);
  const tipo = TIPOS.find((t) => t.valor === salida.tipo)?.etiqueta ?? salida.tipo;
  const Icono = ICONO_TIPO[salida.tipo] ?? ICONO_TIPO.lancha;
  const nivel = nivelCupos(salida.cupos);

  return (
    <div className="card-3d" style={{ '--i': indice }} {...inclinar}>
    <article className="card">
      <header className="card-cabecera">
        <div className="card-fecha">
          <span className="hora">{hora}</span>
          <span className="dia">{dia}</span>
        </div>
        <p className="precio"><small>S/</small> {Number(salida.precio).toFixed(2)}</p>
      </header>

      <div className="ruta" aria-label={`Ruta de ${salida.puerto} a ${salida.destino}`}>
        <div className="ruta-punto">
          <span className="punto" />
          <span className="ruta-nombre">Iquitos</span>
          <span className="ruta-puerto">{salida.puerto}</span>
        </div>
        <div className="ruta-linea">
          <span className="ruta-barco"><Icono width={22} height={22} /></span>
          <span className="ruta-duracion">{duracion(salida.duracionHoras)}</span>
        </div>
        <div className="ruta-punto ruta-destino">
          <span className="punto punto-destino" />
          <h2 className="ruta-nombre">{salida.destino}</h2>
        </div>
      </div>

      <dl className="card-datos">
        <div><dt>Empresa</dt><dd>{salida.empresa}</dd></div>
        <div><dt>Embarcación</dt><dd>{salida.embarcacion || '—'}</dd></div>
      </dl>

      <div className="card-pie">
        <span className={`etiqueta tipo-${salida.tipo}`}><Icono width={16} height={16} /> {tipo}</span>
        <span className={`cupos cupos-${nivel}`}>
          {salida.cupos === 0 ? 'Sin cupos' : `${salida.cupos} cupos`}
        </span>
        {puedeEditar && (
          <div className="acciones">
            <button type="button" className="btn btn-claro btn-chico" onClick={() => onEditar(salida)}>Editar</button>
            <button type="button" className="btn btn-peligro btn-chico" onClick={() => onEliminar(salida)}>Eliminar</button>
          </div>
        )}
      </div>
      <span className="card-brillo" aria-hidden="true" />
    </article>
    </div>
  );
}
