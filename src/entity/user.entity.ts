import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn} from "typeorm";
import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";

@Entity("oath_user", {schema: "public"})
export class User {
    @PrimaryColumn("character varying", {name: "user_id", comment: "회원 아이디"})
    userId: string;

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        this.password = await bcrypt.hash(this.password, 12);
    }

    @BeforeUpdate()
    async updateDate(): Promise<void> {
        this.updatedAt = await new Date();
    }

    async setEncryptPassword(password: string): Promise<void> {
        this.password = await bcrypt.hash(password, 12);
    }

    @Exclude({ toPlainOnly: true })
    @Column("character varying", {name: "password", comment: "패스워드", nullable: true, select: false})
    password: string | null;

    @Column("character varying", {name: "email", comment: "이메일", nullable: true, select: false})
    email: string | null;

    @Column("character varying", {name: "jwt_token", comment: "jwt refresh token", nullable: true, select: false})
    jwtToken: string | null;

    @Column("character varying", {name: "user_status", comment: "회원 상태값 비회원: 0, 일반 회원: 1, 휴먼 회원: 2, 정지 회원: 3, 폰번호 재인증 필요 회원: 4, 탈퇴 회원: 99", nullable: true, default: 1})
    userStatus: string | null;

    @Column("character varying", {name: "status_msg", comment: "상태 메시지", nullable: true, default: `\'\'`})
    statusMsg: string | null;

    @Column("character varying", {name: "profile_img", comment: "프로필 사진", nullable: true})
    profileImg: string | null;

    @Column("character varying", {name: "phone_num", comment: "휴대폰 번호", nullable: true, select: false})
    phoneNum: string | null;

    @Column("character varying", {name: "country_code", comment: "국가번호", nullable: true, select: false})
    countryCode: string | null;

    @Column("date", {name: "birth", comment: "생년월일", nullable: true, select: false})
    birth: string | null;

    @Column("smallint", {name: "gender", comment: "성별", nullable: true, default: 0, select: false})
    gender: number | null;

    @Column("bigint", {name: "merge_point", comment: "Merge 포인트", nullable: true, default: 0})
    mergePoint: bigint | null;

    @Column("bigint", {name: "merge_asset", comment: "회원 에셋 개수", nullable: true, default: 0})
    mergeAsset: bigint | null;

    @Column("bigint", {name: "f4f_cnt", comment: "맞팔 개수", nullable: true, default: 0})
    f4fCnt: bigint | null;

    @Column("bigint", {name: "following_cnt", comment: "팔로우 개수", nullable: true, default: 0})
    followingCnt: bigint | null;

    @Column("bigint", {name: "follower_cnt", comment: "팔로워 개수", nullable: true, default: 0})
    followerCnt: bigint | null;

    @Column("character varying", {name: "os_type", comment: "OS typeA: Androidl : IOS", nullable: true, select: false})
    osType: string | null;

    @Column("character varying", {name: "push_token", comment: "푸쉬 토큰", nullable: true, select: false})
    pushToken: string | null;

    @Column("character varying", {name: "player_id", comment: "onesignal player id", nullable: true, select: false})
    playerId: string | null;

    @Column("timestamp without time zone", {name: "created_at", comment: "생성일", nullable: true, default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date | null;

    @Column("timestamp without time zone", {name: "updated_at", comment: "수정일", nullable: true, default: () => "CURRENT_TIMESTAMP"})
    updatedAt: Date | null;

    @Column("timestamp without time zone", {name: "deleted_at", comment: "삭제일", nullable: true})
    deletedAt: Date | null;

    @Column("character varying", {name: "username", comment: "실명", nullable: true})
    username: string | null;

    @Column("character varying", {name: "nickname", comment: "닉네임", nullable: true})
    nickname: string | null;

    @Column("uuid", {name: "uuid", comment: "디바이스 고유값", nullable: true, select: false})
    uuid: string | null;

    @Column("character varying", {name: "os_version", comment: "OS버전", nullable: true, select: false})
    osVersion: string | null;

    @Column("character varying", {name: "device_type", comment: "디바이스 기종 타입", nullable: true, select: false})
    deviceType: string | null;

    @Column("character varying", {name: "app_version", comment: "설치된 앱버젼", nullable: true, select: false})
    appVersion: string | null;

    @Column("character varying", {name: "device_lang", comment: "디바이스 설정된 언어값", nullable: true, select: false})
    deviceLang: string | null;

    @Column("timestamp without time zone", {name: "converted_at", comment: "비회원에서 회원으로 변경된 날짜", nullable: true})
    convertedAt: Date | null;

    async comparePw(attempt: string): Promise<boolean> {
        return await bcrypt.compare(attempt, this.password)
    }
}
