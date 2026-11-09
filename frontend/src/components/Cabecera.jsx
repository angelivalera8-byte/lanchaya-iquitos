import { useAuth } from '../context/AuthContext.jsx';
import useContador from '../hooks/useContador.js';
import EscenaAerea from './EscenaAerea.jsx';
import { IconoLancha, IconoSalir, IconoUsuario } from './Iconos.jsx';

export default function Cabecera({ totalSalidas, totalDestinos, onIngresar, onRegistrarse, onNuevaSalida }) {
  const { usuario, cerrarSesion } = useAuth();
  const esEmpresa = usuario?.rol === 'empresa';
  const salidas = useContador(totalSalidas);
  const destinos = useContador(totalDestinos);

  return (
    <header className="hero">
      <EscenaAerea />
      <div className="hero-velo" />

      <nav className="nav">
        <span className="marca"><IconoLancha /> LanchaYa</span>

        <div className="nav-acciones">
          {usuario ? (
            <>
              <span className="usuario-chip" title={usuario.email}>
                <IconoUsuario />
                <span>
                  {usuario.nombre.split(' ')[0]}
                  <small>{esEmpresa ? usuario.empresa : 'Pasajero'}</small>
                </span>
              </span>
              <button type="button" className="btn btn-vidrio btn-chico" onClick={cerrarSesion}>
                <IconoSalir /> Salir
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-vidrio btn-chico" onClick={onIngresar}>Ingresar</button>
              <button type="button" className="btn btn-sol btn-chico" onClick={onRegistrarse}>Crear cuenta</button>
            </>
          )}
        </div>
      </nav>

      <div className="hero-contenido">
        <p className="hero-etiqueta">Iquitos · Loreto · Amazonía peruana</p>
        <h1>Navega la Amazonía <em>sin perder el rumbo</em></h1>
        <p className="hero-texto">Horarios, puertos y pasajes de lanchas, rápidos y deslizadores en un solo lugar.</p>

        <div className="hero-pie">
          <ul className="hero-datos" aria-label="Resumen">
            <li><strong>{salidas}</strong> salidas</li>
            <li><strong>{destinos}</strong> destinos</li>
          </ul>
          {esEmpresa && (
            <button type="button" className="btn btn-sol" onClick={onNuevaSalida}>+ Registrar salida</button>
          )}
        </div>
      </div>

      <svg className="hero-ola" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40c120 30 240 30 360 10s240-40 360-30 240 40 360 40 240-30 360-20v40H0z" fill="var(--orilla)" />
      </svg>
    </header>
  );
}
