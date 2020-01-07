module.exports.index = function(application, req, res){
    res.render('index', { validacao: {}, dadosForm: {} });
}

module.exports.autenticar = function(application, req, res){
    var dadosForm = req.body;

    req.assert('usuario', 'Usuário não poder ser vazio').notEmpty();
    req.assert('senha', 'Senha não poder ser vazio').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.render('index', { validacao: erros, dadosForm: dadosForm });
        return;
    }

    var UsuariosDAO = new application.app.models.UsuariosDAO(application.config.connection.mongodb);

    UsuariosDAO.autenticar(dadosForm, function(err, result){
        if(result[0] != undefined){
            req.session.autorizado = true;
            req.session.usuario = result[0].usuario;
            req.session.casa = result[0].casa;
            res.redirect('jogo');
        }else{
            res.render('index',{ validacao: ['invalid_user_password'], dadosForm: {} });
        }
    });
}