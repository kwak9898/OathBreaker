import { Entity, PrimaryColumn, Column, Index, OneToMany } from "typeorm";
import { MgoImage } from "./mgoImage.entity";

@Index("mg_object_mg_id_uindex", ["mgId"], { unique: true })
@Index("mg_object_pk", ["mgId"], { unique: true })
@Entity("mgobject", { schema: "public" })
export class MgObject {
  @PrimaryColumn("character varying", { comment: "사물 고유값", name: "mg_id" })
  mgId: string;

  @Column("character varying", {
    comment: "사물 그룹 아이디",
    name: "mg_group_id",
  })
  mgGroupId: string;

  @Column({
    type: "varchar",
    comment: "사물 이름",
    name: "mg_name",
    nullable: true,
  })
  mgName: string | null;

  @Column({
    type: "smallint",
    comment: "상태값",
    default: () => 0,
    name: "status_flag",
    nullable: true,
  })
  statusFlag: number | null;

  @Column("timestamp without time zone", {
    comment: "생성일",
    default: () => "CURRENT_TIMESTAMP",
    name: "created_at",
    nullable: true,
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", {
    comment: "수정일",
    default: () => "CURRENT_TIMESTAMP",
    name: "updated_at",
    nullable: true,
  })
  updatedAt: Date | null;

  @Column("timestamp without time zone", {
    comment: "삭제일",
    nullable: true,
    name: "deleted_at",
  })
  deletedAt: Date | null;

  @Column({
    type: "varchar",
    comment: "사물 분류",
    nullable: true,
    name: "mg_category",
  })
  mgCategory: string | null;

  @Column({
    type: "bigint",
    comment: "좋아요 개수",
    default: () => 0,
    name: "like_cnt",
    nullable: true,
  })
  likeCnt: bigint | null;

  @Column({
    type: "int",
    comment: "좋아요 순위",
    default: 9999,
    name: "like_rank",
    nullable: true,
  })
  likeRank: number | null;

  @Column({
    type: "int",
    comment: "순위 변동",
    default: 0,
    name: "rank_change",
    nullable: true,
  })
  rankChange: number | null;

  @OneToMany(() => MgoImage, (mgoImage) => mgoImage.mgo)
  mgoImages: MgoImage[];
}
