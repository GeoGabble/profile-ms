import { AbstractEntity } from "src/helper/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Connections extends AbstractEntity<Connections> {
    @PrimaryGeneratedColumn('increment')
    connection_id: number;

    @ManyToOne(()=>User, {onDelete: 'CASCADE'})
    @JoinColumn()
    user1_id: string;

    @ManyToOne(()=>User, {onDelete: 'CASCADE'})
    @JoinColumn()
    user2_id: string;

    @Column()
    status: number;
}
