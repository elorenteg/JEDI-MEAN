var log = require('winston');
var router = require('express').Router();
var mongoose = require('mongoose');

var bcrypt = require('bcrypt');
var secret = require('../config').jwt_secret;
var jwt = require('jsonwebtoken');

module.exports = router;

var Usuario = require('mongoose').model('Usuario');

var makerRecursos = require('../helpers/makerUsuario');

router.post('/', function(req, res) {
    authenticate(req,res);
});

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

function authenticate(req, res) {
    var nombre = req.body.nombre;
    var craftworld = req.body.craftworld;
    var codigo_acceso = req.body.codigo_acceso;
    
    Usuario.findOne({ nombre: nombre, craftworld: craftworld }, function(error, usuario) {
        if (!error && usuario) {
            bcrypt.compare(codigo_acceso, usuario.codigo_acceso, function(error, result) {
                if (!error) {
                    // Informacion que queremos en el token
                    var signed = {
                        nombre: usuario.nombre,
                        codigo_acceso: usuario.codigo_acceso,
                        craftworld: usuario.craftworld,
                        rango: usuario.rango
                    };
                    
                    var token = jwt.sign(signed, secret, {
                        expiresIn: 24*60*60 // Este token expirará en 24h
                    });
                    jsonMessage("Login correcto", { token: token }, res, STATUS_OK);
                }
                else sendMessage("Codigo de acceso incorrecto", res, STATUS_ERROR);
            })
        }
        else sendMessage("No existe ningun Usuario en ese Craftworld con ese nombre", res, STATUS_ERROR);
    });
}