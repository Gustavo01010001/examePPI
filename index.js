import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser'; // Adicione esta linha para importar o cookie-parser

const app = express();
const porta = 3000;
const host = '0.0.0.0';

const publicPath = 'pages/public';


// Usando o cookie-parser
app.use(cookieParser()); // Configura o cookie-parser como middleware

// Servindo arquivos estáticos da pasta 'pages/public'
app.use(express.static(publicPath));

// Configurando a sessão
app.use(session({
    secret: 'M1nh4Chav3S3cr3t4', // Chave secreta para criptografar a sessão
    resave: false,
    saveUninitialized: true
}));

// Rota de login
app.get('/login.html', (req, res) => {

    res.cookie('user', 'JohnDoe'); // Definindo um cookie
    res.sendFile(path.resolve('pages', 'public', 'login.html'));
});

app.get('/check-cookie', (req, res) => {
    const user = req.cookies.user; 
    res.send(`Cookie do usuário: ${user}`);
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});

// Listas para armazenar dados bom esse eh a ideia
let listaInteressados = [];
let listaPets = [];
let desejosAdoção = [];

// Configuração de sessão
app.use(session({
    secret: 'M1nh4Chav3S3cr3t4',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 30 // 30 minutos
    }
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Middleware para autenticação
function verificarAutenticacao(req, resp, next) {
    if (req.session.usuarioLogado) {
        next();
    } else {
        resp.redirect('/login.html');
    }
}

// Rota para o menu
function menuView(req, resp) {
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'] || '';
    resp.send(`
    <html>
            <head>
                <title>Menu</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style> 
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f7f6;
                        margin: 0;
                    }
                    .navbar {
                        background-color: #333;
                    }
                    .navbar a {
                        color: white;
                    }
                    .container-fluid {
                        padding: 20px;
                    }
                    .nav-link {
                        font-size: 18px;
                    }
                    .disabled {
                        color: #bbb;
                    }
                </style>
            </head>
            <body>
                <nav class="navbar navbar-expand-lg">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">MENU</a>
                        <div class="navbar-nav">
                            <a class="nav-link" href="/cadastrarInteressado">Cadastrar Interessado</a>
                            <a class="nav-link" href="/cadastrarPet">Cadastrar Pet</a>
                            <a class="nav-link" href="/desejosAdocao">Desejo de Adoção</a>
                            <a class="nav-link" href="/logout">Sair</a>
                            <a class="nav-link disabled">Último acesso: ${dataHoraUltimoLogin}</a>
                        </div>
                    </div>
                </nav>
            </body>
        </html>
    `);
}

// Rota para cadastrar interessado
function cadastroInteressadoView(req, resp) {
    resp.send(`
       <html>
            <head>
                <title>Cadastro de Interessado</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f7f6;
                        margin: 0;
                    }
                    h1 {
                        text-align: center;
                        color: #333;
                    }
                    .form-container {
                        width: 50%;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: white;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    label, input, button {
                        width: 100%;
                        margin: 10px 0;
                        padding: 10px;
                        border-radius: 5px;
                        border: 1px solid #ccc;
                    }
                    button {
                        background-color: #4CAF50;
                        color: white;
                        cursor: pointer;
                    }
                    button:hover {
                        background-color: #45a049;
                    }
                </style>
            </head>
            <body>
                <h1>Cadastro de Interessado</h1>
                <div class="form-container">
                    <form method="POST" action="/cadastrarInteressado">
                        <label for="nome">Nome:</label>
                        <input type="text" name="nome" id="nome" required>
                        <button type="submit">Cadastrar</button>
                    </form>
                </div>
            </body>
        </html> 
    `);
}

// Rota para cadastrar pet
function cadastroPetView(req, resp) {
    const interessados = listaInteressados.map(interessado => `<option value="${interessado.id}">${interessado.nome}</option>`).join('');
    resp.send(`
         <html>
            <head>
                <title>Cadastro de Pet</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f7f6;
                        margin: 0;
                    }
                    h1 {
                        text-align: center;
                        color: #333;
                    }
                    .form-container {
                        width: 50%;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: white;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    label, input, select, button {
                        width: 100%;
                        margin: 10px 0;
                        padding: 10px;
                        border-radius: 5px;
                        border: 1px solid #ccc;
                    }
                    button {
                        background-color: #4CAF50;
                        color: white;
                        cursor: pointer;
                    }
                    button:hover {
                        background-color: #45a049;
                    }
                </style>
            </head>
            <body>
                <h1>Cadastro de Pet</h1>
                <div class="form-container">
                    <form method="POST" action="/cadastrarPet">
                        <label for="nome">Nome do Pet:</label>
                        <input type="text" name="nome" id="nome" required>
                        <label for="especie">Espécie:</label>
                        <input type="text" name="especie" id="especie" required>
                        <label for="interessado">Interessado:</label>
                        <select name="interessado" id="interessado" required>
                            <option value="">Selecione um interessado</option>
                            ${interessados}
                        </select>
                        <button type="submit">Cadastrar Pet</button>
                    </form>
                </div>
            </body>
        </html>
    `);
}

// Rota para cadastrar desejo de adoção
function cadastroDesejoAdoçãoView(req, resp) {
    const interessados = listaInteressados.map(interessado => `<option value="${interessado.id}">${interessado.nome}</option>`).join('');
    const pets = listaPets.map(pet => `<option value="${pet.id}">${pet.nome}</option>`).join('');
    
    resp.send(`
      <html>
            <head>
                <title>Desejo de Adoção</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f7f6;
                        margin: 0;
                    }
                    h1 {
                        text-align: center;
                        color: #333;
                    }
                    .form-container {
                        width: 50%;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: white;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    label, select, button {
                        width: 100%;
                        margin: 10px 0;
                        padding: 10px;
                        border-radius: 5px;
                        border: 1px solid #ccc;
                    }
                    button {
                        background-color: #4CAF50;
                        color: white;
                        cursor: pointer;
                    }
                    button:hover {
                        background-color: #45a049;
                    }
                </style>
            </head>
            <body>
                <h1>Desejo de Adoção</h1>
                <div class="form-container">
                    <form method="POST" action="/cadastrarDesejoAdocao">
                        <label for="interessado">Interessado:</label>
                        <select name="interessado" id="interessado" required>
                            <option value="">Selecione um interessado</option>
                            ${interessados}
                        </select>
                        <label for="pet">Pet:</label>
                        <select name="pet" id="pet" required>
                            <option value="">Selecione um pet</option>
                            ${pets}
                        </select>
                        <button type="submit">Registrar Desejo</button>
                    </form>
                </div>
            </body>
        </html>
    `);
}


function autenticarUsuario(req, resp) {
    const usuario = req.body.usuario;
    const senha = req.body.senha;
    if (usuario === 'admin' && senha === '123') {
        req.session.usuarioLogado = true;
        resp.cookie('dataHoraUltimoLogin', new Date().toLocaleString(), { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
        resp.redirect('/');
    } else {
        resp.send('Usuário ou senha inválidos!');
    }
}

// Função para validar cadastro
function validarCadastro(req, resp) {
    const { nome, interessado, especie } = req.body;
    if (!nome || !interessado || !especie) {
        resp.send('Todos os campos são obrigatórios!');
        return false;
    }
    return true;
}

app.post('/cadastrarInteressado', (req, resp) => {
    const nome = req.body.nome;
    if (nome) {
        listaInteressados.push({ id: listaInteressados.length + 1, nome });
        resp.redirect('/cadastrarPet');
    } else {
        resp.send('Nome obrigatório!');
    }
});


app.post('/cadastrarPet', (req, resp) => {
    const { nome, especie, interessado } = req.body;
    if (validarCadastro(req, resp)) {
        listaPets.push({ id: listaPets.length + 1, nome, especie, interessado });
        resp.redirect('/desejosAdocao');
    }
});

app.post('/cadastrarDesejoAdocao', (req, resp) => {
    const { interessado, pet } = req.body;
    if (interessado && pet) {
        desejosAdoção.push({ interessado, pet });
        resp.send('<h1 style="text-align: center">Desejo de adoção registrado com sucesso!</h1>');
    } else {
        resp.send('Preencha todos os campos!');
    }
});

app.get('/', verificarAutenticacao, menuView);
app.get('/cadastrarInteressado', verificarAutenticacao, cadastroInteressadoView);
app.get('/cadastrarPet', verificarAutenticacao, cadastroPetView);
app.get('/desejosAdocao', verificarAutenticacao, cadastroDesejoAdoçãoView);
app.post('/login', autenticarUsuario);
app.get('/logout', (req, resp) => {
    req.session.destroy();
    resp.redirect('/login.html');
});
