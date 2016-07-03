var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

    var usuarioSchema = new Schema({
        nombre:  { type: String, required: true },
        codigo_acceso: { type: String, required: true },
        craftworld: { type: String },
        rango: { type: String , default: 'brujo', enum: ['brujo', 'soldado', 'comandante', 'admin']}
    });
    
    mongoose.model('Usuario', usuarioSchema, 'usuarios');
};

