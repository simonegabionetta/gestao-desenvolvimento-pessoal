const request = require('supertest');
// fixtures
const logins = require('../fixtures/requisicoes/users/postUsersLogin.json');

const obterToken = async () => {
    const respostaLogin = await request(process.env.BASE_URL)
        .post('/users/login')
        .send({   
        email: logins.validLogin.email,
        password: logins.validLogin.password
        })
    return respostaLogin.body.token
 
};

module.exports ={
    obterToken
}