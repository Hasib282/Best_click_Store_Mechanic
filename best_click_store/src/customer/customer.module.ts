import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatEntity } from "../mechanic/MechanicEntity/chat.entity";
import { MechanicEntity } from "../mechanic/MechanicEntity/mechanic.entity";
import { ServiceEntity } from "../mechanic/MechanicEntity/service.entity";
import { ServiceRequestEntity } from "../mechanic/MechanicEntity/serviceRequest.entity";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import { CustomerEntity } from "./CustomerEntity/customer.entity";




@Module({
    imports: [TypeOrmModule.forFeature([CustomerEntity, MechanicEntity, ServiceRequestEntity, ChatEntity])],
    controllers: [CustomerController],
    providers: [CustomerService],
})
export class CustomerModule { }