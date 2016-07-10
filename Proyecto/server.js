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
var Tienda = mongoose.model('Tienda');
var Usuario = mongoose.model('Usuario');
var Valoracion = mongoose.model('Valoracion');

var prints = require('./helpers/prints');
var maker = require('./helpers/maker');
var Usuario = mongoose.model('Usuario');

var app = express();
app.use(bodyParser.json());

var adminRouter = require('./routes/admin');
var loginRouter = require('./routes/login');
var registroRouter = require('./routes/registro');
var usuarioRouter = require('./routes/usuario');

app.use('/admin', adminRouter);
app.use('/login', loginRouter);
app.use('/registro', registroRouter);
app.use('/usuario', usuarioRouter);

app.get('/usuarios', function(req, res) {
    maker.getAll(Usuario,req,res);
});

app.all('/*', function(req, res) {
    prints.errorMessage("Ruta invalida", "Ruta invalida", res);
});

http.createServer(app).listen(8080);

//var testing = require('./tests/testing');
