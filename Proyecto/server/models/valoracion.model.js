var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

    var valoracionSchema = new Schema({
        username: { type: String, required: true },
        isbn: { type: String, required: true },
        siglaTienda: { type: String, required: true },
        valoracion: { type: Number, required: true, enum: [1, 2, 3, 4, 5] },
        comentario: { type: String },
        fecha: { type: Date },
    });
    
    mongoose.model('Valoracion', valoracionSchema, 'valoraciones');
};

