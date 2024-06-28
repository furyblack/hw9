import {WithId} from "mongodb";
import jwt from 'jsonwebtoken';
import {UserAccountDBType} from "../types/users/inputUsersType";
import {refreshBlackListCollection} from "../db/db";

const refreshTokenSecret = 'your_refresh_token_secret';
const refreshTokenExpiration = '20s';  // Время жизни refresh токена

export const jwtService={

    async  createAccessToken(user:WithId<UserAccountDBType>){
        return jwt.sign({userId: user._id}, process.env.JWT_SECRET as string, {expiresIn: '10s'})

    },
    async createRefreshToken(user: WithId<UserAccountDBType>) {
        return jwt.sign({ userId: user._id }, refreshTokenSecret, { expiresIn: refreshTokenExpiration });
    },

    async getUserIdByToken(token:string){
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET as string)
            return  result.userId
        }catch (error){
            return null
        }
    },
    async verifyRefreshToken(token: string) {
        const blacklistedToken = await refreshBlackListCollection.findOne({ token });
        if (blacklistedToken) {
            throw new Error('Token is blacklisted');
        }
        return jwt.verify(token, refreshTokenSecret);
    },

    async getUserIdByRefreshToken(token: string) {
        try {
            const result: any = await this.verifyRefreshToken(token);
            return result.userId;
        } catch (error) {
            return null;
        }
    },
    async revokeRefreshToken(token: string) {
        await refreshBlackListCollection.insertOne({ token, blacklistedAt: new Date() });
    }
}