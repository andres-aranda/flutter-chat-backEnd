/*
    Ruta: /api/usuarios
*/

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-JWT');
const { getUsuarios } = require('../controller/usuarios');

const router = Router();


router.get('/', validarJWT, getUsuarios);

module.exports = router;