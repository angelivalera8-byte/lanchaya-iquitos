const fs = require('fs');
const { hashPassword, verificarPassword, crearToken } = require('../utils/seguridad');
const { leerUsuarios, ARCHIVO_USUARIOS } = require('../middleware/auth');

const ROLES = ['pasajero', 'empresa'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esTexto = (v) => typeof v === 'string' && v.trim() !== '';

const publico = (u) => ({ id: u.id, nombre: u.nombre, email: u.email, rol: u.rol, empresa: u.empresa || '' });
const respuestaSesion = (u) => ({ token: crearToken({ sub: u.id, rol: u.rol }), usuario: publico(u) });

// Freno básico contra fuerza bruta: 5 intentos fallidos por correo => 5 minutos de espera.
const intentos = new Map();
const MAX_INTENTOS = 5;
const BLOQUEO_MS = 5 * 60 * 1000;

function estaBloqueado(email) {
  const r = intentos.get(email);
  if (!r) return false;
  if (r.hasta && r.hasta > Date.now()) return true;
  if (r.hasta) intentos.delete(email);
  return false;
}
function registrarFallo(email) {
  const r = intentos.get(email) || { n: 0 };
  r.n += 1;
  if (r.n >= MAX_INTENTOS) r.hasta = Date.now() + BLOQUEO_MS;
  intentos.set(email, r);
}

// POST /api/auth/registro
exports.registro = (req, res) => {
  const { nombre, email, password, rol, empresa } = req.body || {};
  const errores = [];

  if (!esTexto(nombre)) errores.push('El nombre es obligatorio.');
  if (!esTexto(email) || !EMAIL_RE.test(email.trim())) errores.push('Escribe un correo válido.');
  if (!esTexto(password) || password.length < 6) errores.push('La contraseña debe tener al menos 6 caracteres.');
  if (!ROLES.includes(rol)) errores.push('Elige si eres pasajero o empresa.');
  if (rol === 'empresa' && !esTexto(empresa)) errores.push('Escribe el nombre de tu empresa.');
  if (errores.length) return res.status(400).json({ mensaje: errores[0], errores });

  const usuarios = leerUsuarios();
  const correo = email.trim().toLowerCase();
  if (usuarios.some((u) => u.email === correo)) {
    return res.status(409).json({ mensaje: 'Ya existe una cuenta con ese correo.' });
  }

  const nuevo = {
    id: usuarios.reduce((max, u) => Math.max(max, u.id), 0) + 1,
    nombre: nombre.trim(),
    email: correo,
    passwordHash: hashPassword(password),
    rol,
    empresa: rol === 'empresa' ? empresa.trim() : '',
  };
  usuarios.push(nuevo);
  fs.writeFileSync(ARCHIVO_USUARIOS, JSON.stringify(usuarios, null, 2));
  res.status(201).json(respuestaSesion(nuevo));
};

// POST /api/auth/login
exports.login = (req, res) => {
  const { email, password } = req.body || {};
  if (!esTexto(email) || !esTexto(password)) {
    return res.status(400).json({ mensaje: 'Escribe tu correo y tu contraseña.' });
  }

  const correo = email.trim().toLowerCase();
  if (estaBloqueado(correo)) {
    return res.status(429).json({ mensaje: 'Demasiados intentos fallidos. Espera unos minutos e inténtalo de nuevo.' });
  }

  const usuario = leerUsuarios().find((u) => u.email === correo);
  if (!usuario || !verificarPassword(password, usuario.passwordHash)) {
    registrarFallo(correo);
    return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos.' });
  }

  intentos.delete(correo);
  res.status(200).json(respuestaSesion(usuario));
};

// GET /api/auth/me
exports.me = (req, res) => res.status(200).json({ usuario: publico(req.usuario) });
