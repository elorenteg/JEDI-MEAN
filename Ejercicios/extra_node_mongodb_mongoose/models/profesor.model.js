var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Funcion para definir el modelo de la coleccion tasks
 */
module.exports = function() {

    // Esquema que seguirán los objetos de la colección tasks
    var profesorSchema = new Schema({
        nombre: {type: String, required: true},
        apellido: {type: String},
        departamento: {type: String, required: true},
        asignaturas: [{type: Schema.Types.ObjectId, ref: 'Asignatura'}]
    });

    // Especificamos nombre del modelo, esquema, nombre de la colección,
    // en este caso el nombre del modelo es 'Profesor' 
    // Este nombre lo usaremos luego para obtener el modelo que deseemos,
    // llamando a mongoose.model('Profesor')
    // El esquema es el que acabamos de crear
    // Y la colección de la bd en la que se guardarán los documentos se llama 'profesor'
    mongoose.model('Profesor', profesorSchema, 'profesor');
};

