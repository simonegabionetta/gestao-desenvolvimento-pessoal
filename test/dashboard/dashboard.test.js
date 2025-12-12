
import { expect } from 'chai';
import request from 'supertest';
import { obterToken } from '../helpers/authHelper.js';
import { limpar } from '../helpers/clear.js';
import dotenv from 'dotenv';
import logins from '../fixtures/requisicoes/users/postUsersLogin.json' assert { type: 'json' };
import goals from '../fixtures/requisicoes/dashboard/postGoals.json' assert { type: 'json' };
dotenv.config();

describe('dashboard', () => {
    let token;

    beforeEach(async () => {
        token = await obterToken(logins.validLogin.email, logins.validLogin.password);
        await limpar(token);
    });

    describe('POST /goals', () => {
        it('Deve criar metas corretamente', async () => {
            const response = await request(process.env.BASE_URL)
                .post('/goals')
                .set('Authorization', `Bearer ${token}`)
                .send(goals.validGoals[0]);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('id');
            expect(response.body.title).to.equal('Meta Pessoal Planejada');
        });
    });

    describe('GET /dashboard/goals-summary', () => {
        beforeEach(async () => {
            for (let goal of goals.validGoals) {
                await request(process.env.BASE_URL)
                    .post('/goals')
                    .set('Authorization', `Bearer ${token}`)
                    .send(goal);
            }
        });

        it('Deve retornar resumo das metas (pessoal/profissional)', async () => {
            const response = await request(process.env.BASE_URL)
                .get('/dashboard/goals-summary')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('pessoal');
            expect(response.body).to.have.property('profissional');
            expect(response.body.pessoal).to.have.property('planejada');
            expect(response.body.pessoal).to.have.property('concluida');
            expect(response.body.profissional).to.have.property('planejada');
            expect(response.body.profissional).to.have.property('concluida');
        });
    });

    describe('GET /dashboard/progress-graph', () => {
        beforeEach(async () => {
            for (let goal of goals.validGoals) {
                await request(process.env.BASE_URL)
                    .post('/goals')
                    .set('Authorization', `Bearer ${token}`)
                    .send(goal);
            }
        });

        it('Deve retornar gráfico de progresso', async () => {
            const response = await request(process.env.BASE_URL)
                .get('/dashboard/progress-graph')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('object');
        });

        it('Deve agrupar metas por mês (YYYY-MM)', async () => {
            const response = await request(process.env.BASE_URL)
                .get('/dashboard/progress-graph')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            const keys = Object.keys(response.body);
            if (keys.length > 0) {
                expect(keys[0]).to.match(/^\d{4}-\d{2}$/);
            }
        });
    });

    describe('GET /dashboard/filter', () => {
        beforeEach(async () => {
            for (let goal of goals.validGoals) {
                await request(process.env.BASE_URL)
                    .post('/goals')
                    .set('Authorization', `Bearer ${token}`)
                    .send(goal);
            }
        });

        it('Deve filtrar metas por tipo e status', async () => {
            const response = await request(process.env.BASE_URL)
                .get('/dashboard/filter?type=Pessoal&status=planejada')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
            response.body.forEach(goal => {
            expect(goal.type).to.equal('Pessoal');
            expect(goal.status).to.equal('planejada');
            });
        });

        it('Deve filtrar metas por período', async function () {
            const response = await request(process.env.BASE_URL)
                .get('/dashboard/filter?start=2024-11-01&end=2024-11-30') // separa start e end
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });
    });
});
