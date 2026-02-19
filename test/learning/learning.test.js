const { expect } = require('chai');
const request = require('supertest');
const { obterToken } = require('../helpers/authHelper');
const { limpar } = require('../helpers/clear');
require('dotenv').config();
const logins = require('../fixtures/requisicoes/users/postUsersLogin.json');
const learning = require('../fixtures/requisicoes/learning/postLearning.json');

describe('learning', () => {
    let token;

    beforeEach(async () => {
        token = await obterToken(logins.validLogin.email, logins.validLogin.password);
        await limpar(token);
    });

    describe('POST /learning (RN019, RN025, RN026, RN030)', () => {
        it('Deve retornar 201 quando o learning for criado (RN015, RN010)', async () => {
            const response = await request(process.env.BASE_URL)
                .post('/learning')
                .set('Authorization', `Bearer ${token}`)
                .send(learning.validLearnings[0]);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('createdAt');
            expect(response.body.content).to.equal('Aprender Node.js básico');
        });
    });

    describe('GET /learning', () => {
        beforeEach(async () => {
            await request(process.env.BASE_URL)
                .post('/learning')
                .set('Authorization', `Bearer ${token}`)
                .send(learning.validLearnings[1]);

            await request(process.env.BASE_URL)
                .post('/learning')
                .set('Authorization', `Bearer ${token}`)
                .send(learning.validLearnings[2]);
        });

        it('Deve retornar 200 com a lista de learnings', async () => {
            const response = await request(process.env.BASE_URL)
                .get('/learning')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('Deve filtrar por período (RN017, RN027)', async () => {
            const response = await request(process.env.BASE_URL)
                .get('/learning?start=2024-01-01&end=2024-02-28')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });
    });

    describe('GET /learning/:id', () => {
        let learningId;

        beforeEach(async () => {
            const response = await request(process.env.BASE_URL)
                .post('/learning')
                .set('Authorization', `Bearer ${token}`)
                .send(learning.validLearnings[0]);

            learningId = response.body.id;
        });

        it('Deve retornar 200 com os detalhes do learning', async () => {
            const response = await request(process.env.BASE_URL)
                .get(`/learning/${learningId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body.id).to.equal(learningId);
        });

        it('Deve retornar 404 quando o learning não existir', async () => {
            const response = await request(process.env.BASE_URL)
                .get('/learning/9999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(404);
        });
    });

    describe('PUT /learning/:id', () => {
        let learningId;

        beforeEach(async () => {
            const response = await request(process.env.BASE_URL)
                .post('/learning')
                .set('Authorization', `Bearer ${token}`)
                .send(learning.validLearnings[0]);

            learningId = response.body.id;
        });

        it('Deve retornar 200 com o learning atualizado', async () => {
            const response = await request(process.env.BASE_URL)
                .put(`/learning/${learningId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Aprender Node.js Avançado' });

            expect(response.status).to.equal(200);
            expect(response.body.content).to.equal('Aprender Node.js Avançado');
        });

        it('Deve retornar 400/404 quando o learning não existir', async () => {
            const response = await request(process.env.BASE_URL)
                .put('/learning/9999')
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Teste' });

            expect([400, 404]).to.include(response.status);
        });
    });

    describe('DELETE /learning/:id', () => {
        let learningId;

        beforeEach(async () => {
            const response = await request(process.env.BASE_URL)
                .post('/learning')
                .set('Authorization', `Bearer ${token}`)
                .send(learning.validLearnings[0]);

            learningId = response.body.id;
        });

        it('Deve retornar 204 quando o learning for excluído', async () => {
            const response = await request(process.env.BASE_URL)
                .delete(`/learning/${learningId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(204);
        });

        it('Deve retornar 404 quando o learning não existir', async () => {
            const response = await request(process.env.BASE_URL)
                .delete('/learning/9999')
                .set('Authorization', `Bearer ${token}`);

            expect([400, 404]).to.include(response.status);
        });
    });
});