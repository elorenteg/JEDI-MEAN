var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

    var libroSchema = new Schema({
        titulo: { type: String, required: true },
        editorial: { type: String },
        isbn: { type: String, required: true, unique: true },
        descripcion: { type: String },
        tema: { type: [String] },
        precio: { type: Number, default: 0 }
    });
    
    mongoose.model('Libro', libroSchema, 'libros');
};

