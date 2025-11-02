const { expect } = require('chai');
const request = require('supertest');
const { obterToken } = require('../helpers/authHelper');
const { limpar } = require('../helpers/clear');
require('dotenv').config();
const logins = require('../fixtures/requisicoes/users/postUsersLogin.json');
const improvements = require('../fixtures/requisicoes/improvements/postImprovements.json');

describe('improvements', () => {
    let token;
    beforeEach(async () => {
        token = await obterToken(logins.validLogin.email, logins.validLogin.password);
        await limpar(token);
    });

    describe('POST /improvements (RN019, RN025, RN026, RN030)', () => {
        it('Deve retornar 201 quando a melhoria for criada (RN015, RN010)', async () => {
            const response = await request(process.env.BASE_URL)
                .post('/improvements')
                .set('Authorization', `Bearer ${token}`)
                .send(improvements.validImprovements[0]);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('createdAt');
            expect(response.body.description).to.equal('Melhoria no processo de desenvolvimento');
        });
    });

    describe('GET /improvements', () => {
        beforeEach(async () => {
            await request(process.env.BASE_URL)
                .post('/improvements')
                .set('Authorization', `Bearer ${token}`)
                .send(improvements.validImprovements[1]);

            await request(process.env.BASE_URL)
                .post('/improvements')
                .set('Authorization', `Bearer ${token}`)
                .send(improvements.validImprovements[2]);
        });

        it('Deve retornar 200 com a lista de melhorias', async function () {
            const response = await request(process.env.BASE_URL)
                .get('/improvements')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('Deve filtrar por período (RN016, RN028)', async () => {
            const response = await request(process.env.BASE_URL)
                .get('/improvements?start=2024-01-01&end=2024-02-28') 
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');

           
        });
    });
});

describe('GET /improvements/id', () => {
    let improvementId;
    beforeEach(async () => {
        token = await obterToken(logins.validLogin.email, logins.validLogin.password);
        const response = await request(process.env.BASE_URL)
            .post('/improvements')
            .set('Authorization', `Bearer ${token}`)
            .send(improvements.validImprovements[0]);

        improvementId = response.body.id;
        expect(improvementId).to.exist;
    });

    it('Deve retornar 200 com os detalhes da melhoria (RN025, RN026)', async function () {
        const response = await request(process.env.BASE_URL)
            .get(`/improvements/${improvementId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.id).to.equal(improvementId);
    });

    it('Deve retornar 404 quando a melhoria não existir', async () => {
        const response = await request(process.env.BASE_URL)
            .get('/improvements/9999')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(404);
    });
});

describe('PUT /improvements/id', () => {
    let improvementId;
    beforeEach(async () => {
        const response = await request(process.env.BASE_URL)
            .post('/improvements')
            .set('Authorization', `Bearer ${token}`)
            .send(improvements.validImprovements[0]);

        improvementId = response.body.id;
    });

    it('Deve retornar 200 com a melhoria atualizada (RN030)', async () => {
        const response = await request(process.env.BASE_URL)
            .put(`/improvements/${improvementId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                description: 'Melhoria Atualizada'
            });

        expect(response.status).to.equal(200);
        expect(response.body.description).to.equal('Melhoria Atualizada');
    });

    it('Deve retornar 400 com dados inválidos (RN019)', async () => {
        const response = await request(process.env.BASE_URL)
            .put('/improvements/9999')
            .set('Authorization', `Bearer ${token}`)
            .send({
                description: ''
            });

        expect([400, 404]).to.include(response.status);
    });
});

describe('DELETE /improvements/id', () => {
    let improvementId;
    beforeEach(async () => {
        const response = await request(process.env.BASE_URL)
            .post('/improvements')
            .set('Authorization', `Bearer ${token}`)
            .send(improvements.validImprovements[0]);

        improvementId = response.body.id;
    });

    it('Deve retornar 204 quando a melhoria for excluída.', async () => {
        const response = await request(process.env.BASE_URL)
            .delete(`/improvements/${improvementId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(204);
    });

    it('Deve retornar 404 quando a melhoria não existir', async () => {
        const response = await request(process.env.BASE_URL)
            .delete('/improvements/9999')
            .set('Authorization', `Bearer ${token}`);

        expect([400, 404]).to.include(response.status);
    });
});
