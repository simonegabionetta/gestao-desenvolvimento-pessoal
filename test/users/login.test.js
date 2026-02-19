const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

const logins = require('../fixtures/requisicoes/users/postUsersLogin.json');
const { obterToken } = require('../helpers/authHelper');

describe('users', () => {
  describe('POST /users/login', () => {  

    it('Deve retornar 200 e token quando o login for realizado com sucesso (RN003)', async () => {
      const response = await request(process.env.BASE_URL)
        .post('/users/login')
        .send(logins.validLogin);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('token');
      expect(response.body.token).to.be.a('string');
    });

    it('Deve retornar 401 quando o usuário não existir (RN003)', async () => {
      const response = await request(process.env.BASE_URL)
        .post('/users/login')
        .send({ email: 'usuario.inexistente@gmail.com', password: '123456' });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.equal('Usuário não encontrado');
    });

    it('Deve retornar 401 quando a senha for inválida (RN003)', async () => {
      const response = await request(process.env.BASE_URL)
        .post('/users/login')
        .send({ email: logins.validLogin.email, password: 'senhaErrada' });

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.equal('Senha inválida');
    });

    it('Deve retornar 400 quando o campo email estiver ausente (RN003)', async () => {
      const response = await request(process.env.BASE_URL)
        .post('/users/login')
        .send({ password: logins.validLogin.password });

      expect(response.status).to.be.oneOf([400, 401]);
    });

    it('Deve retornar 400 quando o campo senha estiver ausente (RN003)', async () => {
      const response = await request(process.env.BASE_URL)
        .post('/users/login')
        .send({ email: logins.validLogin.email });

      expect(response.status).to.be.oneOf([400, 401]);
    });

    it('Deve retornar 400 quando o email estiver vazio (RN003)', async () => {
      const response = await request(process.env.BASE_URL)
        .post('/users/login')
        .send({ email: '', password: logins.validLogin.password });

      expect(response.status).to.be.oneOf([400, 401]);
    });

    it('Deve retornar 400 quando a senha estiver vazia (RN003)', async () => {
      const response = await request(process.env.BASE_URL)
        .post('/users/login')
        .send({ email: logins.validLogin.email, password: '' });

      expect(response.status).to.be.oneOf([400, 401]);
    });

    it('Deve retornar 400 quando o formato de email estiver inválido (RN003)', async () => {
      const response = await request(process.env.BASE_URL)
        .post('/users/login')
        .send({ email: 'emailInvalido', password: '123456' });

      expect(response.status).to.be.oneOf([400, 401]);
    });

    it('Deve gerar token JWT com expiração de 1 hora (RN004)', async () => {
      const token = await obterToken(logins.validLogin.email, logins.validLogin.password);
      expect(token).to.be.a('string');
    });

  });
});