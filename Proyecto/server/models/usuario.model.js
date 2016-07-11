var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

    var usuarioSchema = new Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        librosComprados: [{ type: Schema.Types.ObjectId, ref: 'Libro' }],
        isAdmin: { type: Boolean, deafult: false }
    });
    
    mongoose.model('Usuario', usuarioSchema, 'usuarios');
};

