const express = require('express');
const path = require('path');
require('dotenv').config();

//App express
const app = express();

//DB config
require('./database/config').dbConnection();

// Node server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/socket');

//Public path 
const publicPath = path.resolve(__dirname, './public');

//Parseo y lectura del body
app.use(express.json());

//My routes
app.use('/api/login', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/mensajes', require('./routes/mensajes'));

app.use(express.static(publicPath));

server.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Listening on port ', process.env.PORT, ' super mega cool');
    }
}); 

