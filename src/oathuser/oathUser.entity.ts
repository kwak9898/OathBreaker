import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity("oath_user", {schema: "public"})
export class OathUser {
    @PrimaryColumn("character varying", {name: "user_id", comment: "회원 아이디"})
    userId: string;

    @Column("character varying", {name: "password", comment: "패스워드"})
    password: string;

    @Column("character varying", {name: "email", comment: "이메일"})
    email: string;

    @Column("character varying", {name: "jwt_token", comment: "jwt refresh token"})
    jwtToken: string;

    @Column("character varying", {name: "user_status", comment: "회원 상태값 비회원: 0, 일반 회원: 1, 휴먼 회원: 2, 정지 회원: 3, 폰번호 재인증 필요 회원: 4, 탈퇴 회원: 99"})
    userStatus: string;

    @Column("character varying", {name: "status_msg", comment: "상태 메시지"})
    statusMsg: string;

    @Column("character varying", {name: "profile_img", comment: "프로필 사진"})
    profileImg: string;

    @Column("character varying", {name: "phone_num", comment: "휴대폰 번호"})
    phoneNum: string;

    @Column("character varying", {name: "country_code", comment: "국가번호"})
    countryCode: string;

    @Column("date", {name: "birth", comment: "생년월일"})
    birth: Date;

    @Column("smallint", {name: "gender", comment: "성별"})
    gender: number;

    @Column("bigint", {name: "merge_point", comment: "Merge 포인트"})
    mergePoint: bigint;

    @Column("bigint", {name: "merge_asset", comment: "회원 에셋 개수"})
    mergeAsset: bigint;

    @Column("bigint", {name: "f4f_cnt", comment: "맞팔 개수"})
    f4fCnt: bigint;

    @Column("bigint", {name: "following_cnt", comment: "팔로우 개수"})
    followingCnt: bigint;

    @Column("bigint", {name: "follower_cnt", comment: "팔로워 개수"})
    followerCnt: bigint;

    @Column("character varying", {name: "os_type", comment: "OS typeA: Androidl : IOS"})
    osType: string;
}
