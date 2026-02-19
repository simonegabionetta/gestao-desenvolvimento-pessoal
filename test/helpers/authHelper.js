const request = require('supertest');
require('dotenv').config();

const obterToken = async (email, password) => {
    await request(process.env.BASE_URL)
        .post('/users/register')
        .send({
            name: 'Usuário Teste',
            email: email,
            password: password
        })
        .catch(() => {});

    const respostaLogin = await request(process.env.BASE_URL)
        .post('/users/login')
        .send({
            email: email,
            password: password
        });

    return respostaLogin.body.token;
};

module.exports = { obterToken };