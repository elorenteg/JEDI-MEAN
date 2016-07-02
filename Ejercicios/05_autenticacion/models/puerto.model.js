var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function(){
    var puertoSchema = new Schema({
        peso_aceptado: { type: String, default: 'pequeño', enum: ['pequeño', 'medio', 'grande'] },
        coordenada_x: { type: Number , default: 42 },
        coordenada_y: { type: Number , default: 2 }
    });

    mongoose.model('Puerto', puertoSchema, 'puertos');
};
