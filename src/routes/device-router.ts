import {Router, Response, Request} from "express";
import {authMiddlewareRefresh} from "../middlewares/auth/auth-middleware";
import {refreshTokenExpiration} from "../application/jwt-service"
import {QuerySessionRepository} from "../repositories/query-session-repository";



export const deviceRouter = Router({})

deviceRouter.get('/devices', authMiddlewareRefresh, async (req: Request, res: Response)=>{
   const userId = req.userDto._id.toString()
    const liveTime = refreshTokenExpiration //время жизни рефрештокена в секундах
    // Получаем текущую дату и время
    const now = new Date();
   try {
       const sessions = await QuerySessionRepository.getActiveDevises(userId, liveTime)
       res.status(200).send(sessions)
   }catch (error){
       res.status(500).send({error:'something goes wrong'})
   }

// Вычисляем новое время, отнимая 20 секунд
//     const newTime = new Date(now.getTime() - liveTime * 1000);
//     const sessions = await sessionCollection.find(({
//         userId: userId,
//         lastActiveDate: { $gt: newTime }
//     })).toArray()
//     res.status(200).send(sessions)
})

deviceRouter.delete('/devices', authMiddlewareRefresh, async (req:Request, res:Response)=>{
    const userId = req.userDto._id.toString()
    const deviceId = req.deviceId

    try {
        await QuerySessionRepository.terminateOtherSessions(userId, deviceId)
        res.sendStatus(204)
    }catch (error){
        res.sendStatus(500)
    }
})
deviceRouter.delete('/devices/:deviceId', authMiddlewareRefresh, async (req: Request, res: Response) => {
    const userId = req.userDto._id.toString();
    const deviceIdToDelete = req.params.deviceId;

    try {
        // существует ли сессия и принадлежит ли пользователю?
        const session = await QuerySessionRepository.findSessionByIdAndUser(deviceIdToDelete);
        if (!session) {
            return res.sendStatus(404);
        }
        if(session.userId !== userId ){
            return res.status(403).send({ message: 'forbidden: Cannot delete session that does not belong to user' });
        }
        const isDeleted = await QuerySessionRepository.terminateSpecificSession(userId, deviceIdToDelete);
        if (isDeleted) {
            return res.sendStatus(204);
        } else {
            return res.sendStatus(404);
        }
    } catch (error) {
        console.error('Error deleting session', error);
        return res.sendStatus(500);
    }
});
