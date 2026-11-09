const express = require('express');
const cors = require('cors');
const salidasRouter = require('./routes/salidas');
const authRouter = require('./routes/auth');
const ctrl = require('./controllers/salidas.controller');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/salidas', salidasRouter);
app.get('/api/destinos', ctrl.destinos);

// Ruta inexistente
app.use((req, res) => {
  res.status(404).json({ mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Middleware de manejo de errores (siempre al final)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido.' });
  }
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor.' });
});

app.listen(PORT, () => console.log(`LanchaYa API escuchando en http://localhost:${PORT}`));
