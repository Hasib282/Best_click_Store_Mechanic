import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CustomerEntity } from "../../customer/CustomerEntity/customer.entity";
import { MechanicEntity } from "./mechanic.entity";


@Entity('ChatLogs')
export class ChatEntity {
    @PrimaryGeneratedColumn()
    chat_id: number;

    @Column()
    message: string;

    @ManyToOne(() => MechanicEntity, mechanic => mechanic.sendmessage, { nullable: true })
    sendermechanic: MechanicEntity;

    @ManyToOne(() => CustomerEntity, customer => customer.sendmessage, { nullable: true })
    sendercustomer: CustomerEntity;

    @ManyToOne(() => MechanicEntity, mechanic => mechanic.receivemessage, { nullable: true })
    receivermechanic: MechanicEntity;

    @ManyToOne(() => CustomerEntity, customer => customer.receivemessage, { nullable: true })
    receivercustomer: CustomerEntity;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createDate: Date;

}