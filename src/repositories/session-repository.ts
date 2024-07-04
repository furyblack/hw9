import {SessionType} from "../types/session/sessionType";
import {sessionCollection} from "../db/db";


export class SessionRepository{

    static async createSession(session:SessionType ){
        await sessionCollection.insertOne(session)
    }
}