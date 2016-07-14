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
var Usuario = mongoose.model('Usuario');

router.get('/libros', function(req,res) {
    maker.getAll(Libro, req, res, '');
});

router.get('/libro/:isbn/tiendas', function(req,res) {
    Libro.findOne({isbn: req.params.isbn}, function(error, libro) {
        if (!error && libro) {
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

router.get('/compras/:email', function(req,res) {
    Usuario.findOne({email: req.params.email}, function(error, usuario) {
        if (!error && usuario) res.status(200).send(usuario.librosComprados);
        else res.status(404).send(error);
    }).populate('librosComprados.libro').populate('librosComprados.tienda');
});

router.patch('/comprar/:email/tienda/:sigla/libro/:isbn', function(req,res) {
    console.log("Entro");
    Libro.findOne({isbn: req.params.isbn}, function(error, libro) {
        if (!error && libro) {
            Tienda.findOne({sigla: req.params.sigla}, function(error, tienda) {
                if (!error && tienda) {
                    Usuario.findOne({email: req.params.email}, function(error, usuario) {
                        if (!error && usuario) {
                            var compra = {libro: libro._id, tienda: tienda._id, fecha: Date.now()};
                            var compras = usuario.librosComprados;
                            compras.push(compra);
                            Usuario.findOneAndUpdate({email: req.params.email}, {librosComprados:compras}, {new:true}, function(error, usuario) {
                                if (!error && usuario) {
                                    Libro.findOneAndUpdate({isbn: req.params.isbn}, {stock: libro.stock-1}, {new:true}, function(error, libro) {
                                        if (!error && libro) {
                                            var result = {
                                                libro: {isbn: libro.isbn, titulo: libro.titulo},
                                                tienda: {sigla: tienda.sigla, nombre: tienda.nombre},
                                                fecha: compra.fecha
                                            };
                                            res.status(200).send(result);
                                        }
                                        else res.status(404).send(error);
                                    })
                                }
                                else res.status(404).send(error);
                            })
                        }
                        else res.status(404).send(error);
                    })
                }
                else res.status(404).send(error);
            });
        }
        else res.status(404).send(error);
    });
});