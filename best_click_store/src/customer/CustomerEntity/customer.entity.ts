import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatEntity } from "../../mechanic/MechanicEntity/chat.entity";
import { ServiceRequestEntity } from "../../mechanic/MechanicEntity/serviceRequest.entity";


@Entity('Customer')
export class CustomerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    phone: string;

    @Column()
    gender: string;

    @Column()
    address: string;

    @Column()
    password: string;

    @Column()
    profilepic: string;

    @OneToMany(() => ServiceRequestEntity, request => request.customer, { cascade: true })
    request: ServiceRequestEntity;

    @OneToMany(() => ChatEntity, chat => chat.sendercustomer, { cascade: true })
    sendmessage: ChatEntity;

    @OneToMany(() => ChatEntity, chat => chat.receivercustomer, { cascade: true })
    receivemessage: ChatEntity;

    
}