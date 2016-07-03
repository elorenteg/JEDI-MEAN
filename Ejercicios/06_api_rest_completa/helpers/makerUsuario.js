var log = require('winston');
var bcrypt = require('bcrypt');

var Usuario = require('mongoose').model('Usuario');
var Craftworld = require('mongoose').model('Craftworld');

module.exports = {
    
    getAll: function (req, res) {
        checkCraftworldAndNext(req,res,getAllUsuarios);
    },
    
    get: function (req, res) {
        checkCraftworldAndNext(req,res,getUsuario);
    },
    
    insert: function (req, res) {
        checkCraftworldAndNext(req,res,insertUsuario);
    },
    
    update: function (req, res) {
        checkCraftworldAndNext(req,res,updateUsuario);
    },
    
    remove: function (req, res) {
        checkCraftworldAndNext(req,res,removeUsuario);
    }
}

function checkCraftworldAndNext(req, res, userFunction) {
    Craftworld.findOne({nombre: req.params.nombre_craft}, function(error, craftworld) {
        if (!error && craftworld) userFunction(req,res);
        else sendMessage("No existe ningun Craftworld con ese nombre", res, STATUS_ERROR);
    })
}

function getAllUsuarios(req, res) {
    Usuario.find({craftworld:req.params.nombre_craft}, function(error, usuarios) {
        if (!error && usuarios.length > 0) jsonMessage("Info de todos los Usuarios", usuarios, res, STATUS_OK);
        else sendMessage("No existe ningun Usuario en ese CraftWorld", res, STATUS_ERROR);
    });
}

function getUsuario(req, res) {
    Usuario.findOne({craftworld:req.params.nombre_craft,nombre:req.params.nombre_model}, function(error, usuario) {
        if (!error && usuario) jsonMessage("Info de un Usuario", usuario, res, STATUS_OK);
        else sendMessage("No existe ningun Usuario en ese CraftWorld con ese nombre", res, STATUS_ERROR);
    });
}

function insertUsuario(req, res) {
    Usuario.findOne({craftworld:req.params.nombre_craft,nombre:req.body.nombre}, function(error, usuario) {
        if (!error && usuario) sendMessage("Ya existe un Usuario con ese nombre en ese Craftworld", res, STATUS_OK);
        else {
            if (req.body.codigo_acceso) encryptAndNext(req,res,insertModel);
            else sendMessage("No se ha indicado un código de acceso", res, STATUS_ERROR);
        }
    })
}

function updateUsuario(req, res) {
    if (req.body.craftworld) sendMessage("No se puede cambiar de Craftworld", res, STATUS_ERROR);
    else {
        var info = {craftworld:req.params.nombre_craft,nombre:req.params.nombre_model};
        if (req.body.nombre) info.nombre = req.body.nombre;
        log.info(info);
        Usuario.findOne(info, function(error, usuario) {
            if (!error && !usuario) {
                if (req.body.codigo_acceso) encryptAndNext(req,res,updateModel);
                else updateModel(req,res)
            }
            else sendMessage("Ya existe un Usuario con ese nombre en ese Craftworld", res, STATUS_OK);
        });
    }
}

function removeUsuario(req, res) {
    Usuario.findOneAndRemove({craftworld:req.params.nombre_craft,nombre:req.params.nombre_model}, function(error, usuario) {
        if (!error) {
            updatePoblacion(usuario,-1,req,res);
        }
        else sendMessage("Error al eliminar el Usuario en ese CraftWorld", res, STATUS_ERROR);
    });
}

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

function encryptAndNext(req,res,userFunction) {
    bcrypt.hash(req.body.codigo_acceso, 12, function(error, hash) {
        if (error) sendMessage("Error al encriptar el código de acceso", res, STATUS_ERROR);
        else {
            req.body.codigo_acceso = hash;
            userFunction(req,res)
        }
    });
}

function insertModel(req, res) {
    req.body.craftworld = req.params.nombre_craft;
    
    new Usuario(req.body).save(function(error, usuario) {
        if (!error && usuario) {
            updatePoblacion(usuario,1,req,res);
        }
        else sendMessage("Error al añadir el Usuario en ese CraftWorld", res, STATUS_ERROR);
    });
}

function updateModel(req, res) {
    Usuario.findOneAndUpdate({craftworld:req.params.nombre_craft,nombre:req.params.nombre_model}, req.body, {'new': true}, function(error, usuario) {
        if (!error) jsonMessage("Usuario actualizado", usuario, res, STATUS_OK);
        else sendMessage("Error al actualizar el Usuario en ese CraftWorld", res, STATUS_ERROR);
    });
}

function updatePoblacion(usuario, inc, req, res) {
    Craftworld.findOne({nombre:req.params.nombre_craft}, function(error, craftworld) {
        if (!error && craftworld) {
            var poblacion = craftworld.poblacion + inc;
            
            Craftworld.findOneAndUpdate({nombre:req.params.nombre_craft}, {poblacion:poblacion}, {'new': true}, function(error, result) {
                if (!error) {
                    log.info("Población del Craftworld actualizado");
                    if (inc > 0) jsonMessage("Usuario añadido", usuario, res, STATUS_OK);
                    else sendMessage("Usuario borrado", res, STATUS_OK);
                    
                }
                else sendMessage("Error al actualizar la población del CraftWorld", res, STATUS_ERROR);
            });
        }
        else sendMessage("No existe ningun Craftworld con ese nombre", res, STATUS_ERROR);
    });
}