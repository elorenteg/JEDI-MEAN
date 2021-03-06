angular.module('LibrosApp').config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
    .state('layout', {
        abstract: true,
        templateUrl: '/views/partials/layout.html',
        controller: 'LayoutCtrl'
    })
    .state('login', {
        parent: 'layout',
        templateUrl: 'views/partials/login.html',
        url: '/login',
        controller: 'LoginCtrl'
    })
    .state('main', {
        abstract: true,
        parent: 'layout',
        templateUrl: 'views/partials/auth_protected/main.html',
        controller: 'MainCtrl'
    })
    
    .state('comprar', {
        parent: 'main',
        templateUrl: 'views/partials/auth_protected/comprar.html',
        url: '/comprar',
        controller: 'ComprarCtrl'
    })
    .state('pedidos', {
        parent: 'main',
        templateUrl: 'views/partials/auth_protected/pedidos.html',
        url: '/pedidos',
        controller: 'PedidosCtrl'
    })
    .state('administracion', {
        parent: 'main',
        templateUrl: 'views/partials/auth_protected/administracion.html',
        url: '/administracion',
        controller: 'AdministracionCtrl'
    });

    // Cuando la ruta a la que acceda el usuario no sea ninguna
    // de las definidas arriba, redirigimos al login
    $urlRouterProvider.otherwise('/login');

    // Con esto evitamos que salga el # siempre en la url
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

}]);

// Un .run se ejecuta cuando la aplicación de angular se ha configurado y ya está corriendo
angular.module('LibrosApp').run(['$rootScope', 'LoginService', '$state', function($rootScope, LoginService, $state) {
    // Aquí le decimos que cuando se empiece a cambiar de estado de ui-router
    // Nos compruebe que el usuario está logueado, y si no lo está y el estado requiere
    // autenticación (es diferente de login) entonces redireccionamos al estado login
    // Esto hace que si el usuario no está logueado se le redireccione al login
    // cuando por ejemplo acceda a /tareas
    $rootScope.$on("$stateChangeStart", function(event, next) {
        if (!LoginService.isLoggedIn() && next.name !== "login") {
            event.preventDefault();
            $state.go("login");
        }
    });
}]);
