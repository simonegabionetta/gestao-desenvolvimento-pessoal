const { expect } = require('chai');
const request = require('supertest');
const { obterToken } = require('../helpers/authHelper');
const { limpar } = require('../helpers/clear');
require('dotenv').config();

const logins = require('../fixtures/requisicoes/users/postUsersLogin.json');
const mentorships = require('../fixtures/requisicoes/mentorships/postMentorships.json');

describe('mentorships ', () => {
    let token;

    beforeEach(async () => {
        token = await obterToken(logins.validLogin.email, logins.validLogin.password);
        await limpar(token);
    });

    describe('POST /mentorships (RN019, RN025, RN026, RN030)', () => {
        it('Deve retornar 201 quando a mentoria for criada (RN015, RN010)', async () => {
            const response = await request(process.env.BASE_URL)
                .post('/mentorships')
                .set('Authorization', `Bearer ${token}`)
                .send(mentorships.validMentorships[0]);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('createdAt');
            expect(response.body.topic).to.equal('Mentoria de Node.js');
        });
    });

    describe('GET /mentorships', () => {
        beforeEach(async () => {
            await request(process.env.BASE_URL)
                .post('/mentorships')
                .set('Authorization', `Bearer ${token}`)
                .send(mentorships.validMentorships[1]);

            await request(process.env.BASE_URL)
                .post('/mentorships')
                .set('Authorization', `Bearer ${token}`)
                .send(mentorships.validMentorships[2]);
        });

        it('Deve retornar 200 com a lista de mentorias', async () => {
            const response = await request(process.env.BASE_URL)
                .get('/mentorships')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('Deve filtrar por período (RN017, RN027)', async () => {
            const response = await request(process.env.BASE_URL)
                .get('/mentorships?start=2025-11-01&end=2025-11-15')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });
    });
});

describe('GET /mentorships/:id', () => {
    let mentorshipId;

    beforeEach(async () => {
        token = await obterToken(logins.validLogin.email, logins.validLogin.password);
        const response = await request(process.env.BASE_URL)
            .post('/mentorships')
            .set('Authorization', `Bearer ${token}`)
            .send(mentorships.validMentorships[0]);

        mentorshipId = response.body.id;
        expect(mentorshipId).to.exist;
    });

    it('Deve retornar 200 com os detalhes da mentoria', async () => {
        const response = await request(process.env.BASE_URL)
            .get(`/mentorships/${mentorshipId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.id).to.equal(mentorshipId);
    });

    it('Deve retornar 404 quando a mentoria não existir', async () => {
        const response = await request(process.env.BASE_URL)
            .get('/mentorships/9999')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(404);
    });
});

describe('PUT /mentorships/:id', () => {
    let mentorshipId;

    beforeEach(async () => {
        const response = await request(process.env.BASE_URL)
            .post('/mentorships')
            .set('Authorization', `Bearer ${token}`)
            .send(mentorships.validMentorships[0]);

        mentorshipId = response.body.id;
    });

    it('Deve retornar 200 com a mentoria atualizada', async () => {
        const response = await request(process.env.BASE_URL)
            .put(`/mentorships/${mentorshipId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                topic: 'Mentoria Node.js Avançado'
            });

        expect(response.status).to.equal(200);
        expect(response.body.topic).to.equal('Mentoria Node.js Avançado');
    });

    it('Deve retornar 400/404 quando a mentoria não existir', async () => {
        const response = await request(process.env.BASE_URL)
            .put('/mentorships/9999')
            .set('Authorization', `Bearer ${token}`)
            .send({
                topic: 'Teste'
            });

        expect([400, 404]).to.include(response.status);
    });
});

describe('DELETE /mentorships/:id', () => {
    let mentorshipId;

    beforeEach(async () => {
        const response = await request(process.env.BASE_URL)
            .post('/mentorships')
            .set('Authorization', `Bearer ${token}`)
            .send(mentorships.validMentorships[0]);

        mentorshipId = response.body.id;
    });

    it('Deve retornar 204 quando a mentoria for excluída', async () => {
        const response = await request(process.env.BASE_URL)
            .delete(`/mentorships/${mentorshipId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(204);
    });

    it('Deve retornar 404 quando a mentoria não existir', async () => {
        const response = await request(process.env.BASE_URL)
            .delete('/mentorships/9999')
            .set('Authorization', `Bearer ${token}`);

        expect([400, 404]).to.include(response.status);
    });
});
