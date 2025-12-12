const request = require('supertest');
// fixtures
const logins = require('../fixtures/requisicoes/users/postUsersLogin.json');
require('dotenv').config();
const obterToken = async () => {
    // Registrar usuário antes do login (ignora se já existir)
    await request(process.env.BASE_URL)
        .post('/users/register')
        .send({
            name: 'Usuário Teste',
            email: logins.validLogin.email,
            password: logins.validLogin.password
        });

    // Fazer login para obter o token
    const respostaLogin = await request(process.env.BASE_URL)
        .post('/users/login')
        .send({
            email: logins.validLogin.email,
            password: logins.validLogin.password
        });

    return respostaLogin.body.token;
};


module.exports ={
    obterToken
}