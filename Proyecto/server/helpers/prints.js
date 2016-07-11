var log = require('winston');
var colors = require('colors');

module.exports = {
    
    errorMessage: function(mss, error, res, nerror) {
        res.status(nerror).send(error);
    },
    
    jsonMessage: function(mss, json, res, nerror) {
        res.status(nerror).send(json);
    },

    consoleError: function(mss) {
        errorMessageColor(mss);
    },

    consoleInfo: function(mss) {
        infoMessageColor(mss);
    }
};

function errorMessageColor(mss) {
        console.log(("Error: " + mss).red);
}

function infoMessageColor(mss) {
        console.log(("Info: " + mss).cyan);
}