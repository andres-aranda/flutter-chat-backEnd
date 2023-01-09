const { validationResult } = require('express-validator');


const validarCampos = ( req, res, next ) => {
    const errors = validationResult( req );
    if ( !errors.isEmpty() ) {
        return res.status(401).json({
            ok: false,
            errors: errors.mapped()
        });
    }
    next();
}
module.exports = {
    validarCampos
}