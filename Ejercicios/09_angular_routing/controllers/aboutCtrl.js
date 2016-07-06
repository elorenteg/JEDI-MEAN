var AboutCtrl = function($scope, $state) {
    
    $scope.goToAutor = function() {
        $state.go('aboutAutor');
    };
    
    $scope.goToPagina = function() {
        $state.go('aboutPagina');
    };
};


angular.module('RandomApp').controller('AboutCtrl', ['$scope', '$state', AboutCtrl]);