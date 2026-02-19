const { expect } = require('chai');
const request = require('supertest');
const { obterToken } = require('../helpers/authHelper');
const { limpar } = require('../helpers/clear');
require('dotenv').config();

const logins = require('../fixtures/requisicoes/users/postUsersLogin.json');

describe('notes', () => {
    let token;

    beforeEach(async () => {
        token = await obterToken(logins.validLogin.email, logins.validLogin.password);
        await limpar(token);
    });

    describe('POST /notes (RN015, RN010, RN020)', () => {
        it('Deve retornar 201 quando a anotação for criada', async () => {
            const response = await request(process.env.BASE_URL)
                .post('/notes')
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Minha primeira anotação' });

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('date');
            expect(response.body.content).to.equal('Minha primeira anotação');
        });
    });

    describe('GET /notes (RN018, RN028)', () => {
        beforeEach(async () => {
            await request(process.env.BASE_URL)
                .post('/notes')
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Anotação 1' });

            await request(process.env.BASE_URL)
                .post('/notes')
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Anotação 2' });
        });

        it('Deve retornar 200 com a lista de anotações', async () => {
            const response = await request(process.env.BASE_URL)
                .get('/notes')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('Deve filtrar por período (RN018, RN028)', async () => {
            const response = await request(process.env.BASE_URL)
                .get('/notes?start=2024-01-01&end=2024-12-31')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });
    });

    describe('GET /notes/:id (RN025, RN026)', () => {
        let noteId;

        beforeEach(async () => {
            const response = await request(process.env.BASE_URL)
                .post('/notes')
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Anotação para buscar' });

            noteId = response.body.id;
        });

        it('Deve retornar 200 com os detalhes da anotação', async () => {
            const response = await request(process.env.BASE_URL)
                .get(`/notes/${noteId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body.id).to.equal(noteId);
        });

        it('Deve retornar 404 quando a anotação não existir', async () => {
            const response = await request(process.env.BASE_URL)
                .get('/notes/9999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(404);
        });
    });

    describe('PUT /notes/:id (RN019, RN030)', () => {
        let noteId;

        beforeEach(async () => {
            const response = await request(process.env.BASE_URL)
                .post('/notes')
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Anotação para atualizar' });

            noteId = response.body.id;
        });

        it('Deve retornar 200 com a anotação atualizada', async () => {
            const response = await request(process.env.BASE_URL)
                .put(`/notes/${noteId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Anotação atualizada' });

            expect(response.status).to.equal(200);
            expect(response.body.content).to.equal('Anotação atualizada');
        });

        it('Deve retornar 400/404 quando a anotação não existir', async () => {
            const response = await request(process.env.BASE_URL)
                .put('/notes/9999')
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Teste' });

            expect([400, 404]).to.include(response.status);
        });
    });

    describe('DELETE /notes/:id (RN019)', () => {
        let noteId;

        beforeEach(async () => {
            const response = await request(process.env.BASE_URL)
                .post('/notes')
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Anotação para deletar' });

            noteId = response.body.id;
        });

        it('Deve retornar 204 quando a anotação for excluída', async () => {
            const response = await request(process.env.BASE_URL)
                .delete(`/notes/${noteId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(204);
        });

        it('Deve retornar 404 quando a anotação não existir', async () => {
            const response = await request(process.env.BASE_URL)
                .delete('/notes/9999')
                .set('Authorization', `Bearer ${token}`);

            expect([400, 404]).to.include(response.status);
        });
    });
});