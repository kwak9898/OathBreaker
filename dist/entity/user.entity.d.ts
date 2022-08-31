export declare class user {
    userId: string;
    hashPassword(): Promise<void>;
    updateDate(): Promise<void>;
    setEncryptPassword(password: string): Promise<void>;
    password: string;
    email: string;
    jwtToken: string;
    userStatus: string;
    statusMsg: string;
    profileImg: string;
    phoneNum: string;
    countryCode: string;
    birth: string;
    gender: number;
    mergePoint: bigint;
    mergeAsset: bigint;
    f4fCnt: bigint;
    followingCnt: bigint;
    followerCnt: bigint;
    osType: string;
    pushToken: string;
    playerId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    username: string;
    nickname: string;
    uuid: string;
    osVersion: string;
    deviceType: string;
    appVersion: string;
    deviceLang: string;
    convertedAt: Date;
    comparePw(attempt: string): Promise<boolean>;
}