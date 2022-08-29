import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class MgImageEntity {
    @PrimaryColumn({type: "varchar", comment: "이미지 고유값", nullable: false})
    imgId: string;

    @Column({type: "varchar", comment: "사물 고유값"})
    mgId: string;

    @Column({type: "varchar", comment: "이미지 파일명"})
    imgName: string;

    @Column({type: "varchar", comment: "이미지 url"})
    imgUrl: string;

    @Column({type: "varchar", comment: "이미지 s3 key"})
    s3Key: string;

    @Column({type: "smallint", comment: "사물 이미지 상태값", default: 1})
    statusFlag: number;

    @Column({type: "timestamptz", comment: "생성일", default: () => "CURRENT_TIMESTAMP"})
    createdAt: string;

    @Column({type: "timestamptz", comment: "수정일", default: () => "CURRENT_TIMESTAMP"})
    updatedAt: string;

    @Column({type: "timestamptz", comment: "삭제일"})
    deletedAt: string;

    @Column({type: "varchar", comment: "등록자 타입: MANAGER_USER, MERGE_USER", default: "MERGE_USER"})
    userType: string;

    @Column({type: "double", comment: "위도(37.56667)", default: 0})
    latitude: number;

    @Column({type: "double", comment: "경도(126.97806)", default: 0})
    longitube: number;

    @Column({type: "varchar", comment: "mask origin name"})
    maskName: string;

    @Column({type: "varchar", comment: "mask s3 키"})
    s3KeyMask: string;

    @Column({type: "varchar", comment: "sallency origin name"})
    sallencyName: string;

    @Column({type: "varchar", comment: "sallency s3 키"})
    s3KeySallency: string;

    @Column({type: "smallint", comment: "depth_camera(Lidar) 사용 여부 미사용: 0iOS Lidar 사용: 1", default: 1})
    isDepthCamera: number;

    @Column({type: "jsonb", comment: "물체 너비 / 폭 / 높이 / 형태, 환경코드, 중앙점 거리값, 가속 X/Y/Z{    \"objectWidth\": 0.1240021,    \"objectLength\": 0.1285654,    \"objectHeight\": 0.1689597,    \"objectShape\": \"Ellipse\",    \"envCode\": \"Object_On_Horizontal_Plane\",    \"centerDepth\": 524.2222,    \"accelX\": 0.04507446,    \"accelY\": -0.8758545,    \"accelZ\": -0.4858856,}"})
    metaData: string;

    @Column({type: "varchar", comment: "depth origin 파일명"})
    depthName: string;

    @Column({type: "varchar", comment: "depth s3 키"})
    s3KeyDepth: string;

    @Column({type: "varchar", comment: "confidence origin 파일명"})
    confidenceName: string;

    @Column({type: "varchar", comment: "confidence s3 키"})
    s3KeyConfidence: string;

    @Column({type: "varchar", comment: "회원 아이디"})
    userId: string;

    @Column({type: "varchar", comment: "사람이 직접 입력한 옳은 이름"})
    correctName: string;

    @Column({type: "varchar", comment: "머지웨어에서 생성된 Crab 이미지"})
    cropImgUrl: string;
}
