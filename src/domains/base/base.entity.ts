import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class CreateOnlyEntity {
  @CreateDateColumn()
  createdAt: Date;
}

export abstract class DeleteBaseEntity extends CreateOnlyEntity {
  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}

export abstract class UpdateDeleteBaseEntity extends CreateOnlyEntity {
  @UpdateDateColumn()
  updatedAt?: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}

export abstract class BaseEntity {
  @CreateDateColumn({
    name: "created_at",
    comment: "생성일",
    type: "timestamp without time zone",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    comment: "수정일",
    type: "timestamp without time zone",
  })
  updatedAt?: Date;

  @DeleteDateColumn({
    name: "deleted_at",
    comment: "삭제일",
    nullable: true,
    type: "timestamp without time zone",
  })
  deletedAt?: Date;
}

export abstract class BaseFileEntity extends BaseEntity {
  @Column()
  fileName: string;

  signedUrl: string;
}
