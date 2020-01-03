module.exports.jogo = function(application, req, res){
    if(req.session.autorizado !== true){
        res.render('index', { validacao: {}, dadosForm: {} })
        return;
    }

    var connection = application.config.connection.mongodb;
    var JogoDAO = new application.app.models.JogoDAO(connection);
    JogoDAO.iniciaJogo(res, req.session.usuario, req.session.casa, []);
}

module.exports.sair = function(application, req, res){
    req.session.destroy(function(err){
        res.render('index', {validacao: {}, dadosForm: {}})
        return;
    })
}

module.exports.suditos = function(application, req, res){
    if(req.session.autorizado !== true){
        res.render('index', { validacao: {}, dadosForm: {} })
        return;
    }
    res.render('aldeoes')
}

module.exports.pergaminhos = function(application, req, res){
    if(req.session.autorizado !== true){
        res.render('index', { validacao: {}, dadosForm: {} })
        return;
    }
    res.render('pergaminhos')
}

module.exports.ordenar_acao_sudito = function(application, req, res){
    if(req.session.autorizado !== true){
        res.render('index', { validacao: {}, dadosForm: {} })
        return;
    }
    var dadosForm = req.body;

    req.assert('acao', 'Ação deve ser informada').notEmpty();
    req.assert('quantidade', 'Quantidade deve ser informada').notEmpty();

    var erros = req.validationErrors();

    var connection = application.config.connection.mongodb;
    var JogoDAO = new application.app.models.JogoDAO(connection);
    
    if(erros){
        JogoDAO.iniciaJogo(res, req.session.usuario, req.session.casa, { type: 'sudits_form_error', erros: erros });
        return;
    }
    else{
        dadosForm.usuario = req.session.usuario;

        JogoDAO.acao(dadosForm, function(){ 
            connection = application.config.connection.mongodb;
            var JogoDAO = new application.app.models.JogoDAO(connection);
            JogoDAO.iniciaJogo(res, req.session.usuario, req.session.casa, { type: 'sudits_form_success' });
        });
    }
}