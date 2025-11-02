const request = require('supertest');
require('dotenv').config();

const limpar = async (token) => {
  await request(process.env.BASE_URL)
    .delete('/projects') // endpoint que limpa todos os projetos
    .set('Authorization', `Bearer ${token}`);
};

module.exports = { 
    limpar
 };
