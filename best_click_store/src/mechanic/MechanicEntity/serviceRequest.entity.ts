import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CustomerEntity } from "../../customer/CustomerEntity/customer.entity";
import { MechanicEntity } from "./mechanic.entity";
import { ServiceEntity } from "./service.entity";


@Entity('Service_Request')
export class ServiceRequestEntity {
    @PrimaryGeneratedColumn()
    request_id: number;

    @ManyToOne(() => MechanicEntity, mechanic => mechanic.request)
    mechanic: MechanicEntity;

    @ManyToOne(() => ServiceEntity, service => service.request)
    service: ServiceEntity;

    @ManyToOne(() => CustomerEntity, customer => customer.request)
    customer: CustomerEntity;

    @Column({ default: 'Pending' })
    status: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    request_date: Date;

}