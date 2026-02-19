const request = require('supertest');
require('dotenv').config();

const limpar = async (token) => {
  const endpoints = ['/goals', '/projects', '/mentorships', '/improvements', '/learning', '/notes'];
  for (const endpoint of endpoints) {
    await request(process.env.BASE_URL)
      .delete(endpoint)
      .set('Authorization', `Bearer ${token}`);
  }
};

module.exports = { limpar };