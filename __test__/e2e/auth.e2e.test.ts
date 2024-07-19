import request from "supertest";
import {app} from "../../src/settings";


const incorrectUserData = {
    login: "",
    password: "",
    email: ""
};

const userCreateData = {
    login: "testtt",
    password: "testtt34",
    email: "miha25646@gmail.com"
};

let user;
let firstRefreshToken: any;
let secondRefreshToken: any

describe('/auth', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data');
    });

    it('should create user with correct input data', async () => {
        const createResponse = await request(app)
            .post('/users')
            .auth("admin", "qwerty")
            .send(userCreateData)
            .expect(201);
        expect(createResponse.body.login).toEqual(userCreateData.login);
        expect(createResponse.body.email).toEqual(userCreateData.email);
        expect(createResponse.body.id).toEqual(expect.any(String));
        user = createResponse.body;
    });

    it('should login user first time', async () => {
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({ loginOrEmail: userCreateData.login, password: userCreateData.password })
            .expect(200);
        firstRefreshToken = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

        const sessionsResponse1 = await request(app)
            .get('/security/devices')
            .set('Cookie', `refreshToken=${firstRefreshToken}`)
            .expect(200);

        expect(sessionsResponse1.body).toHaveLength(1);
    });

    it('should login user second time', async () => {
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({ loginOrEmail: userCreateData.login, password: userCreateData.password })
            .expect(200);
        const secondRefreshToken = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

        const sessionsResponse2 = await request(app)
            .get('/security/devices')
            .set('Cookie', `refreshToken=${secondRefreshToken}`)
            .expect(200);

        expect(sessionsResponse2.body).toHaveLength(2);
    });

    it('should logout 1 user', async () => {
        await request(app)
            .post('/auth/logout')
            .set('Cookie', `refreshToken=${firstRefreshToken}`)
            .expect(204);

    });
});

//после разделения токена
// 1 запросить сессии должна быть одна
// 2) второй логин появляется вторая
// 3) логаут проверка что сессй стало меньше
// 3) снова логин и удаляем сессию по ай ди смотрим что осталась 1 сессия
// 4) логин и удаляем все сессии кроме текущей остальтся должна одна
