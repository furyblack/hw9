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
}