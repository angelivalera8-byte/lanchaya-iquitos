import { useCallback, useEffect, useState } from 'react';
import AuthPage from './components/AuthPage.jsx';
import Cabecera from './components/Cabecera.jsx';
import Filtros from './components/Filtros.jsx';
import SalidaCard from './components/SalidaCard.jsx';
import SalidaForm from './components/SalidaForm.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { actualizarSalida, crearSalida, eliminarSalida, getDestinos, getSalidas } from './services/api.js';

const FILTROS_VACIOS = { destino: '', fecha: '', tipo: '', q: '' };

export default function App() {
  const { usuario, verificando } = useAuth();
  const [vista, setVista] = useState('inicio'); // 'inicio' | 'login' | 'registro'
  const [salidas, setSalidas] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [formulario, setFormulario] = useState(null); // null | 'nuevo' | objeto salida
  const [mensaje, setMensaje] = useState('');

  const esEmpresa = usuario?.rol === 'empresa';

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const [lista, dest] = await Promise.all([getSalidas(filtros), getDestinos()]);
      setSalidas(lista);
      setDestinos(dest);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [filtros]);

  useEffect(() => { cargar(); }, [cargar]);

  // Si la sesión se cierra o vence, se cierra también el formulario abierto.
  useEffect(() => { if (!usuario) setFormulario(null); }, [usuario]);

  const avisar = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3500);
  };

  const guardar = async (datos) => {
    if (formulario === 'nuevo') {
      await crearSalida(datos);
      avisar('Salida registrada.');
    } else {
      await actualizarSalida(formulario.id, datos);
      avisar('Cambios guardados.');
    }
    setFormulario(null);
    cargar();
  };

  const eliminar = async (salida) => {
    if (!window.confirm(`¿Eliminar la salida de ${salida.empresa} a ${salida.destino}?`)) return;
    try {
      await eliminarSalida(salida.id);
      avisar('Salida eliminada.');
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  const alAutenticar = (u, esNueva) => {
    setVista('inicio');
    avisar(esNueva ? `¡Cuenta creada! Bienvenido, ${u.nombre.split(' ')[0]}.` : `Hola de nuevo, ${u.nombre.split(' ')[0]}.`);
  };

  if (verificando) return <p className="pantalla-carga">Cargando…</p>;

  if (vista !== 'inicio' && !usuario) {
    return <AuthPage modoInicial={vista} onListo={alAutenticar} onVolver={() => setVista('inicio')} />;
  }

  return (
    <>
      <Cabecera
        totalSalidas={salidas.length}
        totalDestinos={destinos.length}
        onIngresar={() => setVista('login')}
        onRegistrarse={() => setVista('registro')}
        onNuevaSalida={() => setFormulario('nuevo')}
      />

      <main className="contenedor">
        <Filtros
          filtros={filtros}
          destinos={destinos}
          onChange={setFiltros}
          onLimpiar={() => setFiltros(FILTROS_VACIOS)}
        />

        {mensaje && <p className="aviso aviso-ok" role="status">{mensaje}</p>}

        {cargando && <p className="estado">Buscando salidas…</p>}

        {!cargando && error && (
          <div className="estado estado-error" role="alert">
            <p>{error}</p>
            <button type="button" className="btn" onClick={cargar}>Reintentar</button>
          </div>
        )}

        {!cargando && !error && salidas.length === 0 && (
          <div className="estado">
            <p>No hay salidas con esos filtros.</p>
            <button type="button" className="btn btn-claro" onClick={() => setFiltros(FILTROS_VACIOS)}>
              Limpiar filtros
            </button>
          </div>
        )}

        {!cargando && !error && salidas.length > 0 && (
          <section className="lista" aria-label="Lista de salidas">
            {salidas.map((s, i) => (
              <SalidaCard key={s.id} salida={s} indice={i} puedeEditar={esEmpresa} onEditar={setFormulario} onEliminar={eliminar} />
            ))}
          </section>
        )}
      </main>

      <footer className="pie">
        <p>LanchaYa Iquitos · Transporte fluvial de la Amazonía peruana</p>
      </footer>

      {formulario && esEmpresa && (
        <SalidaForm
          salida={formulario === 'nuevo' ? null : formulario}
          onGuardar={guardar}
          onCancelar={() => setFormulario(null)}
        />
      )}
    </>
  );
}
