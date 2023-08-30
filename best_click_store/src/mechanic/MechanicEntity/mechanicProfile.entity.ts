import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MechanicEntity } from "./mechanic.entity";


@Entity('MechanicProfile')
export class MechanicProfileEntity{
    @PrimaryGeneratedColumn()
    mechanic_id: number;

    @Column()
    mechanic_password: string;

    @Column()
    mechanic_profilepic: string;

    @OneToOne(() => MechanicEntity, mechanic => mechanic.profile)
    mechanic: MechanicEntity;
}