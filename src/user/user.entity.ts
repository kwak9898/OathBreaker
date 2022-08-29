import {Entity, Column, PrimaryColumn} from 'typeorm';

@Entity()
export class UserEntity {
    @PrimaryColumn()
    id: string;

    @Column()
    password: string;
}
