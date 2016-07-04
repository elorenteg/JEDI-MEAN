var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

    var libroSchema = new Schema({
        titulo: { type: String },
        npaginas: { type: Number , min: 1 },
        craftworld: { type: String, required: true },
        stock: { type: Number, default: 0, min: 0 }
    });
    
    mongoose.model('Libro', libroSchema, 'libros');
};

