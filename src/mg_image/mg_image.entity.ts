import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class MgImageEntity {
    @PrimaryColumn({type: "varchar", comment: "이미지 고유값", nullable: false})
    img_id: string;

    @Column({type: "varchar", comment: "사물 고유값"})
    mg_id: string;

    @Column({type: "varchar", comment: "이미지 파일명"})
    img_name: string;

    @Column({type: "varchar", comment: "이미지 url"})
    img_url: string;

    @Column({type: "varchar", comment: "이미지 s3 key"})
    s3_key: string;

    @Column({type: "smallint", comment: "사물 이미지 상태값", default: 1})
    status_flag: number;

    @Column({type: "timestamptz", comment: "생성일", default: () => "CURRENT_TIMESTAMP"})
    created_at: string;

    @Column({type: "timestamptz", comment: "수정일", default: () => "CURRENT_TIMESTAMP"})
    updated_at: string;

    @Column({type: "timestamptz", comment: "삭제일"})
    deleted_at: string;

    @Column({type: "varchar", comment: "등록자 타입: MANAGER_USER, MERGE_USER", default: "MERGE_USER"})
    user_type: string;

    @Column({type: "double", comment: "위도(37.56667)", default: 0})
    latitude: number;

    @Column({type: "double", comment: "경도(126.97806)", default: 0})
    longitube: number;

    @Column({type: "varchar", comment: "mask origin name"})
    mask_name: string;

    @Column({type: "varchar", comment: "mask s3 키"})
    s3_key_mask: string;

    @Column({type: "varchar", comment: "sallency origin name"})
    sallency_name: string;

    @Column({type: "varchar", comment: "sallency s3 키"})
    s3_key_sallency: string;

    @Column({type: "smallint", comment: "depth_camera(Lidar) 사용 여부 미사용: 0iOS Lidar 사용: 1", default: 1})
    is_depth_camera: number;

    @Column({type: "jsonb", comment: "물체 너비 / 폭 / 높이 / 형태, 환경코드, 중앙점 거리값, 가속 X/Y/Z{    \"objectWidth\": 0.1240021,    \"objectLength\": 0.1285654,    \"objectHeight\": 0.1689597,    \"objectShape\": \"Ellipse\",    \"envCode\": \"Object_On_Horizontal_Plane\",    \"centerDepth\": 524.2222,    \"accelX\": 0.04507446,    \"accelY\": -0.8758545,    \"accelZ\": -0.4858856,}"})
    meta_data: string;

    @Column({type: "varchar", comment: "depth origin 파일명"})
    depth_name: string;

    @Column({type: "varchar", comment: "depth s3 키"})
    s3_key_depth: string;

    @Column({type: "varchar", comment: "confidence origin 파일명"})
    confidence_name: string;

    @Column({type: "varchar", comment: "confidence s3 키"})
    s3_key_confidence: string;

    @Column({type: "varchar", comment: "회원 아이디"})
    user_id: string;

    @Column({type: "varchar", comment: "사람이 직접 입력한 옳은 이름"})
    correct_name: string;

    @Column({type: "varchar", comment: "머지웨어에서 생성된 Crab 이미지"})
    crop_img_url: string;
}
