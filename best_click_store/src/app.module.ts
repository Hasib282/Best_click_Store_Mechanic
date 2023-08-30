import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { MechanicModule } from './mechanic/mechanic.module';


@Module({
    imports: [
        ConfigModule.forRoot(),
        MechanicModule, CustomerModule, TypeOrmModule.forRoot(
            {
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: process.env.NEXT_PUBLIC_DATABASE_PASS,
                database: 'best_click_store',
                autoLoadEntities: true,
                synchronize: true,
            }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
