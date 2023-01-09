const {io}= require('../index');
const {comprobarJWT} = require('../helpers/jwt');
const {usuarioConectado, usuarioDesconectado ,grabarMensaje} = require('../controller/sockets');
const {obtenerChat} = require('../controller/mensajes');

// Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    const token = client.handshake.headers['x-token'];

    const [valido, uid] = comprobarJWT(token);

    if (!valido) { return client.disconnect(); }

    // Cliente autenticado
    usuarioConectado(uid);

    // Ingresar al usuario a una sala en particular
    client.join(uid);

    // Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async (payload) => {

        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal', payload);

    });


    client.on('disconnect', () => { 
        usuarioDesconectado(uid);
        console.log('Cliente desconectado');
        });
});
