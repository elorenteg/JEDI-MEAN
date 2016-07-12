var LayoutCtrl = function($scope, $state, LoginService, LibrosService, TiendasService) {
    $scope.pageName = function() {
        if ($state.includes('login')) return "Login";
        else return "Listado de Libros";
    };

    $scope.logout = function() {
        LoginService.logout();
        LibrosService.reset();
        TiendasService.reset();
        $state.go('login');
    };

    $scope.showLogout = function() { return !$state.includes('login'); }
};


angular.module('LibrosApp').controller('LayoutCtrl', ['$scope', '$state', 'LoginService', 'LibrosService', 'TiendasService', LayoutCtrl]);
