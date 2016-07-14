
ComprasService = function($http, $q, $window, LoginService) {
    var SERVER_URL_COMPRAR = "http://localhost:8080/api/usuario/comprar/"
    var SERVER_URL_COMPRAS = "http://localhost:8080/api/usuario/compras/"
    
    var self = this;

    var compras = null;

    this.reset = function() {
        compras = null;
    };

    this.getCompras = function(email) {
        var q = $q.defer();

        // Obtiene el usuario del servidor
        $http.get(SERVER_URL_COMPRAS + email, {})
            .then(
                function(response) {
                    // Y asignamos la variable local user a los datos obtenidos
                    compras = response.data;
                    q.resolve(compras);
                },
                function(err) {
                    q.reject(err);
                }
            );

        return q.promise;
    }
    
    this.comprarLibro = function(info) {
        var q = $q.defer();
        
        $http.patch(SERVER_URL_COMPRAR + $window.sessionStorage.email + '/tienda/' + info.siglaTienda + '/libro/' + info.isbnLibro)
            .then(
                function(response) {
                    compras.push(response.data);
                    q.resolve(compras);
                },
                function(err) {
                    q.reject(err);
                }
            );

        return q.promise;
    };
}

angular.module('LibrosApp').service('ComprasService', ['$http', '$q', '$window', 'LoginService', ComprasService]);
