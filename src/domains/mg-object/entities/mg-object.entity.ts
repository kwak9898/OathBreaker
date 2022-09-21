import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { MgoImage } from "../../mgo-image/entities/mgoImage.entity";
import { BaseEntity } from "../../base/base.entity";

@Entity("mg_object", { schema: "public" })
export class MgObject extends BaseEntity {
  @PrimaryColumn("character varying", { comment: "사물 고유값", name: "mg_id" })
  mgId: string;

  @Column("character varying", {
    comment: "사물 그룹 아이디",
    name: "mg_group_id",
    nullable: true,
  })
  mgGroupId?: string;

  @Column({
    type: "varchar",
    comment: "사물 이름",
    name: "mg_name",
    nullable: true,
  })
  mgName?: string;

  @Column({
    type: "smallint",
    comment: "상태값",
    name: "status_flag",
    nullable: true,
    default: 0,
  })
  statusFlag?: number;

  @Column({
    type: "varchar",
    comment: "사물 분류",
    nullable: true,
    name: "mg_category",
  })
  mgCategory?: string;

  @Column({
    type: "bigint",
    comment: "좋아요 개수",
    name: "like_cnt",
    default: 0,
  })
  likeCnt: bigint;

  @Column({
    type: "int",
    comment: "좋아요 순위",
    default: 9999,
    name: "like_rank",
    nullable: true,
  })
  likeRank?: number;

  @Column({
    type: "int",
    comment: "순위 변동",
    default: 0,
    name: "rank_change",
    nullable: true,
  })
  rankChange?: number;

  @OneToMany(() => MgoImage, (mgoImage) => mgoImage.mgo)
  mgoImages: MgoImage[];
}
