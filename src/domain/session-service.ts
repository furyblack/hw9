import {SessionType} from "../types/session/sessionType";
import {SessionRepository} from "../repositories/session-repository";
import {sessionCollection} from "../db/db";

export class SessionService {


    static async createSession(data: SessionType ) {
        const {ip, title, lastActiveDate, deviceId} = data
        await SessionRepository.createSession({
            ip,
            title,
            lastActiveDate,
            deviceId
        });

    }
    static async findSessionByDeviceId(deviceId: string): Promise<SessionType | null> {
        return await SessionRepository.findSessionByDeviceId(deviceId);
    }

    static async deleteSessionByDeviceId(deviceId: string): Promise<void>{
        await sessionCollection.deleteOne({deviceId})
    }
}