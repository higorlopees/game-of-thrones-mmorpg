// importar o mongodb
const mongodb = require('mongodb');

var connMongoDb = function(){
    var db = new mongodb.Db(
        'got',
        new mongodb.Server(
            'localhost',
            27017,
            {}
        ),
        {}
    );
    return db;
}

module.exports = function(){
    return connMongoDb;
}