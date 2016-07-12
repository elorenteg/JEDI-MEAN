var express = require('express');
var maker = require('./maker');

module.exports = function(model, modelname, population) {
    var router = express.Router();

    population = population || '';

    router.get('/:id', function(req, res) {
        var info = modelIDfind(modelname, req.params.id);
        console.log(info);
        maker.get(model, info, req, res, population);
    });

    router.post('/', function(req, res) {
        var newInfo = req.body;
        console.log(newInfo);
        maker.insert(model, newInfo, req, res);
    });

    router.patch('/:id', function(req, res) {
        var info = modelIDfind(modelname, req.params.id);
        var newInfo = req.body;
        maker.update(model, info, newInfo, req, res);
    });

    router.delete('/:id', function(req, res) {
        var info = modelIDfind(modelname, req.params.id);
        maker.remove(model, info, req, res);
    });
    
    return router;
}

function modelIDfind(modelname, id) {
    if (modelname === 'Libro') return {isbn: id};
    else if (modelname === 'Tienda') return {sigla: id};
    else return {email: id};
}
