var log = require('winston');
var bcrypt = require('bcrypt');

var Craftworld = require('mongoose').model('Craftworld');

module.exports = {
    
    getAll: function (model, modelName, req, res) {
        checkCraftworldAndNext(req,res,model,modelName,getAllRecursos);
    },
    
    get: function (model, modelName, req, res) {
        checkCraftworldAndNext(req,res,model,modelName,getRecurso);
    },
    
    insert: function (model, modelName, req, res) {
        checkCraftworldAndNext(req,res,model,modelName,insertRecurso);
    },
    
    update: function (model, modelName, req, res) {
        checkCraftworldAndNext(req,res,model,modelName,updateRecurso);
    },
    
    remove: function (model, modelName, req, res) {
        checkCraftworldAndNext(req,res,model,modelName,removeRecurso);
    }
}

function checkCraftworldAndNext(req, res, model, modelName, recursoFunction) {
    Craftworld.findOne({nombre: req.params.nombre_craft}, function(error, craftworld) {
        if (!error && craftworld) recursoFunction(model,modelName,req,res);
        else sendMessage("No existe ningun Craftworld con ese nombre", res, STATUS_ERROR);
    })
}

function getAllRecursos(model, modelName, req, res) {
    model.find({craftworld:req.params.nombre_craft}, function(error, result) {
        if (!error && result.length !== 0) jsonMessage("Info de todos los " + modelName, result, res, STATUS_OK);
        else sendMessage("No existe ningun " + modelName + " en ese CraftWorld", res, STATUS_ERROR);
    });
}

function getRecurso(model, modelName, req, res) {
    model.findOne({craftworld:req.params.nombre_craft,_id:req.params.id_model}, function(error, result) {
        if (!error) jsonMessage("Info de un " + modelName, result, res, STATUS_OK);
        else sendMessage("No existe ningun " + modelName + " en ese CraftWorld con ese id", res, STATUS_ERROR);
    });
}

function insertRecurso(model, modelName, req, res) {
    req.body.craftworld = req.params.nombre_craft;
    if (req.body.codigo_acceso) encryptAndNext(model,modelName,req,res,insertModel);
    else insertModel(model,modelName,req,res);
}

function updateRecurso(model, modelName, req, res) {
    if (req.body.codigo_acceso) encryptAndNext(model,modelName,req,res,updateModel);
    else updateModel(model,modelName,req,res);
}

function removeRecurso(model, modelName, req, res) {
    model.findOneAndRemove({craftworld:req.params.nombre_craft,_id:req.params.id_model}, function(error, result) {
        if (!error) jsonMessage(modelName + " borrado", result, res, STATUS_OK);
        else sendMessage("Error al eliminar el " + modelName + " en ese CraftWorld", res, STATUS_ERROR);
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

function encryptAndNext(model, modelName, req, res, userFunction) {
    bcrypt.hash(req.body.codigo_acceso, 12, function(error, hash) {
        if (error) sendMessage("Error al encriptar el código de acceso", res, STATUS_ERROR);
        else {
            req.body.codigo_acceso = hash;
            recursFunction(model,modelName,req,res);
        }
    });
}

function insertModel(model, modelName, req, res) {
    req.body.craftworld = req.params.nombre_craft;
    
    new model(req.body).save(function(error, result) {
        if (!error) jsonMessage(modelName + " añadido", result, res, STATUS_OK);
        else sendMessage("Error al añadir el " + modelName + " en ese CraftWorld", res, STATUS_ERROR);
    });
}

function updateEncrypted(model, modelName, req, res) {
    bcrypt.hash(req.body.codigo_acceso, 12, function(error, hash) {
        if (error) sendMessage("Error al encriptar el código de acceso", res, STATUS_ERROR);
        else {
            req.body.codigo_acceso = hash;
            updateModel(model,modelName,req,res)
        }
    });
}

function updateModel(model, modelName, req, res) {
    model.findOneAndUpdate({craftworld:req.params.id_craft,_id:req.params.id_model}, req.body, {'new': true}, function(error, result) {
        if (!error) jsonMessage(modelName + " actualizado", result, res, STATUS_OK);
        else sendMessage("Error al actualizar el " + modelName + " en ese CraftWorld", res, STATUS_ERROR);
    });
}