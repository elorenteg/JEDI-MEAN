var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Funcion para definir el modelo de la coleccion tasks
 */
module.exports = function() {

    // Esquema que seguirán los objetos de la colección tasks
    var usuarioSchema = new Schema({
        nombre: {type: String, required: true},
        lista_de_la_compra: [{id_Producto: String, cantidad: Number}]
    });

    mongoose.model('Usuario', usuarioSchema, 'usuario');
};

