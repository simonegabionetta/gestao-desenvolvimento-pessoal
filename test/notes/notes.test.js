
import { expect } from 'chai';
import request from 'supertest';
import { obterToken } from '../helpers/authHelper.js';
import { limpar } from '../helpers/clear.js';
import dotenv from 'dotenv';
import logins from '../fixtures/requisicoes/users/postUsersLogin.json' assert { type: 'json' };
import notes from '../fixtures/requisicoes/notes/postNotes.json' assert { type: 'json' };
dotenv.config();

describe('notes', () => {
    let token;

    beforeEach(async () => {
        token = await obterToken(logins.validLogin.email, logins.validLogin.password);
         
        await limpar(token);
    });

    describe('POST /notes', () => {
        it('Deve retornar 201 quando a nota for criada (RN010, RN020)', async () => {
            const response = await request(process.env.BASE_URL)
                .post('/notes')
                .set('Authorization', `Bearer ${token}`)
                .send(notes.validNotes[0]);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('date');
            expect(response.body.content).to.equal('Revisar reunião de equipe');
        });
    });

    describe('GET /notes', () => {
        beforeEach(async () => {
            await request(process.env.BASE_URL)
                .post('/notes')
                .set('Authorization', `Bearer ${token}`)
                .send(notes.validNotes[1]);

            await request(process.env.BASE_URL)
                .post('/notes')
                .set('Authorization', `Bearer ${token}`)
                .send(notes.validNotes[2]);
        });

        it('Deve retornar 200 com a lista de notas', async () => {
            const response = await request(process.env.BASE_URL)
                .get('/notes')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('Deve filtrar por período (RN018, RN028)', async () => {
            const response = await request(process.env.BASE_URL)
                .get('/notes?start=2024-01-01&end=2024-02-28')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
           
        });
    });
});

describe('GET /notes/id', () => {
    let noteId;

    beforeEach(async () => {
        token = await obterToken(logins.validLogin.email, logins.validLogin.password);
        const response = await request(process.env.BASE_URL)
            .post('/notes')
            .set('Authorization', `Bearer ${token}`)
            .send(notes.validNotes[0]);

        noteId = response.body.id;
    });

    it('Deve retornar 200 com os detalhes da nota', async () => {
        const response = await request(process.env.BASE_URL)
            .get(`/notes/${noteId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.id).to.equal(noteId);
    });

    it('Deve retornar 404 quando a nota não existir', async () => {
        const response = await request(process.env.BASE_URL)
            .get('/notes/9999')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(404);
    });
});

describe('PUT /notes/id', () => {
    let noteId;

    beforeEach(async () => {
        const response = await request(process.env.BASE_URL)
            .post('/notes')
            .set('Authorization', `Bearer ${token}`)
            .send(notes.validNotes[0]);

        noteId = response.body.id;
    });

    it('Deve retornar 200 com a nota atualizada', async () => {
        const response = await request(process.env.BASE_URL)
            .put(`/notes/${noteId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'Revisar reunião de equipe atualizado'
            });

        expect(response.status).to.equal(200);
        expect(response.body.content).to.equal('Revisar reunião de equipe atualizado');
    });

    it('Deve retornar 400/404 quando a nota não existir', async () => {
        const response = await request(process.env.BASE_URL)
            .put('/notes/9999')
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'Teste'
            });

        expect([400, 404]).to.include(response.status);
    });
});

describe('DELETE /notes/id', () => {
    let noteId;

    beforeEach(async () => {
        const response = await request(process.env.BASE_URL)
            .post('/notes')
            .set('Authorization', `Bearer ${token}`)
            .send(notes.validNotes[0]);

        noteId = response.body.id;
    });

    it('Deve retornar 204 quando a nota for excluída', async () => {
        const response = await request(process.env.BASE_URL)
            .delete(`/notes/${noteId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(204);
    });

    it('Deve retornar 404 quando a nota não existir', async () => {
        const response = await request(process.env.BASE_URL)
            .delete('/notes/9999')
            .set('Authorization', `Bearer ${token}`);

        expect([400, 404]).to.include(response.status);
    });
});
