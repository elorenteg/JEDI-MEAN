// Este es el del estado de tareas
var MainCtrl = function($scope, $window, ToastService, $mdDialog, $state) {
    $scope.tabs = mainTabs($window.sessionStorage.isAdmin);
    
    $scope.selectedIndex = indexSelected($scope.tabs, $state.current);
};

function indexSelected(tabs, estat) {
    var index = tabs.map(function(d) { return d['nomEstat']; }).indexOf(estat.name);
    return index;
}

function mainTabs(isAdmin) {
    var tabs = [
        { title: 'Comprar', nomEstat: 'comprar' },
        { title: 'Pedidos', nomEstat: 'pedidos' },
        { title: 'Administración', nomEstat: 'administracion' }
    ];
    
    if (isAdmin === 'false') tabs.splice(tabs.length-1, 1);
    
    return tabs;
}


angular.module('LibrosApp').controller('MainCtrl', ['$scope', '$window', 'ToastService', '$mdDialog', '$state', MainCtrl]);
