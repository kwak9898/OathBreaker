"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const class_transformer_1 = require("class-transformer");
let User = class User {
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12);
    }
    async updateDate() {
        this.updatedAt = await new Date();
    }
    async setEncryptPassword(password) {
        this.password = await bcrypt.hash(password, 12);
    }
    async comparePw(attempt) {
        return await bcrypt.compare(attempt, this.password);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)("character varying", {
        name: "user_id",
        comment: "회원 아이디",
    }),
    __metadata("design:type", String)
], User.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "updateDate", null);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, typeorm_1.Column)("character varying", {
        name: "password",
        comment: "패스워드",
        nullable: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "email",
        comment: "이메일",
        nullable: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "jwt_token",
        comment: "jwt refresh token",
        nullable: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "jwtToken", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "user_status",
        comment: "회원 상태값 비회원: 0, 일반 회원: 1, 휴먼 회원: 2, 정지 회원: 3, 폰번호 재인증 필요 회원: 4, 탈퇴 회원: 99",
        nullable: true,
        default: 1,
    }),
    __metadata("design:type", String)
], User.prototype, "userStatus", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "status_msg",
        comment: "상태 메시지",
        nullable: true,
        default: `\'\'`,
    }),
    __metadata("design:type", String)
], User.prototype, "statusMsg", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "profile_img",
        comment: "프로필 사진",
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "profileImg", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "phone_num",
        comment: "휴대폰 번호",
        nullable: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "phoneNum", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "country_code",
        comment: "국가번호",
        nullable: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "countryCode", void 0);
__decorate([
    (0, typeorm_1.Column)("date", {
        name: "birth",
        comment: "생년월일",
        nullable: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "birth", void 0);
__decorate([
    (0, typeorm_1.Column)("smallint", {
        name: "gender",
        comment: "성별",
        nullable: true,
        default: 0,
        select: false,
    }),
    __metadata("design:type", Number)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", {
        name: "merge_point",
        comment: "Merge 포인트",
        nullable: true,
        default: 0,
    }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], User.prototype, "mergePoint", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", {
        name: "merge_asset",
        comment: "회원 에셋 개수",
        nullable: true,
        default: 0,
    }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], User.prototype, "mergeAsset", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", {
        name: "f4f_cnt",
        comment: "맞팔 개수",
        nullable: true,
        default: 0,
    }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], User.prototype, "f4fCnt", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", {
        name: "following_cnt",
        comment: "팔로우 개수",
        nullable: true,
        default: 0,
    }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], User.prototype, "followingCnt", void 0);
__decorate([
    (0, typeorm_1.Column)("bigint", {
        name: "follower_cnt",
        comment: "팔로워 개수",
        nullable: true,
        default: 0,
    }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], User.prototype, "followerCnt", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "os_type",
        comment: "OS typeA: Androidl : IOS",
        nullable: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "osType", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "push_token",
        comment: "푸쉬 토큰",
        nullable: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "pushToken", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "player_id",
        comment: "onesignal player id",
        nullable: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "playerId", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp without time zone", {
        name: "created_at",
        comment: "생성일",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp without time zone", {
        name: "updated_at",
        comment: "수정일",
        nullable: true,
        default: () => "CURRENT_TIMESTAMP",
    }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp without time zone", {
        name: "deleted_at",
        comment: "삭제일",
        nullable: true,
    }),
    __metadata("design:type", Date)
], User.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "username",
        comment: "실명",
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "nickname",
        comment: "닉네임",
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)("uuid", {
        name: "uuid",
        comment: "디바이스 고유값",
        nullable: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "uuid", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "os_version",
        comment: "OS버전",
        nullable: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "osVersion", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "device_type",
        comment: "디바이스 기종 타입",
        nullable: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "deviceType", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "app_version",
        comment: "설치된 앱버젼",
        nullable: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "appVersion", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "device_lang",
        comment: "디바이스 설정된 언어값",
        nullable: true,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "deviceLang", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp without time zone", {
        name: "converted_at",
        comment: "비회원에서 회원으로 변경된 날짜",
        nullable: true,
    }),
    __metadata("design:type", Date)
], User.prototype, "convertedAt", void 0);
User = __decorate([
    (0, typeorm_1.Entity)("oath_user", { schema: "public" })
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map