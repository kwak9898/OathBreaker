import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class MgObjectEntity {
    @PrimaryColumn({type: "varchar", comment: "사물 고유값"})
    mg_id: string

    @Column({type: "varchar", comment: "사물 그룹 아이디"})
    mg_group_id: string

    @Column({type: "varchar", comment: "사물 이름"})
    mg_name: string

    @Column({type: "smallint", comment: "상태값", default: 0})
    status_flag: number

    @Column({type: "timestamptz", comment: "생성일", default: () => "CURRENT_TIMESTAMP"})
    created_at: string

    @Column({type: "timestamptz", comment: "수정일", default: () => "CURRENT_TIMESTAMP"})
    updated_at: string

    @Column({type: "timestamptz", comment: "삭제일"})
    deleted_at: string

    @Column({type: "varchar", comment: "사물 분류"})
    mg_category: string

    @Column({type: "bigint", comment: "좋아요 개수", default: 0})
    like_cnt: number

    @Column({type: "int", comment: "좋아요 순위", default: 9999})
    like_rank: number

    @Column({type: "int", comment: "순위 변동", default: 0})
    rank_change: number
}
