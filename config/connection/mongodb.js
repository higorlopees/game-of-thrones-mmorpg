// importar o mongodb
const MongoClient  = require('mongodb').MongoClient;
const assert = require("assert");

const connMongoDb = function(dados){
    MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, function(err, client){
        assert.equal(null, err);
        const db = client.db("got");
        query(db, dados);
        client.close();
    });
}

function query(db, dados){
    const collection = db.collection(dados.collection);
    switch(dados.operation){
        case "insert":
            collection.insertOne(dados.insert, dados.callback);
            break;
        case "find":
            collection.find(dados.where).toArray(dados.callback);
            break;
        case "update":
            collection.updateOne(dados.where, dados.update, dados.callback);
            break;
        case "delete":
            collection.deleteOne(dados.where, dados.callback);
    }
}

module.exports = function(){
    return connMongoDb;
}