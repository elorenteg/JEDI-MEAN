
var colors = require('colors');
var modulo_1 = require('./modulo_1');
var modulo_2 = require('./modulo_2');
var glob = require("glob")

var index = 0;

var intervalId = setInterval(function(){
    if (index > 3) process.exit(1);
    else console.log('\nMODULO ' + index + ' --------------------------');
    
    if (index == 0) {
        console.log('Bienvenido a la comunidad Jedi'.blue);
        console.log('Bienvenido al lado oscuro'.red);
    }
    else if (index == 1) {
        modulo_1();
    }
    else if (index == 2) {
        // Llegeix els fitxers .js
        modulo_2(__dirname);
    }
    else if (index == 3) {
        // LLista els fitxers .js del directori
        glob(__dirname + '/' + '*.js', function (er, files) {
            for (var i in files) {
                var FILE_PATH = files[i];
                var splitted = FILE_PATH.split('/');
                var FILE_NAME = splitted[splitted.length-1];
                console.log(FILE_NAME);
            }
        })
    }
        
    index++;
},1);