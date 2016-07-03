var log = require('winston');

var Craftworld = require('mongoose').model('Craftworld');

module.exports = {
    
    getAll: function (req, res) {
        Craftworld.find({}, function(error, result) {
            if (!error && result.length !== 0) jsonMessage("Info de todos los Craftworlds", result, res, STATUS_OK);
            else sendMessage("No existe ningun Craftworld", res, STATUS_ERROR);
        })
    },
    
    get: function (req, res) {
        Craftworld.findOne({nombre: req.params.nombre}, function(error, result) {
            if (!error) jsonMessage("Info de un Craftworld", result, res, STATUS_OK);
            else sendMessage("No existe ningun Craftworld con ese nombre", res, STATUS_ERROR);
        })
    },
    
    insert: function (req, res) {
        Craftworld.findOne({nombre: req.body.nombre}, function(error, craftworld) {
            if (!error && craftworld) sendMessage("Ya existe un Craftworld con ese nombre", res, STATUS_OK);
            else insertCraftworld(req,res);
        })
    },
    
    update: function (req, res) {
        if (req.body.nombre) {
            Craftworld.findOne({nombre: req.body.nombre}, function(error, craftworld) {
                if (!error && craftworld) sendMessage("Ya existe un Craftworld con ese nombre", res, STATUS_OK);
                else updateCraftworld(req,res);
            })
        }
        else updateCraftworld(req,res);
        
    },
    
    remove: function (req, res) {
        Craftworld.findAndRemove({nombre: req.params.nombre}, function(error, result) {
            if (!error) jsonMessage("Craftworld borrado", result, res, STATUS_OK);
            else sendMessage("Error al eliminar el Craftworld", res, STATUS_ERROR);
        });
    }
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

function insertCraftworld(req, res) {
    new Craftworld(req.body).save(function(error, result) {
        if (!error) jsonMessage("Craftworld añadido", result, res, STATUS_OK);
        else sendMessage("Error al añadir el Craftworld", res, STATUS_ERROR);
    });
}

function updateCraftworld(req, res) {
    Craftworld.findAndUpdate({nombre: req.params.nombre}, req.body, function(error, result) {
        if (!error) jsonMessage("Craftworld actualizado", result, res, STATUS_OK);
        else sendMessage("Error al actualizar el Craftworld", res, STATUS_ERROR);
    });
}