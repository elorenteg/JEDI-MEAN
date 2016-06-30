var http = require('http');
var log = require('winston');
var url = require('url');
var Mongodb = require('mongodb');
var MongoClient = Mongodb.MongoClient;

var DB_URI = "mongodb://localhost:27017/lightsaber";
var db = null;

// color, propietat, ID
keysSabers = ['color', 'owner', 'id'];

function differenceKeys(info) {
    keys = Object.keys(info);
    difference = keys.filter(function(i) {
        return keysSabers.indexOf(i) < 0;
    });
    
    return (difference);
}

function checkKeys(info, res) {
    var difference = differenceKeys(info);
    var keysCorrect = difference.length === 0;
    
    if (!keysCorrect) {
        res.end("Trying to use keys not for lightsaber: " + difference + 
            "\nValid keys: " + keysSabers);
        log.error("Trying to use keys not for lightsaber: " + difference);
    }
    
    return keysCorrect;
}

function insertLightsaber(lightsaberInfo, collection, res) {
    collection.insert(lightsaberInfo, function(err, result) {
        if (err) {
            res.end("Couldn't add that lightsaber:" + err);
            log.error("Couldn't add that lightsaber:" + err);
        }
        else res.end("true");
    });
}

function getLightsaber(query, collection, res) {
    collection.find(query).toArray(function (err, result) {
        if (err) {
            res.end("Error retrieveing lightsaber/s: " + err);
            log.error("Error retrieveing lightsaber/s: " + err);
        }
        else res.end(JSON.stringify(result));
    });
}

function checkConnectedToDB(res) {
    var connected = db !== null;
    if (!connected) res.end("Not yet connected to database");
    return connected;
}

function checkUrlPath(path, res) {
    var isCorrect = path === '/lightsaber';
    if (!isCorrect) res.end("Wrong url!");
    return isCorrect;
}

//Nos conectamos a la BD
MongoClient.connect(DB_URI, function(err, database) {
    if (err) log.error("Error connecting to database with uri: " + DB_URI);
    else {
        log.info("Successfully connected to database");
        db = database;
    }
});

http.createServer(function(req, res) {
    
    //Funciones para comprobar que estamos conectados a la BD 
    //y que la url es valida
    if (!checkConnectedToDB(res)) return false;
    var parsedUrl = url.parse(req.url, true);
    if (!checkUrlPath(parsedUrl.pathname, res)) return false;
    if (!checkKeys(parsedUrl.query, res)) return false;

    //Peticiones HTTP
    var collection = db.collection('lightsaber');
    switch (req.method) {
        case 'POST': insertLightsaber(parsedUrl.query, collection, res); break;
        case 'GET': getLightsaber(parsedUrl.query, collection, res); break;
        default: res.end("Invalid method!");
    }

    return true;
}).listen(8080);
