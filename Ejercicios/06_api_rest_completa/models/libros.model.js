var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

    var libroSchema = new Schema({
        titulo: { type: String },
        npaginas: { type: Number , min: 1 },
        craftworld: { type: String, required: true }
    });
    
    mongoose.model('Libro', libroSchema, 'libros');
};

