import { IconoBuscar, IconoLancha, IconoDeslizador, IconoRapido } from './Iconos.jsx';

export const TIPOS = [
  { valor: 'lancha', etiqueta: 'Lancha' },
  { valor: 'rapido', etiqueta: 'Rápido' },
  { valor: 'deslizador', etiqueta: 'Deslizador' },
];

const ICONOS = { lancha: IconoLancha, rapido: IconoRapido, deslizador: IconoDeslizador };

export default function Filtros({ filtros, destinos, onChange, onLimpiar }) {
  const cambiar = (e) => onChange({ ...filtros, [e.target.name]: e.target.value });
  const elegirTipo = (valor) => onChange({ ...filtros, tipo: filtros.tipo === valor ? '' : valor });
  const hayFiltros = Object.values(filtros).some(Boolean);

  return (
    <section className="filtros" aria-label="Filtros de salidas">
      <label className="campo campo-busqueda">
        Empresa o embarcación
        <span className="input-icono">
          <IconoBuscar />
          <input type="search" name="q" value={filtros.q} onChange={cambiar} placeholder="Ej. Eduardo, Itaya" />
        </span>
      </label>

      <label className="campo">
        Destino
        <select name="destino" value={filtros.destino} onChange={cambiar}>
          <option value="">Todos los destinos</option>
          {destinos.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </label>

      <label className="campo">
        Fecha
        <input type="date" name="fecha" value={filtros.fecha} onChange={cambiar} />
      </label>

      <div className="campo campo-tipos" role="group" aria-label="Tipo de embarcación">
        Tipo de embarcación
        <div className="tipos">
          {TIPOS.map((t) => {
            const Icono = ICONOS[t.valor];
            return (
              <button key={t.valor} type="button" className={`tipo-btn ${filtros.tipo === t.valor ? 'activo' : ''}`} aria-pressed={filtros.tipo === t.valor} onClick={() => elegirTipo(t.valor)}>
                <Icono width={20} height={20} /> {t.etiqueta}
              </button>
            );
          })}
        </div>
      </div>

      <button type="button" className="btn btn-claro" onClick={onLimpiar} disabled={!hayFiltros}>
        Limpiar
      </button>
    </section>
  );
}
