// Este es el del estado de tareas
var ComprarCtrl = function($scope, LibrosService, TiendasService, ToastService, $mdDialog) {
    
    $scope.libros = [];
    $scope.librosFiltrados = [];

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
    
    $scope.filtrarLibros = function() {
        $scope.librosFiltrados = $scope.libros;
        
        $scope.librosFiltrados = $scope.librosFiltrados.filter(function (el) {
            console.log(el.isbn === $scope.isbn);
            return el.isbn === $scope.isbn;
        });
        
    }
};

angular.module('LibrosApp').controller('ComprarCtrl', ['$scope', 'LibrosService', 'TiendasService', 'ToastService', '$mdDialog', ComprarCtrl]);
