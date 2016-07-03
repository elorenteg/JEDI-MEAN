var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
    
    var craftworldSchema = new Schema({
        nombre: { type: String, unique: true },
        poblacion: { type: Number, default: 0, min: 0 }
    });
    
    mongoose.model('Craftworld', craftworldSchema, 'craftworlds');
};

