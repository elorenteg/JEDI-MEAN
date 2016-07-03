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

var MAX_DISTANCE = 100; // 500 km

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
    specificRecurso.find({}, function(error, result) {
        if (!error) {
            getPuertas(result,rango,req,res);
        }
        else sendMessage("Error al obtener los recursos", res, STATUS_ERROR);
    });
}

function getPuertas(recursos, rango, req, res) {
    Puerta.find({rangos:rango}, function(error, result) {
        if (!error) {
            recursos = recursos.concat(result);
            Craftworld.findOne({nombre: req.params.nombre_craft}, function(error, craft_user) {
                filterByDistanceI([], recursos, 0, req.params.nombre_craft, craft_user, res);
            });
        }
        else sendMessage("Error al obtener los recursos", res, STATUS_ERROR);
    });
}

function filterByDistanceI(resultat, recursos, i, nombre_craft_user, craft_user, res) {
    if (i == recursos.length) {
        if (resultat.length === 0) sendMessage("No hay ningun Recurso accesible por el Usuario", res, STATUS_ERROR);
        else jsonMessage("Info de los recursos accesible por el Usuario", resultat, res, STATUS_OK);
    }
    else {
        Craftworld.findOne({nombre: recursos[i].craftworld}, function(error, craft_recurs) {
            var dist_crafts = distance(craft_recurs, craft_user);
            if (craft_recurs.craftworld === nombre_craft_user || dist_crafts < MAX_DISTANCE) {
                resultat[resultat.length] = recursos[i];
            }
            filterByDistanceI(resultat, recursos, i+1, nombre_craft_user, craft_user, res);
        });
    }
}

function distance(craft_recurs, craft_user) {
    var lat1 = craft_recurs.coordenada_y, lon1 = craft_recurs.coordenada_x;
    var lat2 = craft_user.coordenada_y, lon2 = craft_user.coordenada_x;
    
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}