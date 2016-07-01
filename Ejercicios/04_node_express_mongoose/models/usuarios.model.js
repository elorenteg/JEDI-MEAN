var mongoose = require('mongoose');
var log = require('winston');
var Schema = mongoose.Schema;

/**
 * Funcion para definir el modelo de la coleccion tasks
 */
module.exports = function() {

    // Esquema que seguirán los objetos de la colección tasks
    var usuarioSchema = new Schema({
        nombre: {type: String, required: true},
        lista_de_la_compra: [{idProducto: String, cantidad: Number}]
    });

    mongoose.model('Usuario', usuarioSchema, 'usuario');
};

