import {Entity, PrimaryColumn, Column} from "typeorm";

@Entity()
export class MgimageEntity {
    @PrimaryColumn()
    mg_id : string

    @Column()
    mg_object : string

    @Column()
    mgo_image : string

    @Column({type: "enum", enum: ["대분류", "중분류", "소분류"]})
    tag : string
}
