import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from '../customer/CustomerEntity/customer.entity';
import { MechanicController } from './mechanic.controller';
import { MechanicService } from './mechanic.service';
import { ChatEntity } from './MechanicEntity/chat.entity';
import { MechanicEntity } from './MechanicEntity/mechanic.entity';
import { MechanicProfileEntity } from './MechanicEntity/mechanicProfile.entity';
import { ServiceEntity } from './MechanicEntity/service.entity';
import { ServiceRequestEntity } from './MechanicEntity/serviceRequest.entity';


@Module({
    imports: [TypeOrmModule.forFeature([MechanicEntity, MechanicProfileEntity, ServiceEntity, ChatEntity, CustomerEntity, ServiceRequestEntity]),
        ConfigModule.forRoot(),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 465,
                ignoreTLS: true,
                secure: true,
                auth: {
                    user: 'best.click.store282@gmail.com',
                    pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
                },
            }
        }),
    ],
    controllers: [MechanicController],
    providers: [MechanicService],
})
export class MechanicModule { }