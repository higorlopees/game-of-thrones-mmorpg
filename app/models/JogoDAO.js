function JogoDAO(connection){
    this._connection = connection;
}

JogoDAO.prototype.gerarParametros = function(usuario, callback){
    const dados = {
        operation: "insert",
        insert: {
            usuario: usuario,
            moeda: 15,
            suditos: 10,
            temor: Math.floor(Math.random()*1000),
            sabedoria: Math.floor(Math.random()*1000),
            comercio: Math.floor(Math.random()*1000),
            magia: Math.floor(Math.random()*1000)
        },
        collection: "jogo",
        callback: callback
    }

    this._connection(dados);
}

JogoDAO.prototype.iniciaJogo = function(usuario, callback){
    const dados = {
        operation: "find",
        where: {
            usuario: usuario
        },
        collection: "jogo",
        callback: callback
    }

    this._connection(dados);
}

JogoDAO.prototype.valida_acao = function(dadosForm, callback){
    const dados = {
        operation: "find",
        where: {
            usuario: dadosForm.usuario
        },
        collection: "jogo",
        callback: callback,
        dadosForm: dadosForm
    }

    this._connection(dados);
}

JogoDAO.prototype.executa_acao = function(dadosForm, callback){
    const dadosAcao = {
        operation: "insert",
        insert: dadosForm,
        collection: "acao",
        callback: callback
    }

    this._connection(dadosAcao);
}

JogoDAO.prototype.atualiza_moedas_e_suditos = function(dadosForm, callback){
    const dadosJogo = {
        operation: "update",
        where: { usuario: dadosForm.usuario },
        update: { $inc: { moeda: dadosForm.moedas, suditos: (dadosForm.quantidade*-1) } },
        collection: "jogo",
        callback: callback
    }

    this._connection(dadosJogo);
}

JogoDAO.prototype.getAcoes = function(usuario, callback){
    const date = new Date();
    let momento_atual = date.getTime();
    
    const dados = {
        operation: "find",
        where: {
            usuario: usuario,
            acao_termina_em: {
                $gt: momento_atual
            }
        },
        collection: "acao",
        callback: callback
    }

    this._connection(dados);
}

JogoDAO.prototype.getJogo = function(usuario, callback){
    const dados = {
        operation: "find",
        where: {
            usuario: usuario
        },
        collection: "jogo",
        callback: callback
    }

    this._connection(dados);
}

JogoDAO.prototype.revogarAcao = function(_id, callback){
    var ObjectId = require('mongodb').ObjectId;

    const dados = {
        operation: "delete",
        where: { _id: ObjectId(_id) },
        collection: "acao",
        callback: callback
    }

    this._connection(dados)
}

module.exports = function(){
    return JogoDAO;
}