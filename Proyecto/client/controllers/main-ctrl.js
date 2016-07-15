// Este es el del estado de tareas
var MainCtrl = function($scope, $window, LoginService, ToastService, $mdDialog, $state) {
    $scope.tabs = [
        { title: 'Comprar', nomEstat: 'comprar' },
        { title: 'Pedidos', nomEstat: 'pedidos' }
    ];
            
    $scope.selectedIndex = indexSelected($scope.tabs, $state.current);
    
    LoginService.getUser()
        .then(function(usuario) {
            var tabs = [
                { title: 'Comprar', nomEstat: 'comprar' },
                { title: 'Pedidos', nomEstat: 'pedidos' },
                { title: 'Administración', nomEstat: 'administracion' }
            ];
            if (usuario.isAdmin === false) tabs.splice(tabs.length-1, 1);
            
            $scope.tabs = tabs;
            $state.go('comprar');
            $scope.selectedIndex = indexSelected($scope.tabs, $state.current);
            
        }, function(err) {
        });
};

function indexSelected(tabs, estat) {
    var index = tabs.map(function(d) { return d['nomEstat']; }).indexOf(estat.name);
    return index;
}


angular.module('LibrosApp').controller('MainCtrl', ['$scope', '$window', 'LoginService', 'ToastService', '$mdDialog', '$state', MainCtrl]);
