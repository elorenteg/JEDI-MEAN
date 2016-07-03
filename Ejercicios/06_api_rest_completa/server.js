var http = require('http');
var log = require('winston');
var url = require('url');
var Mongodb = require('mongodb');
var MongoClient = Mongodb.MongoClient;

var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');

var config = require('./config');
mongoose.connect(config.db_path);
var db = mongoose.connection;
db.on('error', function(err) {
    log.error(err);
});

var models = require('./models');
models.initialize();
var Libro = mongoose.model('Libro');
var Arma = mongoose.model('Arma');
var Puerta = mongoose.model('Puerta');
var Usuario = mongoose.model('Usuario');
var Craftworld = mongoose.model('Craftworld');

var app = express();
app.use(bodyParser.json());

var adminRouter = require('./routes/admin');
var loginRouter = require('./routes/login');
var usuarioRouter = require('./routes/usuario');

app.use('/admin', adminRouter);
app.use('/login', loginRouter);
app.use('/usuario', usuarioRouter);

var makerCraftworld = require('./helpers/makerCraftworld');
var makerRecursos = require('./helpers/makerRecurso');
var makerUsuarios = require('./helpers/makerUsuario');

app.get('/craftworlds', function(req, res) {
    makerCraftworld.getAll(req,res);
});

app.get('/usuarios', function(req, res) {
    Usuario.find({}, function(error, usuarios) {
        if (!error && usuarios.length > 0) jsonMessage("Info de todos los Usuarios", usuarios, res, STATUS_OK);
        else sendMessage("No existe ningun Usuario", res, STATUS_ERROR);
    });
});

app.post('/registrarUsuario', function(req, res) {
    if (req.body.craftworld) {
        req.params.nombre_craft = req.body.craftworld;
        makerUsuarios.insert(req,res);
    }
    else sendMessage("No se ha indicado el Craftworld", res, STATUS_ERROR);
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