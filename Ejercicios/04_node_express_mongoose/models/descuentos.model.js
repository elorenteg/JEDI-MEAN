var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Funcion para definir el modelo de la coleccion tasks
 */
module.exports = function() {

    // Esquema que seguirán los objetos de la colección tasks
    var descuentoSchema = new Schema({
        valor: {type: Number, required: true},
        caducidad: {type: Date, default: new Date()}
    });
    
    mongoose.model('Descuento', descuentoSchema, 'descuento');
};

