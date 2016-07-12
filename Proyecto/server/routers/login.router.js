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
    authenticate(req,res);
});

function authenticate(req, res) {
    var user = {
        email: req.body.email,
        password: req.body.password,
        isAdmin: (req.body.email === 'admin@gmail.com')
    };
    
    Usuario.findOne({email:user.email}, function(error, usuario) {
        if (!error && usuario) {
            bcrypt.compare(user.password, usuario.password, function(error, result) {
                if (!error && result) {
                    var token = jwt.sign(user, config.JWT_SECRET, {
                        expiresIn: 24*60*60 // Este token expirará en 24h
                    });
                    res.status(200).send({ token: token });
                }
                else res.status(401).send(error);
            })
        }
        else res.status(404).send(error);
    });
}

router.get('/usuarios', function(req, res) {
    maker.getAll(Usuario,req,res);
});