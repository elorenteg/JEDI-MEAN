var LayoutCtrl = function($scope, $state, LoginService, TareasService) {
    $scope.pageName = function() {
        if ($state.includes('login')) return "Login";
        else return "Listado de Libros";
    };

    $scope.logout = function() {
        LoginService.logout();
        TareasService.reset();
        $state.go('login');
    };

    $scope.showLogout = function() { return !$state.includes('login'); }
};


angular.module('LibrosApp').controller('LayoutCtrl', ['$scope', '$state', 'LoginService', 'TareasService', LayoutCtrl]);
