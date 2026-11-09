// Capa de acceso a la API. Todo el frontend habla con el backend a través de este archivo.
const BASE = '/api';
const CLAVE_TOKEN = 'lanchaya_token';

export const guardarToken = (t) => localStorage.setItem(CLAVE_TOKEN, t);
export const leerToken = () => localStorage.getItem(CLAVE_TOKEN);
export const borrarToken = () => localStorage.removeItem(CLAVE_TOKEN);

// El AuthContext registra aquí qué hacer cuando el servidor responde 401 con una sesión activa.
let alExpirarSesion = () => {};
export const onSesionExpirada = (fn) => { alExpirarSesion = fn; };

async function request(ruta, opciones = {}) {
  const token = leerToken();
  let res;
  try {
    res = await fetch(BASE + ruta, {
      ...opciones,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa que el backend esté encendido.');
  }

  if (res.status === 204) return null;

  const datos = await res.json().catch(() => null);
  if (!res.ok) {
    // 401 fuera de las pantallas de login/registro = el token venció o es inválido.
    if (res.status === 401 && token && !ruta.startsWith('/auth/login')) alExpirarSesion();
    const error = new Error(datos?.mensaje || 'Ocurrió un error inesperado.');
    error.detalles = datos?.errores || [];
    error.status = res.status;
    throw error;
  }
  return datos;
}

// Salidas
export const getSalidas = (filtros = {}) => {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([clave, valor]) => valor && params.set(clave, valor));
  const texto = params.toString();
  return request(`/salidas${texto ? `?${texto}` : ''}`);
};
export const getDestinos = () => request('/destinos');
export const crearSalida = (datos) => request('/salidas', { method: 'POST', body: JSON.stringify(datos) });
export const actualizarSalida = (id, datos) => request(`/salidas/${id}`, { method: 'PUT', body: JSON.stringify(datos) });
export const eliminarSalida = (id) => request(`/salidas/${id}`, { method: 'DELETE' });

// Autenticación
export const iniciarSesion = (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const registrarCuenta = (datos) => request('/auth/registro', { method: 'POST', body: JSON.stringify(datos) });
export const getPerfil = () => request('/auth/me');
