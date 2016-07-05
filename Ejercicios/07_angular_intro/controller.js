var App = angular.module('my_app' , []);

App.controller('my_app_controller', ['$scope', function($scope){
    $scope.selectorProducto = "Pieza";
    
    // Piezas
    initPieza();
    $scope.pieza_info = [];

    $scope.anadirPieza = function () {
        var pieza = {
            tipo: $scope.piezaTipo, 
            coste: $scope.piezaCoste,
            localizacion: $scope.piezaLocal,
            stock: $scope.piezaStock
        }
        $scope.pieza_info.push(pieza);
        initPieza();
    }
    $scope.borrarPieza = function () {
        initPieza();
    }
    $scope.eliminar_pieza = function(index) {
            $scope.pieza_info.splice(index, 1);
    }
    
    
    // Naves
    initNave();
    $scope.nave_info = [];
    
    $scope.anadirNave = function () {
        var nave = {
            modelo: $scope.naveModelo, 
            coste: $scope.naveCoste,
            velocidad: $scope.naveVelocidad,
            kilometros: $scope.naveKilometros
        }
        $scope.nave_info.push(nave);
        initNave();
    }
    $scope.borrarNave = function () {
        initNave();
    }
    $scope.eliminar_nave = function(index) {
            $scope.nave_info.splice(index, 1);
    }
    
    /////////////////////////////////////////////////////7

    function initPieza() {
        $scope.piezaTipo = null;
        $scope.piezaCoste = null;
        $scope.piezaLocalizacion = null;
        $scope.piezaStock = null;
    }
    
    function initNave() {
        $scope.naveModelo = null;
        $scope.naveCoste = null;
        $scope.naveVelocidad = null;
        $scope.naveKilometros = null;
    }
    
    function isAnyEmpty(elem) {
        for (member in elem) {
            if (elem[member] === null) return true;
        }
        return false;
    }
    
}]);