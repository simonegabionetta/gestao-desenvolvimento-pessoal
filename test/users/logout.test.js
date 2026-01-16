// bibliotecas
import request from 'supertest';
import { expect } from 'chai';
import "dotenv/config";

// fixtures
import logins from '../fixtures/requisicoes/users/postUsersLogin.json' assert { type: 'json' };

// helpers
import { obterToken } from '../helpers/authHelper.js';

describe('users', () => {
    describe('POST /users/logout', () => {
        let token;

         before(async () => {
         token = await obterToken(logins.validLogin.email, logins.validLogin.password);
        });      

        it('Deve retornar 200 com mensagem de sucesso quando logout for realizado', async () => {
            const response = await request(process.env.BASE_URL)
                .post('/users/logout')
                .set('Authorization', `Bearer ${token}`)              
        
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.be.a('string');
        });

        it('Deve retornar 401 quando o token não for fornecido', async () => {
            const response = await request(process.env.BASE_URL)             
                .post('/users/logout');

            expect(response.status).to.equal(401);
        });
    });
});
