import {Router, Response, Request} from "express";

import {authMiddlewareRefresh} from "../middlewares/auth/auth-middleware";
import {refreshTokenExpiration} from "../application/jwt-service";
import {sessionCollection} from "../db/db";



export const deviceRouter = Router({})

deviceRouter.get('/devices', authMiddlewareRefresh, async (req: Request, res: Response)=>{
   const userId = req.userDto._id.toString()
    const liveTime = refreshTokenExpiration //время жизни рефрештокена в секундах
    // Получаем текущую дату и время
    const now = new Date();

// Вычисляем новое время, отнимая 20 секунд
    const newTime = new Date(now.getTime() - liveTime * 1000);
    const sessions = await sessionCollection.find(({
        userId: userId,
        lastActiveDate: { $gt: newTime }
    })).toArray()
    console.log(sessions)
    res.status(200).send(sessions)
})

