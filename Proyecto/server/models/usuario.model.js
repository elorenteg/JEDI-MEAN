var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

    var usuarioSchema = new Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        librosComprados: [{
            libro: { type: Schema.Types.ObjectId, ref: 'Libro' },
            tienda: { type: Schema.Types.ObjectId, ref: 'Tienda' },
            fecha: { type: Date, required: true }
        }],
        isAdmin: { type: Boolean, deafult: false }
    });
    
    mongoose.model('Usuario', usuarioSchema, 'usuarios');
};

