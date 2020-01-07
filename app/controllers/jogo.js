module.exports.jogo = function(application, req, res){
    if(req.session.autorizado !== true){
        res.render('index', { validacao: {}, dadosForm: {} })
        return;
    }

    const JogoDAO = new application.app.models.JogoDAO(application.config.connection.mongodb);
    
    JogoDAO.iniciaJogo(req.session.usuario, function(err, result){
        res.render('jogo', { img_casa: req.session.casa, jogo: result[0], msg: [] });
    });
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
    const JogoDAO = new application.app.models.JogoDAO(application.config.connection.mongodb);
    
    JogoDAO.getJogo(req.session.usuario, function(err, result){
        res.render('aldeoes', { jogo: result[0] });
    });
}

module.exports.pergaminhos = function(application, req, res){
    if(req.session.autorizado !== true){
        res.render('index', { validacao: {}, dadosForm: {} })
        return;
    }

    const JogoDAO = new application.app.models.JogoDAO(application.config.connection.mongodb);
    
    JogoDAO.getAcoes(req.session.usuario, function(err, result){
        res.render('pergaminhos', { acoes: result });
    });
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

    const JogoDAO = new application.app.models.JogoDAO(application.config.connection.mongodb);
    
    if(erros){
        JogoDAO.iniciaJogo(req.session.usuario, function(err, result){
            res.render('jogo', { img_casa: req.session.casa, jogo: result[0], msg: JSON.stringify({ type: 'sudits_form_error', erros: erros }) });
        });
        return;
    }
    else{
        dadosForm.usuario = req.session.usuario;

        JogoDAO.valida_acao(dadosForm, function(err, result){
            let moedas = null;

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

            if(result[0].moeda + dadosForm.moedas < 0 || result[0].suditos - dadosForm.quantidade < 0){
                let msg = '';
                if(result[0].moeda + dadosForm.moedas < 0 && result[0].suditos - dadosForm.quantidade < 0){
                    msg = { type: 'sudits_form_error', erros: [{ msg: "Senhor, não há moedas suficientes" }, { msg: "Senhor, não há suditos suficientes" }] };
                }
                else if(result[0].moeda + dadosForm.moedas < 0 && result[0].suditos - dadosForm.quantidade >= 0){
                    msg = { type: 'sudits_form_error', erros: [{ msg: "Senhor, não há moedas suficientes" }] };
                }
                else if(result[0].moeda + dadosForm.moedas >= 0 && result[0].suditos - dadosForm.quantidade < 0){
                    msg = { type: 'sudits_form_error', erros: [{ msg: "Senhor, não há suditos suficientes" }] };
                }

                const JogoDAO = new application.app.models.JogoDAO(application.config.connection.mongodb);
                JogoDAO.iniciaJogo(req.session.usuario, function(err, result){
                    res.render('jogo', { img_casa: req.session.casa, jogo: result[0], msg: JSON.stringify(msg) });
                });
            }
            else{
                let date = new Date();
                let tempo = 0;

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
    
                const JogoDAO = new application.app.models.JogoDAO(application.config.connection.mongodb);
                JogoDAO.executa_acao(dadosForm, function(err, result){ 
                    const JogoDAO = new application.app.models.JogoDAO(application.config.connection.mongodb);
                    JogoDAO.atualiza_moedas_e_suditos(dadosForm, function(err, result){
                        const JogoDAO = new application.app.models.JogoDAO(application.config.connection.mongodb);
                        JogoDAO.iniciaJogo(req.session.usuario, function(err, result){
                            res.render('jogo', { img_casa: req.session.casa, jogo: result[0], msg: JSON.stringify({ type: 'sudits_form_success' }) });
                        });
                    })
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

    const JogoDAO = new application.app.models.JogoDAO(application.config.connection.mongodb);
    JogoDAO.iniciaJogo(req.session.usuario, function(err, result){
        res.render('jogo', { img_casa: req.session.casa, jogo: result[0], msg: JSON.stringify({ type: 'order_done' }) });
    });
}

module.exports.revogar_acao = function(application, req, res){
    var _id = req.query.id_acao;

    const JogoDAO = new application.app.models.JogoDAO(application.config.connection.mongodb);
    JogoDAO.revogarAcao(_id, function(err, result){
        const JogoDAO = new application.app.models.JogoDAO(application.config.connection.mongodb);
        JogoDAO.iniciaJogo(req.session.usuario, function(err, result){
            res.render('jogo', { img_casa: req.session.casa, jogo: result[0], msg: JSON.stringify({ type: 'action_canceled' }) });
        });
    });
}