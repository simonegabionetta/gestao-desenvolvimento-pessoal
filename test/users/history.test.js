const { expect } = require('chai');
const request = require('supertest');
require('dotenv').config();

const users = require('../fixtures/requisicoes/users/postUsersRegister.json');
const { obterToken } = require('../helpers/authHelper');

describe('GET /users/me/history', () => {
    let token;

    before(async () => {
        token = await obterToken(users.validUser.email, users.validUser.password);

        // cria histórico fazendo logins repetidos
        for (let i = 0; i < 12; i++) {
            await request(process.env.BASE_URL)
                .post('/users/login')
                .send({ email: users.validUser.email, password: users.validUser.password });
        }
    });

    it('Deve retornar 200 com a lista de atividades', async () => {
        const response = await request(process.env.BASE_URL)
            .get('/users/me/history')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });

    it('Deve retornar 401 quando token não fornecido', async () => {
        const response = await request(process.env.BASE_URL)
            .get('/users/me/history');

        expect(response.status).to.equal(401);
    });

    it('Deve limitar o histórico a 10 registros por padrão (RN007)', async () => {
        const response = await request(process.env.BASE_URL)
            .get('/users/me/history')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.length).to.be.at.most(10);
    });

    it('Deve permitir paginação com parâmetro de limite (RN029)', async () => {
        const response = await request(process.env.BASE_URL)
            .get('/users/me/history?limit=5')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(5);
    });

    it('Deve permitir paginação com limite e offset (RN007)', async () => {
        const response1 = await request(process.env.BASE_URL)
            .get('/users/me/history?limit=5&offset=0')
            .set('Authorization', `Bearer ${token}`);

        const response2 = await request(process.env.BASE_URL)
            .get('/users/me/history?limit=5&offset=5')
            .set('Authorization', `Bearer ${token}`);

        expect(response1.status).to.equal(200);
        expect(response2.status).to.equal(200);
        expect(response1.body).to.have.lengthOf(5);
        expect(response2.body).to.have.lengthOf(5);
        
        // Verifica se são arrays diferentes
        expect(response1.body).to.not.deep.equal(response2.body);
    });
});