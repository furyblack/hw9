import request from "supertest";
import {app} from "../../src/settings";

describe('/login', () =>{
    beforeAll(async ()=>{
        await request(app).delete('/testing/all-data')
    })

    it('should return 200', async ()=>{
        await request(app)
            .get('/login')
            .expect(200)
    })
    it('should return 404', async ()=>{
        await request(app)
            .get('/login/1')
            .expect(404)
    })
    it('/login', async ()=>{
        await request(app)
            .post('/login')
            .send({loginOrEmail:''})
            .expect(200)
    })
    it('should create user/', async ()=>{
        await request(app)
            .post('registration')
            .send({login:"miha", email:"miha252010@gmail.com", password:'234222'})
            .expect(204)
    })
})