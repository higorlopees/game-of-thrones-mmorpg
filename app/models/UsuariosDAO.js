const crypto = require('crypto');

function UsuariosDAO(connection){
    this._connection = connection;
}

UsuariosDAO.prototype.inserirUsuario = function(dadosForm, callback){
    dadosForm.senha = crypto.createHash("md5").update(dadosForm.senha).digest("hex");

    const dados = {
        operation: "insert",
        insert: dadosForm,
        collection: "usuarios",
        callback: callback
    }

    this._connection(dados);
}

UsuariosDAO.prototype.autenticar = function(dadosForm, callback){
    dadosForm.senha = crypto.createHash("md5").update(dadosForm.senha).digest("hex");

    const dados = {
        operation: "find",
        where: dadosForm,
        collection: "usuarios",
        callback: callback
    }

    this._connection(dados);
}

module.exports = function(){
    return UsuariosDAO;
}