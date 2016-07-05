var App = angular.module('FormsApp', []);

var usuarios = [
    {
        email: "admin@gmail.com",
        password: "12345"
    },
    {
        email: "qwerty@gmail.com",
        password: "12345"
    }
];

App.controller('FormsController', ['$scope', function($scope) {
    $scope.loginError = false;
    $scope.stateLogin = null;
    initLogin();
    
    $scope.entrar = function () {
        var usuario = {
            email: $scope.correo, 
            password: $scope.pass
        }
        console.log(usuario);
        if (validLogin(usuario)) {
            initLogin();
            $scope.stateLogin = "login_ok";
        }
        else if(validName(usuario)) {
            initLogin();
            $scope.stateLogin = "login_name_no_ok";
        }
        else {
            $scope.pass = null;
            $scope.stateLogin = "login_no_ok";
        }
        $scope.loginError = true;
    }
    $scope.registrar = function () {
        var usuario = {
            email: $scope.correo, 
            password: $scope.pass
        }
        if (!validName(usuario)) {
            usuarios.push(usuario);
            initLogin();
            $scope.stateLogin = "registro_ok";
        }
        else {
            $scope.stateLogin = "registro_no_ok";
        }
        $scope.loginError = true;
    }
    
    function initLogin() {
        $scope.correo = '';
        $scope.pass = '';
    }
    
    function validLogin(usuario) {
        for (i = 0; i < usuarios.length; ++i) {
            if (JSON.stringify(usuarios[i]) === JSON.stringify(usuario)) return true;
        }
        return false;
    }
    function validName(usuario) {
        var ind = usuarios.map(function(u) { return u.email; }).indexOf(usuario.email);
        return ind !== -1;
    }
}]);