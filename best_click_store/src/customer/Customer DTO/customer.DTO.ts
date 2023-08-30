import { IsEmail, IsIn, IsNotEmpty, Matches } from "class-validator";




export class CustomerDTO {
    @Matches(/^[a-zA-Z][a-zA-Z\-\.\s]{2,150}$/, { message: "Name only contain a-z or A-Z or dot(.) or dash(-) and must start with a letter and atleast 2 charecter" })
    name: string;

    @IsEmail()
    email: string;

    @Matches(/^[0][1][3-9][0-9]{8}$/, { message: "Please enter a valid Phone number" })
    phone: string;

    @IsIn(['Male', 'Female', 'Others'])
    gender: string;

    @IsNotEmpty()
    address: string;

    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/, { message: "Password Must contain one upper letter,lower letter,digit and special character" })
    password: string;

    profilepic: string;
}


export class CustomerLoginDTO {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}



export class CustomerUpdateDTO {
    @Matches(/^[a-zA-Z][a-zA-Z\-\.\s]{2,150}$/, { message: "Name only contain a-z or A-Z or dot(.) or dash(-) and must start with a letter and atleast 2 charecter" })
    name: string;

    @Matches(/^[0][1][3-9][0-9]{8}$/, { message: "Please enter a valid Phone number" })
    phone: string;

    @IsIn(['Male', 'Female', 'Others'])
    gender: string;

    @IsNotEmpty()
    address: string;

}



export class CustomerUpdatePassDTO {
    @IsNotEmpty()
    old_password: string;
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/, { message: "Must contain one upper letter,lower letter,digit and special character" })
    new_password: string;
    @IsNotEmpty()
    confirm_password: string;

}