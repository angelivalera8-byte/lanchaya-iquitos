const fs = require('fs');
const path = require('path');
const { verificarToken } = require('../utils/seguridad');

const ARCHIVO_USUARIOS = path.join(__dirname, '..', 'data', 'usuarios.json');
const leerUsuarios = () => JSON.parse(fs.readFileSync(ARCHIVO_USUARIOS, 'utf8'));

// Exige un token válido en "Authorization: Bearer <token>" y deja el usuario en req.usuario.
function requerirAuth(req, res, next) {
  const cabecera = req.headers.authorization || '';
  const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : '';
  const payload = verificarToken(token);
  if (!payload) return res.status(401).json({ mensaje: 'Debes iniciar sesión para continuar.' });

  const usuario = leerUsuarios().find((u) => u.id === payload.sub);
  if (!usuario) return res.status(401).json({ mensaje: 'Tu sesión ya no es válida. Inicia sesión otra vez.' });

  req.usuario = usuario;
  next();
}

// Solo cuentas de empresa pueden gestionar salidas.
function requerirEmpresa(req, res, next) {
  if (req.usuario?.rol !== 'empresa') {
    return res.status(403).json({ mensaje: 'Solo las cuentas de empresa pueden gestionar salidas.' });
  }
  next();
}

module.exports = { requerirAuth, requerirEmpresa, leerUsuarios, ARCHIVO_USUARIOS };
