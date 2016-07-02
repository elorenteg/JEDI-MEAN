var models = [ './productos.model', './usuarios.model', './descuentos.model'];

/**
 Funcion para inicializar los modulos, basado en el array definido arriba 
 con los paths de los modulos
 */
exports.initialize = function() {
  models.forEach(function(model){
    require(model)();
  });
};