import {sessionCollection} from "../db/db";

export class QuerySessionRepository {
    static async getActiveDevises(userId:string, liveTime: number){
        const now = new Date()
        const newTime = new Date(now.getTime()-liveTime*1000)
        try {
            const sessions = await sessionCollection.find({
                userId:userId,
                lastActiveDate:{ $gt: newTime}
            }).toArray()
            //мапим данные сессии для требуемого формата на клиент
            const formatedSessions = sessions.map(session=>({
                ip:session.ip,
                title: session.title,
                lastActiveDate:session.lastActiveDate.toISOString(),
                deviceId:session.deviceId
            }))
            return formatedSessions
        }catch (error){
            console.error('Error fetching active devices', error)
            throw new Error('database query failed')
        }
    }

    static async terminateOtherSessions(userId:string, currentDeviceId:string){
        try {
            const result = await sessionCollection.deleteMany({
                userId:userId,
                deviceId:{ $ne:currentDeviceId }
            });
            return result.deletedCount>0
        }catch (error){
            console.error('error terminating other sessions', error)
            throw new Error('database query failed')
        }
    }
    static async terminateSpecificSession(userId:string, deviceIdToDelete:string){
        try {
            const result = await sessionCollection.deleteOne({
                userId:userId,
                deviceId:deviceIdToDelete
            })
            return result.deletedCount>0

        }catch (error){
            console.error('error terminate specific session', error)
            throw new Error('database query failed')
        }
    }
    static async findSessionByIdAndUser(deviceId:string){
        try {
            return await sessionCollection.findOne({deviceId:deviceId})
        }catch (error){
            console.error('error finding session',  error)
            throw new Error('database query failed')
        }
    }
}