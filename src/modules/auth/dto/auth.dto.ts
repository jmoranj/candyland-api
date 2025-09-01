import { IsNotEmpty, IsString } from "class-validator";

export class AuthDto{
    constructor() {
    console.log('AuthDto instanciado');
    }

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}