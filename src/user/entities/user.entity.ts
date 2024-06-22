import { AbstractEntity } from "src/helper/abstract.entity";
import { Profile } from "src/profile/entities/profile.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Connections } from "./connections.entity";

@Entity()
export class User extends AbstractEntity<User> {
    @PrimaryColumn()
    user_id: string;

    @Column()
    username: string;

    @Column()
    avatar_hq_url: string;

    @Column()
    avatar_lq_url: string;

    @OneToOne(()=>Profile, (profile)=>profile.user, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    profile: Profile;

    @OneToMany(()=>Connections, (conn)=>conn.user1_id)
    connections1: Connections[];

    @OneToMany(()=>Connections, (conn)=>conn.user2_id)
    connections2: Connections[];
}
