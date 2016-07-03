var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
    
    var armaSchema = new Schema({
        modelo: { type: String },
        calibre: { type: Number },
        craftworld: { type: String, required: true }
    });
    
    mongoose.model('Arma', armaSchema, 'armas');
};

