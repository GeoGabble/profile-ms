import { Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {AbstractEntity} from "../../helper/abstract.entity";
import { User } from "src/user/entities/user.entity";

@Entity()
export class Profile extends AbstractEntity<Profile> {
    @PrimaryColumn()
    user_id : string;

    @Column()
    description : string;

    @CreateDateColumn()
    date_joined : Date;

    @Column()
    location : string;

    @Column()
    dob: string;

    @Column()
    gender : string;

    @UpdateDateColumn()
    last_updated : Date;

    @Column({default: 0})
    total_connections: number;

    @OneToOne(()=>User, (user)=>user.profile, {cascade: true})
    user: User;
}
