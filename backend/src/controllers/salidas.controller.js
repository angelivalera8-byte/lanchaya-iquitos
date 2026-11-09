const fs = require('fs');
const path = require('path');

const ARCHIVO = path.join(__dirname, '..', 'data', 'salidas.json');
const TIPOS = ['lancha', 'rapido', 'deslizador'];

const leer = () => JSON.parse(fs.readFileSync(ARCHIVO, 'utf8'));
const guardar = (datos) => fs.writeFileSync(ARCHIVO, JSON.stringify(datos, null, 2));

const esTexto = (v) => typeof v === 'string' && v.trim() !== '';
const esNumeroValido = (v) => v !== '' && v !== null && v !== undefined && Number.isFinite(Number(v));

/**
 * Valida el cuerpo de la petición. Devuelve un arreglo de mensajes (vacío si todo está bien).
 * Regla "no en el pasado": se aplica al registrar y, al editar, solo si la fecha cambió.
 */
function validar(body, original = null) {
  const errores = [];

  for (const campo of ['empresa', 'destino', 'puerto', 'fechaHora']) {
    if (!esTexto(body[campo])) errores.push(`El campo "${campo}" es obligatorio.`);
  }

  if (!esNumeroValido(body.precio) || Number(body.precio) <= 0) {
    errores.push('El precio debe ser un número mayor que 0.');
  }

  if (!TIPOS.includes(body.tipo)) {
    errores.push(`El tipo debe ser uno de: ${TIPOS.join(', ')}.`);
  }

  if (esTexto(body.fechaHora)) {
    const fecha = new Date(body.fechaHora);
    if (Number.isNaN(fecha.getTime())) {
      errores.push('fechaHora no es válida. Usa formato ISO 8601, por ejemplo 2026-11-09T06:30.');
    } else {
      const cambio = !original || original.fechaHora !== body.fechaHora;
      if (cambio && fecha < new Date()) errores.push('La fecha y hora de salida no puede estar en el pasado.');
    }
  }

  for (const campo of ['duracionHoras', 'cupos']) {
    if (body[campo] !== undefined && body[campo] !== '' && (!esNumeroValido(body[campo]) || Number(body[campo]) < 0)) {
      errores.push(`El campo "${campo}" debe ser un número mayor o igual a 0.`);
    }
  }

  return errores;
}

function normalizar(body) {
  return {
    empresa: body.empresa.trim(),
    embarcacion: esTexto(body.embarcacion) ? body.embarcacion.trim() : '',
    tipo: body.tipo,
    destino: body.destino.trim(),
    puerto: body.puerto.trim(),
    fechaHora: body.fechaHora.trim(),
    duracionHoras: esNumeroValido(body.duracionHoras) ? Number(body.duracionHoras) : 0,
    precio: Number(body.precio),
    cupos: esNumeroValido(body.cupos) ? Number(body.cupos) : 0,
  };
}

const quitarTildes = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// GET /api/salidas?destino=&fecha=&tipo=&q=
exports.listar = (req, res) => {
  const { destino, fecha, tipo, q } = req.query;
  let salidas = leer();

  if (destino) salidas = salidas.filter((s) => quitarTildes(s.destino) === quitarTildes(destino));
  if (fecha) salidas = salidas.filter((s) => s.fechaHora.startsWith(fecha)); // fecha = YYYY-MM-DD
  if (tipo) salidas = salidas.filter((s) => s.tipo === tipo);
  if (q) {
    const busca = quitarTildes(q);
    salidas = salidas.filter((s) => quitarTildes(`${s.empresa} ${s.embarcacion}`).includes(busca));
  }

  salidas.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));
  res.status(200).json(salidas);
};

// GET /api/salidas/:id
exports.obtener = (req, res) => {
  const salida = leer().find((s) => s.id === Number(req.params.id));
  if (!salida) return res.status(404).json({ mensaje: 'Salida no encontrada.' });
  res.status(200).json(salida);
};

// POST /api/salidas
exports.crear = (req, res) => {
  // La empresa siempre es la de la cuenta que inició sesión.
  req.body = { ...(req.body || {}), empresa: req.usuario.empresa };
  const errores = validar(req.body);
  if (errores.length) return res.status(400).json({ mensaje: errores[0], errores });

  const salidas = leer();
  const id = salidas.reduce((max, s) => Math.max(max, s.id), 0) + 1;
  const nueva = { id, ...normalizar(req.body) };
  salidas.push(nueva);
  guardar(salidas);
  res.status(201).json(nueva);
};

// PUT /api/salidas/:id
exports.actualizar = (req, res) => {
  const salidas = leer();
  const indice = salidas.findIndex((s) => s.id === Number(req.params.id));
  if (indice === -1) return res.status(404).json({ mensaje: 'Salida no encontrada.' });

  // Se conserva la empresa original de la salida.
  req.body = { ...(req.body || {}), empresa: salidas[indice].empresa };
  const errores = validar(req.body, salidas[indice]);
  if (errores.length) return res.status(400).json({ mensaje: errores[0], errores });

  salidas[indice] = { id: salidas[indice].id, ...normalizar(req.body) };
  guardar(salidas);
  res.status(200).json(salidas[indice]);
};

// DELETE /api/salidas/:id
exports.eliminar = (req, res) => {
  const salidas = leer();
  const indice = salidas.findIndex((s) => s.id === Number(req.params.id));
  if (indice === -1) return res.status(404).json({ mensaje: 'Salida no encontrada.' });

  salidas.splice(indice, 1);
  guardar(salidas);
  res.status(204).send();
};

// GET /api/destinos
exports.destinos = (req, res) => {
  const destinos = [...new Set(leer().map((s) => s.destino))].sort((a, b) => a.localeCompare(b, 'es'));
  res.status(200).json(destinos);
};
