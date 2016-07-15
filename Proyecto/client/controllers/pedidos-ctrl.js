var PedidosCtrl = function($scope, $window, ComprasService, ToastService, $mdDialog) {
    
    $scope.compras = [];

    // Usamos TareasService (definido por nosotros) para obtener las tareas
    // Notad que es asíncrono, por eso usamos la promise
    ComprasService.getCompras().then(function(compras) {
        $scope.compras = compras;
    }, function(err) {
        ToastService.showToast("Se ha producido un error al cargar los libros");
    });

    // Si no hay tareas mostramos un mensaje
    $scope.mostrarMensajeNoCompras = function() {
        return $scope.compras == null || $scope.compras.length === 0;
    }
};

angular.module('LibrosApp').controller('PedidosCtrl', ['$scope', '$window', 'ComprasService', 'ToastService', '$mdDialog', PedidosCtrl]);
