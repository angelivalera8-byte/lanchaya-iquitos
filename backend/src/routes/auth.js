const { Router } = require('express');
const ctrl = require('../controllers/auth.controller');
const { requerirAuth } = require('../middleware/auth');

const router = Router();

router.post('/registro', ctrl.registro);
router.post('/login', ctrl.login);
router.get('/me', requerirAuth, ctrl.me);

module.exports = router;
