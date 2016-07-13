// Este controlador es para el dialog de añadir una tarea
angular.module('LibrosApp').controller('createLibroDialogController',
    ['$scope', '$mdDialog', 'LibrosService', 'TiendasService', 'ToastService',
        function ($scope, $mdDialog, LibrosService, TiendasService, ToastService) {
    $scope.titulo = '';
    $scope.isbn = '';
    $scope.precio = '';
    $scope.descripcion = '';

    $scope.cancel = function() {
        // Cierra el dialog
        $mdDialog.cancel();
    }

    $scope.answer = function() {
        // Usamos tareasService para añadir la tarea (asíncrono)
        LibrosService.anadirLibro({
            titulo: $scope.titulo,
            isbn: $scope.isbn,
            precio: $scope.precio,
            descripcion: $scope.descripcion
        }).then(
            function() {
                ToastService.showToast("Libro añadido correctamente");
                $mdDialog.hide();
            },
            function(err) {
                ToastService.showToast("Ha ocurrido un error al añadir el libro. Vuelvelo a intentar");
                $mdDialog.hide();
            }
        );
    }
}]);

angular.module('LibrosApp').controller('createTiendaDialogController',
    ['$scope', '$mdDialog', 'LibrosService', 'TiendasService', 'ToastService',
        function ($scope, $mdDialog, LibrosService, TiendasService, ToastService) {
    $scope.titulo = '';

    $scope.cancel = function() {
        // Cierra el dialog
        $mdDialog.cancel();
    }

    $scope.answer = function() {
        // Usamos tareasService para añadir la tarea (asíncrono)
        TiendasService.anadirTienda({
            sigla: $scope.sigla,
            nombre: $scope.nombre,
            direccion: $scope.direccion
        }).then(
            function() {
                ToastService.showToast("Tienda añadida correctamente");
                $mdDialog.hide();
            },
            function(err) {
                ToastService.showToast("Ha ocurrido un error al añadir la tienda. Vuelvelo a intentar");
                $mdDialog.hide();
            }
        );
    }
}]);

angular.module('LibrosApp').controller('createStockDialogController',
    ['$scope', '$mdDialog', 'libros', 'idTienda', 'LibrosService', 'TiendasService', 'ToastService',
        function ($scope, $mdDialog, libros, idTienda, LibrosService, TiendasService, ToastService) {
    $scope.libros = libros;
    $scope.idTienda = idTienda;

    $scope.cancel = function() {
        // Cierra el dialog
        $mdDialog.cancel();
    }

    $scope.answer = function() {
        // Usamos tareasService para añadir la tarea (asíncrono)
        TiendasService.anadirStock($scope.idTienda, {
            isbn: $scope.libroStock,
            stock: $scope.stock
        }).then(
            function() {
                ToastService.showToast("Stock añadido correctamente");
                $mdDialog.hide();
            },
            function(err) {
                ToastService.showToast("Ha ocurrido un error al añadir la tienda. Vuelvelo a intentar");
                $mdDialog.hide();
            }
        );
    }
}]);

angular.module('LibrosApp').controller('getStockDialogController',
    ['$scope', '$mdDialog', 'infoLibros', 'idTienda', 'LibrosService', 'TiendasService', 'ToastService',
        function ($scope, $mdDialog, infoLibros, idTienda, LibrosService, TiendasService, ToastService) {
    $scope.infoLibros = infoLibros;
    $scope.idTienda = idTienda;

    $scope.cancel = function() {
        // Cierra el dialog
        $mdDialog.cancel();
    }

    // Si no hay tareas mostramos un mensaje
    $scope.mostrarMensajeNoStock = function() {
        return ($scope.infoLibros == null || $scope.infoLibros.length === 0);
    }
}]);

// Este es el del estado de tareas
var AdministracionCtrl = function($scope, LibrosService, TiendasService, ToastService, $mdDialog) {
    
    // LIBROS
    
    $scope.libros = [{titulo: 'hola', isbn:'1', precio:'1'}];

    // Usamos TareasService (definido por nosotros) para obtener las tareas
    // Notad que es asíncrono, por eso usamos la promise
    LibrosService.getLibros().then(function(libros) {
        $scope.libros = libros;
    }, function(err) {
        ToastService.showToast("Se ha producido un error al cargar los libros");
    });

    // Si no hay tareas mostramos un mensaje
    $scope.mostrarMensajeNoLibros = function() {
        return $scope.libros == null || $scope.libros.length === 0;
    }

    $scope.eliminarLibro = function() {
        //return $scope.libros == null || $scope.libros.length === 0;
    }

    // Cuando se pulsa el boton de añadir tarea abrimos un dialog
    // con el servicio $mdDialog que nos da angular-material
    $scope.mostrarDialogLibro = function(event) {
        $mdDialog.show({
            controller: 'createLibroDialogController',
            templateUrl: 'views/partials/auth_protected/add-libro.html',
            parent: angular.element(document.body),
            targetEvent: event
        });
    };

    $scope.eliminarLibro = function(id) {
        LibrosService.eliminarLibro(id).then(
            function(libros) {
                $scope.libros = libros;
            }, function(err) {
                ToastService.showToast("Se ha producido un error, intentalo más tarde");
            });
    }
    
    // TIENDAS
    
    $scope.tiendas = [];
    
    TiendasService.getTiendas().then(
        function(tiendas) {
            $scope.tiendas = tiendas;
        }, function(err) {
            ToastService.showToast("Se ha producido un error al cargar las tiendas");
        });
    
    $scope.mostrarMensajeNoTiendas = function() {
        return $scope.tiendas == null || $scope.tiendas.length === 0;
    }
    
    $scope.mostrarDialogTienda = function(event) {
        $mdDialog.show({
            controller: 'createTiendaDialogController',
            templateUrl: 'views/partials/auth_protected/add-tienda.html',
            parent: angular.element(document.body),
            targetEvent: event
        });
    };

    $scope.eliminarTienda = function(id) {
        TiendasService.eliminarTienda(id).then(
            function(tiendas) {
                $scope.tiendas = tiendas;
            }, function(err) {
                ToastService.showToast("Se ha producido un error, intentalo más tarde");
            });
    }

    $scope.anadirStock = function(id) {
        $mdDialog.show({
            controller: 'createStockDialogController',
            templateUrl: 'views/partials/auth_protected/add-stock.html',
            parent: angular.element(document.body),
            targetEvent: event,
            locals: {
                idTienda: id,
                libros: $scope.libros
            }
        });
    }

    $scope.consultarStock = function(id) {
        // Usamos tareasService para añadir la tarea (asíncrono)
        TiendasService.consultarStock(id).then(
            function(infoLibros) {
                ToastService.showToast("Consulta de stock realizada correctamente");
                $mdDialog.show({
                    controller: 'getStockDialogController',
                    templateUrl: 'views/partials/auth_protected/get-stock.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    locals: {
                        idTienda: id,
                        infoLibros: infoLibros
                    }
                });
            },
            function(err) {
                ToastService.showToast("Se ha producido un error, intentalo más tarde");
            }
        );
    }
};

angular.module('LibrosApp').controller('AdministracionCtrl', ['$scope', 'LibrosService', 'TiendasService', 'ToastService', '$mdDialog', AdministracionCtrl]);
