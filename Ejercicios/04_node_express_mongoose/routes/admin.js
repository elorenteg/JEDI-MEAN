var express = require('express');
var log = require('winston');
var router = express.Router();

module.exports = router;

var Producto = require('mongoose').model('Producto');
var Usuario = require('mongoose').model('Usuario');
var Descuento = require('mongoose').model('Descuento');

router.get('/listaUsuarios', function(req, res) {
    getAllUsuarios(res);
});

router.post('/anadirProducto', function(req, res) {
    insertProducto(req,res);
});

router.delete('/borrarProducto/:id_prod', function(req, res) {
    deleteProducto(req,res);
});

router.patch('/actualizarProducto/:id_prod', function(req, res) {
    updateProducto(req,res);
});

router.post('/anadirDescuento', function(req, res) {
    insertDescuento(req,res);
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

function getAllUsuarios(res) {
    Usuario.find({}, function(error, result) {
        if (!error && result.length !== 0) jsonMessage("Info de todos los usuarios", result, res, STATUS_OK);
        else sendMessage("No existe ningun usuario", res, STATUS_ERROR);
    })
}

function insertProducto(req, res) {
    var prod_data = req.body;
    var new_prod = new Producto(prod_data);
    
    new_prod.save(function(error, result) {
        if(!error) jsonMessage("Producto añadido", result, res, STATUS_OK);
        else sendMessage("Error al añadir el producto", res, STATUS_ERROR);
    })
}

function deleteProducto(req, res) {
    var info = req.params.id_prod;
    
    Producto.findByIdAndRemove(info, function(error, result) {
        if(!error) sendMessage("Producto borrado correctamente", res, STATUS_OK);
        else sendMessage("Error al borrar el producto", res, STATUS_ERROR);
    })
}

function updateProducto(req, res) {
    var info = req.params.id_prod;
    var prod_data = req.body;
    
    Producto.findByIdAndUpdate(info, prod_data, function(error, result) {
        if(!error) sendMessage("Producto actualizado correctamente", res, STATUS_OK);
        else sendMessage("Error al actualizar el producto", res, STATUS_ERROR);
    })
}

function insertDescuento(req, res) {
    var desc_data = req.body;
    var new_desc = new Descuento(desc_data);
    
    new_desc.save(function(error, result) {
        if(!error) jsonMessage("Descuento añadido", result, res, STATUS_OK);
        else sendMessage("Error al añadir el descuento", res, STATUS_ERROR);
    })
}