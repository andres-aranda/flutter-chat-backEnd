const {request, response} = require('express');
const { validationResult } = require('express-validator');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const {usuarioConectado} = require('../controller/sockets');

crearUsuario = async (req = request, res = response) => {

const {email,password} = req.body;

    const existeEmail = await Usuario.findOne({email});

    if (existeEmail) {
        return res.status(400).json({
            ok: false,
            msg: 'El correo ya esta registrado'
        });
    }

    const salt = bcrypt.genSaltSync();
    
    const usuario = new Usuario(req.body);

    const token = await generarJWT(usuario.id);

    usuario.password = bcrypt.hashSync(password, salt);



   await usuario.save();
    res.json({
        ok: true,
        usuario,
        msg: 'Usuario creado!!',
        token
    });
}

loginUsuario = async (req = request, res = response) => {

    const {email,password} = req.body;

    try {

        const usuarioDB = await Usuario.findOne
        ({
            email,
        });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }


        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password no valido'
            });
        }

        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

renewToken = async (req = request, res = response) => {

    const uid = req.uid;

    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);

    usuarioConectado(usuario.id);
    
    res.json({
        ok: true,
        usuario,
        token
    });
}
module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken
}