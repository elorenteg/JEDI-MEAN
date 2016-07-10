var log = require('winston');
var colors = require('colors');

var STATUS_OK = 200;
var STATUS_ERROR = 500;

module.exports = {
    
    errorMessage: function(mss, error, res) {
        res.status(500).send(error);
        errorMessageColor(mss);
    },
    
    jsonMessage: function(mss, json, res) {
        res.status(200).send(json);
        infoMessageColor(mss);
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