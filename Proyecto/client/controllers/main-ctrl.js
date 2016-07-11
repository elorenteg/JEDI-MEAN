// Este es el del estado de tareas
var MainCtrl = function($scope, ToastService, $mdDialog, $state) {
    $scope.tabs = [
        { title: 'Comprar', nomEstat: 'comprar' },
        { title: 'Pedidos', nomEstat: 'pedidos' },
        { title: 'Administración', nomEstat: 'administracion' }
    ];
    
    $scope.selectedIndex = indexSelected($scope.tabs, $state.current)
};

function indexSelected(tabs, estat) {
    var index = tabs.map(function(d) { return d['nomEstat']; }).indexOf(estat.name);
    return index;
}

angular.module('LibrosApp').controller('MainCtrl', ['$scope', 'ToastService', '$mdDialog', '$state', MainCtrl]);
