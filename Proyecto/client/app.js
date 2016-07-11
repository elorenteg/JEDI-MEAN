// Dependencias de nuestra aplicación de angular

// ngMaterial es un módulo que he usado para estilizar
// la página fácilmente. Es como bootstrap pero integrado en Angular.
var DEPENDENCIES = ['ngMaterial', 'ngMessages', 'ui.router'];

// Y declaramos el módulo de nuestra aplicación
angular.module('LibrosApp', DEPENDENCIES)
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('light-blue')
            .accentPalette('pink');
    });
