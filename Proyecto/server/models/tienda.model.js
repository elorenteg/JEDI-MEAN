var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

    var tiendaSchema = new Schema({
        nombre: { type: String },
        sigla: { type: String, required: true },
        direccion: { type: String },
        libros: [{
            libro: { type: Schema.Types.ObjectId, ref: 'Libro' },
            tienda: {type: Schema.Types.ObjectId, ref: 'Tienda' },
            stock: { type: Number, default: 0, min: 0 }
        }]
    });
    
    mongoose.model('Tienda', tiendaSchema, 'tiendas');
};

