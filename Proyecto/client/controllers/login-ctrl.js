var LoginCtrl = function($scope, LoginService, ToastService, $state) {
    $scope.user = {
        email: '',
        password: ''
    };

    // Para registrar el usuario
    $scope.register = function() {
        // Usamos nuestro servicio LoginService
        // Es asíncrono, por lo que debemos usar la promise, con
        // .then(funcion_todo_correcto, funcion_cuando_error)
        LoginService.register($scope.user)
            .then(function() {
                ToastService.showToast("Bienvenido " + $scope.user.email + ", te has registrado correctamente");
            }, function(err) {
                // Si ha habido error,
                console.log(err);
                // Discriminamos el error
                // Este code es el que devuelve mongoose cuando se viola la regla unique de email
                if (err.code === 11000) ToastService.showToast("El email ya existe");
                // Y este es el estado cuando el error es mas general (no sabemos exactamente)
                else if (err.status === 500) ToastService.showToast("Ha occurido un error, vuelvelo a intentar");
            });
    };

    $scope.login = function() {
        LoginService.login($scope.user)
            .then(function() {
                // Si todo correcto, vamos al estado tareas
                $state.go('comprar');
            }, function(err) {
                console.log(err);
                // Nuevamente discrimanos según el estado de la respuesta
                if (err.status === 401) ToastService.showToast("Contraseña incorrecta");
                else if (err.status === 404) ToastService.showToast("El email no existe");
                else if (err.status === 500) ToastService.showToast("Ha occurido un error, vuelvelo a intentar");
            });
    };
};


angular.module('LibrosApp').controller('LoginCtrl', ['$scope', 'LoginService', 'ToastService', '$state', LoginCtrl]);
