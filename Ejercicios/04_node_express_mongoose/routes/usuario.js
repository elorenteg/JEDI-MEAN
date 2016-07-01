var express = require('express');
var log = require('winston');
var async = require('async');
var router = express.Router();

module.exports = router;

var Producto = require('mongoose').model('Producto');
var Usuario = require('mongoose').model('Usuario');

router.get('/:id_user/info', function(req, res) {
    getUsuario(req,res);
});

router.post('/:id_user/compra/:id_prod', function(req, res) {
    buyProducto(req,res);
});

///////////////////////////////////////////////////////////////////////////////

var STATUS_OK = 200;
var STATUS_ERROR = 500;

function sendMessage(mss, res, nstatus) {
    res.status(nstatus).send(mss);
    log.info(mss);
}

function jsonMessage(mss, json, res, nstatus) {
    res.status(nstatus).json(json);
    log.info(mss);
}

function getUsuario(req, res) {
    var info = req.params.id_user;
    
    Usuario.findById(info, function(error, result) {
        if (!error) jsonMessage("Info de un usuario", result, res, STATUS_OK);
        else sendMessage("No existe ningun producto con ese _id", res, STATUS_ERROR);
    })
}

function buyProducto(req, res) {
    var info_user = req.params.id_user;
    var info_prod = req.params.id_prod;
    
    Producto.findById(info_prod, function(error, result) {
        if (!error) {
            if (result.stock !== 0) {
                updateStock(info_user,info_prod,result);
                sendMessage("Compra realizada correctamente", res, STATUS_ERROR);
            }
            else sendMessage("El producto no tiene stock", res, STATUS_ERROR);
        }
        else sendMessage("No existe ningun producto con ese _id", res, STATUS_ERROR);
    })
}

function updateStock(info_user, info_prod, result) {
    var prod_data = {stock: (result.stock - 1)};
    
    Producto.findByIdAndUpdate(info_prod, prod_data, function(error, result) {
                updateCompra(info_user,info_prod);
    });
}

function updateCompra(info_user, info_prod) {
    Usuario.findById(info_user, function(error, result) {
        var found = false;
        var compra = result.lista_de_la_compra;
        for (i = 0; i < compra.length && !found; ++i) {
            if (compra[i].idProducto === info_prod) {
                compra[i].cantidad++;
                found = true;
            }
        }
        if (!found) {
            compra.push({idProducto: info_prod, cantidad: 1});
        }
        
        Usuario.findByIdAndUpdate(info_user, {lista_de_la_compra: compra}, function(error, result) {});
    })
}

// Compra de producto con Async
function buyProductoAsync(req, res) {
    var info_user = req.params.id_user;
    var info_prod = req.params.id_prod;
    
    async.waterfall([
        function(callback) {
            Producto.findById(info_prod, callback);
        },
        function(result, callback) {
            if (result.stock !== 0) {
                var prod_data = {stock: (result.stock - 1)};
    
                Producto.findByIdAndUpdate(info_prod, prod_data, callback);
            }
        },
        function(result, callback) {
            Usuario.findById(info_user, callback);
        },
        function(result, callback) {
            var found = false;
            var compra = result.lista_de_la_compra;
            for (i = 0; i < compra.length && !found; ++i) {
                if (compra[i].idProducto === info_prod) {
                    compra[i].cantidad++;
                    found = true;
                }
            }
            if (!found) {
                compra.push({idProducto: info_prod, cantidad: 1});
            }
            
            Usuario.findByIdAndUpdate(info_user, {lista_de_la_compra: compra}, callback);
        }
    ],
    function(error, result) {
        if (error) sendMessage(error, res, STATUS_ERROR);
        else sendMessage(result, res, STATUS_ERROR);
    });
}