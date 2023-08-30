import { IsNotEmpty } from "class-validator";


export class ChatDTO {
    @IsNotEmpty()
    message: string;
}