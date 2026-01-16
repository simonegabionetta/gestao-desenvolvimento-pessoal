import request from 'supertest';
import dotenv from 'dotenv';
dotenv.config();

const limpar = async (token) => {
  await request(process.env.BASE_URL)
    .delete('/projects') // endpoint que limpa todos os projetos
    .set('Authorization', `Bearer ${token}`);
};

export { limpar };
