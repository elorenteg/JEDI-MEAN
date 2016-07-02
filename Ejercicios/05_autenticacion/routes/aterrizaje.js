var express = require('express');
var log = require('winston');
var async = require('async');
//var router = express.Router();

var userRouter = require('express').Router();

var jwt_secret = require('../config').jwt_secret;
var express_jwt = require('express-jwt');

module.exports = userRouter;

var Nave = require('mongoose').model('Nave');
var Puerto = require('mongoose').model('Puerto');

userRouter.get('/', express_jwt({secret: jwt_secret, requestProperty: 'nave', credentialsRequired: false}), function(req, res, next) {
    if (req.nave) getPuerto(req,res);
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

function getPuerto(req, res) {
    var nave = req.nave
    var peso_nave = nave.peso;
    getPuertoPeso(peso_nave, res);
}

function getPuertoPeso(peso_nave, res) {
    Puerto.findOne({peso_aceptado: peso_nave}, function(error, puerto) {
        if (!error && puerto != undefined) {
            var coordenadas = {coord_x: puerto.coordenada_x, coord_y: puerto.coordenada_y};
            jsonMessage("Info del puerto", coordenadas, res, STATUS_OK);
        }
        else sendMessage("No existe ningun puerto con ese peso", res, STATUS_ERROR);
    })
}