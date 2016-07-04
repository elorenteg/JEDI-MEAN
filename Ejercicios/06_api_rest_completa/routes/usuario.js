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

var MAX_DISTANCE = 100; // 100 km
var MODELS = [Libro, Arma, Puerta];
var LIBRO = 0;
var ARMA = 1;
var PUERTA = 2;

router.use('/', express_jwt({secret: jwt_secret, requestProperty: 'usuario', credentialsRequired: false}), function(req, res, next) {
    if (req.usuario) {
        Usuario.findOne({nombre: req.usuario.nombre, craftworld: req.usuario.craftworld}, function(error, usuario) {
            if (!error) {
                req.usuario = usuario;
                next();
            }
            else sendMessage("Error de usuario", res, STATUS_OK);
        });
    }
    else sendMessage('No tienes acceso a este recurso!', res, STATUS_ERROR);
});

router.get('/', function(req, res) {
    jsonMessage('Info de su usuario', req.usuario, res, STATUS_ERROR);
});

router.get('/recursos', function(req, res) {
    var rango = req.usuario.rango;
    req.params.nombre_craft = req.usuario.craftworld;
           
    getAllResources([], 0, req, res);
});

router.get('/libro/:id_model', function(req, res) {
    obtainRecurso(Libro, LIBRO, req, res);
});

router.get('/arma/:id_model', function(req, res) {
    obtainRecurso(Arma, ARMA, req, res);
});

router.get('/puerta/:id_model', function(req, res) {
    obtainRecurso(Puerta, PUERTA, req, res);
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

function getAllResources(recursos, i, req, res) {
    if (i === MODELS.length) {
        if (req.usuario.rango === "admin" && !req.usuario.craftworld) {
            filterByDistanceI(recursos, recursos, recursos.length, [], [], res);
        }
        else {
            Craftworld.findOne({nombre: req.usuario.craftworld}, function(error, craft_user) {
                filterByDistanceI([], recursos, 0, req.params.nombre_craft, craft_user, res);
            });
        }
    }
    else {
        var info = {};
        var rango = req.usuario.rango;
        var canAccess = canAccessModel(rango, i);
        if (canAccess) {
            var info = infoAccessModel(rango, i);
            MODELS[i].find(info, function(error, result) {
                if (!error) {
                    recursos = recursos.concat(result);
                    getAllResources(recursos, i+1, req, res);
                }
                else sendMessage("Error al obtener los recursos", res, STATUS_ERROR);
            });
        }
        else {
            getAllResources(recursos, i+1, req, res);
        }
    }
}

function canAccessModel(rango, i) {
    if (rango === "admin") return true;
    else if (rango === "brujo" && (i === LIBRO || i === PUERTA)) return true;
    if (rango === "soldado" && (i === ARMA || i === PUERTA)) return true;
    return false;
}

function infoAccessModel(rango, i) {
    if (i === PUERTA && rango !== "admin") return {rango: rango};
    return {};
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

///////////////////////////////////////////////////////////////////////////////

function obtainRecurso(model, i, req, res) {
    model.findById(req.params.id_model, function(error, recurso) {
        if (!error && recurso) {
            if (req.usuario.rango === "admin" && !req.usuario.craftworld) {
                checkRecurso(recurso, i, req, res);
            }
            else {
                Craftworld.findOne({nombre: req.usuario.craftworld}, function(error, craft_user) {
                    Craftworld.findOne({nombre: recurso.craftworld}, function(error, craft_recurs) {
                        if (canAccessModel(req.usuario.rango, i) && 
                            (i !== PUERTA || (i === PUERTA && (rango === "brujo" || rango === "soldado") && (rango in recurso.rangos)))) {
                            if (distance(craft_recurs, craft_user) < MAX_DISTANCE)
                                checkRecurso(recurso, i, req, res);
                        }
                        else sendMessage("No Tiene acceso a este " + modelName(i), res, STATUS_OK);
                    });
                });
            }
        }
        else sendMessage("No existe ningun " + modelName(i) + " con ese id", res, STATUS_ERROR);
    });
}

function modelName(i) {
    if (i === LIBRO) str = "Libro";
    else if (i === ARMA) str = "Arma";
    else str = "Puerta";
    return(str);
}

function checkRecurso(recurso, i, req, res) {
    Usuario.findOne({nombre: req.usuario.nombre, craftworld: req.usuario.craftworld, recursos: recurso._id}, function(error, usuario) {
        if (!error && usuario) modifyStock(true, recurso, i, req, res);
        else {
            var stock = recurso.stock;
            if (stock === 0) sendMessage("No hay stock de este " + modelName(i), res, STATUS_ERROR);
            else modifyStock(false, recurso, i, req, res);
        }
    });
}

function modifyStock(isReturning, recurso, i, req, res) {
    var recursos = req.usuario.recursos;
    var incStock = -1;
    if (isReturning) {
        incStock = 1;
        var trobat = false;
        var new_recursos = []
        for (k = 0; k < recursos.length && !trobat; ++k) {
            if (JSON.stringify(recursos[k]) !== JSON.stringify(recurso._id)) 
                new_recursos[new_recursos.length] = recursos[k];
        }
        recursos = new_recursos;
    }
    else recursos[recursos.length] = recurso._id;
    
    Usuario.findOneAndUpdate({nombre: req.usuario.nombre, craftworld: req.usuario.craftworld}, {recursos: recursos}, {new: true}, function(error, usuario) {
        if (!error) {
            MODELS[i].findByIdAndUpdate(recurso._id, {stock: recurso.stock + incStock}, {new: true}, function(error, recurso) {
                if (!error) {
                    jsonMessage("Stock Actualizado", [recurso, usuario], res, STATUS_OK);
                }
                else sendMessage("Error al actualizar el stock del " + modelName(i), res, STATUS_ERROR);
            });
        }
        else sendMessage(error, res, STATUS_ERROR);
    });
}