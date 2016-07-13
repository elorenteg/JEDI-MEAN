// Este es el del estado de tareas
var MainCtrl = function($scope, $window, ToastService, $mdDialog, $state) {
    $scope.tabs = mainTabs($window.sessionStorage.isAdmin);
    
    $scope.selectedIndex = 0;
};

function indexSelected(tabs, estat) {
    console.log(estat);
    var index = tabs.map(function(d) { return d['nomEstat']; }).indexOf(estat.name);
    return index;
}

function mainTabs(isAdmin) {
    console.log(isAdmin + typeof(isAdmin));
    var tabs = [
        { title: 'Comprar', nomEstat: 'comprar' },
        { title: 'Pedidos', nomEstat: 'pedidos' },
        { title: 'Administración', nomEstat: 'administracion' }
    ];
    
    if (isAdmin === 'false') tabs.splice(tabs.length-1, 1);
    
    return tabs;
}


angular.module('LibrosApp').controller('MainCtrl', ['$scope', '$window', 'ToastService', '$mdDialog', '$state', MainCtrl]);
