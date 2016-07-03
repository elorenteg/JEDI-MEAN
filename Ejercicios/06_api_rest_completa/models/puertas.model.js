var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

    var puertaSchema = new Schema({
        piso: { type: Number },
        acceso_a: { type: String },
        codigo_acceso: { type: String },
        rangos: { type: [String], required: true, enum: ['brujo', 'soldado', 'comandante', 'admin'] },
        craftworld: { type: String, required: true }
    });
    
    mongoose.model('Puerta', puertaSchema, 'puertas');
};

