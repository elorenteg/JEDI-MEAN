TiendasService = function($http, $q, LoginService) {
    // Variable privada
    var SERVER_URL_ALL_TIENDA = "http://localhost:8080/api/admin/tiendas/"
    var SERVER_URL_ONE_TIENDA = "http://localhost:8080/api/admin/tienda/"
    
    var self = this;

    var tiendas = null;

    this.reset = function() {
        tiendas = null;
    };
    
    this.getTiendas = function() {
        var q = $q.defer();

        $http.get(SERVER_URL_ALL_TIENDA)
            .then(
                function(response) {
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

        $http.post(SERVER_URL_ONE_TIENDA, tienda)
            .then(
                function(response) {
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

        $http.delete(SERVER_URL_ONE_TIENDA + tiendas[id].sigla, {})
            .then(
                function(response) {
                    tiendas.splice(id,1);
                    q.resolve(tiendas);
                },
                function(err) {
                    q.reject(err);
                }
            );

        return q.promise;
    }
    
    this.anadirStock = function(id, libro) {
        var q = $q.defer();

        $http.patch(SERVER_URL_ONE_TIENDA + tiendas[id].sigla + '/anadirStock', libro)
            .then(
                function(response) {
                    q.resolve();
                },
                function(err) {
                    q.reject(err);
                }
            );

        return q.promise;
    }
    
    this.consultarStock = function(id) {
        var q = $q.defer();

        $http.get(SERVER_URL_ONE_TIENDA + tiendas[id].sigla, {})
            .then(
                function(response) {
                    q.resolve(response.data.libros);
                },
                function(err) {
                    q.reject(err);
                }
            );

        return q.promise;
    }
}

angular.module('LibrosApp').service('TiendasService', ['$http', '$q', 'LoginService', TiendasService]);
