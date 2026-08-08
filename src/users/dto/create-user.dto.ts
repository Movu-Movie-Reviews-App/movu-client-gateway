import { IsEmail, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    @Matches(/^(?=.*\p{L})[\p{L}0-9._-]{3,16}$/u, {
        message: 'Username must be 6–16 characters, contain at least one letter, and may include letters, numbers, dot (.), hyphen (-), or underscore (_).'
    })
    userName: string;

    @IsString()
    @IsOptional()
    avatarUrl?: string

}
