import {WithId} from "mongodb";
import jwt from 'jsonwebtoken';
import {UserAccountDBType} from "../types/users/inputUsersType";

import {randomUUID} from "node:crypto";
import {JwtPayload} from "../types/session/sessionType";

//const refreshTokenSecret = 'your_refresh_token_secret';  было
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_token_secret'; //стало
const refreshTokenExpiration = '20s';  // Время жизни refresh токена


export const jwtService={

    async  createAccessToken(user:WithId<UserAccountDBType>){
        return jwt.sign({userId: user._id}, process.env.JWT_SECRET as string, {expiresIn: '10s'})

    },
    async createRefreshToken(user: WithId<UserAccountDBType>) {
        const deviceId = randomUUID()
        return jwt.sign({ userId: user._id, deviceId }, refreshTokenSecret, { expiresIn: refreshTokenExpiration });
    },
    async createRefreshTokenWithDeveceID(user: WithId<UserAccountDBType >, deviceId:string) {

        return jwt.sign({ userId: user._id, deviceId }, refreshTokenSecret, { expiresIn: refreshTokenExpiration });
    },
    //добавить метод createrefreshtoken с diveceid

    async getPayload (token: string){
        return  jwt.decode(token) as jwt.JwtPayload;
    },


    async getUserIdByToken(token:string){
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET as string)
            return  result.userId
        }catch (error){
            return null
        }
    },




    async getUserIdByRefreshToken(token: string) {
        try {
            const result = jwt.verify(token, refreshTokenSecret) as JwtPayload //заменить на нормальный тип payload ..написал еще один тип и пропиал его тут
            return result
        } catch (error) {
            return null;
        }
    },

}