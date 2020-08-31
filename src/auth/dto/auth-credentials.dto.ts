import { IsString, MinLength, MaxLength, Matches, IsArray, IsInt, IsNumber, IsOptional } from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        { message: 'password too weak' })
    password: string; 
 
    @IsNumber()
    id:number

}