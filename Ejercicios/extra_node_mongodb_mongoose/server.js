var http = require('http');
var log = require('winston');
var url = require('url');
var Mongodb = require('mongodb');
var MongoClient = Mongodb.MongoClient;

var mongoose = require('mongoose');
var async    = require('async');

var models = require('./models');

mongoose.connect('mongodb://localhost/example_mongoose');
models.initialize();

var db = mongoose.connection;
db.on('error', function(err) {
    log.error(err);
});

function infoMessage(mss, res) {
    res.end(mss);
    log.info(mss);
}


var Asignatura = mongoose.model('Asignatura');
var Alumno = mongoose.model('Alumno');
var Profesor = mongoose.model('Profesor');


// Operacions Asignatura

function insertAsignatura(info, res) {
    var asig_instance = new Asignatura(info);
    asig_instance.save(function(error, result) {
        if (!error) infoMessage("Asignatura insertada correctament\n" + JSON.stringify(result), res);
        else infoMessage("Asignatura invàlida", res);
    })
}

function getAsignatura(info, res) {
    Asignatura.find(info, function(error, result) {
        if (!error) infoMessage("Asignatura cercada correctament\n" + JSON.stringify(result), res);
        else infoMessage("Asignatura invàlida", res);
    })
}

function deleteAsignatura(info, res) {
    Asignatura.remove(info, function(error, result) {
        if (!error) infoMessage("Asignatura borrada correctament\n" + JSON.stringify(result), res);
        else infoMessage("Asignatura invàlida", res);
    })
}

// Operacions Alumno

function insertAlumno(info, res) {
    var alumn_instance = new Alumno(info);
    alumn_instance.save(function(error, result) {
        if (!error) infoMessage("Alumno insertada correctament", res);
        else infoMessage("Alumno invàlida", res);
    })
}

function getAlumno(info, res) {
    Alumno.find(info, function(error, result) {
        if (!error) infoMessage("Alumno cercada correctament\n" + JSON.stringify(result), res);
        else infoMessage("Alumno invàlida", res);
    })
}

function deleteAlumno(info, res) {
    Alumno.remove(info, function(error, result) {
        if (!error) infoMessage("Alumno borrada correctament", res);
        else infoMessage("Alumno invàlida", res);
    })
}

// Operacions Profesor

function insertProfesor(info, res) {
    var profe_instance = new Profesor(info);
    profe_instance.save(function(error, result) {
        if (!error) infoMessage("Profesor insertada correctament", res);
        else infoMessage("Profesor invàlida", res);
    })
}

function getProfesor(info, res) {
    Profesor.find(info, function(error, result) {
        if (!error) infoMessage("Profesor cercada correctament\n" + JSON.stringify(result), res);
        else infoMessage("Profesor invàlida", res);
    })
}

function deleteProfesor(info, res) {
    var Profesor = mongoose.model('Profesor');
    Profesor.remove(info, function(error, result) {
        if (!error) infoMessage("Profesor borrada correctament", res);
        else infoMessage("Profesor invàlida", res);
    })
}




function checkConnectedToDB(res) {
    var connected = db !== null;
    if (!connected) res.end("Not yet connected to database");
    return connected;
}

function checkUrlPath(path, res) {
    var isCorrect = ['/asignatura', '/alumno', '/profesor'].indexOf(path) != -1;
    if (!isCorrect) res.end("Wrong url!");
    return isCorrect;
}

http.createServer(function(req, res) {
    
    //Funciones para comprobar que estamos conectados a la BD 
    //y que la url es valida
    if (!checkConnectedToDB(res)) return false;
    var parsedUrl = url.parse(req.url, true);
    if (!checkUrlPath(parsedUrl.pathname, res)) return false;
                  

    switch(parsedUrl.pathname) {
        case '/asignatura':
            switch (req.method) {
                case 'POST':
                    insertAsignatura(parsedUrl.query, res);
                    break;
                case 'GET':
                    getAsignatura(parsedUrl.query, res);
                    break;
                case 'DELETE':
                    deleteAsignatura(parsedUrl.query, res);
                    break;
                default: res.end("Invalid method!");
            }
            break;
            
        case '/alumno':
            switch (req.method) {
                case 'POST':
                    insertAlumno(parsedUrl.query, res);
                    break;
                case 'GET':
                    getAlumno(parsedUrl.query, res);
                    break;
                case 'DELETE':
                    deleteAlumno(parsedUrl.query, res);
                    break;
                default: res.end("Invalid method!");
            }
            break;
            
        case '/profesor':
            switch (req.method) {
                case 'POST':
                    insertProfesor(parsedUrl.query, res);
                    break;
                case 'GET':
                    getProfesor(parsedUrl.query, res);
                    break;
                case 'DELETE':
                    deleteProfesor(parsedUrl.query, res);
                    break;
                default: res.end("Invalid method!");
            }
            break;
    }
    

    return true;
}).listen(8080);
