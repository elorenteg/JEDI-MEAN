var http = require('http');
var log = require('winston');
var url = require('url');
var Mongodb = require('mongodb');
var MongoClient = Mongodb.MongoClient;

var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var async    = require('async');

mongoose.connect('mongodb://localhost/ejercicio_04');

var db = mongoose.connection;
db.on('error', function(err) {
    log.error(err);
});

var models = require('./models');
models.initialize();
var Producto = mongoose.model('Producto');
var Usuario = mongoose.model('Usuario');

var app = express();
app.use(bodyParser.json());

// Importar el modulo que hará de router para las rutas relacionadas con el recurso 'usuario' o 'task'
var usuarioRouter = require('./routes/usuario');
var adminRouter = require('./routes/admin');

// Aquí indicamos que queremos delegar el enrutamiento al tasksRouter cuando la petición empiece por /usuario o /admin
app.use('/usuario', usuarioRouter);
app.use('/admin', adminRouter);

app.get('/productos', function(req, res) {
    getAllProductos(res);
});

app.get('/producto/:id_prod', function(req, res) {
    getProducto(req,res);
});

app.post('/registrarUsuario', function(req, res) {
    registerUsuario(req,res);
});

app.get('/*', function(req, res) {
    sendMessage("GET invalido", res, STATUS_ERROR);
});

app.post('/*', function(req, res) {
    sendMessage("POST invalido", res, STATUS_ERROR);
});

app.delete('/*', function(req, res) {
    sendMessage("DELETE invalido", res, STATUS_ERROR);
});

app.patch('/*', function(req, res) {
    sendMessage("PATCH invalido", res, STATUS_ERROR);
});

http.createServer(app).listen(8080);

///////////////////////////////////////////////////////////////////////////////

var STATUS_OK = 200;
var STATUS_ERROR = 500;

function sendMessage(mss, res, nstatus) {
    res.status(nstatus).send(mss);
    log.info(mss);
}

function jsonMessage(mss, json, res, nstatus) {
    res.status(nstatus).json(json);
    log.info(mss);
}

function getAllProductos(res) {
    Producto.find({}, function(error, result) {
        if (!error && result.length !== 0) jsonMessage("Info de todos los productos", result, res, STATUS_OK);
        else sendMessage("No existe ningun producto", res, STATUS_ERROR);
    })
}

function getProducto(req, res) {
    var info = req.params.id_prod;
    
    Producto.findById(info, function(error, result) {
        if (!error) jsonMessage("Info de un producto", result, res, STATUS_OK);
        else sendMessage("No existe ningun producto con ese _id", res, STATUS_ERROR);
    })
}

function registerUsuario(req, res) {
    var user_data = req.body;
    var new_user = new Usuario(user_data);
    
    new_user.save(function(error, result) {
        if(!error) jsonMessage("Usuario registrado correctamente", result, res, STATUS_OK);
        else sendMessage("Error al añadir el usuario", res, STATUS_ERROR);
    })
}
