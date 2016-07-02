var express = require('express');
var log = require('winston');
var router = express.Router();

module.exports = router;

// Necesitamos obtener el secret para poder generar el token
var secret = require('../config').jwt_secret;
var authRouter = require('express').Router();

// Este módulo lo utilizaremos para generar el token
var jwt = require('jsonwebtoken');

var Nave = require('mongoose').model('Nave');
var Puerto = require('mongoose').model('Puerto');

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
    var identificador = req.body.identificador;
    var codigo_seguridad = (req.body.codigo_seguridad);

    Nave.findOne({ identificador: identificador }, function(err, nave) {
        if (err) res.status(500).send(err);

        if (!nave) res.status(401).send('No se ha encontrado la nave');
        else {
            // Comprobamos las contraseñas
            if (nave.codigo_seguridad !== codigo_seguridad) {
                res.status(401).send('Codigo de seguridad incorrecto');
            } else {
                // Generamos el token con el modulo jwt
                var token = jwt.sign(nave.toObject(), secret, {
                    expiresInMinutes: 1440 // Este token expirará en 24h
                });

                // Le enviamos el token al cliente
                res.json({ token: token });
            }
        }
    });
}