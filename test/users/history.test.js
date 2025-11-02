// bibliotecas
const { expect } = require('chai');
const request = require('supertest');

// fixtures
const users = require('../fixtures/requisicoes/users/postUsersRegister.json');

// helpers
const { obterToken } = require('../helpers/authHelper');

describe('users', () => {
    let obterToken;

    before(async () => {
    token = await obterToken(logins.validLogin.email, logins.validLogin.password);
    });

    before(async () => {
        // Garante que o usuário válido esteja registrado
        await request(process.env.BASE_URL)
            .post('/users/register')
            .set('Authorization', `Bearer ${token}`)
            .send(users.validUser)
            .catch(() => { }); // ignora erro se usuário já existe    

        

        const existingUser = users.validUser;

        // adiciona histórico
        existingUser.history = [
            { action: 'Criou uma meta', date: '2024-01-15' },
            { action: 'Atualizou perfil', date: '2024-01-14' },
            { action: 'Criou um projeto', date: '2024-01-13' },
            { action: 'Fez login', date: '2024-01-12' },
            { action: 'Criou uma anotação', date: '2024-01-11' },
            { action: 'Atualizou meta', date: '2024-01-10' },
            { action: 'Deletou projeto', date: '2024-01-09' },
            { action: 'Criou aprendizado', date: '2024-01-08' },
            { action: 'Registrou mentoria', date: '2024-01-07' },
            { action: 'Criou melhoria', date: '2024-01-06' },
            { action: 'Fez logout', date: '2024-01-05' },
            { action: 'Visualizou dashboard', date: '2024-01-04' }
        ];

    });
});

describe('GET /users/me/history', async() => {
    const token = await obterToken(users.validUser.email,users.validUser.password) 

    it('Deve retornar 200 com a lista de atividades', async () => {
        const response = await request(process.env.BASE_URL)
            .get('/users/me/history')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });

    it('Deve retornar 401 quando token não fornecido', async () => {
        const response = await request(process.env.BASE_URL)
            .get('/users/me/history')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).to.equal(401);
    });

    it('Deve limitar o histórico a 10 registros por padrão (RN007)', async () => {
        const response = await request(process.env.BASE_URL)
            .get('/users/me/history')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.length).to.be.at.most(10);
    });

    it('Deve permitir paginação com parâmetro de limite (RN029)', async () => {
        const response = await request(process.env.BASE_URL)
            .get('/users/me/history?limit=5')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(5);
    });

    it('Deve permitir paginação com limite e offset (RN007)', async () => {
        const response1 = await request(process.env.BASE_URL)
            .get('/users/me/history?limit=5&offset=0')
            .set('Authorization', `Bearer ${token}`);

        const response2 = await request(process.env.BASE_URL)
            .get('/users/me/history?limit=5&offset=5')
            .set('Authorization', `Bearer ${token}`)

        expect(response1.status).to.equal(200);
        expect(response2.status).to.equal(200);
        // garante que as ações sejam diferentes
        expect(response1.body[0].action).to.not.equal(response2.body[0].action);
    });
});

