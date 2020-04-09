//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controlador=require("../servidor/controladores/controlador");

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());
app.use(bodyParser.json());

app.get("/peliculas",controlador.todasLasPeliculas);
app.get('/generos', controlador.cargarGenero);
app.get('/peliculas/recomendacion', controlador.recomendadas);
app.get('/peliculas/:id', controlador.peliculaId);

app.use(bodyParser.json());

// seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function() {
    console.log("Escuchando pedidos en el puerto " + puerto);
});

