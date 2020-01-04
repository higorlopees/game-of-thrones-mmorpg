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

    var connection = application.config.connection.mongodb;
    var JogoDAO = new application.app.models.JogoDAO(connection);
    
    JogoDAO.getAcoes(req.session.usuario, function(result){
        res.render('pergaminhos', { acoes: result });
    })

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

        JogoDAO.valida_moedas(dadosForm, function(result, dadosForm){
            if(result[0].moeda + dadosForm.moedas < 0){
                connection = application.config.connection.mongodb;
                var JogoDAO = new application.app.models.JogoDAO(connection);
                JogoDAO.iniciaJogo(res, req.session.usuario, req.session.casa, { type: 'sudits_form_error_lack_of_coins' });
            }
            else{
                connection = application.config.connection.mongodb;
                var JogoDAO = new application.app.models.JogoDAO(connection);
                JogoDAO.acao(dadosForm, function(){ 
                    connection = application.config.connection.mongodb;
                    var JogoDAO = new application.app.models.JogoDAO(connection);
                    JogoDAO.iniciaJogo(res, req.session.usuario, req.session.casa, { type: 'sudits_form_success' });
                });
            }
        })

    }
}

module.exports.ordem_finalizada = function(application, req, res){
    if(req.session.autorizado !== true){
        res.render('index', { validacao: {}, dadosForm: {} })
        return;
    }

    connection = application.config.connection.mongodb;
    var JogoDAO = new application.app.models.JogoDAO(connection);
    JogoDAO.iniciaJogo(res, req.session.usuario, req.session.casa, { type: 'order_done' });
}

module.exports.revogar_acao = function(application, req, res){
    var _id = req.query.id_acao;

    connection = application.config.connection.mongodb;
    var JogoDAO = new application.app.models.JogoDAO(connection);
    JogoDAO.revogarAcao(_id, function(){
        connection = application.config.connection.mongodb;
        var JogoDAO = new application.app.models.JogoDAO(connection);
        JogoDAO.iniciaJogo(res, req.session.usuario, req.session.casa, { type: 'action_canceled' });
    });
}