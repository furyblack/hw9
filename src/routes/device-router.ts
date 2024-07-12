import {Router, Response, Request} from "express";
import {authRouter} from "./auth-router";
import {authMiddlewareRefresh} from "../middlewares/auth/auth-middleware";
import {QuerySessionRepository} from "../repositories/query-session-repository";


export const deviceRouter = Router({})

authRouter.get('/devices', authMiddlewareRefresh, async (req: Request, res: Response)=>{
    const devices = await QuerySessionRepository.getActiveDevices(req.userDto._id)
    return res.status(200).send(devices)
})

