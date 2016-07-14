var log = require('winston');
var router = require('express').Router();
var mongoose = require('mongoose');

var _ = require('lodash/core');

module.exports = router;

var jwt_secret = require('../config').jwt_secret;
var express_jwt = require('express-jwt');
var bcrypt = require('bcrypt');

var maker = require('../helpers/maker');
var Libro = mongoose.model('Libro');
var Tienda = mongoose.model('Tienda');

router.get('/libros', function(req,res) {
    maker.getAll(Libro, req, res, '');
});

router.get('/libro/:isbn/tiendas', function(req,res) {
    Libro.findOne({isbn: req.params.isbn}, function(error, libro) {
        if (!error && libro) {
            console.log(libro._id);
            Tienda.find({'libros.libro': libro._id}, function(error, tiendas) {
                if (!error) {
                    var infoTiendas = _.map(tiendas, function(tienda) {
                        var infoTienda = _.pick(tienda, 'sigla', 'nombre', 'direccion', 'libros');
                        var stock = infoTienda.libros.filter(function (libr) {
                            return libr.libro.equals(libro._id);
                        })[0].stock;
                        delete infoTienda.libros;
                        infoTienda.stock = stock;
                        return infoTienda;
                    })
                    res.status(200).send(infoTiendas);
                }
                else res.status(404).send(error);
            });
        }
        else res.status(404).send(error);
    });
});