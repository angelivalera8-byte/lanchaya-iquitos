// Seguridad sin dependencias extra: contraseñas con scrypt y tokens firmados HS256 (formato JWT).
const crypto = require('crypto');

const SECRETO = process.env.JWT_SECRET || 'lanchaya-secreto-de-desarrollo-cambialo-en-produccion';
const DURACION_SEG = 60 * 60 * 8; // 8 horas

// ---------- Contraseñas ----------
function hashPassword(password) {
  const sal = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, sal, 64).toString('hex');
  return `${sal}:${hash}`;
}

function verificarPassword(password, guardado) {
  const [sal, hash] = String(guardado).split(':');
  if (!sal || !hash) return false;
  const calculado = crypto.scryptSync(password, sal, 64);
  const original = Buffer.from(hash, 'hex');
  return original.length === calculado.length && crypto.timingSafeEqual(original, calculado);
}

// ---------- Tokens ----------
const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const firmar = (data) => crypto.createHmac('sha256', SECRETO).update(data).digest('base64url');

function crearToken(payload) {
  const cabecera = b64({ alg: 'HS256', typ: 'JWT' });
  const cuerpo = b64({ ...payload, exp: Math.floor(Date.now() / 1000) + DURACION_SEG });
  return `${cabecera}.${cuerpo}.${firmar(`${cabecera}.${cuerpo}`)}`;
}

// Devuelve el payload si el token es válido y no venció; si no, null.
function verificarToken(token) {
  const partes = String(token || '').split('.');
  if (partes.length !== 3) return null;
  const [cabecera, cuerpo, firma] = partes;
  const esperada = firmar(`${cabecera}.${cuerpo}`);
  const a = Buffer.from(firma);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(cuerpo, 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

module.exports = { hashPassword, verificarPassword, crearToken, verificarToken };
