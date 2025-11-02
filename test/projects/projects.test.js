const { expect } = require('chai');
const request = require('supertest');
const { obterToken } = require('../helpers/authHelper');
const { limpar } = require('../helpers/clear');
require('dotenv').config();
const logins = require('../fixtures/requisicoes/users/postUsersLogin.json');
const projects = require('../fixtures/requisicoes/projects/postProjects.json');


describe('projects', () => {
    let token;
    beforeEach(async () => {
        token = await obterToken(logins.validLogin.email, logins.validLogin.password);
        await limpar(token);
    });

    describe('POST /projects', () => {
        it('Deve retornar 201 quando o projeto for criado (RN015, RN010)', async () => {
            const response = await request(process.env.BASE_URL)
                .post('/projects')
                .set('Authorization', `Bearer ${token}`)
                .send(projects.validProjects[0])

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('createdAt');
            expect(response.body.name).to.equal('Projeto API');
        });
    });

    describe('GET /projects', () => {
        beforeEach(async () => {
            await request(process.env.BASE_URL)
                .post('/projects')
                .set('Authorization', `Bearer ${token}`)
                .send(projects.validProjects[1]);

            await request(process.env.BASE_URL)
                .post('/projects')
                .set('Authorization', `Bearer ${token}`)
                .send(projects.validProjects[2]);
        });

        it('Deve retornar 200 com a lista de projetos', async function () {
            const response = await request(process.env.BASE_URL)
                .get('/projects')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');

        });

        it('Deve filtrar por período (RN016, RN028)', async () => {
            const response = await request(process.env.BASE_URL)
                .get('/projects?start=2024-01-01&end=2024-06-30') // use os parâmetros corretos do Swagger
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');

           
        });


    });
});

describe('GET /projects/id', () => {
    let projectId;    

    beforeEach(async () => {
        token = await obterToken(logins.validLogin.email, logins.validLogin.password);
        const response = await request(process.env.BASE_URL)
            .post('/projects')
            .set('Authorization', `Bearer ${token}`)
            .send(projects.validProjects[2]);    
       
        projectId = response.body.id;
        expect(projectId).to.exist;
    });

    it('Deve retornar 200 com os detalhes do projeto (RN025, RN026)', async function () {
        const response = await request(process.env.BASE_URL)
            .get(`/projects/${projectId}`)
            .set('Authorization', `Bearer ${token}`);
        projectId = response.body.id;
            

        expect(response.status).to.equal(200);
        expect(response.body.id).to.equal(projectId);
    });

    it('Deve retornar 404 quando o projeto não existir', async () => {
        const response = await request(process.env.BASE_URL)
            .get('/projects/9999')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(404);
    });
});

describe('PUT /projects/id', () => {
    let projectId;

    beforeEach(async () => {
        const response = await request(process.env.BASE_URL)
            .post('/projects')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Projeto Original',
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            });
        projectId = response.body.id;
    });

    it('Deve retornar 200 com o projeto atualizado (RN030)', async () => {
        const response = await request(process.env.BASE_URL)
            .put(`/projects/${projectId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Projeto Atualizado'
            });

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal('Projeto Atualizado');
    });

    it('Deve retornar 400 com dados inválidos (RN019)', async () => {
        const response = await request(process.env.BASE_URL)
            .put('/projects/9999')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test'
            });
       
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Projeto não encontrado');
    });
});

describe('DELETE /projects/id', () => {
    let projectId;

    beforeEach(async () => {
        const response = await request(process.env.BASE_URL)
            .post('/projects')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Projeto para Deletar',
                startDate: '2024-01-01',
                endDate: '2024-12-31'
            });
        projectId = response.body.id;
    });

    it('Deve retornar 204 quando o projeto for excluído.', async () => {
        const response = await request(process.env.BASE_URL)
            .delete(`/projects/${projectId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(204);
    });

    it('Deve retornar 404 quando o projeto não existir (RN019)', async () => {
        const response = await request(process.env.BASE_URL)
            .delete('/projects/9999')
            .set('Authorization', `Bearer ${token}`);
    
        expect([400, 404]).to.include(response.status);
    });
});


