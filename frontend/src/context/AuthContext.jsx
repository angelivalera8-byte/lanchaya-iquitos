import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { borrarToken, getPerfil, guardarToken, iniciarSesion, leerToken, onSesionExpirada, registrarCuenta } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [verificando, setVerificando] = useState(Boolean(leerToken())); // true mientras se valida un token guardado
  const [sesionExpirada, setSesionExpirada] = useState(false);

  const cerrarSesion = useCallback(() => {
    borrarToken();
    setUsuario(null);
  }, []);

  // Al abrir la app: si hay token guardado, se comprueba con el servidor.
  useEffect(() => {
    onSesionExpirada(() => { cerrarSesion(); setSesionExpirada(true); });
    if (!leerToken()) return;
    getPerfil()
      .then(({ usuario: u }) => setUsuario(u))
      .catch(() => borrarToken())
      .finally(() => setVerificando(false));
  }, [cerrarSesion]);

  const entrar = async (email, password) => {
    const { token, usuario: u } = await iniciarSesion(email, password);
    guardarToken(token);
    setSesionExpirada(false);
    setUsuario(u);
    return u;
  };

  const registrar = async (datos) => {
    const { token, usuario: u } = await registrarCuenta(datos);
    guardarToken(token);
    setSesionExpirada(false);
    setUsuario(u);
    return u;
  };

  const valor = useMemo(
    () => ({ usuario, verificando, sesionExpirada, entrar, registrar, cerrarSesion, limpiarAviso: () => setSesionExpirada(false) }),
    [usuario, verificando, sesionExpirada, cerrarSesion]
  );
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
