const express = require('express');
const app = express();
let bodyparse = require('body-parser');
// Cargar rutas


// midelware de de body-parser (se ejecuta cuando se hace una peticion se ejecuta antes que me devuelva los datos en el json)

app.use(bodyparse.urlencoded({ extended: false })); //configuracion necesaria para bodyparse
app.use(bodyparse.json); //convierto la respuesta a json usable

// Configurar cabeceras y cors


//rutas body-parser

app.get('/probando', (req, res) => {
    res.status(200).send({ message: 'este es el metodo probando' })
});



exports = apps;