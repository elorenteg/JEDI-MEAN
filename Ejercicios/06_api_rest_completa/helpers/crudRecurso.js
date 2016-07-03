var express = require('express');
var log = require('winston');

var maker = require('./makerRecurso');

module.exports = function(model, modelName) {
    var router = express.Router();

    router.get('/craftworld/:nombre_craft/'+modelName.toLowerCase()+'s', function(req, res) {
        maker.getAll(model,modelName,req,res);
    });

    router.get('/craftworld/:nombre_craft/'+modelName.toLowerCase()+'/:id_model', function(req, res) {
        maker.get(model,modelName,req,res);
    });

    router.post('/craftworld/:nombre_craft/'+modelName.toLowerCase(), function(req, res) {
        maker.insert(model,modelName,req,res);
    });

    router.patch('/craftworld/:nombre_craft/'+modelName.toLowerCase()+'/:id_model', function(req, res) {
        maker.update(model,modelName,req,res);
    });

    router.delete('/craftworld/:nombre_craft/'+modelName.toLowerCase()+'/:id_model', function(req, res) {
        maker.remove(model,modelName,req,res);
    });
    
    return router;
}