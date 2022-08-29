import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class MgObjectEntity {
    @PrimaryColumn({type: "varchar", comment: "사물 고유값"})
    mgId: string

    @Column({type: "varchar", comment: "사물 그룹 아이디"})
    mgGroupId: string

    @Column({type: "varchar", comment: "사물 이름"})
    mgName: string

    @Column({type: "smallint", comment: "상태값", default: 0})
    statusFlag: number

    @Column({type: "timestamptz", comment: "생성일", default: () => "CURRENT_TIMESTAMP"})
    createdAt: string

    @Column({type: "timestamptz", comment: "수정일", default: () => "CURRENT_TIMESTAMP"})
    updatedAt: string

    @Column({type: "timestamptz", comment: "삭제일"})
    deletedAt: string

    @Column({type: "varchar", comment: "사물 분류"})
    mgCategory: string

    @Column({type: "bigint", comment: "좋아요 개수", default: 0})
    likeCnt: number

    @Column({type: "int", comment: "좋아요 순위", default: 9999})
    likeRank: number

    @Column({type: "int", comment: "순위 변동", default: 0})
    rankChange: number
}
