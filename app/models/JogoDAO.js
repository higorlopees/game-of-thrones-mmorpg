function JogoDAO(connection){
    this._connection = connection();
}

JogoDAO.prototype.gerarParametros = function(usuario){
    const client = this._connection;
    client.connect(function(err){
        const db = client.db('got');

        db.collection('jogo', function(err, collection){
            collection.insertOne({
                usuario: usuario,
                moeda: 15,
                suditos: 10,
                temor: Math.floor(Math.random()*1000),
                sabedoria: Math.floor(Math.random()*1000),
                comercio: Math.floor(Math.random()*1000),
                magia: Math.floor(Math.random()*1000)
            }, function(err, result){
                client.close();
            });
        });
    });
}

JogoDAO.prototype.iniciaJogo = function(res, usuario, casa, msg){
    const client = this._connection;
    client.connect(function(err){
        const db = client.db('got');

        db.collection('jogo', function(err, collection){
            collection.find({ usuario: usuario }).toArray(function(err, result){
                res.render('jogo', { img_casa: casa, jogo: result[0], msg: JSON.stringify(msg) });
            });
            client.close();
        })
    });
}

JogoDAO.prototype.valida_moedas = function(dadosForm, callback){
    const client = this._connection;
    client.connect(function(err){
        const db = client.db('got');

        db.collection('jogo', function(err, collection){
            var moedas = null;

            switch(dadosForm.acao){
                case '1': 
                    moedas = -2 * dadosForm.quantidade;
                    break;
                case '2': 
                    moedas = -3 * dadosForm.quantidade;
                    break;
                case '3': 
                    moedas = -1 * dadosForm.quantidade;
                    break;
                case '4': 
                    moedas = -1 * dadosForm.quantidade;
                    break;
            }

            dadosForm.moedas = moedas;

            collection.find({ usuario: dadosForm.usuario }).toArray(function(err, result){
                client.close();
                callback(result, dadosForm);
            });

        });
    });
}

JogoDAO.prototype.acao = function(dadosForm, callback){
    const client = this._connection;
    client.connect(function(err){
        const db = client.db('got');

        db.collection('acao', function(err, collection){
            var date = new Date();
            var tempo = 0;

            switch(dadosForm.acao){
                case '1': 
                    tempo = 1 * 60 * 60000;
                    break;
                case '2': 
                    tempo = 2 * 60 * 60000;
                    break;
                case '3': 
                    tempo = 5 * 60 * 60000;
                    break;
                case '4': 
                    tempo = 5 * 60 * 60000;
                    break;
            }

            dadosForm.acao_termina_em = date.getTime() + tempo;

            collection.insertOne(dadosForm, function(err, result){
                db.collection('jogo', function(err, collection){
                    collection.updateOne({ usuario: dadosForm.usuario }, { $inc: { moeda: dadosForm.moedas } }, function(err, result){
                        client.close();
                        callback();
                    });
                });
            });
        });
    });
}

JogoDAO.prototype.getAcoes = function(usuario, callback){
    const client = this._connection;
    client.connect(function(err){
        const db = client.db('got');

        db.collection('acao', function(err, collection){
            var date = new Date();
            var momento_atual = date.getTime();

            collection.find({ usuario: usuario, acao_termina_em: {$gt: momento_atual} }).toArray(function(err, result){
                callback(result);
            });
            client.close();
        })
    });
}

JogoDAO.prototype.revogarAcao = function(_id, callback){
    var ObjectId = require('mongodb').ObjectId;
    const client = this._connection;
    client.connect(function(err){
        const db = client.db('got');

        db.collection('acao', function(err, collection){
            collection.deleteOne({ _id: ObjectId(_id) }, function(err, result){
                client.close();
                callback();
            });
        });
    });
}

module.exports = function(){
    return JogoDAO;
}