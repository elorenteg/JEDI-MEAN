var express = require('express');
var log = require('winston');
var router = express.Router();
var mongoose = require('mongoose');

var jwt_secret = require('../config').jwt_secret;
var express_jwt = require('express-jwt');
var bcrypt = require('bcrypt');

module.exports = router;

var Libro = mongoose.model('Libro');
var Arma = mongoose.model('Arma');
var Puerta = mongoose.model('Puerta');
var Usuario = mongoose.model('Usuario');
var Craftworld = mongoose.model('Craftworld');

var makerCraftworld = require('../helpers/makerCraftworld');
var makerRecursos = require('../helpers/makerRecurso');
var makerUsuarios = require('../helpers/makerUsuario');

mongoose.connection.once('open', function() {
    initGlobalAdmin();
});

router.use('/', express_jwt({secret: jwt_secret, requestProperty: 'usuario', credentialsRequired: false}), function(req, res, next) {
    if (req.usuario && req.usuario.rango === 'admin') next();
    else sendMessage('No tienes acceso a este recurso!', res, STATUS_ERROR);
});

router.post('/craftworld', function(req, res) {
    makerCraftworld.insert(req,res);
});

router.patch('/craftworld/:nombre_craft/promocionar/:nombre_model', function(req, res) {
    promoteEldar(req,res);
});

var crudRecursosMaker = require('../helpers/crudRecurso');

router.use('/', crudRecursosMaker(mongoose.model('Libro'), 'Libro', 'craftworlds'));
router.use('/', crudRecursosMaker(mongoose.model('Arma'), 'Arma', 'craftworlds'));
router.use('/', crudRecursosMaker(mongoose.model('Puerta'), 'Puerta', 'craftworlds'));

//router.use('/', crudUsuariosMaker('craftworlds'));

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

function promoteEldar(req,res) {
    Usuario.findOne({craftworld:req.params.nombre_craft,nombre:req.params.nombre_model}, function(error, usuario) {
        if (!error && usuario) {
            var rango = usuario.rango;
            if (rango === 'brujo' || rango === 'soldado') {
                var rangos = ['brujo','soldado','comandante'];
                var ind = rangos.indexOf(rango);
                var info = {
                    craftworld: req.params.nombre_craft,
                    nombre: req.params.nombre_model
                }
                rango = rangos[ind+1];
                updateRango(info,rango,req,res);
            }
            else sendMessage("El Usuario no se puede promocionar", res, STATUS_ERROR);
        }
        else sendMessage("No existe ningun Usuario en ese CraftWorld con ese id", res, STATUS_ERROR);
    });
}

function updateRango(info, rango, req, res) {
    Usuario.findOneAndUpdate(info, {rango: rango}, {new: true}, function(error, usuario) {
        if (!error) jsonMessage("Rango del Usuario en ese Craftworld actualizado", usuario, res, STATUS_OK);
        else sendMessage("Error al actualizar el rango del Usuario en ese CraftWorld", res, STATUS_ERROR);
    });
}

function initGlobalAdmin() {
    var admin = {
        nombre: "admin",
        rango: "admin",
        codigo_acceso: "12345"
    }
    
    Usuario.findOne({nombre: admin.nombre, rango: admin.rango}, function(error, usuario) {
        if (!error && !usuario) {
            bcrypt.hash(admin.codigo_acceso, 12, function(error, hash) {
                if (error) sendMessage("Error al encriptar el código de acceso", res, STATUS_ERROR);
                else {
                    admin.codigo_acceso = hash;
                    new Usuario(admin).save(function(error, usuario) {
                        if (!error && usuario) log.info("Admin global creado");
                        else log.info("Error al crear el Admin global");
                    });
                }
            });
        }
        else log.info("Admin global ya estaba creado");
    });
}