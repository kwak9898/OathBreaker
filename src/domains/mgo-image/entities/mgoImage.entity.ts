import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { MgObject } from "../../mg-object/entities/mg-object.entity";
import { BaseEntity } from "../../base/base.entity";

@Entity("mgo_image", { schema: "public" })
export class MgoImage extends BaseEntity {
  /**
   * 이미지 고유값
   */
  @PrimaryColumn("character varying", {
    comment: "이미지 고유값",
    nullable: false,
    name: "img_id",
  })
  imgId: string;

  /**
   * 사물 고유값
   */
  @Column("character varying", {
    comment: "사물 고유값",
    nullable: true,
    name: "mg_id",
  })
  mgId?: string;

  /**
   * 이미지 파일명
   */
  @Column("character varying", {
    comment: "이미지 파일명",
    nullable: true,
    name: "img_name",
  })
  imgName?: string;

  /**
   * 이미지 url
   */
  @Column("character varying", {
    comment: "이미지 url",
    nullable: true,
    name: "img_url",
  })
  imgUrl?: string;

  /**
   * 이미지 s3 key
   */
  @Column("character varying", {
    comment: "이미지 s3 key",
    nullable: true,
    name: "s3_key",
  })
  s3Key?: string;

  /**
   * 사물 이미지 상태값
   */
  @Column({
    type: "smallint",
    comment: "사물 이미지 상태값",
    default: 0,
    nullable: true,
    name: "status_flag",
  })
  statusFlag?: ImageStatusFlag;

  /**
   * 등록자 타입: MANAGER_USER, MERGE_USER
   */
  @Column("character varying", {
    comment: "등록자 타입: MANAGER_USER, MERGE_USER",
    default: "MERGE_USER",
    nullable: true,
    name: "user_type",
  })
  userType?: string;

  /**
   * 위도(37.56667)
   */
  @Column("double precision", {
    comment: "위도(37.56667)",
    default: 0.0,
    nullable: true,
    name: "latitude",
  })
  latitude?: number;

  /**
   * 경도(126.97806)
   */
  @Column("double precision", {
    comment: "경도(126.97806)",
    default: 0.0,
    nullable: true,
    name: "longitude",
  })
  longitude?: number;

  /**
   * mask origin name
   */
  @Column("character varying", {
    comment: "mask origin name",
    nullable: true,
    name: "mask_name",
  })
  maskName?: string;

  /**
   * mask s3 키
   */
  @Column("character varying", {
    comment: "mask s3 키",
    nullable: true,
    name: "s3_key_mask",
  })
  s3KeyMask?: string;

  /**
   * sallency origin name
   */
  @Column("character varying", {
    comment: "sallency origin name",
    nullable: true,
    name: "sailency_name",
  })
  sailencyName?: string;

  /**
   * sallency s3 키
   */
  @Column("character varying", {
    comment: "sallency s3 키",
    nullable: true,
    name: "s3_key_sailency",
  })
  s3KeySailency?: string;

  /**
   * depth_camera(Lidar) 사용 여부 미사용: 0iOS Lidar 사용: 1
   */
  @Column({
    type: "smallint",
    comment: "depth_camera(Lidar) 사용 여부 미사용: 0iOS Lidar 사용: 1",
    default: 0,
    nullable: true,
    name: "is_depth_camera",
  })
  isDepthCamera?: number;

  @Column({
    type: "jsonb",
    comment:
      '물체 너비 / 폭 / 높이 / 형태, 환경코드, 중앙점 거리값, 가속 X/Y/Z{    "objectWidth": 0.1240021,    "objectLength": 0.1285654,    "objectHeight": 0.1689597,    "objectShape": "Ellipse",    "envCode": "Object_On_Horizontal_Plane",    "centerDepth": 524.2222,    "accelX": 0.04507446,    "accelY": -0.8758545,    "accelZ": -0.4858856,}',
    nullable: true,
    name: "meta_data",
  })
  metaData?: string;

  @Column("character varying", {
    comment: "depth origin 파일명",
    nullable: true,
    name: "depth_name",
  })
  depthName?: string;

  @Column("character varying", {
    comment: "depth s3 키",
    nullable: true,
    name: "s3_key_depth",
  })
  s3KeyDepth?: string;

  @Column("character varying", {
    comment: "confidence origin 파일명",
    nullable: true,
    name: "confidence_name",
  })
  confidenceName?: string;

  @Column("character varying", {
    comment: "confidence s3 키",
    nullable: true,
    name: "s3_key_confidence",
  })
  s3KeyConfidence?: string;

  @Column("character varying", {
    comment: "회원 아이디",
    nullable: true,
    name: "user_id",
  })
  userId?: string;

  @Column("character varying", {
    comment: "사람이 직접 입력한 옳은 이름",
    nullable: true,
    name: "correct_name",
  })
  correctName?: string;

  @Column("character varying", {
    comment: "머지웨어에서 생성된 Crab 이미지",
    nullable: true,
    name: "crop_img_url",
  })
  cropImgUrl?: string;

  @ManyToOne(() => MgObject, (mgObject) => mgObject.mgoImages, {
    nullable: true,
  })
  @JoinColumn([{ name: "mg_id", referencedColumnName: "mgId" }])
  mgObject?: MgObject;

  isErrorImage: boolean;
}

export enum ImageStatusFlag {
  INCOMPLETE_AND_COMPLETE = -1,
  UNCOMPLETED = 0,
  COMPLETED = 1,
  TEMP = 2,
  OTHER = 3,
}
