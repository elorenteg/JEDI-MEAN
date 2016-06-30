
var fs = require('fs');
//var log = require('log');

module.exports = function(PATH) {
    var num_fitxers = readContentPath(PATH);
    console.log('Num files: ' + num_fitxers);
}

readContentPath = function(PATH) {
    var num_fitxers = 0;
    
    // Lectura sincrona
    var files = fs.readdirSync(PATH);
    for (var i in files) {
        var FILE_NAME = files[i];
        var FILE_PATH = PATH + '/' + FILE_NAME;
        
        var is_dir = fs.lstatSync(FILE_PATH).isDirectory();
        var is_file = fs.lstatSync(FILE_PATH).isFile();
        
        var FILE_CONTENT;
        var print_file = false;
        
        if (is_dir) {
            var numf = readContentPath(FILE_PATH);
            num_fitxers += numf;
        }
        else if (is_file) {
            var splitted = FILE_NAME.split('.');
            var end = splitted[splitted.length-1];
            if (end === 'js') print_file = true;
        }
        else {
        }
        
        if (print_file) {
            FILE_CONTENT = fs.readFileSync(FILE_PATH, 'utf-8');
            console.log(FILE_NAME);
            console.log(FILE_CONTENT);
            console.log('-----------------------------------');
            
            num_fitxers++;
        }
    }
    
    return num_fitxers;
}