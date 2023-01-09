const Usuario = require('../models/usuario');
const { response } = require('express');

const getUsuarios = async (req, res=response ) => {
    const desde = Number(req.query.desde) || 0;
    const [usuarios, total] = await Promise.all([
        Usuario
            .find({ _id: { $ne: req.uid } })
            .skip(desde)
            .limit(20)
            .sort('-online'),
        Usuario.countDocuments()
    ]);
    res.json({
        ok: true,
        usuarios,
        total
    });
}
module.exports = {
    getUsuarios
}