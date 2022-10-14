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
  @CreateDateColumn()
  @Column("timestamp without time zone", {
    name: "created_at",
    comment: "생성일",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @UpdateDateColumn()
  @Column("timestamp without time zone", {
    name: "updated_at",
    comment: "수정일",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt?: Date;

  @DeleteDateColumn()
  @Column("timestamp without time zone", {
    name: "deleted_at",
    comment: "삭제일",
    nullable: true,
  })
  deletedAt?: Date;
}

export abstract class BaseFileEntity extends BaseEntity {
  @Column()
  fileName: string;

  signedUrl: string;
}
