var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Funcion para definir el modelo de la coleccion tasks
 */
module.exports = function() {

    // Esquema que seguirán los objetos de la colección tasks
    var asignaturaSchema = new Schema({
        nombre: {type: String, required: true},
        siglas: {type: String, required: true},
        creditos: {type: Number, required: true},
        departamento: {type: String, required:true}
    });

    // Especificamos nombre del modelo, esquema, nombre de la colección,
    // en este caso el nombre del modelo es 'Asignatura' 
    // Este nombre lo usaremos luego para obtener el modelo que deseemos,
    // llamando a mongoose.model('Asignatura')
    // El esquema es el que acabamos de crear
    // Y la colección de la bd en la que se guardarán los documentos se llama 'asignatura'
    mongoose.model('Asignatura', asignaturaSchema, 'asignatura');
};

