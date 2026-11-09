const { Router } = require('express');
const ctrl = require('../controllers/salidas.controller');
const { requerirAuth, requerirEmpresa } = require('../middleware/auth');

const router = Router();

// Consultar es público: cualquier pasajero puede ver las salidas.
router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);

// Registrar, editar y eliminar requiere iniciar sesión con cuenta de empresa.
router.post('/', requerirAuth, requerirEmpresa, ctrl.crear);
router.put('/:id', requerirAuth, requerirEmpresa, ctrl.actualizar);
router.delete('/:id', requerirAuth, requerirEmpresa, ctrl.eliminar);

module.exports = router;
