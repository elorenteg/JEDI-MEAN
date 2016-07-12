// Este servicio depende de los servicios $http, $q y nuestro servicio LoginService

// Como podéis ver, los servicios que nos da angular o otros módulos
// normalmente empiezan por $, en cambio los nuestros los definimos sin $
// Esta convención es útil para identificar rápidamente si el módulo es nuestro
// o externo.

// $http lo utilizamos para hacer las peticiones al servidor

// $q lo utilizamos para las promises, es decir, para poder generar
// funciones asíncronas

// LoginService lo utilizamos para obtener las tareas del usuario logueado
TiendasService = function($http, $q, LoginService) {
    // Variable privada
    var SERVER_URL_ALL_TIENDA = "http://localhost:8080/api/admin/tiendas/"
    var SERVER_URL_ONE_TIENDA = "http://localhost:8080/api/admin/tienda/"

    // El objeto this no es el mismo dentro de las funciones
    // Por eso creamos una copia, para poder referenciarlo
    // desde dentro de las funciones y que siempre nos estemos refiriendo
    // al del servicio
    var self = this;

    // Estado que guarda el servicio. Array de tareas.
    var tiendas = null;

    this.reset = function() {
        tiendas = null;
    };

    // Función pública, obtener todas las tareas
    this.getTiendas = function() {
        var q = $q.defer();

        // Post con primer parámetro la url, segundo el body, que será la tarea
        $http.get(SERVER_URL_ALL_TIENDA)
            .then(
                function(response) {
                    // La añadimos también en nuestro array
                    // Como tareas compartirá referencia con $scope.tareas
                    // en el controlador TareasCtrl, también se actualizará
                    // en la vista el cambio, sin necesidad de hacer nada
                    tiendas = response.data;
                    q.resolve(tiendas);
                },
                function(err) {
                    q.reject(err);
                }
            );

        return q.promise;
    };

    this.anadirTienda = function(tienda) {
        var q = $q.defer();

        // Post con primer parámetro la url, segundo el body, que será la tarea
        $http.post(SERVER_URL_ONE_TIENDA, tienda)
            .then(
                function(response) {
                    // La añadimos también en nuestro array
                    // Como tareas compartirá referencia con $scope.tareas
                    // en el controlador TareasCtrl, también se actualizará
                    // en la vista el cambio, sin necesidad de hacer nada
                    tiendas.push(response.data);
                    q.resolve();
                },
                function(err) {
                    q.reject(err);
                }
            );

        return q.promise;
    }
    
    this.eliminarTienda = function(id) {
        var q = $q.defer();

        // Post con primer parámetro la url, segundo el body, que será la tarea
        $http.delete(SERVER_URL_ONE_TIENDA + tiendas[id].sigla, {})
            .then(
                function(response) {
                    // La añadimos también en nuestro array
                    // Como tareas compartirá referencia con $scope.tareas
                    // en el controlador TareasCtrl, también se actualizará
                    // en la vista el cambio, sin necesidad de hacer nada
                    tiendas.splice(id,1);
                    q.resolve(tiendas);
                },
                function(err) {
                    q.reject(err);
                }
            );

        return q.promise;
    }
}

angular.module('LibrosApp').service('TiendasService', ['$http', '$q', 'LoginService', TiendasService]);
