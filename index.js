const express = require('express');
const app = express();
var bodyParser = require('body-parser')
let user_routes = require('./routes/user');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
mongoose.Promise = global.Promise;

// midelware de de body-parser (se ejecuta cuando se hace una peticion se ejecuta antes que me devuelva los datos en el json)
app.use(bodyParser.json()) //convierto la respuesta a json usable
app.use(bodyParser.urlencoded({ extended: true })) //configuracion necesaria para bodyparse

mongoose.connect('mongodb://localhost:27017/zooDb', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('conexion a la base de datos zooDb se realizo con exito');
        app.listen(PORT, () => console.log('Server running on port 3000'));
    })
    .catch(err => console.log(err));


// rutas base
app.use('/api', user_routes);