const crypto = require('crypto');

function UsuariosDAO(connection){
    this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function(usuario){
    const client = this._connection;
    client.connect(function(err){
        const db = client.db('got');

        db.collection('usuarios', function(err, collection){
            usuario.senha = crypto.createHash("md5").update(usuario.senha).digest("hex");

            collection.insertOne(usuario, function(err, result){
                client.close();
            });
        })
    });
}

UsuariosDAO.prototype.autenticar = function(dadosForm, req, res){
    const client = this._connection;
    client.connect(function(err){
        const db = client.db('got');

        db.collection('usuarios', function(err, collection){
            dadosForm.senha = crypto.createHash("md5").update(dadosForm.senha).digest("hex");

            collection.find(dadosForm).toArray(function(err, result){
                if(result[0] != undefined){
                    req.session.autorizado = true;
                    req.session.usuario = result[0].usuario;
                    req.session.casa = result[0].casa;
                    res.redirect('jogo');
                }else{
                    res.render('index',{ validacao: ['invalid_user_password'], dadosForm: {} });
                }
            });
            client.close();
        });
    });
}

module.exports = function(){
    return UsuariosDAO;
}