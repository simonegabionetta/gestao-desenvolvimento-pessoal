//bilbiotecas
import request from 'supertest';
import { expect } from 'chai';
import "dotenv/config";

//fixtures
import users from '../fixtures/requisicoes/users/postUsersRegister.json' assert { type: 'json' };

describe('users', () => {

  describe('POST /users/register', () => {
    
    it('Deve retornar 201 com os dados do usuário quando o registro for bem-sucedido', async () => {
      
      const validUser = {
        ...users.validUser,
        email: `ana.santos+${Date.now()}@gmail.com`
      };

      const response = await request(process.env.BASE_URL)
        .post('/users/register')
        .set('Content-Type', 'application/json')
        .send(validUser);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('name', validUser.name);
      expect(response.body).to.have.property('email', validUser.email);
      expect(response.body).to.not.have.property('password');
    });

    it('Deve retornar 400 quando o usuário já existir', async () => {

      const userAlreadyExists = users.userAlreadyExists;

      // Primeiro cadastro
      await request(process.env.BASE_URL)
        .post('/users/register')
        .set('Content-Type', 'application/json')
        .send(userAlreadyExists);

      // Tentativa duplicada
      const response = await request(process.env.BASE_URL)
        .post('/users/register')
        .set('Content-Type', 'application/json')
        .send(userAlreadyExists);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
    });

    it('Deve retornar erro se o e-mail já estiver cadastrado (RN001)', async () => {

      const duplicateUser = {
        ...users.duplicateUser,
        email: `joao.silva+${Date.now()}@gmail.com`
      };

      // Cadastra o usuário
      await request(process.env.BASE_URL)
        .post('/users/register')
        .send(duplicateUser);

      // Tenta novamente com o mesmo e-mail
      const response = await request(process.env.BASE_URL)
        .post('/users/register')
        .send(duplicateUser);

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
    });

    it('Deve retornar os dados do usuário sem o campo de senha ao registrar com sucesso (RN001)', async () => {
      const uniqueEmail = `teste+${Date.now()}@gmail.com`;
      const newUser = {
        ...users.validUser,
        email: uniqueEmail
      };

      const response = await request(process.env.BASE_URL)
        .post('/users/register')
        .send(newUser);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('email');
      expect(response.body).to.not.have.property('password');
    });

    it('Deve criptografar a senha corretamente (RN002)', async () => {
 
      const validUser = {
        ...users.validUser,
        email: `fernanda.costa+${Date.now()}@gmail.com`
      };

      const response = await request(process.env.BASE_URL)
        .post('/users/register')
        .send(validUser);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('id');
      expect(response.body).to.not.have.property('password');
    });
  });
});
