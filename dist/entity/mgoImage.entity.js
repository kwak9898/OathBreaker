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
exports.MgoImage = void 0;
const typeorm_1 = require("typeorm");
const mgObject_entity_1 = require("./mgObject.entity");
let MgoImage = class MgoImage {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)("character varying", {
        comment: "이미지 고유값",
        nullable: false,
        name: "img_id",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "imgId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "사물 고유값",
        nullable: true,
        name: "mg_id",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "mgId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "이미지 파일명",
        nullable: true,
        name: "img_name",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "imgName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "이미지 url",
        nullable: true,
        name: "img_url",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "imgUrl", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "이미지 s3 key",
        nullable: true,
        name: "s3_key",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "s3Key", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "smallint",
        comment: "사물 이미지 상태값",
        default: () => 0,
        nullable: true,
        name: "status_flag",
    }),
    __metadata("design:type", Number)
], MgoImage.prototype, "statusFlag", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp without time zone", {
        comment: "생성일",
        default: () => "CURRENT_TIMESTAMP",
        nullable: true,
        name: "created_at",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp without time zone", {
        comment: "수정일",
        default: () => "CURRENT_TIMESTAMP",
        nullable: true,
        name: "updated_at",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp without time zone", {
        comment: "삭제일",
        nullable: true,
        name: "deleted_at",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "등록자 타입: MANAGER_USER, MERGE_USER",
        default: "MERGE_USER",
        nullable: true,
        name: "user_type",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "userType", void 0);
__decorate([
    (0, typeorm_1.Column)("double precision", {
        comment: "위도(37.56667)",
        default: () => 0,
        precision: 53,
        nullable: true,
        name: "latitude",
    }),
    __metadata("design:type", Number)
], MgoImage.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)("double precision", {
        comment: "경도(126.97806)",
        default: () => 0,
        precision: 53,
        nullable: true,
        name: "longitube",
    }),
    __metadata("design:type", Number)
], MgoImage.prototype, "longitube", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "mask origin name",
        nullable: true,
        name: "mask_name",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "maskName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "mask s3 키",
        nullable: true,
        name: "s3_key_mask",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "s3KeyMask", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "sallency origin name",
        nullable: true,
        name: "sailency_name",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "sailencyName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "sallency s3 키",
        nullable: true,
        name: "s3_key_sailency",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "s3KeySailency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "smallint",
        comment: "depth_camera(Lidar) 사용 여부 미사용: 0iOS Lidar 사용: 1",
        default: () => 0,
        nullable: true,
        name: "is_depth_camera",
    }),
    __metadata("design:type", Number)
], MgoImage.prototype, "isDepthCamera", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "jsonb",
        comment: '물체 너비 / 폭 / 높이 / 형태, 환경코드, 중앙점 거리값, 가속 X/Y/Z{    "objectWidth": 0.1240021,    "objectLength": 0.1285654,    "objectHeight": 0.1689597,    "objectShape": "Ellipse",    "envCode": "Object_On_Horizontal_Plane",    "centerDepth": 524.2222,    "accelX": 0.04507446,    "accelY": -0.8758545,    "accelZ": -0.4858856,}',
        nullable: true,
        name: "meta_data",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "metaData", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "depth origin 파일명",
        nullable: true,
        name: "depth_name",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "depthName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "depth s3 키",
        nullable: true,
        name: "s3_key_depth",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "s3KeyDepth", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "confidence origin 파일명",
        nullable: true,
        name: "confidence_name",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "confidenceName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "confidence s3 키",
        nullable: true,
        name: "s3_key_confidence",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "s3KeyConfidence", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "회원 아이디",
        nullable: true,
        name: "user_id",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "사람이 직접 입력한 옳은 이름",
        nullable: true,
        name: "correct_name",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "correctName", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "머지웨어에서 생성된 Crab 이미지",
        nullable: true,
        name: "crop_img_url",
    }),
    __metadata("design:type", String)
], MgoImage.prototype, "cropImgUrl", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => mgObject_entity_1.MgObject, (mgObject) => mgObject.mgoImages),
    (0, typeorm_1.JoinColumn)([{ name: "mg_id", referencedColumnName: "mgId" }]),
    __metadata("design:type", Array)
], MgoImage.prototype, "mgo", void 0);
MgoImage = __decorate([
    (0, typeorm_1.Index)("mgo_image_pk", ["imgID"], { unique: true }),
    (0, typeorm_1.Index)("mgo_image_img_id_uindex", ["imgId"], { unique: true }),
    (0, typeorm_1.Entity)("mgo_image", { schema: "public" })
], MgoImage);
exports.MgoImage = MgoImage;
//# sourceMappingURL=mgoImage.entity.js.map