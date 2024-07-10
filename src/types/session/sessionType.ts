export type SessionType = {
    ip: string,
    title: string,
    lastActiveDate: Date,
    deviceId: string
}


export type JwtPayload = {
    userId: string,
    iat: number,
    exp: number,
    deviceId: string
}
export type UpdateSessionType ={
    lastActiveDate: Date;
    deviceId: string;
}

export type deviceViewModel = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}
