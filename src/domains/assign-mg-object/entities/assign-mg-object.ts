import { User } from "../../users/entities/user.entity";
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MgObject } from "../../mg-object/entities/mg-object.entity";

@Entity("assign_mg_object", { schema: "public" })
export class AssignMgObject extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => MgObject)
  @JoinColumn({ name: "mg_id" })
  mgObject: MgObject;
}
