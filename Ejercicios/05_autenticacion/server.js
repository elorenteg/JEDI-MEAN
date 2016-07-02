var http = require('http');
var log = require('winston');
var url = require('url');
var Mongodb = require('mongodb');
var MongoClient = Mongodb.MongoClient;

var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var async    = require('async');

var config = require('./config');
mongoose.connect(config.db_path);

var db = mongoose.connection;
db.on('error', function(err) {
    log.error(err);
});

var models = require('./models');
models.initialize();
var Nave = mongoose.model('Nave');
var Puerto = mongoose.model('Puerto');

var app = express();
app.use(bodyParser.json());

// Importar el modulo que hará de router para las rutas relacionadas con el recurso 'authenticate' o 'aterrizaje'
var authenticateRouter = require('./routes/authenticate');
var aterrizajeRouter = require('./routes/aterrizaje');

// Aquí indicamos que queremos delegar el enrutamiento al tasksRouter cuando la petición empiece por /authenticate o /aterrizaje
app.use('/authenticate', authenticateRouter);
app.use('/aterrizaje', aterrizajeRouter);

app.get('/naves', function(req, res) {
    getAllNaves(res);
});

app.post('/anadirNave', function(req, res) {
    insertNave(req, res);
});

app.post('/anadirPuerto', function(req, res) {
    insertPuerto(req,res);
});

app.all('/*', function(req, res) {
    sendMessage("Ruta invalida", res, STATUS_ERROR);
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

function getAllNaves(res) {
    Nave.find({}, function(error, naves) {
        if (!error && naves.length !== 0) jsonMessage("Info de todas las naves", naves, res, STATUS_OK);
        else sendMessage("No existe ninguna nave", res, STATUS_ERROR);
    })
}

function insertNave(req, res) {
    var nave_data = req.body;
    var new_nave = new Nave(nave_data);
    
    new_nave.save(function(error, nave) {
        if (!error) jsonMessage("Nave añadida", nave, res, STATUS_OK);
        else sendMessage("Error al añadir la nave", res, STATUS_ERROR);
    })
}

function insertPuerto(req, res) {
    var puerto_data = req.body;
    var new_puerto = new Puerto(puerto_data);
    
    new_puerto.save(function(error, puerto) {
        if (!error) jsonMessage("Puerto añadido", puerto, res, STATUS_OK);
        else sendMessage("Error al añadir el puerto", res, STATUS_ERROR);
    })
}
