import { IsEmail, IsIn, IsNotEmpty, Matches } from "class-validator";



export class MechanicDTO {
    @Matches(/^[a-zA-Z][a-zA-Z\-\.\s]{2,150}$/, { message: "Name only contain a-z or A-Z or dot(.) or dash(-) and must start with a letter and atleast 2 charecter" })
    mechanic_name: string;

    @IsEmail()
    mechanic_email: string;

    @Matches(/^[0][1][3-9][0-9]{8}$/, { message: "Please enter a valid Phone number" })
    mechanic_phone: string;

    @IsNotEmpty()
    mechanic_nid: string;

    @IsIn(['Male', 'Female', 'Others'])
    mechanic_gender: string;

    @IsNotEmpty()
    mechanic_address: string;

    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/, { message: "Password Must contain one upper letter,lower letter,digit and special character" })
    mechanic_password: string;

    mechanic_profilepic: string;

}

export class MechanicLoginDTO {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}


export class MechanicUpdateDTO {
    @Matches(/^[a-zA-Z][a-zA-Z\-\.\s]{2,150}$/, { message: "Only contain a-z or A-Z or dot(.) or dash(-) and must start with a letter and atleast 2 charecter" })
    mechanic_name: string;

    @IsNotEmpty()
    mechanic_nid: string;


    @Matches(/^[0][1][3-9][0-9]{8}$/, { message: "Invalid Phone number" })
    mechanic_phone: string;


    @IsIn(['Male', 'Female', 'Others'])
    mechanic_gender: string;

    @IsNotEmpty()
    mechanic_address: string;

}





export class MechanicUpdatePassDTO {
    @IsNotEmpty()
    old_password: string;
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/, { message: "Must contain one upper letter,lower letter,digit and special character" })
    new_password: string;
    @IsNotEmpty()
    confirm_password: string;

}

export class MechanicForgetPasswordDTO {
    @IsNotEmpty()
    pin: string;
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/, { message: "Must contain one upper letter,lower letter,digit and special character" })
    new_password: string;
    @IsNotEmpty()
    confirm_password: string;
}
