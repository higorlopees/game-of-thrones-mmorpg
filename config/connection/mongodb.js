// importar o mongodb
const MongoClient  = require('mongodb').MongoClient;

// var connMongoDb = function(){
//     var db = new mongodb.Db(
//         'got',
//         new mongodb.Server(
//             'localhost',
//             27017,
//             {}
//         ),
//         {}
//     );
//     return db;
// }

var connMongoDb = function(){
    const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true });
    return client;
}

module.exports = function(){
    return connMongoDb;
}