import {Router, Response, Request} from "express";
import {authRouter} from "./auth-router";
import {authMiddlewareRefresh} from "../middlewares/auth/auth-middleware";
import {SessionType} from "../types/session/sessionType";
import {QuerySessionRepository} from "../repositories/query-session-repository";


export const deviceRouter = Router({})

authRouter.get('/devices', authMiddlewareRefresh, async (req: Request, res: Response<SessionType[]>)=>{

    // const activeSessions = await QuerySessionRepository.getAllActiveDevices(req.params.userId)
})