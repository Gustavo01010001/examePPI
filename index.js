import express from 'express';
import path from 'path';
//commonjs const express = require('express')

//Importando session do módulo express-session;
import session from 'express-session';

//Importando o módulo cookie-parser para permitir que a nossa aplicação
//solicite e retorne cookies
import cookieParser from 'cookie-parser';


const app = express();

//Configurar uma sessão a fim de permitir que a nossa aplicação
//seja capaz de lembrar com quem ela está falando....
//Em outras palavras, session, permite identificar individualmente cada
//usuário da aplicação.
app.use(session({
    secret: 'M1nh4Chav3S3cr3t4',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, //utilizada com http e não somente com https
        httpOnly: true,
        maxAge: 1000 * 60 * 30 //30 minutos
    }
}));

//adicionando o middleware cookieParser
app.use(cookieParser());

//configurar a nossa aplicação para receber os dados do formulário
//você pode escolher entre duas bibliotecas: QS ou QueryString
app.use(express.urlencoded({ extended: true }));


//configurar a aplicação para servir conteúdos estáticos
//Permitindo que o conteúdo de uma determinada pasta seja visível para os usuários/clientes
//app.use(express.static('./pages/public'));
//ajuste para executar no vercel
app.use(express.static(path.join(process.cwd(), 'pages/public')));


const porta = 3000;
const host = '0.0.0.0'; //ip refere-se a todas as interfaces (placas de rede) locais

var listaAlunos = []; //variável global - lista para armazenar os alunos cadastrados

//implementar a funcionalidade para entregar um formulário html para o cliente
function cadastroAlunoView(req, resp) {
    resp.send(`
            <html>
                <head>
                    <title>Cadastro de Alunos</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                </head>
                <body>
                    <div class="container text-center">
                        <h1 class="mb-5">Cadastro de Alunos</h1>
                        <form method="POST" action="/cadastrarAluno" class="border p-3 row g-3" novalidate>
                            <div class="col-md-4">
                                <label for="nome" class="form-label">Nome</label>
                                <input type="text" class="form-control" id="nome" name="nome"  placeholder="Digite seu nome">
                             </div>
                             <div class="col-md-4">
                                <label for="sobrenome" class="form-label">Sobrenome</label>
                                <input type="text" class="form-control" id="sobrenome" name="sobrenome">
    
                             </div>
                             <div class="col-md-4">
                                <label for="email" class="form-label">email</label>
                                <div class="input-group has-validation">
                                    <span class="input-group-text" id="inputGroupPrepend">@</span>
                                    <input type="text" class="form-control" id="email" name="email">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label for="cidade" class="form-label">Cidade</label>
                                <input type="text" class="form-control" id="cidade" name="cidade">
                            </div>
                            <div class="col-md-3">
                                <label for="estado" class="form-label">UF</label>
                                <select class="form-select" id="estado" name="estado">
                                    <option selected value="SP">São Paulo</option>
                                    <option value="AC">Acre</option>
                                    <option value="AL">Alagoas</option>
                                    <option value="AP">Amapá</option>
                                    <option value="AM">Amazonas</option>
                                    <option value="BA">Bahia</option>
                                    <option value="CE">Ceará</option>
                                    <option value="DF">Distrito Federal</option>
                                    <option value="ES">Espírito Santo</option>
                                    <option value="GO">Goiás</option>
                                    <option value="MA">Maranhão</option>
                                    <option value="MT">Mato Grosso</option>
                                    <option value="MS">Mato Grosso do Sul</option>
                                    <option value="MG">Minas Gerais</option>
                                    <option value="PA">Pará</option>
                                    <option value="PB">Paraíba</option>
                                    <option value="PR">Paraná</option>
                                    <option value="PE">Pernambuco</option>
                                    <option value="PI">Piauí</option>
                                    <option value="RJ">Rio de Janeiro</option>
                                    <option value="RN">Rio Grande do Norte</option>
                                    <option value="RS">Rio Grande do Sul</option>
                                    <option value="RO">Rondônia</option>
                                    <option value="RR">Roraima</option>
                                    <option value="SC">Santa Catarina</option>
                                    <option value="SE">Sergipe</option>
                                    <option value="TO">Tocantins</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label for="cep" class="form-label">Cep:</label>
                                <input type="text" class="form-control" id="cep" name="cep">
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" type="submit">Cadastrar</button>
                            </div>
                            </form>
                    </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </html>
    `);
}

function menuView(req, resp) {
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (!dataHoraUltimoLogin){
        dataHoraUltimoLogin='';
    }

    resp.send(`
        <html>
            <head>
                <title>Cadastro de Alunos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            </head>
            <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">MENU</a>
                        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <div class="navbar-nav">
                                <a class="nav-link active" aria-current="page" href="/cadastrarAluno">Cadastrar Aluno</a>
                                <a class="nav-link active" aria-current="page" href="/logout">Sair</a>
                                <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Seu último acesso foi realizado em ${dataHoraUltimoLogin}</a>
                            </div>
                        </div>
                    </div>
                </nav>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
        `);
}

function cadastrarAluno(req, resp) {
    //recuperar os dados do formulário enviados para o servidor
    const nome = req.body.nome;
    const sobrenome = req.body.sobrenome;
    const email = req.body.email;
    const cidade = req.body.cidade;
    const estado = req.body.estado;
    const cep = req.body.cep;

    //recuperar informações dos cookies enviado pelo navegador
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (!dataHoraUltimoLogin){
        dataHoraUltimoLogin='';
    }
    
    //validar a entrada do usuário
    //Caso os dados não estiverem válidos nós deveremos retornar um feedback para o usuário

    if (nome && sobrenome && email && cidade && estado && cep) {
        //os dados de entrada são válidos!
        const aluno = { nome, sobrenome, email, cidade, estado, cep };

        //adicionar o aluno na lista
        listaAlunos.push(aluno);

        //mostrar a lista de alunos já cadastrados

        resp.write(`
        <html>
            <head>
                <title>Lista de alunos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <meta charset="utf-8">
            </head>
            <body>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Nome</th>
                        <th scope="col">Sobrenome</th>
                        <th scope="col">Email</th>
                        <th scope="col">Cidade</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Cep</th>
                    </tr>
                </thead>
                <tbody>`);
        //adicionar as linhas da tabela
        //para cada aluno, nós devemos criar uma linha na tabela
        for (var i = 0; i < listaAlunos.length; i++) {
            resp.write(`<tr>
                                    <td>${listaAlunos[i].nome}</td>
                                    <td>${listaAlunos[i].sobrenome}</td>
                                    <td>${listaAlunos[i].email}</td>
                                    <td>${listaAlunos[i].cidade}</td>
                                    <td>${listaAlunos[i].estado}</td>
                                    <td>${listaAlunos[i].cep}</td>
                                </tr>
                        `);
        }

        resp.write(`</tbody> 
            </table>
            <a class="btn btn-primary" href="/cadastrarAluno">Continuar Cadastrando</a>
            <a class="btn btn-secondary" href="/">Voltar para o Menu</a>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
            `);
    }//fim do if de validação alt + shift + f
    else
    {

        const estados = {
            "AC": "Acre",
            "AL": "Alagoas",
            "AP": "Amapá",
            "AM": "Amazonas",
            "BA": "Bahia",
            "CE": "Ceará",
            "DF": "Distrito Federal",
            "ES": "Espírito Santo",
            "GO": "Goiás",
            "MA": "Maranhão",
            "MT": "Mato Grosso",
            "MS": "Mato Grosso do Sul",
            "MG": "Minas Gerais",
            "PA": "Pará",
            "PB": "Paraíba",
            "PR": "Paraná",
            "PE": "Pernambuco",
            "PI": "Piauí",
            "RJ": "Rio de Janeiro",
            "RN": "Rio Grande do Norte",
            "RS": "Rio Grande do Sul",
            "RO": "Rondônia",
            "RR": "Roraima",
            "SC": "Santa Catarina",
            "SP": "São Paulo",
            "SE": "Sergipe",
            "TO": "Tocantins"
        };
        //enviar de volta o formulário de cadastro, porém contendo mensagens de validação
        //implementar o html com esse conteúdo!

        resp.write(`
            <html>
                <head>
                    <title>Cadastro de Alunos</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                    <meta charset="utf-8">
                </head>
                <body>
                    <div class="container text-center">
                        <h1 class="mb-5">Cadastro de Alunos</h1>
                        <form method="POST" action="/cadastrarAluno" class="border p-3 row g-3" novalidate>
                            <div class="col-md-4">
                                <label for="nome" class="form-label">Nome</label>
                                <input type="text" class="form-control" id="nome" name="nome"  placeholder="Digite seu nome" value="${nome}">
        `);
        if (!nome){
            resp.write(`
                <div>
                    <span><p class="text-danger">Por favor, você deve informar o nome do aluno</p></span>
                </div>
                `);
        }
        resp.write(`</div>
                        <div class="col-md-4">
                        <label for="sobrenome" class="form-label">Sobrenome</label>
                        <input type="text" class="form-control" id="sobrenome" name="sobrenome" value="${sobrenome}">`);
        if (!sobrenome){
            resp.write(`
                <div>
                    <span><p class="text-danger">Por favor, você deve informar o sobrenome do aluno</p></span>
                </div>
                `);
        }
        resp.write(`
            </div>
                <div class="col-md-4">
                    <label for="email" class="form-label">email</label>
                    <div class="input-group has-validation">
                        <span class="input-group-text" id="inputGroupPrepend">@</span>
                        <input type="text" class="form-control" id="email" name="email" value="${email}">

            `);
        if (!email){
            resp.write(`
                <div>
                    <span><p class="text-danger">Por favor, você deve informar o email do aluno</p></span>
                </div>
                `);
        }
        resp.write(`
                    </div>
                </div>  
            <div class="col-md-6">
                <label for="cidade" class="form-label">Cidade</label>
                <input type="text" class="form-control" id="cidade" name="cidade" value="${cidade}">
            `);

        if (!cidade){
            resp.write(`
                <div>
                    <span><p class="text-danger">Por favor, informe a cidade!</p></span>
                </div>
                `);
        }
        resp.write(`
            </div>
            <div class="col-md-3">
                <label for="estado" class="form-label">UF</label>
                <select class="form-select" id="estado" name="estado">`);
        for (let [sigla, nomeEstado] of Object.entries(estados)){
            if (sigla == estado){
                resp.write(`<option selected value="${sigla}">${nomeEstado}</option>`);
            }
            else{
                resp.write(`<option value="${sigla}">${nomeEstado}</option>`);
            }
            
        }
        resp.write(`
                </select>
            </div>
            <div class="col-md-3">
                <label for="cep" class="form-label">Cep:</label>
                <input type="text" class="form-control" id="cep" name="cep" value="${cep}">
            `);
        if (!cep){
            resp.write(`
                <div>
                    <span><p class="text-danger">Por favor, informe o cep!</p></span>
                </div>
                `);
        }
        resp.write(`
            </div>
        <div class="col-12">
            <button class="btn btn-primary" type="submit">Cadastrar</button>
        </div>
        </form>
    </div>
    <div>
        <p><span>Seu último acesso foi realizado em ${dataHoraUltimoLogin}</span></p>
    </div>
    </body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </html> `);

    } // else da validação

    resp.end();//será enviada a resposta
}

function autenticarUsuario(req, resp){
    const usuario = req.body.usuario;
    const senha   = req.body.senha;

    if (usuario === 'admin' && senha === '123'){
        //criar uma sessão individualmente para cada usuário que faça o login
        req.session.usuarioLogado = true;
        //criar um cookie enviando para o navegador data e hora de acesso do usuário
        resp.cookie('dataHoraUltimoLogin', new Date().toLocaleString(), {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true});
        resp.redirect('/');
    }
    else{
        resp.send(`
                    <html>
                        <head>
                         <meta charset="utf-8">
                         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                               integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                        </head>
                        <body>
                            <div class="container w-25"> 
                                <div class="alert alert-danger" role="alert">
                                    Usuário ou senha inválidos!
                                </div>
                                <div>
                                    <a href="/login.html" class="btn btn-primary">Tentar novamente</a>
                                </div>
                            </div>
                        </body>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                                crossorigin="anonymous">
                        </script>
                    </html>
                  `
        );
    }
}

//é o nosso middleware de segurança
function verificarAutenticacao(req, resp, next){
    if (req.session.usuarioLogado){
        next(); //permita acessar os recursos solicitados
    }
    else
    {
        resp.redirect('/login.html');
    }
}

app.get('/login', (req, resp) =>{
    resp.redirect('/login.html');
});

app.get('/logout', (req, resp) => {
    req.session.destroy(); //eliminar a sessão.
    resp.redirect('/login.html');
});

app.post('/login', autenticarUsuario);
app.get('/', verificarAutenticacao, menuView);
app.get('/cadastrarAluno', verificarAutenticacao, cadastroAlunoView); //enviar o formulário para cadastrar alunos
app.post('/cadastrarAluno', verificarAutenticacao, cadastrarAluno);
//a novidade desta aula é o método POST

app.listen(porta, host, () => {
    console.log(`Servidor iniciado e em execução no endereço http://${host}:${porta}`);
});