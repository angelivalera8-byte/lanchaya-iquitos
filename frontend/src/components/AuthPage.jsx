import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import EscenaAerea from './EscenaAerea.jsx';
import { IconoLancha, IconoOjo } from './Iconos.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CUENTAS_DEMO = [
  { etiqueta: 'Pasajero', email: 'pasajero@lanchaya.pe' },
  { etiqueta: 'Fluvial Amazonas', email: 'fluvial@lanchaya.pe' },
  { etiqueta: 'Río Itaya', email: 'itaya@lanchaya.pe' },
];

export default function AuthPage({ modoInicial = 'login', onListo, onVolver }) {
  const { entrar, registrar, sesionExpirada } = useAuth();
  const [modo, setModo] = useState(modoInicial); // 'login' | 'registro'
  const [datos, setDatos] = useState({ nombre: '', email: '', password: '', rol: 'pasajero', empresa: '' });
  const [verPassword, setVerPassword] = useState(false);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [enviando, setEnviando] = useState(false);

  const esRegistro = modo === 'registro';
  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const cambiarModo = (m) => { setModo(m); setErrores({}); setErrorServidor(''); };

  const validar = () => {
    const e = {};
    if (esRegistro && !datos.nombre.trim()) e.nombre = 'Escribe tu nombre.';
    if (!EMAIL_RE.test(datos.email.trim())) e.email = 'Escribe un correo válido.';
    if (!datos.password) e.password = 'Escribe tu contraseña.';
    else if (esRegistro && datos.password.length < 6) e.password = 'Mínimo 6 caracteres.';
    if (esRegistro && datos.rol === 'empresa' && !datos.empresa.trim()) e.empresa = 'Escribe el nombre de tu empresa.';
    return e;
  };

  const enviar = async (ev) => {
    ev.preventDefault();
    const encontrados = validar();
    setErrores(encontrados);
    setErrorServidor('');
    if (Object.keys(encontrados).length) return;

    setEnviando(true);
    try {
      const usuario = esRegistro
        ? await registrar({ ...datos, email: datos.email.trim() })
        : await entrar(datos.email.trim(), datos.password);
      onListo(usuario, esRegistro);
    } catch (err) {
      setErrorServidor(err.message);
      setEnviando(false);
    }
  };

  const usarDemo = (email) => {
    setDatos({ ...datos, email, password: 'demo1234' });
    setErrores({});
    setErrorServidor('');
  };

  return (
    <div className="auth">
      <EscenaAerea sinPareja />
      <div className="auth-velo" />
      <aside className="auth-visual">
        <div className="auth-visual-texto">
          <span className="marca marca-clara"><IconoLancha /> LanchaYa</span>
          <h2>El río te espera.</h2>
          <p>Consulta horarios, puertos y pasajes de las embarcaciones que zarpan desde Iquitos hacia toda la Amazonía.</p>
        </div>
      </aside>

      <main className="auth-panel">
        <button type="button" className="enlace-volver" onClick={onVolver}>← Volver a las salidas</button>

        <div className="auth-caja">
          <div className="pestanas" role="tablist" aria-label="Acceso">
            <button type="button" role="tab" aria-selected={!esRegistro} className={!esRegistro ? 'activa' : ''} onClick={() => cambiarModo('login')}>Ingresar</button>
            <button type="button" role="tab" aria-selected={esRegistro} className={esRegistro ? 'activa' : ''} onClick={() => cambiarModo('registro')}>Crear cuenta</button>
          </div>

          <h1>{esRegistro ? 'Crea tu cuenta' : 'Bienvenido de vuelta'}</h1>
          <p className="auth-sub">
            {esRegistro ? 'Pasajeros y empresas fluviales, todos son bienvenidos.' : 'Ingresa para gestionar tus salidas o seguir explorando rutas.'}
          </p>

          {sesionExpirada && !esRegistro && <p className="aviso aviso-error" role="alert">Tu sesión venció. Ingresa de nuevo.</p>}

          <form onSubmit={enviar} noValidate className="auth-form">
            {esRegistro && (
              <>
                <fieldset className="selector-rol">
                  <legend>Soy…</legend>
                  <label className={datos.rol === 'pasajero' ? 'activo' : ''}>
                    <input type="radio" name="rol" value="pasajero" checked={datos.rol === 'pasajero'} onChange={cambiar} />
                    <strong>Pasajero</strong><span>Busco salidas</span>
                  </label>
                  <label className={datos.rol === 'empresa' ? 'activo' : ''}>
                    <input type="radio" name="rol" value="empresa" checked={datos.rol === 'empresa'} onChange={cambiar} />
                    <strong>Empresa</strong><span>Publico salidas</span>
                  </label>
                </fieldset>

                <label className={`campo ${errores.nombre ? 'campo-error' : ''}`}>
                  Nombre
                  <input name="nombre" value={datos.nombre} onChange={cambiar} autoComplete="name" />
                  {errores.nombre && <span className="msg-error">{errores.nombre}</span>}
                </label>

                {datos.rol === 'empresa' && (
                  <label className={`campo ${errores.empresa ? 'campo-error' : ''}`}>
                    Nombre de la empresa
                    <input name="empresa" value={datos.empresa} onChange={cambiar} placeholder="Ej. Transportes Río Itaya" autoComplete="organization" />
                    {errores.empresa && <span className="msg-error">{errores.empresa}</span>}
                  </label>
                )}
              </>
            )}

            <label className={`campo ${errores.email ? 'campo-error' : ''}`}>
              Correo electrónico
              <input type="email" name="email" value={datos.email} onChange={cambiar} autoComplete="email" inputMode="email" />
              {errores.email && <span className="msg-error">{errores.email}</span>}
            </label>

            <label className={`campo ${errores.password ? 'campo-error' : ''}`}>
              Contraseña
              <span className="input-con-boton">
                <input type={verPassword ? 'text' : 'password'} name="password" value={datos.password} onChange={cambiar} autoComplete={esRegistro ? 'new-password' : 'current-password'} />
                <button type="button" className="btn-ojo" onClick={() => setVerPassword(!verPassword)} aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  <IconoOjo tachado={verPassword} />
                </button>
              </span>
              {errores.password && <span className="msg-error">{errores.password}</span>}
            </label>

            {errorServidor && <p className="aviso aviso-error" role="alert">{errorServidor}</p>}

            <button type="submit" className="btn btn-grande" disabled={enviando}>
              {enviando ? 'Un momento…' : esRegistro ? 'Crear cuenta' : 'Ingresar'}
            </button>
          </form>

          {!esRegistro && (
            <div className="demo">
              <p>Cuentas de prueba (contraseña <code>demo1234</code>)</p>
              <div className="demo-botones">
                {CUENTAS_DEMO.map((c) => (
                  <button key={c.email} type="button" className="chip" onClick={() => usarDemo(c.email)}>{c.etiqueta}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
