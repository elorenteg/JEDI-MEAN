var express = require('express');
var log = require('winston');
var router = express.Router();
var mongoose = require('mongoose');

module.exports = router;

var jwt_secret = require('../config').jwt_secret;
var express_jwt = require('express-jwt');
var bcrypt = require('bcrypt');

var Libro = require('mongoose').model('Libro');
var Arma = require('mongoose').model('Arma');
var Puerta = require('mongoose').model('Puerta');
var Usuario = require('mongoose').model('Usuario');
var Craftworld = require('mongoose').model('Craftworld');

var makerRecursos = require('../helpers/makerRecurso');

router.get('/recursos', express_jwt({secret: jwt_secret, requestProperty: 'usuario', credentialsRequired: false}), function(req, res) {
    if (req.usuario) {
        var rango = req.usuario.rango;
        req.params.nombre_craft = req.usuario.craftworld;
        if (rango === "brujo") getRecursos(Libro,rango,req,res);
        else if (rango === "soldado") getRecursos(Arma,rango,req,res);
        else getPuertas([],rango, req, res);
    }
    else sendMessage('No tienes acceso a este recurso!', res, STATUS_ERROR);
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

function getRecursos(specificRecurso, rango, req, res) {
    specificRecurso.find({craftworld:req.params.nombre_craft}, function(error, result) {
        if (!error) getPuertas(result,rango,req,res);
        else sendMessage("Error al obtener los recursos", res, STATUS_ERROR);
    });
}

function getPuertas(recursos, rango, req, res) {
    Puerta.find({craftworld:req.params.nombre_craft, rangos:rango}, function(error, result) {
        if (!error) {
            recursos = recursos.concat(result);
            if (recursos.length === 0) sendMessage("No hay ningun Recurso accesible por el Usuario de rango " +  rango, res, STATUS_ERROR);
            else jsonMessage("Info de los recursos accesible por el Usuario de rango " + rango, recursos, res, STATUS_OK);
        }
        else sendMessage("Error al obtener los recursos", res, STATUS_ERROR);
    });
}