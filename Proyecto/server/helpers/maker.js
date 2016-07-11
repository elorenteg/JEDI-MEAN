var log = require('winston');

function handle(res) {
    return function(error, result) {
        if (error) res.status(404).send(error);
        else res.status(200).send(result);
    }
}

module.exports = {
    
    getAll: function (model, req, res, population) {
        population = population || '';
        model.find({}, handle(res)).populate(population);
    },
    
    get: function (model, info, req, res, population) {
        population = population || '';
        model.findOne(info, handle(res)).populate(population);
    },
    
    insert: function (model, newInfo, req, res) {
        new model(newInfo).save(handle(res));
    },
    
    update: function (model, info, newInfo, req, res) {
        model.findOneAndUpdate(info, req.body, {new: true}, handle(res));
    },
    
    remove: function (model, info, req, res) {
        model.findOneAndRemove(info, handle(res));
    }
}