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
exports.MgObject = void 0;
const typeorm_1 = require("typeorm");
const mgoImage_entity_1 = require("./mgoImage.entity");
let MgObject = class MgObject {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)("character varying", { comment: "사물 고유값", name: "mg_id" }),
    __metadata("design:type", String)
], MgObject.prototype, "mgId", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        comment: "사물 그룹 아이디",
        name: "mg_group_id",
    }),
    __metadata("design:type", String)
], MgObject.prototype, "mgGroupId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        comment: "사물 이름",
        name: "mg_name",
        nullable: true,
    }),
    __metadata("design:type", String)
], MgObject.prototype, "mgName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "smallint",
        comment: "상태값",
        default: () => 0,
        name: "status_flag",
        nullable: true,
    }),
    __metadata("design:type", Number)
], MgObject.prototype, "statusFlag", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp without time zone", {
        comment: "생성일",
        default: () => "CURRENT_TIMESTAMP",
        name: "created_at",
        nullable: true,
    }),
    __metadata("design:type", Date)
], MgObject.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp without time zone", {
        comment: "수정일",
        default: () => "CURRENT_TIMESTAMP",
        name: "updated_at",
        nullable: true,
    }),
    __metadata("design:type", Date)
], MgObject.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp without time zone", {
        comment: "삭제일",
        nullable: true,
        name: "deleted_at",
    }),
    __metadata("design:type", Date)
], MgObject.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        comment: "사물 분류",
        nullable: true,
        name: "mg_category",
    }),
    __metadata("design:type", String)
], MgObject.prototype, "mgCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "bigint",
        comment: "좋아요 개수",
        default: () => 0,
        name: "like_cnt",
        nullable: true,
    }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], MgObject.prototype, "likeCnt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "int",
        comment: "좋아요 순위",
        default: 9999,
        name: "like_rank",
        nullable: true,
    }),
    __metadata("design:type", Number)
], MgObject.prototype, "likeRank", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "int",
        comment: "순위 변동",
        default: 0,
        name: "rank_change",
        nullable: true,
    }),
    __metadata("design:type", Number)
], MgObject.prototype, "rankChange", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => mgoImage_entity_1.MgoImage, (mgoImage) => mgoImage.mgo),
    __metadata("design:type", Array)
], MgObject.prototype, "mgoImages", void 0);
MgObject = __decorate([
    (0, typeorm_1.Index)("mg_object_mg_id_uindex", ["mgId"], { unique: true }),
    (0, typeorm_1.Index)("mg_object_pk", ["mgId"], { unique: true }),
    (0, typeorm_1.Entity)("mgobject", { schema: "public" })
], MgObject);
exports.MgObject = MgObject;
//# sourceMappingURL=mgObject.entity.js.map