var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Funcion para definir el modelo de la coleccion tasks
 */
module.exports = function() {

    // Esquema que seguirán los objetos de la colección tasks
    var alumnoSchema = new Schema({
        nombre: {type: String, required: true},
        apellido: {type: String},
        asignaturas: [{type: Schema.Types.ObjectId, ref: 'Asignatura'}]
    });

    // Especificamos nombre del modelo, esquema, nombre de la colección,
    // en este caso el nombre del modelo es 'Alumno' 
    // Este nombre lo usaremos luego para obtener el modelo que deseemos,
    // llamando a mongoose.model('Alumno')
    // El esquema es el que acabamos de crear
    // Y la colección de la bd en la que se guardarán los documentos se llama 'alumno'
    mongoose.model('Alumno', alumnoSchema, 'alumno');
};

