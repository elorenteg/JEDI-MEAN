var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Funcion para definir el modelo de la coleccion tasks
 */
module.exports = function() {

    // Esquema que seguirán los objetos de la colección tasks
    var productoSchema = new Schema({
        modelo: {type: String, required: true},
        descripcion: {type: String},
        precio: {type: Number, default: 0},
        stock: {type: Number, default: 0}
    });
    
    mongoose.model('Producto', productoSchema, 'producto');
};

