var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
    var naveSchema = new Schema({
        identificador: { type: String, required: true },
        codigo_seguridad: { type: String, required: true },
        peso: { type: String , default: 'pequeño', enum: ['pequeño', 'medio', 'grande']}
    });

    mongoose.model('Nave', naveSchema, 'naves');
};

