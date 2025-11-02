//bilbiotecas
const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

//fixtures
const users = require('../fixtures/requisicoes/users/postUsersRegister.json');
const logins = require('../fixtures/requisicoes/users/postUsersLogin.json');

// helpers
const { obterToken } = require('../helpers/authHelper');

describe('users', () => {
    let token;

    before(async () => {
    token = await obterToken(logins.validLogin.email, logins.validLogin.password);
    }); 

     describe('GET /users/me', () => {

        it('Deve retornar 200 os dados do perfil do usuário', async () => {

            const response = await request(process.env.BASE_URL)
                .get('/users/me')
                .set('Authorization', `Bearer ${token}`)

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('name');
            expect(response.body).to.have.property('email');
            expect(response.body).to.not.have.property('password');
        });

        it('Deve retornar 401 quando o token não é fornecido', async () => {

            const response = await request(process.env.BASE_URL)                
                .get('/users/me')             

            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('error');
        });

        it('A senha não deve ser retornada no campo do perfil (RN005)', async () => {

            const response = await request(process.env.BASE_URL)
                .get('/users/me')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.not.have.property('password');
            expect(response.body.password).to.be.undefined;
        });
    });

    describe('PUT /users/me', () => {

        it('Deve retornar 200 com os dados do perfil atualizados', async () => {
            const response = await request(process.env.BASE_URL)
                .put('/users/me')
                .set('Authorization', `Bearer ${token}`)
                .send(users.userUpdate);

            expect(response.status).to.equal(200);
            expect(response.body.name).to.equal(users.userUpdate.name);
        });
    });

    it('Deve retornar 401 quando o token não é fornecido', async () => {

        const response = await request(process.env.BASE_URL)
            .put('/users/me')
            .send({ name: 'teste' });

        expect(response.status).to.equal(401);

    });

    it('A senha não deve ser retornada no campo do perfil (RN005)', async () => {

        const response = await request(process.env.BASE_URL)
            .put('/users/me')
            .set('Authorization', `Bearer ${token}`)
            .send(users.user);

        expect(response.status).to.equal(200);
        expect(response.body).to.not.have.property('password');

    });
});









