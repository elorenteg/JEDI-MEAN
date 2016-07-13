var log = require('winston');
var router = require('express').Router();
var mongoose = require('mongoose');

module.exports = router;

var config = require('../config');
var express_jwt = require('express-jwt');
var bcrypt = require('bcrypt');

var crudMaker = require('../helpers/crud_maker');
var maker = require('../helpers/maker');
var Usuario = mongoose.model('Usuario');
var Libro = mongoose.model('Libro');
var Tienda = mongoose.model('Tienda');

var globalAdminInfo = {
    email: "admin@gmail.com",
    password: "12345",
    isAdmin: true
}

mongoose.connection.once('open', function() {
    initGlobalAdmin();
});

router.use('/', express_jwt({secret: config.JWT_SECRET, requestProperty: 'usuario'}), function(req, res, next) {
    if (req.usuario && req.usuario.isAdmin) next();
    else res.status(404).send({});
});

router.use('/libro', crudMaker(Libro, 'Libro'));
router.get('/libros', function(req,res) {
    maker.getAll(Libro, req, res, '');
});
router.use('/tienda', crudMaker(Tienda, 'Tienda', 'libros.libro'));
router.get('/tiendas', function(req,res) {
    maker.getAll(Tienda, req, res, 'libros.libro');
});
router.patch('/tienda/:id/anadirStock', function(req,res) {
    var infoTienda = {sigla: req.params.id};
    Tienda.findOne(infoTienda, function(error, tienda) {
        if (!error) {
            var infoLibro = {isbn: req.body.isbn};
            Libro.findOne(infoLibro, function(error, libro) {
                var newStock = req.body.stock;
                if (!error && libro) addStock(tienda,libro._id,newStock,res);
                else res.status(404).send(error);
            });
        }
        else res.status(404).send(error);
    });
});

router.get('/usuario/:id', function(req, res) {
    var info = {email: req.params.id};
    maker.get(Usuario,info,req,res);
});

function initGlobalAdmin() {
    Usuario.findOne({email: globalAdminInfo.email}, function(error, usuario) {
        if (!error && !usuario) {
            bcrypt.hash(globalAdminInfo.password, 12, function(error, hash) {
                if (error) console.log("Error al encriptar el código de acceso");
                else {
                    globalAdminInfo.password = hash;
                    new Usuario(globalAdminInfo).save(function(error, usuario) {
                        if (!error && usuario) console.log("Admin global creado");
                        else console.log("Error al crear el Admin global");
                    });
                }
            });
        }
        else console.log("Admin global ya estaba creado");
    });
}

function addStock(tienda, id, newStock, res) {
    var libros = tienda.libros;
    var posLibro = findLibroInStock(libros, id);
    
    if (posLibro === -1) libros[libros.length] = {libro: id, stock: newStock};
    else libros[posLibro].stock += newStock;
    
    var infoTienda = {sigla: tienda.sigla};
    Tienda.findOneAndUpdate(infoTienda, {libros: libros}, {new: true}, function(error, tienda) {
        if (!error) res.status(200).send(tienda);
        else res.status(404).send(error);
    });
}

function findLibroInStock(libros, id) {
    for (i = 0; i < libros.length; ++i) {
        if (id.equals(libros[i].libro)) return i;
    }
    
    return -1;
}