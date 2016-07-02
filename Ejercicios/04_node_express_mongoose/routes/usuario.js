var express = require('express');
var log = require('winston');
var async = require('async');
var router = express.Router();

module.exports = router;

var Producto = require('mongoose').model('Producto');
var Usuario = require('mongoose').model('Usuario');
var Descuento = require('mongoose').model('Descuento');

router.get('/:id_user/info', function(req, res) {
    getUsuario(req,res);
});

router.post('/:id_user/compra/:id_prod', function(req, res) {
    buyProducto(req,res);
});

router.post('/:id_user/compra/:id_prod/descuento/:id_desc', function(req, res) {
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
    var info_desc = req.params.id_desc;
    
    Producto.findById(info_prod, function(error, result) {
        if (!error) {
            if (result.stock !== 0) {
                var haveDiscount = info_desc !== undefined;
                if (haveDiscount) checkDescuento(info_user,info_prod,info_desc,result,res);
                else updateStockAndBuy(info_user,info_prod,result,0,res);
            }
            else sendMessage("El producto no tiene stock", res, STATUS_ERROR);
        }
        else sendMessage("No existe ningun producto con ese _id", res, STATUS_ERROR);
    });
}

function updateStockAndBuy(info_user, info_prod, result_prod, desc, res) {
    var prod_data = {stock: (result_prod.stock - 1)};
    
    Producto.findByIdAndUpdate(info_prod, prod_data, function(error, result) {
        updateCompra(info_user,info_prod,desc,result_prod,res);
    });
}

function updateCompra(info_user, info_prod, desc, result_prod, res) {
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
        
        Usuario.findByIdAndUpdate(info_user, {lista_de_la_compra: compra}, function(error, result) {
            var coste = result_prod.precio;
            if (desc > 0)
                sendMessage("Compra realizada correctamente. Coste: " + coste + " - " + desc + " = " + (coste - desc), res, STATUS_OK);
            else
                sendMessage("Compra realizada correctamente. Coste: " + coste, res, STATUS_OK);
        });
    });
}

function checkDescuento(info_user, info_prod, info_desc, result_prod, res) {
    Descuento.findById(info_desc, function(error, result) {
        if (!error) {
            var caducidad = getFormattedDate(result.caducidad);
            var today = getFormattedDate(new Date());
            if (today <= caducidad) updateStockAndBuy(info_user,info_prod,result_prod,result.valor,res);
            else sendMessage("El descuento ha expirado", res, STATUS_ERROR);
        }
        else sendMessage("No existe ningun descuento con ese _id", res, STATUS_ERROR);
    });
}

function getFormattedDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return yyyy + '/' + mm + '/' + dd;
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