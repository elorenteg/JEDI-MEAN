var log = require('winston');
var router = require('express').Router();
var mongoose = require('mongoose');

module.exports = router;

var bcrypt = require('bcrypt');
var secret = require('../config').jwt_secret;
var jwt = require('jsonwebtoken');

var prints = require('../helpers/prints');
var maker = require('../helpers/maker');
var Usuario = mongoose.model('Usuario');

router.post('/', function(req, res) {
    register(req,res);
});

function register(req, res) {
    var user = req.body;
    
    Usuario.findOne({email: user.email}, function(error, usuario) {
        if (!error && !usuario) {
            bcrypt.hash(user.password, 12, function(error, hash) {
                if (error) prints.errorMessage("Error al encriptar el código de acceso", error, res);
                else {
                    user.codigo_acceso = hash;
                    maker.insert(Usuario,user,req,res);
                }
            });
        }
        else {
            mss = "Ya existe un usuario con ese email";
            prints.errorMessage(mss, mss, res);
        }
    });
}