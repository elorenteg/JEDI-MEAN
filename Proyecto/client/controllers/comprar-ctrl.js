angular.module('LibrosApp').controller('getTiendasDialogController',
    ['$scope', '$mdDialog', 'idLibro', 'infoTiendas', 'LibrosService', 'TiendasService', 'ToastService',
        function ($scope, $mdDialog, idLibro, infoTiendas, LibrosService, TiendasService, ToastService) {
    $scope.infoTiendas = infoTiendas;
    $scope.idLibro = idLibro;

    $scope.cancel = function() {
        // Cierra el dialog
        $mdDialog.cancel();
    }

    // Si no hay tareas mostramos un mensaje
    $scope.mostrarMensajeNoTiendas = function() {
        return ($scope.infoTiendas == null || $scope.infoTiendas.length === 0);
    }
}]);

var ComprarCtrl = function($scope, LibrosService, TiendasService, ToastService, $mdDialog) {
    
    $scope.libros = [];
    $scope.librosFiltrados = [];

    // Usamos TareasService (definido por nosotros) para obtener las tareas
    // Notad que es asíncrono, por eso usamos la promise
    LibrosService.getLibros().then(function(libros) {
        $scope.libros = libros;
        $scope.librosFiltrados = libros;
    }, function(err) {
        ToastService.showToast("Se ha producido un error al cargar los libros");
    });

    // Si no hay tareas mostramos un mensaje
    $scope.mostrarMensajeNoLibros = function() {
        return $scope.libros == null || $scope.libros.length === 0;
    }
    
    $scope.filtrarLibros = function() {
        $scope.librosFiltrados = $scope.libros;
        
        $scope.librosFiltrados = $scope.librosFiltrados.filter(function (el) {
            var passFilter = true;
            if (validFilter($scope.isbn)) passFilter = passFilter && (el.isbn.indexOf($scope.isbn) > -1);
            if (validFilter($scope.titulo)) passFilter = passFilter && (el.titulo.toLowerCase().indexOf($scope.titulo.toLowerCase()) > -1);
            if (validFilter($scope.minPrecio)) passFilter = passFilter && (el.precio >= $scope.minPrecio);
            if (validFilter($scope.maxPrecio)) passFilter = passFilter && (el.precio <= $scope.maxPrecio);
            return passFilter;
        });
    }
    
    $scope.consultarTiendas = function(id) {
        console.log("Entro");
        LibrosService.consultarTiendas(id).then(
            function(infoTiendas) {
                ToastService.showToast("Consulta de tiendas realizada correctamente");
                $mdDialog.show({
                    controller: 'getTiendasDialogController',
                    templateUrl: 'views/partials/auth_protected/get-tiendas.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    locals: {
                        idLibro: id,
                        infoTiendas: infoTiendas
                    }
                });
            },
            function(err) {
                ToastService.showToast("Se ha producido un error, intentalo más tarde");
            }
        );
    }
};

function validFilter(value) {
    if (value === null || value === undefined) return false;
    return true;
}

angular.module('LibrosApp').controller('ComprarCtrl', ['$scope', 'LibrosService', 'TiendasService', 'ToastService', '$mdDialog', ComprarCtrl]);
