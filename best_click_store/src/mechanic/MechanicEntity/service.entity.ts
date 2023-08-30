import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MechanicEntity } from "./mechanic.entity";
import { ServiceRequestEntity } from "./serviceRequest.entity";


@Entity('Services')
export class ServiceEntity {
    @PrimaryGeneratedColumn()
    service_id: number;

    @Column()
    service_name: string;

    @Column({ type: "float" })
    service_charge: number;

    @ManyToMany(() => MechanicEntity, mechanic => mechanic.services)
    mechanics: MechanicEntity[];

    @OneToMany(() => ServiceRequestEntity, request => request.service, { cascade: true })
    request: ServiceRequestEntity;
}