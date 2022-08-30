import {Entity, PrimaryColumn, Column, Index, ManyToOne, JoinColumn} from "typeorm";
import {MgObject} from "../mgobject/mgObject.entity";

@Index("mgo_image_pk", ["imgID"], {unique: true})
@Index("mgo_image_img_id_uindex", ["imgId"], {unique: true})
@Entity("mgo_image", {schema: "public"})
export class MgoImage {
    @PrimaryColumn("character varying", {comment: "이미지 고유값", nullable: false, name: "img_id"})
    imgId: string;

    @Column("character varying", {comment: "사물 고유값", nullable: true, name: "mg_id"})
    mgId: string;

    @Column("character varying", { comment: "이미지 파일명", nullable: true, name: "img_name"})
    imgName: string;

    @Column("character varying", {comment: "이미지 url", nullable: true, name: "img_url"})
    imgUrl: string;

    @Column("character varying", {comment: "이미지 s3 key", nullable: true, name: "s3_key"})
    s3Key: string;

    @Column({type: "smallint", comment: "사물 이미지 상태값", default: () => 0, nullable: true, name: "status_flag"})
    statusFlag: number;

    @Column("timestamp without time zone", {comment: "생성일", default: () => "CURRENT_TIMESTAMP", nullable: true, name: "created_at"})
    createdAt: string;

    @Column("timestamp without time zone", {comment: "수정일", default: () => "CURRENT_TIMESTAMP", nullable: true, name: "updated_at"})
    updatedAt: string;

    @Column("timestamp without time zone", {comment: "삭제일", nullable: true, name: "deleted_at"})
    deletedAt: string;

    @Column("character varying", {comment: "등록자 타입: MANAGER_USER, MERGE_USER", default: "MERGE_USER", nullable: true, name: "user_type"})
    userType: string;

    @Column("double precision", {comment: "위도(37.56667)", default: () => 0, precision: 53, nullable: true, name: "latitude"})
    latitude: number;

    @Column("double precision", {comment: "경도(126.97806)", default: () => 0, precision: 53, nullable: true, name: "longitube"})
    longitube: number;

    @Column("character varying", {comment: "mask origin name", nullable: true, name: "mask_name"})
    maskName: string;

    @Column("character varying", {comment: "mask s3 키", nullable: true, name: "s3_key_mask"})
    s3KeyMask: string;

    @Column("character varying", {comment: "sallency origin name", nullable: true, name: "sailency_name"})
    sailencyName: string;

    @Column("character varying", {comment: "sallency s3 키", nullable: true, name: "s3_key_sailency"})
    s3KeySailency: string;

    @Column({type: "smallint", comment: "depth_camera(Lidar) 사용 여부 미사용: 0iOS Lidar 사용: 1", default: () => 0, nullable: true, name: "is_depth_camera"})
    isDepthCamera: number;

    @Column({type: "jsonb", comment: "물체 너비 / 폭 / 높이 / 형태, 환경코드, 중앙점 거리값, 가속 X/Y/Z{    \"objectWidth\": 0.1240021,    \"objectLength\": 0.1285654,    \"objectHeight\": 0.1689597,    \"objectShape\": \"Ellipse\",    \"envCode\": \"Object_On_Horizontal_Plane\",    \"centerDepth\": 524.2222,    \"accelX\": 0.04507446,    \"accelY\": -0.8758545,    \"accelZ\": -0.4858856,}", nullable: true, name: "meta_data"})
    metaData: string;

    @Column("character varying", {comment: "depth origin 파일명", nullable: true, name: "depth_name"})
    depthName: string;

    @Column("character varying", {comment: "depth s3 키", nullable: true, name: "s3_key_depth"})
    s3KeyDepth: string;

    @Column("character varying", {comment: "confidence origin 파일명", nullable: true, name: "confidence_name"})
    confidenceName: string;

    @Column("character varying", {comment: "confidence s3 키", nullable: true, name: "s3_key_confidence"})
    s3KeyConfidence: string;

    @Column("character varying", {comment: "회원 아이디", nullable: true, name: "user_id"})
    userId: string;

    @Column("character varying", {comment: "사람이 직접 입력한 옳은 이름", nullable: true, name: "correct_name"})
    correctName: string;

    @Column("character varying", {comment: "머지웨어에서 생성된 Crab 이미지", nullable: true, name: "crop_img_url"})
    cropImgUrl: string;

    @ManyToOne(() => MgObject, (mgObject) => mgObject.mgoImages)
    @JoinColumn([{name: "mg_id", referencedColumnName: "mgId"}])
    mgo: MgObject[]
}
