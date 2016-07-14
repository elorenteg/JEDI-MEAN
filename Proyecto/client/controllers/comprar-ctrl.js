angular.module('LibrosApp').controller('getTiendasDialogController',
    ['$scope', '$mdDialog', 'isbnLibro', 'infoTiendas', 'LibrosService', 'TiendasService', 'ComprasService', 'ToastService',
        function ($scope, $mdDialog, isbnLibro, infoTiendas, LibrosService, TiendasService, ComprasService, ToastService) {
    $scope.infoTiendas = infoTiendas;
    $scope.isbnLibro = isbnLibro;

    $scope.cancel = function() {
        $scope.compraOK = false;
        $scope.isCompra = false;
        // Cierra el dialog
        $mdDialog.cancel();
    }

    // Si no hay tareas mostramos un mensaje
    $scope.mostrarMensajeNoTiendas = function() {
        return ($scope.infoTiendas == null || $scope.infoTiendas.length === 0);
    }
    
    $scope.isCompra = false;
    $scope.compraOK = false;
    $scope.mostrarTiendas = function() {
        return $scope.isCompra === false;
    }
    $scope.compraCorrecta = function() {
        return $scope.compraOK === true;
    }

    // Si no hay tareas mostramos un mensaje
    $scope.comprarLibro = function(idTienda) {
        $scope.isCompra = true;
        
        var siglaTienda = infoTiendas[idTienda].sigla;
        ComprasService.comprarLibro({
            siglaTienda: siglaTienda,
            isbnLibro: isbnLibro
        }).then(
            function(compras) {
                ToastService.showToast("Compra realizada correctamente");
                $scope.infoTiendas = decreaseStock($scope.infoTiendas, siglaTienda);
                $scope.compraOK = true;
                //$mdDialog.hide();
            },
            function(err) {
                ToastService.showToast("Se ha producido un error, intentalo más tarde");
                $scope.compraOK = false;
                //$mdDialog.hide();
            }
        );
    }
    
    $scope.hasStock = function(id) {
        return (infoTiendas[i].stock > 0);
    }
    
}]);

function decreaseStock(infoTiendas, siglaTienda) {
    for(i = 0; i < infoTiendas.length; ++i) {
        if (infoTiendas[i].sigla === siglaTienda) infoTiendas[i].stock--;
    }
    
    return infoTiendas;
}


var ComprarCtrl = function($scope, $window, LibrosService, TiendasService, ComprasService, ToastService, $mdDialog) {
    
    $scope.libros = [];
    $scope.librosFiltrados = [];
    $scope.compras = [];

    // Usamos TareasService (definido por nosotros) para obtener las tareas
    // Notad que es asíncrono, por eso usamos la promise
    LibrosService.getLibros().then(function(libros) {
        $scope.libros = libros;
        $scope.librosFiltrados = libros;
    }, function(err) {
        ToastService.showToast("Se ha producido un error al cargar los libros");
    });
    
    ComprasService.getCompras($window.sessionStorage.email).then(function(compras) {
        $scope.compras = compras;
    }, function(err) {
        ToastService.showToast("Se ha producido un error al cargar las compras");
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
        LibrosService.consultarTiendas(id).then(
            function(infoTiendas) {
                ToastService.showToast("Consulta de tiendas realizada correctamente");
                $mdDialog.show({
                    controller: 'getTiendasDialogController',
                    templateUrl: 'views/partials/auth_protected/get-tiendas.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    locals: {
                        isbnLibro: $scope.librosFiltrados[id].isbn,
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

angular.module('LibrosApp').controller('ComprarCtrl', ['$scope', '$window', 'LibrosService', 'TiendasService', 'ComprasService', 'ToastService', '$mdDialog', ComprarCtrl]);
