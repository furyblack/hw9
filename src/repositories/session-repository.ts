import {SessionType} from "../types/session/sessionType";
import {sessionCollection} from "../db/db";


export class SessionRepository{

    static async createSession(session:SessionType ){
        await sessionCollection.insertOne(session)
    }
    static async findSessionByDeviceId(deviceId: string): Promise<SessionType | null> {
        return await sessionCollection.findOne({ deviceId });
    }

    static async updateSession(session: SessionType): Promise<void> {
        await sessionCollection.updateOne(
            { deviceId: session.deviceId },
            { $set: {  lastActiveDate: session.lastActiveDate } }
        );
    }
}