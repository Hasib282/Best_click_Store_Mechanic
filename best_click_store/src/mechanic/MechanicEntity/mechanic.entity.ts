import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatEntity } from "./chat.entity";
import { MechanicProfileEntity } from "./mechanicProfile.entity";
import { ServiceEntity } from "./service.entity";
import { ServiceRequestEntity } from "./serviceRequest.entity";



@Entity('Mechanic')
export class MechanicEntity {
    @PrimaryGeneratedColumn()
    mechanic_id: number;

    @Column({ type: "varchar", length: 250 })
    mechanic_name: string;

    @Column({ type: "varchar", length: 256, unique: true })
    mechanic_email: string;

    @Column({ type: "varchar", unique: true })
    mechanic_phone: string;

    @Column({ type: "varchar", unique: true })
    mechanic_nid: string;

    @Column()
    mechanic_gender: string;

    @Column({ type: "varchar", length: 255 })
    mechanic_address: string;

    @OneToOne(() => MechanicProfileEntity, profile => profile.mechanic, { cascade: true })
    @JoinColumn()
    profile: MechanicProfileEntity;

    @ManyToMany(() => ServiceEntity, service => service.mechanics)
    @JoinTable({
        name: 'Mechanic_Services',
        joinColumn: {
            name: 'mechanic_id',
            referencedColumnName: 'mechanic_id',
        },
        inverseJoinColumn: {
            name: 'service_id',
            referencedColumnName: 'service_id',
        },
    })
    services: ServiceEntity[];

    @OneToMany(() => ServiceRequestEntity, request => request.mechanic, { cascade: true })
    request: ServiceRequestEntity;

    @OneToMany(() => ChatEntity, chat => chat.sendermechanic, { cascade: true })
    sendmessage: ChatEntity;

    @OneToMany(() => ChatEntity, chat => chat.receivermechanic, { cascade: true })
    receivemessage: ChatEntity;

}