
LibrosService = function($http, $q, LoginService) {
    var SERVER_URL_ALL_LIBRO = "http://localhost:8080/api/usuario/libros/"
    var SERVER_URL_ONE_LIBRO_ADMIN = "http://localhost:8080/api/admin/libro/"
    var SERVER_URL_ONE_LIBRO_USER = "http://localhost:8080/api/usuario/libro/"
    
    var self = this;

    var libros = null;

    this.reset = function() {
        libros = null;
    };
    
    this.getLibros = function() {
        var q = $q.defer();

        $http.get(SERVER_URL_ALL_LIBRO)
            .then(
                function(response) {
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

        $http.post(SERVER_URL_ONE_LIBRO_ADMIN, libro)
            .then(
                function(response) {
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

        $http.delete(SERVER_URL_ONE_LIBRO_ADMIN + libros[id].isbn, {})
            .then(
                function(response) {
                    libros.splice(id,1);
                    q.resolve(libros);
                },
                function(err) {
                    q.reject(err);
                }
            );

        return q.promise;
    }
    
    this.consultarTiendas = function(id) {
        var q = $q.defer();

        $http.get(SERVER_URL_ONE_LIBRO_USER + libros[id].isbn + '/tiendas', {})
            .then(
                function(response) {
                    q.resolve(response.data);
                },
                function(err) {
                    q.reject(err);
                }
            );

        return q.promise;
    }
}

angular.module('LibrosApp').service('LibrosService', ['$http', '$q', 'LoginService', LibrosService]);
