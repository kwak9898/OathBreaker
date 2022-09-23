import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
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
    comment: "사물 대 분류",
    nullable: true,
    name: "main_mg_category",
  })
  mainMgCategory?: string;

  @Column({
    type: "varchar",
    comment: "사물 중 분류",
    nullable: true,
    name: "medium_mg_category",
  })
  mediumMgCategory?: string;

  @Column({
    type: "varchar",
    comment: "사물 소 분류",
    nullable: true,
    name: "sub_mg_category",
  })
  subMgCategory?: string;

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

  @Column({ nullable: true })
  lastTransferTmp?: Date;

  @OneToMany(() => MgoImage, (mgoImage) => mgoImage.mgObject)
  mgoImages: MgoImage[];
}
