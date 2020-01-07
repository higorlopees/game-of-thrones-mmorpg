module.exports.cadastro = function(application, req, res){
    res.render('cadastro', { validacao: {}, dadosForm: {}, msg: '' });
}

module.exports.cadastrar = function(application, req, res){
    let dadosForm = req.body;

    req.assert('nome', 'Nome não pode ser vazio').notEmpty();
    req.assert('usuario', 'Usuario não pode ser vazio').notEmpty();
    req.assert('senha', 'Senha não pode ser vazio').notEmpty();
    req.assert('casa', 'Casa não pode ser vazio').notEmpty();

    let erros = req.validationErrors();

    if(erros){
        res.render('cadastro', { validacao: erros , dadosForm: dadosForm, msg: 'error' });
        return;
    }

    const UsuariosDAO = new application.app.models.UsuariosDAO(application.config.connection.mongodb);
    const JogoDAO = new application.app.models.JogoDAO(application.config.connection.mongodb);

    UsuariosDAO.inserirUsuario(dadosForm, function(err, result){
        JogoDAO.gerarParametros(dadosForm.usuario, function(err, result){
            res.render('cadastro', { validacao: {}, dadosForm: dadosForm, msg: 'success' });
        });
    });
}