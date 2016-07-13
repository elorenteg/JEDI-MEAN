var log = require('winston');
var router = require('express').Router();
var mongoose = require('mongoose');

module.exports = router;

var config = require('../config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var maker = require('../helpers/maker');
var Usuario = mongoose.model('Usuario');

router.post('/', function(req, res) {
    register(req,res);
});

function register(req, res) {
    var user = req.body;
    user.isAdmin = false;
    
    //Comprovar que ya exista ese email se hara con el unique de mongoose (error.code = 11000)
    //Usuario.findOne({email: user.email}, function(error, usuario) {
        //if (!error && !usuario) {
            bcrypt.hash(user.password, 12, function(error, hash) {
                if (error) res.status(500).send(error);
                else {
                    user.password = hash;
                    maker.insert(Usuario,user,req,res);
                }
            });
        //}
        //else res.status(404).send(error);
    //});
}