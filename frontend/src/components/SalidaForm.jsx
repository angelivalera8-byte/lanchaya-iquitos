import { useState } from 'react';
import { TIPOS } from './Filtros.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const PUERTOS = ['Puerto Henry', 'Puerto Masusa', 'Puerto Productores', 'Bellavista Nanay'];

const VACIO = {
  empresa: '', embarcacion: '', tipo: 'rapido', destino: '', puerto: PUERTOS[0],
  fechaHora: '', duracionHoras: '', precio: '', cupos: '',
};

// Misma lógica que el backend, para avisar antes de enviar.
function validar(d, original) {
  const e = {};
  if (!d.destino.trim()) e.destino = 'Escribe el destino.';
  if (!d.puerto.trim()) e.puerto = 'Elige el puerto de salida.';
  if (!TIPOS.some((t) => t.valor === d.tipo)) e.tipo = 'Elige un tipo de embarcación.';
  if (d.precio === '' || Number.isNaN(Number(d.precio)) || Number(d.precio) <= 0) e.precio = 'El precio debe ser mayor que 0.';
  if (d.duracionHoras !== '' && Number(d.duracionHoras) < 0) e.duracionHoras = 'No puede ser negativa.';
  if (d.cupos !== '' && Number(d.cupos) < 0) e.cupos = 'No puede ser negativo.';
  if (!d.fechaHora) {
    e.fechaHora = 'Elige fecha y hora de salida.';
  } else if ((!original || original.fechaHora !== d.fechaHora) && new Date(d.fechaHora) < new Date()) {
    e.fechaHora = 'La salida no puede estar en el pasado.';
  }
  return e;
}

export default function SalidaForm({ salida, onGuardar, onCancelar }) {
  const { usuario } = useAuth();
  const [datos, setDatos] = useState(salida ? { ...VACIO, ...salida } : { ...VACIO, empresa: usuario.empresa });
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    const encontrados = validar(datos, salida);
    setErrores(encontrados);
    setErrorServidor('');
    if (Object.keys(encontrados).length) return;

    setEnviando(true);
    try {
      await onGuardar(datos);
    } catch (err) {
      setErrorServidor(err.message);
      setEnviando(false);
    }
  };

  const campo = (nombre, etiqueta, props = {}) => (
    <label className={`campo ${errores[nombre] ? 'campo-error' : ''}`}>
      {etiqueta}
      <input name={nombre} value={datos[nombre]} onChange={cambiar} {...props} />
      {errores[nombre] && <span className="msg-error">{errores[nombre]}</span>}
    </label>
  );

  return (
    <div className="fondo-modal" role="dialog" aria-modal="true" aria-labelledby="titulo-form">
      <form className="modal" onSubmit={enviar} noValidate>
        <h2 id="titulo-form">{salida ? 'Editar salida' : 'Registrar salida'}</h2>

        <div className="rejilla">
          <label className="campo">
            Empresa
            <input name="empresa" value={datos.empresa} readOnly aria-readonly="true" className="solo-lectura" />
          </label>
          {campo('embarcacion', 'Embarcación (opcional)')}

          <label className={`campo ${errores.tipo ? 'campo-error' : ''}`}>
            Tipo
            <select name="tipo" value={datos.tipo} onChange={cambiar}>
              {TIPOS.map((t) => <option key={t.valor} value={t.valor}>{t.etiqueta}</option>)}
            </select>
            {errores.tipo && <span className="msg-error">{errores.tipo}</span>}
          </label>

          {campo('destino', 'Destino', { placeholder: 'Ej. Nauta' })}

          <label className={`campo ${errores.puerto ? 'campo-error' : ''}`}>
            Puerto de salida
            <select name="puerto" value={datos.puerto} onChange={cambiar}>
              {PUERTOS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {errores.puerto && <span className="msg-error">{errores.puerto}</span>}
          </label>

          {campo('fechaHora', 'Fecha y hora de salida', { type: 'datetime-local' })}
          {campo('precio', 'Precio (S/)', { type: 'number', min: 0, step: '0.5', inputMode: 'decimal' })}
          {campo('duracionHoras', 'Duración (horas)', { type: 'number', min: 0 })}
          {campo('cupos', 'Cupos disponibles', { type: 'number', min: 0 })}
        </div>

        {errorServidor && <p className="aviso aviso-error" role="alert">{errorServidor}</p>}

        <div className="modal-acciones">
          <button type="button" className="btn btn-claro" onClick={onCancelar}>Cancelar</button>
          <button type="submit" className="btn" disabled={enviando}>
            {enviando ? 'Guardando…' : salida ? 'Guardar cambios' : 'Registrar salida'}
          </button>
        </div>
      </form>
    </div>
  );
}
