import { IsNotEmpty } from "class-validator";


export class ServiceDTO {
    @IsNotEmpty()
    service_name: string;

    @IsNotEmpty()
    service_charge: number;
}