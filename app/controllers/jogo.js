module.exports.jogo = function(application, req, res){
    if(req.session.autorizado !== true){
        res.render('index', { validacao: {}, dadosForm: {} })
    }
    
    var usuario = req.session.usuario;
    var casa = req.session.casa;

    var connection = application.config.connection.mongodb;
    var JogoDAO = new application.app.models.JogoDAO(connection);
    JogoDAO.iniciaJogo(res, usuario, casa);
}

module.exports.sair = function(application, req, res){
    req.session.destroy(function(err){
        res.render('index', {validacao: {}, dadosForm: {}})
    })
}