import request from "supertest";
import {app} from "../../src/settings";
import {jwtService} from "../../src/application/jwt-service";


let deviceId

describe('devices', ()=>{
    beforeAll(async ()=>{
        //создание тестового пользователя и сессии для него
        const user = {id:'testUserId'}
        // Создаем токены доступа и обновления
        const token = await jwtService.createAccessToken(user);
        const refreshToken = await jwtService.createRefreshToken(user);
    })
})