var log = require('winston');
var router = require('express').Router();
var mongoose = require('mongoose');

module.exports = router;

var jwt_secret = require('../config').jwt_secret;
var express_jwt = require('express-jwt');
var bcrypt = require('bcrypt');

var prints = require('../helpers/prints');
var crudMaker = require('../helpers/crud_maker');
var maker = require('../helpers/maker');
var Usuario = mongoose.model('Usuario');
var Libro = mongoose.model('Libro');
var Tienda = mongoose.model('Tienda');

var globalAdminInfo = {
    email: "admin",
    password: "12345",
    isAdmin: true
}

mongoose.connection.once('open', function() {
    initGlobalAdmin();
});

router.use('/', express_jwt({secret: jwt_secret, requestProperty: 'usuario', credentialsRequired: false}), function(req, res, next) {
    if (req.usuario && req.usuario.isAdmin) next();
    else {
        mss = 'No tienes acceso a este recurso!';
        prints.errorMessage(mss, mss, res);
    }
});

router.use('/libro', crudMaker(Libro, 'Libro'));
router.get('/libros', function(req,res) {
    maker.getAll(Libro, req, res, '');
});
router.use('/tienda', crudMaker(Tienda, 'Tienda'));
router.get('/tiendas', function(req,res) {
    maker.getAll(Tienda, req, res, 'libros');
});
router.patch('/tienda/:id/anadirStock', function(req,res) {
    var infoTienda = {sigla: req.params.id};
    Tienda.findOne(infoTienda, function(error, tienda) {
        if (!error) {
            var infoLibro = {isbn: req.body.isbn};
            Libro.findOne(infoLibro, function(error, libro) {
                var newStock = req.body.stock;
                if (!error && libro) addStock(tienda,libro._id,newStock,res);
                else {
                    mss = 'No existe ese libro';
                    prints.errorMessage(mss, mss, res);
                }
            });
        }
        else {
            mss = 'No existe esa tienda';
            prints.errorMessage(mss, mss, res);
        }
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
                if (error) prints.consoleError("Error al encriptar el código de acceso");
                else {
                    globalAdminInfo.password = hash;
                    new Usuario(globalAdminInfo).save(function(error, usuario) {
                        if (!error && usuario) prints.consoleInfo("Admin global creado");
                        else prints.consoleError("Error al crear el Admin global");
                    });
                }
            });
        }
        else prints.consoleInfo("Admin global ya estaba creado");
    });
}

function addStock(tienda, id, newStock, res) {
    var libros = tienda.libros;
    var posLibro = findLibroInStock(libros, id);
    console.log(posLibro);
    
    if (posLibro === -1) libros[libros.length] = {libro: id, stock: newStock};
    else libros[posLibro].stock += newStock;
    
    var infoTienda = {sigla: tienda.sigla};
    Tienda.findOneAndUpdate(infoTienda, {libros: libros}, {new: true}, function(error, tienda) {
        if (!error) prints.jsonMessage("Tienda actualizada", tienda, res);
        else {
            mss = 'Error al actualizar el stock';
            prints.errorMessage(mss, mss, res);
        }
    });
}

function findLibroInStock(libros, id) {
    for (i = 0; i < libros.length; ++i) {
        if (id.equals(libros[i].libro)) return i;
    }
    
    return -1;
}