var log = require('winston');
var router = require('express').Router();
var mongoose = require('mongoose');

module.exports = router;

var jwt_secret = require('../config').jwt_secret;
var express_jwt = require('express-jwt');
var bcrypt = require('bcrypt');

var maker = require('../helpers/maker');
var Libro = mongoose.model('Libro');

router.get('/libros', function(req,res) {
    maker.getAll(Libro, req, res, '');
});