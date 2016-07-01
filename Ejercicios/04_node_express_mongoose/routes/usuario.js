var express = require('express');
var log = require('winston');
var router = express.Router();

module.exports = router;

var Usuario = require('mongoose').model('Usuario');

router.get('/:id_user/info', function(req, res) {
    getUsuario(req,res);
});

router.post('/:id_user/compra/:id_prod', function(req, res) {
    log.info("POST usuario con id=" + req.params.id_user + " compra producto con id=" + req.params.id_prod);
    res.send("POST usuario con id=" + req.params.id_user + " compra producto con id=" + req.params.id_prod);
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

function getUsuario(req, res) {
    var info = req.params.id_user;
    
    Usuario.findById(info, function(error, result) {
        if (!error) jsonMessage("Info de un usuario", result, res, STATUS_OK);
        else sendMessage("No existe ningun producto con ese _id", res, STATUS_ERROR);
    })
}