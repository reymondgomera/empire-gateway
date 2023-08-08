import { IsNotEmpty } from 'class-validator'
import { IsEmail, IsString } from 'class-validator'

export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string

  @IsNotEmpty()
  @IsString()
  password!: string
}
