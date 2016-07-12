// Este servicio depende de los servicios $http, $q y nuestro servicio LoginService

// Como podéis ver, los servicios que nos da angular o otros módulos
// normalmente empiezan por $, en cambio los nuestros los definimos sin $
// Esta convención es útil para identificar rápidamente si el módulo es nuestro
// o externo.

// $http lo utilizamos para hacer las peticiones al servidor

// $q lo utilizamos para las promises, es decir, para poder generar
// funciones asíncronas

// LoginService lo utilizamos para obtener las tareas del usuario logueado
LibrosService = function($http, $q, LoginService) {
    // Variable privada
    var SERVER_URL_ALL_LIBRO = "http://localhost:8080/api/admin/libros/"
    var SERVER_URL_ONE_LIBRO = "http://localhost:8080/api/admin/libro/"

    // El objeto this no es el mismo dentro de las funciones
    // Por eso creamos una copia, para poder referenciarlo
    // desde dentro de las funciones y que siempre nos estemos refiriendo
    // al del servicio
    var self = this;

    // Estado que guarda el servicio. Array de tareas.
    var libros = null;

    this.reset = function() {
        libros = null;
    };

    // Función pública, obtener todas las tareas
    this.getLibros = function() {
        var q = $q.defer();

        // Post con primer parámetro la url, segundo el body, que será la tarea
        $http.get(SERVER_URL_ALL_LIBRO)
            .then(
                function(response) {
                    // La añadimos también en nuestro array
                    // Como tareas compartirá referencia con $scope.tareas
                    // en el controlador TareasCtrl, también se actualizará
                    // en la vista el cambio, sin necesidad de hacer nada
                    libros = response.data;
                    q.resolve(libros);
                },
                function(err) {
                    q.reject(err);
                }
            );

        return q.promise;
    };

    this.anadirLibro = function(libro) {
        var q = $q.defer();

        // Post con primer parámetro la url, segundo el body, que será la tarea
        $http.post(SERVER_URL_ONE_LIBRO, libro)
            .then(
                function(response) {
                    // La añadimos también en nuestro array
                    // Como tareas compartirá referencia con $scope.tareas
                    // en el controlador TareasCtrl, también se actualizará
                    // en la vista el cambio, sin necesidad de hacer nada
                    libros.push(response.data);
                    q.resolve();
                },
                function(err) {
                    q.reject(err);
                }
            );

        return q.promise;
    }
    
    this.eliminarLibro = function(id) {
        var q = $q.defer();

        // Post con primer parámetro la url, segundo el body, que será la tarea
        $http.delete(SERVER_URL_ONE_LIBRO + libros[id].isbn, {})
            .then(
                function(response) {
                    // La añadimos también en nuestro array
                    // Como tareas compartirá referencia con $scope.tareas
                    // en el controlador TareasCtrl, también se actualizará
                    // en la vista el cambio, sin necesidad de hacer nada
                    libros.splice(id,1);
                    q.resolve(libros);
                },
                function(err) {
                    q.reject(err);
                }
            );

        return q.promise;
    }
}

angular.module('LibrosApp').service('LibrosService', ['$http', '$q', 'LoginService', LibrosService]);
